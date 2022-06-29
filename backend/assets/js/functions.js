import fetch from "node-fetch";
import * as fs from "fs";
import { Provider, providersList, keys } from "./providers.js";
import { data } from "./data.js";

export const dataPath = "./storage/";

/**
 *
 * @param {string} url - The target URL
 * @param {object} params - Params to add to that URL
 * @param {function} cb - The callback
 *
 *
 * Gets and executes a func with the data returned by a URL
 */
export const fetchData = async (url, params, cb) => {
  let res;
  const response = await fetch(url + "?" + new URLSearchParams(params));
  const json = await response.json();
  cb(json);
};

export const getSavedScores = (provider) => {
  return 0;
};

/**
 * Gets data from a file
 *
 * @param {string} path - The path to the file
 * @returns The data found in that file
 */
export const loadData = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * Overwrites data in a file
 *
 * @param {object} data - The JSON to set
 * @param {string} path - The parth to the file
 */
export const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {string} key - The key of the JSON without parsing
 * @returns The given key translated to openweather-data
 */
export const parseKey = (key) => {
  const allKeys = {
    precip: "",
    windgust: "wind_gust",
    windspeed: "wind_speed",
    winddir: "wind_dir",
    uvindex: "uvi",
    cloudcover: "clouds",
    uv: "uvi",
    ts: "dt",
    datetimeEpoch: "dt",
    wind_spd: "wind_speed",
    wind_dir: "wind_deg",
  };

  return allKeys[key] || key;
};

/**
 * Returns the key that is used in every time type.
 *
 *
 * @param {string} provider - The name of the provier
 * @param {string} key - The key
 * @returns The parsed key
 */
export const parseTimeTypeKey = (provider, key) => {
  if (provider == "openweather") return key;
  const allKeys = {
    weatherbit: {
      daily: "data",
    },

    visualcrossing: {
      daily: "days",
      current: "currentConditions",
    },
  };

  return allKeys[provider][key];
};

/**
 *
 * @returns {integer} - The current timestamp
 */
export const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 *
 * @param {float} temp - Temperature in the current measure
 * @param {string} unit - The unit to convert to
 * @returns {float} - The parsed temperature
 */
export const convertTemp = (temp, unit) => {
  if (unit === "f") return ((temp - 32) * 5) / 9;
  return temp;
};

/**
 *
 * @param {object} obj - The object to sort
 * @param {boolean} avoidZeros - False (default) if you don't want to remove zeros from the result array
 * @returns {array} - The array with the sorted keys
 */
export const sortObject = (obj, avoidZeros = false) => {
  let sortable = [];
  for (let key in obj) {
    if (avoidZeros && !obj[key]) continue;
    sortable.push(key);
  }

  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });

  return sortable;
};

/**
 *
 * @param {object} response - The response data to be sorted
 * @returns
 */
export const sortResponse = (response) => {
  for (let d in response) {
    const day = response[d];
    for (let key in day) {
      const param = day[key];
      response[d][key] = sortObject(param, true);
    }
  }

  return response;
};

// Full the providers list (with Provider objects)
export const initProviders = () => {
  let providers = [];
  for (let prov in providersList) {
    const url = providersList[prov];
    const provider = new Provider(prov, keys[prov], url);
    providers.push(provider);
  }

  return providers;
};

export const propsApiParser = (prov, key) => {
  const providersKeys = {
    weatherbit: {
      windgust: "wind_gust",
      windspeed: "wind_speed",
      winddir: "wind_dir",
      uvindex: "uvi",
      cloudcover: "clouds",
      uvi: "uv",
      dt: "ts",
      wind_speed: "wind_spd",
      wind_deg: "wind_dir",
    },
    visualcrossing: {
      windgust: "wind_gust",
      windspeed: "wind_speed",
      winddir: "wind_dir",
      uvindex: "uvi",
      cloudcover: "clouds",
      uv: "uvi",
      dt: "datetimeEpoch",
      wind_spd: "wind_speed",
      wind_dir: "wind_deg",
    },
  };

  if (!providersKeys[prov]) return key;

  return providersKeys[prov][key] || key;
};

const providers = initProviders();

/**
 *
 * @param {array} allProviders - Contains the names of all the providers. If undefined, it'll use all providers.
 *
 * @returns {object} - A JSON structure containing all the data from all providers.
 */
const getDataFromProviders = async (coords, allProviders) => {
  let responses = {};
  const saveResponse = (prov, res) => {
    responses[prov.name] = res;
  };

  const toRequestProviders = allProviders
    ? providers.filter((prov) => allProviders.includes(prov.name))
    : providers;

  for (let prov of toRequestProviders) {
    await fetchData(
      prov.url,
      {
        key: prov.key,
        appid: prov.key,
        lat: coords.lat,
        lon: coords.lon,
        units: "metric",
      },
      (res) => {
        saveResponse(prov, res);
      }
    );
  }

  return responses;
};

/**
 *
 * @param {string} timeType - It can be: hourly or daily.
 *
 * Gets and stores data from all the providers
 */
export const saveForecasts = (timeType, coords, cb) => {
  console.log(coords);
  if (!timeType) {
    console.log("timeType needed");
    return;
  }

  let toSave = {};
  getDataFromProviders(coords).then((foreCasts) => {
    //console.log(foreCasts);
    for (let name in foreCasts) {
      const providerResponse = foreCasts[name];
      const parsedTimeType = parseTimeTypeKey(name, timeType);
      toSave[name] = {};
      toSave[name][timeType] = [];
      storeData(providerResponse, dataPath + "weather.json");
      providerResponse[parsedTimeType].forEach((day) => {
        let timeUnitForecast = {};
        for (let key in day) {
          if (!day[key]) continue;
          const typeofParam = typeof day[key];
          if (typeofParam !== "string" && typeofParam !== "number") continue;
          timeUnitForecast[parseKey(key)] = day[key];
        }

        toSave[name][timeType].push(timeUnitForecast);
      });
    }

    cb(toSave);
  });
};
