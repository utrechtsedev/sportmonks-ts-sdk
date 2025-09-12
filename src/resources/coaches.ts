import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Coach } from '../types'

/**
 * Coaches resource with all available endpoints
 */
export class CoachesResource extends BaseResource {
  /**
   * Get all coaches
   * @example
   * const coaches = await api.coaches.all()
   *   .include(['country', 'nationality', 'teams'])
   *   .orderBy('name')
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<Coach>> {
    return new QueryBuilder<PaginatedResponse<Coach>>(this, '')
  }

  /**
   * Get a coach by ID
   * @param id The coach ID
   * @example
   * const coach = await api.coaches.byId(123)
   *   .include(['country', 'nationality', 'teams'])
   *   .get();
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Coach>> {
    return new QueryBuilder<SingleResponse<Coach>>(this, `/${id}`)
  }

  /**
   * Get coaches by country ID
   * @param countryId The country ID
   * @example
   * const coaches = await api.coaches.byCountry(462)
   *   .include(['teams'])
   *   .get();
   */
  byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Coach>> {
    return new QueryBuilder<PaginatedResponse<Coach>>(this, `/countries/${countryId}`)
  }

  /**
   * Search coaches by name
   * @param query The search query
   * @example
   * const coaches = await api.coaches.search('mourinho')
   *   .include(['teams'])
   *   .get();
   */
  search(query: string): QueryBuilder<PaginatedResponse<Coach>> {
    const encodedQuery = encodeURIComponent(query)
    return new QueryBuilder<PaginatedResponse<Coach>>(this, `/search/${encodedQuery}`)
  }

  /**
   * Get last updated coaches (updated in the past two hours)
   * @example
   * const recentlyUpdated = await api.coaches.latest()
   *   .include(['teams'])
   *   .get();
   */
  latest(): QueryBuilder<PaginatedResponse<Coach>> {
    return new QueryBuilder<PaginatedResponse<Coach>>(this, '/latest')
  }
}
