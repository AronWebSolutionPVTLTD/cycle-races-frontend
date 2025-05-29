// import React, { useState, useEffect } from "react";
// import Flag from "react-world-flags";
// import {
//   ErrorStats,
//   NoDataMessage,
//   PartialDataWarning,
//   TwoSectionSkeleton,
// } from "../../loading&error";
// import { useMultipleData } from "@/components/home_api_data";
// import { renderFlag } from "@/components/RenderFlag";

// const FirstSection = () => {
//   const firstSectionEndpoint = "mostStageWins"; 
//   const secondSectionEndpoint = "getTopStageRiders"; 

//   // State to track if component is mounted (client-side)
//   const [isMounted, setIsMounted] = useState(false);

//   // Add minimum loading time tracker to prevent premature error states
//   const [initialLoadTime, setInitialLoadTime] = useState(null);
//   const MINIMUM_LOADING_TIME = 1000; // 1 second minimum loading time

//   // Only set mounted flag on client-side after hydration is complete
//   useEffect(() => {
//     setIsMounted(true);
//     setInitialLoadTime(Date.now());
//   }, []);

//   // Prepare endpoints to fetch data from - only after mounted to ensure client-side execution
//   const endpointsToFetch = isMounted
//     ? [firstSectionEndpoint, secondSectionEndpoint]
//     : [];

//   // Fetch data for both sections using the fixed endpoints
//   const { data, loading, error } = useMultipleData(endpointsToFetch);

//   // Calculate if we should still show loading state based on minimum time
//   const [forceLoading, setForceLoading] = useState(true);

//   useEffect(() => {
//     if (!loading && initialLoadTime) {
//       const currentTime = Date.now();
//       const timeElapsed = currentTime - initialLoadTime;

//       if (timeElapsed < MINIMUM_LOADING_TIME) {
//         const remainingTime = MINIMUM_LOADING_TIME - timeElapsed;
//         const timer = setTimeout(() => {
//           setForceLoading(false);
//         }, remainingTime);

//         return () => clearTimeout(timer);
//       } else {
//         setForceLoading(false);
//       }
//     }
//   }, [loading, initialLoadTime]);

//   // Enhanced error checking function for individual sections
//   const getSectionData = (endpoint) => {
//     try {
//       // Check for network/API errors for this specific endpoint
//       if (error && error[endpoint]) {
//         return { error: true, errorType: 'api_error', errorMessage: error[endpoint]?.message || 'API Error' };
//       }

//       // Check if data exists for this endpoint
//       if (!data || !data[endpoint]) {
//         return { error: true, errorType: 'no_data', errorMessage: 'No Data Available' };
//       }

//       const endpointData = data[endpoint];

//       // Check for various data structure scenarios
//       if (!endpointData) {
//         return { error: true, errorType: 'no_endpoint_data', errorMessage: 'No Endpoint Data' };
//       }

//       // Handle different response structures
//       let actualData = null;
      
//       if (endpointData.data?.data !== undefined) {
//         actualData = endpointData.data.data;
//       } else if (endpointData.data !== undefined) {
//         actualData = endpointData.data;
//       } else if (endpointData.result !== undefined) {
//         actualData = endpointData.result;
//       } else {
//         actualData = endpointData;
//       }

//       // Check if actualData is null, undefined, or empty
//       if (actualData === null || actualData === undefined) {
//         return { error: true, errorType: 'null_data', errorMessage: 'Data Not Found' };
//       }

//       if (Array.isArray(actualData) && actualData.length === 0) {
//         return { error: true, errorType: 'empty_array', errorMessage: 'No Records Found' };
//       }

//       if (typeof actualData === 'object' && !Array.isArray(actualData) && Object.keys(actualData).length === 0) {
//         return { error: true, errorType: 'empty_object', errorMessage: 'No Information Available' };
//       }

//       return { 
//         data: actualData, 
//         error: false, 
//         message: endpointData.message || "Data Available",
//         fullEndpointData: endpointData 
//       };
//     } catch (err) {
//       console.error(`Error processing data for ${endpoint}:`, err);
//       return { error: true, errorType: 'processing_error', errorMessage: 'Data Processing Error' };
//     }
//   };

