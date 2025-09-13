import { AxiosInstance } from 'axios';

/**
 * Retry configuration options
 */
interface RetryOptions {
    /** Maximum number of retry attempts */
    maxRetries?: number;
    /** Initial delay between retries in milliseconds */
    retryDelay?: number;
    /** Maximum delay between retries in milliseconds */
    maxRetryDelay?: number;
    /** Whether to retry on rate limit errors (429) */
    retryOnRateLimit?: boolean;
    /** Status codes to retry on */
    retryStatusCodes?: number[];
}
/**
 * Configuration options for the SportMonks client
 */
interface SportMonksClientOptions {
    /** Base URL for API requests */
    baseUrl?: string;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** API version */
    version?: string;
    /** Include query parameter separator */
    includeSeparator?: string;
    /** Retry configuration */
    retry?: RetryOptions;
    /** Timezone options */
    timezone?: string;
}
/**
 * Pagination information returned by the API
 */
interface Pagination {
    count: number;
    per_page: number;
    current_page: number;
    next_page: number | null;
    has_more: boolean;
}
/**
 * Rate limit information
 */
interface RateLimit {
    resets_in_seconds: number;
    remaining: number;
    requested_entity: string;
}
/**
 * Subscription plan details
 */
interface SubscriptionPlan {
    plan: string;
    sport: string;
    category: string;
}
/**
 * Subscription information
 */
interface Subscription {
    meta: unknown[];
    plans: SubscriptionPlan[];
    add_ons: unknown[];
    widgets: unknown[];
}
/**
 * Generic paginated response interface
 */
interface PaginatedResponse<T> {
    data: T[];
    pagination?: Pagination;
    subscription?: Subscription;
    rate_limit?: RateLimit;
    timezone?: string;
}
/**
 * Generic single item response interface
 */
interface SingleResponse<T> {
    data: T;
    subscription?: Subscription;
    rate_limit?: RateLimit;
    timezone?: string;
}
/**
 * Query parameters supported by most endpoints
 */
interface QueryParameters {
    include?: string;
    filters?: string;
    select?: string;
    order?: string;
    has?: string;
    page?: number;
    limit?: number;
    per_page?: number;
    [key: string]: string | number | boolean | undefined;
}

/**
 * League types
 */
declare enum LeagueType {
    LEAGUE = "league",
    CUP = "cup",
    SUPER_CUP = "super_cup",
    FRIENDLY = "friendly",
    DOMESTIC = "domestic",
    INTERNATIONAL = "international",
    PLAYOFFS = "playoffs"
}
/**
 * League sub-types
 */
declare enum LeagueSubType {
    TOP_LEVEL = "top_level",
    SECOND_LEVEL = "second_level",
    THIRD_LEVEL = "third_level",
    FOURTH_LEVEL = "fourth_level",
    FIFTH_LEVEL = "fifth_level",
    PLAYOFF = "playoff",
    AMATEUR = "amateur",
    YOUTH = "youth",
    WOMEN = "women"
}
/**
 * Fixture status/state enumeration
 */
declare enum FixtureStatus {
    NS = 1,// Not Started
    LIVE = 2,// Live/In Progress
    HT = 3,// Half Time
    FT = 5,// Full Time
    AET = 6,// After Extra Time
    FT_PEN = 7,// Full Time after Penalties
    CANC = 8,// Cancelled
    POSTP = 9,// Postponed
    INT = 10,// Interrupted
    ABAN = 11,// Abandoned
    SUSP = 12,// Suspended
    AWARDED = 13,// Awarded
    DELAYED = 14,// Delayed
    TBA = 15,// To Be Announced
    WO = 16,// Walk Over
    AU = 17,// Awaiting Updates
    AP = 18
}
/**
 * Event types from SportMonks API
 */
declare enum EventTypeId {
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
    WOODWORK = 48995
}
/**
 * Common fixture statistics type IDs
 */
declare enum FixtureStatisticTypeId {
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
    EXPECTED_GOALS = 5304,// xG
    EXPECTED_GOALS_ON_TARGET = 5305
}
/**
 * Player position types
 */
declare enum PositionType {
    GOALKEEPER = 1,
    DEFENDER = 2,
    MIDFIELDER = 3,
    ATTACKER = 4
}
/**
 * Team type
 */
declare enum TeamType {
    DOMESTIC = "domestic",
    NATIONAL = "national"
}
/**
 * Gender types
 */
declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
/**
 * Lineup types
 */
declare enum LineupType {
    LINEUP = 11,
    BENCH = 12,
    SIDELINED = 13,
    MISSING = 14
}
/**
 * Transfer types
 */
declare enum TransferTypeEnum {
    TRANSFER = "transfer",
    LOAN = "loan",
    FREE = "free"
}
/**
 * Standing rules
 */
declare enum StandingRule {
    POINTS = 1,
    GOAL_DIFFERENCE = 2,
    HEAD_TO_HEAD = 3,
    GOALS_FOR = 4,
    AWAY_GOALS = 5,
    WINS = 6,
    DRAWS = 7,
    LOSSES = 8
}
/**
 * Score types
 */
declare enum ScoreType {
    CURRENT = 1208,
    HALFTIME = 1209,
    NORMALTIME = 1456,
    EXTRATIME = 1457,
    PENALTIES = 1458,
    AGGREGATED = 1713
}
/**
 * Venue surface types
 */
declare enum VenueSurface {
    GRASS = "grass",
    ARTIFICIAL = "artificial",
    HYBRID = "hybrid",
    ASTROTURF = "astroturf",
    CONCRETE = "concrete",
    GRAVEL = "gravel"
}
/**
 * Sort order
 */
declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
/**
 * Player statistic detail types
 */
declare enum PlayerStatisticType {
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
    FOULS_COMMITTED = 594
}
/**
 * Response metadata interfaces
 */
interface ResponseMetadata {
    rate_limit?: RateLimit;
    subscription?: Subscription;
    plan?: {
        name: string;
        features: string[];
        request_limit: number;
        sport: string;
    };
}
/**
 * Error response structure
 */
interface ErrorResponse {
    message: string;
    error?: {
        code: number;
        message: string;
    };
    errors?: Record<string, string[]>;
}

/**
 * Country entity (partial, for relationships)
 */
interface Country {
    id: number;
    name: string;
    official_name: string;
    fifa_name: string | null;
    iso2: string;
    iso3: string;
    latitude: string | null;
    longitude: string | null;
    borders: string[];
    image_path: string | null;
}
/**
 * League entity with complete properties from API
 */
