import { data } from "./data.js";
import { getSavedScores } from "./functions.js";

export const keys = {
  openweather: "bcfd2c0354c05abbfec182ba008ed71a",
  weatherbit: "11baa67db6c24eb584d6a1e827a57740",
  visualcrossing: "RM3SQ288B9YSAY8CRHE3Z8NZL",
};

export const providersList = {
  openweather: `https://api.openweathermap.org/data/2.5/onecall`,
  weatherbit: `https://api.weatherbit.io/v2.0/forecast/daily`,
  visualcrossing: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/40.023929891076534,3.830670951528773`,
};

export const providersUnits = {
  openweather: { temp: "c" },
  weatherbit: { temp: "c" },
  visualcrossing: { temp: "f" },
};

/**
 * A class that generates Providers with all its properties
 */
export class Provider {
  constructor(name, key, url) {
    this.name = name;
    this.key = key;
    this.url = url;
    this.data = [];
  }

  get scoredData() {
    return this.setData();
  }

  setData() {
    const savedData = getSavedScores(this.name);
    if (!savedData) return this.initData();
    return this.loadData(savedData);
  }

  initData() {
    for (let param of data) {
      this.data.push({ param: param, score: 0 });
    }

    return this.data;
  }

  loadData(savedData) {
    for (let param of data) {
      const score = savedData[param];
      this.data.push({ param: param, score: score });
    }

    return this.data;
  }
}
