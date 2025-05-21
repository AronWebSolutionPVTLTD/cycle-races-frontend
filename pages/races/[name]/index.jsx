// pages/race/[name].jsx
import { generateYearOptions } from "@/components/GetYear";
import { ErrorStats } from "@/components/loading&error";
import FirstSection from "@/components/race_detail/FirstSection";
import MostWin from "@/components/race_detail/Mostwin";
import SecondSection from "@/components/race_detail/SecondSection";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { callAPI } from "@/lib/api";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Flag from "react-world-flags";

export default function RaceDetailsPage() {
  const router = useRouter();
  const { name } = router.query;
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState("year");
  const [years, setYears] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All time");
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  const [selectedNationality, setSelectedNationality] = useState("");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [raceData, setRaceData] = useState(null); // Changed to null initially
  const [error, setError] = useState(null);

  const {withAllTime} = generateYearOptions();

  // Refs for handling clicks outside dropdowns
  const yearDropdownRef = useRef(null);
  const nationalityDropdownRef = useRef(null);

  // Fetch nationalities and teams based on filters
  const fetchFiltersData = useCallback(async () => {
    try {
      const queryParams = {};
      if (selectedNationality) queryParams.q_country = selectedNationality;
      if (selectedYear) queryParams.q_year = selectedYear;

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
    }
  }, [selectedNationality, selectedYear]);

  useEffect(() => {
    fetchFiltersData();
  }, [fetchFiltersData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setShowYearDropdown(false);
      }
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target)) {
        setShowNationalityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getFilteredYears = (searchValue) => {
    return withAllTime.filter((year) =>
      year.toLowerCase().includes((searchValue || "").toLowerCase())
    );
  };

  const handleYearInputChange = (value) => {
    setYearInput(value);
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput(value);
        setShowYearDropdown(false);
        fetchFiltersData();
        break;
      case "nationality":
        setSelectedNationality(value);
        setShowNationalityDropdown(false);
        fetchFiltersData();
        break;
    }
  };

  const fetchRaceDetails = async (raceName) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await callAPI(
        "GET",
        `/raceDetailsStats/${raceName}/getRaceDetails`,
        {}
      );

      if (response.status && response.data) {
        setRaceData(response.data);
      } else {
        setError("Failed to load race details");
      }
    } catch (error) {
      console.error("Error fetching race details:", error);
      setError("An error occurred while loading race details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      if (name) {
        const raceName = decodeURIComponent(name);
        fetchRaceDetails(raceName);
      }
    }
  }, [router.isReady, name]);

  if (!isRouterReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Initializing page...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{raceData?.race_name || "Race"} | Cycling Stats</title>
      </Head>
      <main>
        <section className="rider-details-sec pb-0 rider-details-sec-top">
          <div className="top-wrapper-main">
            <div className="container">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="col-12"><ErrorStats message={error} /></div>
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
                      <li>
                        <Flag
                          code={raceData.country_code}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "10px",
                          }}
                        />
                      </li>
                    )}
                    {raceData.year && (
                      <li className="text-sm">{raceData.year} </li>
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

        {raceData && (
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
                      loading={false}
                      includeAllOption={false}
                    />

                    <FilterDropdown
                      ref={nationalityDropdownRef}
                      isOpen={showNationalityDropdown}
                      toggle={() => setShowNationalityDropdown(!showNationalityDropdown)}
                      options={nationalities}
                      selectedValue={selectedNationality}
                      placeholder="Nationaliteit"
                      onSelect={(value) => handleSelection("nationality", value)}
                      loading={isLoading}
                      allOptionText="All Nationalities"
                    />
                  </ul>
                </div>

                <FirstSection
                  selectedYear={selectedYear !== "All time" ? selectedYear : null}
                  selectedNationality={selectedNationality}
                  name={name ? decodeURIComponent(name) : ""}
                />
                
                <MostWin
                  selectedYear={selectedYear !== "All time" ? selectedYear : null}
                  selectedNationality={selectedNationality}
                  name={name ? decodeURIComponent(name) : ""}
                />
                
                <SecondSection
                  selectedYear={selectedYear !== "All time" ? selectedYear : null}
                  selectedNationality={selectedNationality}
                  name={name ? decodeURIComponent(name) : ""}
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}