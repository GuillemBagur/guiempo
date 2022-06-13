import React from "react";

import { defaultParams, preferedParams, uiTranscribe } from "../js/data";
import { moonPhases, windRose, UVIndex } from "../js/miscelaneous";

import "../css/Period.css";

/**
 *
 * @param {object} data - Represents the data of one period
 *
 * @returns ReactObj
 */
export default function Period({ data, userType, timeType }) {
  const pad = (num) => ("0" + num).slice(-2);

  const getTimeFromDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  };

  /**
   * Parses API's data into user-friendly data.
   *
   * @param {object} data - Gets the data to parse
   */
  const parseData = (data) => {
    for (let key in data) {
      const el = data[key];
      if (Array.isArray(el)) continue;
      if (typeof el === "number" && el.toString().length === 10) {
        // If the el is a timestamp
        data[key] = getTimeFromDate(el);
      } else if (key === "humidity") {
        // To avoid a stack of '%'
        if (typeof el === "string") continue;

        data[key] = `${el}%`;
      } else if (key === "moon_phase") {
        for (let phaseKey in moonPhases) {
          const phase = moonPhases[phaseKey];
          // It always will get the lowest possible key in moonPhases
          if (el <= phaseKey) {
            data[key] = phase;
            break;
          }
        }
      } else if (key === "wind_deg") {
        for (let windKey in windRose) {
          const windName = windRose[windKey];
          // It always will get the lowest possible key in windRose
          if (el - 22.5 <= windKey) {
            data[key] = windName;
            break;
          }
        }
      } else if (key === "wind_speed" || key === "wind_gust") {
        // To avoid calculous to already-parsed data
        if (typeof el === "string") continue;

        const parsedSpeed = Math.floor((10 * el * 36.66) / 10) / 10;
        data[key] = `${parsedSpeed}Km/h`;
      } else if (key === "uvi") {
        for (let uviKey in UVIndex) {
          const recommendation = UVIndex[uviKey];
          // It always will get the lowest possible key in UVIndex
          if (el <= uviKey) {
            data[key] = `${recommendation} (${el})`;
            break;
          }
        }
      } else if (key === "clouds") {
        if (typeof el === "string") continue;
        data[key] = `${data[key]}%`;
      } else if (key === "temp") {
        if (["string", "number"].includes(typeof(el))) continue;
        data[key] = data[key].day;
      }
    }

    console.log(data);
  };

  parseData(data);
  let timeTypeText;
  let classes = ["Period", "squircle"];
  if (timeType) {
    if (timeType === "dt") {
      const time = data[timeType];
      let formattedTime = time.split(":");
      formattedTime.pop();
      timeTypeText = `${formattedTime.join(":")}`;
      if (time.split(":")[0] === "00") {
        classes.push("margin-left-8");
      }
    }
  }

  const renderParams = (el) => {
    console.log(el);
    if (!data[el]) return;
    console.log(data[el]);
    if (!(typeof data[el] === "string" || typeof data[el] === "number")) return;
    return (
      <li className={el}>
        <b>{uiTranscribe[el] || el}</b>
        {data[el]}
      </li>
    );
  };

  console.log(data.temp);
  const tempOverlay =
    data.temp && data.temp !== "" ? <div className="temp-overlay"></div> : "";

  return (
    <li className={classes.join(" ")}>
      {tempOverlay}
      <span className="time">{timeTypeText}</span>
      <ul>
        {defaultParams.map((el) => renderParams(el))}
        {preferedParams[userType].map((el) => renderParams(el))}
      </ul>
    </li>
  );
}
