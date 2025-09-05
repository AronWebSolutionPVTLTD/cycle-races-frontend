import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { callAPI } from "../../lib/api";
import Flag from "react-world-flags";
import { generateYearOptions } from "@/components/GetYear";
import { RiSearchLine } from "react-icons/ri";
import {
  CardSkeleton,
  ErrorStats,
  ListSkeleton,
} from "@/components/loading&error";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";

function convertDateRange(dateStr) {
  const monthNames = [
    "jan","feb","mar","apr","may","jun",
    "jul","aug","sep","oct","nov","dec"
  ];

  const parse = (d) => {
    const [day, month] = d.split(".");
    return { day: parseInt(day, 10), month: parseInt(month, 10) };
  };

  if (dateStr.includes(" - ")) {
    const [start, end] = dateStr.split(" - ");
    const s = parse(start);
    const e = parse(end);

    if (s.month === e.month) {
      // 14 - 18 May
      return { start: `${s.day} - ${e.day} ${monthNames[s.month - 1]}`, end: null };
    } else {
      // 29 May - 1 Jun
      return {
        start: `${s.day} ${monthNames[s.month - 1]}`,
        end: `${e.day} ${monthNames[e.month - 1]}`
      };
    }
  } else {
    // Single date -> 20 Apr
    const d = parseInt(dateStr.split(".")[0], 10);
    const m = parseInt(dateStr.split(".")[1], 10);
    return { start: `${d} ${monthNames[m - 1]}`, end: null };
  }
}

