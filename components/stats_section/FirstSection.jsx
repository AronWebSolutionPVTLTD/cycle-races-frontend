import React, { useState, useEffect } from "react";
import { useMultipleData } from "@/components/home_api_data";
import Flag from "react-world-flags";
import { BoxSkeleton, ErrorStats } from "../loading&error";

export const FirstSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  const firstSectionEndpoints = ["oldestRider", "youngestRider"];
  const secondSectionEndpoints = ["oldestMostWins", "youngestMostWins"];
  const thirdSectionEndpoints = ["top3GCTeam", "topGCRiderbyTeam"];
  const fourthSectionEndpoints = ["getMostConsistentGCTeams"];
  const fifthSectionEndpoints = ["topStageRiderbyTeam", "top3StageTeam"];
  const sixSectionEndpoints = ["mostDNFs"];
  const lastSectionEndpoints = ["top10Stageteams"];

  // State for selected endpoints
  const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(firstSectionEndpoints[0]);
  const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(secondSectionEndpoints[0]);
  const [thirdSectionEndpoint, setThirdSectionEndpoint] = useState(thirdSectionEndpoints[0]);
  const [fourthSectionEndpoint, setFourthSectionEndpoint] = useState(fourthSectionEndpoints[0]);
  const [fifthSectionEndpoint, setFifthSectionEndpoint] = useState(fifthSectionEndpoints[0]);
  const [sixSectionEndpoint, setSixSectionEndpoint] = useState(sixSectionEndpoints[0]);
  const [lastSectionEndpoint, setLastSectionEndpoint] = useState(lastSectionEndpoints[0]);

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

  // Initialize with random endpoints
  useEffect(() => {
    setIsMounted(true);
    try {
      // Get random endpoints for each section
      setFirstSectionEndpoint(getRandomEndpoint(firstSectionEndpoints));
      setSecondSectionEndpoint(getRandomEndpoint(secondSectionEndpoints));
      setThirdSectionEndpoint(getRandomEndpoint(thirdSectionEndpoints));
      setFourthSectionEndpoint(getRandomEndpoint(fourthSectionEndpoints));
      setFifthSectionEndpoint(getRandomEndpoint(fifthSectionEndpoints));
      setSixSectionEndpoint(getRandomEndpoint(sixSectionEndpoints));
      setLastSectionEndpoint(getRandomEndpoint(lastSectionEndpoints));
    } catch (err) {
      console.error("Error selecting random endpoints:", err);
    }
  }, []);

  // Build query parameters based on selected filters
 const buildQueryParams = () => {
    let params = {};
    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;
    return params;
  };

 const endpointsToFetch = [
    firstSectionEndpoint,
    secondSectionEndpoint,
    thirdSectionEndpoint,
    fourthSectionEndpoint,
    fifthSectionEndpoint,
    sixSectionEndpoint,
    lastSectionEndpoint
  ];

  // Fetch data for all endpoints
  const { data, loading, error, partialSuccess } = useMultipleData(
    endpointsToFetch,
    { queryParams: buildQueryParams() } 
  );

  // Update state after data is loaded
  useEffect(() => {
    if (!loading && data) {
      // Count how many endpoints returned valid data
      let cardCount = 0;
      let totalCount = endpointsToFetch.length;
      
      endpointsToFetch.forEach(endpoint => {
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
    if (!data || !data[endpoint] || !data[endpoint].data || !data[endpoint].data.data) {
      return false;
    }
    
    const endpointData = data[endpoint].data.data;
    
    // Handle different data structures
    if (Array.isArray(endpointData)) {
      return endpointData.length > 0;
    } else if (typeof endpointData === 'object') {
      // For specific endpoints with nested structures
      if (endpoint === 'top3StageTeam' && endpointData.teams) {
        return endpointData.teams.length > 0;
      }
      
      return Object.keys(endpointData).length > 0;
    }
    
    return false;
  };

  // Check if an endpoint has an error
  const hasEndpointError = (endpoint) => {
    return error && error.failedEndpoints && error.failedEndpoints.includes(endpoint);
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
  const showPartialWarning = partialSuccess || 
    (error && error.failedEndpoints && 
     endpointsToFetch.some(endpoint => !error.failedEndpoints.includes(endpoint) && hasValidData(endpoint)));

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
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null || !Object.prototype.hasOwnProperty.call(result, key)) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  };

  // Get message for each endpoint
  const getEndpointMessage = (endpoint) => {
    // First try to get the message from the API response
    const apiMessage = getSafeData(endpoint, 'message');
    
    // If API message exists, return it
    if (apiMessage) return apiMessage;
    
    // Fallback to default messages if no API message
    return getDefaultMessage(endpoint);
  };

  // Default messages for endpoints (kept as a fallback)
  const getDefaultMessage = (endpoint) => {
    const messages = {
      oldestRider: "Oldest Rider",
      youngestRider: "Youngest Rider",
      oldestMostWins: "Oldest Most Wins",
      youngestMostWins: "Youngest Most Wins",
      top3GCTeam: "Top GC Team",
      topGCRiderbyTeam: "Top GC Rider by Team",
      getMostConsistentGCTeams: "Most Consistent GC Teams",
      topStageRiderbyTeam: "Top Stage Rider by Team",
      top3StageTeam: "Top 3 Stage Teams",
      mostDNFs: "Most DNFs",
      top10Stageteams: "Top 10 Stage Teams"
    };
    
    return messages[endpoint] || "Statistics";
  };

  // Partial Data Warning Component
  const PartialDataWarning = () => (
    <div className="warning-banner w-100 p-3 mb-4 alert alert-warning">
      <div className="d-flex justify-content-between align-items-center">
        <p className="mb-1">
          <strong>Partial Data Available:</strong> Showing {visibleCardCount} of {totalEndpoints} statistics.
        </p>
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      {error && error.failedEndpoints && (
        <details>
          <summary className="cursor-pointer mt-2">View details</summary>
          <p className="mt-2 mb-0">
            Failed to load: {error.failedEndpoints.join(", ")}
          </p>
          <p className="mb-0">Try refreshing for new random endpoints.</p>
        </details>
      )}
    </div>
  );

  // No Data Message Component
  const NoDataMessage = () => (
    <div className="col-12">
      <div className="no-data-message text-center p-5 my-4 bg-light rounded shadow-sm">
        <div className="mb-3">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="1" className="mb-3">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h3 className="text-muted">No Data Available</h3>
        <p className="text-muted">
          No data found for the selected filters. Please try different filter options.
        </p>
        {(selectedYear || selectedNationality || selectedTeam) && (
          <div className="mt-3">
            <p className="mb-1 fw-bold">Applied filters:</p>
            <ul className="list-unstyled text-muted">
              {selectedYear && <li>Year: {selectedYear}</li>}
              {selectedNationality && <li>Nationality: {selectedNationality}</li>}
              {selectedTeam && <li>Team: {selectedTeam}</li>}
            </ul>
          </div>
        )}
        <button 
          className="btn btn-outline-primary mt-3" 
          onClick={() => window.location.reload()}
        >
          Try Different Random Statistics
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showPartialWarning && <PartialDataWarning />}

      {isLoading && (
        <div className="col-12">
          <BoxSkeleton />
        </div>
      )}

      {showFullError && (
        <div className="col-12">
          <ErrorStats message={error.message || "Failed to load data"} />
        </div>
      )}

      {!isLoading && noDataFound && !showFullError && <NoDataMessage />}

      {!isLoading && !noDataFound && (
        <>
          {/* First Card */}
          {shouldShowCard(firstSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(firstSectionEndpoint)}</h4>
                  {getSafeData(firstSectionEndpoint, 'data.data', [])
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
                {getSafeData(firstSectionEndpoint, 'data.data', [])
                  .slice(0, 1)
                  .map((rider, index) => (
                    <h5 key={index}>
                      <strong>{rider.value || rider.age || "N/A"}</strong>
                      {rider.unit || " jaar"}
                    </h5>
                  ))}
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Year Card - Always show this if we're displaying data */}
          {!isLoading && (
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <h5>
                  year <strong>{selectedYear || "1913"}</strong>
                </h5>
              </div>
            </div>
          )}

          {/* Remaining cards follow a similar pattern with getSafeData */}
          {/* Second Card */}
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>
                  {getSafeData(secondSectionEndpoint, 'data.data', [])
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
                {getSafeData(secondSectionEndpoint, 'data.data', [])
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
          )}

          {/* Remaining cards would be updated similarly */}
          {/* Third Card */}
          {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(thirdSectionEndpoint)}</h4>
                  {(() => {
                    const teamData = getSafeData(thirdSectionEndpoint, 'data.data', []);
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
                  const teamData = getSafeData(thirdSectionEndpoint, 'data.data', []);
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
          )}

          <div className="col-lg-7">
            <div className="row">
              {/* Fourth Card */}
              {shouldShowCard(fourthSectionEndpoint) && (
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(fourthSectionEndpoint)}
                      </h4>
                      {getSafeData(fourthSectionEndpoint, 'data.data', [])
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <h6>{team.team_name || "N/A"}</h6>
                          </div>
                        ))}
                    </div>
                    {getSafeData(fourthSectionEndpoint, 'data.data', [])
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
              )}

              {/* Fifth Card */}
              {shouldShowCard(fifthSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart lime-green-team-cart img-active">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(fifthSectionEndpoint)}
                      </h4>
                      {getSafeData(fifthSectionEndpoint, 'data.data', [])
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <h6>{team.team_name || "N/A"}</h6>
                          </div>
                        ))}
                    </div>
                    {getSafeData(fifthSectionEndpoint, 'data.data', [])
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
              )}

              {/* Sixth Card - Most DNFs */}
              {shouldShowCard(sixSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(sixSectionEndpoint)}
                      </h4>
                      {getSafeData(sixSectionEndpoint, 'data.data', [])
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
              )}

              {/* Edition Card */}
              <div className="col-lg-5 col-md-6">
                <div className="races">
                  <h5>
                    editie <strong>54</strong>
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {/* Last Card - Top 10 Stage Teams */}
          {shouldShowCard(lastSectionEndpoint) && (
            <div className="col-lg-5">
              <div className="list-white-cart">
                <h4 className="font-size-change">
                  {getEndpointMessage(lastSectionEndpoint)}
                </h4>
                {getSafeData(lastSectionEndpoint, 'data.data', [])
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
                <img src="/images/player4.png" alt="" className="absolute-img" />
                
                <a href="#?" className="glob-btn">
                  <strong>volledige stats</strong>{" "}
                  <span>
                    <img src="/images/arow.svg" alt="" />
                  </span>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FirstSection;