/**
 * Validation utilities for the SportMonks SDK
 */

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`)
  }

  // Additional validation to ensure it's a valid date
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${date}`)
  }
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: string, endDate: string): void {
  validateDateFormat(startDate)
  validateDateFormat(endDate)

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start > end) {
    throw new Error(`Invalid date range: start date (${startDate}) is after end date (${endDate})`)
  }

  // Check if range is too large (more than 1 year)
  const oneYear = 365 * 24 * 60 * 60 * 1000
  if (end.getTime() - start.getTime() > oneYear) {
    throw new Error('Date range cannot exceed 1 year')
  }
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided')
  }

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday(): string {
  return formatDate(new Date())
}

/**
 * Get date N days from now
 */
export function getDaysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

/**
 * Get date N days ago
 */
export function getDaysAgo(days: number): string {
  return getDaysFromNow(-days)
}

/**
 * Validate numeric ID
 */
export function validateId(id: string | number, name: string = 'ID'): number {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id

  if (isNaN(numId) || numId <= 0) {
    throw new Error(`Invalid ${name}: ${id}. Must be a positive number`)
  }

  return numId
}

/**
 * Validate array of IDs
 */
export function validateIds(ids: (string | number)[], name: string = 'IDs'): number[] {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error(`${name} must be a non-empty array`)
  }

  return ids.map((id, index) => {
    try {
      return validateId(id, `${name}[${index}]`)
    } catch {
      throw new Error(`Invalid ${name}[${index}]: ${id}`)
    }
  })
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string, minLength: number = 3): string {
  if (typeof query !== 'string') {
    throw new Error('Search query must be a string')
  }

  const trimmed = query.trim()

  if (trimmed.length === 0) {
    throw new Error('Invalid search query')
  }

  if (trimmed.length < minLength) {
    throw new Error(`Search query must be at least ${minLength} characters`)
  }

  return trimmed
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: number, perPage?: number): void {
  if (page !== undefined) {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error('Page must be a positive integer')
    }
  }

  if (perPage !== undefined) {
    if (!Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
      throw new Error('Per page must be an integer between 1 and 100')
    }
  }
}

/**
 * Validate enum value
 */
export function validateEnum<T extends Record<string, unknown>>(
  value: unknown,
  enumObject: T,
  name: string,
): T[keyof T] {
  const values = Object.values(enumObject)

  if (!values.includes(value)) {
    throw new Error(`Invalid ${name}: ${String(value)}. Must be one of: ${values.join(', ')}`)
  }

  return value as T[keyof T]
}

/**
 * Sanitize string for use in URLs
 */
export function sanitizeUrlParam(param: string): string {
  return encodeURIComponent(param.trim())
}

/**
 * Parse and validate JSON response
 */
export function parseJsonSafely<T>(json: string): T {
  try {
    return JSON.parse(json) as T
  } catch {
    throw new Error('Invalid JSON response from API')
  }
}
