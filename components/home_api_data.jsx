
// import { fetchData, fetchMultiple } from '@/lib/api';
// import { useState, useEffect } from 'react';

// export const HomeData = (endpointKey) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await fetchData(endpointKey);
//         setData(result);
//       } catch (err) {
//         setError({
//           message: err.message || 'An unknown error occurred',
//           status: err.status || 'UNKNOWN',
//           endpoint: endpointKey
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     getData();
//   }, [endpointKey]);

//   return { data, loading, error };
// };

// // Hook for multiple endpoints
// export const useMultipleData = (endpointKeys) => {
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
        
//         const result = await fetchMultiple(endpointKeys);
        
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
//   }, [endpointKeys.join(',')]);

//   return { data, loading, error, partialSuccess };
// };

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
export const useMultipleData = (endpointKeys, queryParams = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partialSuccess, setPartialSuccess] = useState(false);

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
        
        const result = await fetchMultiple(endpointKeys, queryParams);
        
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
  }, [endpointKeys.join(','), JSON.stringify(queryParams)]);

  return { data, loading, error, partialSuccess };
};