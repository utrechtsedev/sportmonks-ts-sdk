// src/client.ts
import axios2 from "axios";

// src/core/base-resource.ts
import axios from "axios";

// src/core/errors.ts
var SportMonksError = class extends Error {
  constructor(message, statusCode, apiMessage, errors, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.apiMessage = apiMessage;
    this.errors = errors;
    this.errorType = errorType;
    this.name = "SportMonksError";
  }
  /**
   * Check if this is a network/connection error
   */
  isNetworkError() {
    return this.errorType === "NETWORK_ERROR";
  }
  /**
   * Check if this is an authentication error
   */
  isAuthError() {
    return this.errorType === "AUTH_ERROR";
  }
  /**
   * Check if this is a rate limit error
   */
  isRateLimitError() {
    return this.errorType === "RATE_LIMIT_ERROR";
  }
  /**
   * Get a user-friendly error message
   */
  getUserMessage() {
    switch (this.errorType) {
      case "AUTH_ERROR":
        return "Authentication failed. Please check your API key is valid and has the necessary permissions.";
      case "NETWORK_ERROR":
        return "Unable to connect to SportMonks API. Please check your network connection.";
      case "RATE_LIMIT_ERROR":
        return "API rate limit exceeded. Please wait before making more requests.";
      case "SERVER_ERROR":
        return "SportMonks API server error. Please try again later.";
      case "CLIENT_ERROR":
        return this.message;
      default:
        return "An unexpected error occurred.";
    }
  }
};

// src/core/base-resource.ts
var BaseResource = class {
  constructor(client, basePath, includeSeparator = ";", retryOptions = {}) {
    this.client = client;
    this.basePath = basePath;
    this.includeSeparator = includeSeparator;
    this.retryOptions = {
      maxRetries: retryOptions.maxRetries || 0,
      retryDelay: retryOptions.retryDelay || 1e3,
      maxRetryDelay: retryOptions.maxRetryDelay || 3e4,
      retryOnRateLimit: retryOptions.retryOnRateLimit ?? true,
      retryStatusCodes: retryOptions.retryStatusCodes || [502, 503, 504]
    };
  }
  /**
   * Make a request to the API with optional retry logic
   */
  async request(endpoint, params = {}) {
    const url = `${this.basePath}${endpoint}`;
    let lastError;
    for (let attempt = 0; attempt <= this.retryOptions.maxRetries; attempt++) {
      try {
        const response = await this.client.get(url, { params });
        return response.data;
      } catch (error) {
        lastError = error;
        if (!this.shouldRetry(error, attempt)) {
          throw this.handleError(error, url);
        }
        const delay = Math.min(
          this.retryOptions.retryDelay * Math.pow(2, attempt),
          this.retryOptions.maxRetryDelay
        );
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          const responseData = error.response.data;
          const rateLimit = responseData?.rate_limit;
          const resetIn = rateLimit?.resets_in_seconds;
          if (resetIn) {
            await this.sleep(resetIn * 1e3);
            continue;
          }
        }
        await this.sleep(delay);
      }
    }
    throw this.handleError(lastError, url);
  }
  /**
   * Determine if a request should be retried
   */
  shouldRetry(error, attempt) {
    if (attempt >= this.retryOptions.maxRetries) {
      return false;
    }
    if (!axios.isAxiosError(error)) {
      return false;
    }
    const status = error.response?.status;
    if (!status) {
      return true;
    }
    if (status === 429 && this.retryOptions.retryOnRateLimit) {
      return true;
    }
    return this.retryOptions.retryStatusCodes.includes(status);
  }
  /**
   * Handle and transform errors
   */
  handleError(error, url) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const status = error.response?.status;
      let errorType;
      if (!error.response) {
        errorType = "NETWORK_ERROR";
        let message2 = "Network error";
        if (error.code === "ECONNREFUSED") {
          message2 = "Connection refused. The server may be down or unreachable.";
        } else if (error.code === "ENOTFOUND") {
          message2 = "Server not found. Please check the API URL.";
        } else if (error.code === "ETIMEDOUT") {
          message2 = "Request timeout. The server is not responding.";
        } else if (error.message) {
          message2 = `Network error: ${error.message}`;
        }
        return new SportMonksError(message2, void 0, void 0, void 0, errorType);
      }
      let message = errorData?.message || error.message;
      if (status === 401 || status === 403) {
        errorType = "AUTH_ERROR";
        message = errorData?.message || "Authentication failed. Invalid or missing API key.";
      } else if (status === 404) {
        errorType = "CLIENT_ERROR";
        message = errorData?.message || `Resource not found: ${url}`;
      } else if (status === 429) {
        errorType = "RATE_LIMIT_ERROR";
        const rateLimit = errorData?.rate_limit;
        const resetIn = rateLimit?.resets_in_seconds;
        message = resetIn ? `Rate limit exceeded. Resets in ${resetIn} seconds.` : "Rate limit exceeded. Please wait before making more requests.";
      } else if (status && status >= 500) {
        errorType = "SERVER_ERROR";
        message = errorData?.message || "Server error. Please try again later.";
      } else if (status && status >= 400) {
        errorType = "CLIENT_ERROR";
      }
      return new SportMonksError(
        message,
        status,
        errorData?.message,
        errorData?.errors,
        errorType
      );
    }
    return new SportMonksError(
      error.message || "Unknown error occurred",
      void 0,
      void 0,
      void 0,
      "CLIENT_ERROR"
    );
  }
  /**
   * Sleep for a specified number of milliseconds
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// src/core/query-builder.ts
var QueryBuilder = class {
  constructor(resource, endpoint) {
    this.queryParams = {};
    this.includeParams = [];
    this.selectFields = [];
    this.filterParams = {};
    this.orderParams = [];
    this.hasParams = [];
    this.resource = resource;
    this.endpoint = endpoint;
  }
  /**
   * Include related resources in the response
   * @param includes Array of relationship names, dot notation for nested includes, or field selection
   * @example .include(['country', 'seasons.stages'])
   * @example .include(['lineups:player_name', 'events:player_name,related_player_name,minute'])
   * @example .include(['lineups;events;participants']) // Multiple includes with semicolon
   */
  include(includes) {
    if (typeof includes === "string") {
      this.includeParams.push(includes);
    } else {
      this.includeParams = [.../* @__PURE__ */ new Set([...this.includeParams, ...includes])];
    }
    return this;
  }
  /**
   * Include a relation with specific field selection
   * @param relation The relation name
   * @param fields Array of fields to select from the relation
   * @example .includeFields('lineups', ['player_name', 'jersey_number'])
   * @example .includeFields('events', ['player_name', 'related_player_name', 'minute'])
   */
  includeFields(relation, fields) {
    const fieldsString = fields.join(",");
    this.includeParams.push(`${relation}:${fieldsString}`);
    return this;
  }
  /**
   * Select specific fields to include in the response
   * @param fields Array of field names
   * @example .select(['id', 'name', 'country_id'])
   */
  select(fields) {
    this.selectFields = [.../* @__PURE__ */ new Set([...this.selectFields, ...fields])];
    return this;
  }
  /**
   * Add a filter parameter to the request
   * @example .filter('name', 'Premier League')
   * @example .filter('active', true)
   * @example .filter('eventTypes', [15, 16]) // Multiple values
   */
  filter(key, value) {
    if (Array.isArray(value)) {
      this.filterParams[key] = value.join(",");
    } else {
      this.filterParams[key] = value;
    }
    return this;
  }
  /**
   * Add multiple filters at once
   * @example .filters({ active: true, country_id: 462 })
   */
  filters(filters) {
    this.filterParams = { ...this.filterParams, ...filters };
    return this;
  }
  /**
   * Add sorting to the results
   * @param field Field name with optional - prefix for descending
   * @example .orderBy('name') or .orderBy('-created_at')
   */
  orderBy(field) {
    this.orderParams.push(field);
    return this;
  }
  /**
   * Filter results that have specific relationships
   * @param relationships Array of relationship names
   * @example .has(['seasons'])
   */
  has(relationships) {
    this.hasParams = [.../* @__PURE__ */ new Set([...this.hasParams, ...relationships])];
    return this;
  }
  /**
   * Set the page number for paginated results
   */
  page(page) {
    this.queryParams.page = page;
    return this;
  }
  /**
   * Set the number of items per page
   */
  limit(limit) {
    this.queryParams.limit = limit;
    return this;
  }
  /**
   * Set the number of items per page (alias for limit)
   */
  perPage(perPage) {
    return this.limit(perPage);
  }
  /**
   * Execute the API request and return the results
   */
  async get() {
    if (this.includeParams.length > 0) {
      this.queryParams.include = this.includeParams.join(this.resource["includeSeparator"]);
    }
    if (this.selectFields.length > 0) {
      this.queryParams.select = this.selectFields.join(",");
    }
    if (Object.keys(this.filterParams).length > 0) {
      const filterStrings = Object.entries(this.filterParams).map(([key, value]) => {
        return `${key}:${value}`;
      });
      this.queryParams.filters = filterStrings.join(";");
    }
    if (this.orderParams.length > 0) {
      this.queryParams.order = this.orderParams.join(",");
    }
    if (this.hasParams.length > 0) {
      this.queryParams.has = this.hasParams.join(",");
    }
    if (this.queryParams.limit) {
      this.queryParams.per_page = this.queryParams.limit;
      delete this.queryParams.limit;
    }
    return this.resource["request"](this.endpoint, this.queryParams);
  }
  /**
   * Build complex includes with SportMonks syntax
   * @param includes Object defining includes with optional field selection
   * @example .withIncludes({
   *   lineups: ['player_name', 'jersey_number'],
   *   events: ['player_name', 'related_player_name', 'minute'],
   *   participants: true  // Include all fields
   * })
   */
  withIncludes(includes) {
    Object.entries(includes).forEach(([relation, fields]) => {
      if (fields === true) {
        this.includeParams.push(relation);
      } else if (Array.isArray(fields) && fields.length > 0) {
        this.includeParams.push(`${relation}:${fields.join(",")}`);
      }
    });
    return this;
  }
  /**
   * Get all pages of results (be careful with rate limits!)
   */
  async getAll() {
    const results = [];
    let currentPage = 1;
    let hasMore = true;
    while (hasMore) {
      this.page(currentPage);
      const response = await this.get();
      if (response.data) {
        results.push(...Array.isArray(response.data) ? response.data : [response.data]);
      }
      hasMore = response.pagination?.has_more || false;
      currentPage++;
    }
    return results;
  }
};

