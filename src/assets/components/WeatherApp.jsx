import React, { useState, useEffect } from "react";

import Carrousel from "./Carrousel";
import Select from "./Select";
import SearchBar from "./SearchBar";
import Background from "./Background";

import { keys, coordinates } from "../js/data";
import { preferedParams } from "../js/data.js";

export default function WeatherApp() {
  let savedUserType = (JSON.parse(localStorage.getItem("guiempo"))||{userType: "tourist"}).userType;
  if (!savedUserType) {
    localStorage.setItem("guiempo", JSON.stringify({}));
    savedUserType = "tourist";
  }

  const [userType, setUserType] = useState(savedUserType);
  const [weatherRes, setWeatherRes] = useState([]);
  const [coords, setCoords] = useState({
    lat: coordinates.lat,
    lon: coordinates.lon,
  });

  const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${keys.openWeather}&units=metric`;

  const handleSetUserType = (value) => {
    const savedOptions = JSON.parse(localStorage.getItem("guiempo") || []);
    savedOptions.userType = value;
    localStorage.setItem("guiempo", JSON.stringify(savedOptions));
    setUserType(value);
  };

  const fetchData = async (url, cb) => {
    let res;
    const response = await fetch(url);
    const json = await response.json();
    res = json;
    cb(res);
    console.log(res);
  };

  /**
   * Extracs the desired coordinates from the given place.
   *
   * @param {Object} res - If it's an array, it'll get the first element.
   */
  const getNewLocation = (res) => {
    const location = res.data[0];
    const { latitude, longitude } = location;
    const newCoords = { lat: latitude, lon: longitude };
    setCoords(newCoords);
  };

  /**
   * Fetches the results of the location API, with the desired location.
   * Then, it invokes the getNewLocation function, to extract the coordinates from the response.
   *
   * @param {string} location
   */
  const handleSearch = (location) => {
    const locaionUrl = `http://api.positionstack.com/v1/forward?access_key=${keys.positionStack}&query=${location}`;
    fetchData(locaionUrl, getNewLocation);
  };

  useEffect(() => {
    fetchData(weatherUrl, setWeatherRes);
  }, [, coords]);

  return (
    <div className="relative-wrapper">
      <div className="margin-top-1 centerer">
        <Select
          defaultValue={userType}
          options={Object.keys(preferedParams)}
          whenChange={handleSetUserType}
          givenClasses={["margin-right-4"]}
        />
        <SearchBar search={handleSearch} />
      </div>

      <Carrousel userType={userType} rawData={weatherRes.hourly} timeType="dt" />
      <Carrousel userType={userType} rawData={weatherRes.daily} timeType="" />
    </div>
  );
}
