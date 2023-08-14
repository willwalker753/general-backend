const MovieServiceInterface = require("./MovieServiceInterface");

class MovieServiceTmdb extends MovieServiceInterface {
    constructor(tmdbApiAgent, errorThrower) {
        super();
        this.tmdbApiAgent = tmdbApiAgent;
        this.errorThrower = errorThrower;
    }

    getTrendingMovies = async () => {
        const res = this.tmdbApiAgent.get("/trending/movie/day?language=en-US");
        if (res.success === false) {
            this.errorThrower.server("Error while getting the list of movies. Please try again", res)
        }

        // do the data transformation stuff here, like genres, poster url etc

        return res;
    }
}

module.exports = MovieServiceTmdb;