interface League {
    id: number;
    sport_id: number;
    country_id: number;
    name: string;
    active: boolean;
    short_code: string | null;
    image_path: string | null;
    type: LeagueType;
    sub_type: LeagueSubType | null;
    last_played_at: string | null;
    category: number;
    has_jerseys: boolean;
    country?: Country;
    seasons?: Season[];
    currentSeason?: Season;
    stages?: Stage[];
}
/**
 * Season entity (partial, for relationships)
 */
interface Season {
    id: number;
    sport_id: number;
    league_id: number;
    tie_breaker_rule_id: number;
    name: string;
    finished: boolean;
    pending: boolean;
    is_current: boolean;
    starting_at: string;
    ending_at: string;
    standings_recalculated_at: string;
    games_in_current_week: boolean;
    sport?: Sport;
    league?: League;
    teams?: Team[];
    stages?: Stage[];
    fixures?: Fixture[];
    groups?: Group[];
    currentstage?: CurrentStage | null;
    statistics?: SeasonStatistic | null;
    topscorers?: Topscorers[] | null;
    country?: Country;
    venue?: Venue;
    coaches?: Coach[];
    players: Player[];
}
/**
 * Stage entity (partial, for relationships)
 */
interface Stage {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    type_id: number;
    name: string;
    sort_order: number;
    finished: boolean;
    pending: boolean;
    is_current: boolean;
    starting_at: string | null;
    ending_at: string | null;
    games_in_current_week: boolean;
    tie_breaker_rule_id: number | null;
}
/**
 * Team entity
 */
interface Team {
    id: number;
    sport_id: number;
    country_id: number;
    venue_id: number;
    gender: string;
    name: string;
    short_code: string | null;
    image_path: string | null;
    founded: number | null;
    type: string;
    placeholder: boolean;
    last_played_at: string | null;
    country?: Country;
    venue?: Venue;
    squad?: SquadMember[];
    coach?: Coach;
    latest?: Fixture[];
    player?: Player[];
    team?: Team[];
    detailedPosition?: Position[];
    transfers?: Transfer[];
}
/**
 * Player entity
 */
interface Player {
    id: number;
    sport_id: number;
    country_id: number;
    nationality_id: number;
    city_id: number;
    position_id: number;
    detailed_position_id: number | null;
    type_id: number;
    common_name: string;
    firstname: string;
    lastname: string;
    name: string;
    display_name: string;
    image_path: string | null;
    height: number | null;
    weight: number | null;
    date_of_birth: string | null;
    gender: string;
    country?: Country;
    nationality?: Country;
    position?: Position;
    detailedposition?: Position;
    statistics?: PlayerStatistic[];
    transfers?: Transfer[];
    trophies?: Trophy[];
}
/**
 * Fixture entity
 */
interface Fixture {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    group_id: number | null;
    aggregate_id: number | null;
    round_id: number | null;
    state_id: number;
    venue_id: number | null;
    name: string;
    starting_at: string;
    result_info: string | null;
    leg: string | null;
    details: string | null;
    length: number;
    placeholder: boolean;
    has_odds: boolean;
    starting_at_timestamp: number;
    participants?: Team[];
    localteam?: Team;
    visitorteam?: Team;
    venue?: Venue;
    referee?: Referee;
    league?: League;
    season?: Season;
    stage?: Stage;
    round?: Round;
    state?: State;
    sport?: Sport;
    aggregate?: Aggregate;
    group?: Group;
    periods?: Period[];
    scores?: Score[];
    events?: Event[];
    statistics?: FixtureStatistic[];
    lineups?: Lineup[];
    bench?: Lineup[];
    comments?: Comment[];
    tvstations?: TvStation[];
    odds?: unknown;
    predictions?: unknown;
    valuebet?: unknown;
    localteam_id?: number;
    visitorteam_id?: number;
}
/**
 * Squad member
 */
interface SquadPlayer {
    id: number;
    transfer_id: number | null;
    player_id: number;
    team_id: number;
    position_id: number;
    detailed_position_id: number | null;
    start: string;
    end: string | null;
    captain: boolean;
    jersey_number: number;
    player?: Player;
}
/**
 * Standing entity representing a team's position in a league table
 */
interface Standing {
    id: number;
    participant_id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    group_id: number | null;
    round_id: number | null;
    standing_rule_id: number;
    position: number;
    result: string | null;
    points: number;
    wins?: number;
    draws?: number;
    losses?: number;
    goals_for?: number;
    goals_against?: number;
    goal_difference?: number;
    participant?: Team;
    league?: League;
    season?: Season;
    details?: StandingDetail[];
    home?: StandingDetail;
    away?: StandingDetail;
}
/**
 * Standing detail/statistics
 */
interface StandingDetail {
    id: number;
    standing_id: number;
    standing_type: string;
    position: number;
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    games_played?: number;
}
/**
 * Standing correction entity
 */
interface StandingCorrection {
    id: number;
    participant_id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    group_id: number | null;
    type?: string;
    value: number;
    calc_type?: string;
    active?: boolean;
    description?: string | null;
    participant?: Team;
}
/**
 * Coach entity
 */
interface Coach {
    id: number;
    sport_id: number;
    country_id: number;
    nationality_id: number;
    city_id: number | null;
    common_name: string;
    firstname: string;
    lastname: string;
    name: string;
    display_name: string;
    image_path: string | null;
    date_of_birth: string | null;
    gender: string;
    country?: Country;
    nationality?: Country;
    teams?: Team[];
}
/**
 * Referee entity
 */
interface Referee {
    id: number;
    sport_id: number;
    country_id: number | null;
    city_id: number | null;
    common_name: string;
    firstname: string;
    lastname: string;
    name: string;
    display_name: string;
    image_path: string | null;
    height: number | null;
    weight: number | null;
    date_of_birth: string | null;
    gender: string;
    country?: Country;
}
/**
 * Transfer type entity
 */
interface TransferType {
    id: number;
    name: string;
    code: string;
    developer_name: string;
    model_type: string;
    stat_group: string | null;
}
/**
 * Transfer entity
 */
interface Transfer {
    id: number;
    sport_id: number;
    player_id: number;
    type_id: number;
    from_team_id: number;
    to_team_id: number;
    position_id: number;
    detailed_position_id: number | null;
    date: string;
    career_ended: boolean;
    completed: boolean;
    amount: number | null;
    player?: Player;
    fromteam?: Team;
    toteam?: Team;
    type?: TransferType;
}
/**
 * Venue entity
 */
