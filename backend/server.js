import express from "express";
import { loadData, dataPath, saveForecasts } from "./assets/js/functions.js";

const app = express();
const port = 3000;

const finalResponse = (coords, cb) => {
  let response = {};
  saveForecasts("daily", coords, (res) => {
    const scores = loadData(dataPath + "sorted-score.json");
    response.daily = [];
    const weatherParams = res.openweather.daily[0];
    for (let day = 0; day < 8; day++) {
      let dayData = {};
      for (let param in weatherParams) {
        if (!scores[day][param] || !scores[day][param][0]) continue;
        const provider = scores[day][param][0];
        if (!res[provider].daily[day][param]) continue;
        dayData[param] = res[provider].daily[day][param];
      }

      response.daily.push(dayData);
    }

    cb(response);
  });
};

app.get("/", (req, res) => {
  if (!req.query.lat || !req.query.lon) res.send("Error");
  finalResponse({ lat: req.query.lat, lon: req.query.lon }, (response) => {
    res.json(response);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