// src/utils/validators.ts
function validateDateFormat(date) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
}
function validateDateRange(startDate, endDate) {
  validateDateFormat(startDate);
  validateDateFormat(endDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    throw new Error(`Invalid date range: start date (${startDate}) is after end date (${endDate})`);
  }
  const oneYear = 365 * 24 * 60 * 60 * 1e3;
  if (end.getTime() - start.getTime() > oneYear) {
    throw new Error("Date range cannot exceed 1 year");
  }
}
function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getToday() {
  return formatDate(/* @__PURE__ */ new Date());
}
function getDaysFromNow(days) {
  const date = /* @__PURE__ */ new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}
function getDaysAgo(days) {
  return getDaysFromNow(-days);
}
function validateId(id, name = "ID") {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numId) || numId <= 0) {
    throw new Error(`Invalid ${name}: ${id}. Must be a positive number`);
  }
  return numId;
}
function validateIds(ids, name = "IDs") {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error(`${name} must be a non-empty array`);
  }
  return ids.map((id, index) => {
    try {
      return validateId(id, `${name}[${index}]`);
    } catch {
      throw new Error(`Invalid ${name}[${index}]: ${id}`);
    }
  });
}
function validateSearchQuery(query, minLength = 3) {
  if (typeof query !== "string") {
    throw new Error("Search query must be a string");
  }
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    throw new Error("Invalid search query");
  }
  if (trimmed.length < minLength) {
    throw new Error(`Search query must be at least ${minLength} characters`);
  }
  return trimmed;
}
function validatePagination(page, perPage) {
  if (page !== void 0) {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("Page must be a positive integer");
    }
  }
  if (perPage !== void 0) {
    if (!Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
      throw new Error("Per page must be an integer between 1 and 100");
    }
  }
}
function validateEnum(value, enumObject, name) {
  const values = Object.values(enumObject);
  if (!values.includes(value)) {
    throw new Error(`Invalid ${name}: ${String(value)}. Must be one of: ${values.join(", ")}`);
  }
  return value;
}
function sanitizeUrlParam(param) {
  return encodeURIComponent(param.trim());
}
function parseJsonSafely(json) {
  try {
    return JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON response from API");
  }
}

// src/resources/leagues.ts
var LeaguesResource = class extends BaseResource {
  /**
   * Get all leagues
   * @example
   * const leagues = await api.leagues.all()
   *   .include(['country', 'currentSeason'])
   *   .filter('active', true)
   *   .orderBy('name')
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a league by ID
   * @param id The league ID
   * @example
   * const league = await api.leagues.byId(271)
   *   .include(['country', 'seasons', 'stages'])
   *   .get();
   */
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
  }
  /**
   * Get leagues by country ID
   * @param countryId The country ID
   * @example
   * const leagues = await api.leagues.byCountry(462)
   *   .filter('active', true)
   *   .get();
   */
  byCountry(countryId) {
    return new QueryBuilder(this, `/countries/${countryId}`);
  }
  /**
   * Search leagues by name
   * @param query The search query
   * @example
   * const leagues = await api.leagues.search('premier')
   *   .include(['country'])
   *   .get();
   */
  search(query) {
    const encodedQuery = encodeURIComponent(query);
    return new QueryBuilder(this, `/search/${encodedQuery}`);
  }
  /**
   * Get leagues with live fixtures
   * @example
   * const liveLeagues = await api.leagues.live()
   *   .include(['fixtures'])
   *   .get();
   */
  live() {
    return new QueryBuilder(this, "/live");
  }
  /**
   * Get leagues by fixture date
   * @param date Date in YYYY-MM-DD format
   * @example
   * const leagues = await api.leagues.byDate('2024-01-15')
   *   .include(['fixtures'])
   *   .get();
   */
  byDate(date) {
    validateDateFormat(date);
    return new QueryBuilder(this, `/date/${date}`);
  }
  /**
   * Get all leagues for a team (historical and current)
   * @param teamId The team ID
   * @example
   * const leagues = await api.leagues.byTeam(1)
   *   .include(['seasons'])
   *   .get();
   */
  byTeam(teamId) {
    return new QueryBuilder(this, `/teams/${teamId}`);
  }
  /**
   * Get current leagues for a team
   * @param teamId The team ID
   * @example
   * const currentLeagues = await api.leagues.currentByTeam(1)
   *   .include(['currentSeason'])
   *   .get();
   */
  currentByTeam(teamId) {
    return new QueryBuilder(this, `/teams/${teamId}/current`);
  }
};

