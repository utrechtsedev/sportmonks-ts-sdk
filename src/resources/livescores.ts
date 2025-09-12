import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, Fixture } from '../types'

/**
 * Livescores resource for real-time fixture data
 *
 * The Livescores endpoints provide access to real-time match data:
 * - Inplay fixtures (currently being played)
 * - Upcoming fixtures (15 minutes before start)
 * - Latest updates (fixtures updated within 10 seconds)
 */
export class LivescoresResource extends BaseResource {
  /**
   * Get all inplay fixtures (currently being played)
   * @example
   * const inplayMatches = await api.livescores.inplay()
   *   .include(['league', 'participants', 'scores', 'state'])
   *   .get();
   */
  inplay(): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, '/inplay')
  }

  /**
   * Get all livescores (fixtures starting within 15 minutes)
   * @example
   * const upcomingMatches = await api.livescores.all()
   *   .include(['league', 'participants', 'venue'])
   *   .filter('leagues', '8,564') // Filter by league IDs
   *   .get();
   */
  all(): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, '')
  }

  /**
   * Get latest updated livescores (updated within 10 seconds)
   * @example
   * const latestUpdates = await api.livescores.latest()
   *   .include(['events.type', 'scores', 'participants'])
   *   .get();
   */
  latest(): QueryBuilder<PaginatedResponse<Fixture>> {
    return new QueryBuilder<PaginatedResponse<Fixture>>(this, '/latest')
  }
}
