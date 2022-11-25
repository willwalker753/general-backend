const safeGet = require("./safeGet");

const openWeatherApiUrlBase = "https://api.openweathermap.org/data/2.5/";

const getOpenWeatherApiKey = () => {
    const apiKey = safeGet(() => process.env.OPENWEATHER_API_KEY, "");
    return apiKey;
}

// map the openweather icon to a standard icon code
const getWeatherIcon = (openWeatherIconCode) => {
    const weatherIconCodeMap = {
        "01d": "clear_day", 	
        "01n": "clear_night",
        "02d": "partial_cloudy_day", 	
        "02n": "partial_cloudy_night",
        "03d": "cloudy", 	
        "03n": "cloudy",
        "04d": "cloudy", 	
        "04n": "cloudy",
        "09d": "rain", 	
        "09n": "rain",
        "10d": "rain", 	
        "10n": "rain",
        "11d": "thunderstorm", 	
        "11n": "thunderstorm",
        "13d": "snow", 	
        "13n": "snow",
        "50d": "windy", 	
        "50n": "windy"
    }
    const weatherIcon = safeGet(openWeatherIconCode => weatherIconCodeMap[openWeatherIconCode], "clear_day");
    return weatherIcon;
}

module.exports = {
    openWeatherApiUrlBase,
    getOpenWeatherApiKey,
    getWeatherIcon
}