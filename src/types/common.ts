/**
 * Retry configuration options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number
  /** Initial delay between retries in milliseconds */
  retryDelay?: number
  /** Maximum delay between retries in milliseconds */
  maxRetryDelay?: number
  /** Whether to retry on rate limit errors (429) */
  retryOnRateLimit?: boolean
  /** Status codes to retry on */
  retryStatusCodes?: number[]
}

/**
 * Configuration options for the SportMonks client
 */
export interface SportMonksClientOptions {
  /** Base URL for API requests */
  baseUrl?: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** API version */
  version?: string
  /** Include query parameter separator */
  includeSeparator?: string
  /** Retry configuration */
  retry?: RetryOptions
}

/**
 * Pagination information returned by the API
 */
export interface Pagination {
  count: number
  per_page: number
  current_page: number
  next_page: number | null
  has_more: boolean
}

/**
 * Rate limit information
 */
export interface RateLimit {
  resets_in_seconds: number
  remaining: number
  requested_entity: string
}

/**
 * Subscription plan details
 */
export interface SubscriptionPlan {
  plan: string
  sport: string
  category: string
}

/**
 * Subscription information
 */
export interface Subscription {
  meta: unknown[]
  plans: SubscriptionPlan[]
  add_ons: unknown[]
  widgets: unknown[]
}

/**
 * Generic paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination?: Pagination
  subscription?: Subscription
  rate_limit?: RateLimit
  timezone?: string
}

/**
 * Generic single item response interface
 */
export interface SingleResponse<T> {
  data: T
  subscription?: Subscription
  rate_limit?: RateLimit
  timezone?: string
}

/**
 * Query parameters supported by most endpoints
 */
export interface QueryParameters {
  include?: string
  filters?: string
  select?: string
  order?: string
  has?: string
  page?: number
  limit?: number
  per_page?: number
  [key: string]: string | number | boolean | undefined
}
