import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Venue } from '../types'

/**
 * Venues resource for accessing stadium/venue information
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/venues
 */
export class VenuesResource extends BaseResource {
  /**
   * Get all venues
   * @example
   * const venues = await api.venues.all()
   *   .include(['country'])
   *   .page(1)
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<Venue>> {
    return new QueryBuilder<PaginatedResponse<Venue>>(this, '')
  }

  /**
   * Get a venue by ID
   * @param id The venue ID
   * @example
   * const venue = await api.venues.byId(5)
   *   .include(['country'])
   *   .get();
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Venue>> {
    return new QueryBuilder<SingleResponse<Venue>>(this, `/${id}`)
  }

  /**
   * Get venues by season ID
   * Returns all venues used in a specific season
   * @param seasonId The season ID
   * @example
   * const venues = await api.venues.bySeason(19735)
   *   .include(['country'])
   *   .get();
   */
  bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Venue>> {
    return new QueryBuilder<PaginatedResponse<Venue>>(this, `/seasons/${seasonId}`)
  }

  /**
   * Search venues by name
   * @param searchQuery The search query (minimum 3 characters)
   * @example
   * const venues = await api.venues.search('Old Trafford')
   *   .include(['country'])
   *   .get();
   */
  search(searchQuery: string): QueryBuilder<PaginatedResponse<Venue>> {
    if (searchQuery.length < 3) {
      throw new Error('Search query must be at least 3 characters long')
    }
    return new QueryBuilder<PaginatedResponse<Venue>>(
      this,
      `/search/${encodeURIComponent(searchQuery)}`,
    )
  }
}
