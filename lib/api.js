import axios from 'axios';
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  // General rider stats
  mostRacingDays: '/stats/riderWithMostRacingDays',
  mostKMsRaced: '/stats/riderWithMostKMsRaced',
  ridersYetToStart: '/stats/ridersYetToStartTheSeason',
  mostTop5Wins: '/stats/riderWithMostTop5NoWins',
  mostSecondPlaces: '/stats/riderWithMostSecondPlaces',
  mostDNFs: '/stats/most-dnfs',
  mostKMsRace: '/stats/riderWithMostKMsRaced',
  mostmountainwins:'/stats/mostMountainClassificationWins',
  
  // Stage and GC related
  mostStageWins: '/stats/most-stage-wins',
  mostPodiumInStages: '/stats/stage-podiums',
  mostGCWins: '/stats/most-gc-wins',
  stagePodiums: '/stats/stage-podiums',
  gcPodiums: '/stats/gc-podiums',
  gcTop10s: '/stats/gc-top10s',
  mostConsistentGC: '/stats/most-consistent-gc',
  sprintWins: '/stats/sprint-wins',
  grandTourstageWin: '/stats/grandTourStageWins',
 
  // Race___________
  raceCount: 'stats/getRecentYearRaceCount',
  longestRace: '/races/longestRaces',
  shortestRace: '/races/shortestRaces',
  racesMOstRiderfromSameTeam:'/races/mostRidersInTop10',
  bestCountryRanking:'/races/getBestCountryRanking',
  
  // Rider demographics
  oldestRider: '/stats/oldest',
  stageTop10sRider: '/stats/stage-top10s',
  oldestMostWins: '/stats/oldest-most-wins',
  youngestMostWins: '/stats/youngestMostWins',
  lightestRider:'/stats/lightestRider',
  mostweightRider:'/stats/most-weight',
 
  mostWin:'/stats/most-wins',
  youngestRider: '/stats/youngest',
  bestClassics: '/stats/best-classics',
  riderWithBirthday:'/stats/ridersWithBirthdates',
  teamWithMostNationalities:'/stats/teamWithMostNationalities',
  recentCompleteRace:'/stats/recentCompleteRace',
  finishRace:'/stats/FinishRace',
  getUpcomingRacesByDate:'/stats/getUpcomingRacesByDate',
  tourDownUnder24:'/stats/TourDownUnder24',
  mostWinTourDownUnder:'/stats/MostWinTourDownUnder',
 teamWithMostRider:'/stats/TeamWithMostRiderToWinARace',
 ridersWithBirthdayToday:'stats/ridersWithBirthdayToday',
tourDownUnderStage2:'/stats/TourDownUnderStage2',

  // Teams___________
  top3StageTeam:'/teams/getTop3StageTeams',
  topGCRiderbyTeam:'/teams/getTopGCRidersByTeam',
  DnfTeams:'/teams/getDNFTeamsInGC',
  topStageRiderbyTeam:'/teams/getTopStageRidersByTeam',
  top3teamwithrank1:'/teams/getTop3RankOneTeams',
  getTopStageRiders:'/teams/getTopStageRidersByTeam',
  top3GCTeam:'/teams/getTop3GCTeams',
  top10GCTeams:'teams/getTop10GCTeams',
  getMostConsistentGCTeams:'/teams/getMostConsistentGCTeams',
  filtersForApis:'/teams/getAllTeamsForFilters',
  top10Stageteams:'/teams/getTop10StageTeams',

  // __________________Riders page Api________________________
 olderstRiders:'/riders/oldestRiders',
youngestRiders:'api/riders/youngestRiders',
victoryRanking:'api/riders/victoryRanking'
};

// Helper function to build query string from parameters
const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Validate endpoint exists before making API call
const validateEndpoint = (endpointKey) => {
  if (!endpoints[endpointKey]) {
    throw new Error(`Invalid endpoint key: ${endpointKey}`);
  }
  return endpoints[endpointKey];
};

