import React from "react";

export default function SelectProvider() {
  return (
    <select>
      <option value="open-weather" selected>
        Open Weather
      </option>
      <option value="weather-api">Weather API</option>
    </select>
  );
}
