import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, Transfer } from '../types'

/**
 * Transfers resource for handling transfer-related API endpoints
 */
export class TransfersResource extends BaseResource {
  /**
   * Get all transfers
   *
   * @example
   * ```typescript
   * const transfers = await client.transfers.all()
   *   .include(['player', 'fromteam', 'toteam', 'type'])
   *   .limit(25)
   *   .get();
   * ```
   */
  all(): QueryBuilder<PaginatedResponse<Transfer>> {
    return new QueryBuilder<PaginatedResponse<Transfer>>(this, '')
  }

  /**
   * Get a transfer by ID
   *
   * @param id - The transfer ID
   *
   * @example
   * ```typescript
   * const transfer = await client.transfers.byId(123)
   *   .include(['player', 'fromteam', 'toteam', 'type'])
   *   .get();
   * ```
   */
  byId(id: string | number): QueryBuilder<SingleResponse<Transfer>> {
    return new QueryBuilder<SingleResponse<Transfer>>(this, `/${id}`)
  }

  /**
   * Get latest transfers
   *
   * @example
   * ```typescript
   * const latestTransfers = await client.transfers.latest()
   *   .include(['player', 'fromteam', 'toteam'])
   *   .limit(50)
   *   .get();
   * ```
   */
  latest(): QueryBuilder<PaginatedResponse<Transfer>> {
    return new QueryBuilder<PaginatedResponse<Transfer>>(this, '/latest')
  }

  /**
   * Get transfers between a date range
   *
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   *
   * @example
   * ```typescript
   * const transfers = await client.transfers.between('2024-01-01', '2024-01-31')
   *   .include(['player', 'fromteam', 'toteam', 'type'])
   *   .filter('completed', 1)
   *   .get();
   * ```
   */
  between(startDate: string, endDate: string): QueryBuilder<PaginatedResponse<Transfer>> {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error('Dates must be in YYYY-MM-DD format')
    }

    return new QueryBuilder<PaginatedResponse<Transfer>>(this, `/between/${startDate}/${endDate}`)
  }

  /**
   * Get transfers by team ID (both incoming and outgoing)
   *
   * @param teamId - The team ID
   *
   * @example
   * ```typescript
   * // Get all transfers for Manchester United
   * const transfers = await client.transfers.byTeam(14)
   *   .include(['player', 'fromteam', 'toteam', 'type'])
   *   .filter('completed', 1)
   *   .get();
   * ```
   */
  byTeam(teamId: string | number): QueryBuilder<PaginatedResponse<Transfer>> {
    return new QueryBuilder<PaginatedResponse<Transfer>>(this, `/teams/${teamId}`)
  }

  /**
   * Get transfers by player ID
   *
   * @param playerId - The player ID
   *
   * @example
   * ```typescript
   * const playerTransfers = await client.transfers.byPlayer(12345)
   *   .include(['fromteam', 'toteam', 'type'])
   *   .get();
   * ```
   */
  byPlayer(playerId: string | number): QueryBuilder<PaginatedResponse<Transfer>> {
    return new QueryBuilder<PaginatedResponse<Transfer>>(this, `/players/${playerId}`)
  }
}
