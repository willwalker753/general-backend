const MovieServiceInterface = require("./MovieServiceInterface");

class MovieServiceTmdb extends MovieServiceInterface {
    constructor(
        tmdbApiAgent, 
        tmdbImageUrlBasePromise,
        backdropSizePromise,
        posterSizePromise,
        movieGenreIdMapPromise,
        errorThrower,
        valTester,
        logger
    ) {
        super();
        this.tmdbApiAgent = tmdbApiAgent;
        this.tmdbImageUrlBasePromise = tmdbImageUrlBasePromise;
        this.backdropSizePromise = backdropSizePromise;
        this.posterSizePromise = posterSizePromise;
        this.movieGenreIdMapPromise = movieGenreIdMapPromise;
        this.errorThrower = errorThrower;
        this.valTester = valTester;
        this.logger = logger;
    }

    getTrendingMovies = async () => {
        const res = await this.tmdbApiAgent.get("/trending/movie/day?language=en-US");
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }
        
        const parsedResults = [];
        for (let i=0; i<res.results.length; i++) {
            const result = res.results[i];
            parsedResults.push({
                id: result.id,
                backdrop_url: await this._getBackdropUrl(result.backdrop_path),
                title: result.title,
                overview: result.overview,
                media_type: result.media_type,
                genre_list: await this._parseGenreIdList(result.genre_ids),
                popularity: result.popularity,
                release_date: result.release_date,
                vote_percent: this._convertVoteAverageToPercent(result.vote_average),
                vote_factor: this._convertVoteAverageToFactor(result.vote_average),
                vote_count: result.vote_count,
                poster_url: await this._getPosterUrl(result.poster_path)
            })
        }

        return {
            ...res,
            results: parsedResults
        };
    }

    _getBackdropUrl = async (path) => {
        const safePath = path.startsWith("/") ? path : `/${path}`;
        return `${await this.tmdbImageUrlBasePromise}/${await this.backdropSizePromise}${safePath}`;
    }

    _getPosterUrl = async (path) => {
        const safePath = path.startsWith("/") ? path : `/${path}`;
        return `${await this.tmdbImageUrlBasePromise}/${await this.posterSizePromise}${safePath}`;
    }

    _parseGenreIdList = async (genreIdList) => {
        // map the genre ids to their names
        const movieGenreIdMap = await this.movieGenreIdMapPromise;
        let genreList = [];
        genreIdList.forEach(genreId => {
            const genre = this.valTester.safeGet(() => movieGenreIdMap[genreId], null)
            // exclude genre ids that are not found
            if (genre === null) {
                this.logger.error(`Unable to find movie genre for id: ${genreId}`);
                return;
            }
            genreList.push(genre);
        })
        return genreList;
    }

    // converts to the tmdb vote average (scale of 0 to 10) to a percert (0 to 100)
    _convertVoteAverageToPercent = (voteAverage) => {
        return voteAverage * 10;
    }

    // converts to the tmdb vote average (scale of 0 to 10) to a factor (0 to 1)
    _convertVoteAverageToFactor = (voteAverage) => {
        return this._convertVoteAverageToPercent(voteAverage) / 100;
    }
}

module.exports = MovieServiceTmdb;