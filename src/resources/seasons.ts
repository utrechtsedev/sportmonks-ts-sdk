import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Season } from '../types'

/**
 * Seasons resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons
 */
export class SeasonsResource extends BaseResource {
  /**
   * Get all seasons
   * @returns QueryBuilder for chaining
   */
  all(): QueryBuilder<PaginatedResponse<Season>> {
    return new QueryBuilder<PaginatedResponse<Season>>(this, '')
  }

  /**
   * Get a season by ID
   * @param id - The season ID
   * @returns QueryBuilder for chaining
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Season>> {
    return new QueryBuilder<SingleResponse<Season>>(this, `/${id}`)
  }

  /**
   * Get season by team ID
   * @param teamId - The team ID
   * @returns QueryBuilder for chaining
   */
  byCountry(teamId: string | number): QueryBuilder<PaginatedResponse<Season>> {
    return new QueryBuilder<PaginatedResponse<Season>>(this, `/teams/${teamId}`)
  }

  /**
   * Search for seasons by name
   * @param searchQuery - The search query
   * @returns QueryBuilder for chaining
   */
  search(searchQuery: string): QueryBuilder<PaginatedResponse<Season>> {
    const encodedQuery = encodeURIComponent(searchQuery)
    return new QueryBuilder<PaginatedResponse<Season>>(this, `/search/${encodedQuery}`)
  }
}
