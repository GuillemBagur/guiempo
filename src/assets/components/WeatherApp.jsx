import React, { useState, useEffect } from "react";

import Carrousel from "./Carrousel";
import Select from "./Select";
import SearchBar from "./SearchBar";
import Background from "./Background";

import { keys, coordinates } from "../js/data";
import { preferedParams } from "../js/data.js";

export default function WeatherApp() {
  let savedUserType = (
    JSON.parse(localStorage.getItem("guiempo")) || { userType: "tourist" }
  ).userType;
  if (!savedUserType) {
    localStorage.setItem("guiempo", JSON.stringify({}));
    savedUserType = "tourist";
  }

  const [userType, setUserType] = useState(savedUserType);
  const [weatherRes, setWeatherRes] = useState([]);
  const [location, setLocation] = useState("Ciutadella, ES");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [coords, setCoords] = useState({
    lat: coordinates.lat,
    lon: coordinates.lon,
  });

  const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${keys.openWeather}&units=metric`;

  const getLocationUrl = (location) => {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${keys.openWeather}`;
  };

  const handleSetUserType = (value) => {
    const savedOptions = JSON.parse(localStorage.getItem("guiempo")) || {};
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
    try {
      const thisLocation = res[0];
      const { lat, lon } = thisLocation;
      const newCoords = { lat: lat, lon: lon };
      setLocation(thisLocation.name);
      setCoords(newCoords);
      console.log(location, thisLocation.name);
    } catch (err) {
      alert("No se ha encontrado la ubicación. Revisa la ortografía");
    }
  };

  const getUsersCurrentLocation = () => {
    let currentLocation = null;
    navigator.geolocation.getCurrentPosition((res) => {
      currentLocation = res.coords;
      if (!currentLocation) return;
      console.log(currentLocation);
      setCoords({lat: currentLocation.latitude, lon:currentLocation.longitude});
    });
  };

  getUsersCurrentLocation();

  /**
   * Fetches the results of the location API, with the desired location.
   * Then, it invokes the getNewLocation function, to extract the coordinates from the response.
   *
   * @param {string} location
   */
  const handleSearch = (location) => {
    console.log(location);
    const locationUrl = getLocationUrl(location);
    fetchData(locationUrl, getNewLocation);
  };

  useEffect(() => {
    fetchData(weatherUrl, setWeatherRes);
  }, [, coords]);

  const fetchList = (location) => {
    const locationUrl = getLocationUrl(location);
    fetchData(locationUrl, genList);
  };

  const genList = (rawData) => {
    const data = rawData;
    console.log(data.length);
    if (!data.length) return;
    console.log(2);
    setAvailableLocations(data);
  };

  // Saving all the stringified locations into an array
  let uniqueAvailableLocations = [];
  availableLocations.forEach((item) => {
    const str = `${item.name}, ${item.country}`;
    uniqueAvailableLocations.push(str);
  });

  let renderedLocations = [];

  return (
    <div className="relative-wrapper">
      <div className="margin-top-1 centerer breakpoint">
        <Select
          defaultValue={userType}
          options={Object.keys(preferedParams)}
          whenChange={handleSetUserType}
          givenClasses={["margin-right-4"]}
        />
        <SearchBar fetchList={fetchList} search={handleSearch} />
        <datalist id="available-locations">
          {(uniqueAvailableLocations || []).map((loc) => {
            if (renderedLocations.includes(loc)) return;
            renderedLocations.push(loc);
            return <option value={loc} />;
          })}
        </datalist>
      </div>

      <div className="carrousels-container">
        <h3>{location}</h3>
        <Carrousel
          userType={userType}
          rawData={weatherRes.hourly}
          timeType="dt"
        />
        <Carrousel userType={userType} rawData={weatherRes.daily} timeType="" />
      </div>
    </div>
  );
}
