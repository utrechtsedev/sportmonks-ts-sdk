/**
 * SportMonks API Syntax Types and Utilities
 *
 * This module provides type definitions and utilities for working with
 * SportMonks' specific query syntax.
 */

/**
 * SportMonks Include Syntax
 *
 * Examples:
 * - Simple include: "lineups"
 * - Field selection: "lineups:player_name"
 * - Multiple fields: "events:player_name,related_player_name,minute"
 * - Multiple includes: "lineups;events;participants"
 * - Nested includes: "league.country"
 * - Combined: "lineups:player_name;events:player_name,minute;participants"
 */
export type SportMonksInclude = string

/**
 * SportMonks Filter Syntax
 *
 * Examples:
 * - Single filter: "eventTypes:15"
 * - Multiple values: "eventTypes:15,16,17"
 * - Multiple filters: "eventTypes:15;position:1"
 */
export type SportMonksFilter = string

/**
 * Include configuration for a relation
 */
export interface IncludeConfig {
  /**
   * Fields to select from the relation
   * If true, includes all fields
   * If array, includes only specified fields
   */
  fields?: string[] | boolean

  /**
   * Nested includes for this relation
   */
  nested?: Record<string, IncludeConfig>
}

/**
 * SportMonks query syntax configuration
 */
export interface SportMonksSyntax {
  /**
   * Include configuration
   * @example
   * {
   *   lineups: { fields: ['player_name', 'jersey_number'] },
   *   events: { fields: ['player_name', 'minute'] },
   *   league: {
   *     fields: true,
   *     nested: { country: { fields: ['name', 'iso2'] } }
   *   }
   * }
   */
  includes?: Record<string, IncludeConfig | boolean>

  /**
   * Filter configuration
   * @example
   * {
   *   eventTypes: [15, 16, 17],
   *   position: 1
   * }
   */
  filters?: Record<string, string | number | boolean | (string | number)[]>

  /**
   * Fields to select on the base entity
   * @example ['id', 'name', 'country_id']
   */
  select?: string[]
}

/**
 * Helper to build SportMonks include syntax
 */
export class SportMonksSyntaxBuilder {
  /**
   * Build include string from configuration
   */
  static buildIncludes(config: Record<string, IncludeConfig | boolean>, separator = ';'): string {
    const includes: string[] = []

    Object.entries(config).forEach(([relation, settings]) => {
      if (settings === true) {
        includes.push(relation)
      } else if (settings && typeof settings === 'object') {
        let includeStr = relation

        // Add field selection
        if (Array.isArray(settings.fields) && settings.fields.length > 0) {
          includeStr += ':' + settings.fields.join(',')
        }

        includes.push(includeStr)

        // Handle nested includes
        if (settings.nested) {
          Object.entries(settings.nested).forEach(([nestedRelation, nestedSettings]) => {
            let nestedStr = `${relation}.${nestedRelation}`
            if (
              nestedSettings &&
              typeof nestedSettings === 'object' &&
              Array.isArray(nestedSettings.fields)
            ) {
              nestedStr += ':' + nestedSettings.fields.join(',')
            }
            includes.push(nestedStr)
          })
        }
      }
    })

    return includes.join(separator)
  }

  /**
   * Build filter string from configuration
   */
  static buildFilters(filters: Record<string, string | number | boolean | (string | number)[]>): string {
    return Object.entries(filters)
      .map(([key, value]) => {
        const filterValue = Array.isArray(value) ? value.join(',') : String(value)
        return `${key}:${filterValue}`
      })
      .join(';')
  }
}

/**
 * Common SportMonks filter types
 */
export const SportMonksFilters = {
  /**
   * Event type filters
   */
  EventTypes: {
    GOAL: 14,
    OWN_GOAL: 15,
    PENALTY: 16,
    MISSED_PENALTY: 17,
    YELLOW_CARD: 19,
    RED_CARD: 20,
    SUBSTITUTION: 18,
    VAR: 10,
  },

  /**
   * Fixture status filters
   */
  Status: {
    NOT_STARTED: 'NS',
    LIVE: 'LIVE',
    HALF_TIME: 'HT',
    FULL_TIME: 'FT',
    FINISHED: 'FT',
    CANCELLED: 'CANCL',
    POSTPONED: 'POSTP',
  },
} as const
