import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";
import {
  ErrorStats,
  NoDataMessage,
  PartialDataWarning,
  TwoSectionSkeleton,
} from "../../loading&error";
import { useMultipleData } from "@/components/home_api_data";

const ResultSection = () => {
  const firstSectionEndpoints = ["mostStageWins", "stagePodiums", "mostGCWins"];

  const secondSectionEndpoints = ["getTopStageRiders", "topGCRiderbyTeam"];

  // State to track the currently selected endpoints
  const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(
    firstSectionEndpoints[0]
  );
  const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(
    secondSectionEndpoints[0]
  );

  // State to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  // Add minimum loading time tracker to prevent premature error states
  const [initialLoadTime, setInitialLoadTime] = useState(null);
  const MINIMUM_LOADING_TIME = 1000; // 1 second minimum loading time

  // Function to get a random endpoint from an array
  const getRandomEndpoint = (endpointArray) => {
    const randomIndex = Math.floor(Math.random() * endpointArray.length);
    return endpointArray[randomIndex];
  };

  // Only select random endpoints on client-side after hydration is complete
  useEffect(() => {
    // Set mounted flag to true
    setIsMounted(true);
    // Track when loading started
    setInitialLoadTime(Date.now());

    try {
      // Get a random endpoint for each section
      const randomFirstEndpoint = getRandomEndpoint(firstSectionEndpoints);
      const randomSecondEndpoint = getRandomEndpoint(secondSectionEndpoints);

      // Update state with the randomly selected endpoints
      setFirstSectionEndpoint(randomFirstEndpoint);
      setSecondSectionEndpoint(randomSecondEndpoint);
    } catch (err) {
      console.error("Error selecting random endpoints:", err);
      // Keep the default endpoints if there's an error
    }
  }, []); // Empty dependency array means this runs once on component mount

  // Prepare endpoints to fetch data from - only after mounted to ensure client-side execution
  const endpointsToFetch = isMounted
    ? [firstSectionEndpoint, secondSectionEndpoint]
    : [];

  // Fetch data for both sections using the selected endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Calculate if we should still show loading state based on minimum time
  const [forceLoading, setForceLoading] = useState(true);

  useEffect(() => {
    // When data arrives or loading state changes, check if minimum loading time has passed
    if (!loading && initialLoadTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - initialLoadTime;

      if (timeElapsed < MINIMUM_LOADING_TIME) {
        // Keep showing loading state for the minimum time
        const remainingTime = MINIMUM_LOADING_TIME - timeElapsed;
        const timer = setTimeout(() => {
          setForceLoading(false);
        }, remainingTime);

        return () => clearTimeout(timer);
      } else {
        setForceLoading(false);
      }
    }
  }, [loading, initialLoadTime]);

  // Debug: Log whenever data or loading status changes
  useEffect(() => {
    console.log("Data status:", {
      data,
      loading,
      error,
      endpointsToFetch,
      forceLoading,
    });
  }, [data, loading, error, endpointsToFetch, forceLoading]);

  // Check if we have data for the specific endpoints we're currently using
  const firstSectionDataLoaded = data && data[firstSectionEndpoint];
  const secondSectionDataLoaded = data && data[secondSectionEndpoint];

  // Track loaded endpoints for partial data warning
  const loadedEndpoints = [
    firstSectionDataLoaded ? firstSectionEndpoint : null,
    secondSectionDataLoaded ? secondSectionEndpoint : null,
  ].filter(Boolean);

  // Determine if we have different data states - now accounting for forceLoading
  const isLoading = loading || forceLoading;
  const isInitialLoading = isLoading && loadedEndpoints.length === 0;
  const hasCompleteData =
    loadedEndpoints.length === endpointsToFetch.length &&
    endpointsToFetch.length > 0;
  const hasPartialData =
    !isLoading &&
    loadedEndpoints.length > 0 &&
    loadedEndpoints.length < endpointsToFetch.length;
  const hasNoData = !isLoading && loadedEndpoints.length === 0 && error;

  // Helper function to render the first section content
  const renderFirstSectionContent = () => {
    const sectionData = data?.[firstSectionEndpoint];
    if (!sectionData?.data?.data || sectionData.data.data.length === 0) {
      return  <div className="col-12">
      <div className="no-data-message text-center p-5 my-4 bg-light rounded shadow-sm">
        <div className="mb-3">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="1" className="mb-3">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h3 className="text-muted">No Data Available</h3>
     
       <button 
          className="btn btn-outline-primary mt-3" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
    }

    return (
      <div className="list-white-cart">
        <h4>{sectionData.message || "Top Riders"}</h4>
     
          <ul >
               {sectionData.data.data.slice(0, 3).map((el, index) => (
            <li key={index}>
              <strong>{index + 1}</strong>
              <div className="name-wraper">
                <Flag
                  code={el.rider_country?.toUpperCase()}
                  style={{
                    width: "30px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                />
                <h6>{el.rider_name}</h6>
              </div>
              <span>{el.age}</span>
            </li>
              ))}
          </ul>
      
        <a href="#?" className="green-circle-btn">
          <img src="/images/arow.svg" alt="" />
        </a>
      </div>
    );
  };

  // Helper function to render the second section content
  const renderSecondSectionContent = () => {
    const sectionData = data?.[secondSectionEndpoint];
    if (!sectionData?.data?.data || sectionData.data.data.length === 0) {
      return <NoDataMessage filterYear="All-time" />;
    }

    return (
      <>
        <div className="section-title mb-3">
          <h4>{sectionData.message || "Race Results"}</h4>
        </div>
    <ul className="transparent-cart">
             {sectionData.data.data.slice(0, 4).map((riders, index) => (
            <li key={index}>
             <h5>
                <Flag
                  code={riders.rider_country}
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
               </h5>
              <h5>
                <a href="#?">{riders.team_name}</a>
              </h5>
          
              {riders.count && <h6>{riders.count} wins</h6>}
             
              <a href="#?" className="r-details">
                <img src="/images/hover-arow.svg" alt="" />
              </a>
            </li>
             ))}
          </ul>
     </>
    );
  };

  // Show a global loading state if we haven't mounted yet (pre-hydration)
  if (!isMounted) {
    return (
      <section className="home-banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <TwoSectionSkeleton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show global loading state during initial data fetch
  if (isInitialLoading) {
    return (
      <section className="home-banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <TwoSectionSkeleton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Only show error when no data could be loaded AND we're past the loading state
  if (hasNoData) {
    return (
      <section className="home-banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ErrorStats
                message={error?.message || "Failed to load statistics"}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-banner">
      <div className="container">
        <div className="row">
          {/* Show partial data warning if applicable */}
          {hasPartialData && (
            <div className="col-12">
              <PartialDataWarning
                visibleCardCount={loadedEndpoints.length}
                totalEndpoints={endpointsToFetch.length}
                error={error}
              />
            </div>
          )}

          <div className="col-lg-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>uitslagen</h2>
              <a href="#?" className="alle-link m-0">
                Alle statistieken <img src="/images/arow2.svg" alt="" />
              </a>
            </div>
          </div>

          {/* First Section - Only render if data is available */}
          {firstSectionDataLoaded && (
            <div className="col-lg-3 col-md-5">
              {renderFirstSectionContent()}
            </div>
          )}

          {/* Second Section - Only render if data is available */}
          {secondSectionDataLoaded && (
            <div className="col-lg-9 col-md-7">
              {renderSecondSectionContent()}
            </div>
          )}

          {/* If we're no longer in loading state but still waiting for data */}
          {!isLoading &&
            !hasNoData &&
            !firstSectionDataLoaded &&
            !secondSectionDataLoaded && (
              <div className="col-12">
                <TwoSectionSkeleton />
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default ResultSection;
