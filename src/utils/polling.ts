import { PaginatedResponse } from '../types'

/**
 * Options for polling configuration
 */
export interface PollingOptions {
  /** Interval between polls in milliseconds */
  interval: number
  /** Maximum duration to poll in milliseconds */
  maxDuration?: number
  /** Callback when new data is received */
  onData?: (data: unknown) => void
  /** Callback when an error occurs */
  onError?: (error: Error) => void
  /** Whether to stop on error */
  stopOnError?: boolean
  /** Compare function to detect changes */
  compareFunction?: (oldData: unknown, newData: unknown) => boolean
}

/**
 * Polling utility for real-time data updates
 */
export class Poller<T> {
  private intervalId?: ReturnType<typeof setInterval>
  private startTime?: number
  private lastData?: T
  private isPolling = false

  constructor(
    private fetchFunction: () => Promise<T>,
    private options: PollingOptions,
  ) {}

  /**
   * Start polling
   */
  start(): void {
    if (this.isPolling) {
      throw new Error('Polling is already active')
    }

    this.isPolling = true
    this.startTime = Date.now()

    // Fetch immediately
    void this.fetch()

    // Set up interval
    this.intervalId = setInterval(() => {
      // Check max duration
      if (this.options.maxDuration && this.startTime) {
        const elapsed = Date.now() - this.startTime
        if (elapsed >= this.options.maxDuration) {
          this.stop()
          return
        }
      }

      void this.fetch()
    }, this.options.interval)
  }

  /**
   * Stop polling
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.isPolling = false
  }

  /**
   * Check if currently polling
   */
  isActive(): boolean {
    return this.isPolling
  }

  /**
   * Fetch data and handle callbacks
   */
  private async fetch(): Promise<void> {
    try {
      const data = await this.fetchFunction()

      // Check if data has changed
      const hasChanged = this.hasDataChanged(data)

      if (hasChanged && this.options.onData) {
        this.options.onData(data)
      }

      this.lastData = data
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error as Error)
      }

      if (this.options.stopOnError) {
        this.stop()
      }
    }
  }

  /**
   * Check if data has changed
   */
  private hasDataChanged(newData: T): boolean {
    if (!this.lastData) {
      return true
    }

    if (this.options.compareFunction) {
      return this.options.compareFunction(this.lastData, newData)
    }

    // Default comparison for paginated responses
    if (this.isPaginatedResponse(newData) && this.isPaginatedResponse(this.lastData)) {
      // Compare by IDs
      const oldIds = new Set(this.lastData.data.map((item: unknown) => (item as { id: number }).id))
      const newIds = new Set(newData.data.map((item: unknown) => (item as { id: number }).id))

      // Check if any new items
      for (const id of newIds) {
        if (!oldIds.has(id)) {
          return true
        }
      }

      // Check if any items removed
      for (const id of oldIds) {
        if (!newIds.has(id)) {
          return true
        }
      }

      return false
    }

    // Simple JSON comparison for other types
    return JSON.stringify(this.lastData) !== JSON.stringify(newData)
  }

  /**
   * Type guard for paginated response
   */
  private isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
    return !!(
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray((data as { data: unknown }).data) &&
      'pagination' in data
    )
  }
}

/**
 * Create a poller for livescores
 */
export function createLivescoresPoller(
  fetchFunction: () => Promise<PaginatedResponse<unknown>>,
  options: Partial<PollingOptions> = {},
): Poller<PaginatedResponse<unknown>> {
  const defaultOptions: PollingOptions = {
    interval: 10000, // 10 seconds
    maxDuration: 3600000, // 1 hour
    stopOnError: false,
    ...options,
  }

  return new Poller(fetchFunction, defaultOptions)
}

/**
 * Create a poller for transfer news
 */
export function createTransfersPoller(
  fetchFunction: () => Promise<PaginatedResponse<unknown>>,
  options: Partial<PollingOptions> = {},
): Poller<PaginatedResponse<unknown>> {
  const defaultOptions: PollingOptions = {
    interval: 60000, // 1 minute
    maxDuration: 86400000, // 24 hours
    stopOnError: false,
    compareFunction: (oldData: unknown, newData: unknown) => {
      // For transfers, compare by latest transfer date
      const oldPaginated = oldData as PaginatedResponse<{ date: string }>
      const newPaginated = newData as PaginatedResponse<{ date: string }>
      
      if (!oldPaginated.data.length || !newPaginated.data.length) {
        return true
      }

      const oldLatest = oldPaginated.data
        .map((t) => new Date(t.date).getTime())
        .sort((a: number, b: number) => b - a)[0]

      const newLatest = newPaginated.data
        .map((t) => new Date(t.date).getTime())
        .sort((a: number, b: number) => b - a)[0]

      return newLatest > oldLatest
    },
    ...options,
  }

  return new Poller(fetchFunction, defaultOptions)
}
