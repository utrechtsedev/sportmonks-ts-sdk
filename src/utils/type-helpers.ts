/**
 * Type helper utilities for working with SportMonks API responses
 */

import type {
  League,
  Team,
  Player,
  Fixture,
  Venue,
  SingleResponse,
  PaginatedResponse,
} from '../types'

/**
 * Extract the data type from a response
 * @example
 * type TeamData = ExtractData<SingleResponse<Team>>; // Team
 * type TeamsData = ExtractData<PaginatedResponse<Team>>; // Team[]
 */
export type ExtractData<T> =
  T extends SingleResponse<infer U> ? U : T extends PaginatedResponse<infer U> ? U[] : never

/**
 * Make certain properties required when using includes
 * @example
 * // When including country, make it required in the type
 * type TeamWithCountry = WithRequired<Team, 'country'>;
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Common include combinations as type helpers
 */
export type LeagueWithCountry = WithRequired<League, 'country'>
export type LeagueWithSeasons = WithRequired<League, 'seasons'>
export type LeagueWithCountryAndSeasons = WithRequired<League, 'country' | 'seasons'>

export type TeamWithCountry = WithRequired<Team, 'country'>
export type TeamWithVenue = WithRequired<Team, 'venue'>
export type TeamWithCoach = WithRequired<Team, 'coach'>
export type TeamWithAll = WithRequired<Team, 'country' | 'venue' | 'coach'>

export type PlayerWithCountry = WithRequired<Player, 'country'>
export type PlayerWithNationality = WithRequired<Player, 'nationality'>

export type FixtureWithTeams = WithRequired<Fixture, 'localteam' | 'visitorteam'>
export type FixtureWithLeague = WithRequired<Fixture, 'league'>
export type FixtureWithVenue = WithRequired<Fixture, 'venue'>
export type FixtureWithEvents = WithRequired<Fixture, 'events'>
export type FixtureWithLineups = WithRequired<Fixture, 'lineups'>

/**
 * Type guard to check if a property exists
 * @example
 * if (hasInclude(team, 'country')) {
 *   // TypeScript now knows team.country is defined
 *   console.log(team.country.name);
 * }
 */
export function hasInclude<T, K extends keyof T>(obj: T, key: K): obj is T & Required<Pick<T, K>> {
  return obj[key] !== undefined && obj[key] !== null
}

/**
 * Type guard for response with data
 * @example
 * const response = await client.teams.byId(1).get();
 * if (hasData(response)) {
 *   // TypeScript knows response.data exists
 * }
 */
export function hasData<T>(response: unknown): response is { data: T } {
  return (
    response !== null &&
    typeof response === 'object' &&
    'data' in response &&
    (response as { data?: unknown }).data !== undefined
  )
}

/**
 * Type guard for paginated response
 */
export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return hasData(response) && Array.isArray((response as { data: unknown }).data)
}

/**
 * Type guard for single response
 */
export function isSingleResponse<T>(response: unknown): response is SingleResponse<T> {
  return hasData(response) && !Array.isArray((response as { data: unknown }).data)
}

/**
 * Safely access nested includes
 * @example
 * const countryName = getNestedInclude(team, 'country', 'name');
 */
export function getNestedInclude<T, K extends keyof T>(
  obj: T,
  include: K,
  property?: keyof NonNullable<T[K]>,
): T[K] | undefined {
  const included = obj[include]
  if (!included) return undefined

  if (property && typeof included === 'object' && included !== null) {
    return (included as Record<string, unknown>)[property as string] as T[K]
  }

  return included
}

/**
 * Sort helpers with type safety
 */
export function sortByName<T extends { name: string }>(a: T, b: T): number {
  return a.name.localeCompare(b.name)
}

export function sortByCapacity(a: Venue, b: Venue): number {
  return (b.capacity || 0) - (a.capacity || 0)
}

/**
 * Response transformer types
 */
export type ResponseTransformer<TIn, TOut> = (response: TIn) => TOut

/**
 * Create a typed response transformer
 * @example
 * const toTeamNames = createTransformer<PaginatedResponse<Team>, string[]>(
 *   response => response.data.map(team => team.name)
 * );
 */
export function createTransformer<TIn, TOut>(
  fn: ResponseTransformer<TIn, TOut>,
): ResponseTransformer<TIn, TOut> {
  return fn
}