interface Venue {
    id: number;
    country_id: number;
    city_id: number;
    name: string;
    address: string | null;
    zipcode: string | null;
    latitude: string | null;
    longitude: string | null;
    capacity: number | null;
    image_path: string | null;
    city_name: string | null;
    surface: string | null;
    national_team: boolean;
    country?: Country;
}
/**
 * Round entity
 */
interface Round {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    name: string;
    finished: boolean;
    is_current: boolean;
    starting_at: string | null;
    ending_at: string | null;
    games_in_current_week: boolean;
}
/**
 * Score entity
 */
interface Score {
    id: number;
    fixture_id: number;
    type_id: number;
    participant_id: number;
    score: {
        goals: number;
        participant: string;
    };
    description: string;
}
/**
 * Event entity (goals, cards, substitutions, etc.)
 */
interface Event {
    id: number;
    fixture_id: number;
    type_id: number;
    player_id: number;
    player_name: string;
    related_player_id: number | null;
    related_player_name: string | null;
    minute: number;
    extra_minute: number | null;
    reason: string | null;
    injuried: boolean | null;
    result: string | null;
}
/**
 * Fixture statistic
 */
interface FixtureStatistic {
    id: number;
    fixture_id: number;
    type_id: number;
    participant_id: number;
    data: {
        value: number;
    };
}
/**
 * Lineup entity
 */
interface Lineup {
    id: number;
    fixture_id: number;
    player_id: number;
    team_id: number;
    position_id: number;
    formation_position: number | null;
    type_id: number;
    jersey_number: number;
    captain: boolean;
    minutes_played: number | null;
    player?: Player;
    stats?: unknown;
}
/**
 * Match Event entity (modern API version)
 */
interface MatchEvent {
    id: number;
    fixture_id: number;
    period_id: number;
    participant_id: number;
    type_id: number;
    section: string;
    player_id: number;
    related_player_id: number | null;
    player_name: string;
    related_player_name: string | null;
    result: string | null;
    info: string | null;
    addition: string | null;
    minute: number;
    extra_minute: number | null;
    injured: boolean;
    on_bench: boolean;
    type?: EventType;
    player?: Player;
    relatedplayer?: Player;
}
/**
 * Event type entity
 */
interface EventType {
    id: number;
    name: string;
    code: string;
    developer_name: string;
    model_type: string;
    stat_group: string | null;
}
/**
 * Position entity
 */
interface Position {
    id: number;
    name: string;
    code: string;
    developer_name: string;
    model_type: string;
}
/**
 * Squad member entity
 */
interface SquadMember {
    id: number;
    transfer_id: number | null;
    player_id: number;
    team_id: number;
    position_id: number;
    detailed_position_id: number | null;
    start: string;
    end: string | null;
    captain: boolean;
    jersey_number: number;
    player?: Player;
    position?: Position;
}
/**
 * Player statistic entity
 */
interface PlayerStatistic {
    id: number;
    player_id: number;
    team_id: number;
    season_id: number;
    position_id: number;
    has_values: boolean;
    details?: unknown;
}
/**
 * Trophy entity
 */
interface Trophy {
    id: number;
    name: string;
    league_id: number;
    season_id: number;
    team_id: number;
    player_id: number;
}
/**
 * Comment entity
 */
interface Comment {
    id: number;
    fixture_id: number;
    player_id: number | null;
    comment: string;
    minute: number;
    extra_minute: number | null;
    is_goal: boolean;
    is_important: boolean;
    order: number;
}
/**
 * TV Station entity
 */
interface TvStation {
    id: number;
    name: string;
    url: string | null;
    image_path: string | null;
    type: string | null;
    related_id: number | null;
}
/**
 * Sport entity
 */
interface Sport {
    id: number;
    name: string;
    type: string;
}
/**
 * State entity for fixture states
 */
interface State {
    id: number;
    state: string;
    name: string;
    short_name: string;
    developer_name: string;
}
/**
 * Period entity for fixture periods
 */
interface Period {
    id: number;
    fixture_id: number;
    type_id: number;
    started: number;
    ended: number | null;
    counts_from: number;
    ticking: boolean;
    sort_order: number;
    description: string | null;
    time_added: number | null;
    period_length: number | null;
    minutes: number | null;
    seconds: number | null;
}
/**
 * Aggregate entity for two-legged fixtures
 */
interface Aggregate {
    id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    name: string | null;
    result: string | null;
    winner_id: number | null;
}
/**
 * Group entity for tournament groups
 */
interface Group {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    name: string;
    starting_at: string | null;
    ending_at: string | null;
    games_in_current_week: boolean;
    is_current: boolean;
    sort_order: number | null;
    finished: boolean | null;
    pending: boolean | null;
}
/**
 * News article entity (pre-match and post-match).
 */
interface NewsArticle {
    id: number;
    fixture_id: number | null;
    league_id: number | null;
    season_id: number | null;
    title: string;
    content: string;
    type: 'prematch' | 'postmatch';
    published_at: string;
    source: string | null;
    url: string | null;
    fixture?: Fixture;
    league?: League;
    season?: Season;
}
/**
 * Entity for current season stage
 */
interface CurrentStage {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    type_id: number;
    name: string;
    sort_order: number;
    finished: boolean;
    is_current: boolean;
    starting_at: string;
    ending_at: string;
    games_in_current_week: boolean;
    tie_breaker_rule_id: number;
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
    id: number;
    season_id: number;
    player_id: number;
    type_id: number;
    position: number;
    total: number;
    participant_id: number;
    [key: string]: any;
}

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
type SportMonksInclude = string;
/**
 * SportMonks Filter Syntax
 *
 * Examples:
 * - Single filter: "eventTypes:15"
 * - Multiple values: "eventTypes:15,16,17"
 * - Multiple filters: "eventTypes:15;position:1"
 */
type SportMonksFilter = string;
/**
 * Include configuration for a relation
 */
interface IncludeConfig {
    /**
     * Fields to select from the relation
     * If true, includes all fields
     * If array, includes only specified fields
     */
    fields?: string[] | boolean;
    /**
     * Nested includes for this relation
     */
    nested?: Record<string, IncludeConfig>;
}
/**
 * SportMonks query syntax configuration
 */
interface SportMonksSyntax {
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
    includes?: Record<string, IncludeConfig | boolean>;
    /**
     * Filter configuration
     * @example
     * {
     *   eventTypes: [15, 16, 17],
     *   position: 1
     * }
     */
    filters?: Record<string, string | number | boolean | (string | number)[]>;
    /**
     * Fields to select on the base entity
     * @example ['id', 'name', 'country_id']
     */
    select?: string[];
}
/**
 * Helper to build SportMonks include syntax
 */
