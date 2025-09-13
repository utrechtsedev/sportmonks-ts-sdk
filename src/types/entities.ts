import { LeagueType, LeagueSubType } from './enums'

/**
 * Country entity (partial, for relationships)
 */
export interface Country {
  id: number
  name: string
  official_name: string
  fifa_name: string | null
  iso2: string
  iso3: string
  latitude: string | null
  longitude: string | null
  borders: string[]
  image_path: string | null
}

/**
 * League entity with complete properties from API
 */
export interface League {
  id: number
  sport_id: number
  country_id: number
  name: string
  active: boolean
  short_code: string | null
  image_path: string | null
  type: LeagueType
  sub_type: LeagueSubType | null
  last_played_at: string | null
  category: number
  has_jerseys: boolean
  // Relationships (when included)
  country?: Country
  seasons?: Season[]
  currentSeason?: Season
  stages?: Stage[]
}

/**
 * Season entity (partial, for relationships)
 */
export interface Season {
  id: number
  sport_id: number
  league_id: number
  tie_breaker_rule_id: number
  name: string
  finished: boolean
  pending: boolean
  is_current: boolean
  starting_at: string
  ending_at: string
  standings_recalculated_at: string
  games_in_current_week: boolean
  // Relationships (when included)
  sport?: Sport,
  league?: League
  teams?: Team[]
  stages?: Stage[]
  fixures?: Fixture[]
  groups?: Group[]
  currentstage?: CurrentStage | null
  statistics?: SeasonStatistic | null
  topscorers?: Topscorers[] | null
  country?: Country
  venue?: Venue
  coaches?: Coach[]
  players?: Player[]
  rounds?: Round[]
}

/**
 * Stage entity (partial, for relationships)
 */
export interface Stage {
  id: number
  sport_id: number
  league_id: number
  season_id: number
  type_id: number
  name: string
  sort_order: number
  finished: boolean
  pending: boolean
  is_current: boolean
  starting_at: string | null
  ending_at: string | null
  games_in_current_week: boolean
  tie_breaker_rule_id: number | null
}

/**
 * Team entity
 */
export interface Team {
  id: number
  sport_id: number
  country_id: number
  venue_id: number
  gender: string
  name: string
  short_code: string | null
  image_path: string | null
  founded: number | null
  type: string
  placeholder: boolean
  last_played_at: string | null
  // Relationships
  country?: Country
  venue?: Venue
  squad?: SquadMember[]
  coach?: Coach
  latest?: Fixture[]
  player?: Player[]
  team?: Team[]
  detailedPosition?: Position[]
  transfers?: Transfer[]
}

/**
 * Player entity
 */
export interface Player {
  id: number
  sport_id: number
  country_id: number
  nationality_id: number
  city_id: number
  position_id: number
  detailed_position_id: number | null
  type_id: number
  common_name: string
  firstname: string
  lastname: string
  name: string
  display_name: string
  image_path: string | null
  height: number | null
  weight: number | null
  date_of_birth: string | null
  gender: string
  // Relationships
  country?: Country
  nationality?: Country
  position?: Position
  detailedposition?: Position
  statistics?: PlayerStatistic[]
  transfers?: Transfer[]
  trophies?: Trophy[]
}

/**
 * Fixture entity
 */
export interface Fixture {
  id: number
  sport_id: number
  league_id: number
  season_id: number
  stage_id: number
  group_id: number | null
  aggregate_id: number | null
  round_id: number | null
  state_id: number
  venue_id: number | null
  name: string
  starting_at: string
  result_info: string | null
  leg: string | null
  details: string | null
  length: number
  placeholder: boolean
  has_odds: boolean
  starting_at_timestamp: number
  // Relationships (when included)
  participants?: Team[]
  localteam?: Team
  visitorteam?: Team
  venue?: Venue
  referee?: Referee
  league?: League
  season?: Season
  stage?: Stage
  round?: Round
  state?: State
  sport?: Sport
  aggregate?: Aggregate
  group?: Group
  periods?: Period[]
  scores?: Score[]
  events?: Event[]
  statistics?: FixtureStatistic[]
  lineups?: Lineup[]
  bench?: Lineup[]
  comments?: Comment[]
  tvstations?: TvStation[]
  odds?: unknown
  predictions?: unknown
  valuebet?: unknown
  localteam_id?: number
  visitorteam_id?: number
}

/**
 * Squad member
 */
