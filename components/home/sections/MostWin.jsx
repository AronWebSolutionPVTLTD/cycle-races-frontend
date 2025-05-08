import React, { useState, useEffect } from "react";
import { useMultipleData } from "../../home_api_data";
import { ErrorStats, LoadingStats } from "./loading&error";

const MostWin = () => {
  // Define API options to randomly select from
  const apiOptions = [
    "mostWin",
    "mostStageWins",
    "mostGCWins"
  ];

  // Initialize with a default API endpoint for server-side rendering
  const [selectedApi, setSelectedApi] = useState(apiOptions[0]);

  // Randomly select an API endpoint on client-side after component mounts
  useEffect(() => {
    try {
      const randomIndex = Math.floor(Math.random() * apiOptions.length);
      setSelectedApi(apiOptions[randomIndex]);
      console.log("Random endpoint selected for MostWin section:", apiOptions[randomIndex]);
    } catch (err) {
      console.error("Error selecting random endpoint for MostWin section:", err);
    }
  }, []); // Run once after initial render

  // Create array of endpoints to fetch
  const endpointsToFetch = [selectedApi];

  // Fetch data using the selected API endpoint
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Check if we have data for the selected endpoint
  const allDataLoaded = data && data[selectedApi];
  
  // Single loading state - only show loading when endpoint data isn't loaded
  const isLoading = !allDataLoaded && loading;
  
  // Show data when endpoint has returned data
  const showData = allDataLoaded;
  
  // Show error state only if there's an error and data isn't loaded
  const showError = error && !allDataLoaded;

  // Check if we have partial success
  const partialSuccess = error && data && Object.keys(data).some(key => data[key]) && !allDataLoaded;

  const PartialDataWarning = () => (
    <div className="warning-banner w-100 p-3 alert alert-warning">
      <p className="mb-1">Some data couldn't be loaded. Displaying available information.</p>
      {error && error.failedEndpoints && (
        <details>
          <summary className="cursor-pointer">View details</summary>
          <p className="mt-2 mb-0">Failed to load: {error.failedEndpoints.join(", ")}</p>
          <p className="mb-0">Try refreshing for new random endpoints.</p>
        </details>
      )}
    </div>
  );

  return (
    <section className="home-sec3">
      <div className="container">
        <div className="row">
          {partialSuccess && <PartialDataWarning />}
          
          {/* Show single loading state until endpoint returns data */}
          {isLoading && <div className="col-12"><LoadingStats /></div>}
          
          {/* Show error state only if there's an error and data isn't loaded */}
          {showError && !partialSuccess && <div className="col-12"><ErrorStats message={error.message} /></div>}

          {/* Only show content when data is loaded */}
          {showData && data[selectedApi].data && data[selectedApi].data.data && 
            data[selectedApi].data.data.slice(0, 1).map((rider, index) => (
              <div className="col-lg-12" key={index}>
                <div className="winning-box">
                  <div className="text-wraper">
                    <h3>{data[selectedApi].message || "Most Wins"}</h3>
                    <h4>{rider.rider_name}</h4>
                  </div>
                  <span>{rider?.wins ? rider.wins : rider.count}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
};

export default MostWin;