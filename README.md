# SportMonks TypeScript SDK

A comprehensive, production-ready TypeScript SDK for the SportMonks Football API v3. Built with modern TypeScript, featuring complete type safety, intuitive method chaining, automatic retries, real-time polling, and extensive test coverage.

[![npm version](https://img.shields.io/npm/v/@withqwerty/sportmonks-typescript-sdk.svg)](https://www.npmjs.com/package/@withqwerty/sportmonks-typescript-sdk)
[![CI](https://github.com/rahulkeerthi/fitba/actions/workflows/sdk-test.yml/badge.svg)](https://github.com/rahulkeerthi/fitba/actions/workflows/sdk-test.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Full TypeScript Support** - Complete type definitions for all 50+ entities and responses
- 🔗 **Intuitive Method Chaining** - Fluent API design for building complex queries naturally
- 📦 **Comprehensive Coverage** - 10 resources with 56 endpoints covering all major football data
- 🔄 **Smart Retry Logic** - Automatic retry with exponential backoff and rate limit awareness
- 📊 **Real-time Updates** - Built-in polling utilities for livescores and transfer monitoring
- ✅ **Input Validation** - Automatic validation of dates, IDs, and search queries with helpful errors
- 🎯 **Type-safe Includes** - Full TypeScript support for relationship includes
- 📈 **Performance Optimized** - Efficient pagination, response caching, and minimal dependencies
- 🧪 **Battle-tested** - 330+ tests with 97.6% coverage and real API validation
- 📝 **Extensive Documentation** - Comprehensive JSDoc comments, examples, and guides

## Installation

```bash
npm install @withqwerty/sportmonks-typescript-sdk
```

## Quick Start

```typescript
import { SportMonksClient } from '@withqwerty/sportmonks-typescript-sdk'

const client = new SportMonksClient('YOUR_API_KEY')

// Get fixtures for today
const fixtures = await client.fixtures
  .byDate('2024-01-15')
  .include(['localteam', 'visitorteam', 'venue'])
  .get()

// Get Premier League standings
const standings = await client.standings.bySeason(19735).include(['participant']).get()
```

### Interactive REPL

Test and explore the API interactively with the built-in REPL:

```bash
# Set up your API key (one-time setup)
export SPORTMONKS_API_KEY=your_api_key_here
# OR create a .env file with: SPORTMONKS_API_KEY=your_api_key_here

# Run the interactive REPL
npx sportmonks-repl

# Run with advanced features (type browsing, better formatting)
npx sportmonks-repl --advanced

# In the REPL, you can directly use resources without 'client.' prefix:
sportmonks> await leagues.all().limit(5).get()
sportmonks> await teams.search('Liverpool').get()
sportmonks> await fixtures.byDate('2024-03-30').include(['participants', 'scores']).get()
```

See the [REPL documentation](docs/REPL.md) for more details and examples.

## Configuration

```typescript
const client = new SportMonksClient('YOUR_API_KEY', {
  baseUrl: 'https://api.sportmonks.com/v3',
  timeout: 30000,
  includeSeparator: ',',
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    maxRetryDelay: 30000,
    retryOnRateLimit: true,
    retryStatusCodes: [502, 503, 504],
  },
})
```

## Available Resources

### Core Resources

#### Leagues

```typescript
// Get all leagues
const leagues = await client.leagues.all().get()

// Get league by ID
const league = await client.leagues.byId(8).get()

// Search leagues
const searchResults = await client.leagues.search('Premier').get()

// Get leagues with live fixtures
const liveLeagues = await client.leagues.live().get()
```

#### Teams

```typescript
// Get team by ID with relationships
const team = await client.teams.byId(1).include(['country', 'venue', 'squad']).get()

// Search teams
const teams = await client.teams.search('Manchester').get()

// Get teams by season
const seasonTeams = await client.teams.bySeason(19735).get()
```

#### Fixtures

```typescript
// Get fixtures by date range
const fixtures = await client.fixtures
  .byDateRange('2024-01-01', '2024-01-31')
  .include(['localteam', 'visitorteam', 'events', 'statistics'])
  .get()

// Get head-to-head
const h2h = await client.fixtures.headToHead(1, 14).get()

// Search fixtures
const matches = await client.fixtures.search('derby').get()

// Get fixtures by TV station
const tvFixtures = await client.fixtures.upcomingByTvStation(1).get()
```

#### Players

```typescript
// Get player details
const player = await client.players.byId(30981).include(['team', 'statistics']).get()

// Search players
const players = await client.players.search('Ronaldo').get()
```

#### Standings

```typescript
// Get season standings
const standings = await client.standings.bySeason(19735).include(['participant', 'league']).get()

// Get live standings
const liveStandings = await client.standings.liveByLeague(8).get()

// Get standing corrections
const corrections = await client.standings.correctionsBySeason(19735).get()
```

#### Livescores

```typescript
// Get in-play fixtures
const inplay = await client.livescores
  .inplay()
  .include(['localteam', 'visitorteam', 'scores', 'events'])
  .get()

// Get all livescores (15 min before kickoff)
const upcoming = await client.livescores.all().get()

// Get recently updated
const updates = await client.livescores.latest().get()
```

#### News

```typescript
// Get pre-match news for a league
const preMatch = await client.news.prematch().filter('league_id', 8).get()

// Get post-match news for a fixture
const postMatch = await client.news.postmatch().filter('fixture_id', 18535482).get()

// Get specific news article
const article = await client.news.byId(123).get()
```

#### Team Squads

```typescript
// Get current squad
const currentSquad = await client.teams.squad(1).include(['player']).get()

// Get squad for a specific season
const historicalSquad = await client.teams.squad(1, 21646).include(['player']).get()
```

#### Player Statistics

```typescript
// Get all player statistics
const playerStats = await client.players.statistics(278).get()

// Get player statistics for a specific season
const seasonStats = await client.players.statisticsBySeason(278, 21646).get()
```

### Additional Resources

- **Transfers** - Player transfers with date filtering
- **Coaches** - Coach information and history
- **Referees** - Referee data and assignments
- **Venues** - Stadium/venue information
- **News** - Pre-match and post-match news articles

## Advanced Features

### Pagination

```typescript
const teams = await client.teams.all().page(2).perPage(25).get()
```

### Filtering

```typescript
const standings = await client.standings
  .all()
  .filter('season_id', 19735)
  .filter('stage_id', 77457866)
  .get()
```

### Sorting

```typescript
const venues = await client.venues
  .all()
  .orderBy('-capacity') // Descending order
  .get()
```

### SportMonks Syntax Support

The SDK fully supports SportMonks' advanced query syntax:

```typescript
// Field selection on includes
const fixtures = await client.fixtures
  .byDate('2024-01-15')
  .includeFields('lineups', ['player_name', 'jersey_number'])
  .includeFields('events', ['player_name', 'related_player_name', 'minute'])
  .get()

// Complex includes with field selection
const match = await client.fixtures
  .byId(123456)
  .withIncludes({
    lineups: ['player_name', 'jersey_number'],
    events: ['player_name', 'minute', 'type'],
    participants: true, // Include all fields
    venue: ['name', 'city', 'capacity'],
  })
  .get()

// Multiple filter values
const goalEvents = await client.fixtures
  .byDate('2024-01-15')
  .filter('eventTypes', [14, 15, 16]) // Goals, own goals, penalties
  .get()

// Advanced SportMonks syntax
import { SportMonksSyntaxBuilder } from 'sportmonks-typescript-sdk'

// Build complex includes programmatically
const includeString = SportMonksSyntaxBuilder.buildIncludes({
  lineups: { fields: ['player_name'] },
  events: { fields: ['player_name', 'minute'] },
  league: {
    fields: true,
    nested: {
      country: { fields: ['name'] },
    },
  },
})
// Result: "lineups:player_name;events:player_name,minute;league;league.country:name"
```

### Real-time Polling

```typescript
import { createLivescoresPoller } from 'sportmonks-typescript-sdk'

// Poll for live scores every 10 seconds
const poller = createLivescoresPoller(() => client.livescores.inplay().get(), {
  interval: 10000,
  onData: data => {
    console.log('Live update:', data)
  },
  onError: error => {
    console.error('Polling error:', error)
  },
})

poller.start()
// Later: poller.stop();
```

### Date Helpers

```typescript
import { formatDate, getToday, getDaysFromNow } from 'sportmonks-typescript-sdk'

// Get fixtures for today
const today = await client.fixtures.byDate(getToday()).get()

// Get fixtures for next week
const nextWeek = await client.fixtures.byDateRange(getToday(), getDaysFromNow(7)).get()
```

## Rate Limiting

The SDK automatically handles rate limiting information returned by the API:

```typescript
const response = await client.leagues.all().get()

console.log(response.rate_limit?.remaining) // Requests remaining
console.log(response.rate_limit?.resets_in_seconds) // Reset time
```

With retry enabled, the SDK will automatically wait and retry when rate limits are exceeded.

## Error Handling

```typescript
import { SportMonksError } from 'sportmonks-typescript-sdk'

try {
  const team = await client.teams.byId(99999).get()
} catch (error) {
  if (error instanceof SportMonksError) {
    console.error('API Error:', error.message)
    console.error('Status Code:', error.statusCode)
    console.error('API Message:', error.apiMessage)
  }
}
```

## Type Safety

All responses are fully typed:

```typescript
import type { Team, League, Fixture } from '@withqwerty/sportmonks-typescript-sdk'

const fixture: Fixture = await client.fixtures.byId(18535517).get()
const homeTeam: Team = fixture.localteam!
const league: League = fixture.league!
```

### Type Helpers

The SDK includes type helper utilities for better type safety:

```typescript
import { hasInclude, TeamWithCountry, sortByName } from '@withqwerty/sportmonks-typescript-sdk'

const team = await client.teams.byId(1).include(['country']).get()

// Type-safe include checking
if (hasInclude(team.data, 'country')) {
  console.log(team.data.country.name) // ✅ TypeScript knows country exists
}

// Pre-defined types for common includes
function processTeam(team: TeamWithCountry) {
  console.log(`${team.name} from ${team.country.name}`)
}

// Type-safe sorting
const teams = await client.teams.all().get()
const sorted = teams.data.sort(sortByName)
```

See [Type Helpers Guide](docs/TYPE_HELPERS.md) for complete documentation.

## API Coverage

### Implemented Endpoints

✅ **Core Resources**

- Leagues (8 endpoints)
- Teams (5 endpoints)
- Fixtures (13 endpoints)
- Players (5 endpoints)
- Standings (5 endpoints)
- Livescores (3 endpoints)

✅ **Additional Resources**

- Transfers (6 endpoints)
- Coaches (5 endpoints)
- Referees (5 endpoints)
- Venues (4 endpoints)

✅ **Enhancements**

- Automatic retry with exponential backoff
- Real-time polling utilities
- Date validation and formatting
- Input validation
- Comprehensive TypeScript types
- Response metadata (rate limits, subscription)

### Not Implemented

- Odds/Betting endpoints
- Predictions
- TV Stations

## Full Documentation

For complete documentation, examples, and API reference, visit our [documentation site](https://github.com/rahulkeerthi/sportmonks-typescript-sdk/wiki).

## Requirements

- Node.js >= 14
- TypeScript >= 4.5 (for development)
- Valid SportMonks API key ([Get one here](https://www.sportmonks.com/))

NB: Check [your subscription plan](https://my.sportmonks.com/subscriptions) to see which endpoints you have access to

## Testing

```bash
# Set your API key for integration tests
export SPORTMONKS_TEST_API_KEY=your_api_key_here

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests (requires API key)
SPORTMONKS_TEST_API_KEY=your_key npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Performance Considerations

- **Rate Limits**: 3000 requests/hour per resource (automatically handled)
- **Response Size**: Use `select()` to request only needed fields
- **Caching**: Implement application-level caching for frequently accessed data
- **Polling**: Use built-in polling utilities instead of manual intervals

## Common Issues

### Include Parameters Not Working

Some includes require premium subscriptions. Check the error message for details.

### Filters Not Supported

Not all endpoints support all filters. The API will return helpful error messages indicating which filters are available.

### Transfer Endpoint Semicolon

The transfers endpoint requires semicolon separators for includes:

```typescript
const client = new SportMonksClient(API_KEY, { includeSeparator: ';' })
```

## Interactive REPL

The SDK includes an interactive REPL (Read-Eval-Print Loop) for testing and exploring the API:

```bash
# Start the REPL
npm run repl

# Advanced REPL with more features
npm run repl:advanced
```

In the REPL, you can run queries directly:

```javascript
// No need to type 'client.' - just use the resources directly
await teams.search('Liverpool').get()
await fixtures.byDate('2024-01-15').include(['localteam', 'visitorteam']).get()
await leagues.all().limit(5).get()
```

See [docs/REPL.md](docs/REPL.md) for full REPL documentation.

## Migration Guide

### Migrating from Previous Versions

If you're migrating from an older version that used method-based API calls, here's how to update your code:

#### Old API (method-based)

```typescript
// Old way
const leagues = await client.getLeagues({
  page: 1,
  per_page: 50,
  include: ['country', 'seasons'],
})

const team = await client.getTeam(1, { include: ['squad'] })
```

#### New API (resource-based)

```typescript
// New way
const leagues = await client.leagues.all().page(1).perPage(50).include(['country', 'seasons']).get()

const team = await client.teams.byId(1).include(['squad']).get()
```

### Key Changes

1. **Resource-based Architecture**: Methods are now organized by resource (leagues, teams, fixtures, etc.)
2. **Fluent Query Builder**: Chain methods to build your query before calling `.get()`
3. **Response Structure**: All responses now return `{ data: T }` instead of just `T`
4. **Type Imports**: Import from `@withqwerty/sportmonks-typescript-sdk` instead of the old package name

### Currently Missing Methods

The following methods from the old SDK are not yet implemented:

- Player career methods: `players.careerStatistics()`, `players.transfers()`, `players.career()`
- Extended squad methods: `teams.extendedSquad()`

These will be added in future releases.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

MIT - see [LICENSE](LICENSE) for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/rahulkeerthi/sportmonks-typescript-sdk.git

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## Support

- **Documentation**: [Full API Reference](https://github.com/rahulkeerthi/sportmonks-typescript-sdk/wiki)
- **Issues**: [GitHub Issues](https://github.com/rahulkeerthi/sportmonks-typescript-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rahulkeerthi/sportmonks-typescript-sdk/discussions)
- **SportMonks API**: [Official API Documentation](https://docs.sportmonks.com/football)

## Credits

Built with ❤️ by [Rahul Keerthi](https://github.com/rahulkeerthi)

Special thanks to SportMonks for providing an excellent sports data API.
