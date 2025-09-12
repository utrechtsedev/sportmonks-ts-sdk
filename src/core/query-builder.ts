import { BaseResource } from './base-resource'
import { QueryParameters } from '../types/common'

/**
 * Advanced query builder for constructing API requests with method chaining
 */
export class QueryBuilder<T> {
  protected resource: BaseResource
  protected endpoint: string
  protected queryParams: QueryParameters = {}
  protected includeParams: string[] = []
  protected selectFields: string[] = []
  protected filterParams: Record<string, string | number | boolean> = {}
  protected orderParams: string[] = []
  protected hasParams: string[] = []

  constructor(resource: BaseResource, endpoint: string) {
    this.resource = resource
    this.endpoint = endpoint
  }

  /**
   * Include related resources in the response
   * @param includes Array of relationship names, dot notation for nested includes, or field selection
   * @example .include(['country', 'seasons.stages'])
   * @example .include(['lineups:player_name', 'events:player_name,related_player_name,minute'])
   * @example .include(['lineups;events;participants']) // Multiple includes with semicolon
   */
  include(includes: string[] | string): QueryBuilder<T> {
    if (typeof includes === 'string') {
      // Handle string input for complex includes
      this.includeParams.push(includes)
    } else {
      this.includeParams = [...new Set([...this.includeParams, ...includes])]
    }
    return this
  }

  /**
   * Include a relation with specific field selection
   * @param relation The relation name
   * @param fields Array of fields to select from the relation
   * @example .includeFields('lineups', ['player_name', 'jersey_number'])
   * @example .includeFields('events', ['player_name', 'related_player_name', 'minute'])
   */
  includeFields(relation: string, fields: string[]): QueryBuilder<T> {
    const fieldsString = fields.join(',')
    this.includeParams.push(`${relation}:${fieldsString}`)
    return this
  }

  /**
   * Select specific fields to include in the response
   * @param fields Array of field names
   * @example .select(['id', 'name', 'country_id'])
   */
  select(fields: string[]): QueryBuilder<T> {
    this.selectFields = [...new Set([...this.selectFields, ...fields])]
    return this
  }

  /**
   * Add a filter parameter to the request
   * @example .filter('name', 'Premier League')
   * @example .filter('active', true)
   * @example .filter('eventTypes', [15, 16]) // Multiple values
   */
  filter(key: string, value: string | number | boolean | (string | number)[]): QueryBuilder<T> {
    if (Array.isArray(value)) {
      // Join multiple values with comma for SportMonks syntax
      this.filterParams[key] = value.join(',')
    } else {
      this.filterParams[key] = value
    }
    return this
  }

  /**
   * Add multiple filters at once
   * @example .filters({ active: true, country_id: 462 })
   */
  filters(filters: Record<string, string | number | boolean>): QueryBuilder<T> {
    this.filterParams = { ...this.filterParams, ...filters }
    return this
  }

  /**
   * Add sorting to the results
   * @param field Field name with optional - prefix for descending
   * @example .orderBy('name') or .orderBy('-created_at')
   */
  orderBy(field: string): QueryBuilder<T> {
    this.orderParams.push(field)
    return this
  }

  /**
   * Filter results that have specific relationships
   * @param relationships Array of relationship names
   * @example .has(['seasons'])
   */
  has(relationships: string[]): QueryBuilder<T> {
    this.hasParams = [...new Set([...this.hasParams, ...relationships])]
    return this
  }

  /**
   * Set the page number for paginated results
   */
  page(page: number): QueryBuilder<T> {
    this.queryParams.page = page
    return this
  }

  /**
   * Set the number of items per page
   */
  limit(limit: number): QueryBuilder<T> {
    this.queryParams.limit = limit
    return this
  }

  /**
   * Set the number of items per page (alias for limit)
   */
  perPage(perPage: number): QueryBuilder<T> {
    return this.limit(perPage)
  }

  /**
   * Execute the API request and return the results
   */
  async get(): Promise<T> {
    // Build query parameters
    if (this.includeParams.length > 0) {
      this.queryParams.include = this.includeParams.join(this.resource['includeSeparator'])
    }

    if (this.selectFields.length > 0) {
      this.queryParams.select = this.selectFields.join(',')
    }

    // Build filters as a string (API v3 format)
    if (Object.keys(this.filterParams).length > 0) {
      const filterStrings = Object.entries(this.filterParams).map(([key, value]) => {
        return `${key}:${value}`
      })
      this.queryParams.filters = filterStrings.join(';')
    }

    if (this.orderParams.length > 0) {
      this.queryParams.order = this.orderParams.join(',')
    }

    if (this.hasParams.length > 0) {
      this.queryParams.has = this.hasParams.join(',')
    }

    // Handle per_page vs limit
    if (this.queryParams.limit) {
      this.queryParams.per_page = this.queryParams.limit
      delete this.queryParams.limit
    }

    return this.resource['request']<T>(this.endpoint, this.queryParams)
  }

  /**
   * Build complex includes with SportMonks syntax
   * @param includes Object defining includes with optional field selection
   * @example .withIncludes({
   *   lineups: ['player_name', 'jersey_number'],
   *   events: ['player_name', 'related_player_name', 'minute'],
   *   participants: true  // Include all fields
   * })
   */
  withIncludes(includes: Record<string, string[] | boolean>): QueryBuilder<T> {
    Object.entries(includes).forEach(([relation, fields]) => {
      if (fields === true) {
        // Include all fields
        this.includeParams.push(relation)
      } else if (Array.isArray(fields) && fields.length > 0) {
        // Include specific fields
        this.includeParams.push(`${relation}:${fields.join(',')}`)
      }
    })
    return this
  }

  /**
   * Get all pages of results (be careful with rate limits!)
   */
  async getAll(): Promise<T[]> {
    const results: T[] = []
    let currentPage = 1
    let hasMore = true

    while (hasMore) {
      this.page(currentPage)
      const response = await this.get() as unknown as { data?: T | T[]; pagination?: { has_more?: boolean } }

      if (response.data) {
        results.push(...(Array.isArray(response.data) ? response.data : [response.data]))
      }

      hasMore = response.pagination?.has_more || false
      currentPage++
    }

    return results
  }
}
