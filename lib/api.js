// import axios from 'axios';
// const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const API = axios.create({
//   baseURL: URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const endpoints = {
//   // General rider stats
//  mostRacingDays: '/stats/riderWithMostRacingDays',
//   mostKMsRaced: '/stats/riderWithMostKMsRaced',
//   ridersYetToStart: '/stats/ridersYetToStartTheSeason',
//   mostTop5NoWins: '/stats/riderWithMostTop5NoWins',
//   mostSecondPlaces: '/stats/riderWithMostSecondPlaces',
//   mostDNFs: '/stats/most-dnfs',
  
//   // Stage and GC related
//   mostStageWins: '/stats/most-stage-wins',
//   mostPodiumInStages: '/stats/stage-podiums',
//   mostGCWins: '/stats/most-gc-wins',
//   stagePodiums: '/stats/stage-podiums',
// gcPodiums: '/stats/gc-podiums',
//   gcTop10s: '/stats/gc-top10s',
//   mostConsistentGC: '/stats/most-consistent-gc',
//   sprintWins: '/stats/sprint-wins',
//  grandTourstageWin: 'stats/grandTourStageWins',
 
  
//   // Race___________
//  raceCount: 'stats/getRecentYearRaceCount',
// longestRace: '/races/longestRaces',
// shortestRace: '/races/shortestRaces',
// riderWithMostRacingDay:'stats/riderWithMostRacingDays',
// riderWithMostSecondPlaces:'/stats/riderWithMostSecondPlaces',
// riderWithMostTopWins:'/stats/riderWithMostTop5NoWins',
// racesMOstRiderfromSameTeam:'races/mostRidersInTop10',
// bestCountryRanking:'/races/getBestCountryRanking',
//   // Rider demographics
//   oldestRider: '/stats/oldest',
//   stageTop10sRider: '/stats/stage-top10s',
//   oldestMostWins: '/stats/oldest-most-wins',
//   youngestMostWins: '/stats/youngestMostWins',
//   lightestRider:'/stats/lightestRider',
//   mostweightRider:'stats/most-weight',
 
//  mostWin:'/stats/most-wins',
//  youngestRider: '/stats/youngest',
//   bestClassics: '/stats/best-classics',
//   riderWithBirthday:'/stats/ridersWithBirthdates',

//   // Teams___________
//   top3StageTeam:'/teams/getTop3StageTeams',
// topGCRiderbyTeam:'/teams/getTopGCRidersByTeam',
// DnfTeams:'/teams/getDNFTeamsInGC',
// topStageRiderbyTeam:'/teams/getTopStageRidersByTeam',
// top3teamwithrank1:'/teams/getTop3RankOneTeams',
// getTopStageRiders:'/teams/getTopStageRidersByTeam',
// top3GCTeam:'teams/getTop3GCTeams',
// getMostConsistentGCTeams:'/teams/getMostConsistentGCTeams',
// filtersForApis:'/teams/getAllTeamsForFilters'



// };

// // Validate endpoint exists before making API call
// const validateEndpoint = (endpointKey) => {
//   if (!endpoints[endpointKey]) {
//     throw new Error(`Invalid endpoint key: ${endpointKey}`);
//   }
//   return endpoints[endpointKey];
// };

// export const callAPI = async (method, endpoint, data = {}, extraHeaders = {}) => {  
//   try {
//     const response = await API.request({
//       method,
//       url: endpoint,
//       data,
//       headers: {
//         ...extraHeaders,
//       },
//     });

//     return response.data;
//   } catch (error) {
// const errorMessage = error.response?.data?.message || error.message;
//       const statusCode = error.response?.status;
//       console.error(`API error (${statusCode}):`, errorMessage);
//       throw { 
//         message: errorMessage, 
//         status: statusCode,
//         endpoint
//       };
//   }
// };

// export const getTeamsRiders = (searchQuery = '') => {
//   // Add search query as a parameter if provided
//   const queryParams = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';

