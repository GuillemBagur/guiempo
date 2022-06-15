import React from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import Period from "./Period";

import "../css/Carrousel.css";

export default function Carrousel({ rawData, userType, timeType }) {
  const data = rawData || [];

  if(!data.length) return <Period givenClasses={["lonely"]} userType={userType} data={data} timeType={timeType} />;
  return (
    <div className="centerer">
      <ul className="Carrousel">
        <ScrollContainer hideScrollbars="false">
          {data.map((el) => (
            <Period userType={userType} data={el} timeType={timeType} />
          ))}
        </ScrollContainer>
      </ul>
    </div>
  );
}
