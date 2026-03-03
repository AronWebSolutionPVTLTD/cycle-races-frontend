// pages/[slug]/index.jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { callAPI, fetchData } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import { ListSkeleton } from "@/components/loading&error";
import { SLUG_CONFIGS } from "@/lib/slug-config";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { generateYearOptions } from "@/components/GetYear";
import getItemId from "@/pages/getId";
import { renderFlag } from "@/components/RenderFlag";
import { useTranslation } from "@/lib/useTranslation";

// export async function getServerSideProps(context) {
//   const { params, query } = context;
//   const { slug } = params || {};
//   const year = query.year || new Date().getFullYear().toString();

//   if (slug && !SLUG_CONFIGS[slug]) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       year,
//     },
//   };
// }
const getItemValue = (item, possibleKeys, defaultValue = "N/A") => {
  for (const key of possibleKeys) {
    if (key.includes(".")) {
      const keys = key.split(".");
      let value = item;
      for (const k of keys) {
        if (value && value[k] !== undefined && value[k] !== null) {
          value = value[k];
        } else {
          value = null;
          break;
        }
      }
      if (value !== null && value !== undefined) {
        return value;
      }
    } else {
      if (item[key] !== undefined && item[key] !== null) {
        return item[key];
      }
    }
  }
  return defaultValue;
};

const getCountryCode = (item, config) => {
  const country = getItemValue(item, config.itemConfig.country, "default");
  return country.toUpperCase();
};

export default function DynamicSlugPage({ year, teamName }) {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiTitle, setApiTitle] = useState(null); 
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  // const { withoutAllTime } = generateYearOptions();
  const { withAllTime, withoutAllTime } = generateYearOptions();

