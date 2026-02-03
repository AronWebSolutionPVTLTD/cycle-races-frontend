import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const endpoints = {
  // General rider stats
  mostRacingDays: "/stats/riderWithMostRacingDays",
  mostKMsRaced: "/stats/riderWithMostKMsRaced",
  ridersYetToStart: "/stats/ridersYetToStartTheSeason",
  mostTop5Wins: "/stats/riderWithMostTop5NoWins",
  mostSecondPlaces: "/stats/riderWithMostSecondPlaces",
  mostDNFs: "/stats/most-dnfs",
  mostKMsRace: "/stats/riderWithMostKMsRaced",
  mostmountainwins: "/stats/mostMountainClassificationWins",

  // Stage and GC related
  mostStageWins: "/stats/most-stage-wins",
  mostPodiumInStages: "/stats/stage-podiums",
  mostGCWins: "/stats/most-gc-wins",
  stagePodiums: "/stats/stage-podiums",
  gcPodiums: "/stats/gc-podiums",
  gcTop10s: "/stats/gc-top10s",
  mostConsistentGC: "/stats/most-consistent-gc",
  sprintWins: "/stats/sprint-wins",
  grandTourstageWin: "/stats/grandTourStageWins",

  // Race___________
  raceCount: "stats/getRecentYearRaceCount",
  longestRace: "/races/longestRaces",
  shortestRace: "/races/shortestRaces",
  racesMOstRiderfromSameTeam: "/races/mostRidersInTop10",
  bestCountryRanking: "/races/getBestCountryRanking",

  // Rider demographics
  oldestRider: "/stats/oldest",
  stageTop10sRider: "/stats/stage-top10s",
  oldestMostWins: "/stats/oldest-most-wins",
  youngestMostWins: "/stats/youngestMostWins",
  lightestRider: "/stats/lightestRider",
  mostweightRider: "/stats/most-weight",

  mostWin: "/stats/most-wins",
  youngestRider: "/stats/youngest",
  bestClassics: "/stats/best-classics",
  riderWithBirthday: "/stats/ridersWithBirthdates",
  teamWithMostNationalities: "/stats/teamWithMostNationalities",
  recentCompleteRace: "/stats/recentCompleteRace",
  finishRace: "/stats/FinishRace",
  getUpcomingRacesByDate: "/stats/getUpcomingRacesByDate",
  tourDownUnder24: "/stats/TourDownUnder24",
  mostWinTourDownUnder: "/stats/MostWinTourDownUnder",
  teamWithMostRider: "/stats/TeamWithMostRiderToWinARace",
  ridersWithBirthdayToday: "stats/ridersWithBirthdayToday",
  tourDownUnderStage2: "/stats/TourDownUnderStage2",

  // Teams___________
  top3StageTeam: "/teams/getTop3StageTeams",
  topGCRiderbyTeam: "/teams/getTopGCRidersByTeam",
  DnfTeams: "/teams/getDNFTeamsInGC",
  topStageRiderbyTeam: "/teams/getTopStageRidersByTeam",
  top3teamwithrank1: "/teams/getTop3RankOneTeams",
  getTopStageRiders: "/teams/getTopStageRidersByTeam",
  top3GCTeam: "/teams/getTop3GCTeams",
  top10GCTeams: "teams/getTop10GCTeams",
  getMostConsistentGCTeams: "/teams/getMostConsistentGCTeams",
  filtersForApis: "/teams/getAllTeamsForFilters",
  top10Stageteams: "/teams/getTop10StageTeams",

  // __________________Riders page Api________________________
  olderstRiders: "/riders/oldestRiders",
  youngestRiders: "/riders/youngestRiders",
  victoryRanking: "/riders/victoryRanking",
  getCurrentVictoryRanking: "/stages/getCurrentVictoryRanking",
  getCurrentTeamRanking: "/stages/getCurrentTeamRanking",
  getBestRidersOfRecentYear: "/stages/getBestRidersOfRecentYear",

  // __________________Teams page Api________________________
  TeamWithMostWinsThisYear: "/teamDetails/TeamWithMostWinsThisYear",
  teamRankingCurrentYear: "/teamDetails/teamRankingCurrentYear",
  OldestTeam: "/teamDetails/OldestTeam",

  // __________________Footer Api________________________
  footerMenu: "/api/footer/footermenu",
};

const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return "";

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

const validateEndpoint = (endpointKey) => {
  if (!endpoints[endpointKey]) {
    throw new Error(`Invalid endpoint key: ${endpointKey}`);
  }
  return endpoints[endpointKey];
};

