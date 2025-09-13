import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { SingleResponse, Season } from '../types'

/**
 * Seasons resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons
 */
export class SchedulesResource extends BaseResource {
  /**
   * Get schedule by season ID
   * @param id - The season ID
   * @returns QueryBuilder for chaining
   */
  bySeasonId(id: string | number): QueryBuilder<SingleResponse<Season>> {
    return new QueryBuilder<SingleResponse<Season>>(this, `/seasons/${id}`)
  }

  /**
   * Get schedule by team ID
   * @param teamId - The team ID
   * @returns QueryBuilder for chaining
   */
  byTeamId(teamId: string | number): QueryBuilder<SingleResponse<Season>> {
    return new QueryBuilder<SingleResponse<Season>>(this, `/teams/${teamId}`)
  }

  /**
   * Get schedule by team ID and season ID
   * @param teamID - The team ID
   * @param seasonID - The season ID
   * @returns QueryBuilder for chaining
   */
  byTeamAndSeasonId(teamID: string | number, seasonID: string | number): QueryBuilder<SingleResponse<Season>> {
    return new QueryBuilder<SingleResponse<Season>>(this, `/seasons/${seasonID}/teams/${teamID}`)
  }
}
