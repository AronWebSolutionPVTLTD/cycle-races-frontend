import React from "react";
import { RaceDetail } from "./RaceDetail";
import { SectionSecond } from "./SectionSecond";
import RaceMostWin from "../Mostwin";
import Mostparticipants from "./MostParticipants";
import { LastSection } from "./LastSection";

const OneDayRace = ({ selectedYear, selectedNationality, name }) => {
  return (
    <>
      <RaceDetail
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
      <RaceMostWin selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality} name={name} />

      <SectionSecond
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />

      <Mostparticipants
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />

      <LastSection
        selectedYear={selectedYear !== "All time" ? selectedYear : null}
        selectedNationality={selectedNationality}
        name={name}
      />
    </>
  );
};

export default OneDayRace;
