import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchData } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ListSkeleton } from "@/components/loading&error";
import { SLUG_CONFIGS } from "@/lib/slug-config";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { generateYearOptions } from "@/components/GetYear";
import getItemId from "@/pages/getId";
import { renderFlag } from "@/components/RenderFlag";

const getItemValue = (item, possibleKeys, defaultValue = "N/A") => {
  if (!possibleKeys || !Array.isArray(possibleKeys)) {
    return defaultValue;
  }
  for (const key of possibleKeys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return defaultValue;
};

const getCountryCode = (item, config) => {
  const country = getItemValue(item, config.itemConfig.country, "default");
  return country.toUpperCase();
};

const getRiderOrRaceId = (item) => {
  if ((item?.race_name || item?.race)) {
    return { type: "race", id: item?.race_name || item?.race };
  }

  const keys = ["_id", "rider_id", "riderId", "id", "rider_key"];
  for (const key of keys) {
    if (item?.[key]) {
      return { type: "rider", id: item[key] };
    }
  }

  return null;
};


export default function DynamicSlugPage() {
  const router = useRouter();
  const { slug, year } = router.query;
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiTitle, setApiTitle] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    null
  );
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const { withoutAllTime } = generateYearOptions();
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      if (year) {
        setSelectedYear(year);
      } else if (slug === "rider-results-this-year" && !year) {
        const currentYear = new Date().getFullYear().toString();
        setSelectedYear(currentYear);
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, year: currentYear },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [router.isReady, year, slug]);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year.toString());
  }

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput("");
        setShowYearDropdown(false);
        const { id } = router.query;
        const newQuery = { ...router.query, year: value };
        router.push(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true }
        );
        break;
    }
  };
  const handleYearInputChange = (value) => {
    setYearInput(value);
  };
  useEffect(() => {
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
    };
  }, []);

  const getBackLink = () => {
    const { id } = router.query;
    return `/riders/${id}`;
  };

  const getSlugConfig = (slug) => {
    return (
      SLUG_CONFIGS[slug] || {
        apiEndpoint: slug,
        headers: ["NAME", "TEAM", "COUNT"],
        dataPath: "data",
        itemConfig: {
          name: ["rider_name", "riderName", "name"],
          team: ["team_name", "teamName", "team"],
          country: ["rider_country", "riderCountry", "country"],
          count: ["count", "total"],
        },
      }
    );
  };

  useEffect(() => {
    if (router.isReady && slug) {
      fetchSlugData();
    }
  }, [router.isReady, slug, selectedYear]);

  const fetchSlugData = async () => {
    setLoading(true);
    try {
      const config = getSlugConfig(slug);
      const { rider_country, team_name, id, slugOrId } = router.query;
      const queryParams = {};
      if (selectedYear) queryParams.year = selectedYear;
      if (rider_country) queryParams.rider_country = rider_country;
      if (team_name) queryParams.team_name = team_name;
      if (id) queryParams.id = slugOrId;
      const response = await fetchData(config.apiEndpoint, queryParams, {
        id: slugOrId,
        idType: config.idType,
      });
      if (response && response.data) {
        if (response?.data?.riders) {
          response.data = response?.data?.riders;
        }
        if (slug === "upcoming-races-last-year-riders") {
          response.data = response?.data?.races[0]?.last_year_top_riders;
        }
        if (slug === "most-win-upcoming-rider-last-year") {
          response.data = response?.data?.races[0]?.all_time_top_winners;
        }
        if (slug === "shortest-races") {
          response.data = [
            ...response?.data?.data?.shortest_stage_races,
            ...response?.data?.data?.shortest_one_day_races,
          ];
        }
        if (slug === "longest-races") {
          response.data = [
            ...response?.data?.data?.longest_stage_races,
            ...response?.data?.data?.longest_one_day_races,
          ];
        }
        if (slug === "team-with-most-consecutive-wins") {
          response.data = response?.data?.teams;
        }
        if (slug === "rider-last-victories") {
          response.data = response?.data?.data?.raceData;
        }
        if (slug === "rider-last-victory") {
          response.data = response?.data?.data?.raceData;
        }
        if (slug === "wins-in-one-day-races") {
          response.data = response?.data?.data?.wins;
        }
        if (slug === "professional since") {
          response.data = response?.data?.data?.years_and_teams;
        }
        if (slug === "number-of-wins-per-season") {
          response.data = response?.data?.data?.wins_per_season;
        }
        if (slug === "best-monuments-result") {
          response.data = response?.data?.data?.best_monument_results;
        }
        if (slug === "top-finishes-in-grand-tour-satges") {
          response.data = response?.data?.data?.top_10_stages;
        }
        if (slug === "rider-longest-streak-without-win") {
          response.data =
            response?.data?.data?.longest_streak_without_win?.races_in_streak;
        }
        if (slug === "team-contract-history") {
          response.data = response?.data?.data?.contracts;
        }
        if (slug === "home-country-wins") {
          response.data = response?.data?.data?.[0]?.races;
        }
        if (slug === "grand-tours-ridden") {
          response.data = response?.data?.data?.grand_tours_ridden;
        }
        if (slug === "rider-most-raced-countries") {
          response.data = response?.data?.data?.raceData;
        }
        if (slug === "best-stage-results") {
          response.data = response?.data?.data?.results;
        }
        if (slug === "victory-in-grand-tours") {
          response.data = response?.data?.data?.first_rank_races;
        }
        if (slug === "total-grand-tour-racing-days") {
          response.data = response?.data?.data?.grand_tour_racing_days;
        }
        if (slug === "total-distance-grand-tour") {
          response.data = response?.data?.data?.grand_tour_distance;
        }
        if (slug === "riders-best-monuments-results") {
          response.data = response?.data?.data?.best_monument_results;
        }
        if (slug === "riders-paris-roubaix-results") {
          response.data = response?.data?.data?.results;
        }
        if (slug === "victory-in-monuments") {
          response.data = response?.data?.data?.first_rank_races;
        }
        if (slug === "best-gc-result-in-grand-tour") {
          response.data = response?.data?.best_gc_results;
        }
        if (slug === "most-frequent-teammate") {
          response.data = response?.data?.data?.teammates;
        }
        if (slug === "rider-last-place-finishes") {
          response.data = response?.data?.data?.last_place_finishes;
        }
        if (slug === "riders-with-same-birthplace") {
          response.data = response?.data?.data?.others_from_same_birthplace;
        }
        if (slug === "grand-tour-dnfs") {
          response.data = response?.data?.data?.dnfs;
        }
        if (slug === "rider-results-this-year") {
          setPageData(response.data);
        } else {
          setPageData(response.data);
        }
        if (response.message) {
          setApiTitle(response.message);
        }
        setError(null);
      } else {
        setError("No data found for this category");
      }
    } catch (err) {
      console.error("Error fetching slug data:", err);
      setError("Failed to load data for this category");
    } finally {
      setLoading(false);
    }
  };

  const formatSlugForDisplay = (slug) => {
    if (!slug) return "Page";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getDynamicHeaders = () => {
    const config = getSlugConfig(slug);
    if (pageData) {
      let dataArray = pageData;
      if (slug === "rider-results-this-year" && pageData?.results_list) {
        dataArray = pageData.results_list;
      } else if (config.dataPath && pageData[config.dataPath]) {
        dataArray = pageData[config.dataPath];
      }

      if (Array.isArray(dataArray)) {
        return getDynamicHeadersBasedOnData(dataArray, config);
      }
    }
    return config.headers;
  };

  const renderContent = () => {
    if (loading) {
      return <ListSkeleton />;
    }

    if (error) {
      return (
        <div
          className="error-state"
          style={{ textAlign: "center", padding: "20px", color: "red" }}
        >
          Error: {error}
        </div>
      );
    }

    const config = getSlugConfig(slug);
    let dataArray = pageData;
    if (slug === "rider-results-this-year") {
      if (pageData?.results_list) {
        dataArray = pageData.results_list;
      } else {
        dataArray = [];
      }
    } else if (config.dataPath && pageData[config.dataPath]) {
      dataArray = pageData[config.dataPath];
    }

    if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
      return (
        <li
          className="empty-state ctm-empty-state"
          style={{ textAlign: "center", padding: "20px" }}
        >
          No data found for this category.
        </li>
      );
    }

    if (Array.isArray(dataArray)) {
      return renderListContent(dataArray, config);
    } else if (typeof dataArray === "object") {
      return renderObjectContent(dataArray, config);
    }

    return (
      <li className="content" style={{ padding: "20px" }}>
        {JSON.stringify(pageData, null, 2)}
      </li>
    );
  };

  const hasTeamData = (data, config) => {
    if (!config.itemConfig.team || !Array.isArray(config.itemConfig.team)) {
      return false;
    }
    return data.some((item) => {
      for (const key of config.itemConfig.team) {
        if (
          item[key] !== undefined &&
          item[key] !== null &&
          item[key] !== "N/A"
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const hasNameData = (data, config) => {
    if (!config.itemConfig.name || !Array.isArray(config.itemConfig.name)) {
      return false;
    }
    return data.some((item) => {
      for (const key of config.itemConfig.name) {
        if (
          item[key] !== undefined &&
          item[key] !== null &&
          item[key] !== "N/A"
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const hasCountData = (data, config) => {
    if (!config.itemConfig.count || !Array.isArray(config.itemConfig.count)) {
      return false;
    }
    return data.some((item) => {
      for (const key of config.itemConfig.count) {
        if (
          item[key] !== undefined &&
          item[key] !== null &&
          item[key] !== "N/A"
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const getDynamicHeadersBasedOnData = (data, config) => {
    const headers = [];
    config.headers.forEach((header) => {
      headers.push(header);
    });

    return headers;
  };

  const renderListContent = (data, config) => {
    const teamDataExists = hasTeamData(data, config);
    const nameDataExists = hasNameData(data, config);
    const countDataExists = hasCountData(data, config);

    return data.map((item, index) => {
      const columns = [];
      const queryParams = [];
      if (selectedYear) queryParams.push(`year=${selectedYear}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      if (slug === "rider-results-this-year" && config.headers.includes("DATE")) {
        const formatDate = (dateStr) => {
          if (!dateStr) return "N/A";
          if (dateStr.includes(".")) {
            const [day, month] = dateStr.split(".");
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);

            if (isNaN(dayNum) || isNaN(monthNum)) return dateStr;

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            return `${dayNum} ${monthNames[monthNum - 1]}`;
          }

          return dateStr;
        };

        const dateValue = item?.date || item?.race_date || "N/A";
        const formattedDate = formatDate(dateValue);

        columns.push(
          <div key="date" className="date">
            {formattedDate}
          </div>
        );
      }
      if (nameDataExists) {
        const riderOrRaceData = getItemId(item, config.itemConfig.name);
        console.log(riderOrRaceData,"rider")
        const clickableProps = riderOrRaceData?.type === "race" ?
          { href: `/race-result/${encodeURIComponent(riderOrRaceData?.id)}${queryString}` } :
          riderOrRaceData?.type === "rider" ? { href: `/riders/${encodeURIComponent(riderOrRaceData?.id)}${queryString}` }
            : null;

        const nameContent = (
    
          <>

            <div className="d-flex flex-column">
              {`${getItemValue(item, config.itemConfig.name)} ${riderOrRaceData?.type === "race" && item?.type === "stage"
                ? `-${item?.type?.toUpperCase()} ${item?.stage_number}`
                : ""
                }`}
              {riderOrRaceData?.type === "race" && item?.type === "stage" && (
                <span className="most-dnfs-start-end">
                  {item?.start_location}

                  {item?.start_location && item?.finish_location ? " - " : ""}

                  {item?.finish_location}

                  {item?.distance ? ` (${item.distance} km)` : ""}
                </span>
              )}
            </div>
          </>
        );

        columns.push(
          <h5 key="name" className="rider--name">
            {slug !== "rider-results-this-year" && (
              <span key="srno" className="sr-no fw-900">
                {index + 1}.
              </span>
            )}
            {clickableProps?.href ? (
              <>
                {renderFlag(getCountryCode(item, config))}
                <Link {...clickableProps} className="link">
                  {nameContent}
                </Link>
              </>

            ) : (
              <>
                {renderFlag(getCountryCode(item, config))}
                <span>
                  {nameContent}
                </span>
              </>
            )}
          </h5>
        );
      }

      if (teamDataExists) {
        const Data = getItemId(item, config.itemConfig.team);
        const clickableProps = Data?.type === "race" ?
          { href: `/race-result/${encodeURIComponent(Data?.id)}${queryString}` } :
          Data?.type === "rider" ? { href: `/riders/${encodeURIComponent(Data?.id)}${queryString}` }
            :
            Data?.type === "team" ?
              { href: `/teams/${encodeURIComponent(Data?.id)}` } :
              null;
        if (!nameDataExists) {
          const teamContent = (
            <>
              <span>{`${getItemValue(item, config.itemConfig.team)} ${Data?.type === "race" && item?.type === "stage"
                ? `-${item?.type?.toUpperCase()} ${item?.stage_number}`
                : ""
                }`}</span>

              {Data?.type === "race" && item?.type === "stage" && (
                <span className="most-dnfs-start-end">
                  {item?.start_location}

                  {item?.start_location && item?.finish_location ? " - " : ""}

                  {item?.finish_location}

                  {item?.distance ? ` (${item.distance} km)` : ""}
                </span>
              )}
            </>
          );
          columns.push(
            <h5 key="name" className="rider--name">
              {slug !== "rider-results-this-year" && (
                <span key="srno" className="sr-no fw-900">
                  {index + 1}.
                </span>
              )}
              {clickableProps?.href ? (
                <>{renderFlag(getCountryCode(item, config))}
                  <Link {...clickableProps} className="link">
                    {teamContent}
                  </Link>
                </>
              ) : (
                <>{renderFlag(getCountryCode(item, config))}
                  <span>
                    {teamContent}
                  </span>
                </>
              )}
            </h5>
          );
        } else {
          const teamValue = getItemValue(item, config.itemConfig.team);
          columns.push(
            <div key="team" className={`team-name rider--name text-md-center ${config.itemConfig.team.join(" ")}`}>
              {clickableProps?.href ? (
                <Link {...clickableProps} className="link">
                  {`${teamValue}${Data?.type === "race" && item?.type === "stage"
                    ? `-${item?.type?.toUpperCase()} ${item?.stage_number}`
                    : ""
                    }`}
                  {Data?.type === "race" && item?.type === "stage" && (
                    <span className="most-dnfs-start-end">
                      {item?.start_location}

                      {item?.start_location && item?.finish_location ? " - " : ""}

                      {item?.finish_location}

                      {item?.distance ? ` (${item.distance} km)` : ""}
                    </span>
                  )}
                </Link>
              ) : (
                <span>
                  {teamValue}
                </span>
              )}
            </div>
          );
        }
      }

      if (config.headers.includes("AGE") && config.itemConfig.age) {
        columns.push(
          <div key="age" className="age">
            {getItemValue(item, config.itemConfig.age)}
          </div>
        );
      }

      if (countDataExists) {
        columns.push(
          <div key="count" className="count rank text-end">
            {getItemValue(item, config.itemConfig.count)}
          </div>
        );
      }

      return (
        <li
          key={item._id || item.id || index}
          className={`content-item ctm-head-heading hoverState-li table_cols_list riders-table-cols col--${columns.length}`}
        >
          {columns}
        </li>
      );
    });
  };

  const renderObjectContent = (data, config) => {
    if (data.data && Array.isArray(data.data)) {
      return renderListContent(data.data, config);
    }

    if (typeof data === "object" && !Array.isArray(data)) {
      const columns = [];

      if (data.year) {
        columns.push(
          <div key="year" className="year">
            Year: {data.year}
          </div>
        );
      }

      if (data.class_filter) {
        columns.push(
          <div key="class" className="class">
            Class:{" "}
            {Array.isArray(data.class_filter)
              ? data.class_filter.join(", ")
              : data.class_filter}
          </div>
        );
      }

      if (data.data) {
        columns.push(
          <div key="data" className="data">
            Data:{" "}
            {Array.isArray(data.data)
              ? `${data.data.length} items`
              : "Available"}
          </div>
        );
      }

      if (data.filters) {
        columns.push(
          <div key="filters" className="filters">
            Filters: {Object.keys(data.filters).length > 0 ? "Applied" : "None"}
          </div>
        );
      }

      if (data.tab_name_filter) {
        columns.push(
          <div key="tab" className="tab">
            Tab: {data.tab_name_filter}
          </div>
        );
      }

      return <li className="content-object">{columns}</li>;
    }

    return (
      <li className="content-object">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="content-field">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
            {typeof value === "object" ? (
              <pre>{JSON.stringify(value, null, 2)}</pre>
            ) : (
              <span> {String(value)}</span>
            )}
          </div>
        ))}
      </li>
    );
  };

  const getCustomHeading = (slug, apiTitle) => {
    return apiTitle || (slug ? formatSlugForDisplay(slug) : "Page");
  };

  const pageTitle = apiTitle
    ? `${apiTitle} | Cycling Stats`
    : slug
      ? `${formatSlugForDisplay(slug)} | Cycling Stats`
      : "Page | Cycling Stats";
  const pageHeading = getCustomHeading(slug, apiTitle);



  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <section className="slug-main-section">
        <div className="dropdown-overlay"></div>

        <section className="riders-sec1 pt-161px">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="breadcrumb">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/stats">Stats</Link>
                  </li>
                  <li>{pageHeading}</li>
                </ul>
                {slug === "rider-results-this-year" ? (
                  <div className="isRiderResults-wraper">
                    <div className="hdr-img_wrap">
                      <img alt="" className="absolute-img" src="/images/player6.png"></img>
                    </div>
                    <h1 className="">{pageHeading || "..."}</h1>
                  </div>
                ) : (
                  <h1 className="mb-0">{pageHeading}</h1>
                )}

              </div>
            </div>
          </div>
        </section>

        <section className="stat-main-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-center sdsd bts__wrap">
                  <div className="col custom-year-dropdown-wrap">
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
                    </ul>
                    {slug === "rider-results-this-year" && pageData && (
                      <div className="results-summary">
                        <div className="stat-item">
                          <strong>WINS</strong>
                          <span>{pageData.wins_count ?? 0}</span>
                        </div>
                        <span className="divider">|</span>
                        <div className="stat-item podium">
                          <strong>PODIUM</strong>
                          <span>{pageData.podium_count ?? 0}</span>
                        </div>
                        <span className="divider">|</span>
                        <div className="stat-item top10">
                          <strong>TOP 10</strong>
                          <span>{pageData.top10_count ?? 0}</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12 mt-4 slug-table-main">
                <ul
                  className={`slug-table-head sdsd col--${getDynamicHeaders().length
                    }`}
                >
                  {getDynamicHeaders().map((header, index) => (
                    <li className={`slug-list-head ${header}`} key={index}>{header}</li>
                  ))}
                </ul>

                <ul className="slug-table-body">{renderContent()}</ul>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { slug  } = params;

  if (!SLUG_CONFIGS[slug]) {
    return { notFound: true };
  }

  return {
    props: {
      slug: slug,
    },
  };
}
