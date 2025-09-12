import { RateLimit, Subscription } from './common'

/**
 * League types
 */
export enum LeagueType {
  LEAGUE = 'league',
  CUP = 'cup',
  SUPER_CUP = 'super_cup',
  FRIENDLY = 'friendly',
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
  PLAYOFFS = 'playoffs',
}

/**
 * League sub-types
 */
export enum LeagueSubType {
  TOP_LEVEL = 'top_level',
  SECOND_LEVEL = 'second_level',
  THIRD_LEVEL = 'third_level',
  FOURTH_LEVEL = 'fourth_level',
  FIFTH_LEVEL = 'fifth_level',
  PLAYOFF = 'playoff',
  AMATEUR = 'amateur',
  YOUTH = 'youth',
  WOMEN = 'women',
}

/**
 * Fixture status/state enumeration
 */
export enum FixtureStatus {
  NS = 1, // Not Started
  LIVE = 2, // Live/In Progress
  HT = 3, // Half Time
  FT = 5, // Full Time
  AET = 6, // After Extra Time
  FT_PEN = 7, // Full Time after Penalties
  CANC = 8, // Cancelled
  POSTP = 9, // Postponed
  INT = 10, // Interrupted
  ABAN = 11, // Abandoned
  SUSP = 12, // Suspended
  AWARDED = 13, // Awarded
  DELAYED = 14, // Delayed
  TBA = 15, // To Be Announced
  WO = 16, // Walk Over
  AU = 17, // Awaiting Updates
  AP = 18, // After Penalties
}

/**
 * Event types from SportMonks API
 */
export enum EventTypeId {
  VAR = 10,
  GOAL = 14,
  OWNGOAL = 15,
  PENALTY = 16,
  MISSED_PENALTY = 17,
  SUBSTITUTION = 18,
  YELLOWCARD = 19,
  REDCARD = 20,
  YELLOWREDCARD = 21,
  PENALTY_SHOOTOUT_MISS = 22,
  PENALTY_SHOOTOUT_GOAL = 23,
  CORNER = 126,
  OFFSIDE = 568,
  SHOT_ON_TARGET = 569,
  SHOT_OFF_TARGET = 570,
  VAR_CARD = 1697,
  WOODWORK = 48995,
}

/**
 * Common fixture statistics type IDs
 */
export enum FixtureStatisticTypeId {
  BALL_POSSESSION = 45,
  SHOTS_ON_TARGET = 86,
  SHOTS_TOTAL = 42,
  SHOTS_OFF_TARGET = 41,
  CORNERS = 34,
  OFFSIDES = 51,
  FOULS = 56,
  YELLOWCARDS = 84,
  REDCARDS = 83,
  PASSES = 80,
  SUCCESSFUL_PASSES = 81,
  SUCCESSFUL_PASSES_PERCENTAGE = 82,
  ATTACKS = 43,
  DANGEROUS_ATTACKS = 44,
  GOALS = 52,
  SAVES = 57,
  EXPECTED_GOALS = 5304, // xG
  EXPECTED_GOALS_ON_TARGET = 5305, // xGoT
}

/**
 * Player position types
 */
export enum PositionType {
  GOALKEEPER = 1,
  DEFENDER = 2,
  MIDFIELDER = 3,
  ATTACKER = 4,
}

/**
 * Team type
 */
export enum TeamType {
  DOMESTIC = 'domestic',
  NATIONAL = 'national',
}

/**
 * Gender types
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

/**
 * Lineup types
 */
export enum LineupType {
  LINEUP = 11,
  BENCH = 12,
  SIDELINED = 13,
  MISSING = 14,
}

/**
 * Transfer types
 */
export enum TransferTypeEnum {
  TRANSFER = 'transfer',
  LOAN = 'loan',
  FREE = 'free',
}

/**
 * Standing rules
 */
export enum StandingRule {
  POINTS = 1,
  GOAL_DIFFERENCE = 2,
  HEAD_TO_HEAD = 3,
  GOALS_FOR = 4,
  AWAY_GOALS = 5,
  WINS = 6,
  DRAWS = 7,
  LOSSES = 8,
}

/**
 * Score types
 */
export enum ScoreType {
  CURRENT = 1208,
  HALFTIME = 1209,
  NORMALTIME = 1456,
  EXTRATIME = 1457,
  PENALTIES = 1458,
  AGGREGATED = 1713,
}

/**
 * Venue surface types
 */
export enum VenueSurface {
  GRASS = 'grass',
  ARTIFICIAL = 'artificial',
  HYBRID = 'hybrid',
  ASTROTURF = 'astroturf',
  CONCRETE = 'concrete',
  GRAVEL = 'gravel',
}

/**
 * Sort order
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Player statistic detail types
 */
export enum PlayerStatisticType {
  MINUTES_PLAYED = 90,
  GOALS = 208,
  ASSISTS = 209,
  OFFSIDES = 210,
  SHOTS_TOTAL = 211,
  SHOTS_ON_TARGET = 217,
  GOALS_CONCEDED = 220,
  PENALTIES = 215,
  PENALTIES_SCORED = 216,
  PENALTIES_MISSED = 218,
  PENALTIES_SAVED = 223,
  SAVES = 214,
  YELLOWCARDS = 212,
  REDCARDS = 213,
  HIT_WOODWORK = 602,
  PASSES = 595,
  PASSES_ACCURATE = 596,
  CLEANSHEETS = 597,
  TACKLES = 598,
  FOULS_COMMITTED = 594,
}

/**
 * Response metadata interfaces
 */
export interface ResponseMetadata {
  rate_limit?: RateLimit
  subscription?: Subscription
  plan?: {
    name: string
    features: string[]
    request_limit: number
    sport: string
  }
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  message: string
  error?: {
    code: number
    message: string
  }
  errors?: Record<string, string[]>
}
