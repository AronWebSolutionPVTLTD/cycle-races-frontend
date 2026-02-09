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
  const yearDropdownRef = useRef(null);
  const nationalityDropdownRef = useRef(null);
  const teamDropdownRef = useRef(null);
  const { withoutAllTime } = generateYearOptions();
  const fetchFiltersData = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = {};
      if (selectedYear) queryParams.year = selectedYear;
      const response = await callAPI(
        "GET",
        "/teams/getAllTeamsForFilters",
        {},
        queryParams
      );

      if (response.status && response.data) {
        setTeams(response.data.team_names || []);
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/ws_favicon.png" />
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
                <h1 className="fw-900 fst-italic">stats</h1>
                <div className="filter-section-wrapper">
                  <ul className="filter filter-3-cols">
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
                  {(selectedYear && selectedYear !== "2025" || selectedNationality || selectedTeam) && (
                    <div className="filter-summary">
                      <span className="filter-summary-text">
                        Filter:
                        {selectedYear && selectedYear !== "All time" && (
                          <> {selectedYear}</>
                        )}
                        {selectedNationality && (
                          <>
                            {selectedYear && selectedYear !== "All time" ? "," : ""}
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

                        {selectedTeam && (
                          <>
                            {(selectedYear && selectedYear !== "All time") || selectedNationality ? "," : ""}
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