declare class SportMonksSyntaxBuilder {
    /**
     * Build include string from configuration
     */
    static buildIncludes(config: Record<string, IncludeConfig | boolean>, separator?: string): string;
    /**
     * Build filter string from configuration
     */
    static buildFilters(filters: Record<string, string | number | boolean | (string | number)[]>): string;
}
/**
 * Common SportMonks filter types
 */
declare const SportMonksFilters: {
    /**
     * Event type filters
     */
    readonly EventTypes: {
        readonly GOAL: 14;
        readonly OWN_GOAL: 15;
        readonly PENALTY: 16;
        readonly MISSED_PENALTY: 17;
        readonly YELLOW_CARD: 19;
        readonly RED_CARD: 20;
        readonly SUBSTITUTION: 18;
        readonly VAR: 10;
    };
    /**
     * Fixture status filters
     */
    readonly Status: {
        readonly NOT_STARTED: "NS";
        readonly LIVE: "LIVE";
        readonly HALF_TIME: "HT";
        readonly FULL_TIME: "FT";
        readonly FINISHED: "FT";
        readonly CANCELLED: "CANCL";
        readonly POSTPONED: "POSTP";
    };
};

/**
 * Base resource class that all resource-specific classes extend
 */
declare abstract class BaseResource {
    protected client: AxiosInstance;
    protected basePath: string;
    protected includeSeparator: string;
    protected retryOptions: RetryOptions;
    constructor(client: AxiosInstance, basePath: string, includeSeparator?: string, retryOptions?: RetryOptions);
    /**
     * Make a request to the API with optional retry logic
     */
    protected request<T>(endpoint: string, params?: QueryParameters): Promise<T>;
    /**
     * Determine if a request should be retried
     */
    private shouldRetry;
    /**
     * Handle and transform errors
     */
    private handleError;
    /**
     * Sleep for a specified number of milliseconds
     */
    private sleep;
}

/**
 * Advanced query builder for constructing API requests with method chaining
 */
declare class QueryBuilder<T> {
    protected resource: BaseResource;
    protected endpoint: string;
    protected queryParams: QueryParameters;
    protected includeParams: string[];
    protected selectFields: string[];
    protected filterParams: Record<string, string | number | boolean>;
    protected orderParams: string[];
    protected hasParams: string[];
    constructor(resource: BaseResource, endpoint: string);
    /**
     * Include related resources in the response
     * @param includes Array of relationship names, dot notation for nested includes, or field selection
     * @example .include(['country', 'seasons.stages'])
     * @example .include(['lineups:player_name', 'events:player_name,related_player_name,minute'])
     * @example .include(['lineups;events;participants']) // Multiple includes with semicolon
     */
    include(includes: string[] | string): QueryBuilder<T>;
    /**
     * Include a relation with specific field selection
     * @param relation The relation name
     * @param fields Array of fields to select from the relation
     * @example .includeFields('lineups', ['player_name', 'jersey_number'])
     * @example .includeFields('events', ['player_name', 'related_player_name', 'minute'])
     */
    includeFields(relation: string, fields: string[]): QueryBuilder<T>;
    /**
     * Select specific fields to include in the response
     * @param fields Array of field names
     * @example .select(['id', 'name', 'country_id'])
     */
    select(fields: string[]): QueryBuilder<T>;
    /**
     * Add a filter parameter to the request
     * @example .filter('name', 'Premier League')
     * @example .filter('active', true)
     * @example .filter('eventTypes', [15, 16]) // Multiple values
     */
    filter(key: string, value: string | number | boolean | (string | number)[]): QueryBuilder<T>;
    /**
     * Add multiple filters at once
     * @example .filters({ active: true, country_id: 462 })
     */
    filters(filters: Record<string, string | number | boolean>): QueryBuilder<T>;
    /**
     * Add sorting to the results
     * @param field Field name with optional - prefix for descending
     * @example .orderBy('name') or .orderBy('-created_at')
     */
    orderBy(field: string): QueryBuilder<T>;
    /**
     * Filter results that have specific relationships
     * @param relationships Array of relationship names
     * @example .has(['seasons'])
     */
    has(relationships: string[]): QueryBuilder<T>;
    /**
     * Set the page number for paginated results
     */
    page(page: number): QueryBuilder<T>;
    /**
     * Set the number of items per page
     */
    limit(limit: number): QueryBuilder<T>;
    /**
     * Set the number of items per page (alias for limit)
     */
    perPage(perPage: number): QueryBuilder<T>;
    /**
     * Execute the API request and return the results
     */
    get(): Promise<T>;
    /**
     * Build complex includes with SportMonks syntax
     * @param includes Object defining includes with optional field selection
     * @example .withIncludes({
     *   lineups: ['player_name', 'jersey_number'],
     *   events: ['player_name', 'related_player_name', 'minute'],
     *   participants: true  // Include all fields
     * })
     */
    withIncludes(includes: Record<string, string[] | boolean>): QueryBuilder<T>;
    /**
     * Get all pages of results (be careful with rate limits!)
     */
    getAll(): Promise<T[]>;
}

/**
 * Leagues resource with all available endpoints
 */
declare class LeaguesResource extends BaseResource {
    /**
     * Get all leagues
     * @example
     * const leagues = await api.leagues.all()
     *   .include(['country', 'currentSeason'])
     *   .filter('active', true)
     *   .orderBy('name')
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<League>>;
    /**
     * Get a league by ID
     * @param id The league ID
     * @example
     * const league = await api.leagues.byId(271)
     *   .include(['country', 'seasons', 'stages'])
     *   .get();
     */
    byId(id: string | number): QueryBuilder<SingleResponse<League>>;
    /**
     * Get leagues by country ID
     * @param countryId The country ID
     * @example
     * const leagues = await api.leagues.byCountry(462)
     *   .filter('active', true)
     *   .get();
     */
    byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<League>>;
    /**
     * Search leagues by name
     * @param query The search query
     * @example
     * const leagues = await api.leagues.search('premier')
     *   .include(['country'])
     *   .get();
     */
    search(query: string): QueryBuilder<PaginatedResponse<League>>;
    /**
     * Get leagues with live fixtures
     * @example
     * const liveLeagues = await api.leagues.live()
     *   .include(['fixtures'])
     *   .get();
     */
    live(): QueryBuilder<PaginatedResponse<League>>;
    /**
     * Get leagues by fixture date
     * @param date Date in YYYY-MM-DD format
     * @example
     * const leagues = await api.leagues.byDate('2024-01-15')
     *   .include(['fixtures'])
     *   .get();
     */
    byDate(date: string): QueryBuilder<PaginatedResponse<League>>;
    /**
     * Get all leagues for a team (historical and current)
     * @param teamId The team ID
     * @example
     * const leagues = await api.leagues.byTeam(1)
     *   .include(['seasons'])
     *   .get();
     */
    byTeam(teamId: string | number): QueryBuilder<PaginatedResponse<League>>;
    /**
     * Get current leagues for a team
     * @param teamId The team ID
     * @example
     * const currentLeagues = await api.leagues.currentByTeam(1)
     *   .include(['currentSeason'])
     *   .get();
     */
    currentByTeam(teamId: string | number): QueryBuilder<PaginatedResponse<League>>;
}

