// pages/[slug]/index.jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchData } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { CardSkeleton, ListSkeleton } from "@/components/loading&error";
import Flag from "react-world-flags";
import { SLUG_CONFIGS } from "@/lib/slug-config";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { generateYearOptions } from "@/components/GetYear";

// Helper function to get value from item using multiple possible keys
const getItemValue = (item, possibleKeys, defaultValue = "N/A") => {
  for (const key of possibleKeys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return defaultValue;
};

// Helper function to get country code for flag
const getCountryCode = (item, config) => {
  const country = getItemValue(item, config.itemConfig.country, "default");
  return country.toUpperCase();
};

const getRiderOrRaceId = (item) => {
  // if race_name exists → redirect to race
  if ((item?.race_name || item?.race)) {
    return { type: "race", id: item?.race_name || item?.race };
  }

  // else fallback to rider
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
  const { slug } = router.query;

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

  // Generate year options (current year back to 1990)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year.toString());
  }

  // Handle year change
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

  // Get the appropriate back link based on current URL
  const getBackLink = () => {
    const { id } = router.query;
    return `/riders/${id}`;
  };

  // Get configuration for current slug
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

  // Fetch data based on slug
  useEffect(() => {
    if (slug) {
      fetchSlugData();
    }
  }, [slug, selectedYear]);

  // Function to fetch data based on slug
  const fetchSlugData = async () => {
    setLoading(true);
    try {
      const config = getSlugConfig(slug);

      // Get query parameters from URL
      const { rider_country, team_name, id } = router.query;

      // Build query parameters object
      const queryParams = {};
      if (selectedYear) queryParams.year = selectedYear;
      if (rider_country) queryParams.rider_country = rider_country;
      if (team_name) queryParams.team_name = team_name;
      if (id) queryParams.id = id;
      // Hit the API with the slug parameter and query parameters
      const response = await fetchData(config.apiEndpoint, queryParams, {
        id: id,
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
        if (slug === "last-victory") {
          response.data = response?.data?.data?.raceData;
        }

        if (slug === "wins-in-one-day") {
          response.data = response?.data?.data?.wins;
        }
        if (slug === "rider-years-active") {
          response.data = response?.data?.data?.years_and_teams;
        }
        if (slug === "rider-wins-by-season") {
          response.data = response?.data?.data?.wins_per_season;
        }
        if (slug === "rider-best-monument-results") {
          response.data = response?.data?.data?.best_monument_results;
        }
        if (slug === "get-top10-stages-in-grand-tours") {
          response.data = response?.data?.data?.top_10_stages;
        }
        if (slug === "get-rider-longest-no-win-streak") {
          response.data =
            response?.data?.data?.longest_streak_without_win?.races_in_streak;
        }
        if (slug === "contact-history") {
          response.data = response?.data?.data?.contracts;
        }
        if (slug === "home-country-wins") {
          response.data = response?.data?.data?.[0]?.races;
        }
        if (slug === "get-grand-tours-ridden") {
          response.data = response?.data?.data?.grand_tours_ridden;
        }
        if (slug === "get-rider-most-raced-country") {
          response.data = response?.data?.data?.raceData;
        }
        if (slug === "get-best-stage-result") {
          response.data = response?.data?.data?.results;
        }
        if (slug === "get-first-rank-in-grand-tours") {
          response.data = response?.data?.data?.first_rank_races;
        }
        if (slug === "get-total-racing-days-in-grand-tours") {
          response.data = response?.data?.data?.grand_tour_racing_days;
        }
        if (slug === "get-total-distance-raced-in-grand-tours") {
          response.data = response?.data?.data?.grand_tour_distance;
        }
        if (slug === "get-best-monument-results") {
          response.data = response?.data?.data?.best_monument_results;
        }
        if (slug === "get-best-paris-roubaix-result") {
          response.data = response?.data?.data?.results;
        }
        if (slug === "get-first-rank-in-monuments") {
          response.data = response?.data?.data?.first_rank_races;
        }
        if (slug === "get-best-gc-result") {
          response.data = response?.data?.best_gc_results;
        }
        if (slug === "team-mates") {
          response.data = response?.data?.data?.teammates;
        }
        if (slug === "get-rider-last-place-finishes") {
          response.data = response?.data?.data?.last_place_finishes;
        }
        if (slug === "rider-from-same-home-town") {
          response.data = response?.data?.data?.others_from_same_birthplace;
        }
        if (slug === "get-grand-tour-dnfs") {
          response.data = response?.data?.data?.dnfs;
        }
        setPageData(response.data);
        // Extract title from API response
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

  // Format slug for display
  const formatSlugForDisplay = (slug) => {
    if (!slug) return "Page";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get dynamic headers based on slug configuration and available data
  const getDynamicHeaders = () => {
    const config = getSlugConfig(slug);

    // If we have page data, use dynamic headers based on actual data
    if (pageData) {
      let dataArray = pageData;
      if (config.dataPath && pageData[config.dataPath]) {
        dataArray = pageData[config.dataPath];
      }

      if (Array.isArray(dataArray)) {
        return getDynamicHeadersBasedOnData(dataArray, config);
      }
    }

    // Fallback to config headers if no data available yet
    return config.headers;
  };

  // Render content based on data type and configuration
  const renderContent = () => {
    if (loading) {
      return <ListSkeleton />;
    }

    if (error) {
      return (
        <li
          className="error-state"
          style={{ textAlign: "center", padding: "20px", color: "red" }}
        >
          Error: {error}
        </li>
      );
    }

    if (!pageData || pageData.length === 0) {
      return (
        <li
          className="empty-state ctm-empty-state"
          style={{ textAlign: "center", padding: "20px" }}
        >
          No data found for this category.
        </li>
      );
    }

    const config = getSlugConfig(slug);

    // Get the actual data array
    let dataArray = pageData;
    if (config.dataPath && pageData[config.dataPath]) {
      dataArray = pageData[config.dataPath];
    }

    // Render different content based on data structure
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

  // Helper function to check if team data exists in the dataset
  const hasTeamData = (data, config) => {
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

  // Helper function to check if name data exists in the dataset
  const hasNameData = (data, config) => {
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

  // Helper function to get dynamic headers based on available data
  const getDynamicHeadersBasedOnData = (data, config) => {
    const headers = [];

    // Iterate through config.headers and conditionally add each header
    config.headers.forEach((header) => {
      headers.push(header);
    });

    return headers;
  };

  // Render list content with configuration
  const renderListContent = (data, config) => {
    // Check if team data exists
    const teamDataExists = hasTeamData(data, config);
    // Check if name data exists
    const nameDataExists = hasNameData(data, config);
    const countDataExists = hasCountData(data, config);

    return data.map((item, index) => {
      const columns = [];
      // columns.push(
      //   <span key="srno" className="sr-no">
      //     {index + 1}
      //   </span>
      // );

      // NAME column with flag - only add if name data exists
      if (nameDataExists) {
        const entity = getRiderOrRaceId(item);

        const hasEntity = entity?.id && entity?.type;

        // Extract year and month safely
        const raceDate = item?.race_date?.split(".") || [];
        const year = raceDate[2] || item?.year || "";
        const month = raceDate[1] || "";

        // Determine URL only if entity exists
        const url =
          hasEntity && entity.type === "race"
            ? `/race-result/${entity.id}?year=${year}&month=${month}`
            : hasEntity
              ? `/riders/${entity.id}`
              : null;

        columns.push(
          <h5
            key="name"
            className={`rider--name ${hasEntity ? "clickable" : ""}`}
            {...(hasEntity
              ? {
                onClick: () => router.push(url),
              }
              : {})}
          >
            <span key="srno" className="sr-no">
              {index + 1}.
            </span>

            {hasEntity ? (
              <Link href={url} className="link">
                <Flag
                  code={getCountryCode(item, config)}
                  style={{ width: "30px", height: "20px", flexShrink: 0 }}
                />
                {`${getItemValue(item, config.itemConfig.name)} ${item?.type?.toLowerCase() === "stage" ? `- ${item.type.toUpperCase()} ${item.stage_number}` : ""
                  }`}
              </Link>
            ) : (
              // Render as plain text if no entity
              <>
                <Flag
                  code={getCountryCode(item, config)}
                  style={{ width: "30px", height: "20px", flexShrink: 0 }}
                />
                {`${getItemValue(item, config.itemConfig.name)} ${item?.type?.toLowerCase() === "stage" ? `- ${item.type.toUpperCase()} ${item.stage_number}` : ""
                  }`}
              </>
            )}
          </h5>
        );

      }


      // TEAM column - only add if team data exists
      if (teamDataExists) {
        // If no name data exists, show flag with team
        if (!nameDataExists) {
          columns.push(
            <h5 key="name" className="rider--name">
              <span key="srno" className="sr-no">
                {index + 1}.
              </span>
              <Flag
                code={getCountryCode(item, config)}
                style={{
                  width: "30px",
                  height: "20px",
                  marginRight: "10px",
                  flexShrink: 0,
                }}
              />
              <span>{getItemValue(item, config.itemConfig.team)}</span>
            </h5>
          );
        } else {
          // If name data exists, show team without flag (flag is already shown with name)
          columns.push(
            <div key="team" className="team-name date">
              {getItemValue(item, config.itemConfig.team)}
            </div>
          );
        }
      }

      // AGE column (if specified in config)
      if (config.headers.includes("AGE") && config.itemConfig.age) {
        columns.push(
          <div key="age" className="age">
            {getItemValue(item, config.itemConfig.age)}
          </div>
        );
      }

      // COUNT column
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
          className={`content-item ctm-head-heading hoverState-li table_cols_list col--${columns.length}`}
        >
          {columns}
        </li>
      );
    });
  };

  // Render object content (for complex data structures)
  const renderObjectContent = (data, config) => {
    // Handle the specific data structure from your API
    if (data.data && Array.isArray(data.data)) {
      return renderListContent(data.data, config);
    }

    // Handle object data structure (like the one in your image)
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

    // Fallback for other object structures
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

  const pageTitle = apiTitle
    ? `${apiTitle} | Cycling Stats`
    : slug
      ? `${formatSlugForDisplay(slug)} | Cycling Stats`
      : "Page | Cycling Stats";
  const pageHeading = apiTitle || (slug ? formatSlugForDisplay(slug) : "Page");
  console.log("pageHeading", apiTitle);
  // const srNoHeaderLabel = "";

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
                <h1 className="mb-0">{pageHeading}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="stat-main-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-center sdsd bts__wrap">
                  <div className="col">
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
                  </div>
                  {/* <div className="col text-end">
                    <Link className="glob-btn green-bg-btn" href="/stats">
                      <strong>ALLE STATS</strong>
                      <span className="green-circle-btn green-circle-btn-2">
                        <img alt="" src="/images/arow.svg" />
                      </span>
                    </Link>
                  </div> */}
                </div>
              </div>

              <div className="col-lg-9 col-md-7 mt-4 slug-table-main">
                <ul
                  className={`slug-table-head sdsd col--${getDynamicHeaders().length
                    }`}
                >
                  {/* <li className="sr_no">{srNoHeaderLabel}</li> */}
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