const yearOptions =
  slug === "rider-with-most-uci-points"
    ? withAllTime
    : withoutAllTime;
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    year || currentYear.toString()
  );
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year.toString());
  }

  // const getFilteredYears = (searchValue) => {
  //   if (!searchValue || searchValue.trim() === "") {
  //     return withoutAllTime;
  //   }
  //   const hasNumbers = /\d/.test(searchValue);
  //   if (hasNumbers) {
  //     return withoutAllTime.filter((year) =>
  //       year.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   }
  //   return withoutAllTime;
  // };
  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      return yearOptions;
    }
  
    const hasNumbers = /\d/.test(searchValue);
  
    if (hasNumbers) {
      return yearOptions.filter((year) =>
        year.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  
    return yearOptions;
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
const config = getSlugConfig(slug);

  useEffect(() => {
    if (slug) {
      fetchSlugData();
    }
  }, [slug, selectedYear]);

  const fetchSlugData = async () => {
    setLoading(true);
    try {
      const config = getSlugConfig(slug);

      const { rider_country, team_name, name, nationality } = router.query;

      const queryParams = {};
      // if (selectedYear) queryParams.year = selectedYear;
      if (
        selectedYear &&
        selectedYear !== "All-time" && 
        config.showYearFilter !== false
      ) {
        queryParams.year = selectedYear;
      }
      if (rider_country) queryParams.rider_country = rider_country;
      if (team_name) queryParams.team_name = team_name;
      if (nationality) queryParams.nationality = nationality;

      const response = await fetchData(config.apiEndpoint, queryParams, {
        name: name,
        idType: config.idType,
      });
      if (response && response.data) {
        if (response?.data?.riders) {
          response.data = response?.data?.riders;
        }
        if (slug === "rider-with-most-wins-in-team-history") {
          response.data = response?.data?.list;
        }
        if (slug === "last-victories") {
          response.data = response?.data?.last_victories;
        }
        if (slug === "amount-of-classic-wins") {
          response.data = response?.data?.classics;
        }
        if (slug === "grand-tour-wins") {
          response.data = response?.data?.wins;
        }
        if (slug === "current-uci-team-ranking") {
          response.data = response?.data?.wins;
        }
        if (slug === "last-5-wins") {
          response.data = response?.data?.wins;
        }
        if (slug === "best-monuments-results") {
          response.data = response?.data?.best_monument_results;
        }
        if (slug === "most-successful-race") {
          response.data = response?.data?.all_race_victories;
        }
        if (slug === "different-nationalities") {
          response.data = response?.data?.different_nationality_riders;
        }
        if (slug === "total-wins-per-year") {
          response.data = response?.data?.wins[0]?.stages
        }

        setPageData(response.data);
        if (response.message) {
          setApiTitle(response.message);
        }
        setError(null);
      }
      else if (response && response.podiums) {
        setPageData(response.podiums);
        if (response.message) {
          setApiTitle(response.message);
        }
        setError(null);
      }
      else {
        setError(t("common.no_data_found"));
      }
    } catch (err) {
      console.error("Error fetching slug data:", err);
      setError(t("common.no_data_found"));
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
      if (config.dataPath && pageData[config.dataPath]) {
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
        {error}
        </div>
      );
    }

    if (!pageData || pageData.length === 0) {
      return (
        <li
          className="empty-state ctm-empty-state"
          style={{ textAlign: "center", padding: "20px" }}
        >
          {t("common.unable_to_load_statistics")}
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

  const hasTeamData = (data, config) => {
    return data.some((item) => {
      for (const key of config.itemConfig.team) {
        if (key.includes(".")) {
          const keys = key.split(".");
          let value = item;
          for (const k of keys) {
            if (value && value[k] !== undefined && value[k] !== null) {
              value = value[k];
            } else {
              value = null;
              break;
            }
          }
          if (value !== null && value !== undefined && value !== "N/A") {
            return true;
          }
        } else {
          if (
            item[key] !== undefined &&
            item[key] !== null &&
            item[key] !== "N/A"
          ) {
            return true;
          }
        }
      }
      return false;
    });
  };

  const hasNameData = (data, config) => {
    return data.some((item) => {
      for (const key of config.itemConfig.name) {
        if (key.includes(".")) {
          const keys = key.split(".");
          let value = item;
          for (const k of keys) {
            if (value && value[k] !== undefined && value[k] !== null) {
              value = value[k];
            } else {
              value = null;
              break;
            }
          }
          if (value !== null && value !== undefined && value !== "N/A") {
            return true;
          }
        } else {
          if (
            item[key] !== undefined &&
            item[key] !== null &&
            item[key] !== "N/A"
          ) {
            return true;
          }
        }
      }
      return false;
    });
  };

  const hasCountData = (data, config) => {
    return data.some((item) => {
      for (const key of config.itemConfig.count) {
        if (key.includes(".")) {
          const keys = key.split(".");
          let value = item;
          for (const k of keys) {
            if (value && value[k] !== undefined && value[k] !== null) {
              value = value[k];
            } else {
              value = null;
              break;
            }
          }
          if (value !== null && value !== undefined && value !== "N/A") {
            return true;
          }
        } else {
          if (
            item[key] !== undefined &&
            item[key] !== null &&
            item[key] !== "N/A"
          ) {
            return true;
          }
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
      // columns.push(
      //   <span key="srno" className="sr-no">
      //     {index + 1}
      //   </span>
      // );

      const queryParams = [];
      if (selectedYear) queryParams.push(`year=${selectedYear}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      if (nameDataExists) {

        const riderOrRaceData = getItemId(item, config.itemConfig.name);

        // const clickableProps = riderId
        //   ? { onClick: () => router.push(`/riders/${riderId}`) }
        //   : {};
        const clickableProps = riderOrRaceData?.type === "race" ?
          { href: `/race-result/${encodeURIComponent(riderOrRaceData?.id)}${queryString}` } :
          riderOrRaceData?.type === "rider" ? { href: `/riders/${encodeURIComponent(riderOrRaceData?.id)}${queryString}` }
            : null;

        const nameContent = (
          <>
            <div className="d-flex flex-column">
              {`${getItemValue(item, config.itemConfig.name)} ${item?.type === "stage"
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
            <span key="srno" className="sr-no fw-900">
              {index + 1}.
            </span>
            {clickableProps?.href ? (
              <>
                <> {renderFlag(getCountryCode(item, config))}</>
                <Link {...clickableProps} className="link">
                  {nameContent}
                </Link>
              </>

            ) : (

              <>
                <> {renderFlag(getCountryCode(item, config))}</>
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
              { href: `/teams/${encodeURIComponent(Data?.id)}${queryString}` } :
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
              <span key="srno" className="sr-no fw-900">
                {index + 1}.
              </span>
              {clickableProps?.href ? (
                <> {renderFlag(getCountryCode(item, config))}
                  <Link {...clickableProps} className="link">
                    {teamContent}
                  </Link>
                </>
              ) : (
                <> {renderFlag(getCountryCode(item, config))}
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
            <div key="team" className={`team-name rider--name ${config.itemConfig.team.join(" ")}`}>
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
          <div key="count" className="count text-end">
            {getItemValue(item, config.itemConfig.count)}
          </div>
        );
      }

      return (
        <li
          key={item._id || item.id || index}
          className={`content-item ctm-head-heading hoverState-li dd table_cols_list col--${columns.length}`}
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

  const pageTitle = apiTitle
    ? `${apiTitle} | Cycling Stats`
    : slug
      ? `${formatSlugForDisplay(slug)} | Cycling Stats`
      : "Page | Cycling Stats";
  const pageHeading = apiTitle ||" Loading...";

  return (
    <>
      <Head>
        <title>{teamName || "..."} statistieken | Wielerstats</title>
        <meta name="description" content={`${pageHeading || "..."} van ${teamName || "..."}.Teamstatistieken, uitslagen en prestaties overzichtelijk weergegeven op Wielerstats.`}/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="inner-pages-main pt-md-0 mb-pt-161px">
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
                      <Link href="/teams">{t("common.team")}</Link>
                    </li>
                    <li>{pageHeading}</li>
                  </ul>
                  <div className="ctm-page-header mb-0">
                    <h1 className="mb-0">{pageHeading}</h1>
                    <p className="ctm-page-description mb-0">Deze ranking toont <span className="green_color_text">'{pageHeading || "..."}'</span> van <span className="green_color_text">{teamName || "..."}</span>. De resultaten zijn gebaseerd op officiële wedstrijduitslagen en worden continu bijgewerkt.</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <section className="stat-main-sec">
            <div className="container">
              <div className="row">
                <div className={`col-lg-12 ${config.showYearFilter === false ? "d-none" : "mb-md-4 mb-0"}`}>
                  <div className="row align-items-center sdsd bts__wrap">
                    <div className="col">
                      <ul className="filter">
                        {config.showYearFilter && (
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
                        )}
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

                <div className="col-lg-9 col-md-12 slug-table-main">
                  <ul
                    className={`slug-table-head col--${getDynamicHeaders().length
                      }`}
                  >
                    {/* <li className="sr_no">{srNoHeaderLabel}</li> */}
                    {getDynamicHeaders().map((header, index) => (
                      <li key={index} className={header}>
                        {t(`table.${header.toLowerCase().replace(/\s+/g, "_")}`)}</li>
                    ))}
                  </ul>

                  <ul className="slug-table-body team-slug-table-body">{renderContent()}</ul>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { slug, name } = params;
  const year = query.year || new Date().getFullYear().toString();

  if (slug && !SLUG_CONFIGS[slug]) {
    return { notFound: true };
  }

  let teamName = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/teamDetails/${name}/teamDetailsForTeamPage`
    );

    if (res.ok) {
      const json = await res.json();
      teamName = json?.data?.team_name || null;
    }
  } catch (err) {
    console.error("SSR team fetch error:", err);
  }

  return {
    props: {
      year,
      teamName,
    },
  };
}