export interface SquadPlayer {
  id: number
  transfer_id: number | null
  player_id: number
  team_id: number
  position_id: number
  detailed_position_id: number | null
  start: string
  end: string | null
  captain: boolean
  jersey_number: number
  player?: Player
}

/**
 * Standing entity representing a team's position in a league table
 */
export interface Standing {
  id: number
  participant_id: number
  sport_id: number
  league_id: number
  season_id: number
  stage_id: number
  group_id: number | null
  round_id: number | null
  standing_rule_id: number
  position: number
  result: string | null
  points: number
  // Basic stats that might be included in the response
  wins?: number
  draws?: number
  losses?: number
  goals_for?: number
  goals_against?: number
  goal_difference?: number
  // Relationships
  participant?: Team
  league?: League
  season?: Season
  details?: StandingDetail[]
  // Home/Away splits (if included)
  home?: StandingDetail
  away?: StandingDetail
}

/**
 * Standing detail/statistics
 */
export interface StandingDetail {
  id: number
  standing_id: number
  standing_type: string
  position: number
  points: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  games_played?: number
}

/**
 * Standing correction entity
 */
export interface StandingCorrection {
  id: number
  participant_id: number
  league_id: number
  season_id: number
  stage_id: number
  group_id: number | null
  type?: string
  value: number
  calc_type?: string
  active?: boolean
  description?: string | null
  // Relationships
  participant?: Team
}

/**
 * Coach entity
 */
export interface Coach {
  id: number
  sport_id: number
  country_id: number
  nationality_id: number
  city_id: number | null
  common_name: string
  firstname: string
  lastname: string
  name: string
  display_name: string
  image_path: string | null
  date_of_birth: string | null
  gender: string
  // Relationships
  country?: Country
  nationality?: Country
  teams?: Team[]
}

/**
 * Referee entity
 */
export interface Referee {
  id: number
  sport_id: number
  country_id: number | null
  city_id: number | null
  common_name: string
  firstname: string
  lastname: string
  name: string
  display_name: string
  image_path: string | null
  height: number | null
  weight: number | null
  date_of_birth: string | null
  gender: string
  // Relationships
  country?: Country
}

/**
 * Transfer type entity
 */
export interface TransferType {
  id: number
  name: string
  code: string
  developer_name: string
  model_type: string
  stat_group: string | null
}

/**
 * Transfer entity
 */
export interface Transfer {
  id: number
  sport_id: number
  player_id: number
  type_id: number
  from_team_id: number
  to_team_id: number
  position_id: number
  detailed_position_id: number | null
  date: string
  career_ended: boolean
  completed: boolean
  amount: number | null
  // Relationships
  player?: Player
  fromteam?: Team
  toteam?: Team
  type?: TransferType
}

/**
 * Venue entity
 */
export interface Venue {
  id: number
  country_id: number
  city_id: number
  name: string
  address: string | null
  zipcode: string | null
  latitude: string | null
  longitude: string | null
  capacity: number | null
  image_path: string | null
  city_name: string | null
  surface: string | null
  national_team: boolean
  // Relationships
  country?: Country
}

/**
 * Round entity
 */
export interface Round {
  id: number
  sport_id: number
  league_id: number
  season_id: number
  stage_id: number
  name: string
  finished: boolean
  is_current: boolean
  starting_at: string | null
  ending_at: string | null
  games_in_current_week: boolean
  // Relationships
  fixtures?: Fixture[]
}

/**
 * Score entity
 */
export interface Score {
  id: number
  fixture_id: number
  type_id: number
  participant_id: number
  score: {
    goals: number
    participant: string
  }
  description: string
}

/**
 * Event entity (goals, cards, substitutions, etc.)
 */
export interface Event {
  id: number
  fixture_id: number
  type_id: number
  player_id: number
  player_name: string
  related_player_id: number | null
  related_player_name: string | null
  minute: number
  extra_minute: number | null
  reason: string | null
  injuried: boolean | null
  result: string | null
}

/**
 * Fixture statistic
 */
export interface FixtureStatistic {
  id: number
  fixture_id: number
  type_id: number
  participant_id: number
  data: {
    value: number
  }
}

/**
 * Lineup entity
 */
export interface Lineup {
  id: number
  fixture_id: number
  player_id: number
  team_id: number
  position_id: number
  formation_position: number | null
  type_id: number
  jersey_number: number
  captain: boolean
  minutes_played: number | null
  player?: Player
  stats?: unknown
}