// src/resources/teams.ts
var TeamsResource = class extends BaseResource {
  /**
   * Get all teams
   * @returns QueryBuilder for chaining
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a team by ID
   * @param id - The team ID
   * @returns QueryBuilder for chaining
   */
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
  }
  /**
   * Get teams by country ID
   * @param countryId - The country ID
   * @returns QueryBuilder for chaining
   */
  byCountry(countryId) {
    return new QueryBuilder(this, `/countries/${countryId}`);
  }
  /**
   * Get teams by season ID
   * @param seasonId - The season ID
   * @returns QueryBuilder for chaining
   */
  bySeason(seasonId) {
    return new QueryBuilder(this, `/seasons/${seasonId}`);
  }
  /**
   * Search for teams by name
   * @param searchQuery - The search query
   * @returns QueryBuilder for chaining
   */
  search(searchQuery) {
    const encodedQuery = encodeURIComponent(searchQuery);
    return new QueryBuilder(this, `/search/${encodedQuery}`);
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
  squad(teamId, seasonId) {
    if (seasonId) {
      return this.squadBySeason(seasonId, teamId);
    }
    const squadResource = Object.create(this);
    squadResource.basePath = "/football";
    return new QueryBuilder(squadResource, `/squads/teams/${teamId}`);
  }
  /**
   * Get squad for a team in a specific season.
   * @param seasonId Season ID
   * @param teamId Team ID
   */
  squadBySeason(seasonId, teamId) {
    const squadResource = Object.create(this);
    squadResource.basePath = "/football";
    return new QueryBuilder(
      squadResource,
      `/squads/seasons/${seasonId}/teams/${teamId}`
    );
  }
};

// src/resources/players.ts
var PlayersResource = class extends BaseResource {
  /**
   * Get all players
   * @returns QueryBuilder for chaining
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a player by ID
   * @param id - The player ID
   * @returns QueryBuilder for chaining
   */
  byId(id) {
    const validatedId = validateId(id, "ID");
    return new QueryBuilder(this, `/${validatedId}`);
  }
  /**
   * Get players by country ID
   * @param countryId - The country ID
   * @returns QueryBuilder for chaining
   */
  byCountry(countryId) {
    const validatedId = validateId(countryId, "Country ID");
    return new QueryBuilder(this, `/countries/${validatedId}`);
  }
  /**
   * Search for players by name
   * @param searchQuery - The search query
   * @returns QueryBuilder for chaining
   */
  search(searchQuery) {
    const validatedQuery = validateSearchQuery(searchQuery, 2);
    const encodedQuery = encodeURIComponent(validatedQuery);
    return new QueryBuilder(this, `/search/${encodedQuery}`);
  }
  /**
   * Get the latest updated players
   * @returns QueryBuilder for chaining
   */
  latest() {
    return new QueryBuilder(this, "/latest");
  }
  /**
   * Get statistics for a player.
   * @param playerId Player ID
   * @example
   * const stats = await client.players.statistics(278).get()
   */
  statistics(playerId) {
    return new QueryBuilder(this, `/${playerId}/statistics`);
  }
  /**
   * Get statistics for a player in a specific season.
   * @param playerId Player ID
   * @param seasonId Season ID
   */
  statisticsBySeason(playerId, seasonId) {
    return this.statistics(playerId).filter("season_id", seasonId);
  }
};

// src/resources/standings.ts
var StandingsResource = class extends BaseResource {
  /**
   * Get all standings
   * Note: This endpoint requires season_id filter
   * @example
   * const standings = await api.standings.all()
   *   .filter('season_id', 19735)
   *   .include(['participant', 'league'])
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get standings by season ID
   * @param seasonId The season ID
   * @example
   * const standings = await api.standings.bySeason(19735)
   *   .include(['participant.country'])
   *   .get();
   */
  bySeason(seasonId) {
    return new QueryBuilder(this, `/seasons/${seasonId}`);
  }
  /**
   * Get standings by round ID
   * @param roundId The round ID
   * @example
   * const standings = await api.standings.byRound(274719)
   *   .include(['participant'])
   *   .get();
   */
  byRound(roundId) {
    return new QueryBuilder(this, `/rounds/${roundId}`);
  }
  /**
   * Get standing corrections by season ID
   * @param seasonId The season ID
   * @example
   * const corrections = await api.standings.correctionsBySeason(19735)
   *   .include(['participant'])
   *   .get();
   */
  correctionsBySeason(seasonId) {
    return new QueryBuilder(
      this,
      `/corrections/seasons/${seasonId}`
    );
  }
  /**
   * Get live standings by league ID
   * @param leagueId The league ID
   * @example
   * const liveStandings = await api.standings.liveByLeague(8)
   *   .include(['participant'])
   *   .get();
   */
  liveByLeague(leagueId) {
    return new QueryBuilder(this, `/live/leagues/${leagueId}`);
  }
};

// src/resources/livescores.ts
var LivescoresResource = class extends BaseResource {
  /**
   * Get all inplay fixtures (currently being played)
   * @example
   * const inplayMatches = await api.livescores.inplay()
   *   .include(['league', 'participants', 'scores', 'state'])
   *   .get();
   */
  inplay() {
    return new QueryBuilder(this, "/inplay");
  }
  /**
   * Get all livescores (fixtures starting within 15 minutes)
   * @example
   * const upcomingMatches = await api.livescores.all()
   *   .include(['league', 'participants', 'venue'])
   *   .filter('leagues', '8,564') // Filter by league IDs
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get latest updated livescores (updated within 10 seconds)
   * @example
   * const latestUpdates = await api.livescores.latest()
   *   .include(['events.type', 'scores', 'participants'])
   *   .get();
   */
  latest() {
    return new QueryBuilder(this, "/latest");
  }
};