//   // Helper function to safely get nested properties
//   const safeGet = (obj, path, defaultValue = 'N/A') => {
//     try {
//       return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
//     } catch {
//       return defaultValue;
//     }
//   };

  
//   // Helper function to render the first section content
//   const renderFirstSectionContent = () => {
//     const sectionResult = getSectionData(firstSectionEndpoint);
    
//     if (sectionResult.error) {
//       return (
//         <ErrorStats 
//           errorMessage={sectionResult.errorMessage}
         
//         />
//       );
//     }

//     return (
//       <div className="list-white-cart">
//         <h4>{sectionResult.message || "Top Riders"}</h4>
//         <ul>
//           {(Array.isArray(sectionResult.data) ? sectionResult.data : [])
//             .slice(0, 3)
//             .map((el, index) => (
//               <li key={index}>
//                 <strong>{index + 1}</strong>
//                 <div className="name-wraper">
//                   {renderFlag(safeGet(el, 'rider_country'))}
//                   <h6>{safeGet(el, 'rider_name', 'Unknown Rider')}</h6>
//                 </div>
//                 <span>{safeGet(el, 'age', '...')}</span>
//               </li>
//             ))}
//         </ul>
//         <a href="#?" className="green-circle-btn">
//           <img src="/images/arow.svg" alt="" />
//         </a>
//       </div>
//     );
//   };

//   // Helper function to render the second section content
//   const renderSecondSectionContent = () => {
//     const sectionResult = getSectionData(secondSectionEndpoint);
    
//     if (sectionResult.error) {
//       return (
//         <ErrorStats 
//           errorMessage={sectionResult.errorMessage}

//         />
//       );
//     }

//     return (
//       <>
//         <div className="section-title mb-3">
//           <h4>{sectionResult.message || "Race Results"}</h4>
//         </div>
//         <ul className="transparent-cart">
//           {(Array.isArray(sectionResult.data) ? sectionResult.data : [])
//             .slice(0, 4)
//             .map((riders, index) => (
//               <li key={index}>
//                 <h5>
//                   {renderFlag(safeGet(riders, 'rider_country'))}
//                 </h5>
//                 <h5>
//                   <a href="#?">{safeGet(riders, 'team_name', 'Unknown Team')}</a>
//                 </h5>
//                 {riders.count && <h6>{riders.count} wins</h6>}
//                 <a href="#?" className="r-details">
//                   <img src="/images/hover-arow.svg" alt="" />
//                 </a>
//               </li>
//             ))}
//         </ul>
//       </>
//     );
//   };

//   // Determine loading and error states
//   const isLoading = loading || forceLoading;
//   const firstSectionResult = getSectionData(firstSectionEndpoint);
//   const secondSectionResult = getSectionData(secondSectionEndpoint);
  
//   // Check if both sections have errors
//   const bothSectionsHaveErrors = firstSectionResult.error && secondSectionResult.error;
//   const hasAnyData = !firstSectionResult.error || !secondSectionResult.error;

//   return (
//     <section className="home-banner">
//       <div className="container">
//         <div className="row">
//               <div className="col-lg-12">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h2>uitslagen</h2>
//                   <a href="#?" className="alle-link m-0">
//                     Alle statistieken <img src="/images/arow2.svg" alt="" />
//                   </a>
//                 </div>
//               </div>
//           {/* Show loading skeleton if not mounted or still loading */}
//           {(!isMounted || isLoading) && (
//             <div className="col-12">
//               <TwoSectionSkeleton />
//             </div>
//           )}

//           {/* Show global error only when both sections fail with API errors */}
//           {!isLoading && 
//            isMounted && 
//            bothSectionsHaveErrors && 
//            (firstSectionResult.errorType === 'api_error' || secondSectionResult.errorType === 'api_error') && (
//             <div className="col-12">
//               <ErrorStats
//                 message="Failed to load statistics. Please check your connection and try again."
//               />
//             </div>
//           )}

//           {/* Main content - only show when mounted and not in global loading/error state */}
//           {isMounted && 
//            !isLoading && 
//            !(bothSectionsHaveErrors && 
//              (firstSectionResult.errorType === 'api_error' || secondSectionResult.errorType === 'api_error')) && (
//             <>
            

//               {/* First Section - Always render, with individual error handling */}
//               <div className="col-lg-3 col-md-5">
//                 {renderFirstSectionContent()}
//               </div>