//   return API.get(`/teams/get-teams-riders${queryParams}`)
//     .then(res => {
//       if (!res.data || !res.data.data) {
//         throw new Error('Invalid response format - missing data property');
//       }
//       return {
//         data: res.data.data,
//         status: 'success'
//       };
//     })
//     .catch(error => {
//       console.error('Error fetching team riders:', error);
//       return {
//         data: [],
//         status: 'error',
//         error: error.message || 'Failed to fetch team riders'
//       };
//     });
// };

// export const fetchData = async (endpointKey) => {

//   try {
//     const endpointPath = validateEndpoint(endpointKey);
//     const response = await API.get(endpointPath);
//     return response.data;
//   } catch (error) {
//     if (error.message && error.message.includes('Invalid endpoint key')) {
//       console.error(error.message);
//       throw { message: error.message, type: 'ENDPOINT_ERROR' };
//     }
    
//     const statusCode = error.response?.status;
//     const errorMsg = error.response?.data?.message || error.message;
//     console.error(`Error fetching ${endpointKey} (${statusCode}):`, errorMsg);
    
//     throw { 
//       message: `Failed to fetch ${endpointKey}: ${errorMsg}`, 
//       type: 'API_ERROR',
//       status: statusCode
//     };
//   }
// };


// export const fetchMultiple = async (endpointKeys) => {
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
      
//       return API.get(endpointPath)
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
  mostTop5NoWins: '/stats/riderWithMostTop5NoWins',
  mostSecondPlaces: '/stats/riderWithMostSecondPlaces',
  mostDNFs: '/stats/most-dnfs',
  
  // Stage and GC related
  mostStageWins: '/stats/most-stage-wins',
  mostPodiumInStages: '/stats/stage-podiums',
  mostGCWins: '/stats/most-gc-wins',
  stagePodiums: '/stats/stage-podiums',
  gcPodiums: '/stats/gc-podiums',
  gcTop10s: '/stats/gc-top10s',
  mostConsistentGC: '/stats/most-consistent-gc',
  sprintWins: '/stats/sprint-wins',
  grandTourstageWin: 'stats/grandTourStageWins',
 
  // Race___________
  raceCount: 'stats/getRecentYearRaceCount',
  longestRace: '/races/longestRaces',
  shortestRace: '/races/shortestRaces',
  riderWithMostRacingDay:'stats/riderWithMostRacingDays',
  riderWithMostSecondPlaces:'/stats/riderWithMostSecondPlaces',
  riderWithMostTopWins:'/stats/riderWithMostTop5NoWins',
  racesMOstRiderfromSameTeam:'races/mostRidersInTop10',
  bestCountryRanking:'/races/getBestCountryRanking',
  
  // Rider demographics
  oldestRider: '/stats/oldest',
  stageTop10sRider: '/stats/stage-top10s',
  oldestMostWins: '/stats/oldest-most-wins',
  youngestMostWins: '/stats/youngestMostWins',
  lightestRider:'/stats/lightestRider',
  mostweightRider:'stats/most-weight',
 
  mostWin:'/stats/most-wins',
  youngestRider: '/stats/youngest',
  bestClassics: '/stats/best-classics',
  riderWithBirthday:'/stats/ridersWithBirthdates',

  // Teams___________
  top3StageTeam:'/teams/getTop3StageTeams',
  topGCRiderbyTeam:'/teams/getTopGCRidersByTeam',
  DnfTeams:'/teams/getDNFTeamsInGC',
  topStageRiderbyTeam:'/teams/getTopStageRidersByTeam',
  top3teamwithrank1:'/teams/getTop3RankOneTeams',
  getTopStageRiders:'/teams/getTopStageRidersByTeam',
  top3GCTeam:'teams/getTop3GCTeams',
  getMostConsistentGCTeams:'/teams/getMostConsistentGCTeams',
  filtersForApis:'/teams/getAllTeamsForFilters'
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

export const fetchMultiple = async (endpointKeys, queryParams = {}) => {
  const results = {};
  const errors = {};

  if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
    throw new Error('Invalid endpoint keys: Must be a non-empty array');
  }

  // Create promises for each endpoint
  const promises = endpointKeys.map(key => {
    try {
      // Validate the endpoint exists first
      const endpointPath = validateEndpoint(key);
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