export const callAPI = async (method, endpoint, data = {}, queryParams = {}, extraHeaders = {}) => {  
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
      endpoint
    };
  }
};

export const getTeamsRiders = (searchQuery = '') => {
  // Add search query as a parameter if provided
  const queryParams = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';

  return API.get(`/teams/get-teams-riders${queryParams}`)
    .then(res => {
      if (!res.data || !res.data.data) {
        throw new Error('Invalid response format - missing data property');
      }
      return {
        data: res.data.data,
        status: 'success'
      };
    })
    .catch(error => {
      console.error('Error fetching team riders:', error);
      return {
        data: [],
        status: 'error',
        error: error.message || 'Failed to fetch team riders'
      };
    });
};

export const fetchData = async (endpointKey, queryParams = {}) => {
  try {
    const endpointPath = validateEndpoint(endpointKey);
    const queryString = buildQueryString(queryParams);
    const fullUrl = `${endpointPath}${queryString}`;
    
    const response = await API.get(fullUrl);
    return response.data;
  } catch (error) {
    if (error.message && error.message.includes('Invalid endpoint key')) {
      console.error(error.message);
      throw { message: error.message, type: 'ENDPOINT_ERROR' };
    }
    
    const statusCode = error.response?.status;
    const errorMsg = error.response?.data?.message || error.message;
    console.error(`Error fetching ${endpointKey} (${statusCode}):`, errorMsg);
    
    throw { 
      message: `Failed to fetch ${endpointKey}: ${errorMsg}`, 
      type: 'API_ERROR',
      status: statusCode
    };
  }
};

// export const fetchMultiple = async (endpointKeys, queryParams = {}) => {
//   const results = {};
//   const errors = {};

//   if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
//     throw new Error('Invalid endpoint keys: Must be a non-empty array');
//   }

//   // Create promises for each endpoint
//   const promises = endpointKeys.map(key => {
//     try {
//       // Validate the endpoint exists first
//       const endpointPath = validateEndpoint(key);
//       const queryString = buildQueryString(queryParams);
//       const fullUrl = `${endpointPath}${queryString}`;
      
//       return API.get(fullUrl)
//         .then(response => {
//           results[key] = response.data;
//           return null; // No error
//         })
//         .catch(error => {
//           const statusCode = error.response?.status;
//           const errorMsg = error.response?.data?.message || error.message;
//           console.error(`Error fetching ${key} (${statusCode}):`, errorMsg);
          
//           errors[key] = { 
//             message: errorMsg, 
//             status: statusCode,
//             endpoint: endpointPath
//           };
//           return null; // We handle errors in the collection
//         });
//     } catch (error) {
//       // Handle endpoint validation errors
      
//       console.error(`Invalid endpoint: ${key}`, error.message);
//       errors[key] = { 
//         message: error.message, 
//         type: 'ENDPOINT_ERROR',
//       };
//       return Promise.resolve(null); // Return resolved promise to not break Promise.all
//     }
//   });
  
//   // Wait for all promises to settle
//   await Promise.all(promises);
  
//   // Return both results and errors
//   return {
//     data: results,
//     errors: Object.keys(errors).length > 0 ? errors : null
//   };
// };

// export const fetchMultiple = async (endpointKeys, riderId, queryParams = {}, endpointsMappings = {}) => {
//   const results = {};
//   const errors = {};

//   if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
//     throw new Error('Invalid endpoint keys: Must be a non-empty array');
//   }

//   // Create promises for each endpoint
//   const promises = endpointKeys.map(key => {
//     try {
//       // Check if we have a custom endpoint mapping for this key
//       let endpointPath;
      
//       if (endpointsMappings[key]) {
//         // Replace :riderId placeholder with actual riderId
//         endpointPath = endpointsMappings[key].replace(':riderId', riderId);
//       } else {
//         // Fallback to standard format if no mapping exists
//         endpointPath = `/rider-stats/${riderId}/${key}`;
//       }
      
