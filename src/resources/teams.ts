import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Team, SquadMember } from '../types'

/**
 * Teams resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/teams
 */
export class TeamsResource extends BaseResource {
  /**
   * Get all teams
   * @returns QueryBuilder for chaining
   */
  all(): QueryBuilder<PaginatedResponse<Team>> {
    return new QueryBuilder<PaginatedResponse<Team>>(this, '')
  }

  /**
   * Get a team by ID
   * @param id - The team ID
   * @returns QueryBuilder for chaining
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Team>> {
    return new QueryBuilder<SingleResponse<Team>>(this, `/${id}`)
  }

  /**
   * Get teams by country ID
   * @param countryId - The country ID
   * @returns QueryBuilder for chaining
   */
  byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Team>> {
    return new QueryBuilder<PaginatedResponse<Team>>(this, `/countries/${countryId}`)
  }

  /**
   * Get teams by season ID
   * @param seasonId - The season ID
   * @returns QueryBuilder for chaining
   */
  bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Team>> {
    return new QueryBuilder<PaginatedResponse<Team>>(this, `/seasons/${seasonId}`)
  }

  /**
   * Search for teams by name
   * @param searchQuery - The search query
   * @returns QueryBuilder for chaining
   */
  search(searchQuery: string): QueryBuilder<PaginatedResponse<Team>> {
    const encodedQuery = encodeURIComponent(searchQuery)
    return new QueryBuilder<PaginatedResponse<Team>>(this, `/search/${encodedQuery}`)
  }

  /**
   * Get squad for a team. If seasonId is provided, fetch squad for that season.
   * @param teamId Team ID
   * @param seasonId Optional season ID
   * @example
   * // Current squad
   * const current = await client.teams.squad(1).include(['player']).get()
   * // Squad for season 2023/24
   * const historical = await client.teams.squad(1, 21646).include(['player']).get()
   */
  squad(
    teamId: string | number,
    seasonId?: string | number,
  ): QueryBuilder<PaginatedResponse<SquadMember>> {
    if (seasonId) {
      return this.squadBySeason(seasonId, teamId)
    }
    // Override basePath to access squads endpoint
    const squadResource = Object.create(this) as TeamsResource
    squadResource.basePath = '/football'
    return new QueryBuilder<PaginatedResponse<SquadMember>>(squadResource, `/squads/teams/${teamId}`)
  }

  /**
   * Get squad for a team in a specific season.
   * @param seasonId Season ID
   * @param teamId Team ID
   */
  squadBySeason(
    seasonId: string | number,
    teamId: string | number,
  ): QueryBuilder<PaginatedResponse<SquadMember>> {
    // Override basePath to access squads endpoint
    const squadResource = Object.create(this) as TeamsResource
    squadResource.basePath = '/football'
    return new QueryBuilder<PaginatedResponse<SquadMember>>(
      squadResource,
      `/squads/seasons/${seasonId}/teams/${teamId}`,
    )
  }
}