// src/resources/coaches.ts
var CoachesResource = class extends BaseResource {
  /**
   * Get all coaches
   * @example
   * const coaches = await api.coaches.all()
   *   .include(['country', 'nationality', 'teams'])
   *   .orderBy('name')
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a coach by ID
   * @param id The coach ID
   * @example
   * const coach = await api.coaches.byId(123)
   *   .include(['country', 'nationality', 'teams'])
   *   .get();
   */
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
  }
  /**
   * Get coaches by country ID
   * @param countryId The country ID
   * @example
   * const coaches = await api.coaches.byCountry(462)
   *   .include(['teams'])
   *   .get();
   */
  byCountry(countryId) {
    return new QueryBuilder(this, `/countries/${countryId}`);
  }
  /**
   * Search coaches by name
   * @param query The search query
   * @example
   * const coaches = await api.coaches.search('mourinho')
   *   .include(['teams'])
   *   .get();
   */
  search(query) {
    const encodedQuery = encodeURIComponent(query);
    return new QueryBuilder(this, `/search/${encodedQuery}`);
  }
  /**
   * Get last updated coaches (updated in the past two hours)
   * @example
   * const recentlyUpdated = await api.coaches.latest()
   *   .include(['teams'])
   *   .get();
   */
  latest() {
    return new QueryBuilder(this, "/latest");
  }
};

// src/resources/referees.ts
var RefereesResource = class extends BaseResource {
  /**
   * Get all referees
   * @example
   * const referees = await api.referees.all()
   *   .include(['country'])
   *   .page(1)
   *   .limit(25)
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get referee by ID
   * @param refereeId The referee ID
   * @example
   * const referee = await api.referees.byId(1)
   *   .include(['country', 'fixtures'])
   *   .get();
   */
  byId(refereeId) {
    return new QueryBuilder(this, `/${refereeId}`);
  }
  /**
   * Get referees by country ID
   * @param countryId The country ID
   * @example
   * const referees = await api.referees.byCountry(1161)
   *   .include(['country'])
   *   .get();
   */
  byCountry(countryId) {
    return new QueryBuilder(this, `/countries/${countryId}`);
  }
  /**
   * Get referees by season ID
   * @param seasonId The season ID
   * @example
   * const referees = await api.referees.bySeason(19735)
   *   .include(['country'])
   *   .get();
   */
  bySeason(seasonId) {
    return new QueryBuilder(this, `/seasons/${seasonId}`);
  }
  /**
   * Search referees by name
   * @param searchQuery The search query (minimum 3 characters)
   * @example
   * const referees = await api.referees.search('Michael Oliver')
   *   .include(['country'])
   *   .get();
   */
  search(searchQuery) {
    if (searchQuery.length < 3) {
      throw new Error("Search query must be at least 3 characters long");
    }
    return new QueryBuilder(
      this,
      `/search/${encodeURIComponent(searchQuery)}`
    );
  }
};

