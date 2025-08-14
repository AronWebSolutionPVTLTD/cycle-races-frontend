import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { callAPI } from "../../lib/api";
import Flag from "react-world-flags";
import { generateYearOptions } from "@/components/GetYear";
import {
  CardSkeleton,
  ErrorStats,
  ListSkeleton,
} from "@/components/loading&error";

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

  const { withoutAllTime } = generateYearOptions();
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

  // Convert month name to number (1-12)
  const getMonthNumber = (monthName) => {
    return months.findIndex((month) => month === monthName) + 1;
  };

  // Fetch data from API with filters
  const fetchRaceResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";

      const endpoint = `stages/getRecentStageRaceWinners?year=${selectedYear}${monthParam}${searchParam}`;
      const data = await callAPI("GET", endpoint);

      setRaceResults(data.recent_stage_race_winners || []);
      setSearchResults([]); // Clear search results after fetching
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
          // image: '/images/player6.png'
        });
      }

      // Top Team
      if (teamRes.data?.recent_team_rankings?.length) {
        const topTeam = teamRes.data.recent_team_rankings[0];
        featured.push({
          title: teamRes.message,
          rider: topTeam.team_name,
          // flag: '/images/flag-placeholder.svg',
          speed: `${topTeam.total_wins}`,
          // image: '/images/player6.png'
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
          // image: '/images/player6.png'
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

  // Initial data fetch and close dropdown on click outside
  useEffect(() => {
    fetchRaceResults();
    fetchFeaturedRaces();
  }, [selectedYear, selectedMonth]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".searchInput")) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const delayDebounce = setTimeout(() => {
        fetchSearchSuggestions();
      }, 300); // 300ms delay

      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchTerm]);

  // Fetch search suggestions separately from results
  const fetchSearchSuggestions = async () => {
    try {
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const searchParam = `&search=${encodeURIComponent(searchTerm)}`;

      const endpoint = `stages/getRecentStageRaceWinners?year=${selectedYear}${monthParam}${searchParam}`;
      const data = await callAPI("GET", endpoint);

      // Extract unique race names from results for the dropdown
      const uniqueRaces = Array.from(
        new Set(
          (data.recent_stage_race_winners || []).map((item) => item.race_name)
        )
      ).map((raceName) => {
        return {
          race_name: raceName,
        };
      });

      setSearchResults(uniqueRaces);
      setShowSearchDropdown(uniqueRaces.length > 0);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    fetchRaceResults();
  };

  // Handle search suggestion selection
  const handleSuggestionSelect = (raceName) => {
    setSearchTerm(raceName);
    setShowSearchDropdown(false);
    fetchRaceResults();
  };

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    fetchRaceResults();
  };
  

  return (
    <>
      <Head>
        <title>Results - Cycling Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/fav-icon.svg" type="image/svg+xml" />
      </Head>
      <main>
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
                <div className="searchInput">
                  <form onSubmit={handleSearch}>
                    <div className="wraper">
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
                        <img
                          src="/images/search-icon.svg"
                          alt="Search"
                          onClick={handleSearch}
                        />
                        <input
                          type="reset"
                          value=""
                          className="close"
                          onClick={clearSearch}
                        />
                      </div>
                    </div>
                    {showSearchDropdown && searchResults.length > 0 && (
                      <div>
                        <ul>
                          {searchResults.map((result, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSuggestionSelect(result.race_name)
                              }
                            >
                              <span>{result.race_name}</span>
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
                  <li className="active">
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      id="yearSelect"
                    >
                      {withoutAllTime.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </li>
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
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="active"
                  >
                    {withoutAllTime.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
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
                    {raceResults.map((item, idx) => (
                      <li key={idx}>
                        <span>{item.date}</span>
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
                            href={`/races/${encodeURIComponent(
                              item.race_name
                            )}`}
                          >
                            {item.race_name}
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
                          <img
                            src="/images/eye.svg"
                            alt="Details"
                            width="24"
                            height="24"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-results">No race results found</div>
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
                      <a href="#" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{race.title}</h4>
                        <div className="name-wraper">
                          <Flag
                            code={race?.flag}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginLeft: "10px",
                            }}
                          />
                          <h6>{race.rider}</h6>
                        </div>
                      </div>
                      {race?.speed && (
                        <h5>
                          <strong>{race.speed}</strong> wins
                        </h5>
                      )}
                      {/* <img 
                        src={race.image} 
                        alt="" 
                        className="absolute-img" 
                        onError={(e) => { e.target.src = '/images/player-placeholder.png' }}
                      /> */}
                      <a href="#" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
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
