const setConfigStorageTmdbDeps = async (appOC) => {
    // cyclic uses serverless, which means the app has a short lifecycle and is started frequently
    // rather than making api requests for this data, the responses are hardcoded for performance and api throttling reasons
    // in the future i could use a redis cache for this

    // GET https://api.themoviedb.org/3/configuration
    configurationRes = {
        "images": {
            "base_url": "http://image.tmdb.org/t/p/",
            "secure_base_url": "https://image.tmdb.org/t/p/",
            "backdrop_sizes": [
                "w300",
                "w780",
                "w1280",
                "original"
            ],
            "logo_sizes": [
                "w45",
                "w92",
                "w154",
                "w185",
                "w300",
                "w500",
                "original"
            ],
            "poster_sizes": [
                "w92",
                "w154",
                "w185",
                "w342",
                "w500",
                "w780",
                "original"
            ],
            "profile_sizes": [
                "w45",
                "w185",
                "h632",
                "original"
            ],
            "still_sizes": [
                "w92",
                "w185",
                "w300",
                "original"
            ]
        },
        "change_keys": [
            "adult",
            "air_date",
            "also_known_as",
            "alternative_titles",
            "biography",
            "birthday",
            "budget",
            "cast",
            "certifications",
            "character_names",
            "created_by",
            "crew",
            "deathday",
            "episode",
            "episode_number",
            "episode_run_time",
            "freebase_id",
            "freebase_mid",
            "general",
            "genres",
            "guest_stars",
            "homepage",
            "images",
            "imdb_id",
            "languages",
            "name",
            "network",
            "origin_country",
            "original_name",
            "original_title",
            "overview",
            "parts",
            "place_of_birth",
            "plot_keywords",
            "production_code",
            "production_companies",
            "production_countries",
            "releases",
            "revenue",
            "runtime",
            "season",
            "season_number",
            "season_regular",
            "spoken_languages",
            "status",
            "tagline",
            "title",
            "translations",
            "tvdb_id",
            "tvrage_id",
            "type",
            "video",
            "videos"
        ]
    }
    // GET https://api.themoviedb.org/3/genre/movie/list
    movieGenreListRes = {
        "genres": [
            {
                "id": 28,
                "name": "Action"
            },
            {
                "id": 12,
                "name": "Adventure"
            },
            {
                "id": 16,
                "name": "Animation"
            },
            {
                "id": 35,
                "name": "Comedy"
            },
            {
                "id": 80,
                "name": "Crime"
            },
            {
                "id": 99,
                "name": "Documentary"
            },
            {
                "id": 18,
                "name": "Drama"
            },
            {
                "id": 10751,
                "name": "Family"
            },
            {
                "id": 14,
                "name": "Fantasy"
            },
            {
                "id": 36,
                "name": "History"
            },
            {
                "id": 27,
                "name": "Horror"
            },
            {
                "id": 10402,
                "name": "Music"
            },
            {
                "id": 9648,
                "name": "Mystery"
            },
            {
                "id": 10749,
                "name": "Romance"
            },
            {
                "id": 878,
                "name": "Science Fiction"
            },
            {
                "id": 10770,
                "name": "TV Movie"
            },
            {
                "id": 53,
                "name": "Thriller"
            },
            {
                "id": 10752,
                "name": "War"
            },
            {
                "id": 37,
                "name": "Western"
            }
        ]
    }

    const configStorage = appOC.get("ConfigStorage");

    let imageUrlBase = configurationRes.images.secure_base_url;
    if (imageUrlBase.endsWith("/")) {
        imageUrlBase = imageUrlBase.slice(0, -1);
    }

    // only use the original size if the desired size is not available
    const backdropSize = configurationRes.images.backdrop_sizes.includes("w1280") ? "w1280" : "original";
    const posterSize = configurationRes.images.poster_sizes.includes("w185") ? "w185" : "original";
    configStorage.set("TMDB_IMAGE_URL_BASE", imageUrlBase);
    configStorage.set("TMDB_BACKDROP_SIZE", backdropSize);
    configStorage.set("TMDB_POSTER_SIZE", posterSize);

    // create a map of movie genre id to their genre name
    let movieGenreIdMap = {};
    movieGenreListRes.genres.forEach(genre => movieGenreIdMap[genre.id] = genre);
    configStorage.set("TMDB_MOVIE_GENRE_ID_MAP", movieGenreIdMap);
}

module.exports = setConfigStorageTmdbDeps;