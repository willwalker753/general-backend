const axios = require("axios");
const {
    openWeatherApiUrlBase,
    getOpenWeatherApiKey,
    getWeatherIcon
} = require("../../../util/weather/openWeather");
const capitalizeWordsInString = require("../../../util/weather/capitalizeWordsInString");
const {
    stateNameMap,
    countryCodeMap
} = require("../../../util/weather/parseAddress");

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

const searchCoordsByCityStateCountry = async (city, state=null, country=null) => {
    const apiKey = getOpenWeatherApiKey();
    let searchQuery = city;
    if (state)  searchQuery = `${city},${state},US`;
    else if (country)  searchQuery = `${city},${country}`;
    const geocodingRes = await axios.get(`${openWeatherApiUrlBase}geo/1.0/direct?limit=5&q=${searchQuery}&appid=${apiKey}`);
    const geocodingData = geocodingRes.data;
    const formattedResults = geocodingData.map(index => {
        return {
            name: index.name,
            lat: index.lat,
            lon: index.lon,
            country_code: index.country ? index.country : null,
            country_name: index.country && countryCodeMap[index.country] ? capitalizeWordsInString(countryCodeMap[index.country].toLowerCase()) : null,
            state_code: index.state ? stateNameMap[index.state.toUpperCase()] ? stateNameMap[index.state.toUpperCase()] : index.state : null,
            state_name: index.state ? index.state : null
        }
    })
    return formattedResults;
}

module.exports = {
    getCurrentWeather,
    searchCoordsByCityStateCountry
}