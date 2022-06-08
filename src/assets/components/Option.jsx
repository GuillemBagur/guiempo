import React from "react";

export default function Option({select, inner, value}) {
  const handleClick = () =>{
    select(value);
  }

  return <li onClick={handleClick}>{inner}</li>;
}