// src/resources/transfers.ts
var TransfersResource = class extends BaseResource {
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
  all() {
    return new QueryBuilder(this, "");
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
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
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
  latest() {
    return new QueryBuilder(this, "/latest");
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
  between(startDate, endDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error("Dates must be in YYYY-MM-DD format");
    }
    return new QueryBuilder(this, `/between/${startDate}/${endDate}`);
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
  byTeam(teamId) {
    return new QueryBuilder(this, `/teams/${teamId}`);
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
  byPlayer(playerId) {
    return new QueryBuilder(this, `/players/${playerId}`);
  }
};

// src/resources/venues.ts
var VenuesResource = class extends BaseResource {
  /**
   * Get all venues
   * @example
   * const venues = await api.venues.all()
   *   .include(['country'])
   *   .page(1)
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a venue by ID
   * @param id The venue ID
   * @example
   * const venue = await api.venues.byId(5)
   *   .include(['country'])
   *   .get();
   */
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
  }
  /**
   * Get venues by season ID
   * Returns all venues used in a specific season
   * @param seasonId The season ID
   * @example
   * const venues = await api.venues.bySeason(19735)
   *   .include(['country'])
   *   .get();
   */
  bySeason(seasonId) {
    return new QueryBuilder(this, `/seasons/${seasonId}`);
  }
  /**
   * Search venues by name
   * @param searchQuery The search query (minimum 3 characters)
   * @example
   * const venues = await api.venues.search('Old Trafford')
   *   .include(['country'])
   *   .get();
   */
  search(searchQuery) {
    if (searchQuery.length < 3) {
      throw new Error("Search query must be at least 3 characters long");
    }
    return new QueryBuilder(
      this,
      `/search/${encodeURIComponent(searchQuery)}`
    );
  }
};

// src/resources/news.ts
var NewsResource = class extends BaseResource {
  /**
   * Get pre-match news articles.
   * Supports standard filters (fixture_id, league_id, season_id).
   * @example
   * const news = await client.news.prematch().filter('league_id', 8).get()
   */
  prematch() {
    return new QueryBuilder(this, "/pre-match");
  }
  /**
   * Get post-match news articles.
   * @example
   * const news = await client.news.postmatch().filter('fixture_id', 18535482).get()
   */
  postmatch() {
    return new QueryBuilder(this, "/post-match");
  }
  /**
   * Get a single news article by ID.
   * @param id News article ID
   */
  byId(id) {
    const validated = validateId(id, "News ID");
    return new QueryBuilder(this, `/${validated}`);
  }
};

// src/resources/fixtures.ts
var FixturesResource = class extends BaseResource {
  /**
   * Get all fixtures
   * @example
   * const fixtures = await api.fixtures.all()
   *   .include(['localteam', 'visitorteam'])
   *   .page(1)
   *   .get();
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a fixture by ID
   * @param id The fixture ID
   * @example
   * const fixture = await api.fixtures.byId(18535517)
   *   .include(['localteam', 'visitorteam', 'venue', 'referee'])
   *   .get();
   */
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
  }
  /**
   * Get fixtures by multiple IDs
   * @param ids Array of fixture IDs
   * @example
   * const fixtures = await api.fixtures.byIds([18535517, 18535518])
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  byIds(ids) {
    const idsString = ids.join(",");
    return new QueryBuilder(this, `/multi/${idsString}`);
  }
  /**
   * Get fixtures by date
   * @param date Date in YYYY-MM-DD format
   * @example
   * const fixtures = await api.fixtures.byDate('2024-01-15')
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  byDate(date) {
    validateDateFormat(date);
    return new QueryBuilder(this, `/date/${date}`);
  }
  /**
   * Get fixtures by date range
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @example
   * const fixtures = await api.fixtures.byDateRange('2024-01-01', '2024-01-31')
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  byDateRange(startDate, endDate) {
    validateDateRange(startDate, endDate);
    return new QueryBuilder(this, `/between/${startDate}/${endDate}`);
  }
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
  byTeamAndDateRange(teamId, startDate, endDate) {
    validateId(teamId, "Team ID");
    validateDateRange(startDate, endDate);
    return new QueryBuilder(
      this,
      `/between/${startDate}/${endDate}/${teamId}`
    );
  }
  /**
   * Get head-to-head fixtures between two teams
   * @param team1Id First team ID
   * @param team2Id Second team ID
   * @example
   * const h2h = await api.fixtures.headToHead(1, 14)
   *   .include(['localteam', 'visitorteam', 'venue'])
   *   .get();
   */
  headToHead(team1Id, team2Id) {
    return new QueryBuilder(this, `/head-to-head/${team1Id}/${team2Id}`);
  }
  /**
   * Search fixtures by name
   * @param searchQuery The search query
   * @example
   * const fixtures = await api.fixtures.search('Manchester United vs Liverpool')
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  search(searchQuery) {
    const query = validateSearchQuery(searchQuery);
    return new QueryBuilder(
      this,
      `/search/${encodeURIComponent(query)}`
    );
  }
  /**
   * Get upcoming fixtures by market ID
   * @param marketId The market ID
   * @example
   * const fixtures = await api.fixtures.upcomingByMarket(1)
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  upcomingByMarket(marketId) {
    return new QueryBuilder(this, `/upcoming/markets/${marketId}`);
  }
  /**
   * Get upcoming fixtures by TV station ID
   * @param tvStationId The TV station ID
   * @example
   * const fixtures = await api.fixtures.upcomingByTvStation(1)
   *   .include(['localteam', 'visitorteam', 'tvstations'])
   *   .get();
   */
  upcomingByTvStation(tvStationId) {
    return new QueryBuilder(
      this,
      `/upcoming/tv-stations/${tvStationId}`
    );
  }
  /**
   * Get past fixtures by TV station ID
   * @param tvStationId The TV station ID
   * @example
   * const fixtures = await api.fixtures.pastByTvStation(1)
   *   .include(['localteam', 'visitorteam', 'tvstations'])
   *   .get();
   */
  pastByTvStation(tvStationId) {
    return new QueryBuilder(this, `/past/tv-stations/${tvStationId}`);
  }
  /**
   * Get latest updated fixtures
   * Returns fixtures that have received updates within 10 seconds
   * @example
   * const fixtures = await api.fixtures.latest()
   *   .include(['localteam', 'visitorteam'])
   *   .get();
   */
  latest() {
    return new QueryBuilder(this, "/latest");
  }
};

// src/resources/seasons.ts
var SeasonsResource = class extends BaseResource {
  /**
   * Get all seasons
   * @returns QueryBuilder for chaining
   */
  all() {
    return new QueryBuilder(this, "");
  }
  /**
   * Get a season by ID
   * @param id - The season ID
   * @returns QueryBuilder for chaining
   */
  byId(id) {
    return new QueryBuilder(this, `/${id}`);
  }
  /**
   * Get season by team ID
   * @param teamId - The team ID
   * @returns QueryBuilder for chaining
   */
  byTeamId(teamId) {
    return new QueryBuilder(this, `/teams/${teamId}`);
  }
  /**
   * Search for seasons by name
   * @param searchQuery - The season name
   * @returns QueryBuilder for chaining
   */
  name(searchQuery) {
    const encodedQuery = encodeURIComponent(searchQuery);
    return new QueryBuilder(this, `/search/${encodedQuery}`);
  }
};

// src/resources/schedules.ts
var SchedulesResource = class extends BaseResource {
  /**
   * Get schedule by season ID
   * @param id - The season ID
   * @returns QueryBuilder for chaining
   */
  bySeasonId(id) {
    return new QueryBuilder(this, `/seasons/${id}`);
  }
  /**
   * Get schedule by team ID
   * @param teamId - The team ID
   * @returns QueryBuilder for chaining
   */
  byTeamId(teamId) {
    return new QueryBuilder(this, `/teams/${teamId}`);
  }
  /**
   * Get schedule by team ID and season ID
   * @param teamID - The team ID
   * @param seasonID - The season ID
   * @returns QueryBuilder for chaining
   */
  byTeamAndSeasonId(teamID, seasonID) {
    return new QueryBuilder(this, `/seasons/${seasonID}/teams/${teamID}`);
  }
};

// src/resources/squads.ts
var SquadsResource = class extends BaseResource {
  /**
   * Returns the current domestic squad from your requested team ID (current season).
   * @param teamId - The season ID
   * @returns QueryBuilder for chaining
   */
  ByTeamId(teamId) {
    return new QueryBuilder(this, `/squads/teams/${teamId}`);
  }
  /**
   * Returns all squad entries for a team, based on current seasons (current season).
   * @param teamId - The team ID
   * @returns QueryBuilder for chaining
   */
  byTeamIdExtended(teamId) {
    return new QueryBuilder(this, `/teams/${teamId}/extended`);
  }
  /**
   * Returns (historical) squads from your requested season ID.
   * @param teamId - The team ID
   * @param seasonId - The season ID
   * @returns QueryBuilder for chaining
   */
  byTeamAndSeasonId(teamId, seasonId) {
    return new QueryBuilder(this, `/seasons/${seasonId}/teams/${teamId}`);
  }
};

// src/client.ts
var SportMonksClient = class {
  /**
   * Create a new SportMonks API client
   */
  constructor(apiKey, options = {}) {
    this.options = {
      baseUrl: "https://api.sportmonks.com/v3",
      timeout: 3e4,
      version: "v3",
      includeSeparator: ";",
      timezone: "Europe/Amsterdam",
      ...options
    };
    this.client = axios2.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeout,
      params: {
        api_token: apiKey,
        timezone: this.options.timezone
      }
    });
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (process.env.NODE_ENV === "development" && axios2.isAxiosError(error) && error.response) {
          const responseData = error.response.data;
          console.error("API Error:", {
            status: error.response.status,
            message: responseData?.message,
            url: error.config?.url
          });
        }
        return Promise.reject(axios2.isAxiosError(error) ? error : new Error(String(error)));
      }
    );
    this.leagues = new LeaguesResource(
      this.client,
      "/football/leagues",
      this.options.includeSeparator,
      this.options.retry
    );
    this.teams = new TeamsResource(
      this.client,
      "/football/teams",
      this.options.includeSeparator,
      this.options.retry
    );
    this.players = new PlayersResource(
      this.client,
      "/football/players",
      this.options.includeSeparator,
      this.options.retry
    );
    this.standings = new StandingsResource(
      this.client,
      "/football/standings",
      this.options.includeSeparator,
      this.options.retry
    );
    this.livescores = new LivescoresResource(
      this.client,
      "/football/livescores",
      this.options.includeSeparator,
      this.options.retry
    );
    this.coaches = new CoachesResource(
      this.client,
      "/football/coaches",
      this.options.includeSeparator,
      this.options.retry
    );
    this.referees = new RefereesResource(
      this.client,
      "/football/referees",
      this.options.includeSeparator,
      this.options.retry
    );
    this.transfers = new TransfersResource(
      this.client,
      "/football/transfers",
      this.options.includeSeparator,
      this.options.retry
    );
    this.venues = new VenuesResource(
      this.client,
      "/football/venues",
      this.options.includeSeparator,
      this.options.retry
    );
    this.news = new NewsResource(
      this.client,
      "/football/news",
      this.options.includeSeparator,
      this.options.retry
    );
    this.fixtures = new FixturesResource(
      this.client,
      "/football/fixtures",
      this.options.includeSeparator,
      this.options.retry
    );
    this.seasons = new SeasonsResource(
      this.client,
      "/football/seasons",
      this.options.includeSeparator,
      this.options.retry
    ), this.schedules = new SchedulesResource(
      this.client,
      "/football/schedules",
      this.options.includeSeparator,
      this.options.retry
    );
    this.squads = new SquadsResource(
      this.client,
      "/football/squads",
      this.options.includeSeparator,
      this.options.retry
    );
  }
  /**
   * Update the API key
   */
  setApiKey(apiKey) {
    if (!this.client.defaults.params) {
      this.client.defaults.params = {};
    }
    ;
    this.client.defaults.params.api_token = apiKey;
  }
  /**
   * Update the request timeout
   */
  setTimeout(timeout) {
    this.client.defaults.timeout = timeout;
  }
};

