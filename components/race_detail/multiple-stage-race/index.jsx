import React from "react";

import { FirstSection } from "./SectionFirst";
import { SectionSecond } from "./SectionSecond";
import MostStageWins from "./MostStageWin";
import MostMoutainWin from "./MostMoutain";
import { LastSection } from "./LastSection";

const MultipleStageRace = ({ selectedYear, selectedNationality, name, t }) => {
  return (
    <>
      <FirstSection
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />
      <MostStageWins
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />
      <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />
      <MostMoutainWin
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />

      <LastSection
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />
    </>
  );
};

export default MultipleStageRace;
