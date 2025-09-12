import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, League } from '../types'
import { validateDateFormat } from '../utils/validators'

/**
 * Leagues resource with all available endpoints
 */
export class LeaguesResource extends BaseResource {
  /**
   * Get all leagues
   * @example
   * const leagues = await api.leagues.all()
   *   .include(['country', 'currentSeason'])
   *   .filter('active', true)
   *   .orderBy('name')
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<League>> {
    return new QueryBuilder<PaginatedResponse<League>>(this, '')
  }

  /**
   * Get a league by ID
   * @param id The league ID
   * @example
   * const league = await api.leagues.byId(271)
   *   .include(['country', 'seasons', 'stages'])
   *   .get();
   */
  byId(id: string | number): QueryBuilder<SingleResponse<League>> {
    return new QueryBuilder<SingleResponse<League>>(this, `/${id}`)
  }

  /**
   * Get leagues by country ID
   * @param countryId The country ID
   * @example
   * const leagues = await api.leagues.byCountry(462)
   *   .filter('active', true)
   *   .get();
   */
  byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<League>> {
    return new QueryBuilder<PaginatedResponse<League>>(this, `/countries/${countryId}`)
  }

  /**
   * Search leagues by name
   * @param query The search query
   * @example
   * const leagues = await api.leagues.search('premier')
   *   .include(['country'])
   *   .get();
   */
  search(query: string): QueryBuilder<PaginatedResponse<League>> {
    const encodedQuery = encodeURIComponent(query)
    return new QueryBuilder<PaginatedResponse<League>>(this, `/search/${encodedQuery}`)
  }

  /**
   * Get leagues with live fixtures
   * @example
   * const liveLeagues = await api.leagues.live()
   *   .include(['fixtures'])
   *   .get();
   */
  live(): QueryBuilder<PaginatedResponse<League>> {
    return new QueryBuilder<PaginatedResponse<League>>(this, '/live')
  }

  /**
   * Get leagues by fixture date
   * @param date Date in YYYY-MM-DD format
   * @example
   * const leagues = await api.leagues.byDate('2024-01-15')
   *   .include(['fixtures'])
   *   .get();
   */
  byDate(date: string): QueryBuilder<PaginatedResponse<League>> {
    validateDateFormat(date)
    return new QueryBuilder<PaginatedResponse<League>>(this, `/date/${date}`)
  }

  /**
   * Get all leagues for a team (historical and current)
   * @param teamId The team ID
   * @example
   * const leagues = await api.leagues.byTeam(1)
   *   .include(['seasons'])
   *   .get();
   */
  byTeam(teamId: string | number): QueryBuilder<PaginatedResponse<League>> {
    return new QueryBuilder<PaginatedResponse<League>>(this, `/teams/${teamId}`)
  }

  /**
   * Get current leagues for a team
   * @param teamId The team ID
   * @example
   * const currentLeagues = await api.leagues.currentByTeam(1)
   *   .include(['currentSeason'])
   *   .get();
   */
  currentByTeam(teamId: string | number): QueryBuilder<PaginatedResponse<League>> {
    return new QueryBuilder<PaginatedResponse<League>>(this, `/teams/${teamId}/current`)
  }
}
