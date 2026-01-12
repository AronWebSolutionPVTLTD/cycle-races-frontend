import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { callAPI } from "@/lib/api";
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
  const [raceName, setRaceName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStageData, setIsLoadingStageData] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(year);
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
    const index = parseInt(month, 10) - 1;
    setSelectedMonth(months[index]);
  }, [month]);

  useEffect(() => {
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
        const selectedStageObj = race?.stages?.find(
          (s) => value === "Final GC"
            ? (s.stage_type === "Final GC" || s.is_gc)
            : `Stage ${s.stage_number}` === value
        );

        const stageNum = selectedStageObj?.stage_number?.toString() ||
          (value.startsWith("Stage ") ? value.replace("Stage ", "") : value);

        const tabName = (selectedStageObj?.stage_type === "Final GC" || selectedStageObj?.is_gc)
          ? "gc"
          : "stage";

        setSelectedStage(stageNum);
        setStageInput("");
        setShowStageDropdown(false);
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

  const getMonthNumber = (monthName) => {
    return months.findIndex((month) => month === monthName) + 1;
  };

  const fetchRaceDetails = async (raceId, isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsLoadingStageData(true);
    }
    setError(null);
    try {
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const stageParam = selectedStage ? `&stageNumber=${selectedStage}` : "";

      const currentTab = router.query.tab || tab;
      const selectedStageObj = race?.stages?.find(
        (s) => {
          const matchesStageNumber = s.stage_number.toString() === selectedStage;
          const isFinalGC = s.stage_type === "Final GC" || s.is_gc;
          if (currentTab === "gc") {
            return matchesStageNumber && isFinalGC;
          } else if (currentTab === "stage") {
            return matchesStageNumber && !isFinalGC;
          }
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
      const [winnersByNationality, oldestRider, youngestRider, bestTeam] =
        await Promise.all([
          callAPI("GET", `/stages/${raceId}/getRaceWinnersByNationality?year=${selectedYear}`),
          callAPI("GET", `/stages/${raceId}/getOldestRiderInRace?year=${selectedYear}`),
          callAPI("GET", `/stages/${raceId}/getYoungestRiderInRace?year=${selectedYear}`),
          callAPI("GET", `/stages/${raceId}/getBestTeamInRace?year=${selectedYear}`),
        ]);
      const stats = [];

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
          value: "",
          unit: "",
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

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      if (typeof id === "string") {
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
    if (!timeStr) return null;
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
                                  if (currentTab === "gc") {
                                    return matchesStageNumber && isFinalGC;
                                  } else if (currentTab === "stage") {
                                    return matchesStageNumber && !isFinalGC;
                                  }
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
                          {rider.time}
                        </h6>
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

