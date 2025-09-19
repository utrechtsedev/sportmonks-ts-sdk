import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { SingleResponse, SquadMember, Player } from '../types'

/**
 * Squads resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/team-squads
 */
export class SquadsResource extends BaseResource {
  /**
   * Returns the current domestic squad from your requested team ID (current season).
   * @param teamId - The season ID
   * @returns QueryBuilder for chaining
   */
  ByTeamId(teamId: string | number): QueryBuilder<SingleResponse<SquadMember>> {
    return new QueryBuilder<SingleResponse<SquadMember>>(this, `/squads/teams/${teamId}`)
  }

  /**
   * Returns all squad entries for a team, based on current seasons (current season).
   * @param teamId - The team ID
   * @returns QueryBuilder for chaining
   */
  byTeamIdExtended(teamId: string | number): QueryBuilder<SingleResponse<Player>> {
    return new QueryBuilder<SingleResponse<Player>>(this, `/teams/${teamId}/extended`)
  }

  /**
   * Returns (historical) squads from your requested season ID.
   * @param teamId - The team ID
   * @param seasonId - The season ID
   * @returns QueryBuilder for chaining
   */
  byTeamAndSeasonId(teamId: string | number, seasonId: string | number): QueryBuilder<SingleResponse<SquadMember>> {
    return new QueryBuilder<SingleResponse<SquadMember>>(this, `/seasons/${seasonId}/teams/${teamId}`)
  }
}