/**
 * Teams resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/teams
 */
declare class TeamsResource extends BaseResource {
    /**
     * Get all teams
     * @returns QueryBuilder for chaining
     */
    all(): QueryBuilder<PaginatedResponse<Team>>;
    /**
     * Get a team by ID
     * @param id - The team ID
     * @returns QueryBuilder for chaining
     */
    byId(id: string | number): QueryBuilder<SingleResponse<Team>>;
    /**
     * Get teams by country ID
     * @param countryId - The country ID
     * @returns QueryBuilder for chaining
     */
    byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Team>>;
    /**
     * Get teams by season ID
     * @param seasonId - The season ID
     * @returns QueryBuilder for chaining
     */
    bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Team>>;
    /**
     * Search for teams by name
     * @param searchQuery - The search query
     * @returns QueryBuilder for chaining
     */
    search(searchQuery: string): QueryBuilder<PaginatedResponse<Team>>;
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
    squad(teamId: string | number, seasonId?: string | number): QueryBuilder<PaginatedResponse<SquadMember>>;
    /**
     * Get squad for a team in a specific season.
     * @param seasonId Season ID
     * @param teamId Team ID
     */
    squadBySeason(seasonId: string | number, teamId: string | number): QueryBuilder<PaginatedResponse<SquadMember>>;
}

/**
 * Players resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players
 */
declare class PlayersResource extends BaseResource {
    /**
     * Get all players
     * @returns QueryBuilder for chaining
     */
    all(): QueryBuilder<PaginatedResponse<Player>>;
    /**
     * Get a player by ID
     * @param id - The player ID
     * @returns QueryBuilder for chaining
     */
    byId(id: string | number): QueryBuilder<SingleResponse<Player>>;
    /**
     * Get players by country ID
     * @param countryId - The country ID
     * @returns QueryBuilder for chaining
     */
    byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Player>>;
    /**
     * Search for players by name
     * @param searchQuery - The search query
     * @returns QueryBuilder for chaining
     */
    search(searchQuery: string): QueryBuilder<PaginatedResponse<Player>>;
    /**
     * Get the latest updated players
     * @returns QueryBuilder for chaining
     */
    latest(): QueryBuilder<PaginatedResponse<Player>>;
    /**
     * Get statistics for a player.
     * @param playerId Player ID
     * @example
     * const stats = await client.players.statistics(278).get()
     */
    statistics(playerId: string | number): QueryBuilder<PaginatedResponse<PlayerStatistic>>;
    /**
     * Get statistics for a player in a specific season.
     * @param playerId Player ID
     * @param seasonId Season ID
     */
    statisticsBySeason(playerId: string | number, seasonId: string | number): QueryBuilder<PaginatedResponse<PlayerStatistic>>;
}

/**
 * Standings resource with all available endpoints
 */
declare class StandingsResource extends BaseResource {
    /**
     * Get all standings
     * Note: This endpoint requires season_id filter
     * @example
     * const standings = await api.standings.all()
     *   .filter('season_id', 19735)
     *   .include(['participant', 'league'])
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<Standing>>;
    /**
     * Get standings by season ID
     * @param seasonId The season ID
     * @example
     * const standings = await api.standings.bySeason(19735)
     *   .include(['participant.country'])
     *   .get();
     */
    bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Standing>>;
    /**
     * Get standings by round ID
     * @param roundId The round ID
     * @example
     * const standings = await api.standings.byRound(274719)
     *   .include(['participant'])
     *   .get();
     */
    byRound(roundId: string | number): QueryBuilder<PaginatedResponse<Standing>>;
    /**
     * Get standing corrections by season ID
     * @param seasonId The season ID
     * @example
     * const corrections = await api.standings.correctionsBySeason(19735)
     *   .include(['participant'])
     *   .get();
     */
    correctionsBySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<StandingCorrection>>;
    /**
     * Get live standings by league ID
     * @param leagueId The league ID
     * @example
     * const liveStandings = await api.standings.liveByLeague(8)
     *   .include(['participant'])
     *   .get();
     */
    liveByLeague(leagueId: string | number): QueryBuilder<PaginatedResponse<Standing>>;
}

/**
 * Livescores resource for real-time fixture data
 *
 * The Livescores endpoints provide access to real-time match data:
 * - Inplay fixtures (currently being played)
 * - Upcoming fixtures (15 minutes before start)
 * - Latest updates (fixtures updated within 10 seconds)
 */
declare class LivescoresResource extends BaseResource {
    /**
     * Get all inplay fixtures (currently being played)
     * @example
     * const inplayMatches = await api.livescores.inplay()
     *   .include(['league', 'participants', 'scores', 'state'])
     *   .get();
     */
    inplay(): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get all livescores (fixtures starting within 15 minutes)
     * @example
     * const upcomingMatches = await api.livescores.all()
     *   .include(['league', 'participants', 'venue'])
     *   .filter('leagues', '8,564') // Filter by league IDs
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get latest updated livescores (updated within 10 seconds)
     * @example
     * const latestUpdates = await api.livescores.latest()
     *   .include(['events.type', 'scores', 'participants'])
     *   .get();
     */
    latest(): QueryBuilder<PaginatedResponse<Fixture>>;
}

/**
 * Coaches resource with all available endpoints
 */
declare class CoachesResource extends BaseResource {
    /**
     * Get all coaches
     * @example
     * const coaches = await api.coaches.all()
     *   .include(['country', 'nationality', 'teams'])
     *   .orderBy('name')
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<Coach>>;
    /**
     * Get a coach by ID
     * @param id The coach ID
     * @example
     * const coach = await api.coaches.byId(123)
     *   .include(['country', 'nationality', 'teams'])
     *   .get();
     */
    byId(id: string | number): QueryBuilder<SingleResponse<Coach>>;
    /**
     * Get coaches by country ID
     * @param countryId The country ID
     * @example
     * const coaches = await api.coaches.byCountry(462)
     *   .include(['teams'])
     *   .get();
     */
    byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Coach>>;
    /**
     * Search coaches by name
     * @param query The search query
     * @example
     * const coaches = await api.coaches.search('mourinho')
     *   .include(['teams'])
     *   .get();
     */
    search(query: string): QueryBuilder<PaginatedResponse<Coach>>;
    /**
     * Get last updated coaches (updated in the past two hours)
     * @example
     * const recentlyUpdated = await api.coaches.latest()
     *   .include(['teams'])
     *   .get();
     */
    latest(): QueryBuilder<PaginatedResponse<Coach>>;
}