export default function Results() {
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [featuredRaces, setFeaturedRaces] = useState([]);
  const [error, setError] = useState(null);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const { withoutAllTime } = generateYearOptions();
  const [yearInput, setYearInput] = useState("");
  
  const months = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  const yearDropdownRef = useRef(null);
  
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
        break;
    }
  };

  // Convert month name to number (1-12)
  const getMonthNumber = (monthName) => {
    return months.findIndex((month) => month === monthName) + 1;
  };

  const buildQueryParams = () => {
    const params = {
      year: selectedYear,
    };

    if (selectedMonth) {
      params.month = getMonthNumber(selectedMonth);
    }

    return params;
  };

  const buildUrlWithParams = (statsPath) => {
    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return `/${statsPath}?${queryString}`;
  };

  // Fetch data from API with filters - FIXED VERSION
  const fetchRaceResults = async (customSearchTerm = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchQuery = customSearchTerm !== null ? customSearchTerm : searchTerm;
      
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const searchParam = searchQuery && searchQuery.trim()
        ? `&search=${encodeURIComponent(searchQuery.trim())}`
        : "";

      const endpoint = `stages/getRecentStageRaceWinners?year=${selectedYear}${monthParam}${searchParam}`;
      
      console.log('Fetching with endpoint:', endpoint);
      console.log('Search query being used:', searchQuery);
      
      const data = await callAPI("GET", endpoint);
      
      console.log('API Response:', data);
      console.log('Race results count:', data.recent_stage_race_winners?.length || 0);
      
      setRaceResults(data.recent_stage_race_winners || []);
      
    } catch (error) {
      console.error("Error fetching race results:", error);
      setError("Failed to load race results. Please try again later.");
      setRaceResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured races data
  const fetchFeaturedRaces = async () => {
    setLoadingFeatured(true);
    setErrorFeatured(null);
    try {
      const [victoryRes, teamRes, bestRes] = await Promise.all([
        callAPI("GET", `stages/getCurrentVictoryRanking?year=${selectedYear}`),
        callAPI("GET", `stages/getCurrentTeamRanking?year=${selectedYear}`),
        callAPI("GET", `stages/getBestRidersOfRecentYear?year=${selectedYear}`),
      ]);

      const featured = [];

      // Top Victory Rider
      if (victoryRes.data?.top_riders?.length) {
        const topRider = victoryRes.data.top_riders[0];
        featured.push({
          title: victoryRes.message,
          rider: topRider.rider_name,
          flag: topRider.rider_country.toLowerCase(),
          speed: `${topRider.wins}`,
          link: "current-victory-ranking",
        });
      }

      // Top Team
      if (teamRes.data?.recent_team_rankings?.length) {
        const topTeam = teamRes.data.recent_team_rankings[0];
        featured.push({
          title: teamRes.message,
          rider: topTeam.team_name,
          speed: `${topTeam.total_wins}`,
          link: "current-team-ranking",
        });
      }

      // Best Rider of the Year
      if (bestRes?.data?.top_riders?.length) {
        const best = bestRes.data.top_riders[0];
        featured.push({
          title: bestRes.message,
          rider: best.rider_name,
          flag: best.rider_country.toLowerCase(),
          speed: best.wins,
          link: "best-riders-of-recent-year",
        });
      }

      setFeaturedRaces(featured);
    } catch (error) {
      console.error("Error fetching featured races:", error);
      setErrorFeatured(
        "Failed to load featured races. Please try again later."
      );
      setFeaturedRaces([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRaceResults();
    fetchFeaturedRaces();
  }, [selectedYear, selectedMonth]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".searchInput")) {
        setShowSearchDropdown(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search for suggestions - FIXED VERSION
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const delayDebounce = setTimeout(() => {
        fetchSearchSuggestions();
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchTerm, selectedYear, selectedMonth]);

  // Fetch search suggestions - FIXED VERSION
  const fetchSearchSuggestions = async () => {
    try {
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const searchParam = `&search=${encodeURIComponent(searchTerm.trim())}`;

      const endpoint = `stages/getRecentStageRaceWinners?year=${selectedYear}${monthParam}${searchParam}`;
      const data = await callAPI("GET", endpoint);

      // Extract unique race names from results for the dropdown
      const uniqueRaces = Array.from(
        new Set(
          (data.recent_stage_race_winners || []).map((item) => item.race_name)
        )
      )
      .filter(raceName => raceName.toLowerCase() !== searchTerm.toLowerCase())
    .map((raceName) => ({
      race_name: raceName,
      // .map((raceName) => ({
      //   race_name: raceName,
      }));

      console.log('Search suggestions:', uniqueRaces);
      
      setSearchResults(uniqueRaces);
      setShowSearchDropdown(uniqueRaces.length > 0);
    } catch (error) { 
      console.error("Error fetching search suggestions:", error);
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Handle search input change
  const handleSearchInput = (e) => {
    const value = e.target.value; 
    setSearchTerm(value);
    
    // If input is cleared, fetch all results
    if (value.trim() === "") {
      fetchRaceResults("");
      setSearchResults([]);
    setShowSearchDropdown(false);
    }
  };

  // Handle search form submission - FIXED VERSION
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    fetchRaceResults();
  };

  // Handle search suggestion selection - FIXED VERSION
  const handleSuggestionSelect = (raceName) => {
    console.log('Selected race:', raceName);
    
    setSearchTerm(raceName);
    setShowSearchDropdown(false);
    setSearchResults([]);
    
    // Immediately fetch results with the selected race name
    fetchRaceResults(raceName);
  };

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Clear search - FIXED VERSION
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    fetchRaceResults("");
  };

  // Debug logging
  useEffect(() => {
    console.log('Current race results:', raceResults.length, raceResults);
  }, [raceResults]);

  return (
    <>
      <Head>
        <title>Results - Cycling Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/fav-icon.svg" type="image/svg+xml" />
      </Head>
      <main>
        <div className="dropdown-overlay"></div>
        <section className="riders-sec1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="breadcrumb">
                  <li>
                    <Link href="/">home</Link>
                  </li>
                  <li>results</li>
                </ul>
                <h1>Results</h1>
                <div className="searchInput 222">
                  <form onSubmit={handleSearch}>
                    <div className="wraper">
                      <div className="wrap-top">
                        <input
                          type="text"
                          placeholder="welke wedstrijd zoek je?"
                          value={searchTerm}
                          onChange={handleSearchInput}
                          onFocus={() =>
                            searchResults.length > 0 &&
                            setShowSearchDropdown(true)
                          }
                        />
                        <div className="icon">
                          <span className="search-icon" onClick={handleSearch}>
                            <RiSearchLine />
                          </span>
                          <input
                            type="reset"
                            value=""
                            className="close"
                            onClick={clearSearch}
                          />
                        </div>
                      </div>
                    </div>
                    {showSearchDropdown && searchResults.length > 0 && (
                      <div className="wrap-bottom">
                        <ul>
                          {searchResults.map((result, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSuggestionSelect(result.race_name)
                              }
                            >
                              <div>
                                <span>{result.race_name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-banner result-sec1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="filter">
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
                  {months.map((month) => (
                    <li
                      key={month}
                      className={selectedMonth === month ? "active" : ""}
                    >
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedMonth(month);
                        }}
                      >
                        {month}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="select-box">
                  <select value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-9 col-md-7">
                <ul className="head-heading">
                  <li>Date</li>
                  <li>Race</li>
                  <li>Winner</li>
                  <li>Team</li>
                </ul>

                {loading ? (
                  <div className="loading-spinner">
                    <ListSkeleton />
                  </div>
                ) : error ? (
                  <div className="col-12">
                    <ErrorStats message={error} />
                  </div>
                ) : raceResults.length > 0 ? (
                  <ul className="transparent-cart">
                    {raceResults.map((item, idx) => {
                        const { start, end } = convertDateRange(item?.date);
                        return(
                          <li key={idx}>
                        <span className="text-capitalize">{start} {end ? ` - ${end}` : ""}</span>
                        <h5>
                          <Flag
                            code={item.country_code.toUpperCase()}
                            style={{
                              width: "30px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          <Link
                            href={`/races/${encodeURIComponent(item.race_name)}`}
                          >
                            {item.race_name}
                            {item.is_stage_race && (
                              <span style={{ color: "inherit" }}>
                                - Stage {item?.stage_number}
                              </span>
                            )}
                          </Link>
                        </h5>
                        <h6>
                          <Flag
                            code={item.rider_country.toUpperCase()}
                            style={{
                              width: "30px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          {item.rider_name}
                        </h6>
                        <h6>{item.team_name}</h6>
                        <Link
                          href={`/race-result/${encodeURIComponent(
                            item.race_name
                          )}`}
                          className="r-details"
                        >
                          {/* <img
                            src="/images/eye.svg"
                            alt="Details"
                            width="24"
                            height="24"
                          /> */}
                          <img src="/images/hover-arow.svg" alt="" />
                        </Link>
                      </li>
                        )
                        
                      })}
                  </ul>
                ) : (
                  <div className="no-results">
                    {searchTerm.trim() 
                      ? `No results found for "${searchTerm}"`
                      : "No race results found"
                    }
                  </div>
                )}
              </div>

              <div className="col-lg-3 col-md-5">
                {loadingFeatured ? (
                  <div className="loading-spinner">
                    <CardSkeleton />
                  </div>
                ) : errorFeatured ? (
                  <div className="col-12">
                    <ErrorStats message={errorFeatured} />
                  </div>
                ) : featuredRaces.length > 0 ? (
                  featuredRaces.map((race, index) => (
                    <div className="team-cart" key={index}>
                      <Link href={buildUrlWithParams(race.link)} className="pabs"></Link>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{race.title}</h4>
                        <div className="name-wraper">
                          {race.flag && (
                            <Flag
                              code={race.flag}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                          <h6>{race.rider}</h6>
                        </div>
                      </div>
                      {race?.speed && (
                        <h5>
                          <strong>{race.speed}</strong> wins
                        </h5>
                      )}
                      <Link
                        href={buildUrlWithParams(race.link)}
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="no-results">No featured races available</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}