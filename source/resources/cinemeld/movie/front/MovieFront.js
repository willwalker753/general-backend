class MovieFront {
    constructor(movieService, logger) {
        this.movieService = movieService;
        this.logger = logger;
    }

    getTrendingMovies = async (req, res) => {
        try {
            const result = await this.movieService.getTrendingMovies();
            res.status(200).send({
                trending_movies: result
            })
        } catch (error) {
            this._handleErrorResponse(error, res);
        }
    }

    getSummary = async (req, res) => {
        try {
            const resultList = await Promise.all([
                this.movieService.getTrendingMovies(),
                this.movieService.getNowPlayingMovies(),
                this.movieService.getViewerFavoriteMovies(),
            ]);
            const result = {
                trending_movies: resultList[0],
                now_playing: resultList[1],
                viewer_favorites: resultList[2],
            }
            res.status(200).send(result)
        } catch (error) {
            this._handleErrorResponse(error, res);
        }
    }

    _handleErrorResponse = (error, res) => {             
        this.logger.error(error);    
        if (error.type === "server" && error.clientMessage) {
            return res.status(500).send({
                is_error: true,
                message: error.clientMessage
            })
        }

        return res.status(500).send({
            is_error: true,
            message: "There was an unexpected error, please try again soon"
        })
    }
}

module.exports = MovieFront;