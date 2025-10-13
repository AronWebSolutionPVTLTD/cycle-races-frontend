import { generateYearOptions } from "@/components/GetYear";
import { ErrorStats, Loading, LoadingStats } from "@/components/loading&error";
import MultipleStageRace from "@/components/race_detail/multiple-stage-race";
import OneDayRace from "@/components/race_detail/one-day-race";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { callAPI } from "@/lib/api";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Flag from "react-world-flags";

export async function getServerSideProps(context) {
  const { year, month } = context.query;

  return {
    props: {
      year: year || "All-time",
    },
  };
}

export default function RaceDetailsPage({ year }) {
  const router = useRouter();
  const { name } = router.query;

  // State management
  const [selectedYear, setSelectedYear] = useState(year);
  const [yearInput, setYearInput] = useState('');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState("All-Nationalities");

  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Data states
  const [nationalities, setNationalities] = useState([]);
  const [raceData, setRaceData] = useState(null);

  // Loading states - separated for better UX
  const [isLoadingRace, setIsLoadingRace] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  // Error state
  const [error, setError] = useState(null);
  const yearDropdownRef = useRef(null);
  const nationalityDropdownRef = useRef(null);
  const [dynamicYears, setDynamicYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(false);

  // Memoized values
  const decodedRaceName = useMemo(
    () => (name ? decodeURIComponent(name) : ""),
    [name]
  );

  // const filteredYears = useMemo(() => {
  //   return withAllTime.filter((year) =>
  //     year.toLowerCase().includes((yearInput || "").toLowerCase())
  //   );
  // }, [withAllTime, yearInput]);

  const { withoutAllTime } = generateYearOptions();
  const allYearOptions = dynamicYears.length > 0 ? ["All-time", ...dynamicYears] : ["All-time"];
const allNationalityOptions = useMemo(() => {
 return ["All-Nationalities", ...nationalities];
}, [nationalities]);

  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      return allYearOptions;
    }


    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return dynamicYears.filter((year) =>
        year.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return allYearOptions.filter((year) =>
      year.toLowerCase().includes(searchValue.toLowerCase())
    );

    // return withoutAllTime;
  };

  // Fetch nationalities and teams based on filters
  const fetchFiltersData = useCallback(async () => {
    if (!decodedRaceName) return;

    try {
      setIsLoadingFilters(true);
      const queryParams = {};
      // if (selectedNationality) queryParams.q_country = selectedNationality;
      // Only add nationality to query if it's not "All-Nationalities"
    if (selectedNationality && selectedNationality !== "All-Nationalities") {
      queryParams.nationality = selectedNationality;
      console.log(queryParams,"parama")
    }
      if (selectedYear && selectedYear !== "All-time") queryParams.q_year = selectedYear;

      const response = await callAPI(
        "GET",
        "/teams/getAllTeamsForFilters",
        queryParams
      );

      if (response.status && response.data) {
        setNationalities(response.data.rider_countries || []);
      }
    } catch (error) {
      console.error("Error fetching filters data:", error);
    } finally {
      setIsLoadingFilters(false);
    }
  }, [selectedNationality, decodedRaceName]);


  // Fetch active years for the rider
  const fetchRaceActiveYears = async (raceName) => {

    try {
      setYearsLoading(true);
      const response = await callAPI("GET", `/raceDetailsStats/${raceName}/getRaceActiveYears`,);

      if (response && response.data.data.years) {
        const years = response.data.data.years;
        setDynamicYears(years);
      }
    } catch (err) {
      console.error("Error fetching rider active years:", err);
      // Fallback to static years if API fails
      setDynamicYears([]);
    } finally {
      setYearsLoading(false);
    }
  };

  // Fetch race details
  const fetchRaceDetails = useCallback(async (raceName) => {
    if (!raceName) return;

    try {
      setIsLoadingRace(true);
      setError(null);

      const response = await callAPI(
        "GET",
        `/raceDetailsStats/${raceName}/getRaceDetails`,
        {}
      );
      console.log('response----', response)

      if (response.status && response.data) {
        setRaceData(response.data);
      } else {
        setError("Failed to load race details");
      }
    } catch (error) {
      console.error("Error fetching race details:", error);
      setError("An error occurred while loading race details");
    } finally {
      setIsLoadingRace(false);
    }
  }, []);

  // Handle selection changes
  const handleSelection = useCallback((type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput('');
        setShowYearDropdown(false);
        fetchFiltersData();
        break;
      case "nationality":
        setSelectedNationality(value);
        setShowNationalityDropdown(false);
        fetchFiltersData();
        break;
    }
  }, []);

  const handleYearInputChange = useCallback((value) => {
    setYearInput(value);
  }, []);

  // Effects  
  useEffect(() => {
    if (router.isReady && decodedRaceName) {
      fetchRaceDetails(decodedRaceName);
      fetchRaceActiveYears(decodedRaceName)
    }
  }, [router.isReady, decodedRaceName, fetchRaceDetails]);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!router.isReady) {
    return <LoadingStats />;
  }

  const isMainLoading = isLoadingRace && !raceData;
  const hasError = error && !isMainLoading;

  return (
    <>
      <Head>
        <title>{raceData?.race_name || "Race"} | Cycling Stats</title>
      </Head>
      <main className="inner-pages-main rider-detail-main race-detail-main">
        <div className="dropdown-overlay"></div>
        <section className="rider-details-sec pb-0 rider-details-sec-top">
          <div className="top-wrapper-main">
            <div className="container">
              {isMainLoading ? (
                <Loading />
              ) : hasError ? (
                <div className="col-12">
                  <ErrorStats message={error} />
                </div>
              ) : raceData ? (
                <div className="top-wraper">
                  <ul className="breadcrumb">
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/races">Races</Link>
                    </li>
                    <li>{raceData.race_name}</li>
                  </ul>

                  <div className="wraper">
                    <h1>{raceData.race_name}</h1>
                  </div>

                  <ul className="plyr-dtls">
                    {raceData.country_code && (
                      <li className="country">
                        <Flag
                          code={raceData.country_code}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "10px",
                          }}
                        />
                        {raceData?.country_name}
                      </li>
                    )}
                    {raceData.year && (
                      <li className="text-sm">{raceData.year}</li>
                    )}
                    {raceData.total_riders && (
                      <li className="text-sm">
                        total riders ({raceData.total_riders})
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="stats-sec1 race-details-sec py-8">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mb-6">
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
                    loading={isLoadingFilters}
                    includeAllOption={false}
                  />
                  {/* <li>All-time</li> */}
                  <FilterDropdown
                    ref={nationalityDropdownRef}
                    isOpen={showNationalityDropdown}
                    toggle={() =>
                      setShowNationalityDropdown(!showNationalityDropdown)
                    }
              options={allNationalityOptions}
                    selectedValue={selectedNationality}
                    placeholder="Nationaliteit"
                    onSelect={(value) => handleSelection("nationality", value)}
                    loading={isLoadingFilters}
                    includeAllOption={false}
                    classname="nationality-dropdown"
                  />
                </ul>
              </div>
              {raceData && (
                <>
                  {raceData?.is_stage_race ? (
                    <MultipleStageRace
                      selectedYear={
                        selectedYear !== "All-time" ? selectedYear : null
                      }
                      selectedNationality={
          selectedNationality !== "All-Nationalities" ? selectedNationality : null
        }
                      name={decodedRaceName}
                    />
                  ) : (
                    <OneDayRace
                      selectedYear={
                        selectedYear !== "All-time" ? selectedYear : null
                      }
                      selectedNationality={
          selectedNationality !== "All-Nationalities" ? selectedNationality : null
        }
                      name={decodedRaceName}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

