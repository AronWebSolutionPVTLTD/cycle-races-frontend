import React from "react";
import { RaceDetail } from "./RaceDetail";
import { SectionSecond } from "./SectionSecond";
import RaceMostWin from "../Mostwin";
import Mostparticipants from "./MostParticipants";
import { LastSection } from "./LastSection";

const OneDayRace = ({ selectedYear, selectedNationality, name, t }) => {
  return (
    <>
      <RaceDetail
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />
      <RaceMostWin selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality} name={name} t={t} />

      <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
        t={t}
      />

      <Mostparticipants
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

export default OneDayRace;
