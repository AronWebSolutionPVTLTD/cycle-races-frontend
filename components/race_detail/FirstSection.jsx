import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";
import { useMultipleData } from "../home_api_data";
import {
  ErrorStats,
  LoadingStats,
  NoDataMessage,
  PartialDataWarning,
} from "../loading&error";

// This component will handle the random rider statistics section
 const FirstSection = ({ selectedYear, selectedNationality,name }) => {
  console.log(selectedYear, selectedNationality,name, "name")
  // Define endpoint groups for different sections of rider statistics
  const firstSectionEndpoints = ["totalWinsByNationality"];


  // State for selected endpoints
  const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(
    firstSectionEndpoints[0]
  );
 
  // Component state
  const [isMounted, setIsMounted] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [totalEndpoints, setTotalEndpoints] = useState(0);

  // Helper function to select random endpoint from array
  const getRandomEndpoint = (endpointArray) => {
    const randomIndex = Math.floor(Math.random() * endpointArray.length);
    return endpointArray[randomIndex];
  };

  // Initialize with random endpoints on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      // Get random endpoints for each section
      setFirstSectionEndpoint(getRandomEndpoint(firstSectionEndpoints));
  
    } catch (err) {
      console.error("Error selecting random endpoints:", err);
    }
  }, []);

  // Build query parameters based on selected filters
  const buildQueryParams = () => {
    let params = {};
    if (selectedYear && selectedYear !== "All-time") {
      params.year = selectedYear;
    }
       if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

  const endpointsToFetch = [
    firstSectionEndpoint,
   
  ];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {
    // Add specific endpoint mappings here if needed
    // For example:
    // 'bestGCResults': '/race-stats/:id/bestGCResults'
  };

  // Use the updated hook with options object
  const { data, loading, error, partialSuccess } = useMultipleData(
    endpointsToFetch,
    {
      name: name,
      queryParams: buildQueryParams(),
      endpointsMappings: endpointsMappings,
      idType: "raceDetailsStats",   
    }
  );
console.log(data,"data")
  // Update state after data is loaded
  useEffect(() => {
    if (!loading && data) {
      // Count how many endpoints returned valid data
      let cardCount = 0;
      let totalCount = endpointsToFetch.length;

      endpointsToFetch.forEach((endpoint) => {
        if (hasValidData(endpoint)) {
          cardCount++;
        }
      });

      setVisibleCardCount(cardCount);
      setTotalEndpoints(totalCount);
      setNoDataFound(cardCount === 0);
    }
  }, [data, loading, endpointsToFetch]);

  // Check if an endpoint has valid data
  const hasValidData = (endpoint) => {
    if (
      !data ||
      !data[endpoint] ||
      !data[endpoint].data 
    ) {
      return false;
    }

    const endpointData = data[endpoint].data;

    // Handle different data structures
    if (Array.isArray(endpointData)) {
      return endpointData.length > 0;
    } else if (typeof endpointData === "object") {
      return Object.keys(endpointData).length > 0;
    }

    return false;
  };

  // Check if an endpoint has an error
  const hasEndpointError = (endpoint) => {
    return (
      error && error.failedEndpoints && error.failedEndpoints.includes(endpoint)
    );
  };

  // Determine if a card should be shown
  const shouldShowCard = (endpoint) => {
    if (hasEndpointError(endpoint)) return false;
    if (!hasValidData(endpoint)) return false;
    return true;
  };

  // Status flags
  const isLoading = loading;
  const showFullError = error && !partialSuccess;
  const showPartialWarning =
    partialSuccess ||
    (error &&
      error.failedEndpoints &&
      endpointsToFetch.some(
        (endpoint) =>
          !error.failedEndpoints.includes(endpoint) && hasValidData(endpoint)
      ));

  // Get safe access to nested data properties
  const getSafeData = (endpoint, path, defaultValue = null) => {
    try {
      if (!data || !data[endpoint]) return defaultValue;
      return getNestedProperty(data[endpoint], path, defaultValue);
    } catch (err) {
      console.error(`Error accessing ${path} for ${endpoint}:`, err);
      return defaultValue;
    }
  };

  // Helper function to safely access nested properties
  const getNestedProperty = (obj, path, defaultValue = null) => {
    const keys = path.split(".");
    let result = obj;

    for (const key of keys) {
      if (
        result === undefined ||
        result === null ||
        !Object.prototype.hasOwnProperty.call(result, key)
      ) {
        return defaultValue;
      }
      result = result[key];
    }

    return result === undefined ? defaultValue : result;
  };

  // Get message for each endpoint
  const getEndpointMessage = (endpoint) => {
    // Extract endpoint name from the full path
    const endpointName = endpoint.split("/").pop();

    // First try to get the message from the API response
    const apiMessage = getSafeData(endpoint, "message");

    // If API message exists, return it
    if (apiMessage) return apiMessage;

    // Fallback to default messages if no API message
    return getDefaultMessage(endpointName);
  };

  // Default messages for endpoints
  const getDefaultMessage = (endpointName) => {
    const messages = {
      "first-win": "First Win",
     
    };

    return messages[endpointName] || "Rider Statistics";
  };

  return (
    <>
      {showPartialWarning && (
        <PartialDataWarning
          visibleCardCount={visibleCardCount}
          totalEndpoints={totalEndpoints}
          error={error}
        />
      )}

      {isLoading && (
        <div className="col-12">
          <LoadingStats />
        </div>
      )}

      {showFullError && (
        <div className="col-12">
          <ErrorStats
            message={error.message || "Failed to load rider statistics"}
          />
        </div>
      )}

      {!isLoading && noDataFound && !showFullError && (
        <div className="col-12">
          <NoDataMessage selectedYear={selectedYear} />
        </div>
      )}

      {!isLoading && !noDataFound && (
        <>
          {/* First Card */}
          {shouldShowCard(firstSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(firstSectionEndpoint)}</h4>
                  {/* {getSafeData(firstSectionEndpoint, "data.data", [])
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div className="name-wraper" key={index}>
                        {rider.rider_country && (
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{rider.rider_name}</h6>
                      </div>
                    ))} */}
                          {getSafeData(firstSectionEndpoint, "data.most_wins", [])
                  .slice(0, 5)
                  .map((rider, index) => (
                    <ul key={index}>
                      <li>
                       
                        <div className="name-wraper">
                            {rider.nationality && (
                          <Flag
                            code={rider.nationality.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                          <h6>{rider.rider_name || "N/A"}({rider.age})</h6>
                        </div>
                        <span>{rider.wins || "N/A"} wins</span>
                      </li>
                    </ul>
                  ))}
                </div>
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <h5>
                  year <strong>{selectedYear || "N/A"}</strong>
                </h5>
              </div>
            </div>
          )}

          {/* Second Card */}
          {/* {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>
                  {getSafeData(secondSectionEndpoint, "data.data", [])
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div className="name-wraper" key={index}>
                        {rider.rider_country && (
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{rider.rider_name}</h6>
                      </div>
                    ))}
                </div>
                {getSafeData(secondSectionEndpoint, "data.data", [])
                  .slice(0, 1)
                  .map((rider, index) => (
                    <h5 key={index}>
                      <strong>{rider.count || rider.value || "N/A"}</strong>
                    </h5>
                  ))}
                <img
                  src="/images/player2.png"
                  alt=""
                  className="absolute-img"
                />
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )} */}

          {/* Third Card */}
          {/* {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(thirdSectionEndpoint)}</h4>
                  {(() => {
                    const teamData = getSafeData(
                      thirdSectionEndpoint,
                      "data.data",
                      []
                    );
                    return teamData.slice(0, 1).map((team, index) => (
                      <div className="name-wraper" key={index}>
                        {team.country && (
                          <Flag
                            code={team.country.toUpperCase() || "N/A"}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{team.team_name || team.name || "N/A"}</h6>
                      </div>
                    ));
                  })()}
                </div>
                {(() => {
                  const teamData = getSafeData(
                    thirdSectionEndpoint,
                    "data.data",
                    []
                  );
                  return teamData.slice(0, 1).map((team, index) => (
                    <h5 key={index}>
                      <strong>{team.rank || team.value || "N/A"}</strong>rank
                    </h5>
                  ));
                })()}

                <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )} */}

          <div className="col-lg-7">
            <div className="row">
              {/* Fourth Card */}
              {/* {shouldShowCard(fourthSectionEndpoint) && (
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(fourthSectionEndpoint)}
                      </h4>
                      {getSafeData(fourthSectionEndpoint, "data.data", [])
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <h6>{team.team_name || "N/A"}</h6>
                          </div>
                        ))}
                    </div>
                    {getSafeData(fourthSectionEndpoint, "data.data", [])
                      .slice(0, 1)
                      .map((team, index) => (
                        <h5 key={index}>
                          <strong>{team.totalPoints || "N/A"}</strong>
                          points
                        </h5>
                      ))}
                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )} */}

              {/* Fifth Card */}
              {/* {shouldShowCard(fifthSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart lime-green-team-cart img-active">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(fifthSectionEndpoint)}
                      </h4>
                      {getSafeData(fifthSectionEndpoint, "data.data", [])
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <h6>{team.team_name || "N/A"}</h6>
                          </div>
                        ))}
                    </div>
                    {getSafeData(fifthSectionEndpoint, "data.data", [])
                      .slice(0, 1)
                      .map((team, index) => (
                        <h5 key={index}>
                          <strong>{team.time || "N/A"}</strong>
                        </h5>
                      ))}

                    <a href="#?" className="white-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )} */}

              {/* Sixth Card - Most DNFs */}
              {/* {shouldShowCard(sixSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(sixSectionEndpoint)}
                      </h4>
                      {getSafeData(sixSectionEndpoint, "data.data", [])
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <Flag
                              code={(team.flag || "NA").toUpperCase()}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "10px",
                              }}
                            />
                            <h6>{team.team_name || "N/A"}</h6>
                          </div>
                        ))}
                    </div>

                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )} */}

              {/* Edition Card */}
              {/* <div className="col-lg-5 col-md-6">
                <div className="races">
                  <h5>
                    editie <strong>54</strong>
                  </h5>
                </div>
              </div> */}
            </div>
          </div>

          {/* Last Card - Top 10 Stage Teams */}
          {/* {shouldShowCard(lastSectionEndpoint) && (
            <div className="col-lg-5">
              <div className="list-white-cart">
                <h4 className="font-size-change">
                  {getEndpointMessage(lastSectionEndpoint)}
                </h4>
                {getSafeData(lastSectionEndpoint, "data.data", [])
                  .slice(0, 5)
                  .map((team, index) => (
                    <ul key={index}>
                      <li>
                        <strong>{index + 1}</strong>
                        <div className="name-wraper">
                          <h6>{team.team_name || "N/A"}</h6>
                        </div>
                        <span>{team.rank || "N/A"} rank</span>
                      </li>
                    </ul>
                  ))}
                <img
                  src="/images/player4.png"
                  alt=""
                  className="absolute-img"
                />

                <a href="#?" className="glob-btn">
                  <strong>volledige stats</strong>{" "}
                  <span>
                    <img src="/images/arow.svg" alt="" />
                  </span>
                </a>
              </div>
            </div>
          )} */}
        </>
      )}
    </>
  );
};

export default FirstSection;
