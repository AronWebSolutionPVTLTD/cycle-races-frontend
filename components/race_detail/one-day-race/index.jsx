import React from "react";
import { RaceDetail } from "./RaceDetail";
import { SectionSecond } from "./SectionSecond";
import RaceMostWin from "../Mostwin";

const OneDayRace = ({ selectedYear, selectedNationality, name }) => {
  return (
    <>
      <RaceDetail
        // selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
      <RaceMostWin 
       selectedNationality={selectedNationality}
        name={name}/>
      {/* <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      /> */}
    </>
  );
};

export default OneDayRace;
