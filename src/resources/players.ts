import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Player, PlayerStatistic } from '../types'
import { validateId, validateSearchQuery } from '../utils/validators'

/**
 * Players resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players
 */
export class PlayersResource extends BaseResource {
  /**
   * Get all players
   * @returns QueryBuilder for chaining
   */
  all(): QueryBuilder<PaginatedResponse<Player>> {
    return new QueryBuilder<PaginatedResponse<Player>>(this, '')
  }

  /**
   * Get a player by ID
   * @param id - The player ID
   * @returns QueryBuilder for chaining
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Player>> {
    const validatedId = validateId(id, 'ID')
    return new QueryBuilder<SingleResponse<Player>>(this, `/${validatedId}`)
  }

  /**
   * Get players by country ID
   * @param countryId - The country ID
   * @returns QueryBuilder for chaining
   */
  byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Player>> {
    const validatedId = validateId(countryId, 'Country ID')
    return new QueryBuilder<PaginatedResponse<Player>>(this, `/countries/${validatedId}`)
  }

  /**
   * Search for players by name
   * @param searchQuery - The search query
   * @returns QueryBuilder for chaining
   */
  search(searchQuery: string): QueryBuilder<PaginatedResponse<Player>> {
    const validatedQuery = validateSearchQuery(searchQuery, 2)
    const encodedQuery = encodeURIComponent(validatedQuery)
    return new QueryBuilder<PaginatedResponse<Player>>(this, `/search/${encodedQuery}`)
  }

  /**
   * Get the latest updated players
   * @returns QueryBuilder for chaining
   */
  latest(): QueryBuilder<PaginatedResponse<Player>> {
    return new QueryBuilder<PaginatedResponse<Player>>(this, '/latest')
  }

  /**
   * Get statistics for a player.
   * @param playerId Player ID
   * @example
   * const stats = await client.players.statistics(278).get()
   */
  statistics(playerId: string | number): QueryBuilder<PaginatedResponse<PlayerStatistic>> {
    return new QueryBuilder<PaginatedResponse<PlayerStatistic>>(this, `/${playerId}/statistics`)
  }

  /**
   * Get statistics for a player in a specific season.
   * @param playerId Player ID
   * @param seasonId Season ID
   */
  statisticsBySeason(
    playerId: string | number,
    seasonId: string | number,
  ): QueryBuilder<PaginatedResponse<PlayerStatistic>> {
    return this.statistics(playerId).filter('season_id', seasonId)
  }
}
