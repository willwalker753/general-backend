const MovieServiceInterface = require("./MovieServiceInterface");

/*
    This is designed to use The Movie Database (TMDB) V3 API
*/
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
        
        const parsedMovies = [];
        for (let i=0; i<res.results.length; i++) {
            const movie = res.results[i];
            parsedMovies.push(self._parseMovieObject(movie));
        }

        return {
            ...res,
            results: parsedMovies
        };
    }

    // "Latest Arrivals"
    // https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1

    // "Viewer Favorites"
    // https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&vote_average.gte=8.5

    // "Action Packed"
    // https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=action_id_here
    // movieGenreIdMapPromise Action

    // "Comedy"
    // https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=action_id_here
    // movieGenreIdMapPromise Comedy

    _parseMovieObject = async (movie) => {
        return {
            id: movie.id,
            backdrop_url: await this._getBackdropUrl(movie.backdrop_path),
            title: movie.title,
            overview: movie.overview,
            media_type: movie.media_type,
            genre_list: await this._parseGenreIdList(movie.genre_ids),
            popularity: movie.popularity,
            release_date: movie.release_date,
            vote_percent: this._convertVoteAverageToPercent(movie.vote_average),
            vote_factor: this._convertVoteAverageToFactor(movie.vote_average),
            vote_count: movie.vote_count,
            poster_url: await this._getPosterUrl(movie.poster_path)
        }
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