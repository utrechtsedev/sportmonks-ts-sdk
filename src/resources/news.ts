import { BaseResource } from '../core/base-resource'
import { QueryBuilder } from '../core/query-builder'
import { PaginatedResponse, SingleResponse, NewsArticle } from '../types'
import { validateId } from '../utils/validators'

/**
 * News resource for accessing pre-match and post-match articles.
 * @see https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/news
 */
export class NewsResource extends BaseResource {
  /**
   * Get pre-match news articles.
   * Supports standard filters (fixture_id, league_id, season_id).
   * @example
   * const news = await client.news.prematch().filter('league_id', 8).get()
   */
  prematch(): QueryBuilder<PaginatedResponse<NewsArticle>> {
    return new QueryBuilder<PaginatedResponse<NewsArticle>>(this, '/pre-match')
  }

  /**
   * Get post-match news articles.
   * @example
   * const news = await client.news.postmatch().filter('fixture_id', 18535482).get()
   */
  postmatch(): QueryBuilder<PaginatedResponse<NewsArticle>> {
    return new QueryBuilder<PaginatedResponse<NewsArticle>>(this, '/post-match')
  }

  /**
   * Get a single news article by ID.
   * @param id News article ID
   */
  byId(id: string | number): QueryBuilder<SingleResponse<NewsArticle>> {
    const validated = validateId(id, 'News ID')
    return new QueryBuilder<SingleResponse<NewsArticle>>(this, `/${validated}`)
  }
}
