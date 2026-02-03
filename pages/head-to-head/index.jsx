import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getH2HData, getTeamsRiders, callAPI } from "@/lib/api";
import { useEffect, useState, useRef, useMemo } from "react";
import { ListSkeleton } from "@/components/loading&error";
import Flag from "react-world-flags";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { generateYearOptions } from "@/components/GetYear";
import { renderFlag } from "@/components/RenderFlag";

export default function HeadToHead() {
  const router = useRouter();
  const [teamRiders, setTeamRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const searchRef2 = useRef(null);
  const debounceTimerRef = useRef(null);
  const [H2HData, setH2HData] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All-time");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);
  const { withAllTime, withoutAllTime } = generateYearOptions();
  const [dynamicYears, setDynamicYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchSuggestions1, setSearchSuggestions1] = useState([]);
  const [selectedRider1, setSelectedRider1] = useState(null);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchSuggestions2, setSearchSuggestions2] = useState([]);
  const [selectedRider2, setSelectedRider2] = useState(null);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [getMatchRidersData, setGetMatchRidersData] = useState(null);
  const [isSearchLoading1, setIsSearchLoading1] = useState(false);
  const [isSearchLoading2, setIsSearchLoading2] = useState(false);

  const prevRider1IdRef = useRef(null);
  const prevRider2IdRef = useRef(null);
  const isRestoringRef = useRef(false);
  const STORAGE_KEY = 'headToHeadState';
  const saveStateToStorage = () => {
    if (isRestoringRef.current) {
      return;
    }
    try {
      const stateToSave = {
        selectedRider1,
        selectedRider2,
        searchQuery1,
        searchQuery2,
        showCompareResults,
        selectedYear,
        dynamicYears,
        H2HData,
        getMatchRidersData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Error saving state to localStorage:', err);
    }
  };

  const restoreStateFromStorage = async () => {
    isRestoringRef.current = true;
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
       
        const parsedState = JSON.parse(savedState);
        if (parsedState.selectedRider1) {
          setSelectedRider1(parsedState.selectedRider1);
          setSearchQuery1(parsedState.searchQuery1 || parsedState.selectedRider1.riderName || "");
        }
        if (parsedState.selectedRider2) {
          setSelectedRider2(parsedState.selectedRider2);
          setSearchQuery2(parsedState.searchQuery2 || parsedState.selectedRider2.riderName || "");
        }
        if (parsedState.showCompareResults && parsedState.selectedRider1 && parsedState.selectedRider2) {
          setShowCompareResults(true);
          setSelectedYear(parsedState.selectedYear || "All-time");
          if (parsedState.selectedRider1?.rider_id) {
            prevRider1IdRef.current = parsedState.selectedRider1.rider_id;
          }
          if (parsedState.selectedRider2?.rider_id) {
            prevRider2IdRef.current = parsedState.selectedRider2.rider_id;
          }
          if (parsedState.dynamicYears && parsedState.dynamicYears.length > 0) {
            setDynamicYears(parsedState.dynamicYears);
          } else {
            await fetchRidersCommonActiveYears(
              parsedState.selectedRider1.riderSlug,
              parsedState.selectedRider2.riderSlug
            );
          }
          if (parsedState.H2HData && parsedState.H2HData.length > 0 && parsedState.getMatchRidersData) {
            setH2HData(parsedState.H2HData);
            setGetMatchRidersData(parsedState.getMatchRidersData);
            setLoading(false);
            setError(null);
            if (parsedState.selectedYear) {
              setSelectedYear(parsedState.selectedYear);
            }
          } else {
            const yearToFetch = parsedState.selectedYear || "All-time";
            await fetchH2H(
              parsedState.selectedRider1.rider_id,
              parsedState.selectedRider2.rider_id,
              yearToFetch
            );
            if (yearToFetch) {
              setSelectedYear(yearToFetch);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error restoring state from localStorage:', err);
    } finally {
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 500);
    }
  };

  const clearStateFromStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing state from localStorage:', err);
    }
  };

  const handleResetAll = () => {
    setSearchQuery1("");
    setSearchQuery2("");
    setSelectedRider1(null);
    setSelectedRider2(null);
    setShowSuggestions1(false);
    setShowSuggestions2(false);
    setShowCompareResults(false);
    setH2HData([]);
    setGetMatchRidersData(null);
    setError(null);
    setSelectedYear("All-time");
    setDynamicYears([]);
    prevRider1IdRef.current = null;
    prevRider2IdRef.current = null;
    clearStateFromStorage();
  };

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

  const fetchRidersCommonActiveYears = async (riderSlug1, riderSlug2) => {
    try {
      setYearsLoading(true);
      const response = await callAPI("GET", `/h2h/${riderSlug1}/${riderSlug2}/getRidersCommonActiveYears`);

      if (response && response.data && response.data.years) {
        const years = response.data.years;
        const formattedYears = years
          .map(year => String(year))
          .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
        setDynamicYears(formattedYears);
      } else {
        setDynamicYears([]);
      }
    } catch (err) {
      console.error("Error fetching riders common active years:", err);
      setDynamicYears([]);
    } finally {
      setYearsLoading(false);
    }
  };

  const fetchH2H = async (id1, id2, year = null) => {
    setLoading(true);
    try {
      const yearToUse = year !== null ? year : selectedYear;
      const response = await getH2HData(id1, id2, yearToUse);
      if (response.status) {
        setGetMatchRidersData(response.data);
        setH2HData(response.data.data);
        setError(null);
        if (yearToUse && yearToUse !== selectedYear) {
          setSelectedYear(yearToUse);
        }
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

  const allYearOptions = dynamicYears.length > 0 ? dynamicYears : withoutAllTime;

  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      return allYearOptions;
    }
    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return allYearOptions.filter((year) =>
        year.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return allYearOptions;
  };

  const handleYearSelection = (value) => {
    const previousYear = selectedYear;
    const yearValue = value === '' ? 'All-time' : value;
    setSelectedYear(yearValue);
    setYearInput("");
    setShowYearDropdown(false);
    if (previousYear !== yearValue && showCompareResults && selectedRider1 && selectedRider2) {
      fetchH2H(selectedRider1.rider_id, selectedRider2.rider_id, yearValue);
    }
  };

  const handleYearInputChange = (value) => {
    setYearInput(value);
  };

  useEffect(() => {
    const initializeComponent = async () => {
      await fetchRiders();
      await restoreStateFromStorage();
    };

    initializeComponent();

    const handleClickOutside = (event) => {
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
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const isHeadToHead = url.startsWith('/head-to-head');
      const isRaceResult = url.startsWith('/race-result');

      if (!isHeadToHead && !isRaceResult) {
        clearStateFromStorage();
      }
    };

    router.events?.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);


  useEffect(() => {
    if (selectedRider1 || selectedRider2) {
      const timeoutId = setTimeout(() => {
        saveStateToStorage();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedRider1, selectedRider2, showCompareResults, selectedYear]);

  useEffect(() => {
    if (showCompareResults && H2HData && H2HData.length > 0 && getMatchRidersData) {
      saveStateToStorage();
    }
  }, [H2HData, getMatchRidersData, showCompareResults]);



  function convertDateRange(dateStr) {
    const monthNames = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    const capitalizeMonth = (monthName) => {
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    };

    const parse = (d) => {
      const parts = d.split(".");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parts[2] ? parts[2] : null;
      return { day, month, year };
    };

    if (dateStr.includes(" - ")) {
      const [start, end] = dateStr.split(" - ");
      const s = parse(start);
      const e = parse(end);

      const startYear = s.year ? ` '${s.year}` : "";
      const endYear = e.year ? ` ${e.year}` : "";

      if (s.month === e.month && s.year === e.year) {
        return { start: `${s.day} ${capitalizeMonth(monthNames[s.month - 1])}${startYear}`, end: null };
      } else {
        return {
          start: `${s.day} ${capitalizeMonth(monthNames[s.month - 1])}${startYear}`,
          end: `${e.day} ${capitalizeMonth(monthNames[e.month - 1])}${endYear}`,
        };
      }
    } else {
      const parts = dateStr.split(".");
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const year = parts[2] ? ` '${parts[2]}` : "";
      return { start: `${d} ${capitalizeMonth(monthNames[m - 1])}${year}`, end: null };
    }
  }

  const formatRank = (rank) => {
    if (rank === "DNF" || rank === null || rank === undefined) {
      return "DNF";
    }
    return rank;
  };

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

  const getCalculatedStats = () => {
    const filteredData = getFilteredH2HData();

    if (!filteredData || filteredData.length === 0) {
      return {
        rider1_ahead: 0,
        rider2_ahead: 0,
      };
    }

    let rider1_ahead = 0;
    let rider2_ahead = 0;

    filteredData.forEach((race) => {
      const rider1_rank = race.rider1_rank;
      const rider2_rank = race.rider2_rank;

      if (rider1_rank === "DNF" || rider1_rank === null || rider1_rank === undefined) {
        return;
      }
      if (rider2_rank === "DNF" || rider2_rank === null || rider2_rank === undefined) {
        return;
      }

      const rank1 = parseInt(rider1_rank, 10);
      const rank2 = parseInt(rider2_rank, 10);

      if (isNaN(rank1) || isNaN(rank2)) {
        return;
      }

      if (rank1 < rank2) {
        rider1_ahead++;
      } else if (rank2 < rank1) {
        rider2_ahead++;
      }
    });

    return {
      rider1_ahead,
      rider2_ahead,
    };
  };

  const calculatedStats = useMemo(() => {
    if (!showCompareResults || !getMatchRidersData) {
      return { rider1_ahead: 0, rider2_ahead: 0 };
    }

    let filteredData = [];
    if (!H2HData || !Array.isArray(H2HData)) {
      filteredData = [];
    } else if (selectedYear === "All-time" || !selectedYear) {
      filteredData = H2HData;
    } else {
      filteredData = H2HData.filter((race) => {
        const raceYear = race?.year?.toString();
        return raceYear === selectedYear;
      });
    }

    if (!filteredData || filteredData.length === 0) {
      return {
        rider1_ahead: 0,
        rider2_ahead: 0,
      };
    }

    let rider1_ahead = 0;
    let rider2_ahead = 0;

    filteredData.forEach((race) => {
      const rider1_rank = race.rider1_rank;
      const rider2_rank = race.rider2_rank;

      if (rider1_rank === "DNF" || rider1_rank === null || rider1_rank === undefined) {
        return;
      }
      if (rider2_rank === "DNF" || rider2_rank === null || rider2_rank === undefined) {
        return;
      }

      const rank1 = parseInt(rider1_rank, 10);
      const rank2 = parseInt(rider2_rank, 10);

      if (isNaN(rank1) || isNaN(rank2)) {
        return;
      }

      if (rank1 < rank2) {
        rider1_ahead++;
      } else if (rank2 < rank1) {
        rider2_ahead++;
      }
    });

    return {
      rider1_ahead,
      rider2_ahead,
    };
  }, [H2HData, selectedYear, showCompareResults, getMatchRidersData]);

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
        <div
          className="empty-state empty-msg"
          style={{ textAlign: "center", padding: "20px" }}
        >
          There are no matches found
        </div>
      );
    }

    return filteredData.map((race, index) => {
      const { start, end } = race?.date ? convertDateRange(race.date) : { start: null, end: null };
      const raceDate = race?.date?.split(".") || [];

      let year = "";
      if (race?.year) {
        year = String(race.year);
      } else if (raceDate[2]) {
        const dateYear = raceDate[2];
        if (dateYear.length === 2) {
          const yearNum = parseInt(dateYear, 10);
          year = yearNum < 50 ? `20${dateYear}` : `19${dateYear}`;
        } else {
          year = dateYear;
        }
      }

      const month = raceDate[1] || "";
      const stageNumber = race?.stage_number || "";
      const hasRaceId = race?.race_id;
      const url = hasRaceId
        ? `/race-result/${race.raceSlug}?year=${year}&month=${month}&stageNumber=${stageNumber}`
        : null;

      const columns = [];

      columns.push(
        <>
          <span className="text-capitalize date-col">
            {race?.date ? (
              <>
                {start}
                {end ? ` - ${end}` : ""}
              </>
            ) : (
              race?.year || "N/A"
            )}
          </span>
          <h5
            key="date-race"
            className={`rider--name race-name-el ${hasRaceId ? "clickable" : ""}`}
            {...(hasRaceId ? { onClick: () => router.push(url) } : {})}
          >
            {hasRaceId ? (<>
              {renderFlag(race.country)}
              <Link href={url} className="link fw-900 d-flex ">
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
                      <div className="most-dnfs-start-end head-stage-number race-title fw-900 text-uppercase d-block d-md-none ">
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
            </>
            ) : (
              <>
                {renderFlag(race.country)}
                <div>
                  <div className="race-title fw-900 text-uppercase">{race.race_name}</div>
                </div>
              </>
            )}
          </h5>
        </>
      );

      columns.push(
        <div key="rider1" className="count rank text-end">
          {formatRank(race.rider1_rank)}
        </div>
      );

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


  const handleFocus1 = () => {
    if (searchQuery1) {
      setShowSuggestions1(true);
    } else if (searchSuggestions1.length > 0) {
      setShowSuggestions1(true);
    }
    if (searchRef.current) {
      searchRef.current.classList.add("active-parent");
    }
  };

  const handleBlur1 = () => {
    if (searchRef.current) {
      searchRef.current.classList.remove("active-parent");
    }
  };

  const handleFocus2 = () => {
    if (searchQuery2) {
      setShowSuggestions2(true);
    } else if (searchSuggestions2.length > 0) {
      setShowSuggestions2(true);
    }
    if (searchRef2.current) {
      searchRef2.current.classList.add("active-parent");
    }
  };

  const handleBlur2 = () => {
    setTimeout(() => {
      if (searchRef2.current) {
        searchRef2.current.classList.remove("active-parent");
      }
      setShowSuggestions2(false);
    }, 150);
  };

  const fetchSuggestions = (query, setSuggestions, setShow, setLoading) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShow(false);
      setLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setLoading(true);
      getTeamsRiders(query)
        .then((response) => {
          if (response.status === "success") {
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
            setShow(true);
          } else {
            setSuggestions([]);
            setShow(true);
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
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
          setShow(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);
  };

  const handleSearchChange1 = (e) => {
    const query = e.target.value;
    setSearchQuery1(query);
    if (!query.trim()) {
      setSearchSuggestions1([]);
      setShowSuggestions1(false);
      setIsSearchLoading1(false);
      return;
    }
    setShowSuggestions1(true);
    fetchSuggestions(query, setSearchSuggestions1, setShowSuggestions1, setIsSearchLoading1);
  };

  const handleSearchChange2 = (e) => {
    const query = e.target.value;
    setSearchQuery2(query);
    if (!query.trim()) {
      setSearchSuggestions2([]);
      setShowSuggestions2(false);
      setIsSearchLoading2(false);
      return;
    }
    setShowSuggestions2(true);
    fetchSuggestions(query, setSearchSuggestions2, setShowSuggestions2, setIsSearchLoading2);
  };

  const handleSelectSuggestion1 = (rider) => {
    if (selectedRider1?.rider_id !== rider.rider_id && showCompareResults) {
      setShowCompareResults(false);
      setH2HData([]);
      setGetMatchRidersData(null);
      setError(null);
      prevRider1IdRef.current = null;
      prevRider2IdRef.current = null;
      if (!selectedRider2) {
        clearStateFromStorage();
      }
    }
    setSelectedRider1(rider);
    setSearchQuery1(rider.riderName);
    setShowSuggestions1(false);
  };

  const handleSelectSuggestion2 = (rider) => {
    if (selectedRider2?.rider_id !== rider.rider_id && showCompareResults) {
      setShowCompareResults(false);
      setH2HData([]);
      setGetMatchRidersData(null);
      setError(null);
      prevRider1IdRef.current = null;
      prevRider2IdRef.current = null;
      if (!selectedRider1) {
        clearStateFromStorage();
      }
    }
    setSelectedRider2(rider);
    setSearchQuery2(rider.riderName);
    setShowSuggestions2(false);
  };

  const handleClear1 = () => {
    setSearchQuery1("");
    setSelectedRider1(null);
    setShowSuggestions1(false);
    setIsSearchLoading1(false);
    setShowCompareResults(false);
    setH2HData([]);
    setGetMatchRidersData(null);
    setError(null);
    prevRider1IdRef.current = null;
    setSelectedYear("All-time");
    setDynamicYears([]);
    if (!selectedRider2) {
      clearStateFromStorage();
    } else {
      saveStateToStorage();
    }
  };

  const handleClear2 = () => {
    setSearchQuery2("");
    setSelectedRider2(null);
    setShowSuggestions2(false);
    setIsSearchLoading2(false);
    setShowCompareResults(false);
    setH2HData([]);
    setGetMatchRidersData(null);
    setError(null);
    prevRider2IdRef.current = null;
    setSelectedYear("All-time");
    setDynamicYears([]);
    if (!selectedRider1) {
      clearStateFromStorage();
    } else {
      saveStateToStorage();
    }
  };

  useEffect(() => {
    const currentRider1Id = selectedRider1?.rider_id;
    const currentRider2Id = selectedRider2?.rider_id;

    const rider1Changed = prevRider1IdRef.current !== null &&
      currentRider1Id !== null &&
      currentRider1Id !== prevRider1IdRef.current;

    const rider2Changed = prevRider2IdRef.current !== null &&
      currentRider2Id !== null &&
      currentRider2Id !== prevRider2IdRef.current;

    if ((rider1Changed || rider2Changed) && showCompareResults) {
      setShowCompareResults(false);
      setH2HData([]);
      setGetMatchRidersData(null);
      setError(null);
      setDynamicYears([]);
    }

    if (currentRider1Id && currentRider2Id && showCompareResults) {
      prevRider1IdRef.current = currentRider1Id;
      prevRider2IdRef.current = currentRider2Id;
    } else if (!currentRider1Id) {
      prevRider1IdRef.current = null;
    } else if (!currentRider2Id) {
      prevRider2IdRef.current = null;
    }
  }, [selectedRider1?.rider_id, selectedRider2?.rider_id, showCompareResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions1(false);
      }

      if (searchRef2.current && !searchRef2.current.contains(event.target)) {
        setShowSuggestions2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

                <div className={`head-to-head-section`}>
                  <form>
                    <div className="h2h-search-row">

                      <div className="h2h-search-column rider">
                        <h6 className="mb-0 mb-10px">Rider 1</h6>
                        <div className="searchInput" ref={searchRef}>

                          <div className="wraper">
                            <div className={`wrap-top `}>
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
                                    <img src="/icons/close-icon.png" alt="close-icon" />
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
                          </div>

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
                          {isSearchLoading1 && searchQuery1 && (
                            <div className="wrap-bottom">
                              <ul>
                                <li>
                                  <div style={{ textAlign: "center", padding: "10px" }}>
                                    <span>Searching...</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          )}
                          {!isSearchLoading1 && searchQuery1 && searchSuggestions1.length === 0 && showSuggestions1 && (
                            <div className="wrap-bottom">
                              <ul>
                                <li>
                                  <div style={{ textAlign: "center", padding: "10px" }}>
                                    <span>no items matches to your search</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="h2h-search-spacer">
                        <h6 className="mb-0 mt-30px">VS</h6>
                      </div>

                      <div className="h2h-search-column rider">
                        <h6 className="mb-0 mb-10px">Rider 2</h6>
                        <div className="searchInput" ref={searchRef2}>
                          <div className="wraper">
                            <div className={`wrap-top`}>
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
                                    <img src="/icons/close-icon.png" alt="close-icon" />
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
                          </div>


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
                          {isSearchLoading2 && searchQuery2 && (
                            <div className="wrap-bottom">
                              <ul>
                                <li>
                                  <div style={{ textAlign: "center", padding: "10px" }}>
                                    <span>Searching...</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          )}
                          {!isSearchLoading2 && searchQuery2 && searchSuggestions2.length === 0 && showSuggestions2 && (
                            <div className="wrap-bottom">
                              <ul>
                                <li>
                                  <div style={{ textAlign: "center", padding: "10px" }}>
                                    <span>no items matches to your search</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>


        {(selectedRider1 || selectedRider2) && (
          <>
            {!showCompareResults && (
              <section className="riders-sec1 rider-comapre-result head-head-search-val">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">

                      <div className={`rider-result-section `}>
                        <div className="rider-result-section-row">
                          <div className="rider-result-section-column">
                            {selectedRider1 && (
                              <div className="rider-result-box">
                                <h4 className="result-name text-uppercase d-flex align-items-center">
                                  {renderFlag(selectedRider1.riderCountry)}
                                  {selectedRider1.riderName}
                                </h4>
                                <span className="result-country">
                                  {selectedRider1.teamName ?? "Rider teamName"}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="rider-result-section-column">
                            {selectedRider2 && (
                              <div className="rider-result-box">
                                <h4 className="result-name text-uppercase d-flex align-items-center">
                                  {renderFlag(selectedRider2.riderCountry)}
                                  {selectedRider2.riderName}
                                </h4>
                                <span className="result-country">
                                  {selectedRider2.teamName ?? "Rider teamName"}
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>

            )}
          </>
        )}


        {!showCompareResults ? (
          <div className="h2h_btn__wrapper">
            <button
              type="button"
              className={`glob-btn green-bg-btn comapre-btn ${!selectedRider1 || !selectedRider2 ? "glob-btn-compare" : ""
                }`}
              disabled={!selectedRider1 || !selectedRider2}
              onClick={() => {
                fetchRidersCommonActiveYears(selectedRider1.riderSlug, selectedRider2.riderSlug);
                const yearToUse = selectedYear || "All-time";
                fetchH2H(selectedRider1.riderSlug, selectedRider2.riderSlug, yearToUse);
                setShowCompareResults(true);
                setSelectedYear(yearToUse);
                prevRider1IdRef.current = selectedRider1.rider_id;
                prevRider2IdRef.current = selectedRider2.rider_id;
              }}
            >
              <strong>Compare</strong>
              <span>
                <img src="/images/arow.svg" alt="" />
              </span>
            </button>
          </div>
        ) : loading ? <ListSkeleton /> : (
          (selectedRider1 && selectedRider2) && (getMatchRidersData || (H2HData && H2HData.length > 0)) && (
            <>
              <div className="container">
                <div className="rider-compare-show-result">
                  <div className="compare-result-col">
                    <h6 className="mb-10px">Rider 1</h6>
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
                                borderRadius: "5px"
                              }}
                            />
                            {selectedRider1?.riderName}
                          </>
                        )}
                      </h4>
                      <button
                        className={`d-md-none ${calculatedStats.rider1_ahead > calculatedStats.rider2_ahead ? "activeBtn" : ""}`}
                      >
                        {calculatedStats?.rider1_ahead}
                      </button>
                    </div>
                  </div>

                  <div className="compare-result-digits-col">
                    <button
                      className={calculatedStats.rider1_ahead > calculatedStats.rider2_ahead ? "activeBtn" : ""}
                    >
                      {calculatedStats?.rider1_ahead}
                    </button>

                    <button
                      className={calculatedStats.rider2_ahead > calculatedStats.rider1_ahead ? "activeBtn" : ""}
                    >
                      {calculatedStats?.rider2_ahead}
                    </button>
                  </div>

                  <div className="compare-result-col compare-result-col--last">
                    <h6 className="mb-10px text-start text-md-end w-100">Rider 2</h6>
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
                                borderRadius: "5px"
                              }}
                            />
                            {selectedRider2?.riderName}
                          </>
                        )}
                      </h4>
                      <button
                        className={`d-md-none ${calculatedStats.rider2_ahead > calculatedStats.rider1_ahead ? "activeBtn" : ""}`}
                      >
                        {calculatedStats?.rider2_ahead}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {showCompareResults && (
                <section className="home-banner riders-sec2 result-sec1 h2h-results-sec">
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="align-items-center sdsd bts__wrap">
                          <div className="col">
                            <ul className="filter mb-0">
                              <FilterDropdown
                                ref={yearDropdownRef}
                                isOpen={showYearDropdown}
                                toggle={() => setShowYearDropdown(!showYearDropdown)}
                                options={getFilteredYears(yearInput)}
                                selectedValue={selectedYear === 'All-time' ? '' : selectedYear}
                                placeholder="Year"
                                onSelect={handleYearSelection}
                                onInputChange={handleYearInputChange}
                                loading={yearsLoading}
                                includeAllOption={true}
                                allOptionText="All-time"
                                classname="year-dropdown"
                              />
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-9 col-md-12 h2h_result_section">
                        <h5 className="fw-900">Results in same race</h5>
                        <div className="slug-table-main head-to-head-main">
                          <ul className="slug-table-head head-to-head">
                            <li className="date-col">Date</li>
                            <li className="race-col">Race</li>
                            <li className="text-lg-end rider-col"><span className="d-none d-md-inline">Rider </span>1</li>
                            <li className="text-lg-end rider-col"><span className="d-none d-md-inline">Rider </span>2</li></ul>

                          <ul className="slug-table-body">
                            {renderRidersList()}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )
        )}
      </main>
    </>
  );
}