export const callAPI = async (
  method,
  endpoint,
  data = {},
  queryParams = {},
  extraHeaders = {}
) => {
  try {
    const queryString = buildQueryString(queryParams);
    const fullUrl = `${endpoint}${queryString}`;

    const response = await API.request({
      method,
      url: fullUrl,
      data,
      headers: {
        ...extraHeaders,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    console.error(`API error (${statusCode}):`, errorMessage);
    throw {
      message: errorMessage,
      status: statusCode,
      endpoint,
    };
  }
};

export const getTeamsRiders = (searchQuery = "") => {
  const queryParams = searchQuery
    ? `?search=${encodeURIComponent(searchQuery)}`
    : "";

  return API.get(`/teams/get-teams-riders${queryParams}`)
    .then((res) => {
      if (!res.data || !res.data.data) {
        throw new Error("Invalid response format - missing data property");
      }
      return {
        data: res.data.data,
        status: "success",
      };
    })
    .catch((error) => {
      console.error("Error fetching team riders:", error);
      return {
        data: [],
        status: "error",
        error: error.message || "Failed to fetch team riders",
      };
    });
};

export const getTeamSearchList = (searchQuery = "") => {
  const queryParams = searchQuery
    ? `?search=${encodeURIComponent(searchQuery)}`
    : "";

  return API.get(`/teamDetails/teamSearchList${queryParams}`)
    .then((res) => {
      if (!res.data || res.data.status !== true || !res.data.data) {
        throw new Error("Invalid response format - missing data property");
      }
      return {
        data: res.data.data,
        status: "success",
      };
    })
    .catch((error) => {
      console.error("Error fetching team search list:", error);
      return {
        data: [],
        status: "error",
        error: error.response?.data?.message || error.message || "Failed to fetch team search list",
      };
    });
};

export const homePageSearch = (searchQuery = "") => {
  const queryParams = searchQuery
    ? `?search=${encodeURIComponent(searchQuery)}`
    : "";

  return API.get(`/stats/HomePageSearch${queryParams}`)
    .then((res) => {
      let rawData = [];
      if (Array.isArray(res.data)) {
        rawData = res.data;
      } else if (res.data?.data?.results && Array.isArray(res.data.data.results)) {
        rawData = res.data.data.results;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        rawData = res.data.results;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        rawData = res.data.data;
      }
      return {
        data: rawData,
        status: "success",
      };
    })
    .catch((error) => {
      console.error("Error fetching home page search results:", error);
      return {
        data: [],
        status: "error",
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch home page search results",
      };
    });
};



export const getH2HData = (id1, id2, year) => {
  const url = year && year !== "All-time"
    ? `/h2h/${id1}/${id2}/h2h?year=${year}`
    : `/h2h/${id1}/${id2}/h2h`;

  return API.get(url)
    .then((res) => {
      if (!res.data || !res.data.data) {
        throw new Error("Invalid response format - missing data property");
      }
      return {
        data: res.data.data,
        status: "success",
      };
    })
    .catch((error) => {
      console.error("Error fetching H2H data:", error);
      return {
        data: [],
        status: "error",
        error: error.message || "Failed to fetch H2H data",
      };
    });
};


export const fetchData = async (
  endpointKey,
  queryParams = {},
  options = {}
) => {
  const {
    id = null,
    name = null,
    idType = "rider",
    endpointsMappings = {},
  } = options;

  try {
    let endpointPath;
    if (endpointsMappings[endpointKey]) {
      endpointPath = id
        ? endpointsMappings[endpointKey].replace(":id", id)
        : endpointsMappings[endpointKey];
    } else if (id) {
      endpointPath = `/${idType}-stats/${id}/${endpointKey}`;
    } else if (name) {
      endpointPath = `/${idType}/${name}/${endpointKey}`;
    } else {
      endpointPath = validateEndpoint(endpointKey);
    }

    const queryString = buildQueryString(queryParams);
    const fullUrl = `${endpointPath}${queryString}`;
    const response = await API.get(fullUrl);
    return response.data;
  } catch (error) {
    if (error.message && error.message.includes("Invalid endpoint key")) {
      throw { message: error.message, type: "ENDPOINT_ERROR" };
    }

    const statusCode = error.response?.status;
    const errorMsg = error.response?.data?.message || error.message;
    console.error(`Error fetching ${endpointKey} (${statusCode}):`, errorMsg);

    throw {
      message: `Failed to fetch ${endpointKey}: ${errorMsg}`,
      type: "API_ERROR",
      status: statusCode,
    };
  }
};

export const fetchMultiple = async (endpointKeys, options = {}) => {
  const {
    id = null,
    queryParams = {},
    endpointsMappings = {},
    idType = "rider",
    name = null,
  } = options;

  const results = {};
  const errors = {};

  if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
    throw new Error("Invalid endpoint keys: Must be a non-empty array");
  }

  const promises = endpointKeys.map((key) => {
    try {
      let endpointPath;
      if (endpointsMappings[key]) {
        endpointPath = id
          ? endpointsMappings[key].replace(":id", id)
          : endpointsMappings[key];
      } else if (id) {
        endpointPath = `/${idType}-stats/${id}/${key}`;
      } else if (name) {
        const encodedName = encodeURIComponent(name);
        endpointPath = `/${idType}/${encodedName}/${key}`;
      } else {
        endpointPath = validateEndpoint(key);
      }

      const queryString = buildQueryString(queryParams);
      const fullUrl = `${endpointPath}${queryString}`;

      return API.get(fullUrl)
        .then((response) => {
          results[key] = response.data;
          return null;
        })
        .catch((error) => {
          const statusCode = error.response?.status;
          const errorMsg = error.response?.data?.message || error.message;
          console.error(`Error fetching ${key} (${statusCode}):`, errorMsg);

          errors[key] = {
            message: errorMsg,
            status: statusCode,
            endpoint: endpointPath,
          };
          return null;
        });
    } catch (error) {
      console.error(`Invalid endpoint: ${key}`, error.message);
      errors[key] = {
        message: error.message,
        type: "ENDPOINT_ERROR",
      };
      return Promise.resolve(null);
    }
  });
  await Promise.all(promises);
  return {
    data: results,
    errors: Object.keys(errors).length > 0 ? errors : null,
  };
};
