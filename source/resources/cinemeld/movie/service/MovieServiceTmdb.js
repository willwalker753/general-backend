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
        timeConverter,
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
        this.timeConverter = timeConverter;
        this.errorThrower = errorThrower;
        this.valTester = valTester;
        this.logger = logger;
    }

    getTrendingMovies = async () => {
        const res = await this.tmdbApiAgent.get("/trending/movie/day?language=en-US&page=1");
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }
        
        const parsedMovies = [];
        for (let i=0; i<res.results.length; i++) {
            const movie = res.results[i];
            parsedMovies.push(await this._parseMovieSummaryObject(movie));
        }

        return {
            trending_movies: {
                ...res,
                results: parsedMovies
            }
        };
    }

    getNowPlayingMovies = async () => {
        const res = await this.tmdbApiAgent.get("/movie/now_playing?language=en-US&page=1");
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }
        
        const parsedMovies = [];
        for (let i=0; i<res.results.length; i++) {
            const movie = res.results[i];
            parsedMovies.push(await this._parseMovieSummaryObject(movie));
        }

        return {
            now_playing: {
                ...res,
                results: parsedMovies
            }
        };
    }

    getViewerFavoriteMovies = async () => {
        const res = await this.tmdbApiAgent.get("/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=7.5&vote_count.gte=100&with_original_language=en");
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }
        
        const parsedMovies = [];
        for (let i=0; i<res.results.length; i++) {
            const movie = res.results[i];
            parsedMovies.push(await this._parseMovieSummaryObject(movie));
        }

        return {
            viewer_favorites: {
                ...res,
                results: parsedMovies
            }
        };
    }

    // "Action Packed"
    // https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=action_id_here
    // movieGenreIdMapPromise Action

    // "Comedy"
    // https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=action_id_here
    // movieGenreIdMapPromise Comedy




    getMovieDetail = async (movieId) => {
        const res = await this.tmdbApiAgent.get(`/movie/${movieId}?append_to_response=videos%2Cexternal_ids%2Csimilar%2Creviews%2Cwatch%2Fproviders%2Crelease_dates&language=en-US`);
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }

        return {
            // ...res,
            detail: {
                ...await this._parseMovieDetailObject(res),
                release: this._parseMovieReleaseDates(res.release_dates),     
                trailer: this._parseMovieVideosObject(res.videos),
                external_link: this._parseMovieExternalIdsObject(res.external_ids),
            }
        };
    }


    _parseMovieDetailObject = async (movie) => {
        const totalMinutes = movie.runtime;
        const { hours, minutes } = this.timeConverter.convertMinutesToHoursMinutes(totalMinutes);
        const hoursMinutesDisplayText = this.timeConverter.getHoursMinutesDisplayText(hours, minutes);

        return {
            id: movie.id,
            backdrop_url: await this._getBackdropUrl(movie.backdrop_path),
            title: movie.title,
            overview: movie.overview,
            genre_list: movie.genres,
            popularity: movie.popularity,
            release_date: movie.release_date,
            vote_percent: this._convertVoteAverageToPercent(movie.vote_average),
            vote_factor: this._convertVoteAverageToFactor(movie.vote_average),
            vote_count: movie.vote_count,
            poster_url: await this._getPosterUrl(movie.poster_path),
            collection: {
                collection_id: this.valTester.safeGet(() => movie.belongs_to_collection.id, null),
                name: this.valTester.safeGet(() => movie.belongs_to_collection.name, ""),
                poster_url: await this._getBackdropUrl(
                    this.valTester.safeGet(() => movie.belongs_to_collection.poster_path, "")
                ),
                backdrop_url: await this._getBackdropUrl(
                    this.valTester.safeGet(() => movie.belongs_to_collection.backdrop_path, "")
                )
            },
            runtime: {
                total_minutes: totalMinutes,
                hours,
                minutes,
                hour_minute_display_text: hoursMinutesDisplayText
            }
        }
    }

    // returns null if there are no videos
    // otherwise returns a parsed version of the highest ranked video
    _parseMovieVideosObject = (videos) => {
        // there can be alot of videos, and I can't sort/filter them in the api
        // so here is some manual sorting that prefers an official trailer
        const keyRanking = {
            type: {
                "Trailer": 5,
                "Teaser": 2,
                "Clip": 1,
                "Featurette": 1,
                "Behind the Scenes": 1,
            },
            official: {
                true: 2,
                false: 1
            }
        }        
        let autoAcceptScore = 7;
        let highestRankedVideo = {
            video: null,
            score: 0
        }
        const keyRankingKeys = Object.keys(keyRanking);
        // iterate through the videos by oldest first (because trailers tend to be the oldest)
        for (let i=videos.results.length-1; i>0; i--) {
            const curVideo = videos.results[i];
            // safely add the score from each of the ranking keys together
            let curVideoScore = 0;
            keyRankingKeys.forEach(keyRankingKey => {
                curVideoScore += this.valTester.safeGet(() => keyRanking[keyRankingKey][curVideo[keyRankingKey]], 0)
            })
            if (curVideoScore > highestRankedVideo.score) {
                highestRankedVideo.video = curVideo;
                highestRankedVideo.score = curVideoScore;
            }
            if (curVideoScore >= autoAcceptScore) break;
        }

        return highestRankedVideo.video;
    }

    _parseMovieExternalIdsObject = (externalIds) => {
        return {
            imdb: externalIds.imdb_id ? `https://www.imdb.com/title/${externalIds.imdb_id}/` : ""
        }
    }

    _parseMovieSimilarObject = (movie) => {

    }

    _parseMovieReviewsObject = (movie) => {

    }

    _parseMovieWatchProvidersObject = (movie) => {

    }

    _parseMovieReleaseDates = (releaseDates) => {
        let retVal = {
            certification: ""
        }
        // find the united states release
        const usReleaseIndex = releaseDates.results.findIndex(result => (
            this.valTester.safeGet(() => result.iso_3166_1.toLowerCase(), "") === "us"
        ));
        if (usReleaseIndex < 0) return retVal;

        // parse the first US release
        const usRelease = this.valTester.safeGet(() => releaseDates.results[usReleaseIndex].release_dates[0], {certification: ""});
        retVal.certification = usRelease.certification;
        return retVal;
    }

    _parseMovieSummaryObject = async (movie) => {
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
        const factor = this._convertVoteAverageToPercent(voteAverage) / 100;
        const limitedDecimalFactor = parseFloat(factor.toFixed(2));
        return limitedDecimalFactor;
    }
}

module.exports = MovieServiceTmdb;