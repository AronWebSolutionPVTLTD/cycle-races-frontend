import { generateYearOptions } from "@/components/GetYear";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import StatsFirstSection from "@/components/stats_section/StatsFirstSection";
import StatsSecondSection from "@/components/stats_section/StatsSecondSection";
import StatsThirdSection from "@/components/stats_section/StatsThirdSection";
import { callAPI } from "@/lib/api";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MostWin from "@/components/home/sections/MostWin";
import StatsData from "@/components/stats_section/StatsData";

export default function Stats() {
  const [nationalities, setNationalities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [yearInput, setYearInput] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // Refs for handling clicks outside dropdowns
  const yearDropdownRef = useRef(null);
  const nationalityDropdownRef = useRef(null);
  const teamDropdownRef = useRef(null);
  const { withoutAllTime } = generateYearOptions();

  // Fetch nationalities and teams based on filters
  const fetchFiltersData = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = {};
      // if (selectedTeam) queryParams.q_team = selectedTeam;
      // if (selectedNationality) queryParams.q_country = selectedNationality;
      if (selectedYear) queryParams.year = selectedYear;

      const response = await callAPI(
        "GET",
        "/teams/getAllTeamsForFilters",
        {},
        queryParams
      );

      if (response.status && response.data) {
        setTeams(response.data.team_names || []);
        console.log('response',response.data.rider_countries);
        setNationalities((response.data.rider_countries || []).slice(2));
      }
    } catch (error) {
      console.error("Error fetching filters data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNationality, selectedTeam, selectedYear]);

  useEffect(() => {
    fetchFiltersData();
  }, [fetchFiltersData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
      if (
        nationalityDropdownRef.current &&
        !nationalityDropdownRef.current.contains(event.target)
      ) {
        setShowNationalityDropdown(false);
      }
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(event.target)
      ) {
        setShowTeamDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      return withoutAllTime;
    }


    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return withoutAllTime.filter((year) =>
        year.toLowerCase().includes(searchValue.toLowerCase())
      );
    }


    return withoutAllTime;
  };

  const handleYearInputChange = (value) => {
    setYearInput(value);
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput("");
        setShowYearDropdown(false);
        fetchFiltersData();
        break;
      case "nationality":
        setSelectedNationality(value);
        setShowNationalityDropdown(false);
        fetchFiltersData();

        break;
      case "team":
        setSelectedTeam(value);
        setShowTeamDropdown(false);
        fetchFiltersData();
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Stats - Wielerstats</title>
      </Head>
      <main className="inner-pages-main">
      <div className="dropdown-overlay"></div>
      <section className="stats-sec1 lazy">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">home</Link>
                </li>
                <li>stats</li>
              </ul>
              <h1>statistieken</h1>
              <div className="filter-section-wrapper">
              <ul className="filter sss">
                {/* Year Dropdown with input change handling */}
                <FilterDropdown
                  ref={yearDropdownRef}
                  isOpen={showYearDropdown}
                  toggle={() => setShowYearDropdown(!showYearDropdown)}
                  options={getFilteredYears(yearInput)}
                  selectedValue={selectedYear}
                  placeholder="Year"
                  onSelect={(value) => handleSelection("year", value)}
                  onInputChange={handleYearInputChange}
                  loading={false}
                  includeAllOption={false}
                  classname="year-dropdown"
                />

                {/* Nationality Dropdown */}
                <FilterDropdown
                  ref={nationalityDropdownRef}
                  isOpen={showNationalityDropdown}
                  toggle={() =>
                    setShowNationalityDropdown(!showNationalityDropdown)
                  }
                  options={nationalities}
                  selectedValue={selectedNationality}
                  placeholder="Nationaliteit"
                  onSelect={(value) => handleSelection("nationality", value)}
                  loading={isLoading}
                  allOptionText="All Nationalities"
                  classname="nationality-dropdown"
                  displayKey="country_name"
                  valueKey="country_code"
                />

                {/* Teams Dropdown */}
                <FilterDropdown
                  ref={teamDropdownRef}
                  isOpen={showTeamDropdown}
                  toggle={() => setShowTeamDropdown(!showTeamDropdown)}
                  options={teams}
                  selectedValue={selectedTeam}
                  placeholder="Team"
                  onSelect={(value) => handleSelection("team", value)}
                  loading={isLoading}
                  allOptionText="All Teams"
                  classname="team-dropdown"
                />
              </ul>
            {/* Show selected filters summary and reset button */}
            {(selectedYear && selectedYear !== "2025" || selectedNationality || selectedTeam) && (
              <div className="filter-summary">
                <span className="filter-summary-text">
                  Filter:
                  {/* Show year if selected and not "All time" */}
                  {selectedYear && selectedYear !== "All time" && (
                    <> {selectedYear}</>
                  )}
                  {/* Show nationality if selected */}
                  {selectedNationality && (
                    <>
                      {selectedYear && selectedYear !== "All time" ? "," : ""}
                      {" "}
                      {/* Find the display name for the selected nationality */}
                      {(() => {
                        const natObj = nationalities?.find(
                          n =>
                            (n.country_code || n) === selectedNationality
                        );
                        return natObj
                          ? natObj.country_name || natObj.name || natObj.label || selectedNationality
                          : selectedNationality;
                      })()}
                    </>
                  )}
                  
                  {/* Show team if selected */}
                  {selectedTeam && (
                    <>
                      {(selectedYear && selectedYear !== "All time") || selectedNationality ? "," : ""}
                      {" "}
                      {/* Find the display name for the selected team */}
                      {(() => {
                        const teamObj = teams?.find(
                          t => (t.value || t) === selectedTeam
                        );
                        return teamObj
                          ? teamObj.label || teamObj.name || selectedTeam
                          : selectedTeam;
                      })()}
                    </>
                  )}
                </span>
                <button className="reset-filter-btn"
                  onClick={() => {
                    setSelectedYear("2025");
                    setSelectedNationality("");
                    setSelectedTeam("");
                  }}
                  aria-label="Reset filter"
                >
                  Reset filter
                  <span className="reset-filter-btn-icon">×</span>
                </button>
              </div>
            )}
            </div>
            </div>
            </div>
            </div>

            <StatsFirstSection
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />

            <MostWin
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
              apiEndpoint="mostWin"
              title="Most Wins"
              dataField="wins"
            />

            <StatsData
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />

            <StatsSecondSection
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />
            <MostWin
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
              apiEndpoint="mostStageWins"
              title="Most Stage"
              dataField="count"
            />
            <StatsThirdSection
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />
        
      </section>
      </main>
    </>
  );
}