import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { callAPI } from "@/lib/api";
import Flag from "react-world-flags";
import Link from "next/link";
import { generateYearOptions } from "@/components/GetYear";
import {
  CardSkeleton,
  ErrorStats,
  ListSkeleton,
} from "@/components/loading&error";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { renderFlag } from "@/components/RenderFlag";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { year, month, stageNumber, tab } = context.query;

  return {
    props: {
      id,
      year: year || new Date().getFullYear().toString(),
      month: month || "",
      stageNumber: stageNumber || "",
      tab: tab || "",
    },
  };
}


export default function RaceResultPage({ year, month, stageNumber, tab }) {
  const router = useRouter();
  const { id } = router.query;
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [race, setRace] = useState(null);
  const [raceName, setRaceName] = useState(null); // Store race name separately
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStageData, setIsLoadingStageData] = useState(false); // Separate loading state for stage data
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(year);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  // const [searchResults, setSearchResults] = useState([]);

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);

  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [stageInput, setStageInput] = useState("");
  const stageDropdownRef = useRef(null);

  const [featuredStats, setFeaturedStats] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const { withoutAllTime } = generateYearOptions();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStage, setSelectedStage] = useState(stageNumber || "");

  useEffect(() => {
    // Convert "01" to 0 index, "02" to 1, etc.
    const index = parseInt(month, 10) - 1;
    setSelectedMonth(months[index]);
  }, [month]);

  useEffect(() => {
    // Update selected stage when URL parameter changes
    setSelectedStage(stageNumber || "");
  }, [stageNumber]);
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

  const getStageOptions = () => {
    if (!race?.is_stage_race || !race?.stages || race.stages.length === 0) {
      return [];
    }
    return race.stages.map((stage) => 
      (stage.stage_type === "Final GC" || stage.is_gc)
        ? "Final GC"
        : `Stage ${stage.stage_number}`
    );
  };

  const getFilteredStages = (searchValue) => {
    const stages = getStageOptions();
    if (!searchValue || searchValue.trim() === '') {
      return stages;
    }
    return stages.filter((stage) =>
      stage.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput("");
        setShowYearDropdown(false);
        // Update URL with new year
        const params = new URLSearchParams();
        params.set("year", value);
        if (selectedMonth) {
          params.set("month", getMonthNumber(selectedMonth).toString());
        }
        if (selectedStage) {
          params.set("stageNumber", selectedStage);
        }
        if (tab) {
          params.set("tab", tab);
        }
        router.push(`/race-result/${id}?${params.toString()}`, undefined, { shallow: false });
        break;
      case "stage":
        // Find the stage object to determine stage number and tab
        const selectedStageObj = race?.stages?.find(
          (s) => value === "Final GC" 
            ? (s.stage_type === "Final GC" || s.is_gc)
            : `Stage ${s.stage_number}` === value
        );
        
        // Get stage number from the found stage object
        const stageNum = selectedStageObj?.stage_number?.toString() || 
          (value.startsWith("Stage ") ? value.replace("Stage ", "") : value);
        
        // Determine tab name based on stage type
        const tabName = (selectedStageObj?.stage_type === "Final GC" || selectedStageObj?.is_gc)
          ? "gc"
          : "stage";
        
        setSelectedStage(stageNum);
        setStageInput("");
        setShowStageDropdown(false);
        // Update URL with new stage and tab
        const stageParams = new URLSearchParams();
        stageParams.set("year", selectedYear);
        if (selectedMonth) {
          stageParams.set("month", getMonthNumber(selectedMonth).toString());
        }
        if (stageNum) {
          stageParams.set("stageNumber", stageNum);
        }
        stageParams.set("tab", tabName);
        router.push(`/race-result/${id}?${stageParams.toString()}`, undefined, { shallow: false });
        break;
    }
  };
  const handleYearInputChange = (value) => {
    setYearInput(value);
  };

  const handleStageInputChange = (value) => {
    setStageInput(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
      if (
        stageDropdownRef.current &&
        !stageDropdownRef.current.contains(event.target)
      ) {
        setShowStageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Convert month name to number (1-12)
  const getMonthNumber = (monthName) => {
    return months.findIndex((month) => month === monthName) + 1;
  };

  const fetchRaceDetails = async (raceId, isInitialLoad = false) => {
    // Only set main loading state on initial load
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      // For stage changes, use separate loading state
      setIsLoadingStageData(true);
    }
    setError(null);
    try {
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const stageParam = selectedStage ? `&stageNumber=${selectedStage}` : "";
      
      // Determine tab name based on selected stage type and router query
      const currentTab = router.query.tab || tab;
      const selectedStageObj = race?.stages?.find(
        (s) => {
          const matchesStageNumber = s.stage_number.toString() === selectedStage;
          const isFinalGC = s.stage_type === "Final GC" || s.is_gc;
          // If we have a tab in query, use it to find the correct stage
          if (currentTab === "gc") {
            return matchesStageNumber && isFinalGC;
          } else if (currentTab === "stage") {
            return matchesStageNumber && !isFinalGC;
          }
          // Fallback: find by stage number and use the stage's own type
          return matchesStageNumber;
        }
      );
      const tabName = (selectedStageObj?.stage_type === "Final GC" || selectedStageObj?.is_gc)
        ? "gc"
        : (currentTab || "stage");
      
      const response = await callAPI(
        "GET",
        `/raceDetailsStats/${raceId}/getRaceDetails?year=${selectedYear}${monthParam}${stageParam}&tabName=${tabName}`
      );
      if (response?.data) {
        setRace(response.data);
        // Store race name separately on initial load or if it's not already set
        if (isInitialLoad || !raceName) {
          setRaceName(response.data.race_name);
        }
        await fetchFeaturedStats(raceId);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      setError(err || "Failed to load race data");
      setError("Failed to load race data. Please try again later.");
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingStageData(false);
      }
    }
  };

  const fetchFeaturedStats = async (raceId) => {
    setLoadingFeatured(true);
    setErrorFeatured(null);
    try {
      // Fetch all stats in parallel
      const [winnersByNationality, oldestRider, youngestRider, bestTeam] =
        await Promise.all([
          callAPI("GET", `/stages/${raceId}/getRaceWinnersByNationality?year=${selectedYear}`),
          callAPI("GET", `/stages/${raceId}/getOldestRiderInRace?year=${selectedYear}`),
          callAPI("GET", `/stages/${raceId}/getYoungestRiderInRace?year=${selectedYear}`),
          callAPI("GET", `/stages/${raceId}/getBestTeamInRace?year=${selectedYear}`),
        ]);
     const stats = [];

      // Add winners by nationality if available
      if (winnersByNationality?.data?.data?.length > 0) {
        const topNationality = winnersByNationality?.data?.data?.[0];
        stats.push({
          title: winnersByNationality?.message || "Top Nationality",
          rider: topNationality?.country_name,
          flag: topNationality?.country_code?.toLowerCase(),
          value: topNationality?.wins,
          unit: "wins",
          link: "winning-nationality-for-this-race",
        });
      }

      // Add oldest rider if available
      if (
        oldestRider?.data?.data?.length > 0 ||
        oldestRider?.data?.riders?.length > 0
      ) {
        const oldestData =
          oldestRider?.data?.data?.[0] || oldestRider?.data?.riders?.[0];
        stats.push({
          title: oldestRider?.message || "Oldest Rider",
          rider: oldestData?.rider_name || oldestData?.name,
          riderId: oldestData?.rider_id,
          flag:
            oldestData?.rider_country?.toLowerCase() ||
            oldestData?.country?.toLowerCase(),
          value: oldestData?.age,
          unit: "jaar",
          link: "oldest-riders-in-race",
        });
      }

      // Add youngest rider if available
      if (
        youngestRider?.data?.data?.length > 0 ||
        youngestRider?.data?.riders?.length > 0
      ) {
        const youngestData =
          youngestRider?.data?.data?.[0] || youngestRider?.data?.riders?.[0];
        stats.push({
          title: youngestRider?.message || "Youngest Rider",
          rider: youngestData?.rider_name || youngestData?.name,
          riderId: youngestData?.rider_id,
          flag:
            youngestData?.rider_country?.toLowerCase() ||
            youngestData?.country?.toLowerCase(),
          value: youngestData?.age,
          unit: "jaar",
          link: "youngest-riders-in-race",
        });
      }

      // Add best team if available
      if (bestTeam?.data?.data?.length > 0) {
        const bestTeamData = bestTeam.data.data[0];
        stats.push({
          title: bestTeam?.message || "Best Team",
          rider: bestTeamData?.team_name || bestTeamData?.name,
          teamId: bestTeamData?.team_name || bestTeamData?.name,
          flag:
            bestTeamData?.country_code?.toLowerCase() ||
            bestTeamData?.team_country?.toLowerCase() ||
            "/images/team-icon.svg",
          value:
            bestTeamData?.rider_count ||
            bestTeamData?.performance_score ||
            bestTeamData?.score,
          unit: bestTeamData?.rider_count ? "riders" : "points",
          link: "best-teams-in-the-race",
        });
      }

      setFeaturedStats(stats);
    } catch (err) {
      console.error("Error fetching featured stats:", err);
      setErrorFeatured("Failed to load race data . Please try again later.");
      setFeaturedStats([]);
    } finally {
      setLoadingFeatured(false);
    }
  };
  console.log(featuredStats);

  // Fetch race details when router is ready, id changes, year changes, stage changes, or tab changes
  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      if (typeof id === "string") {
        // Determine if this is initial load (no race data yet)
        const isInitialLoad = !raceName;
        fetchRaceDetails(id, isInitialLoad);
      }
    }
  }, [router.isReady, id, selectedYear, selectedStage, router.query.tab]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const convertTimeToSeconds = (timeStr) => {
    if (!timeStr) return null; // return null if no time
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const formatTimeToDisplay = (timeStr) => {
    if (!timeStr) return "";
    const [h, m, s] = timeStr.split(":").map((str) => parseInt(str, 10));
    return `${h}h${m.toString().padStart(2, "0")}${s
      .toString()
      .padStart(2, "0")}`;
  };

  const buildQueryParams = () => {
    const params = {
      raceId: id,
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

    const basePath = `/race-result/${id}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const handleStageClick = (stage) => {
    // Determine tab name based on stage type
    const tabName = (stage?.stage_type === "Final GC" || stage?.is_gc)
      ? "gc"
      : "stage";
    
    const stageNum = stage.stage_number;
    setSelectedStage(stageNum.toString());
    const params = new URLSearchParams();
    params.set("year", selectedYear);
    if (selectedMonth) {
      params.set("month", getMonthNumber(selectedMonth).toString());
    }
    if (stageNum) {
      params.set("stageNumber", stageNum.toString());
    }
    params.set("tab", tabName);
    router.push(`/race-result/${id}?${params.toString()}`, undefined, { shallow: false });
  };
  const getTimeGapDisplay = (baseTime, compareTime) => {
    if (!baseTime || !compareTime) return "";

    const base = convertTimeToSeconds(baseTime);
    const compare = convertTimeToSeconds(compareTime);

    if (base === null || compare === null) return "";

    const diff = compare - base;

    // Always show time, even if diff === 0 (same time)
    if (diff <= 0) return formatTimeToDisplay(compareTime);

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return minutes > 0 ? `+${minutes}'${seconds}"` : `+${seconds}"`;
  };
  
  return (
    <main className="inner-pages-main race-result-main">
      <div className="dropdown-overlay"></div>
      <section className="riders-sec1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">home</Link>
                </li>
                <li>
                  <Link href="/races">race</Link>
                </li>
                <li>{raceName || race?.race_name || "Race"}</li>
              </ul>
              {isLoading && !raceName ? (
                <h3 className="text-center my-4">Loading...</h3>
              ) : (
                <h1>{(raceName || race?.race_name || "").toUpperCase()}</h1>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="home-banner result-sec1 race-result-page sdsdssd">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 filter---wrap filter---wrap-race-result filter---wrapper align-items-end  ">
              <div className="d-flex flex-wrap gap-2 align-items-start ctm_fliter_wrap">
             {/* Year Dropdown */}
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

                  {/* Desktop Stages Navigation */}
                {race?.is_stage_race && race?.stages && race.stages.length > 0 && (
                  <>
                   <FilterDropdown
                      ref={stageDropdownRef}
                      isOpen={showStageDropdown}
                      toggle={() => setShowStageDropdown(!showStageDropdown)}
                      options={getFilteredStages(stageInput)}
                      selectedValue={
                        selectedStage 
                          ? (() => {
                              const currentTab = router.query.tab || tab || "";
                              const currentStage = race?.stages?.find(
                                (s) => {
                                  const matchesStageNumber = s.stage_number.toString() === selectedStage;
                                  const isFinalGC = s.stage_type === "Final GC" || s.is_gc;
                                  // If we have a tab in query, use it to find the correct stage
                                  if (currentTab === "gc") {
                                    return matchesStageNumber && isFinalGC;
                                  } else if (currentTab === "stage") {
                                    return matchesStageNumber && !isFinalGC;
                                  }
                                  // Fallback: find by stage number and use the stage's own type
                                  return matchesStageNumber;
                                }
                              );
                              return (currentStage?.stage_type === "Final GC" || currentStage?.is_gc)
                                ? "Final GC"
                                : `Stage ${selectedStage}`;
                            })()
                          : ""
                      }
                      placeholder="Stage"
                      onSelect={(value) => handleSelection("stage", value)}
                      onInputChange={handleStageInputChange}
                      loading={false}
                      includeAllOption={false}
                      classname="year-dropdown d-xl-none"
                    />
                    
                    {race.stages.map((stage) => {
                      // Check if this stage is active based on stage_number, stage_type/is_gc, and tab
                      const isFinalGC = stage.stage_type === "Final GC" || stage.is_gc;
                      const currentTab = router.query.tab || tab || "";
                      const isActive = selectedStage && parseInt(selectedStage) === stage.stage_number && 
                        ((isFinalGC && currentTab === "gc") || (!isFinalGC && (currentTab === "stage" || currentTab === "")));
                      
                      return (
                        <li key={`${stage.stage_number}-${stage.is_gc ? 'gc' : 'stage'}`} className={`d-none d-lg-block ${isActive ? "active" : ""}`}>
                          <Link 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleStageClick(stage);
                          }}>
                            {(stage.stage_type === "Final GC" || stage.is_gc)
                          ? <span>Final GC</span>
                          : <span>Stage {stage.stage_number}</span>}
                          </Link>
                        </li>
                        // <button
                        //   key={`${stage.stage_number}-${stage.is_gc ? 'gc' : 'stage'}`}
                        //   onClick={() => handleStageClick(stage)}
                        //   className={`stage-button d-xl-inline-flex d-none ${isActive ? "active" : ""}`}
                        //   style={{
                        //     padding: "0.72rem 0.75rem 0.6875rem",
                        //     borderRadius: "3.75rem",
                        //     border: "none",
                        //     backgroundColor: isActive ? "#2b534d" : "#fff",
                        //     color: isActive ? "#f7f6f0" : "#2b534d",
                        //     fontFamily: "Roboto",
                        //     fontSize: "1rem",
                        //     fontWeight: 500,
                        //     lineHeight: "1.125rem",
                        //     letterSpacing: "-0.022rem",
                        //     cursor: "pointer",
                        //     transition: "all 0.3s ease",
                        //     whiteSpace: "nowrap",
                        //     display: "inline-flex",
                        //     alignItems: "center",
                        //     justifyContent: "center",
                        //     flex: "0 0 auto"
                        //   }}
                        // >
                        //   {(stage.stage_type === "Final GC" || stage.is_gc)
                        //   ? <span>Final GC</span>
                        //   : <span>Stage {stage.stage_number}</span>}
                        // </button>
                      );
                    })}
                    </>
                )}
                </ul>
                
                
                </div>
             
              <div className="col text-end">
                <Link className="glob-btn green-bg-btn"
                  href={`/races/${encodeURIComponent(id)}`}

                >
                  <strong>ALLE STATS</strong>
                  <span className="green-circle-btn green-circle-btn-2">
                    <img alt="" src="/images/arow.svg" />
                  </span>
                </Link>
              </div>
              {/* <div className="select-box sdsdsdsdsd">
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
                <select className="qqqqqq" value={selectedMonth} onChange={handleMonthChange}>
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div> */}

            </div>

            <div className="col-lg-9 col-md-7 ctm-table-wrap ctm-race-result-wrap">
              <ul className="head-heading ctm-race-result-head">
                <li className="name">Name</li>
                <li className="team">Team</li>
                <li className="time">Time</li>
              </ul>

              {(isLoading || isLoadingStageData) || !isRouterReady ? (
                <div className="loading-spinner">
                  <ListSkeleton />
                </div>
              ) : error ? (
                <div className="col-12">
                  <ErrorStats message={error} />
                </div>
              ) : race.riders.length > 0 ? (
                <ul className="transparent-cart ctm-table-ul">
                  {race.riders
                    ?.sort((a, b) => a.rank - b.rank)
                    // .slice(0, 50)
                    .map((rider, index) => (
                      <li className="hoverState-li custom-list-el race-result-ctm-el" key={index}>
                        <Link href={`/riders/${rider.rider_id}`} className="pabs" />
                        <h5 className="rider--name fw-900">
                          <span className="race-result-index fw-900">{index + 1}.</span>
                          {renderFlag(rider.rider_country)}
                          <Link href={`/riders/${rider.rider_id}`} className="link">
                           {rider.rider_name.toUpperCase()}
                          </Link>
                        </h5>
                        <h6 className="team_name">   <Link href={`/teams/${rider.team_name}`} className="link">{rider.team_name}</Link></h6>
                        <h6 className="time-result">
                          {/* {index === 0
                            ? formatTimeToDisplay(rider.time)
                            : getTimeGapDisplay(
                                race.riders[0]?.time,
                                rider.time
                              )} */}
                          {rider.time}
                        </h6>
                        {/* <Link
                          href={`/riders/${rider.rider_id}`}
                          className="r-details"
                        >
                          <img src="/images/hover-arow.svg" alt="Details" />
                        </Link> */}
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-center">No race results found</div>
              )}
            </div>

            <div className="col-lg-3 col-md-5 111">
              {loadingFeatured ? (
                <div className="loading-spinner">
                  <CardSkeleton />
                </div>
              ) : errorFeatured ? (
                <div className="col-12">
                  <ErrorStats message={errorFeatured} />
                </div>
              ) : featuredStats.length > 0 ? (
                featuredStats.map((stat, index) => (
                  <div className="team-cart" key={index}>
                    <Link href={buildUrlWithParams(stat.link)} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">{stat.title}</h4>
                      <div className="name-wraper">
                        {renderFlag(stat.flag)}
                      
                        {/* <h6 onClick={() => router.push(`/riders/${stat.id}`)} className="link">{stat.rider}</h6> */}
                        {stat.riderId ?
                          <Link
                          className="link"
                          href={`/riders/${stat.riderId}`}
                        >
                         <h6>
                          {stat.rider ? <span>{stat.rider}</span> : null}
                         </h6>
                         </Link>
                         :
                         stat.teamId ?
                         <Link
                         className="link"
                         href={`/teams/${stat.rider}`}
                       >
                        <h6>
                         {stat.rider ? <span>{stat.rider}</span> : null}
                        </h6>
                        </Link>
                        :
                       <h6>{stat.rider}</h6>
                         }
                      </div>
                    </div>
                    <h5>
                      <strong>{stat.value}</strong>
                      {stat.unit && ` ${stat.unit}`}
                    </h5>

                    <Link
                      href={buildUrlWithParams(stat.link)}
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
  );
}

