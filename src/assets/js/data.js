export const keys = {
  openWeather: "bcfd2c0354c05abbfec182ba008ed71a",
  positionStack: "6d60ff358a754d2685fdbf239109780b",
};


export const coordinates = { lat: 40.00104889749666, lon: 3.8374959085180866 };

// Weather, temp and clouds will be included in all type of interests
export const defaultParams = ["weather", "temp", "clouds"];

export const preferedParams = {
  //astronomer: ["sunset", "sunrise", "moonrise", "moonset", "moon_phase"],
  athlete: ["sunset", "humidity", "uvi", "wind_deg", "wind_speed"],
  farmer: ["sunset", "humidity", "moon_phase", "wind_deg", "wind_speed"],
  tourist: ["sunset", "uvi", "wind_deg", "wind_speed"],
};

export const uiTranscribe = {
  sunset: "🌇",
  sunrise: "🌅",
  humidity: "💦🥵",
  uvi: "☀️",
  wind_deg: "🌬️👉",
  wind_gust: "🌬️🔥",
  wind_speed: "🌬️",
  temp: "🌡️",
  weather: "Weather",
  clouds: "☁️",
};
