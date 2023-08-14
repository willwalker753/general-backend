const fetch = require('node-fetch');

class TmdbApiAgent {
    constructor(urlBase) {
        this.urlBase = urlBase;
    }

    get = async (path, headers={}) => {
        const url = this._createRequestUrl(path);
        const options = {
            method: "GET",
            headers: {
                ...headers,
                ...this._getAdditionalHeaders()
            }
        };

        const response = await fetch(url, options);
        const result = response.json();

        return result;
    }

    post = async (path, data, headers={}) => {
        const url = this._createRequestUrl(path);
        const options = {
            method: "POST",
            data: data,
            headers: {
                ...headers,
                ...this._getAdditionalHeaders()
            }
        };

        const response = await fetch(url, options)
        const result = response.json();

        return result;
    }

    _createRequestUrl = (path) => {
        let safePath = path;
        if (safePath.startsWith("/") === false) {
            safePath = `/${safePath}`;
        }

        return this.urlBase + safePath;
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