// src/types/enums.ts
var LeagueType = /* @__PURE__ */ ((LeagueType2) => {
  LeagueType2["LEAGUE"] = "league";
  LeagueType2["CUP"] = "cup";
  LeagueType2["SUPER_CUP"] = "super_cup";
  LeagueType2["FRIENDLY"] = "friendly";
  LeagueType2["DOMESTIC"] = "domestic";
  LeagueType2["INTERNATIONAL"] = "international";
  LeagueType2["PLAYOFFS"] = "playoffs";
  return LeagueType2;
})(LeagueType || {});
var LeagueSubType = /* @__PURE__ */ ((LeagueSubType2) => {
  LeagueSubType2["TOP_LEVEL"] = "top_level";
  LeagueSubType2["SECOND_LEVEL"] = "second_level";
  LeagueSubType2["THIRD_LEVEL"] = "third_level";
  LeagueSubType2["FOURTH_LEVEL"] = "fourth_level";
  LeagueSubType2["FIFTH_LEVEL"] = "fifth_level";
  LeagueSubType2["PLAYOFF"] = "playoff";
  LeagueSubType2["AMATEUR"] = "amateur";
  LeagueSubType2["YOUTH"] = "youth";
  LeagueSubType2["WOMEN"] = "women";
  return LeagueSubType2;
})(LeagueSubType || {});
var FixtureStatus = /* @__PURE__ */ ((FixtureStatus2) => {
  FixtureStatus2[FixtureStatus2["NS"] = 1] = "NS";
  FixtureStatus2[FixtureStatus2["LIVE"] = 2] = "LIVE";
  FixtureStatus2[FixtureStatus2["HT"] = 3] = "HT";
  FixtureStatus2[FixtureStatus2["FT"] = 5] = "FT";
  FixtureStatus2[FixtureStatus2["AET"] = 6] = "AET";
  FixtureStatus2[FixtureStatus2["FT_PEN"] = 7] = "FT_PEN";
  FixtureStatus2[FixtureStatus2["CANC"] = 8] = "CANC";
  FixtureStatus2[FixtureStatus2["POSTP"] = 9] = "POSTP";
  FixtureStatus2[FixtureStatus2["INT"] = 10] = "INT";
  FixtureStatus2[FixtureStatus2["ABAN"] = 11] = "ABAN";
  FixtureStatus2[FixtureStatus2["SUSP"] = 12] = "SUSP";
  FixtureStatus2[FixtureStatus2["AWARDED"] = 13] = "AWARDED";
  FixtureStatus2[FixtureStatus2["DELAYED"] = 14] = "DELAYED";
  FixtureStatus2[FixtureStatus2["TBA"] = 15] = "TBA";
  FixtureStatus2[FixtureStatus2["WO"] = 16] = "WO";
  FixtureStatus2[FixtureStatus2["AU"] = 17] = "AU";
  FixtureStatus2[FixtureStatus2["AP"] = 18] = "AP";
  return FixtureStatus2;
})(FixtureStatus || {});
var EventTypeId = /* @__PURE__ */ ((EventTypeId2) => {
  EventTypeId2[EventTypeId2["VAR"] = 10] = "VAR";
  EventTypeId2[EventTypeId2["GOAL"] = 14] = "GOAL";
  EventTypeId2[EventTypeId2["OWNGOAL"] = 15] = "OWNGOAL";
  EventTypeId2[EventTypeId2["PENALTY"] = 16] = "PENALTY";
  EventTypeId2[EventTypeId2["MISSED_PENALTY"] = 17] = "MISSED_PENALTY";
  EventTypeId2[EventTypeId2["SUBSTITUTION"] = 18] = "SUBSTITUTION";
  EventTypeId2[EventTypeId2["YELLOWCARD"] = 19] = "YELLOWCARD";
  EventTypeId2[EventTypeId2["REDCARD"] = 20] = "REDCARD";
  EventTypeId2[EventTypeId2["YELLOWREDCARD"] = 21] = "YELLOWREDCARD";
  EventTypeId2[EventTypeId2["PENALTY_SHOOTOUT_MISS"] = 22] = "PENALTY_SHOOTOUT_MISS";
  EventTypeId2[EventTypeId2["PENALTY_SHOOTOUT_GOAL"] = 23] = "PENALTY_SHOOTOUT_GOAL";
  EventTypeId2[EventTypeId2["CORNER"] = 126] = "CORNER";
  EventTypeId2[EventTypeId2["OFFSIDE"] = 568] = "OFFSIDE";
  EventTypeId2[EventTypeId2["SHOT_ON_TARGET"] = 569] = "SHOT_ON_TARGET";
  EventTypeId2[EventTypeId2["SHOT_OFF_TARGET"] = 570] = "SHOT_OFF_TARGET";
  EventTypeId2[EventTypeId2["VAR_CARD"] = 1697] = "VAR_CARD";
  EventTypeId2[EventTypeId2["WOODWORK"] = 48995] = "WOODWORK";
  return EventTypeId2;
})(EventTypeId || {});
var FixtureStatisticTypeId = /* @__PURE__ */ ((FixtureStatisticTypeId2) => {
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["BALL_POSSESSION"] = 45] = "BALL_POSSESSION";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["SHOTS_ON_TARGET"] = 86] = "SHOTS_ON_TARGET";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["SHOTS_TOTAL"] = 42] = "SHOTS_TOTAL";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["SHOTS_OFF_TARGET"] = 41] = "SHOTS_OFF_TARGET";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["CORNERS"] = 34] = "CORNERS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["OFFSIDES"] = 51] = "OFFSIDES";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["FOULS"] = 56] = "FOULS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["YELLOWCARDS"] = 84] = "YELLOWCARDS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["REDCARDS"] = 83] = "REDCARDS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["PASSES"] = 80] = "PASSES";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["SUCCESSFUL_PASSES"] = 81] = "SUCCESSFUL_PASSES";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["SUCCESSFUL_PASSES_PERCENTAGE"] = 82] = "SUCCESSFUL_PASSES_PERCENTAGE";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["ATTACKS"] = 43] = "ATTACKS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["DANGEROUS_ATTACKS"] = 44] = "DANGEROUS_ATTACKS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["GOALS"] = 52] = "GOALS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["SAVES"] = 57] = "SAVES";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["EXPECTED_GOALS"] = 5304] = "EXPECTED_GOALS";
  FixtureStatisticTypeId2[FixtureStatisticTypeId2["EXPECTED_GOALS_ON_TARGET"] = 5305] = "EXPECTED_GOALS_ON_TARGET";
  return FixtureStatisticTypeId2;
})(FixtureStatisticTypeId || {});
var PositionType = /* @__PURE__ */ ((PositionType2) => {
  PositionType2[PositionType2["GOALKEEPER"] = 1] = "GOALKEEPER";
  PositionType2[PositionType2["DEFENDER"] = 2] = "DEFENDER";
  PositionType2[PositionType2["MIDFIELDER"] = 3] = "MIDFIELDER";
  PositionType2[PositionType2["ATTACKER"] = 4] = "ATTACKER";
  return PositionType2;
})(PositionType || {});
var TeamType = /* @__PURE__ */ ((TeamType2) => {
  TeamType2["DOMESTIC"] = "domestic";
  TeamType2["NATIONAL"] = "national";
  return TeamType2;
})(TeamType || {});
var Gender = /* @__PURE__ */ ((Gender2) => {
  Gender2["MALE"] = "male";
  Gender2["FEMALE"] = "female";
  return Gender2;
})(Gender || {});
var LineupType = /* @__PURE__ */ ((LineupType2) => {
  LineupType2[LineupType2["LINEUP"] = 11] = "LINEUP";
  LineupType2[LineupType2["BENCH"] = 12] = "BENCH";
  LineupType2[LineupType2["SIDELINED"] = 13] = "SIDELINED";
  LineupType2[LineupType2["MISSING"] = 14] = "MISSING";
  return LineupType2;
})(LineupType || {});
var TransferTypeEnum = /* @__PURE__ */ ((TransferTypeEnum2) => {
  TransferTypeEnum2["TRANSFER"] = "transfer";
  TransferTypeEnum2["LOAN"] = "loan";
  TransferTypeEnum2["FREE"] = "free";
  return TransferTypeEnum2;
})(TransferTypeEnum || {});
var StandingRule = /* @__PURE__ */ ((StandingRule2) => {
  StandingRule2[StandingRule2["POINTS"] = 1] = "POINTS";
  StandingRule2[StandingRule2["GOAL_DIFFERENCE"] = 2] = "GOAL_DIFFERENCE";
  StandingRule2[StandingRule2["HEAD_TO_HEAD"] = 3] = "HEAD_TO_HEAD";
  StandingRule2[StandingRule2["GOALS_FOR"] = 4] = "GOALS_FOR";
  StandingRule2[StandingRule2["AWAY_GOALS"] = 5] = "AWAY_GOALS";
  StandingRule2[StandingRule2["WINS"] = 6] = "WINS";
  StandingRule2[StandingRule2["DRAWS"] = 7] = "DRAWS";
  StandingRule2[StandingRule2["LOSSES"] = 8] = "LOSSES";
  return StandingRule2;
})(StandingRule || {});
var ScoreType = /* @__PURE__ */ ((ScoreType2) => {
  ScoreType2[ScoreType2["CURRENT"] = 1208] = "CURRENT";
  ScoreType2[ScoreType2["HALFTIME"] = 1209] = "HALFTIME";
  ScoreType2[ScoreType2["NORMALTIME"] = 1456] = "NORMALTIME";
  ScoreType2[ScoreType2["EXTRATIME"] = 1457] = "EXTRATIME";
  ScoreType2[ScoreType2["PENALTIES"] = 1458] = "PENALTIES";
  ScoreType2[ScoreType2["AGGREGATED"] = 1713] = "AGGREGATED";
  return ScoreType2;
})(ScoreType || {});
var VenueSurface = /* @__PURE__ */ ((VenueSurface2) => {
  VenueSurface2["GRASS"] = "grass";
  VenueSurface2["ARTIFICIAL"] = "artificial";
  VenueSurface2["HYBRID"] = "hybrid";
  VenueSurface2["ASTROTURF"] = "astroturf";
  VenueSurface2["CONCRETE"] = "concrete";
  VenueSurface2["GRAVEL"] = "gravel";
  return VenueSurface2;
})(VenueSurface || {});
var SortOrder = /* @__PURE__ */ ((SortOrder2) => {
  SortOrder2["ASC"] = "asc";
  SortOrder2["DESC"] = "desc";
  return SortOrder2;
})(SortOrder || {});
var PlayerStatisticType = /* @__PURE__ */ ((PlayerStatisticType2) => {
  PlayerStatisticType2[PlayerStatisticType2["MINUTES_PLAYED"] = 90] = "MINUTES_PLAYED";
  PlayerStatisticType2[PlayerStatisticType2["GOALS"] = 208] = "GOALS";
  PlayerStatisticType2[PlayerStatisticType2["ASSISTS"] = 209] = "ASSISTS";
  PlayerStatisticType2[PlayerStatisticType2["OFFSIDES"] = 210] = "OFFSIDES";
  PlayerStatisticType2[PlayerStatisticType2["SHOTS_TOTAL"] = 211] = "SHOTS_TOTAL";
  PlayerStatisticType2[PlayerStatisticType2["SHOTS_ON_TARGET"] = 217] = "SHOTS_ON_TARGET";
  PlayerStatisticType2[PlayerStatisticType2["GOALS_CONCEDED"] = 220] = "GOALS_CONCEDED";
  PlayerStatisticType2[PlayerStatisticType2["PENALTIES"] = 215] = "PENALTIES";
  PlayerStatisticType2[PlayerStatisticType2["PENALTIES_SCORED"] = 216] = "PENALTIES_SCORED";
  PlayerStatisticType2[PlayerStatisticType2["PENALTIES_MISSED"] = 218] = "PENALTIES_MISSED";
  PlayerStatisticType2[PlayerStatisticType2["PENALTIES_SAVED"] = 223] = "PENALTIES_SAVED";
  PlayerStatisticType2[PlayerStatisticType2["SAVES"] = 214] = "SAVES";
  PlayerStatisticType2[PlayerStatisticType2["YELLOWCARDS"] = 212] = "YELLOWCARDS";
  PlayerStatisticType2[PlayerStatisticType2["REDCARDS"] = 213] = "REDCARDS";
  PlayerStatisticType2[PlayerStatisticType2["HIT_WOODWORK"] = 602] = "HIT_WOODWORK";
  PlayerStatisticType2[PlayerStatisticType2["PASSES"] = 595] = "PASSES";
  PlayerStatisticType2[PlayerStatisticType2["PASSES_ACCURATE"] = 596] = "PASSES_ACCURATE";
  PlayerStatisticType2[PlayerStatisticType2["CLEANSHEETS"] = 597] = "CLEANSHEETS";
  PlayerStatisticType2[PlayerStatisticType2["TACKLES"] = 598] = "TACKLES";
  PlayerStatisticType2[PlayerStatisticType2["FOULS_COMMITTED"] = 594] = "FOULS_COMMITTED";
  return PlayerStatisticType2;
})(PlayerStatisticType || {});

