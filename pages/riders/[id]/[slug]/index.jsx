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
  if (!Array.isArray(possibleKeys)) return defaultValue;

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
  const isRiderResults = slug === "rider-results-this-year";

  const [resultStats, setResultStats] = useState(null);



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
        console.log("response?.data?.data2", response);
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
    const teamField = config?.itemConfig?.team;
    if (!teamField) return false;

    const teamKeys = Array.isArray(teamField) ? teamField : [teamField];

    return data.some((item) =>
      teamKeys.some((key) => {
        const value = item[key];
        return value !== undefined && value !== null && value !== "N/A";
      })
    );
  };


  // Helper function to check if name data exists in the dataset
  const hasNameData = (data, config) => {
    const nameField = config?.itemConfig?.name;
    if (!nameField) return false;

    const nameKeys = Array.isArray(nameField) ? nameField : [nameField];

    return data.some((item) =>
      nameKeys.some((key) => {
        const value = item[key];
        return value !== undefined && value !== null && value !== "N/A";
      })
    );
  };


  const hasCountData = (data, config) => {
    const countField = config?.itemConfig?.count;
    if (!countField) return false;

    const countKeys = Array.isArray(countField) ? countField : [countField];

    return data.some((item) =>
      countKeys.some((key) => {
        const value = item[key];
        return value !== undefined && value !== null && value !== "N/A";
      })
    );
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

  // get date 

  function convertDateRange(dateStr) {
    const monthNames = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    const format = (d) => {
      const [day, month] = d.split(".");
      return {
        day: parseInt(day),
        month: parseInt(month)
      };
    };

    if (dateStr.includes(" - ")) {
      const [start, end] = dateStr.split(" - ");
      const startDate = format(start);
      const endDate = format(end);

      // Check if same month
      if (startDate.month === endDate.month) {
        return {
          start: `${startDate.day} - ${endDate.day} ${monthNames[startDate.month - 1]}`,
          end: null,
        };
      } else {
        // Different months - keep current format
        const formatOld = (d) => {
          const [day, month] = d.split(".");
          return `${day.padStart(2, "0")}/${month.padStart(2, "0")}`;
        };
        return {
          start: formatOld(start),
          end: formatOld(end),
        };
      }
    } else {
      // Single date
      const date = format(dateStr);
      return {
        start: `${date.day} ${monthNames[date.month - 1]}`,
        end: null,
      };
    }
  }


  // Render list content with configuration
  const renderListContent = (data, config) => {
    console.log("rider-results-this-year", data);

    // TEAM / NAME / COUNT detection
    const teamDataExists = hasTeamData(data, config);
    const nameDataExists =
      hasNameData(data, config) || data.some((item) => item.race_name);
    const countDataExists = hasCountData(data, config);

    return data.map((item, index) => {
      const { start, end } = item?.date ? convertDateRange(item.date) : {};

      const columns = [];

      // ----------------------------
      // NAME COLUMN (race_name fallback)
      // ----------------------------
      if (nameDataExists) {
        // Entity always a race for this slug
        const entity = {
          id: item.race_name,
          type: "race",
        };

        const hasEntity = entity?.id && entity?.type;

        const raceDate = item?.race_date?.split(".") || [];
        const year = raceDate[2] || item?.year || "";
        const month = raceDate[1] || "";
        const stageNumber = item?.stage_number || "";
        const tabName = item?.tab_name || "";

        // const url = hasEntity
        //   ? `/race-result/${entity.id}?year=${year}&month=${month}&stageNumber=${stageNumber}&tab=${tabName}`
        //   : null;

        const url = hasEntity
        ? `/races/${getItemValue(item, config.itemConfig.name)}`
        : null;
       
        const displayName =
          getItemValue(item, config.itemConfig?.name) || item.race_name;

     // Date + Race Column
     columns.push(
      <>
        {/* ------ DATE / SR NO ------ */}
        <span className="text-capitalize date-col">
          {item?.date ? (
            <>
              {start}
              {end ? ` - ${end}` : ""}
            </>
          ) : (
            item?.year || <span className="sr-no">{index + 1}.</span>
          )}
        </span>
    
        {/* ------ RACE NAME ------ */}
        <h5
          key="date-race"
          className={`rider--name race-name-el ${hasEntity ? "clickable" : ""}`}
          {...(hasEntity ? { onClick: () => router.push(url) } : {})}
        >
          {hasEntity ? (
            <>
            <Flag
            code={getCountryCode(item, config)}
            style={{
              width: "30px",
              height: "20px",
              flexShrink: 0,
              marginRight: "10px",
            }}
          />
            <Link href={url} className="link fw-900 d-flex ">
              
    
              <div>
                <div className="race-title fw-900 text-uppercase ">
                  {/* MOBILE TRUNCATE */}
                  <span className="d-md-none mobile-name">
                    {displayName.length > 30
                      ? `${displayName.slice(0, 30)}...`
                      : displayName}
                  </span>
    
                  {/* DESKTOP FULL */}
                  <span className="d-none d-md-inline">{displayName}</span>
    
                  {item?.stage_number && (
                    <span className="d-none d-md-inline">
                      {`: Stage ${item.stage_number}`}
                    </span>
                  )}
                </div>
    
                {item?.stage_number && (
                  <>
    
                    <div className="most-dnfs-start-end loction d-none d-md-block">
                      {item?.start_location}
                      {item?.start_location && item?.finish_location ? " - " : ""}
                      {item?.finish_location}
                      {item?.distance ? ` (${item.distance} km)` : ""}
                    </div>
                  </>
                )}
              </div>
            </Link>
            {item?.stage_number && (
                <>
                  <div className="most-dnfs-start-end loction d-block d-md-none">
                    {item?.start_location}
                    {item?.start_location && item?.finish_location ? " - " : ""}
                    {item?.finish_location}
                    {item?.distance ? ` (${item.distance} km)` : ""}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Flag
                code={getCountryCode(item, config)}
                style={{
                  width: "30px",
                  height: "20px",
                  flexShrink: 0,
                  marginRight: "10px",
                }}
              />
    
              <div>
                <div className="race-title fw-900 text-uppercase">
                  {displayName}
                </div>
              </div>
            </>
          )}
        </h5>
      </>
    );
    

      }

      // ----------------------------
      // TEAM COLUMN
      // ----------------------------
      if (teamDataExists) {
        if (!nameDataExists) {
          columns.push(
            <h5 key="team" className="rider--name">
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
          columns.push(
            <div key="team" className="team-name date">
              {getItemValue(item, config.itemConfig.team)}
            </div>
          );
        }
      }

      // ----------------------------
      // AGE COLUMN
      // ----------------------------
      if (config.headers.includes("AGE") && config.itemConfig.age) {
        columns.push(
          <div key="age" className="age">
            {getItemValue(item, config.itemConfig.age)}
          </div>
        );
      }

      // ----------------------------
      // COUNT COLUMN
      // ----------------------------
     if (countDataExists) {
  const countValue = String(getItemValue(item, config.itemConfig.count));

  columns.push(
    <div
      key="count"
      className={`count rank text-end ${isRiderResults ? "rider-count" : ""}`}
    >
      {isRiderResults
        ? countValue.split("").map((digit, i) => <div key={i}>{digit}</div>)
        : countValue}
    </div>
  );
}



      return (
        <li
          key={item._id || item.id || index}
          className={`content-item ctm-head-heading riders-inner hoverState-li table_cols_list col--${columns.length} mb-0`}
        >
          {columns}
        </li>
      );
    });
  };

  useEffect(() => {
    const config = getSlugConfig(slug);

    if (config.apiEndpoint === "getRiderWinsPodiumsTop10sCurrentYear") {



      if (pageData) {
        setResultStats({
          top10_count: pageData.top10_count ?? 0,
          wins_count: pageData.wins_count ?? 0,
          podium_count: pageData.podium_count ?? 0
        });
      }
    }
  }, [slug, pageData]);


  // Render object content (for complex data structures)
  const renderObjectContent = (data, config) => {


    // -------------------------------------------------------------
    // SPECIAL HANDLING FOR rider-results-this-year
    // -------------------------------------------------------------
    if (config.apiEndpoint === "getRiderWinsPodiumsTop10sCurrentYear") {
      console.log(data);


      const list = data?.results_list || [];
      return renderListContent(list, config);
    }


    // Handle the specific data structure from your API
    if (data.data && Array.isArray(data.data)) {
      return renderListContent(data.data, config);
    }

    // Handle object data structure
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
            Class: {Array.isArray(data.class_filter)
              ? data.class_filter.join(", ")
              : data.class_filter}
          </div>
        );
      }

      if (data.data) {
        columns.push(
          <div key="data" className="data">
            Data: {Array.isArray(data.data)
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

    // Fallback
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



  // Custom heading overrides for specific slugs
  const getCustomHeading = (slug, apiTitle) => {
    // const customHeadings = {
    //   'last-victory': 'Rider Last Victory'
    // };

    // if (customHeadings[slug]) {
    //   return customHeadings[slug];
    // }

    return apiTitle || (slug ? formatSlugForDisplay(slug) : "Page");
  };

  const pageTitle = apiTitle
    ? `${apiTitle} | Cycling Stats`
    : slug
      ? `${formatSlugForDisplay(slug)} | Cycling Stats`
      : "Page | Cycling Stats";
  const pageHeading = getCustomHeading(slug, apiTitle);
  console.log("pageHeading", apiTitle);
  // const srNoHeaderLabel = "";

  console.log("resultStats", resultStats);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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



              <div className="col-lg-9 col-md-7 mt-4 slug-table-main rider-results-this-year">

                {isRiderResults && (
                  <div className="results-summary d-flex gap-3 align-items-center mb-5 mb-md-0">

                    <div className="stat-item wins">
                      <strong>WINS</strong>
                      <span>{resultStats?.wins_count}</span>
                    </div>

                    <span className="divider">|</span>

                    <div className="stat-item podium">
                      <strong>PODIUM</strong>
                      <span>{resultStats?.podium_count}</span>
                    </div>

                    <span className="divider">|</span>

                    <div className="stat-item top10">
                      <strong>TOP10</strong>
                      <span>{resultStats?.top10_count}</span>
                    </div>

                  </div>
                )}



                <ul
                  className={` ${isRiderResults ? " slug-table-head slug-table-head-isRiderResults ":"slug-table-head"}   sdsd col--${getDynamicHeaders().length
                    }`}
                >
                  {/* <li className="sr_no">{srNoHeaderLabel}</li> */}
                  {getDynamicHeaders().map((header, index) => (
                    <li className={`slug-list-head ${header}`} key={index}>{header}</li>
                  ))}
                </ul>

                <ul className="slug-table-body rider-res-table-body">{renderContent()}</ul>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
