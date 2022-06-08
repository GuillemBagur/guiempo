import React, { useState } from "react";

import "../css/SearchBar.css";

export default function SearchBar({ search }) {
  const [location, setLocation] = useState("Ciutadella");

  const handleKeyDown = (e) => {
    setLocation(e.target.value);
  };

  const getLocation = () => {
    search(location);
  };

  return (
    <div className="SearchBar">
      <input type="text" onKeyDown={handleKeyDown} placeholder="Ubicación" />
      <button className="Button squircle" onClick={getLocation}>Buscar</button>
    </div>
  );
}
