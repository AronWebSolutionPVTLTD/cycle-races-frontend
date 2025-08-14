import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { callAPI } from "@/lib/api";
import Flag from "react-world-flags";
import Link from "next/link";
import { generateYearOptions } from "@/components/GetYear";
import {
  CardSkeleton,
  ErrorStats,
  ListSkeleton,
} from "@/components/loading&error";

export default function RaceResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isRouterReady, setIsRouterReady] = useState(false);

  const [race, setRace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024");
  // const [searchTerm, setSearchTerm] = useState('');
  // const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  // const [searchResults, setSearchResults] = useState([]);
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

  // Convert month name to number (1-12)
  const getMonthNumber = (monthName) => {
    return months.findIndex((month) => month === monthName) + 1;
  };

  const fetchRaceDetails = async (raceId) => {
    setIsLoading(true);
    setError(null);
    try {
      const monthParam = selectedMonth
        ? `&month=${getMonthNumber(selectedMonth)}`
        : "";
      const response = await callAPI(
        "GET",
        `/raceDetailsStats/${raceId}/getRaceDetails?year=${selectedYear}${monthParam}`
      );
      if (response?.data) {
        setRace(response.data);
        await fetchFeaturedStats(raceId);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      setError(err || "Failed to load race data");
      setError("Failed to load race data. Please try again later.");
      setRaceResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedStats = async (raceId) => {
    setLoadingFeatured(true);
    setErrorFeatured(null);
    try {
      // Fetch all stats in parallel
      const [winnersByNationality, oldestRider, youngestRider, bestTeam] =
        await Promise.all([
          callAPI("GET", `/stages/${raceId}/getRaceWinnersByNationality`),
          callAPI("GET", `/stages/${raceId}/getOldestRiderInRace`),
          callAPI("GET", `/stages/${raceId}/getYoungestRiderInRace`),
          callAPI("GET", `/stages/${raceId}/getBestTeamInRace`),
        ]);

      console.log(
        winnersByNationality,
        oldestRider,
        youngestRider,
        bestTeam,
        "dsf"
      );

      const stats = [];

      // Add winners by nationality if available
      if (winnersByNationality?.data?.data?.length > 0) {
        const topNationality = winnersByNationality.data.data[0];
        stats.push({
          title: winnersByNationality?.message || "Top Nationality",
          rider: topNationality.country_code.toUpperCase(),
          flag: topNationality.country_code.toLowerCase(),
          value: topNationality.wins,
          unit: "wins",
        });
      }

      // Add oldest rider if available
      if (oldestRider?.data) {
        stats.push({
          title: oldestRider?.message || "Oldest Rider",
          rider: oldestRider.data.rider_name,
          flag: oldestRider.data.rider_country.toLowerCase(),
          value: oldestRider.data.age,
          unit: "jaar",
        });
      }

      // Add youngest rider if available
      if (youngestRider?.data) {
        stats.push({
          title: youngestRider?.message || "Youngest Rider",
          rider: youngestRider.data.rider_name,
          flag: youngestRider.data.rider_country.toLowerCase(),
          value: youngestRider.data.age,
          unit: "jaar",
        });
      }

      // Add best team if available
      if (bestTeam?.data) {
        stats.push({
          title: bestTeam.message || "Best Team",
          rider: bestTeam.data.team_name,
          speed: bestTeam.data.rider_count,
          flag: "/images/team-icon.svg",
          value: bestTeam.data.rider_count,
          unit: "riders",
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
        fetchRaceDetails(id);
      }
    }
  }, [router.isReady, id]);

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

  const getTimeGapDisplay = (baseTime, compareTime) => {
    if (!baseTime || !compareTime) return ""; // empty string if either time missing

    const base = convertTimeToSeconds(baseTime);
    const compare = convertTimeToSeconds(compareTime);

    if (base === null || compare === null) return ""; // empty if parse failed

    const diff = compare - base;

    // Always show time, even if diff === 0 (same time)
    if (diff <= 0) return formatTimeToDisplay(compareTime);

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return minutes > 0 ? `+${minutes}'${seconds}"` : `+${seconds}"`;
  };

  return (
    <main>
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
                <li>{race?.race_name}</li>
              </ul>
              {isLoading ? (
                "Loading..."
              ) : (
                <h1>{race?.race_name.toUpperCase()}</h1>
              )}
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
                <li>#</li>
                <li>Name</li>
                <li>Team</li>
                <li>Time</li>
              </ul>

              {isLoading || !isRouterReady ? (
                <div className="loading-spinner">
                  <ListSkeleton />
                </div>
              ) : error ? (
                <div className="col-12">
                  <ErrorStats message={error} />
                </div>
              ) : race.riders.length > 0 ? (
                <ul className="transparent-cart">
                  {race.riders
                    ?.sort((a, b) => a.rank - b.rank)
                    .slice(0, 25)
                    .map((rider, index) => (
                      <li key={index}>
                        <span>{index + 1}</span>
                        <h5>
                          <Flag
                            code={rider.country_code?.toUpperCase()}
                            style={{
                              width: "30px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          {rider.rider_name.toUpperCase()}
                        </h5>
                        <h6>{rider.team_name}</h6>
                        <h6 className="time-result">
                          {/* {index === 0
                            ? formatTimeToDisplay(rider.time)
                            : getTimeGapDisplay(
                                race.riders[0]?.time,
                                rider.time
                              )} */}
                          {rider.time}
                        </h6>
                        <Link href="#" className="r-details">
                          <img src="/images/hover-arow.svg" alt="Details" />
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
              ) : featuredStats.length > 0 ? (
                featuredStats.map((stat, index) => (
                  <div className="team-cart" key={index}>
                    <div className="text-wraper">
                      <h4 className="font-size-change">{stat.title}</h4>
                      <div className="name-wraper">
                        <Flag
                          code={stat.flag}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "10px",
                          }}
                        />
                        <h6>{stat.rider}</h6>
                      </div>
                    </div>
                    <h5>
                      <strong>{stat.value}</strong>
                      {stat.unit && ` ${stat.unit}`}
                    </h5>

                    <Link href="#" className="green-circle-btn">
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
