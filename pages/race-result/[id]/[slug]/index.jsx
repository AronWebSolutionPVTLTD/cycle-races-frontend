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
import getItemId from "@/pages/getId";
import { renderFlag } from "@/components/RenderFlag";


const getItemValue = (item, possibleKeys, defaultValue = "N/A") => {
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

const getRiderId = (item) => {
  const keys = ["rider_id", "riderId", "_id", "id", "rider_key"];
  for (const key of keys) {
    if (
      item &&
      item[key] !== undefined &&
      item[key] !== null &&
      item[key] !== ""
    ) {
      return item[key];
    }
  }
  return null;
};

export async function getServerSideProps(context) {
  const { year, month } = context.query;
  return {
    props: {
      year: year || new Date().getFullYear().toString(),
    },
  };
}

export default function DynamicSlugPage({ year }) {
  const router = useRouter();
  const { slug } = router.query;

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiTitle, setApiTitle] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    year || new Date().getFullYear().toString()
  );

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);
  const { withoutAllTime } = generateYearOptions();

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
    return `/race-result/${id}`;
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
    if (slug) {
      fetchSlugData();
    }
  }, [slug, selectedYear]);

  const fetchSlugData = async () => {
    setLoading(true);
    try {
      const config = getSlugConfig(slug);
      const { rider_country, team_name, id } = router.query;
      const queryParams = {};
      if (selectedYear) queryParams.year = selectedYear;
      if (rider_country) queryParams.rider_country = rider_country;
      if (team_name) queryParams.team_name = team_name;
      if (id) queryParams.id = id;
      const response = await fetchData(config.apiEndpoint, queryParams, {
        name: id,
        idType: config.idType,
      });
      if (response && response.data) {
        if (response?.data?.riders) {
          response.data = response?.data?.riders;
        }
        if (slug === "winning-nationality-for-this-race") {
          response.data = response?.data?.data?.[0]?.riders;
        }
        setPageData(response.data);
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
    let dataArray = pageData;
    if (config.dataPath && pageData[config.dataPath]) {
      dataArray = pageData[config.dataPath];
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
      if (nameDataExists) {

        const riderOrRaceData = getItemId(item, config.itemConfig.name);
        const clickableProps = riderOrRaceData?.type === "race" ?
          { href: `/race-result/${encodeURIComponent(riderOrRaceData?.id)}${queryString}` } :
          riderOrRaceData?.type === "rider" ? { href: `/riders/${encodeURIComponent(riderOrRaceData?.id)}${queryString}` }
            : null;

        const nameContent = (
          <>
            {`${getItemValue(item, config.itemConfig.name)} ${item?.type === "stage"
              ? `-${item?.type?.toUpperCase()} ${item?.stage_number}`
              : ""
              }`}
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
                  {nameContent}
                </Link>
              </>
            ) : (
              <> {renderFlag(getCountryCode(item, config))}
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
            <span>{getItemValue(item, config.itemConfig.team)}</span>

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
            <div key="team" className="team-name rider--name">
              {clickableProps?.href ? (
                <Link {...clickableProps} className="link">
                  {teamValue}
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
          className={`content-item ctm-head-heading hoverState-li table_cols_list d col--${columns.length}`}
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
  const pageHeading = apiTitle || (slug ? formatSlugForDisplay(slug) : "Page");

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <section className="slug-main-section ppp">
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
                </div>
              </div>

              <div className="col-lg-9 col-md-12 mt-4 slug-table-main">
                <ul
                  className={`slug-table-head col--${getDynamicHeaders().length
                    }`}
                >
                  {getDynamicHeaders().map((header, index) => (
                    <li key={index}>{header}</li>
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
