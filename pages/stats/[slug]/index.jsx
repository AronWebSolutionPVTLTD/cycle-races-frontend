// pages/[slug]/index.jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchData } from "@/lib/api";
import { useEffect, useState } from "react";
import { CardSkeleton, ListSkeleton } from "@/components/loading&error";
import Flag from "react-world-flags";
import { SLUG_CONFIGS } from "@/lib/slug-config";

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

export default function DynamicSlugPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiTitle, setApiTitle] = useState(null);

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
  }, [slug]);

  // Function to fetch data based on slug
  const fetchSlugData = async () => {
    setLoading(true);
    try {
      const config = getSlugConfig(slug);

      // Get query parameters from URL
      const { year, rider_country, team_name } = router.query;

      // Build query parameters object
      const queryParams = { slug: slug };
      if (year) queryParams.year = year;
      if (rider_country) queryParams.rider_country = rider_country;
      if (team_name) queryParams.team_name = team_name;

      // Hit the API with the slug parameter and query parameters
      const response = await fetchData(config.apiEndpoint, queryParams);
      if (response && response.data) {
        if (response?.data?.riders) {
          response.data = response.data.riders;
        }
        if (slug === "upcoming-races-last-year-riders") {
          response.data = response.data.races[0].last_year_top_riders;
        }
        if (slug === "most-win-upcoming-rider-last-year") {
          response.data = response.data.races[0].all_time_top_winners;
        }
        if (slug === "shortest-races") {
          response.data = [
            ...response.data.data.shortest_stage_races,
            ...response.data.data.shortest_one_day_races,
          ];
        }
        if (slug === "longest-races") {
          response.data = [
            ...response.data.data.longest_stage_races,
            ...response.data.data.longest_one_day_races,
          ];
        }
        if (slug === "top3-rank-one-teams-gc") {
          response.data = response.data.teams;
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

      // NAME column with flag - only add if name data exists
      if (nameDataExists) {
        columns.push(
          <div key="name" className="rider-name">
            <Flag
              code={getCountryCode(item, config)}
              style={{
                width: "30px",
                height: "20px",
                marginRight: "10px",
                flexShrink: 0,
              }}
            />
            <span>{getItemValue(item, config.itemConfig.name)}</span>
          </div>
        );
      }

      // TEAM column - only add if team data exists
      if (teamDataExists) {
        // If no name data exists, show flag with team
        if (!nameDataExists) {
          columns.push(
            <div key="team" className="team-name">
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
            </div>
          );
        } else {
          // If name data exists, show team without flag (flag is already shown with name)
          columns.push(
            <div key="team" className="team-name">
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
          <div key="count" className="count">
            {getItemValue(item, config.itemConfig.count)}
          </div>
        );
      }

      return (
        <li
          key={item._id || item.id || index}
          className="content-item ctm-head-heading"
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

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <main>
        <section className="riders-sec1">
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
                <h1>{pageHeading}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="home-banner riders-sec2">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h5>Popular</h5>
              </div>
              <div className="col-lg-9 col-md-7">
                <ul className="head-heading ctm-head-heading">
                  {getDynamicHeaders().map((header, index) => (
                    <li key={index}>{header}</li>
                  ))}
                </ul>

                <ul className="transparent-cart ctm-transparent-cart">
                  {renderContent()}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