/**
 * Referees resource with all available endpoints
 */
declare class RefereesResource extends BaseResource {
    /**
     * Get all referees
     * @example
     * const referees = await api.referees.all()
     *   .include(['country'])
     *   .page(1)
     *   .limit(25)
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<Referee>>;
    /**
     * Get referee by ID
     * @param refereeId The referee ID
     * @example
     * const referee = await api.referees.byId(1)
     *   .include(['country', 'fixtures'])
     *   .get();
     */
    byId(refereeId: string | number): QueryBuilder<SingleResponse<Referee>>;
    /**
     * Get referees by country ID
     * @param countryId The country ID
     * @example
     * const referees = await api.referees.byCountry(1161)
     *   .include(['country'])
     *   .get();
     */
    byCountry(countryId: string | number): QueryBuilder<PaginatedResponse<Referee>>;
    /**
     * Get referees by season ID
     * @param seasonId The season ID
     * @example
     * const referees = await api.referees.bySeason(19735)
     *   .include(['country'])
     *   .get();
     */
    bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Referee>>;
    /**
     * Search referees by name
     * @param searchQuery The search query (minimum 3 characters)
     * @example
     * const referees = await api.referees.search('Michael Oliver')
     *   .include(['country'])
     *   .get();
     */
    search(searchQuery: string): QueryBuilder<PaginatedResponse<Referee>>;
}

/**
 * Transfers resource for handling transfer-related API endpoints
 */
declare class TransfersResource extends BaseResource {
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
    all(): QueryBuilder<PaginatedResponse<Transfer>>;
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
    byId(id: string | number): QueryBuilder<SingleResponse<Transfer>>;
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
    latest(): QueryBuilder<PaginatedResponse<Transfer>>;
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
    between(startDate: string, endDate: string): QueryBuilder<PaginatedResponse<Transfer>>;
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
    byTeam(teamId: string | number): QueryBuilder<PaginatedResponse<Transfer>>;
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
    byPlayer(playerId: string | number): QueryBuilder<PaginatedResponse<Transfer>>;
}

/**
 * Venues resource for accessing stadium/venue information
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/venues
 */
declare class VenuesResource extends BaseResource {
    /**
     * Get all venues
     * @example
     * const venues = await api.venues.all()
     *   .include(['country'])
     *   .page(1)
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<Venue>>;
    /**
     * Get a venue by ID
     * @param id The venue ID
     * @example
     * const venue = await api.venues.byId(5)
     *   .include(['country'])
     *   .get();
     */
    byId(id: string | number): QueryBuilder<SingleResponse<Venue>>;
    /**
     * Get venues by season ID
     * Returns all venues used in a specific season
     * @param seasonId The season ID
     * @example
     * const venues = await api.venues.bySeason(19735)
     *   .include(['country'])
     *   .get();
     */
    bySeason(seasonId: string | number): QueryBuilder<PaginatedResponse<Venue>>;
    /**
     * Search venues by name
     * @param searchQuery The search query (minimum 3 characters)
     * @example
     * const venues = await api.venues.search('Old Trafford')
     *   .include(['country'])
     *   .get();
     */
    search(searchQuery: string): QueryBuilder<PaginatedResponse<Venue>>;
}

/**
 * News resource for accessing pre-match and post-match articles.
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/news
 */
declare class NewsResource extends BaseResource {
    /**
     * Get pre-match news articles.
     * Supports standard filters (fixture_id, league_id, season_id).
     * @example
     * const news = await client.news.prematch().filter('league_id', 8).get()
     */
    prematch(): QueryBuilder<PaginatedResponse<NewsArticle>>;
    /**
     * Get post-match news articles.
     * @example
     * const news = await client.news.postmatch().filter('fixture_id', 18535482).get()
     */
    postmatch(): QueryBuilder<PaginatedResponse<NewsArticle>>;
    /**
     * Get a single news article by ID.
     * @param id News article ID
     */
    byId(id: string | number): QueryBuilder<SingleResponse<NewsArticle>>;
}

/**
 * Fixtures resource for accessing match/game information
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/fixtures
 */
declare class FixturesResource extends BaseResource {
    /**
     * Get all fixtures
     * @example
     * const fixtures = await api.fixtures.all()
     *   .include(['localteam', 'visitorteam'])
     *   .page(1)
     *   .get();
     */
    all(): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get a fixture by ID
     * @param id The fixture ID
     * @example
     * const fixture = await api.fixtures.byId(18535517)
     *   .include(['localteam', 'visitorteam', 'venue', 'referee'])
     *   .get();
     */
    byId(id: string | number): QueryBuilder<SingleResponse<Fixture>>;
    /**
     * Get fixtures by multiple IDs
     * @param ids Array of fixture IDs
     * @example
     * const fixtures = await api.fixtures.byIds([18535517, 18535518])
     *   .include(['localteam', 'visitorteam'])
     *   .get();
     */
    byIds(ids: (string | number)[]): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get fixtures by date
     * @param date Date in YYYY-MM-DD format
     * @example
     * const fixtures = await api.fixtures.byDate('2024-01-15')
     *   .include(['localteam', 'visitorteam'])
     *   .get();
     */
    byDate(date: string): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get fixtures by date range
     * @param startDate Start date in YYYY-MM-DD format
     * @param endDate End date in YYYY-MM-DD format
     * @example
     * const fixtures = await api.fixtures.byDateRange('2024-01-01', '2024-01-31')
     *   .include(['localteam', 'visitorteam'])
     *   .get();
     */
    byDateRange(startDate: string, endDate: string): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get fixtures by date range for a specific team
     * @param teamId The team ID
     * @param startDate Start date in YYYY-MM-DD format
     * @param endDate End date in YYYY-MM-DD format
     * @example
     * const fixtures = await api.fixtures.byTeamAndDateRange(1, '2024-01-01', '2024-01-31')
     *   .include(['localteam', 'visitorteam', 'venue'])
     *   .get();
     */
    byTeamAndDateRange(teamId: string | number, startDate: string, endDate: string): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get head-to-head fixtures between two teams
     * @param team1Id First team ID
     * @param team2Id Second team ID
     * @example
     * const h2h = await api.fixtures.headToHead(1, 14)
     *   .include(['localteam', 'visitorteam', 'venue'])
     *   .get();
     */
    headToHead(team1Id: string | number, team2Id: string | number): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Search fixtures by name
     * @param searchQuery The search query
     * @example
     * const fixtures = await api.fixtures.search('Manchester United vs Liverpool')
     *   .include(['localteam', 'visitorteam'])
     *   .get();
     */
    search(searchQuery: string): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get upcoming fixtures by market ID
     * @param marketId The market ID
     * @example
     * const fixtures = await api.fixtures.upcomingByMarket(1)
     *   .include(['localteam', 'visitorteam'])
     *   .get();
     */
    upcomingByMarket(marketId: string | number): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get upcoming fixtures by TV station ID
     * @param tvStationId The TV station ID
     * @example
     * const fixtures = await api.fixtures.upcomingByTvStation(1)
     *   .include(['localteam', 'visitorteam', 'tvstations'])
     *   .get();
     */
    upcomingByTvStation(tvStationId: string | number): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get past fixtures by TV station ID
     * @param tvStationId The TV station ID
     * @example
     * const fixtures = await api.fixtures.pastByTvStation(1)
     *   .include(['localteam', 'visitorteam', 'tvstations'])
     *   .get();
     */
    pastByTvStation(tvStationId: string | number): QueryBuilder<PaginatedResponse<Fixture>>;
    /**
     * Get latest updated fixtures
     * Returns fixtures that have received updates within 10 seconds
     * @example
     * const fixtures = await api.fixtures.latest()
     *   .include(['localteam', 'visitorteam'])
     *   .get();
     */
    latest(): QueryBuilder<PaginatedResponse<Fixture>>;
}

