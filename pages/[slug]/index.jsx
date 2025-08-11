// pages/[slug]/index.jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchData } from "@/lib/api";
import { useEffect, useState } from "react";
import { CardSkeleton, ListSkeleton } from "@/components/loading&error";
import Flag from "react-world-flags";

// Configuration for different slug types and their data structures
const SLUG_CONFIGS = {
  // Rider-related slugs
  'most-racing-days': {
    apiEndpoint: 'mostRacingDays',
    headers: ['NAME', 'TEAM', 'RACING DAYS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['racing_days', 'racingDays', 'count', 'total']
    }
  },
  'most-kms-raced': {
    apiEndpoint: 'mostKMsRaced',
    headers: ['NAME', 'TEAM', 'KMS RACED'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['kms_raced', 'kmsRaced', 'count', 'total']
    }
  },
  'most-wins': {
    apiEndpoint: 'mostWin',
    headers: ['NAME', 'TEAM', 'WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['wins', 'win_count', 'count', 'total']
    }
  },
  'most-stage-wins': {
    apiEndpoint: 'mostStageWins',
    headers: ['NAME', 'TEAM', 'STAGE WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['stage_wins', 'stageWins', 'count', 'total']
    }
  },
  'most-gc-wins': {
    apiEndpoint: 'mostGCWins',
    headers: ['NAME', 'TEAM', 'GC WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['gc_wins', 'gcWins', 'count', 'total']
    }
  },
  'oldest-riders': {
    apiEndpoint: 'oldestRider',
    headers: ['NAME', 'TEAM', 'AGE'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['age', 'rider_age', 'count', 'total']
    }
  },
  'youngest-riders': {
    apiEndpoint: 'youngestRider',
    headers: ['NAME', 'TEAM', 'AGE'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['age', 'rider_age', 'count', 'total']
    }
  },
  'most-dnfs': {
    apiEndpoint: 'mostDNFs',
    headers: ['NAME', 'TEAM', 'DNFS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['dnfs', 'dnf_count', 'count', 'total']
    }
  },
  'most-mountain-wins': {
    apiEndpoint: 'mostmountainwins',
    headers: ['NAME', 'TEAM', 'MOUNTAIN WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['mountain_wins', 'mountainWins', 'count', 'total']
    }
  },
  'most-sprint-wins': {
    apiEndpoint: 'sprintWins',
    headers: ['NAME', 'TEAM', 'SPRINT WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['sprint_wins', 'sprintWins', 'count', 'total']
    }
  },
  'most-top5-no-wins': {
    apiEndpoint: 'mostTop5Wins',
    headers: ['NAME', 'TEAM', 'TOP 5'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['top5_count', 'top5Count', 'count', 'total']
    }
  },
  'most-second-places': {
    apiEndpoint: 'mostSecondPlaces',
    headers: ['NAME', 'TEAM', 'SECOND PLACES'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['second_places', 'secondPlaces', 'count', 'total']
    }
  },
  'riders-yet-to-start': {
    apiEndpoint: 'ridersYetToStart',
    headers: ['NAME', 'TEAM', 'STATUS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['status', 'race_status', 'count', 'total']
    }
  },
  'best-classics': {
    apiEndpoint: 'bestClassics',
    headers: ['NAME', 'TEAM', 'CLASSIC WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['classic_wins', 'classicWins', 'count', 'total']
    }
  },
  'oldest-most-wins': {
    apiEndpoint: 'oldestMostWins',
    headers: ['NAME', 'TEAM', 'AGE', 'WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['wins', 'win_count', 'count', 'total'],
      age: ['age', 'rider_age']
    }
  },
  'youngest-most-wins': {
    apiEndpoint: 'youngestMostWins',
    headers: ['NAME', 'TEAM', 'AGE', 'WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['wins', 'win_count', 'count', 'total'],
      age: ['age', 'rider_age']
    }
  },
  'lightest-rider': {
    apiEndpoint: 'lightestRider',
    headers: ['NAME', 'TEAM', 'WEIGHT'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['weight', 'rider_weight', 'count', 'total']
    }
  },
  'most-weight-rider': {
    apiEndpoint: 'mostweightRider',
    headers: ['NAME', 'TEAM', 'WEIGHT'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['weight', 'rider_weight', 'count', 'total']
    }
  },
  'riders-with-birthday': {
    apiEndpoint: 'riderWithBirthday',
    headers: ['NAME', 'TEAM', 'BIRTHDAY'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['birthday', 'birth_date', 'count', 'total']
    }
  },
  'riders-birthday-today': {
    apiEndpoint: 'ridersWithBirthdayToday',
    headers: ['NAME', 'TEAM', 'BIRTHDAY'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['birthday', 'birth_date', 'count', 'total']
    }
  },
  'team-most-nationalities': {
    apiEndpoint: 'teamWithMostNationalities',
    headers: ['TEAM', 'NATIONALITIES'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['nationalities', 'nationality_count', 'count', 'total']
    }
  },
  'team-most-riders': {
    apiEndpoint: 'teamWithMostRider',
    headers: ['TEAM', 'RIDERS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['riders', 'rider_count', 'count', 'total']
    }
  },
  // Race-related slugs
  'longest-races': {
    apiEndpoint: 'longestRace',
    headers: ['RACE', 'DISTANCE'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['race_type', 'type', 'category'],
      country: ['race_country', 'country'],
      count: ['distance', 'race_distance', 'count', 'total']
    }
  },
  'shortest-races': {
    apiEndpoint: 'shortestRace',
    headers: ['RACE', 'DISTANCE'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['race_type', 'type', 'category'],
      country: ['race_country', 'country'],
      count: ['distance', 'race_distance', 'count', 'total']
    }
  },
  'most-riders-same-team': {
    apiEndpoint: 'racesMOstRiderfromSameTeam',
    headers: ['RACE', 'TEAM', 'RIDERS'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['race_country', 'country'],
      count: ['riders', 'rider_count', 'count', 'total']
    }
  },
  'best-country-ranking': {
    apiEndpoint: 'bestCountryRanking',
    headers: ['COUNTRY', 'RANKING'],
    dataPath: 'data',
    itemConfig: {
      name: ['country_name', 'countryName', 'name'],
      team: ['country_code', 'code'],
      country: ['country_code', 'code'],
      count: ['ranking', 'rank', 'count', 'total']
    }
  },
  'recent-complete-race': {
    apiEndpoint: 'recentCompleteRace',
    headers: ['RACE', 'STATUS'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['race_type', 'type', 'category'],
      country: ['race_country', 'country'],
      count: ['status', 'race_status', 'count', 'total']
    }
  },
  'finish-race': {
    apiEndpoint: 'finishRace',
    headers: ['RACE', 'STATUS'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['race_type', 'type', 'category'],
      country: ['race_country', 'country'],
      count: ['status', 'race_status', 'count', 'total']
    }
  },
  'upcoming-races': {
    apiEndpoint: 'getUpcomingRacesByDate',
    headers: ['RACE', 'DATE'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['race_type', 'type', 'category'],
      country: ['race_country', 'country'],
      count: ['date', 'race_date', 'count', 'total']
    }
  },
  'tour-down-under-24': {
    apiEndpoint: 'tourDownUnder24',
    headers: ['RACE', 'DETAILS'],
    dataPath: 'data',
    itemConfig: {
      name: ['race_name', 'raceName', 'name'],
      team: ['race_type', 'type', 'category'],
      country: ['race_country', 'country'],
      count: ['details', 'race_details', 'count', 'total']
    }
  },
  'most-win-tour-down-under': {
    apiEndpoint: 'mostWinTourDownUnder',
    headers: ['NAME', 'TEAM', 'WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['wins', 'win_count', 'count', 'total']
    }
  },
  'tour-down-under-stage2': {
    apiEndpoint: 'tourDownUnderStage2',
    headers: ['NAME', 'TEAM', 'RESULT'],
    dataPath: 'data',
    itemConfig: {
      name: ['rider_name', 'riderName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['rider_country', 'riderCountry', 'country'],
      count: ['result', 'stage_result', 'count', 'total']
    }
  },
  // Team-related slugs
  'top3-stage-teams': {
    apiEndpoint: 'top3StageTeam',
    headers: ['TEAM', 'STAGE WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['stage_wins', 'stageWins', 'count', 'total']
    }
  },
  'top-gc-riders-by-team': {
    apiEndpoint: 'topGCRiderbyTeam',
    headers: ['TEAM', 'GC RIDERS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['gc_riders', 'gcRiders', 'count', 'total']
    }
  },
  'dnf-teams-gc': {
    apiEndpoint: 'DnfTeams',
    headers: ['TEAM', 'DNFS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['dnfs', 'dnf_count', 'count', 'total']
    }
  },
  'top-stage-riders-by-team': {
    apiEndpoint: 'topStageRiderbyTeam',
    headers: ['TEAM', 'STAGE RIDERS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['stage_riders', 'stageRiders', 'count', 'total']
    }
  },
  'top3-rank-one-teams': {
    apiEndpoint: 'top3teamwithrank1',
    headers: ['TEAM', 'RANK 1'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['rank1_count', 'rank1Count', 'count', 'total']
    }
  },
  'top3-gc-teams': {
    apiEndpoint: 'top3GCTeam',
    headers: ['TEAM', 'GC WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['gc_wins', 'gcWins', 'count', 'total']
    }
  },
  'top10-gc-teams': {
    apiEndpoint: 'top10GCTeams',
    headers: ['TEAM', 'GC WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['gc_wins', 'gcWins', 'count', 'total']
    }
  },
  'most-consistent-gc-teams': {
    apiEndpoint: 'getMostConsistentGCTeams',
    headers: ['TEAM', 'CONSISTENCY'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['consistency', 'consistency_score', 'count', 'total']
    }
  },
  'top10-stage-teams': {
    apiEndpoint: 'top10Stageteams',
    headers: ['TEAM', 'STAGE WINS'],
    dataPath: 'data',
    itemConfig: {
      name: ['team_name', 'teamName', 'name'],
      team: ['team_name', 'teamName', 'team'],
      country: ['team_country', 'teamCountry', 'country'],
      count: ['stage_wins', 'stageWins', 'count', 'total']
    }
  },
};

// Helper function to get value from item using multiple possible keys
const getItemValue = (item, possibleKeys, defaultValue = 'N/A') => {
  for (const key of possibleKeys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return defaultValue;
};

// Helper function to get country code for flag
const getCountryCode = (item, config) => {
  const country = getItemValue(item, config.itemConfig.country, 'default');
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
    return SLUG_CONFIGS[slug] || {
      apiEndpoint: slug,
      headers: ['NAME', 'TEAM', 'COUNT'],
      dataPath: 'data',
      itemConfig: {
        name: ['rider_name', 'riderName', 'name'],
        team: ['team_name', 'teamName', 'team'],
        country: ['rider_country', 'riderCountry', 'country'],
        count: ['count', 'total']
      }
    };
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
      
      // Hit the API with the slug parameter
      const response = await fetchData(config.apiEndpoint, { slug: slug });

      if (response && response.data) {
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

  // Get dynamic headers based on slug configuration
  const getDynamicHeaders = () => {
    const config = getSlugConfig(slug);
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

  // Render list content with configuration
  const renderListContent = (data, config) => {
    return data.map((item, index) => {
      const columns = [];

      // NAME column with flag
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

      // TEAM column
      columns.push(
        <div key="team" className="team-name">
          {getItemValue(item, config.itemConfig.team)}
        </div>
      );

      // COUNT column (or additional columns based on config)
      if (config.headers.includes('AGE') && config.itemConfig.age) {
        columns.push(
          <div key="age" className="age">
            {getItemValue(item, config.itemConfig.age)}
          </div>
        );
      }

      columns.push(
        <div key="count" className="count">
          {getItemValue(item, config.itemConfig.count)}
        </div>
      );

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
