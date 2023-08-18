const MovieServiceInterface = require("./MovieServiceInterface");

class MovieServiceTmdb extends MovieServiceInterface {
    constructor(tmdbApiAgent, errorThrower) {
        super();
        this.tmdbApiAgent = tmdbApiAgent;
        this.errorThrower = errorThrower;
    }

    getTrendingMovies = async () => {
        const res = await this.tmdbApiAgent.get("/trending/movie/day?language=en-US");
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }
        
        res.results = res.results.map(result => {
            return {
                ...result,
                poster_url: this._getPosterUrl(result.poster_path)
            }
        })

        return res;
    }

    _getPosterUrl = (path) => {
        const safePath = path.startsWith("/") ? path : `/${path}`;
        return `https://image.tmdb.org/t/p/original${safePath}`;
    }
}

module.exports = MovieServiceTmdb;