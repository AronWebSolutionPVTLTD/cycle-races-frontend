import React from "react";

import { FirstSection } from "./SectionFirst";
import { SectionSecond } from "./SectionSecond";



const MultipleStageRace = ({ selectedYear, selectedNationality, name }) => {
  return (
    <>
      <FirstSection
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
      <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
    </>
  );
};

export default MultipleStageRace;
