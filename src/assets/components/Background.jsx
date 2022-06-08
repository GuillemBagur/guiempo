import React from "react";

import Cloud from "./Cloud";
import Sun from "./Sun";


import "../css/Background.css";

export default function Background() {
  return <div className="Background">
    <Sun />
    <Cloud />
  </div>;
}
