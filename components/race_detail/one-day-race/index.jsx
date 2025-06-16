import React from "react";
import { RaceDetail } from "./RaceDetail";
import { SectionSecond } from "./SectionSecond";

const OneDayRace = ({ selectedYear, selectedNationality, name }) => {
  return (
    <>
      <RaceDetail
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
      {/* <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      /> */}
    </>
  );
};

export default OneDayRace;