// src/types/sportmonks-syntax.ts
var SportMonksSyntaxBuilder = class {
  /**
   * Build include string from configuration
   */
  static buildIncludes(config, separator = ";") {
    const includes = [];
    Object.entries(config).forEach(([relation, settings]) => {
      if (settings === true) {
        includes.push(relation);
      } else if (settings && typeof settings === "object") {
        let includeStr = relation;
        if (Array.isArray(settings.fields) && settings.fields.length > 0) {
          includeStr += ":" + settings.fields.join(",");
        }
        includes.push(includeStr);
        if (settings.nested) {
          Object.entries(settings.nested).forEach(([nestedRelation, nestedSettings]) => {
            let nestedStr = `${relation}.${nestedRelation}`;
            if (nestedSettings && typeof nestedSettings === "object" && Array.isArray(nestedSettings.fields)) {
              nestedStr += ":" + nestedSettings.fields.join(",");
            }
            includes.push(nestedStr);
          });
        }
      }
    });
    return includes.join(separator);
  }
  /**
   * Build filter string from configuration
   */
  static buildFilters(filters) {
    return Object.entries(filters).map(([key, value]) => {
      const filterValue = Array.isArray(value) ? value.join(",") : String(value);
      return `${key}:${filterValue}`;
    }).join(";");
  }
};
var SportMonksFilters = {
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
    VAR: 10
  },
  /**
   * Fixture status filters
   */
  Status: {
    NOT_STARTED: "NS",
    LIVE: "LIVE",
    HALF_TIME: "HT",
    FULL_TIME: "FT",
    FINISHED: "FT",
    CANCELLED: "CANCL",
    POSTPONED: "POSTP"
  }
};

