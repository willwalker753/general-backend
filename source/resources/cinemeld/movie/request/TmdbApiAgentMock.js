const TmdbApiAgentInterface = require("./TmdbApiAgentInterface");
const mockData = require("./TmdbApiMockData.json");

class TmdbApiAgentMock extends TmdbApiAgentInterface {
    constructor(urlBase) {
        super();
        this.urlBase = urlBase;
    }

    get = async (path, headers={}) => {
        const url = this._createRequestUrl(path);
        const result = mockData.get[url];
        if (!result) {
            throw new Error(`TMDB Mock data not found for GET ${url}`);
        }
        return result;
    }

    _createRequestUrl = (path) => {
        let safePath = path;
        if (safePath.startsWith("/") === false) {
            safePath = `/${safePath}`;
        }

        return this.urlBase + safePath;
    }
}

module.exports = TmdbApiAgentMock;