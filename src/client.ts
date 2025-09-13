import axios, { AxiosInstance } from 'axios'
import { SportMonksClientOptions } from './types'
import {
  LeaguesResource,
  TeamsResource,
  PlayersResource,
  StandingsResource,
  LivescoresResource,
  CoachesResource,
  RefereesResource,
  TransfersResource,
  VenuesResource,
  FixturesResource,
  NewsResource,
  SeasonsResource,
} from './resources'

/**
 * Main SportMonks client class
 */
export class SportMonksClient {
  private client: AxiosInstance
  private options: SportMonksClientOptions

  // Resource instances
  public leagues: LeaguesResource
  public teams: TeamsResource
  public players: PlayersResource
  public standings: StandingsResource
  public livescores: LivescoresResource
  public coaches: CoachesResource
  public referees: RefereesResource
  public transfers: TransfersResource
  public venues: VenuesResource
  public fixtures: FixturesResource
  public news: NewsResource
  public seasons: SeasonsResource

  /**
   * Create a new SportMonks API client
   */
  constructor(apiKey: string, options: SportMonksClientOptions = {}) {
    this.options = {
      baseUrl: 'https://api.sportmonks.com/v3',
      timeout: 30000,
      version: 'v3',
      includeSeparator: ';',
      timezone: 'Europe/Amsterdam',
      ...options,
    }

    // Create axios instance
    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeout,
      params: {
        api_token: apiKey,
        timezone: this.options.timezone
      },
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      (error: unknown) => {
        // Enhanced error logging in development
        if (process.env.NODE_ENV === 'development' && axios.isAxiosError(error) && error.response) {
          const responseData = error.response.data as Record<string, unknown> | undefined
          console.error('API Error:', {
            status: error.response.status,
            message: responseData?.message,
            url: error.config?.url,
          })
        }
        return Promise.reject(axios.isAxiosError(error) ? error : new Error(String(error)))
      },
    )

    // Initialize resources
    this.leagues = new LeaguesResource(
      this.client,
      '/football/leagues',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.teams = new TeamsResource(
      this.client,
      '/football/teams',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.players = new PlayersResource(
      this.client,
      '/football/players',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.standings = new StandingsResource(
      this.client,
      '/football/standings',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.livescores = new LivescoresResource(
      this.client,
      '/football/livescores',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.coaches = new CoachesResource(
      this.client,
      '/football/coaches',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.referees = new RefereesResource(
      this.client,
      '/football/referees',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.transfers = new TransfersResource(
      this.client,
      '/football/transfers',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.venues = new VenuesResource(
      this.client,
      '/football/venues',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.news = new NewsResource(
      this.client,
      '/football/news',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.fixtures = new FixturesResource(
      this.client,
      '/football/fixtures',
      this.options.includeSeparator,
      this.options.retry,
    )
    this.seasons = new SeasonsResource(
      this.client,
      '/football/seasons',
      this.options.includeSeparator,
      this.options.retry,
    )
  }

  /**
   * Update the API key
   */
  setApiKey(apiKey: string): void {
    if (!this.client.defaults.params) {
      this.client.defaults.params = {}
    }
    ; (this.client.defaults.params as Record<string, unknown>).api_token = apiKey
  }

  /**
   * Update the request timeout
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout
  }
}
