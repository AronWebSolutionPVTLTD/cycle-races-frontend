import { generateYearOptions } from "@/components/GetYear";
import MostWin from "@/components/home/sections/MostWin";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { FirstSection } from "@/components/stats_section/FirstSection";
import MostwinSection from "@/components/stats_section/MostwinSection";
import SecondSection from "@/components/stats_section/SecondSection";
import { callAPI } from "@/lib/api";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Stats() {
  const [nationalities, setNationalities] = useState([]);
  const [teams, setTeams] = useState([]);

  // Selected filter values and search inputs combined
  // const [selectedYear, setSelectedYear] = useState(
  //   new Date().getFullYear().toString()
  // );
  const [selectedYear, setSelectedYear] = useState('2015');
  const [yearInput, setYearInput] = useState(
    new Date().getFullYear().toString()
  );
  // const [yearInput, setYearInput] = useState('2015');
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

  // Initialize years list

  const {withoutAllTime } = generateYearOptions();

  // Fetch nationalities and teams based on filters
  const fetchFiltersData = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = {};
      if (selectedTeam) queryParams.q_team = selectedTeam;
      if (selectedNationality) queryParams.q_country = selectedNationality;
      if (selectedYear) queryParams.q_year = selectedYear;

      const response = await callAPI(
        "GET",
        "/teams/getAllTeamsForFilters",
        queryParams
      );

      if (response.status && response.data) {
        setTeams(response.data.team_names || []);
        setNationalities(response.data.rider_countries || []);
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

  // Filter years based on input
  const getFilteredYears = (searchValue) => {
    return withoutAllTime.filter((year) =>
      year.toLowerCase().includes((searchValue || "").toLowerCase())
    );
  };

  // Handle year input change to filter the dropdown options without API call
  const handleYearInputChange = (value) => {
    setYearInput(value);
    // No API call on typing, just filter the dropdown options
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput(value);
        setShowYearDropdown(false);
        fetchFiltersData(); // Fetch data with new year
        break;
      case "nationality":
        setSelectedNationality(value);
        setShowNationalityDropdown(false);
        fetchFiltersData(); // Fetch data with new nationality
        break;
      case "team":
        setSelectedTeam(value);
        setShowTeamDropdown(false);
        fetchFiltersData(); // Fetch data with new team
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Stats - Wielerstats</title>
      </Head>

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

              <ul className="filter">
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
                />
              </ul>
            </div>
            <FirstSection
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />
            <MostWin
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />

            <SecondSection
              selectedNationality={selectedNationality}
              selectedTeam={selectedTeam}
              selectedYear={selectedYear}
            />
          </div>
        </div>
      </section>

      {/* You can uncomment these sections as needed */}
      {/* <MostwinSection/> */}
    </>
  );
}
