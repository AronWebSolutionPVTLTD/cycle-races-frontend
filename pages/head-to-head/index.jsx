// pages/head-to-head/index.jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getH2HData, getTeamsRiders } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import { ListSkeleton } from "@/components/loading&error";
import Flag from "react-world-flags";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { generateYearOptions } from "@/components/GetYear";

export default function HeadToHead() {
  const router = useRouter();
  const [teamRiders, setTeamRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const [H2HData, setH2HData] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All-time");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);
  const { withoutAllTime } = generateYearOptions();

  // Head-to-head search states
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchSuggestions1, setSearchSuggestions1] = useState([]);
  const [selectedRider1, setSelectedRider1] = useState(null);
  const [showSuggestions1, setShowSuggestions1] = useState(false);

  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchSuggestions2, setSearchSuggestions2] = useState([]);
  const [selectedRider2, setSelectedRider2] = useState(null);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [getMatchRidersData, setGetMatchRidersData] = useState(null);

  // Fetch initial riders data for fallback suggestions
  const fetchRiders = async () => {
    try {
      const response = await getTeamsRiders("");
      if (response.status === "success") {
        setTeamRiders(response.data);
      }
    } catch (err) {
      console.error("Error fetching riders:", err);
    }
  };

  // Fetch head-to-head comparison data
  const fetchH2H = async (id1, id2) => {
    setLoading(true);
    try {
      const response = await getH2HData(id1, id2);
      if (response.status) {
        setGetMatchRidersData(response.data);
        setH2HData(response.data.data);
        setError(null);
      } else {
        setError(response.error || "Failed to load H2H data");
      }
    } catch (err) {
      console.error("Error fetching H2H data:", err);
      setError("An unexpected error occurred while fetching H2H data");
    } finally {
      setLoading(false);
    }
  };



  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
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

  const handleYearSelection = (value) => {
    setSelectedYear(value);
    setYearInput("");
    setShowYearDropdown(false);
  };

  const handleYearInputChange = (value) => {
    setYearInput(value);
  };

  useEffect(() => {
    fetchRiders();

    // Handle click outside for year dropdown
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clear debounce timer on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);



  // Convert date range (same as races page - always uses month names)
  function convertDateRange(dateStr) {
    const monthNames = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
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

  // Format rank display
  const formatRank = (rank) => {
    if (rank === "DNF" || rank === null || rank === undefined) {
      return "DNF";
    }
    return rank;
  };

  // Filter H2H data by selected year
  const getFilteredH2HData = () => {
    if (!H2HData || !Array.isArray(H2HData)) {
      return [];
    }
    if (selectedYear === "All-time" || !selectedYear) {
      return H2HData;
    }
    return H2HData.filter((race) => {
      const raceYear = race?.year?.toString();
      return raceYear === selectedYear;
    });
  };

  // Display H2H results list
  const renderRidersList = () => {
    if (loading) {
      return <ListSkeleton />;
    }

    if (error) {
      return (
        <li
          className="error-state"
          style={{
            textAlign: "center",
            padding: "20px",
            color: "red",
          }}
        >
          Error: {error}
        </li>
      );
    }

    const filteredData = getFilteredH2HData();

    if (!filteredData || filteredData.length === 0) {
      return (
        <li
          className="empty-state"
          style={{ textAlign: "center", padding: "20px" }}
        >
          There are no matches found
        </li>
      );
    }

    return filteredData.map((race, index) => {
      // Format date with month names (like "17 sep" or "31 May")
      const { start, end } = race?.date ? convertDateRange(race.date) : { start: null, end: null };

      // Build race URL if race_id exists
      const raceDate = race?.date?.split(".") || [];
      const year = raceDate[2] || race?.year || "";
      const month = raceDate[1] || "";
      const stageNumber = race?.stage_number || "";
      const hasRaceId = race?.race_id;
      const url = hasRaceId
        ? `/race-result/${race.race_id}?year=${year}&month=${month}&stageNumber=${stageNumber}`
        : null;

      // Build columns array for responsive design (like most-dnfs page)
      const columns = [];

      // Date and Race Name Column
      columns.push(
        <h5
          key="date-race"
          className={`rider--name race-name-el ${hasRaceId ? "clickable" : ""}`}
          {...(hasRaceId ? { onClick: () => router.push(url) } : {})}
        >
          <span className="text-capitalize">
            {race?.date ? (
              <>
                {start}
                {end ? ` - ${end}` : ""}
              </>
            ) : (
              race?.year || "N/A"
            )}
          </span>

          {hasRaceId ? (
            <Link href={url} className="link fw-900 d-flex ">
              <Flag
                code={race.country?.toUpperCase() || "XX"}
                style={{ width: "30px", height: "20px", flexShrink: 0, marginRight: "10px" }}
              />
              <div>
                <div className="race-title fw-900 text-uppercase ">
                  <span className="d-md-none">
                    {race.race_name.length > 30
                      ? `${race.race_name.slice(0, 30)}...`
                      : race.race_name}
                  </span>
                  <span className="d-none d-md-inline">{race.race_name}</span>
                  {race?.stage_number && (
                    <span className="d-none d-md-inline">
                      {`: Stage ${race.stage_number}`}
                    </span>
                  )}
                </div>
                {race?.stage_number && (
                  <>
                    <div className="most-dnfs-start-end race-title fw-900 text-uppercase d-block d-md-none ">
                      Stage {race.stage_number}
                    </div>
                    <div className="most-dnfs-start-end d-none d-md-block">
                      {race?.start_location}
                      {race?.start_location && race?.finish_location ? " - " : ""}
                      {race?.finish_location}
                      {race?.distance ? ` (${race.distance} km)` : ""}
                    </div>
                  </>
                )}
              </div>
            </Link>
          ) : (
            <>
              <Flag
                code={race.country?.toUpperCase() || "XX"}
                style={{ width: "30px", height: "20px", flexShrink: 0, marginRight: "10px" }}
              />
              <div>
                <div className="race-title fw-900 text-uppercase">{race.race_name}</div>
              </div>
            </>
          )}
        </h5>
      );

      // Rider 1 Rank Column
      columns.push(
        <div key="rider1" className="count rank text-end">
          {formatRank(race.rider1_rank)}
        </div>
      );

      // Rider 2 Rank Column
      columns.push(
        <div key="rider2" className="count rank text-end">
          {formatRank(race.rider2_rank)}
        </div>
      );

      return (
        <li
          key={`race-${index}-${race.race_id}-${race.stage_number || race.date || index}`}
          className={`content-item ctm-head-heading hoverState-li table_cols_list col--${columns.length}`}
        >
          {columns}
        </li>
      );
    });
  };


  // Rider 1 focus handling
  const handleFocus1 = () => {
    if (searchSuggestions1.length > 0) {
      setShowSuggestions1(true);
    }
    if (searchRef.current) {
      searchRef.current.classList.add("active-parent");
    }
  };

  const handleBlur1 = () => {
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.classList.remove("active-parent");
      }
      setShowSuggestions1(false);
    }, 150);
  };

  // Rider 2 focus handling
  const handleFocus2 = () => {
    if (searchSuggestions2.length > 0) {
      setShowSuggestions2(true);
    }
    if (searchRef.current) {
      searchRef.current.classList.add("active-parent");
    }
  };

  const handleBlur2 = () => {
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.classList.remove("active-parent");
      }
      setShowSuggestions2(false);
    }, 150);
  };

  // Shared suggestion generator
  const fetchSuggestions = (query, setSuggestions, setShow) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShow(false);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls (300ms)
    debounceTimerRef.current = setTimeout(() => {
      // Make API call for search results
      getTeamsRiders(query)
        .then((response) => {
          if (response.status === "success") {
            // Create suggestions from ALL riders in the API response
            const suggestions = [];
            response.data.forEach((team) => {
              if (team.riders && team.riders.length > 0) {
                team.riders.forEach((rider) => {
                  suggestions.push({
                    ...rider,
                    teamName: team.teamName,
                  });
                });
              }
            });
            setSuggestions(suggestions.slice(0, 10));
            setShow(suggestions.length > 0);
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
          // Fallback to local filtering
          const lower = query.toLowerCase();
          const localSuggestions = [];
          teamRiders.forEach((team) => {
            team.riders?.forEach((rider) => {
              if (rider.riderName.toLowerCase().includes(lower)) {
                localSuggestions.push({ ...rider, teamName: team.teamName });
              }
            });
          });
          setSuggestions(localSuggestions.slice(0, 10));
          setShow(localSuggestions.length > 0);
        });
    }, 300);
  };

  // Search handlers
  const handleSearchChange1 = (e) => {
    const query = e.target.value;
    setSearchQuery1(query);
    fetchSuggestions(query, setSearchSuggestions1, setShowSuggestions1);
  };

  const handleSearchChange2 = (e) => {
    const query = e.target.value;
    setSearchQuery2(query);
    fetchSuggestions(query, setSearchSuggestions2, setShowSuggestions2);
  };

  const handleSelectSuggestion1 = (rider) => {
    setSelectedRider1(rider);
    setSearchQuery1(rider.riderName);
    setShowSuggestions1(false);
  };

  const handleSelectSuggestion2 = (rider) => {
    setSelectedRider2(rider);
    setSearchQuery2(rider.riderName);
    setShowSuggestions2(false);
  };

  const handleClear1 = () => {
    setSearchQuery1("");
    setSelectedRider1(null);
    setShowSuggestions1(false);
    setShowCompareResults(false);
  };

  const handleClear2 = () => {
    setSearchQuery2("");
    setSelectedRider2(null);
    setShowSuggestions2(false);
    setShowCompareResults(false);
  };

  return (
    <>
      <Head>
        <title>head-to-head</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="inner-pages-main inner-riders-main ">
        <div className="dropdown-overlay"></div>

        <section className="riders-sec1 head-head-search-val">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="breadcrumb">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>head to head</li>
                </ul>
                <h1>head to head</h1>

                <section className="riders-sec2">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 col-md-7 ctm-table-wrap">
                        <ul className="row head-heading ctm-table-ul">
                          <li>Rider 1</li>
                          <li>Rider 2</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <div className={`searchInput head-to-head-section`} ref={searchRef}>
                  <form>
                    <div className="row wraper align-items-center">

                      {/* Rider 1 */}
                      <div className="col-12 col-md rider">
                        <h6 className="d-lg-none">Rider 1</h6>

                        <div className={`wrap-top searchInput ${showSuggestions1 ? "open" : ""}`}>
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery1}
                            onChange={handleSearchChange1}
                            onFocus={handleFocus1}
                            onBlur={handleBlur1}
                          />

                          <div className="icon">
                            {searchQuery1 ? (
                              <span className="clear-icon" onClick={handleClear1}>
                                ✖
                              </span>
                            ) : (
                              <span className="search-icon">
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
                            )}
                          </div>
                        </div>

                        {/* Suggestions */}
                        {showSuggestions1 && searchSuggestions1.length > 0 && (
                          <div className="wrap-bottom">
                            <ul>
                              {searchSuggestions1.map((rider, idx) => (
                                <li
                                  key={`suggestion1-${idx}-${rider.teamName}-${rider.rider_id || rider._id || rider.riderName}`}
                                  onClick={() => handleSelectSuggestion1(rider)}
                                >
                                  <div>
                                    <span>{`${rider.riderName} (${rider.teamName})`}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>


                      {/* VS */}
                      <div className="col-12 col-md-auto text-center mt-5 my-lg-0 flex align-item-center justify-content-center">
                        <h6>VS</h6>
                      </div>

                      {/* Rider 2 */}
                      <div className="col-12 col-md rider">
                        <h6 className="d-lg-none">Rider 2</h6>

                        <div className={`wrap-top searchInput ${showSuggestions2 ? "open" : ""}`}>
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery2}
                            onChange={handleSearchChange2}
                            onFocus={handleFocus2}
                            onBlur={handleBlur2}
                          />

                          <div className="icon">
                            {searchQuery2 ? (
                              <span className="clear-icon" onClick={handleClear2}>
                                ✖
                              </span>
                            ) : (
                              <span className="search-icon">
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
                            )}
                          </div>
                        </div>

                        {/* Rider 2 Suggestions */}
                        {showSuggestions2 && searchSuggestions2.length > 0 && (
                          <div className="wrap-bottom">
                            <ul>
                              {searchSuggestions2.map((rider, idx) => (
                                <li
                                  key={`suggestion2-${idx}-${rider.teamName}-${rider.rider_id || rider._id || rider.riderName}`}
                                  onClick={() => handleSelectSuggestion2(rider)}
                                >
                                  <div>
                                    <span>{`${rider.riderName} (${rider.teamName})`}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>


                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Compare and result section */}
        {(selectedRider1 || selectedRider2) && (
          <section className="riders-sec1 rider-comapre-result head-head-search-val">
            <div className="shape"></div>
            {!showCompareResults && (
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">

                    <div className={`searchInput head-to-head-section`}>
                      <div className="row wraper align-items-center">

                        {/* Rider 1 */}
                        <div className="col-12 col-md-5 col-lg-4 rider">
                          {selectedRider1 && (
                            <div className="rider-result-box">
                              <h4 className="result-name text-uppercase d-flex align-items-center">
                                <Flag
                                  code={selectedRider1.riderCountry?.toUpperCase()}
                                  style={{
                                    width: "30px",
                                    height: "20px",
                                    marginRight: "10px",
                                    flexShrink: 0,
                                  }}
                                />
                                {selectedRider1.riderName}
                              </h4>
                              <span className="result-country">
                                {selectedRider1.country_name ?? "Rider country"}
                              </span>
                            </div>
                          )}
                        </div>


                        <div className="col-12 col-md-2 col-lg-4 text-center my-3 my-md-0" />

                        {/* Rider 2 */}
                        <div className="col-12  col-md-5 col-lg-4 rider">
                          {selectedRider2 && (
                            <div className="rider-result-box">
                              <h4 className="result-name text-uppercase d-flex align-items-center">
                                <Flag
                                  code={selectedRider2.riderCountry?.toUpperCase()}
                                  style={{
                                    width: "30px",
                                    height: "20px",
                                    marginRight: "10px",
                                    flexShrink: 0,
                                  }}
                                />
                                {selectedRider2.riderName}
                              </h4>
                              <span className="result-country">
                                {selectedRider2.country_name ?? "Rider country"}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}


            {/* Compare button or desktop summary row */}
            {!showCompareResults ? (
              <div className="d-flex justify-content-center mb-5">
                <button
                  type="button"
                  className={`glob-btn green-bg-btn comapre-btn ${!selectedRider1 || !selectedRider2 ? "glob-btn-compare" : ""
                    }`}
                  disabled={!selectedRider1 || !selectedRider2}
                  onClick={() => {
                    fetchH2H(selectedRider1.rider_id, selectedRider2.rider_id);
                    setShowCompareResults(true);
                  }}
                >
                  <strong>Compare</strong>
                  <span>
                    <img src="/images/arow.svg" alt="" />
                  </span>
                </button>
              </div>
            ) : (
              (selectedRider1 || selectedRider2) && getMatchRidersData && (
                <div className="container">
                  <div className="row mb-3 pt-3 pt-md-5 rider-compare-show-result">
                    {/* Rider 1 */}
                    <div className="col-12 col-md-5 mb-3 mb-md-0">
                      <h6 className="mb-2">Rider 1</h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 className="text-uppercase d-flex align-items-center fw-900 mb-0">
                          {selectedRider1 && (
                            <>
                              <Flag
                                code={selectedRider1?.riderCountry?.toUpperCase()}
                                style={{
                                  width: "30px",
                                  height: "20px",
                                  marginRight: "10px",
                                  flexShrink: 0,
                                }}
                              />
                              {selectedRider1?.riderName}
                            </>
                          )}
                        </h4>
                        {/* Button for Rider 1 - shown on mobile, hidden on desktop */}
                        <button
                          className={`d-md-none ${getMatchRidersData.rider1_ahead > getMatchRidersData.rider2_ahead ? "activeBtn" : ""}`}
                        >
                          {getMatchRidersData?.rider1_ahead}
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-md-2 text-center btns d-none d-md-flex align-items-center justify-content-center gap-2  mb-3 mb-md-0">
                      <button
                        className={getMatchRidersData.rider1_ahead > getMatchRidersData.rider2_ahead ? "activeBtn" : ""}
                      >
                        {getMatchRidersData?.rider1_ahead}
                      </button>

                      {/* Button for Rider 2 */}
                      <button
                        className={getMatchRidersData.rider2_ahead > getMatchRidersData.rider1_ahead ? "activeBtn" : ""}
                      >
                        {getMatchRidersData?.rider2_ahead}
                      </button>
                    </div>

                    {/* Rider 2 */}
                    <div className="col-12 col-md-5 d-flex flex-column align-items-start align-items-md-end">
                      <h6 className="mb-2 text-start text-md-end w-100">Rider 2</h6>
                      <div className="w-100 d-flex align-items-center justify-content-between justify-content-md-end">
                        <h4 className="text-uppercase d-flex align-items-center fw-900 mb-0 justify-content-start justify-content-md-end">
                          {selectedRider2 && (
                            <>
                              <Flag
                                code={selectedRider2?.riderCountry?.toUpperCase()}
                                style={{
                                  width: "30px",
                                  height: "20px",
                                  marginRight: "10px",
                                  flexShrink: 0,
                                }}
                              />
                              {selectedRider2?.riderName}
                            </>
                          )}
                        </h4>
                        {/* Button for Rider 2 - shown on mobile, hidden on desktop */}
                        <button
                          className={`d-md-none ${getMatchRidersData.rider2_ahead > getMatchRidersData.rider1_ahead ? "activeBtn" : ""}`}
                        >
                          {getMatchRidersData?.rider2_ahead}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}


          </section>
        )}



        {/* Show list of compare results */}
        {showCompareResults && (
          <section className="home-banner riders-sec2 result-sec1">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {/* Filter Dropdown */}
                  <div className="row align-items-center sdsd bts__wrap mb-3">
                    <div className="col">
                      <ul className="filter">
                        <FilterDropdown
                          ref={yearDropdownRef}
                          isOpen={showYearDropdown}
                          toggle={() => setShowYearDropdown(!showYearDropdown)}
                          options={getFilteredYears(yearInput)}
                          selectedValue={selectedYear}
                          placeholder="Year"
                          onSelect={handleYearSelection}
                          onInputChange={handleYearInputChange}
                          loading={false}
                          includeAllOption={true}
                          allOptionText="All-time"
                          classname="year-dropdown"
                        />
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <h5 className="fw-900">Result in same race</h5>

                </div>

                <div className="col-lg-9 col-md-9">






                  <div className="slug-table-main mt-4 mb-5">
                    <ul className="slug-table-head head-to-head">
                      <li style={{
                      flex: '0 0 70px',
                    }}>Date</li><li>Race</li><li className="text-lg-end" style={{
                      flex: '0 0 10%',
                    }}><span className="d-none d-md-inline">Rider </span>1</li><li className="text-lg-end" style={{
                      flex: '0 0 10%',
                    }}><span className="d-none d-md-inline">Rider </span>2</li></ul>

                    <ul className="slug-table-body">
                      {renderRidersList()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
