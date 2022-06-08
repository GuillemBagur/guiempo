import React from "react";

import "../css/Unfocuser.css";

export default function Unfocuser({ unFocus }) {
  return <div onClick={unFocus} className="Unfocuser"></div>;
}
