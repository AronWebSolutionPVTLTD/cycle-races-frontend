import { fetchData, fetchMultiple } from '@/lib/api';
import { useState, useEffect } from 'react';

export const HomeData = (endpointKey, queryParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchData(endpointKey, queryParams);
        setData(result);
      } catch (err) {
        setError({
          message: err.message || 'An unknown error occurred',
          status: err.status || 'UNKNOWN',
          endpoint: endpointKey
        });
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [endpointKey, JSON.stringify(queryParams)]);

  return { data, loading, error };
};

// Hook for multiple endpoints with query parameters
// export const useMultipleData = (endpointKeys, queryParams = {}) => {
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [partialSuccess, setPartialSuccess] = useState(false);

//   useEffect(() => {
//     if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
//       setError('Invalid endpoint keys: Must be a non-empty array');
//       setLoading(false);
//       return;
//     }

//     const getData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setPartialSuccess(false);
        
//         const result = await fetchMultiple(endpointKeys, queryParams);
        
//         // Check if we have any errors
//         if (result.errors) {
//           const failedEndpoints = Object.keys(result.errors);
//           const successEndpoints = endpointKeys.filter(key => !failedEndpoints.includes(key));
          
//           if (successEndpoints.length > 0) {
//             setData(result.data);
//             setPartialSuccess(true);
            
//             // Set error info for failed endpoints
//             setError({
//               message: `Failed to fetch some endpoints: ${failedEndpoints.join(', ')}`,
//               details: result.errors,
//               failedEndpoints
//             });
//           } else {
//             setError({
//               message: 'Failed to fetch all requested endpoints',
//               details: result.errors
//             });
//           }
//         } else {
//           setData(result.data);
//         }
//       } catch (err) {
//         console.error('Error in useMultipleData hook:', err);
//         setError({
//           message: err.message || 'An unknown error occurred',
//           status: err.status || 'UNKNOWN'
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     getData();
//   }, [endpointKeys.join(','), JSON.stringify(queryParams)]);

//   return { data, loading, error, partialSuccess };
// };

// export const useMultipleData = (endpointKeys, riderId = null, queryParams = {}, endpointsMappings = {}) => {
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [partialSuccess, setPartialSuccess] = useState(false);

//   useEffect(() => {
//     if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
//       setError('Invalid endpoint keys: Must be a non-empty array');
//       setLoading(false);
//       return;
//     }

//     const getData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setPartialSuccess(false);
        
//         const result = await fetchMultiple(endpointKeys, riderId, queryParams, endpointsMappings);
        
//         // Check if we have any errors
//         if (result.errors) {
//           const failedEndpoints = Object.keys(result.errors);
//           const successEndpoints = endpointKeys.filter(key => !failedEndpoints.includes(key));
          
//           if (successEndpoints.length > 0) {
//             setData(result.data);
//             setPartialSuccess(true);
            
//             // Set error info for failed endpoints
//             setError({
//               message: `Failed to fetch some endpoints: ${failedEndpoints.join(', ')}`,
//               details: result.errors,
//               failedEndpoints
//             });
//           } else {
//             setError({
//               message: 'Failed to fetch all requested endpoints',
//               details: result.errors
//             });
//           }
//         } else {
//           setData(result.data);
//         }
//       } catch (err) {
//         console.error('Error in useMultipleData hook:', err);
//         setError({
//           message: err.message || 'An unknown error occurred',
//           status: err.status || 'UNKNOWN'
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     getData();
//   }, [JSON.stringify(endpointKeys), riderId, JSON.stringify(queryParams)]);

//   return { data, loading, error, partialSuccess };
// };

/**
 * Hook for fetching data from multiple endpoints with flexible configuration
 * @param {string[]} endpointKeys - Array of endpoint keys to fetch
 * @param {Object} options - Options for the fetchMultiple function
 * @param {string|null} options.id - ID to use in endpoints that require it (optional)
 * @param {Object} options.queryParams - Query parameters for the requests (optional)
 * @param {Object} options.endpointsMappings - Custom endpoint mappings (optional)
 * @param {string} options.idType - Type of ID, e.g., "rider", "race" (defaults to "rider")
 * @returns {Object} - Object containing data, loading state, error information, and partial success flag
 */
export const useMultipleData = (endpointKeys, options = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partialSuccess, setPartialSuccess] = useState(false);

  // Extract options, providing defaults
  const {
    id = null,
    queryParams = {},
    endpointsMappings = {},
    idType = "rider",
     name = null
  } = options;

    console.log(idType,'type',name,"name")

  useEffect(() => {
    if (!Array.isArray(endpointKeys) || endpointKeys.length === 0) {
      setError('Invalid endpoint keys: Must be a non-empty array');
      setLoading(false);
      return;
    }

    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPartialSuccess(false);
        
        // Pass options object to fetchMultiple
        const result = await fetchMultiple(endpointKeys, {
          id,
          queryParams,
          endpointsMappings,
          idType,
          name
        });
        
        // Check if we have any errors
        if (result.errors) {
          const failedEndpoints = Object.keys(result.errors);
          const successEndpoints = endpointKeys.filter(key => !failedEndpoints.includes(key));
          
          if (successEndpoints.length > 0) {
            setData(result.data);
            setPartialSuccess(true);
            
            // Set error info for failed endpoints
            setError({
              message: `Failed to fetch some endpoints: ${failedEndpoints.join(', ')}`,
              details: result.errors,
              failedEndpoints
            });
          } else {
            setError({
              message: 'Failed to fetch all requested endpoints',
              details: result.errors
            });
          }
        } else {
          setData(result.data);
        }
      } catch (err) {
        console.error('Error in useMultipleData hook:', err);
        setError({
          message: err.message || 'An unknown error occurred',
          status: err.status || 'UNKNOWN'
        });
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [JSON.stringify(endpointKeys), id, JSON.stringify(queryParams), idType,name]);

  return { data, loading, error, partialSuccess };
};