/**
 * Seasons resource for SportMonks Football API
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons
 */
declare class SeasonsResource extends BaseResource {
    /**
     * Get all seasons
     * @returns QueryBuilder for chaining
     */
    all(): QueryBuilder<PaginatedResponse<Season>>;
    /**
     * Get a season by ID
     * @param id - The season ID
     * @returns QueryBuilder for chaining
     */
    byId(id: string | number): QueryBuilder<SingleResponse<Season>>;
    /**
     * Get season by team ID
     * @param teamId - The team ID
     * @returns QueryBuilder for chaining
     */
    byCountry(teamId: string | number): QueryBuilder<PaginatedResponse<Season>>;
    /**
     * Search for seasons by name
     * @param searchQuery - The search query
     * @returns QueryBuilder for chaining
     */
    search(searchQuery: string): QueryBuilder<PaginatedResponse<Season>>;
}

/**
 * Main SportMonks client class
 */
declare class SportMonksClient {
    private client;
    private options;
    leagues: LeaguesResource;
    teams: TeamsResource;
    players: PlayersResource;
    standings: StandingsResource;
    livescores: LivescoresResource;
    coaches: CoachesResource;
    referees: RefereesResource;
    transfers: TransfersResource;
    venues: VenuesResource;
    fixtures: FixturesResource;
    news: NewsResource;
    seasons: SeasonsResource;
    /**
     * Create a new SportMonks API client
     */
    constructor(apiKey: string, options?: SportMonksClientOptions);
    /**
     * Update the API key
     */
    setApiKey(apiKey: string): void;
    /**
     * Update the request timeout
     */
    setTimeout(timeout: number): void;
}

type ErrorType = 'AUTH_ERROR' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'CLIENT_ERROR' | 'RATE_LIMIT_ERROR';
/**
 * SportMonks API Error class
 */
declare class SportMonksError extends Error {
    statusCode?: number | undefined;
    apiMessage?: string | undefined;
    errors?: Record<string, unknown> | undefined;
    errorType?: ErrorType | undefined;
    constructor(message: string, statusCode?: number | undefined, apiMessage?: string | undefined, errors?: Record<string, unknown> | undefined, errorType?: ErrorType | undefined);
    /**
     * Check if this is a network/connection error
     */
    isNetworkError(): boolean;
    /**
     * Check if this is an authentication error
     */
    isAuthError(): boolean;
    /**
     * Check if this is a rate limit error
     */
    isRateLimitError(): boolean;
    /**
     * Get a user-friendly error message
     */
    getUserMessage(): string;
}

/**
 * Options for polling configuration
 */
interface PollingOptions {
    /** Interval between polls in milliseconds */
    interval: number;
    /** Maximum duration to poll in milliseconds */
    maxDuration?: number;
    /** Callback when new data is received */
    onData?: (data: unknown) => void;
    /** Callback when an error occurs */
    onError?: (error: Error) => void;
    /** Whether to stop on error */
    stopOnError?: boolean;
    /** Compare function to detect changes */
    compareFunction?: (oldData: unknown, newData: unknown) => boolean;
}
/**
 * Polling utility for real-time data updates
 */
declare class Poller<T> {
    private fetchFunction;
    private options;
    private intervalId?;
    private startTime?;
    private lastData?;
    private isPolling;
    constructor(fetchFunction: () => Promise<T>, options: PollingOptions);
    /**
     * Start polling
     */
    start(): void;
    /**
     * Stop polling
     */
    stop(): void;
    /**
     * Check if currently polling
     */
    isActive(): boolean;
    /**
     * Fetch data and handle callbacks
     */
    private fetch;
    /**
     * Check if data has changed
     */
    private hasDataChanged;
    /**
     * Type guard for paginated response
     */
    private isPaginatedResponse;
}
/**
 * Create a poller for livescores
 */
declare function createLivescoresPoller(fetchFunction: () => Promise<PaginatedResponse<unknown>>, options?: Partial<PollingOptions>): Poller<PaginatedResponse<unknown>>;
/**
 * Create a poller for transfer news
 */
declare function createTransfersPoller(fetchFunction: () => Promise<PaginatedResponse<unknown>>, options?: Partial<PollingOptions>): Poller<PaginatedResponse<unknown>>;

/**
 * Validation utilities for the SportMonks SDK
 */
/**
 * Validate date format (YYYY-MM-DD)
 */
declare function validateDateFormat(date: string): void;
/**
 * Validate date range
 */
declare function validateDateRange(startDate: string, endDate: string): void;
/**
 * Format date to YYYY-MM-DD
 */
declare function formatDate(date: Date | string): string;
/**
 * Get today's date in YYYY-MM-DD format
 */
declare function getToday(): string;
/**
 * Get date N days from now
 */
declare function getDaysFromNow(days: number): string;
/**
 * Get date N days ago
 */
declare function getDaysAgo(days: number): string;
/**
 * Validate numeric ID
 */
