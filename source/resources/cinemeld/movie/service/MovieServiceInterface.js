class MovieServiceInterface {
    getTrendingMovies = async () => {
        throw new Error("getTrendingMovies is not implemented")
    }

    getNowPlayingMovies = async () => {
        throw new Error("getNowPlayingMovies is not implemented")
    }

    getBestRatedMovies = async () => {
        throw new Error("getBestRatedMovies is not implemented")
    }

    getMovieDetail = async (movieId) => {
        throw new Error("getMovieDetail is not implemented")
    }

}

module.exports = MovieServiceInterface;