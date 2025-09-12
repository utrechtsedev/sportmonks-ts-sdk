import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, Standing, StandingCorrection } from '../types'

/**
 * Standings resource with all available endpoints
 */
export class StandingsResource extends BaseResource {
  /**
   * Get all standings
   * Note: This endpoint requires season_id filter
   * @example
   * const standings = await api.standings.all()
   *   .filter('season_id', 19735)
   *   .include(['participant', 'league'])
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<Standing>> {
    return new QueryBuilder<PaginatedResponse<Standing>>(this, '')
  }

  /**
   * Get standings by season ID
   * @param seasonId The season ID
   * @example
   * const standings = await api.standings.bySeason(19735)
   *   .include(['participant.country'])
   *   .get();
   */
  bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Standing>> {
    return new QueryBuilder<PaginatedResponse<Standing>>(this, `/seasons/${seasonId}`)
  }

  /**
   * Get standings by round ID
   * @param roundId The round ID
   * @example
   * const standings = await api.standings.byRound(274719)
   *   .include(['participant'])
   *   .get();
   */
  byRound(roundId: string | number): QueryBuilder<PaginatedResponse<Standing>> {
    return new QueryBuilder<PaginatedResponse<Standing>>(this, `/rounds/${roundId}`)
  }

  /**
   * Get standing corrections by season ID
   * @param seasonId The season ID
   * @example
   * const corrections = await api.standings.correctionsBySeason(19735)
   *   .include(['participant'])
   *   .get();
   */
  correctionsBySeason(
    seasonId: string | number,
  ): QueryBuilder<PaginatedResponse<StandingCorrection>> {
    return new QueryBuilder<PaginatedResponse<StandingCorrection>>(
      this,
      `/corrections/seasons/${seasonId}`,
    )
  }

  /**
   * Get live standings by league ID
   * @param leagueId The league ID
   * @example
   * const liveStandings = await api.standings.liveByLeague(8)
   *   .include(['participant'])
   *   .get();
   */
  liveByLeague(leagueId: string | number): QueryBuilder<PaginatedResponse<Standing>> {
    return new QueryBuilder<PaginatedResponse<Standing>>(this, `/live/leagues/${leagueId}`)
  }
}