declare function validateId(id: string | number, name?: string): number;
/**
 * Validate array of IDs
 */
declare function validateIds(ids: (string | number)[], name?: string): number[];
/**
 * Validate search query
 */
declare function validateSearchQuery(query: string, minLength?: number): string;
/**
 * Validate pagination parameters
 */
declare function validatePagination(page?: number, perPage?: number): void;
/**
 * Validate enum value
 */
declare function validateEnum<T extends Record<string, unknown>>(value: unknown, enumObject: T, name: string): T[keyof T];
/**
 * Sanitize string for use in URLs
 */
declare function sanitizeUrlParam(param: string): string;
/**
 * Parse and validate JSON response
 */
declare function parseJsonSafely<T>(json: string): T;

/**
 * Type helper utilities for working with SportMonks API responses
 */

/**
 * Extract the data type from a response
 * @example
 * type TeamData = ExtractData<SingleResponse<Team>>; // Team
 * type TeamsData = ExtractData<PaginatedResponse<Team>>; // Team[]
 */
type ExtractData<T> = T extends SingleResponse<infer U> ? U : T extends PaginatedResponse<infer U> ? U[] : never;
/**
 * Make certain properties required when using includes
 * @example
 * // When including country, make it required in the type
 * type TeamWithCountry = WithRequired<Team, 'country'>;
 */
type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
/**
 * Common include combinations as type helpers
 */
type LeagueWithCountry = WithRequired<League, 'country'>;
type LeagueWithSeasons = WithRequired<League, 'seasons'>;
type LeagueWithCountryAndSeasons = WithRequired<League, 'country' | 'seasons'>;
type TeamWithCountry = WithRequired<Team, 'country'>;
type TeamWithVenue = WithRequired<Team, 'venue'>;
type TeamWithCoach = WithRequired<Team, 'coach'>;
type TeamWithAll = WithRequired<Team, 'country' | 'venue' | 'coach'>;
type PlayerWithCountry = WithRequired<Player, 'country'>;
type PlayerWithNationality = WithRequired<Player, 'nationality'>;
type FixtureWithTeams = WithRequired<Fixture, 'localteam' | 'visitorteam'>;
type FixtureWithLeague = WithRequired<Fixture, 'league'>;
type FixtureWithVenue = WithRequired<Fixture, 'venue'>;
type FixtureWithEvents = WithRequired<Fixture, 'events'>;
type FixtureWithLineups = WithRequired<Fixture, 'lineups'>;
/**
 * Type guard to check if a property exists
 * @example
 * if (hasInclude(team, 'country')) {
 *   // TypeScript now knows team.country is defined
 *   console.log(team.country.name);
 * }
 */
declare function hasInclude<T, K extends keyof T>(obj: T, key: K): obj is T & Required<Pick<T, K>>;
/**
 * Type guard for response with data
 * @example
 * const response = await client.teams.byId(1).get();
 * if (hasData(response)) {
 *   // TypeScript knows response.data exists
 * }
 */
declare function hasData<T>(response: unknown): response is {
    data: T;
};
/**
 * Type guard for paginated response
 */
declare function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T>;
/**
 * Type guard for single response
 */
declare function isSingleResponse<T>(response: unknown): response is SingleResponse<T>;
/**
 * Safely access nested includes
 * @example
 * const countryName = getNestedInclude(team, 'country', 'name');
 */
declare function getNestedInclude<T, K extends keyof T>(obj: T, include: K, property?: keyof NonNullable<T[K]>): T[K] | undefined;
/**
 * Sort helpers with type safety
 */
declare function sortByName<T extends {
    name: string;
}>(a: T, b: T): number;
declare function sortByCapacity(a: Venue, b: Venue): number;
/**
 * Response transformer types
 */
type ResponseTransformer<TIn, TOut> = (response: TIn) => TOut;
/**
 * Create a typed response transformer
 * @example
 * const toTeamNames = createTransformer<PaginatedResponse<Team>, string[]>(
 *   response => response.data.map(team => team.name)
 * );
 */
declare function createTransformer<TIn, TOut>(fn: ResponseTransformer<TIn, TOut>): ResponseTransformer<TIn, TOut>;

export { type Aggregate, BaseResource, type Coach, CoachesResource, type Comment, type Country, type CurrentStage, type ErrorResponse, type Event, type EventType, EventTypeId, type ExtractData, type Fixture, type FixtureStatistic, FixtureStatisticTypeId, FixtureStatus, type FixtureWithEvents, type FixtureWithLeague, type FixtureWithLineups, type FixtureWithTeams, type FixtureWithVenue, FixturesResource, Gender, type Group, type IncludeConfig, type League, LeagueSubType, LeagueType, type LeagueWithCountry, type LeagueWithCountryAndSeasons, type LeagueWithSeasons, LeaguesResource, type Lineup, LineupType, LivescoresResource, type MatchEvent, type NewsArticle, NewsResource, type PaginatedResponse, type Pagination, type Period, type Player, type PlayerStatistic, PlayerStatisticType, type PlayerWithCountry, type PlayerWithNationality, PlayersResource, Poller, type PollingOptions, type Position, PositionType, QueryBuilder, type QueryParameters, type RateLimit, type Referee, RefereesResource, type ResponseMetadata, type ResponseTransformer, type RetryOptions, type Round, type Score, ScoreType, type Season, SeasonsResource, type SingleResponse, SortOrder, type Sport, SportMonksClient, type SportMonksClientOptions, SportMonksError, type SportMonksFilter, SportMonksFilters, type SportMonksInclude, type SportMonksSyntax, SportMonksSyntaxBuilder, SportMonksClient as SportmonksClient, type SquadMember, type SquadPlayer, type Stage, type Standing, type StandingCorrection, type StandingDetail, StandingRule, StandingsResource, type State, type Subscription, type SubscriptionPlan, type Team, TeamType, type TeamWithAll, type TeamWithCoach, type TeamWithCountry, type TeamWithVenue, TeamsResource, type Transfer, type TransferType, TransferTypeEnum, TransfersResource, type Trophy, type TvStation, type Venue, VenueSurface, VenuesResource, type WithRequired, createLivescoresPoller, createTransfersPoller, createTransformer, SportMonksClient as default, formatDate, getDaysAgo, getDaysFromNow, getNestedInclude, getToday, hasData, hasInclude, isPaginatedResponse, isSingleResponse, parseJsonSafely, sanitizeUrlParam, sortByCapacity, sortByName, validateDateFormat, validateDateRange, validateEnum, validateId, validateIds, validatePagination, validateSearchQuery };
