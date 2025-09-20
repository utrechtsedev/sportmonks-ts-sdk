# Changelog

## 1.4.1 

- Added Squads entity
- Updated README.md

## 1.4.0

### Minor Changes

- Added Season entity and all corrosponding types
- Added Schedules entity
- Changed package name from '@withqwerty/sportmonks-typescript-sdk' to 'sportmonks-ts-sdk'

## 1.2.0

### Minor Changes

- Complete Jest to Vitest migration
- Add missing SDK methods (news, team squad, player statistics)
- Fix integration tests to use SPORTMONKS_TEST_API_KEY consistently
- Update tests to handle API response patterns correctly
- Change date-based tests to use static dates for consistency
- Add legacy export SportmonksClient for backward compatibility
- Fix TypeScript types and improve test coverage
- All 352 tests passing (18 skipped due to subscription limits)

## 1.0.1

### Patch Changes

- edceaaf: Fix SDK tests and add missing functionality

  - Complete Jest to Vitest migration
  - Add missing SDK methods (news, team squad, player statistics)
  - Fix integration tests to use SPORTMONKS_TEST_API_KEY consistently
  - Update tests to handle API response patterns correctly
  - Change date-based tests to use static dates for consistency
  - Add legacy export SportmonksClient for backward compatibility
  - Fix TypeScript types and improve test coverage

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-01

### Changed

- **IMPORTANT**: Changed default include separator from comma (`,`) to semicolon (`;`) to match SportMonks API requirements for multiple includes
- Updated all unit tests to use semicolon separator for multiple includes
- Improved TypeScript types by replacing `any` with proper types in type helpers and validators

### Added

- Input validation for PlayersResource:
  - ID validation in `byId()` and `byCountry()` methods
  - Search query validation with minimum length check
- Type helper utilities in `src/utils/type-helpers.ts`:
  - `hasInclude()` - Type guard to check if an include exists
  - `hasData()` - Type guard for responses with data
  - `isPaginatedResponse()` - Type guard for paginated responses
  - `isSingleResponse()` - Type guard for single responses
  - `WithRequired<T, K>` - Type helper to make optional properties required
  - Pre-defined types like `TeamWithCountry`, `FixtureWithTeams`, etc.
- Documentation for type helpers (`docs/TYPE_HELPERS.md`)
- ESLint configuration for test files (`tsconfig.eslint.json`)
- Global REPL command accessible via `npx sportmonks-repl` when installed via npm

### Fixed

- Integration test failures:
  - Updated players test to use Denmark (ID: 320) instead of Brazil for European Plan compatibility
  - Updated fixtures pagination test to use dates with more fixtures (2025-03-30)
  - Skipped latest fixtures test due to subscription limitations
- ESLint configuration to properly lint test files
- Prettier formatting in type helpers and test files
- Test coverage improved to 97.7%

### Developer Notes

- The include separator change maintains backwards compatibility for single includes
- Multiple includes now require semicolon separation (e.g., `include: 'country;venue'`)
- Field selectors within includes still use commas (e.g., `include: 'team:name,short_code'`)

## [1.0.2] - 2025-05-31

### Added

- Interactive REPL (Read-Eval-Print Loop) for testing and exploring the API
  - Simple REPL with direct resource access (`npm run repl`)
  - Advanced REPL with additional features (`npm run repl:advanced`)
  - Helper functions: `pp()`, `data()`, `examples()`, `resources()`
  - Command history persistence
  - No need to type `client.` prefix - direct access to resources

### Fixed

- Fixed `fixtures` resource documentation (removed non-existent `live()` method)
- Clarified that live matches are accessed via `livescores.inplay()`

### Changed

- Moved REPL tools from `scripts/` to `tools/` directory for better organization

## [1.0.1] - 2025-05-31

### Changed

- Updated all dev dependencies to latest stable versions
- Migrated from ESLint v8 to v9 with new flat config format
- Updated husky to v9 simplified format
- Fixed CI/CD workflow issues (updated upload-artifact to v4)

### Fixed

- Removed all deprecation warnings
- Fixed unused variable ESLint errors

### Removed

- Deprecated `@types/dotenv` package (dotenv now includes its own types)

## [1.0.0] - 2025-05-31

### Added

- Initial release of SportMonks TypeScript SDK
- Full TypeScript support with comprehensive type definitions
- Support for 10 resources with 56 endpoints:
  - **Leagues** (8 endpoints): all, byId, byCountry, search, live, byDate, byTeam, currentByTeam
  - **Teams** (5 endpoints): all, byId, byCountry, bySeason, search
  - **Players** (5 endpoints): all, byId, byCountry, search, latest
  - **Fixtures** (13 endpoints): all, byId, byIds, byDate, byDateRange, byTeamAndDateRange, byTeamAndSeason, headToHead, search, byLivescores, byFixtureMulti, latest, byTvStation
  - **Standings** (5 endpoints): all, bySeasonId, byRoundId, bySeasonIdCorrected, liveByLeagueId
  - **Livescores** (3 endpoints): all, inplay, latest
  - **Transfers** (6 endpoints): all, byId, latest, byDateRange, byPlayerId, byTeamId
  - **Coaches** (5 endpoints): all, byId, byCountryId, byTeamId, search
  - **Referees** (5 endpoints): all, byId, byCountryId, bySeasonId, search
  - **Venues** (4 endpoints): all, byId, bySeasonId, search
- Method chaining for intuitive query building
- Automatic retry logic with exponential backoff
- Real-time polling utilities for livescores and transfers
- Input validation for dates, IDs, and search queries
- Rate limit information in responses
- Comprehensive error handling with detailed messages
- Support for includes, filters, pagination, and sorting
- Custom include separator support (for transfers endpoint)
- Enhanced support for SportMonks' advanced query syntax
  - `includeFields()` method for field selection on includes
  - `withIncludes()` method for complex include configurations
  - Support for multiple filter values using arrays
  - `SportMonksSyntaxBuilder` utility for programmatic query building
  - Full TypeScript types for SportMonks syntax patterns
- Comprehensive test coverage improvements (97.62% coverage)

### Features

- **Type Safety**: Strong TypeScript types for all entities and API responses
- **Method Chaining**: Fluent API design for building complex queries
- **Error Handling**: Detailed error messages with context
- **Retry Logic**: Automatic retries with exponential backoff for failed requests
- **Polling Utilities**: Built-in support for real-time data updates
- **Validation**: Input validation for common parameters
- **Flexible Configuration**: Customizable timeout, base URL, and include separator

### Testing

- Comprehensive test suite with 330+ tests
- Unit tests for all resources and utilities
- Integration tests with real API (when API key provided)
- 97.62% code coverage

### Documentation

- Complete README with installation and usage instructions
- JSDoc comments on all public methods
- Examples for all major use cases
- Migration guide for future versions