//       // Add query parameters
//       const queryString = buildQueryString(queryParams);
//       const fullUrl = `${endpointPath}${queryString}`;
      
//       return API.get(fullUrl)
//         .then(response => {
//           results[key] = response.data;
//           return null; // No error
//         })
//         .catch(error => {
//           const statusCode = error.response?.status;
//           const errorMsg = error.response?.data?.message || error.message;
//           console.error(`Error fetching ${key} (${statusCode}):`, errorMsg);
          
//           errors[key] = { 
//             message: errorMsg, 
//             status: statusCode,
//             endpoint: endpointPath
//           };
//           return null; // We handle errors in the collection
//         });
//     } catch (error) {
//       // Handle endpoint validation errors
//       console.error(`Invalid endpoint: ${key}`, error.message);
//       errors[key] = { 
//         message: error.message, 
//         type: 'ENDPOINT_ERROR',
//       };
//       return Promise.resolve(null); // Return resolved promise to not break Promise.all
//     }
//   });
  
//   // Wait for all promises to settle
//   await Promise.all(promises);
  
//   // Return both results and errors
//   return {
//     data: results,
//     errors: Object.keys(errors).length > 0 ? errors : null
//   };
// };

/**
 * Fetch data from multiple endpoints
 * @param {string[]} endpointKeys - Array of endpoint keys
 * @param {Object} options - Optional parameters
 * @param {string|null} options.id - ID to use for endpoints that require an ID
 * @param {Object} options.queryParams - Query parameters to pass to endpoints
 * @param {Object} options.endpointsMappings - Custom endpoint mappings
 * @param {string} options.idType - Type of ID, e.g., "rider", "race", etc. Defaults to "rider"
 * @returns {Promise<Object>} Object containing data and errors
 */
export const fetchMultiple = async (
  endpointKeys, 
  options = {}
) => {
  const {
    id = null,
    queryParams = {},
    endpointsMappings = {},
    idType = "rider",
     name=null,
  } = options;
  
  const results = {};
  const errors = {};

  if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
    throw new Error('Invalid endpoint keys: Must be a non-empty array');
  }

  // Create promises for each endpoint
  const promises = endpointKeys.map(key => {
    try {
      let endpointPath;
      
      // Determine how to construct the endpoint path based on different scenarios
      if (endpointsMappings[key]) {
        // 1. If we have a custom endpoint mapping for this key
        endpointPath = id ? endpointsMappings[key].replace(':id', id) : endpointsMappings[key];
      } else if (id) {
        // 2. If we have an ID, use the ID-based endpoint format
        endpointPath = `/${idType}-stats/${id}/${key}`;
      }
      else if (name) {
        // 2. If we have an name, use the ID-based endpoint format
        endpointPath = `/${idType}/${name}/${key}`;
      } else {
        // 3. Fallback to standard endpoint from the endpoints object
        endpointPath = validateEndpoint(key);
      }
      
      // Add query parameters
      const queryString = buildQueryString(queryParams);
      const fullUrl = `${endpointPath}${queryString}`;
      
      return API.get(fullUrl)
        .then(response => {
          results[key] = response.data;
          return null; // No error
        })
        .catch(error => {
          const statusCode = error.response?.status;
          const errorMsg = error.response?.data?.message || error.message;
          console.error(`Error fetching ${key} (${statusCode}):`, errorMsg);
          
          errors[key] = { 
            message: errorMsg, 
            status: statusCode,
            endpoint: endpointPath
          };
          return null; // We handle errors in the collection
        });
    } catch (error) {
      // Handle endpoint validation errors
      console.error(`Invalid endpoint: ${key}`, error.message);
      errors[key] = { 
        message: error.message, 
        type: 'ENDPOINT_ERROR',
      };
      return Promise.resolve(null); // Return resolved promise to not break Promise.all
    }
  });
  
  // Wait for all promises to settle
  await Promise.all(promises);
  
  // Return both results and errors
  return {
    data: results,
    errors: Object.keys(errors).length > 0 ? errors : null
  };
};