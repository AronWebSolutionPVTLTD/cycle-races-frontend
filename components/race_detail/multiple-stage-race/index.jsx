import React from "react";

import { FirstSection } from "./SectionFirst";
import { SectionSecond } from "./SectionSecond";
import MostStageWins from "./MostStageWin";
import MostMoutainWin from "./MostMoutain";
import { LastSection } from "./LastSection";



const MultipleStageRace = ({ selectedYear, selectedNationality, name }) => {
  return (
    <>
 <FirstSection
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
       <MostStageWins
         selectedNationality={selectedNationality}
         name={name}/>
      <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      /> 
      <MostMoutainWin
        selectedNationality={selectedNationality}
         name={name}/>
   
        <LastSection
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
    </>
  );
};

export default MultipleStageRace;
