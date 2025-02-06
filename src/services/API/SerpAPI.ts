import { BaseResponse, getJson } from 'serpapi';
import { serpAPIConfig } from '../../config.json';
import { SearchFn } from '../../types';
import { cf, Logger } from '../../utils/misc';

export default abstract class SerpAPI {
  /**
   * `[ API: SerpAPI ]`
   *
   * Searches for real-time data using the SerpAPI Google Search Engine.
   * The returned data is limited for usage lowering purposes.
   *
   * @param q Query to search
   * @param options Search options
   * @returns Search results
   */
  public static search: SearchFn = async (q, options) => {
    try {
      const result = await getJson({
        api_key: process.env.SERPAPI_KEY,
        q,
        ...serpAPIConfig.searchOptions,
        ...options,
      });

      // Filtering search result
      const filtered = Object.keys(result)
        // Filter allowed properties
        .filter(k => serpAPIConfig.allowedResultDataProps.includes(k))
        .reduce((obj: BaseResponse, k) => {
          const mime: any = {};
          for (const l in result[k]) {
            if (Object.keys(mime).length > 10) break; // Limit search result key number
            if (Array.isArray(result[k][l]))
              mime[l] = result[k][l].slice(0, 5); // Limit search result array key length
            else mime[l] = result[k][l];
          }
          obj[k] = mime;
          return obj;
        }, {});

      Logger.log(`${cf.b}Function response:${cf.rb} returned search results`);
      return {
        query: q,
        searchResults: filtered,
      };
    } catch (err) {
      Logger.error('event', 'fetching web data', err);
      return null;
    }
  };
}
