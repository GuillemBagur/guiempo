import React, { useState } from "react";

import Unfocuser from "./Unfocuser";
import Option from "./Option";

import { capitalizeFirstLetter } from "../js/miscelaneous";

import "../css/Select.css";

export default function Select({ defaultValue, options, whenChange, givenClasses }) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [inner, setInner] = useState(value);

  const classes = ['Select'];
  givenClasses.forEach(className => classes.push(className));

  const unFocus = () => {
    setFocus(false);
  };

  const handleClick = (newValue) => {
    whenChange(newValue);
    setValue(newValue);
    unFocus();
    setInner(newValue);
  };


  const showOptionsList = focus ? "focus" : "";
  const optionsList = (
    <ul className={showOptionsList}>
      {options.map((el) => {
        return <Option select={handleClick} value={el} inner={capitalizeFirstLetter(el)} />;
      })}
    </ul>
  );

  const showUnfocus = focus ? <Unfocuser unFocus={unFocus} /> : "";

  return (
    <div className={classes.join(" ")}>
      {showUnfocus}
      <div className="centerer">
        <button onClick={() => setFocus(!focus)}>
          {capitalizeFirstLetter(inner)}
        </button>
      </div>

      {optionsList}
    </div>
  );
}
