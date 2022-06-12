import React, { useEffect, useState } from "react";

import "../css/SearchBar.css";

export default function SearchBar({ search, fetchList }) {
  const [location, setLocation] = useState("Ciutadella");
  const handleKeyDown = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length) {
      fetchList(value);
    }
  };

  const getLocation = () => {
    search(location);
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        list="available-locations"
        onKeyDown={handleKeyDown}
        placeholder="Ubicación"
      />
      <button className="Button squircle" onClick={getLocation}>
        Buscar
      </button>
      
    </div>
  );
}