/**
 * Match Event entity (modern API version)
 */
export interface MatchEvent {
  id: number
  fixture_id: number
  period_id: number
  participant_id: number
  type_id: number
  section: string
  player_id: number
  related_player_id: number | null
  player_name: string
  related_player_name: string | null
  result: string | null
  info: string | null
  addition: string | null
  minute: number
  extra_minute: number | null
  injured: boolean
  on_bench: boolean
  // Relationships
  type?: EventType
  player?: Player
  relatedplayer?: Player
}

/**
 * Event type entity
 */
export interface EventType {
  id: number
  name: string
  code: string
  developer_name: string
  model_type: string
  stat_group: string | null
}

/**
 * Position entity
 */
export interface Position {
  id: number
  name: string
  code: string
  developer_name: string
  model_type: string
}

/**
 * Squad member entity
 */
export interface SquadMember {
  id: number
  transfer_id: number | null
  player_id: number
  team_id: number
  position_id: number
  detailed_position_id: number | null
  start: string
  end: string | null
  captain: boolean
  jersey_number: number
  // Relationships
  player?: Player
  position?: Position
}

/**
 * Player statistic entity
 */
export interface PlayerStatistic {
  id: number
  player_id: number
  team_id: number
  season_id: number
  position_id: number
  has_values: boolean
  // Statistics data would be included here
  details?: unknown
}

/**
 * Trophy entity
 */
export interface Trophy {
  id: number
  name: string
  league_id: number
  season_id: number
  team_id: number
  player_id: number
}

/**
 * Comment entity
 */
export interface Comment {
  id: number
  fixture_id: number
  player_id: number | null
  comment: string
  minute: number
  extra_minute: number | null
  is_goal: boolean
  is_important: boolean
  order: number
}

/**
 * TV Station entity
 */
export interface TvStation {
  id: number
  name: string
  url: string | null
  image_path: string | null
  type: string | null
  related_id: number | null
}

/**
 * Sport entity
 */
export interface Sport {
  id: number
  name: string
  type: string
}

/**
 * State entity for fixture states
 */
export interface State {
  id: number
  state: string
  name: string
  short_name: string
  developer_name: string
}

/**
 * Period entity for fixture periods
 */
export interface Period {
  id: number
  fixture_id: number
  type_id: number
  started: number
  ended: number | null
  counts_from: number
  ticking: boolean
  sort_order: number
  description: string | null
  time_added: number | null
  period_length: number | null
  minutes: number | null
  seconds: number | null
}

/**
 * Aggregate entity for two-legged fixtures
 */
export interface Aggregate {
  id: number
  league_id: number
  season_id: number
  stage_id: number
  name: string | null
  result: string | null
  winner_id: number | null
}

/**
 * Group entity for tournament groups
 */
export interface Group {
  id: number
  sport_id: number
  league_id: number
  season_id: number
  stage_id: number
  name: string
  starting_at: string | null
  ending_at: string | null
  games_in_current_week: boolean
  is_current: boolean
  sort_order: number | null
  finished: boolean | null
  pending: boolean | null
}

/**
 * News article entity (pre-match and post-match).
 */
export interface NewsArticle {
  id: number
  fixture_id: number | null
  league_id: number | null
  season_id: number | null
  title: string
  content: string
  type: 'prematch' | 'postmatch'
  published_at: string
  source: string | null
  url: string | null

  // Relationships (when included)
  fixture?: Fixture
  league?: League
  season?: Season
}
/**
 * Entity for current season stage
 */
export interface CurrentStage {
  id: number
  sport_id: number
  league_id: number
  season_id: number
  type_id: number
  name: string
  sort_order: number
  finished: boolean
  is_current: boolean
  starting_at: string
  ending_at: string
  games_in_current_week: boolean
  tie_breaker_rule_id: number
  // temporary solution for nested includes
  [key: string]: any;
}
/**
 * Season statistic entity
 */
interface SeasonStatistic {
  id: number;
  model_id: number;
  type_id: number;
  relation_id: number | null;
  type: string;
  value: Record<string, any>;
}
/**
 * Season topscorers entity
 */
interface Topscorers {
  id: number
  season_id: number
  player_id: number
  type_id: number
  position: number
  total: number
  participant_id: number
  // temporary solution for nested includes
  [key: string]: any;
}