// src/utils/polling.ts
var Poller = class {
  constructor(fetchFunction, options) {
    this.fetchFunction = fetchFunction;
    this.options = options;
    this.isPolling = false;
  }
  /**
   * Start polling
   */
  start() {
    if (this.isPolling) {
      throw new Error("Polling is already active");
    }
    this.isPolling = true;
    this.startTime = Date.now();
    void this.fetch();
    this.intervalId = setInterval(() => {
      if (this.options.maxDuration && this.startTime) {
        const elapsed = Date.now() - this.startTime;
        if (elapsed >= this.options.maxDuration) {
          this.stop();
          return;
        }
      }
      void this.fetch();
    }, this.options.interval);
  }
  /**
   * Stop polling
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = void 0;
    }
    this.isPolling = false;
  }
  /**
   * Check if currently polling
   */
  isActive() {
    return this.isPolling;
  }
  /**
   * Fetch data and handle callbacks
   */
  async fetch() {
    try {
      const data = await this.fetchFunction();
      const hasChanged = this.hasDataChanged(data);
      if (hasChanged && this.options.onData) {
        this.options.onData(data);
      }
      this.lastData = data;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      if (this.options.stopOnError) {
        this.stop();
      }
    }
  }
  /**
   * Check if data has changed
   */
  hasDataChanged(newData) {
    if (!this.lastData) {
      return true;
    }
    if (this.options.compareFunction) {
      return this.options.compareFunction(this.lastData, newData);
    }
    if (this.isPaginatedResponse(newData) && this.isPaginatedResponse(this.lastData)) {
      const oldIds = new Set(this.lastData.data.map((item) => item.id));
      const newIds = new Set(newData.data.map((item) => item.id));
      for (const id of newIds) {
        if (!oldIds.has(id)) {
          return true;
        }
      }
      for (const id of oldIds) {
        if (!newIds.has(id)) {
          return true;
        }
      }
      return false;
    }
    return JSON.stringify(this.lastData) !== JSON.stringify(newData);
  }
  /**
   * Type guard for paginated response
   */
  isPaginatedResponse(data) {
    return !!(data && typeof data === "object" && "data" in data && Array.isArray(data.data) && "pagination" in data);
  }
};
function createLivescoresPoller(fetchFunction, options = {}) {
  const defaultOptions = {
    interval: 1e4,
    // 10 seconds
    maxDuration: 36e5,
    // 1 hour
    stopOnError: false,
    ...options
  };
  return new Poller(fetchFunction, defaultOptions);
}
function createTransfersPoller(fetchFunction, options = {}) {
  const defaultOptions = {
    interval: 6e4,
    // 1 minute
    maxDuration: 864e5,
    // 24 hours
    stopOnError: false,
    compareFunction: (oldData, newData) => {
      const oldPaginated = oldData;
      const newPaginated = newData;
      if (!oldPaginated.data.length || !newPaginated.data.length) {
        return true;
      }
      const oldLatest = oldPaginated.data.map((t) => new Date(t.date).getTime()).sort((a, b) => b - a)[0];
      const newLatest = newPaginated.data.map((t) => new Date(t.date).getTime()).sort((a, b) => b - a)[0];
      return newLatest > oldLatest;
    },
    ...options
  };
  return new Poller(fetchFunction, defaultOptions);
}

// src/utils/type-helpers.ts
function hasInclude(obj, key) {
  return obj[key] !== void 0 && obj[key] !== null;
}
function hasData(response) {
  return response !== null && typeof response === "object" && "data" in response && response.data !== void 0;
}
function isPaginatedResponse(response) {
  return hasData(response) && Array.isArray(response.data);
}
function isSingleResponse(response) {
  return hasData(response) && !Array.isArray(response.data);
}
function getNestedInclude(obj, include, property) {
  const included = obj[include];
  if (!included) return void 0;
  if (property && typeof included === "object" && included !== null) {
    return included[property];
  }
  return included;
}
function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}
function sortByCapacity(a, b) {
  return (b.capacity || 0) - (a.capacity || 0);
}
function createTransformer(fn) {
  return fn;
}
export {
  BaseResource,
  CoachesResource,
  EventTypeId,
  FixtureStatisticTypeId,
  FixtureStatus,
  FixturesResource,
  Gender,
  LeagueSubType,
  LeagueType,
  LeaguesResource,
  LineupType,
  LivescoresResource,
  NewsResource,
  PlayerStatisticType,
  PlayersResource,
  Poller,
  PositionType,
  QueryBuilder,
  RefereesResource,
  SchedulesResource,
  ScoreType,
  SeasonsResource,
  SortOrder,
  SportMonksClient,
  SportMonksError,
  SportMonksFilters,
  SportMonksSyntaxBuilder,
  SportMonksClient as SportmonksClient,
  SquadsResource,
  StandingRule,
  StandingsResource,
  TeamType,
  TeamsResource,
  TransferTypeEnum,
  TransfersResource,
  VenueSurface,
  VenuesResource,
  createLivescoresPoller,
  createTransfersPoller,
  createTransformer,
  SportMonksClient as default,
  formatDate,
  getDaysAgo,
  getDaysFromNow,
  getNestedInclude,
  getToday,
  hasData,
  hasInclude,
  isPaginatedResponse,
  isSingleResponse,
  parseJsonSafely,
  sanitizeUrlParam,
  sortByCapacity,
  sortByName,
  validateDateFormat,
  validateDateRange,
  validateEnum,
  validateId,
  validateIds,
  validatePagination,
  validateSearchQuery
};
