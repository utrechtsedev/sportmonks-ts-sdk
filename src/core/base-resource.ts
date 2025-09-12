import axios, { AxiosInstance } from 'axios'
import { SportMonksError, ErrorType } from './errors'
import { QueryParameters, RetryOptions } from '../types/common'

/**
 * Base resource class that all resource-specific classes extend
 */
export abstract class BaseResource {
  protected client: AxiosInstance
  protected basePath: string
  protected includeSeparator: string
  protected retryOptions: RetryOptions

  constructor(
    client: AxiosInstance,
    basePath: string,
    includeSeparator: string = ';',
    retryOptions: RetryOptions = {},
  ) {
    this.client = client
    this.basePath = basePath
    this.includeSeparator = includeSeparator
    this.retryOptions = {
      maxRetries: retryOptions.maxRetries || 0,
      retryDelay: retryOptions.retryDelay || 1000,
      maxRetryDelay: retryOptions.maxRetryDelay || 30000,
      retryOnRateLimit: retryOptions.retryOnRateLimit ?? true,
      retryStatusCodes: retryOptions.retryStatusCodes || [502, 503, 504],
    }
  }

  /**
   * Make a request to the API with optional retry logic
   */
  protected async request<T>(endpoint: string, params: QueryParameters = {}): Promise<T> {
    const url = `${this.basePath}${endpoint}`
    let lastError: unknown

    for (let attempt = 0; attempt <= this.retryOptions.maxRetries!; attempt++) {
      try {
        const response = await this.client.get(url, { params })

        // The API returns rate_limit and subscription info in the response body
        // No need to parse headers or enhance the response

        return response.data as T
      } catch (error) {
        lastError = error

        if (!this.shouldRetry(error, attempt)) {
          throw this.handleError(error, url)
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.retryOptions.retryDelay! * Math.pow(2, attempt),
          this.retryOptions.maxRetryDelay!,
        )

        // If it's a rate limit error, use the reset time if available
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          const responseData = error.response.data as Record<string, unknown> | undefined
          const rateLimit = responseData?.rate_limit as Record<string, unknown> | undefined
          const resetIn = rateLimit?.resets_in_seconds as number | undefined
          if (resetIn) {
            await this.sleep(resetIn * 1000)
            continue
          }
        }

        await this.sleep(delay)
      }
    }

    throw this.handleError(lastError, url)
  }

  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= this.retryOptions.maxRetries!) {
      return false
    }

    if (!axios.isAxiosError(error)) {
      return false
    }

    const status = error.response?.status
    if (!status) {
      // Network errors should be retried
      return true
    }

    // Check rate limit retry
    if (status === 429 && this.retryOptions.retryOnRateLimit) {
      return true
    }

    // Check other status codes
    return this.retryOptions.retryStatusCodes!.includes(status)
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: unknown, url: string): SportMonksError {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as Record<string, unknown> | undefined
      const status = error.response?.status
      let errorType: ErrorType | undefined

      // Network errors (no response)
      if (!error.response) {
        errorType = 'NETWORK_ERROR'
        let message = 'Network error'
        
        if (error.code === 'ECONNREFUSED') {
          message = 'Connection refused. The server may be down or unreachable.'
        } else if (error.code === 'ENOTFOUND') {
          message = 'Server not found. Please check the API URL.'
        } else if (error.code === 'ETIMEDOUT') {
          message = 'Request timeout. The server is not responding.'
        } else if (error.message) {
          message = `Network error: ${error.message}`
        }
        
        return new SportMonksError(message, undefined, undefined, undefined, errorType)
      }

      // HTTP errors with response
      let message = (errorData?.message as string) || error.message
      
      if (status === 401 || status === 403) {
        errorType = 'AUTH_ERROR'
        message = (errorData?.message as string) || 'Authentication failed. Invalid or missing API key.'
      } else if (status === 404) {
        errorType = 'CLIENT_ERROR'
        message = (errorData?.message as string) || `Resource not found: ${url}`
      } else if (status === 429) {
        errorType = 'RATE_LIMIT_ERROR'
        const rateLimit = errorData?.rate_limit as Record<string, unknown> | undefined
        const resetIn = rateLimit?.resets_in_seconds as number | undefined
        message = resetIn
          ? `Rate limit exceeded. Resets in ${resetIn} seconds.`
          : 'Rate limit exceeded. Please wait before making more requests.'
      } else if (status && status >= 500) {
        errorType = 'SERVER_ERROR'
        message = (errorData?.message as string) || 'Server error. Please try again later.'
      } else if (status && status >= 400) {
        errorType = 'CLIENT_ERROR'
      }

      return new SportMonksError(
        message,
        status,
        errorData?.message as string | undefined,
        errorData?.errors as Record<string, unknown> | undefined,
        errorType,
      )
    }

    return new SportMonksError(
      (error as Error).message || 'Unknown error occurred',
      undefined,
      undefined,
      undefined,
      'CLIENT_ERROR',
    )
  }

  /**
   * Sleep for a specified number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
