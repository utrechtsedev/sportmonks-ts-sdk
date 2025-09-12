export type ErrorType = 'AUTH_ERROR' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'CLIENT_ERROR' | 'RATE_LIMIT_ERROR'

/**
 * SportMonks API Error class
 */
export class SportMonksError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiMessage?: string,
    public errors?: Record<string, unknown>,
    public errorType?: ErrorType,
  ) {
    super(message)
    this.name = 'SportMonksError'
  }

  /**
   * Check if this is a network/connection error
   */
  isNetworkError(): boolean {
    return this.errorType === 'NETWORK_ERROR'
  }

  /**
   * Check if this is an authentication error
   */
  isAuthError(): boolean {
    return this.errorType === 'AUTH_ERROR'
  }

  /**
   * Check if this is a rate limit error
   */
  isRateLimitError(): boolean {
    return this.errorType === 'RATE_LIMIT_ERROR'
  }

  /**
   * Get a user-friendly error message
   */
  getUserMessage(): string {
    switch (this.errorType) {
      case 'AUTH_ERROR':
        return 'Authentication failed. Please check your API key is valid and has the necessary permissions.'
      case 'NETWORK_ERROR':
        return 'Unable to connect to SportMonks API. Please check your network connection.'
      case 'RATE_LIMIT_ERROR':
        return 'API rate limit exceeded. Please wait before making more requests.'
      case 'SERVER_ERROR':
        return 'SportMonks API server error. Please try again later.'
      case 'CLIENT_ERROR':
        return this.message
      default:
        return 'An unexpected error occurred.'
    }
  }
}
