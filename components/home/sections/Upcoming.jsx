import React, { useState, useEffect } from 'react'
import { useMultipleData } from '../../home_api_data'
import { ErrorStats, LoadingStats } from './loading&error'
import Flag from 'react-world-flags'

const Upcoming = () => {
  // Define possible API endpoints for each section box
  const apiOptions = {
    box1: ["topStageRiderbyTeam"],
    box2: ["topStageRiderbyTeam"],
    box3: ["topGCRiderbyTeam"]
  };

  // Set initial static values for server-side rendering
  const [selectedApis, setSelectedApis] = useState({
    box1: apiOptions.box1[0],
    box2: apiOptions.box2[0],
    box3: apiOptions.box3[0]
  });

  // Client-side randomization after hydration
  useEffect(() => {
    // Function to get a random item from an array
    const getRandomItem = (array) => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    };

    try {
      // Update state with random selection for each section
      setSelectedApis({
        box1: getRandomItem(apiOptions.box1),
        box2: getRandomItem(apiOptions.box2),
        box3: getRandomItem(apiOptions.box3)
      });
      console.log("Random endpoints selected for Upcoming section");
    } catch (err) {
      console.error("Error selecting random endpoints for Upcoming section:", err);
    }
  }, []); // Run once after initial render
  
  // Create a flat array of all selected API endpoints to fetch
  const endpointsToFetch = Object.values(selectedApis);
  
  console.log("Upcoming section endpoints being fetched:", endpointsToFetch);

  // Fetch data using the selected endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);
  
  console.log("Upcoming section API response:", data);

  // Check if we have all data for every endpoint
  const allDataLoaded = endpointsToFetch.every(endpoint => data[endpoint]);
  
  // Single loading state - only show loading when not all endpoints have data
  const isLoading = !allDataLoaded && loading;
  
  // Show data when all endpoints have returned data
  const showData = allDataLoaded;
  
  // Show error state only if there's an error and not all data loaded
  const showError = error && !allDataLoaded;

  // Check if we have partial success (some data loaded but not all)
  const partialSuccess = error && Object.keys(data).some(key => data[key]) && !allDataLoaded;

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
    <section className="home-sec4">
      <div className="container">
        <div className="row">
          {partialSuccess && <PartialDataWarning />}
          
          <div className="col-lg-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>aankomend</h2>
              <a href="#?" className="alle-link m-0">
                Alle statistieken <img src="/images/arow2.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Show single loading state until ALL endpoints return data */}
          {isLoading && <LoadingStats />}
          
          {/* Show error state only if there's an error and not all data loaded */}
          {showError && !partialSuccess && <ErrorStats message={error.message} />}

          {/* Only show content when all data is loaded */}
          {showData && (
            <>
              {/* Upcoming Races - Left Side */}
              <div className="col-lg-6">
                <ul className="transparent-cart">
                  <li>
                    <span>17-23/01</span>
                    <h5>
                      <img src="/images/flag3.svg" alt="" />
                      tour down under
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>22/01</span>
                    <h5>
                      <img src="/images/flag9.svg" alt="" />
                      Classica Comunitat Valenciana
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>22-29/01</span>
                    <h5>
                      <img src="/images/flag5.svg" alt="" />
                      vuelta a san juan
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>25 jan</span>
                    <h5>
                      <img src="/images/flag7.svg" alt="" />
                      trofeo calvia
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>26 jan</span>
                    <h5>
                      <img src="/images/flag7.svg" alt="" />
                      trofeo alcudia
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Top stage rider by team */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data[selectedApis.box2].message || "longest stage races"}</h4>
                  {data[selectedApis.box2].data.data
                    .slice(0, 5)
                    .map((team, index) => (
                      <ul key={index}>
                        <li>
                          <strong>{index + 1}</strong>
                          <div className="name-wraper">
                            <Flag code={team.country} style={{height:"20px", width:"20px",marginRight:"10px"}}/>
                            <h6>{team.team_name}</h6>
                          </div>
                          <span>{team.time} time</span>
                        </li>
                      </ul>
                    ))}
                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* Top GC rider by team */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data[selectedApis.box3].message || "shortest stage races"}</h4>
                  {data[selectedApis.box3].data.data
                    .slice(0, 5)
                    .map((team, index) => (
                      <ul key={index}>
                        <li>
                          <strong>{index + 1}</strong>
                          <div className="name-wraper">
                          <Flag code={team.country} style={{height:"20px", width:"20px",marginRight:"10px"}}/>
                            <h6>{team.team_name}</h6>
                          </div>
                          <span>{team.time} time</span>
                        </li>
                      </ul>
                    ))}
                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Upcoming;