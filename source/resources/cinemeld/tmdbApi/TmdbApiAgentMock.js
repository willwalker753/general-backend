const TmdbApiAgentInterface = require("./TmdbApiAgentInterface");
const mockData = require("./TmdbApiMockData.json");

class TmdbApiAgentMock extends TmdbApiAgentInterface {
    constructor(urlBasePromise, logger) {
        super();
        this.urlBasePromise = urlBasePromise;
        this.logger = logger;
    }

    get = async (path, headers={}) => {
        const url = await this._createRequestUrl(path);
        this.logger.info(`MOCK TMDB API - Request URL: ${url}`);
        
        const simpleMatch = mockData.get[url];        
        if (simpleMatch) {
            this.logger.info(`MOCK TMDB API - Found simple match`);
            return simpleMatch;
        }

        const wildcardMatch = this._getWildcardMatch(url);
        if (wildcardMatch) {
            this.logger.info(`MOCK TMDB API - Found wildcard match`);
            return wildcardMatch;
        }

        throw new Error(`MOCK TMDB API - Mock data not found for GET ${url}`);
    }

    _createRequestUrl = async (path) => {
        let safePath = path;
        if (safePath.startsWith("/") === false) {
            safePath = `/${safePath}`;
        }

        return await this.urlBasePromise + safePath;
    }

    // some endpoints, like movie detail, require an id in the url
    // so in order to match all ids for an endpoint, the mock data urls use wildcards (a "*" for each character)
    _getWildcardMatch = (requestUrl) => {
        let match = null;
        for (const mockUrl in mockData.get) {
            // if mockUrl isn't the same length as requestUrl, then skip it
            if (mockUrl.length !== requestUrl.length) continue;

            // if the mock url doesn't have a wildcard, then skip it
            if (mockUrl.includes("*") === false) continue;

            // replace the mockUrl wildcards with the same character indexes from the request url
            // example: "h***o", "world" => "horlo"
            const firstWildcardIndex = mockUrl.indexOf("*");
            const lastWildcardIndex = mockUrl.lastIndexOf("*");
            const wildcardValue = requestUrl.substring(firstWildcardIndex, lastWildcardIndex + 1);
            const parsedMockUrl = mockUrl.slice(0, firstWildcardIndex) + wildcardValue + mockUrl.slice(lastWildcardIndex +1);

            if (parsedMockUrl === requestUrl) {
                // match found, so stop looping and return the match
                match = mockData.get[mockUrl];
                break;
            }
        }
        return match;
    }
}

module.exports = TmdbApiAgentMock;