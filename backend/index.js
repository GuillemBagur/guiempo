import {
  fetchData,
  loadData,
  parseKey,
  parseTimeTypeKey,
  storeData,
  getCurrentTimestamp,
  convertTemp,
  sortResponse,
  initProviders,
  dataPath,
  saveForecasts,
} from "./assets/js/functions.js";
import { providersList, keys, providersUnits } from "./assets/js/providers.js";
import { coords, data } from "./assets/js/data.js";
import { CronJob } from "cron";

/**
 * A class that generates an empty Result JSON structure
 */
class Results {
  constructor(currentWeather) {
    this.data = this.initResults();
    this.currentWeather = currentWeather;
  }

  initResults() {
    const savedData = loadData(dataPath + "weather.json") || {};
    // The only keys that the JSON structure will contain
    const usefulKeys = Object.keys(this.currentWeather);
    data["daily"] = [];
    for (let day = 0; day < savedData["openweather"]["daily"].length; day++) {
      data["daily"].push({});
      for (let key of usefulKeys) {
        data["daily"][day][key] = {};
        for (let p in savedData) {
          data["daily"][day][key][p] = 0;
        }
      }
    }

    return data;
  }
}


/**
 *
 * @param {object} currentWeather - Object containing all the info of the current weather (from Openweather)
 *
 * Stores the compared and sorted data in dataPath + "sorted-score.json"
 */
const compare = (currentWeather) => {
  let savedScore =
    loadData(dataPath + "score.json") || new Results(currentWeather).data.daily;
  const savedData = loadData(dataPath + "weather.json");
  // Modify usefulKeys
  const usefulKeys = Object.keys(currentWeather);
  const results = {};
  results["daily"] = [];
  for (let day = 0; day < savedData["openweather"]["daily"].length; day++) {
    results["daily"].push({});
    const dt = savedData["openweather"]["daily"][day].dt;
    const diff = Math.abs(getCurrentTimestamp() - dt);
    // If fits in the same day
    if (diff > 86400) continue;
    for (let key of usefulKeys) {
      results["daily"][day][key] = {};
      for (let p in savedData) {
        const prov = savedData[p];
        const param = prov["daily"][day][key];
        //if (!checkAllProvidersHaveProp(savedData, key)) continue;
        if (!param) continue;
        if (!currentWeather.hasOwnProperty(key)) continue;
        if (typeof param !== "number") continue; // provisional
        let providedDataParam = savedData[p]["daily"][day][key];
        if (typeof providedDataParam === "object")
          providedDataParamobj[Object.keys(providedDataParam)[0]];

        if (typeof providedDataParam === "string") providedDataParamobj[0];

        if (key === "temp") {
          providedDataParam = convertTemp(
            providedDataParam,
            providersUnits[p].temp
          );
        }

        const difference = providedDataParam - currentWeather[key];
        savedScore[day][key][p] += Math.abs(difference);
      }
    }
  }

  storeData(savedScore, dataPath + "score.json");
  storeData(sortResponse(savedScore), dataPath + "sorted-score.json");
};

const getCurrentWeather = () => {
  getDataFromProviders(["openweather"]).then((res) => {
    if (!res) return;
    compare(res.openweather.current);
  });
};

/* var job = new CronJob(
  "* 13 * * * *",
  function () {
    getCurrentWeather();
  },
  null,
  true
);
 */

saveForecasts("daily", (toSave) => {
  storeData(toSave, dataPath + "weather.json");
  storeData(getCurrentTimestamp(), dataPath + "last-exec.json");
});
