const axios = require("axios");
const {
    openWeatherApiUrlBase,
    getOpenWeatherApiKey,
    getWeatherIcon
} = require("../../../util/openWeather");
const capitalizeWordsInString = require("../../../util/capitalizeWordsInString");

const getCurrentWeather = async (lat, lon) => {
    const apiKey = getOpenWeatherApiKey();
    const currentWeatherRes = await axios.get(`${openWeatherApiUrlBase}data/2.5/weather?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const currentWeatherData = currentWeatherRes.data;
    const formattedCurrentWeather = {
        location: {
            lat: currentWeatherData.coord.lat,
            lon: currentWeatherData.coord.lon,
            city: currentWeatherData.name,
            tz_offset: currentWeatherData.timezone             
        },
        weather: {
            type: currentWeatherData.weather.main,
            description: capitalizeWordsInString(currentWeatherData.weather.description),
            icon: getWeatherIcon(currentWeatherData.weather.icon),
            units: "imperial", // add support for metric units later
            temp: {
                temp: currentWeatherData.main.temp,
                feels_like: currentWeatherData.main.feels_like
            },
            wind: {
                speed: currentWeatherData.wind.speed,
                deg: currentWeatherData.wind.deg,
                gust: currentWeatherData.wind.gust
            },
            sunrise: currentWeatherData.sys.sunrise, 
            sunset: currentWeatherData.sys.sunset 
        }
    }
    return formattedCurrentWeather;
}

const searchCoordsByCityState = async (city, state=null) => {
    const apiKey = getOpenWeatherApiKey();
    const searchQuery = state ? `${city},${state},US` : city;
    const geocodingRes = await axios.get(`${openWeatherApiUrlBase}geo/1.0/direct?limit=5&q=${searchQuery}&appid=${apiKey}`);
    const geocodingData = geocodingRes.data;
    const formattedResults = {
        results: geocodingData.map(index => {
            return {
                name: index.name,
                lat: index.lat,
                lon: index.lon,
                country: index.country,
                state: index.state ? index.state : null
            }
        })
    }
    return formattedResults;
}

module.exports = {
    getCurrentWeather,
    searchCoordsByCityState
}