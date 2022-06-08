import React, { useState } from "react";

import Title from "./assets/components/Title";
import WeatherApp from "./assets/components/WeatherApp";
import Background from "./assets/components/Background";

import "./App.css";

export default function App() {
  return (
    <div className="App">
      <Background />

      <div className="app-wrapper">
        <div className="centerer">
          <Title />
        </div>

        <WeatherApp className="WeatherApp" />
      </div>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
          <path
            fill="red"
            stroke="none"
            d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5"
          />
        </clipPath>
      </svg>
    </div>
  );
}
