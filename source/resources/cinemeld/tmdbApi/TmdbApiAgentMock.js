const TmdbApiAgentInterface = require("./TmdbApiAgentInterface");
const mockData = require("./TmdbApiMockData.json");

class TmdbApiAgentMock extends TmdbApiAgentInterface {
    constructor(urlBasePromise) {
        super();
        this.urlBasePromise = urlBasePromise;
    }

    get = async (path, headers={}) => {
        const url = await this._createRequestUrl(path);
        const result = mockData.get[url];
        if (!result) {
            throw new Error(`TMDB Mock data not found for GET ${url}`);
        }
        return result;
    }

    _createRequestUrl = async (path) => {
        let safePath = path;
        if (safePath.startsWith("/") === false) {
            safePath = `/${safePath}`;
        }

        return await this.urlBasePromise + safePath;
    }
}

module.exports = TmdbApiAgentMock;