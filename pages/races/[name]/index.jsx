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

export default function RaceDetailsPage({ year,initialRace,apiError}) {
  const router = useRouter();
  const { name } = router.query;
  const [selectedYear, setSelectedYear] = useState(year);
  const [yearInput, setYearInput] = useState("");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedNationality, setSelectedNationality] =
    useState("All-Nationalities");

  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [nationalities, setNationalities] = useState([]);
  const [raceData, setRaceData] = useState(initialRace);
  const [isLoadingRace, setIsLoadingRace] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [error, setError] = useState(null);
  const yearDropdownRef = useRef(null);
  const nationalityDropdownRef = useRef(null);
  const [dynamicYears, setDynamicYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(false);
  const { withoutAllTime } = generateYearOptions();
  const allYearOptions =
    dynamicYears.length > 0 ? ["All-time", ...dynamicYears] : ["All-time"];
  const allNationalityOptions = useMemo(() => {
    return ["All-Nationalities", ...nationalities];
  }, [nationalities]);

  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      return allYearOptions;
    }

    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return dynamicYears.filter((year) =>
        String(year).toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return allYearOptions.filter((year) =>
      String(year).toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const fetchFiltersData = useCallback(async () => {
    if (!name) return;

    try {
      setIsLoadingFilters(true);
      const queryParams = {};
      if (selectedNationality && selectedNationality !== "All-Nationalities") {
        queryParams.nationality = selectedNationality;
      }
      if (selectedYear && selectedYear !== "All-time")
        queryParams.q_year = selectedYear;

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
  }, [selectedNationality, name]);

  useEffect(() => {
    if (!raceData?.raceSlug) return;
  const fetchRaceActiveYears = async () => {
    try {
      setYearsLoading(true);
      const response = await callAPI(
        "GET",
        `/raceDetailsStats/${raceData?.raceSlug}/getRaceActiveYears`
      );

      if (response && response.data?.data?.years) {
        const years = response.data?.data?.years;
        setDynamicYears(years);
      }
    } catch (err) {
      console.error("Error fetching rider active years:", err);
      setDynamicYears([]);
    } finally {
      setYearsLoading(false);
    }
  };
  fetchRaceActiveYears();
}, [raceData]);

  // const fetchRaceDetails = useCallback(async (raceName) => {
  //   if (!raceName) return;

  //   try {
  //     setIsLoadingRace(true);
  //     setError(null);

  //     const response = await callAPI(
  //       "GET",
  //       `/raceDetailsStats/${raceName}/getRaceDetails`,
  //       {}
  //     );

  //     if (response.status && response.data) {
  //       setRaceData(response.data);
  //     } else {
  //       setError("Failed to load race details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching race details:", error);
  //     setError("An error occurred while loading race details");
  //   } finally {
  //     setIsLoadingRace(false);
  //   }
  // }, []);

  const handleSelection = useCallback((type, value) => {
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
    }
  }, []);

  const handleYearInputChange = useCallback((value) => {
    setYearInput(value);
  }, []);

  // useEffect(() => {
  //   if (router.isReady && name) {
  //     fetchRaceDetails(name);
  //     fetchRaceActiveYears(name);
  //   }
  // }, [router.isReady, name, fetchRaceDetails]);

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

  if (apiError) {
    return (
      <div className="container pt-161px">
        <div className="alert alert-danger text-center">
          <h3>Something went wrong</h3>
          <p>
            We’re having trouble loading this race right now.
            Please try again later.
          </p>
          <Link href="/races" className="glob-btn green-bg-btn">
            <strong>Go to Races</strong>
          </Link>
        </div>
      </div>
    );
  }
  

  if (!router.isReady) {
    return <LoadingStats />;
  }

  if (!raceData) {
    return (
      <div className="container pt-161px">
        <div className="text-center">
          <h2>Team Information Not Available</h2>
          <p>We couldn't find information for this team.</p>
          <Link href="/teams">
            <button className="btn btn-primary mt-3">Back to Teams</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{raceData?.race_name || "Race"} | Cycling Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="inner-pages-main rider-detail-main race-detail-main  header-layout-2">
        <div className="dropdown-overlay"></div>
        <section className="rider-details-sec pb-0 rider-details-sec-top bg-pattern">
          <div className="top-wrapper-main">
            <div className="container">
            {raceData && (
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
                  </ul>
                </div>
            )}
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
                    loading={yearsLoading}
                    includeAllOption={false}
                  />
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
                        selectedNationality !== "All-Nationalities"
                          ? selectedNationality
                          : null
                      }
                      name={name}
                    />
                  ) : (
                    <OneDayRace
                      selectedYear={
                        selectedYear !== "All-time" ? selectedYear : null
                      }
                      selectedNationality={
                        selectedNationality !== "All-Nationalities"
                          ? selectedNationality
                          : null
                      }
                      name={name}
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

export async function getServerSideProps(context) {
  const { name } = context.params;
  const year = context.query.year || "All-time";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/raceDetailsStats/${name}/getRaceDetails`
    );

    if (res.status === 404) {
      return { notFound: true };
    }

    if (!res.ok) {
      return {
        props: {
          year,
          initialRace: null,
          apiError: true,
        },
      };
    }

    const json = await res.json();

    if (!json?.data) {
      return { notFound: true };
    }

    return {
      props: {
        year,
        initialRace: json.data,
      },
    };
  } catch {
    return {
      props: {
        year,
        initialRace: null,
        apiError: true,
      },
    };
  }
}
