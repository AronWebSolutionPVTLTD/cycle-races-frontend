import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { callAPI } from "../../lib/api";
import { generateYearOptions } from "@/components/GetYear";
import {
  CardSkeleton,
  ErrorStats,
  ListSkeleton,
} from "@/components/loading&error";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { renderFlag } from "@/components/RenderFlag";

function convertDateRange(dateStr) {
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
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
      return { start: `${s.day} ${monthNames[s.month - 1]}`, end: null };
    } else {
      return {
        start: `${s.day} ${monthNames[s.month - 1]}`,
        end: null,
      };
    }
  } else {
    const d = parseInt(dateStr.split(".")[0], 10);
    const m = parseInt(dateStr.split(".")[1], 10);
    return { start: `${d} ${monthNames[m - 1]}`, end: null };
  }
}

export default function Results() {
  const router = useRouter();
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedYear, setSelectedYear] = useState("All-time");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [featuredRaces, setFeaturedRaces] = useState([]);
  const [error, setError] = useState(null);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const parentRef = useRef(null);
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



  const { withoutAllTime } = generateYearOptions();
  const allYearOptions = ["All-time", ...withoutAllTime];
  const yearDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);

  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      return allYearOptions;
    }

    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return withoutAllTime.filter((year) =>
        year.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return allYearOptions.filter((year) =>
      year.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getFilteredMonths = (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      return months;
    }
    return months.filter((month) =>
      month.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleYearInputChange = (value) => {
    setYearInput(value);
  };

  const handleMonthInputChange = (value) => {
    setMonthInput(value);
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput("");
        setShowYearDropdown(false);
        break;
      case "month":
        setSelectedMonth(value);
        setMonthInput("");
        setShowMonthDropdown(false);
        break;
    }
  };

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
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    return `/${statsPath}?${queryString}`;
  };

  const fetchRaceResults = async (customSearchTerm = null) => {
    setLoading(true);
    setError(null);

    try {
      const searchQuery =
        customSearchTerm !== null ? customSearchTerm : searchTerm;

      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";

      const searchParam =
        searchQuery && searchQuery.trim()
          ? `&search=${encodeURIComponent(searchQuery.trim())}`
          : "";

      const yearParam =
        selectedYear !== "All-time" ? `year=${selectedYear}` : "";
      const endpoint = `stages/getRecentStageRaceWinners?${yearParam}${monthParam}${searchParam}`;
      const data = await callAPI("GET", endpoint);
      setRaceResults(data.recent_stage_race_winners || []);
    } catch (error) {
      console.error("Error fetching race results:", error);
      setError("Failed to load race results. Please try again later.");
      setRaceResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedRaces = async () => {
    setLoadingFeatured(true);
    setErrorFeatured(null);
    try {
      const yearParam =
        selectedYear !== "All-time" ? `?year=${selectedYear}` : "";

      const [victoryRes, teamRes, bestRes] = await Promise.all([
        callAPI("GET", `stages/getCurrentVictoryRanking${yearParam}`),
        callAPI("GET", `stages/getCurrentTeamRanking${yearParam}`),
        callAPI("GET", `stages/getBestRidersOfRecentYear${yearParam}`),
      ]);

      const featured = [];

      if (victoryRes.data?.top_riders?.length) {
        const topRider = victoryRes.data.top_riders[0];
        featured.push({
          title: victoryRes.message,
          rider: topRider.rider_name,
          id: topRider.rider_id,
          riderSlug: topRider.riderSlug,
          flag: topRider.rider_country.toLowerCase(),
          speed: `${topRider.wins}`,
          link: "recent-victory-ranking",
        });
      }

      if (teamRes.data?.recent_team_rankings?.length) {
        const topTeam = teamRes.data.recent_team_rankings[0];
        featured.push({
          title: teamRes.message,
          team: topTeam.team_name,
          teamSlug: topTeam.teamSlug,
          speed: `${topTeam.total_wins}`,
          link: "recent-team-ranking",
        });
      }

      if (bestRes?.data?.top_riders?.length) {
        const best = bestRes.data.top_riders[0];
        featured.push({
          title: bestRes.message,
          rider: best.rider_name,
          id: best.rider_id,
          riderSlug: best.riderSlug,
          flag: best.rider_country.toLowerCase(),
          speed: best.wins,
          link: "best-riders-recent-year",
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

  useEffect(() => {
    fetchRaceResults();
    fetchFeaturedRaces();
  }, [selectedYear, selectedMonth]);

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
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target)
      ) {
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch.length >= 2) {
      const delayDebounce = setTimeout(() => {
        fetchSearchSuggestions();
      }, 150);

      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchTerm, selectedYear]);

  const fetchSearchSuggestions = async () => {
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    try {
      const searchParam = `&search=${encodeURIComponent(trimmedSearch)}`;
      const yearParam =
        selectedYear !== "All-time" ? `year=${selectedYear}&` : "";

      const endpoint = `stages/getRecentStageRaceWinners?${yearParam}${searchParam}`;
      const data = await callAPI("GET", endpoint);
      // const allRaces = Array.from(
      //   new Set(
      //     (data.recent_stage_race_winners || []).map((item) => item.race_name)
      //   )
      // ).map((raceName) => ({
      //   race_name: raceName,
      // }));
      const allRaces = Array.from(
        new Map(
          (data.recent_stage_race_winners || []).map((item) => [
            item.raceSlug,
            {
              race_name: item.race_name,
              race_slug: item.raceSlug,
            },
          ])
        ).values()
      );
      
      const uniqueRaces =
        allRaces.length === 1
          ? allRaces
          : allRaces.filter(
            (race) =>
              race.race_name.toLowerCase() !== trimmedSearch.toLowerCase()
          );
      setSearchResults(uniqueRaces);
      setShowSearchDropdown(true);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchResults([]);
      setShowSearchDropdown(true);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchRaceResults("");
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    fetchRaceResults();
  };

  const handleSuggestionSelect = (result) => {
    setSearchTerm(result.race_name);
    setShowSearchDropdown(false);
    setSearchResults([]);
    router.push(`/races/${encodeURIComponent(result.race_slug)}?year=${selectedYear}`);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    fetchRaceResults("");
  };


  const handleFocus = () => {
    if (searchResults.length > 0) {
      setShowSearchDropdown(true);
    }
    if (parentRef.current) {
      parentRef.current.classList.add("active-parent");
    }
  };

  const handleBlur = () => {
    if (parentRef.current) {
      parentRef.current.classList.remove("active-parent");
    }
  };

  return (
    <>
      <Head>
        <title>Results - Cycling Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/fav-icon.svg" type="image/svg+xml" />
      </Head>
      <main className="inner-pages-main">
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
                <h1 className="fw-900 fst-italic">Results</h1>
                <div ref={parentRef} className="searchInput 222">
                  <form onSubmit={handleSearch}>
                    <div className="wraper">
                      <div className="wrap-top">
                        <input
                          type="text"
                          placeholder="welke wedstrijd zoek je?"
                          value={searchTerm}
                          onChange={handleSearchInput}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          onPaste={(e) => {
                            setTimeout(() => {
                              const pastedValue = e.target.value;
                              setSearchTerm(pastedValue);
                              if (pastedValue.trim().length >= 2) {
                                setShowSearchDropdown(true);
                              }
                            }, 10);
                          }}
                        />
                        <div className="icon">
                          <span className="search-icon" onClick={handleSearch}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={48}
                              height={48}
                              viewBox="0 0 48 48"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M39.1632 34.3632L48 43.2L43.2 48L34.3632 39.1656C30.6672 42.1224 26.6928 43.2 21.6 43.2C9.6912 43.2 0 33.5112 0 21.6C0 9.6888 9.6912 0 21.6 0C33.5088 0 43.2 9.6888 43.2 21.6C43.2 26.6904 42.1224 30.6648 39.1632 34.3632ZM21.6008 36.0008C13.6602 36.0008 7.2008 29.5414 7.2008 21.6008C7.2008 13.6623 13.6602 7.2008 21.6008 7.2008C29.5414 7.2008 36.0008 13.6623 36.0008 21.6008C36.0008 29.5414 29.5414 36.0008 21.6008 36.0008Z"
                                fill="#D0F068"
                              />
                            </svg>
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
                    {showSearchDropdown && (
                      <div className="wrap-bottom">
                        <ul>
                          {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                              <li
                                key={index}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSuggestionSelect(result);
                                }}
                              >
                                <div>
                                  <span>{result.race_name}</span>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="no-results">
                              <div>
                                <span>NO ITEMS MATCHES TO YOUR SEARCH</span>
                              </div>
                            </li>
                          )}
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
              <div className="col-lg-12 filter---wrap">
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

                  <FilterDropdown
                    ref={monthDropdownRef}
                    isOpen={showMonthDropdown}
                    toggle={() => setShowMonthDropdown(!showMonthDropdown)}
                    options={getFilteredMonths(monthInput)}
                    selectedValue={selectedMonth}
                    placeholder="Month"
                    onSelect={(value) => handleSelection("month", value)}
                    onInputChange={handleMonthInputChange}
                    loading={false}
                    includeAllOption={false}
                    classname="year-dropdown d-lg-none"
                  />

                  {months.map((month) => (
                    <li
                      key={month}
                      className={`d-none d-lg-block ${selectedMonth === month ? "active" : ""}`}
                    >
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedMonth(
                            selectedMonth === month ? "" : month
                          );
                        }}
                      >
                        {month}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-9 col-md-7 ctm-table-wrap">
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
                  <ul className="transparent-cart ctm-table-ul">
                    {raceResults.map((item, idx) => {
                      const { start, end } = convertDateRange(item?.date);
                      return (
                        <li className="hoverState-li custom-list-el" key={idx}>
                          <Link
                            href={`/races/${encodeURIComponent(
                              item.raceSlug
                            )}?year=${selectedYear}`}
                            className="pabs"
                          />
                          <span className="text-capitalize">{start}</span>
                          <h5 className="race-name-el">
                            {renderFlag(item.country_code)}
                            <Link
                              className="link"
                              href={`/races/${encodeURIComponent(item.raceSlug)}?year=${selectedYear}`}
                            >
                              <div className="text-uppercase">
                                {item.race_name}
                                {item.is_stage_race && item.stage_number
                                  ? `: STAGE ${item.stage_number}`
                                  : ""}
                              </div>

                              {item.is_stage_race && item.stage_number && (
                                <>
                                  {(item.start_location || item.finish_location) && (
                                    <span >
                                      {item.start_location}

                                      {item.start_location && item.finish_location ? " - " : ""}

                                      {item.finish_location}
                                    </span>
                                  )}

                                  {item.distance && (
                                    <span>
                                      {" ("}{item.distance} km{")"}
                                    </span>
                                  )}
                                </>
                              )}
                            </Link>


                          </h5>
                          <h6 className="rider--name">
                            {renderFlag(item.rider_country)}
                            <Link
                              className="link"
                              href={`/riders/${item?.riderSlug}`}
                            >
                              {item.rider_name}
                            </Link>
                          </h6>
                          <h6>
                            <Link
                              className="link"
                              href={`/teams/${item.teamSlug}`}
                            >{item.team_name}
                            </Link>
                          </h6>

                          <Link
                            href={`/race-result/${encodeURIComponent(
                              item.raceSlug
                            )}?stageNumber=${item.stage_number}&year=${item.year}`}
                            className="r-details"
                          >
                            <img src="/images/hover-arow.svg" alt="" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="no-results">
                    {searchTerm.trim()
                      ? `No results found for "${searchTerm}"`
                      : "No race results found"}
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
                      <Link
                        href={buildUrlWithParams(race.link)}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4 className="">{race.title}</h4>
                        <div className="name-wraper">
                          {race.flag && (
                            renderFlag(race.flag)
                          )}
                          {race.rider &&
                            <Link
                              className="link"
                              href={`/riders/${race.riderSlug}`}
                            >
                              <h6>
                                {race.rider ? <span>{race.rider}</span> : null}
                              </h6>
                            </Link>
                          }
                          {race.team &&
                            <Link
                              className="link"
                              href={`/teams/${race.teamSlug}`}
                            >
                              <h6>
                                {race.team ? <span>{race.team}</span> : null}
                              </h6>
                            </Link>
                          }
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