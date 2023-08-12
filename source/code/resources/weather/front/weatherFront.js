const openWeatherService = require("../service/openWeatherService");
const { parseCityStateCountryFromString } = require("../../../util/parseAddress");
const errorHandler = require("../../../util/errorHandler");

/* 
#########################
#   getCurrentWeather   #
#########################

Request Schema:
    URL Params:
        lat
        lon

Response Schema:
    {
        "location": {
            "lat": 44.44,
            "lon": 55.55,
            "city": "Dallas",
            "tz_offset": 3600 // offset from UTC in seconds              
        },
        "weather": {
            "type": "Rain",
            "description": "Moderate Rain",
            "icon": "rain" | "clear_day" | "clear_night"  | "cloudy" | "partial_cloudy_day" | "partial_cloudy_night" | "thunderstorm" | "snow" | "windy"
            "units": "imperial",
            "temp": {
                "temp": 72,
                "feels_like": 65
            },
            "wind": {
                "speed": 2.15,
                "deg": 256,
                "gust": 4.01
            },
            "sunrise": 1661834187, // UTC seconds
            "sunset": 1661882248 // UTC seconds
        }
    }
*/
const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const currentWeather = await openWeatherService.getCurrentWeather(lat, lon);
        res.status(200).send(currentWeather);
    } catch (error) {
        errorHandler(error, res, "Error while gettings the current weather conditions. Please try again soon.", 500);
    }
}

/* 
######################################
#   searchCoordsByCityStateCountry   #
######################################

Request Schema:
    URL Params:
        query = The query to search by, state/country is optional.
                Examples: "Dallas" | "Dallas, TX" | "London, GB" | "London, United Kingdom"

Response Schema:
    {
        results: [
            {
                name: "Dallas",
                lat: 55.55,
                lon: 44.44,
                country_code: "US",
                country_name: "United States",
                state_code: "TX",
                state_name: "Texas",
            },
            {
                name: "London",
                lat: 55.55,
                lon: 44.44,
                country_code: "United Kingdom",
                country_name: "GB",
                state_code: null,
                state_name: null,
            }
        ]
    }
*/
const searchCoordsByCityStateCountry = async (req, res) => {
    try {
        const { query } = req.query;
        const { city, state, country } = parseCityStateCountryFromString(query);
        const results = await openWeatherService.searchCoordsByCityStateCountry(city, state, country);
        res.status(200).send({ results });
    } catch (error) {
        errorHandler(error, res, "Error while gettings the current weather conditions. Please try again soon.", 500);
    }
}

module.exports = {
    getCurrentWeather,
    searchCoordsByCityStateCountry
}