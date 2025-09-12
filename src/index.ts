/**
 * SportMonks Football API TypeScript SDK
 *
 * A comprehensive TypeScript SDK for the SportMonks Football API with full type safety,
 * method chaining, and all available endpoints.
 */

// Main client export
export { SportMonksClient } from './client'
export { SportMonksClient as default } from './client'
// Legacy export for backward compatibility
export { SportMonksClient as SportmonksClient } from './client'

// Type exports
export * from './types'

// Core exports (for advanced usage)
export { BaseResource } from './core/base-resource'
export { QueryBuilder } from './core/query-builder'
export { SportMonksError } from './core/errors'

// Resource exports (for type references)
export * from './resources'

// Utility exports
export * from './utils'