//               {/* Second Section - Always render, with individual error handling */}
//               <div className="col-lg-9 col-md-7">
//                 {renderSecondSectionContent()}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FirstSection;

import React from "react";
import { useMultipleData } from "../../home_api_data";
import {
  ErrorStats,
  LoadingStats,
  TwoSectionSkeleton,
} from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

const FirstSection = () => {
  // Fixed APIs for each section - no random selection
  const fixedApis = {
    section1: "mostStageWins",
    section2: "getTopStageRiders",
  };

  const endpointsToFetch = Object.values(fixedApis);
  
  // Fetch data using the fixed endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Enhanced error checking function (same as UpcomingYear)
  const getSectionData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];

    // Try most common paths in order
    const paths = [
      response?.data?.data?.result,
      response?.data?.data,
      response?.data,
      response,
    ];

    for (const path of paths) {
      if (Array.isArray(path) && path.length > 0) {
        return { data: path, error: false };
      }
    }

    return { error: true, errorType: "no_data_found" };
  };

  // Error message component (same as UpcomingYear)
  const ErrorMessage = ({ errorType = "general" }) => {
    const errorMessages = {
      api_error: "API Error",
      no_data: "No Data Available",
      no_endpoint_data: "No Endpoint Data",
      null_data: "Data Not Found",
      empty_array: "No Records Found",
      empty_object: "No Information Available",
      processing_error: "Data Processing Error",
      no_data_found: "No Records Found",
      general: "No Data Available",
    };

    return (
      <div className="text-danger text-center py-3">
        {errorMessages[errorType] || errorMessages.general}
      </div>
    );
  };

  // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  };

  return (
    <section className="home-banner">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>uitslagen</h2>
              <a href="#?" className="alle-link m-0">
                Alle statistieken <img src="/images/arow2.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Show loading state */}
          {loading && (
            <div className="col-12">
              <TwoSectionSkeleton />
            </div>
          )}

          {/* Show global error if all data failed */}
          {!loading && error && Object.keys(data || {}).length === 0 && (
            <div className="col-12">
              <ErrorStats message="Unable to load statistics. Please try again later." />
            </div>
          )}

          {/* Main content - show when not loading and we have some data */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              {/* First Section - Top Stage Winners */}
              <div className="col-lg-3 col-md-5">
            <div className="list-white-cart">
              {getSectionData(fixedApis.section1).error ? (
                <ErrorMessage
                  errorType={getSectionData(fixedApis.section1).errorType}
                />
              ) : (
                <>
                  <h4>
                    {data?.[fixedApis.section1]?.message || "Top Riders"}
                  </h4>

                  <ul>
                    {(Array.isArray(getSectionData(fixedApis.section1).data)
                      ? getSectionData(fixedApis.section1).data
                      : []
                    )
                      .slice(0, 3)
                      .map((rider, index) => (
                        <li key={index}>
                          <strong>{index + 1}</strong>
                          <div className="name-wraper">
                            {renderFlag(rider?.rider_country)}
                            <h6>{rider?.rider_name || "Unknown Rider"}</h6>
                          </div>
                          <span>{rider?.age || "..."}</span>
                        </li>
                      ))}
                  </ul>

                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Second Section - Top Stage Riders */}
          <div className="col-lg-9 col-md-7">
            {getSectionData(fixedApis.section2).error ? (
              <ErrorMessage
                errorType={getSectionData(fixedApis.section2).errorType}
              />
            ) : (
              <>
                <div className="section-title mb-3">
                  <h4>
                    {data?.[fixedApis.section2]?.message || "Race Results"}
                  </h4>
                </div>

                <ul className="transparent-cart">
                  {(Array.isArray(getSectionData(fixedApis.section2).data)
                    ? getSectionData(fixedApis.section2).data
                    : []
                  )
                    .slice(0, 4)
                    .map((rider, index) => (
                      <li key={index}>
                        <h5>
                          {renderFlag(rider?.rider_country)}
                        </h5>
                        <h5>
                          <a href="#?">{rider?.team_name || "Unknown Team"}</a>
                        </h5>
                        {rider?.count && <h6>{rider.count} wins</h6>}
                        <a href="#?" className="r-details">
                          <img src="/images/hover-arow.svg" alt="" />
                        </a>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
          </>
           )} 
        </div>
         
      </div>
    </section>
  );
};

export default FirstSection;