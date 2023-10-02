const TmdbApiAgentInterface = require("./TmdbApiAgentInterface");
const fetch = require("node-fetch");

class TmdbApiAgent extends TmdbApiAgentInterface {
    constructor(urlBasePromise) {
        super();
        this.urlBasePromise = urlBasePromise;
    }

    get = async (path, headers={}) => {
        const url = await this._createRequestUrl(path);
        const options = {
            method: "GET",
            headers: {
                ...headers,
                ...this._getAdditionalHeaders()
            }
        };

        const response = await fetch(url, options);
        this.logger.info(`TMDB API Request GET ${url} ${response.status}`);
        const result = response.json();

        return result;
    }

    post = async (path, data, headers={}) => {
        const url = await this._createRequestUrl(path);
        const options = {
            method: "POST",
            data: data,
            headers: {
                ...headers,
                ...this._getAdditionalHeaders()
            }
        };

        const response = await fetch(url, options)
        this.logger.info(`TMDB API Request POST ${url} ${response.status}`);
        const result = response.json();

        return result;
    }

    _createRequestUrl = async (path) => {
        let safePath = path;
        if (safePath.startsWith("/") === false) {
            safePath = `/${safePath}`;
        }

        return await this.urlBasePromise + safePath;
    }
    
    _getAdditionalHeaders = () => {
        const additionalHeaders = {
            "Authorization": `Bearer ${process.env.TMDB_API_KEY}`,
            "accept": "application/json"
        }
        return additionalHeaders;
    }
}

module.exports = TmdbApiAgent;