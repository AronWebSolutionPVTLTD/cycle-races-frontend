import React, { useState, useEffect } from "react";
import { useMultipleData } from "../home_api_data";
import { ErrorStats, LoadingStats } from "../loading&error";


const MostWin = ({ 
  // Optional filter props - component will work with or without them
  selectedNationality ,
  name,
  selectedYear 
}) => {
  // Define API options to randomly select from
  const apiOptions = [
    "mostWins",

  ];

  // Initialize with a default API endpoint for server-side rendering
  const [selectedApi, setSelectedApi] = useState(apiOptions[0]);

  // Randomly select an API endpoint on client-side after component mounts
  useEffect(() => {
    try {
      const randomIndex = Math.floor(Math.random() * apiOptions.length);
      setSelectedApi(apiOptions[randomIndex]);
      
    } catch (err) {
      console.error("Error selecting random endpoint for MostWin section:", err);
    }
  }, []); // Run once after initial render

  // Build query parameters - this will work with or without the filter props
  const buildQueryParams = () => {
    let params = {};

     if (selectedYear && selectedYear !== "All-time") {
      params.year = selectedYear;
    }
    if (selectedNationality) params.nationality = selectedNationality;
    return params;

  };

  // Create array of endpoints to fetch
  const endpointsToFetch = [selectedApi];

  // Fetch data using the selected API endpoint with optional filters
  const { data, loading, error, partialSuccess } = useMultipleData(
    endpointsToFetch,
    {
          name: name,
    queryParams: buildQueryParams(),
       idType: "raceDetailsStats",
    }
  
  );

  // Check if we have data for the selected endpoint
  const allDataLoaded = data && data[selectedApi];
  
  // Single loading state - only show loading when endpoint data isn't loaded
  const isLoading = !allDataLoaded && loading;
  
  // Show data when endpoint has returned data
  const showData = allDataLoaded;
  
  // Show error state only if there's an error and data isn't loaded
  const showError = error && !allDataLoaded;

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
          {showData && data[selectedApi]?.data && 
            data[selectedApi].data.most_wins.slice(0, 1).map((rider, index) => (
              <div className="col-lg-12" key={index}>
                <div className="winning-box">
                  <div className="text-wraper">
                    <h3>{data[selectedApi].message || "Most Wins"}</h3>


                    <h4>{rider.rider_name}</h4>
                  </div>
                  <span>{rider?.wins !== undefined ? rider.wins : (rider?.points !== undefined ? rider.points : "N/A")}</span>
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