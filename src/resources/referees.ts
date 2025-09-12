import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Referee } from '../types'

/**
 * Referees resource with all available endpoints
 */
export class RefereesResource extends BaseResource {
  /**
   * Get all referees
   * @example
   * const referees = await api.referees.all()
   *   .include(['country'])
   *   .page(1)
   *   .limit(25)
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<Referee>> {
    return new QueryBuilder<PaginatedResponse<Referee>>(this, '')
  }

  /**
   * Get referee by ID
   * @param refereeId The referee ID
   * @example
   * const referee = await api.referees.byId(1)
   *   .include(['country', 'fixtures'])
   *   .get();
   */
  byId(refereeId: string | number): QueryBuilder<SingleResponse<Referee>> {
    return new QueryBuilder<SingleResponse<Referee>>(this, `/${refereeId}`)
  }

  /**
   * Get referees by country ID
   * @param countryId The country ID
   * @example
   * const referees = await api.referees.byCountry(1161)
   *   .include(['country'])
   *   .get();
   */
  byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Referee>> {
    return new QueryBuilder<PaginatedResponse<Referee>>(this, `/countries/${countryId}`)
  }

  /**
   * Get referees by season ID
   * @param seasonId The season ID
   * @example
   * const referees = await api.referees.bySeason(19735)
   *   .include(['country'])
   *   .get();
   */
  bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Referee>> {
    return new QueryBuilder<PaginatedResponse<Referee>>(this, `/seasons/${seasonId}`)
  }

  /**
   * Search referees by name
   * @param searchQuery The search query (minimum 3 characters)
   * @example
   * const referees = await api.referees.search('Michael Oliver')
   *   .include(['country'])
   *   .get();
   */
  search(searchQuery: string): QueryBuilder<PaginatedResponse<Referee>> {
    if (searchQuery.length < 3) {
      throw new Error('Search query must be at least 3 characters long')
    }
    return new QueryBuilder<PaginatedResponse<Referee>>(
      this,
      `/search/${encodeURIComponent(searchQuery)}`,
    )
  }
}
