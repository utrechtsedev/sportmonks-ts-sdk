import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Fixture } from '../types'
import {
  validateDateFormat,
  validateDateRange,
  validateId,
  validateSearchQuery,
} from '../utils/validators'

/**
 * Fixtures resource for accessing match/game information
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/fixtures
 */
export class FixturesResource extends BaseResource {
  /**
   * Get all fixtures
   * @example
   * const fixtures = await api.fixtures.all()
   *   .include(['localteam', 'visitorteam'])
   *   .page(1)
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, '')
  }

  /**
   * Get a fixture by ID
   * @param id The fixture ID
   * @example
   * const fixture = await api.fixtures.byId(18535517)
   *   .include(['localteam', 'visitorteam', 'venue', 'referee'])
   *   .get();
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Fixture>> {
    return new QueryBuilder<SingleResponse<Fixture>>(this, `/${id}`)
  }

  /**
   * Get fixtures by multiple IDs
   * @param ids Array of fixture IDs
   * @example
   * const fixtures = await api.fixtures.byIds([18535517, 18535518])
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  byIds(ids: (string | number)[]): QueryBuilder<PaginatedResponse<Fixture>> {
    const idsString = ids.join(',')
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, `/multi/${idsString}`)
  }

  /**
   * Get fixtures by date
   * @param date Date in YYYY-MM-DD format
   * @example
   * const fixtures = await api.fixtures.byDate('2024-01-15')
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  byDate(date: string): QueryBuilder<PaginatedResponse<Fixture>> {
    validateDateFormat(date)
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, `/date/${date}`)
  }

  /**
   * Get fixtures by date range
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @example
   * const fixtures = await api.fixtures.byDateRange('2024-01-01', '2024-01-31')
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  byDateRange(startDate: string, endDate: string): QueryBuilder<PaginatedResponse<Fixture>> {
    validateDateRange(startDate, endDate)
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, `/between/${startDate}/${endDate}`)
  }

  /**
   * Get fixtures by date range for a specific team
   * @param teamId The team ID
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @example
   * const fixtures = await api.fixtures.byTeamAndDateRange(1, '2024-01-01', '2024-01-31')
   *   .include(['localteam', 'visitorteam', 'venue'])
   *   .get();
   */
  byTeamAndDateRange(
    teamId: string | number,
    startDate: string,
    endDate: string,
  ): QueryBuilder<PaginatedResponse<Fixture>> {
    validateId(teamId, 'Team ID')
    validateDateRange(startDate, endDate)
    return new QueryBuilder<PaginatedResponse<Fixture>>(
      this,
      `/between/${startDate}/${endDate}/${teamId}`,
    )
  }

  /**
   * Get head-to-head fixtures between two teams
   * @param team1Id First team ID
   * @param team2Id Second team ID
   * @example
   * const h2h = await api.fixtures.headToHead(1, 14)
   *   .include(['localteam', 'visitorteam', 'venue'])
   *   .get();
   */
  headToHead(
    team1Id: string | number,
    team2Id: string | number,
  ): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, `/head-to-head/${team1Id}/${team2Id}`)
  }

  /**
   * Search fixtures by name
   * @param searchQuery The search query
   * @example
   * const fixtures = await api.fixtures.search('Manchester United vs Liverpool')
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  search(searchQuery: string): QueryBuilder<PaginatedResponse<Fixture>> {
    const query = validateSearchQuery(searchQuery)
    return new QueryBuilder<PaginatedResponse<Fixture>>(
      this,
      `/search/${encodeURIComponent(query)}`,
    )
  }

  /**
   * Get upcoming fixtures by market ID
   * @param marketId The market ID
   * @example
   * const fixtures = await api.fixtures.upcomingByMarket(1)
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  upcomingByMarket(marketId: string | number): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, `/upcoming/markets/${marketId}`)
  }

  /**
   * Get upcoming fixtures by TV station ID
   * @param tvStationId The TV station ID
   * @example
   * const fixtures = await api.fixtures.upcomingByTvStation(1)
   *   .include(['localteam', 'visitorteam', 'tvstations'])
   *   .get();
   */
  upcomingByTvStation(tvStationId: string | number): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(
      this,
      `/upcoming/tv-stations/${tvStationId}`,
    )
  }

  /**
   * Get past fixtures by TV station ID
   * @param tvStationId The TV station ID
   * @example
   * const fixtures = await api.fixtures.pastByTvStation(1)
   *   .include(['localteam', 'visitorteam', 'tvstations'])
   *   .get();
   */
  pastByTvStation(tvStationId: string | number): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, `/past/tv-stations/${tvStationId}`)
  }

  /**
   * Get latest updated fixtures
   * Returns fixtures that have received updates within 10 seconds
   * @example
   * const fixtures = await api.fixtures.latest()
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  latest(): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, '/latest')
  }
}
