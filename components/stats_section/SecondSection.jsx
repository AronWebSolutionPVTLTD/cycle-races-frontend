import React, { useState, useEffect } from "react";
import { useMultipleData } from "@/components/home_api_data";
import Flag from "react-world-flags";
import { ErrorStats, LoadingStats } from "../home/sections/loading&error";

export const SecondSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  // Endpoint groups for different sections
  const firstSectionEndpoints = ["gcPodiums", "stagePodiums"];
  const secondSectionEndpoints = ["top3teamwithrank1"];
  const thirdSectionEndpoints = ["longestRace", "shortestRace"];
  const fourthSectionEndpoints = ["gcTop10s", "mostConsistentGC"];
  const fifthSectionEndpoints = ["stageTop10sRider", "gcTop10s"];
  const sixSectionEndpoints = ["mostRacingDays"];
  const seventhSectionEndpoints = ["mostTop5NoWins", "mostSecondPlaces"];
  const eightSectionEndpoints = ["grandTourstageWin", "bestClassics"];
  const lastSectionEndpoints = ["mostweightRider", "lightestRider"];
  
  // State for selected endpoints
  const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(firstSectionEndpoints[0]);
  const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(secondSectionEndpoints[0]);
  const [thirdSectionEndpoint, setThirdSectionEndpoint] = useState(thirdSectionEndpoints[0]);
  const [fourthSectionEndpoint, setFourthSectionEndpoint] = useState(fourthSectionEndpoints[0]);
  const [fifthSectionEndpoint, setFifthSectionEndpoint] = useState(fifthSectionEndpoints[0]);
  const [sixSectionEndpoint, setSixSectionEndpoint] = useState(sixSectionEndpoints[0]);
  const [seventhSectionEndpoint, setSeventhSectionEndpoint] = useState(seventhSectionEndpoints[0]);
  const [eightSectionEndpoint, setEightSectionEndpoint] = useState(eightSectionEndpoints[0]);
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
      setSeventhSectionEndpoint(getRandomEndpoint(seventhSectionEndpoints));
      setEightSectionEndpoint(getRandomEndpoint(eightSectionEndpoints));
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

  // List of all endpoints to fetch
  const endpointsToFetch = [
    firstSectionEndpoint,
    secondSectionEndpoint,
    thirdSectionEndpoint,
    fourthSectionEndpoint,
    fifthSectionEndpoint,
    sixSectionEndpoint,
    seventhSectionEndpoint,
    eightSectionEndpoint,
    lastSectionEndpoint,
  ];

  // Fetch data for all endpoints
  const { data, loading, error, partialSuccess } = useMultipleData(
    endpointsToFetch,
    buildQueryParams()
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
      // For nested objects like in thirdSectionEndpoint
      if (endpoint === 'longestRace' && endpointData.longest_stage_races) {
        return endpointData.longest_stage_races.length > 0;
      } else if (endpoint === 'shortestRace' && endpointData.shortest_stage_races) {
        return endpointData.shortest_stage_races.length > 0;
      } else if (endpoint === 'top3teamwithrank1' && endpointData.oneDayResults) {
        return endpointData.oneDayResults.length > 0;
      } else if (endpoint === 'mostRacingDays' && data[endpoint].data.result) {
        // Handle the special case for mostRacingDays
        return data[endpoint].data.result.length > 0;
      } else {
        return Object.keys(endpointData).length > 0;
      }
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
      
      // Handle special path for mostRacingDays
      if (endpoint === 'mostRacingDays' && path.startsWith('data.data')) {
        const newPath = path.replace('data.data', 'data.result');
        return getNestedProperty(data[endpoint], newPath, defaultValue);
      }
      
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


  // Default messages for endpoints
  const getDefaultMessage = (endpoint) => {
    const messages = {
      gcPodiums: "GC Podiums",
      stagePodiums: "Stage Podiums",
      top3teamwithrank1: "Top Teams",
      longestRace: "Longest Races",
      shortestRace: "Shortest Races",
      gcTop10s: "GC Top 10s",
      mostConsistentGC: "Most Consistent GC",
      stageTop10sRider: "Stage Top 10s",
      mostRacingDays: "Most Racing Days",
      mostTop5NoWins: "Most Top 5 No Wins",
      mostSecondPlaces: "Most Second Places",
      grandTourstageWin: "Grand Tour Stage Wins",
      bestClassics: "Best Classics",
      mostweightRider: "Heaviest Riders",
      lightestRider: "Lightest Riders"
    };
    
    return messages[endpoint] || "Statistics";
  };

  // UI Components for different states
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
          <LoadingStats />
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
          {/* First Card - GC Podiums / Stage Podiums */}
          {shouldShowCard(firstSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(firstSectionEndpoint)}</h4>
                  {getSafeData(firstSectionEndpoint, 'data.data', [])
                    .slice(0, 1)
                    .map((podium, index) => (
                      <div className="name-wraper" key={index}>
                        {podium.rider_country && (
                          <Flag
                            code={podium.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{podium.rider_name}</h6>
                      </div>
                    ))}
                </div>
                {getSafeData(firstSectionEndpoint, 'data.data', [])
                  .slice(0, 1)
                  .map((podium, index) => (
                    <h5 key={index}>
                      <strong>{podium.count}</strong> Racecount
                    </h5>
                  ))}

                <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Second Card - Top Teams */}
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>
                  {getSafeData(secondSectionEndpoint, 'data.data.oneDayResults', [])
                    .slice(0, 3)
                    .map((team, index) => (
                      <ul key={index} className="listdata">
                              <li>
                                <div className="name-wraper">
                                  {/* {rider.rider_country && (
                                    <Flag
                                      code={rider.rider_country}
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginLeft: "10px",
                                      }}
                                    />
                                  )} */}
                                  <h6>{team.teamName}</h6>
                                  {/* <span>{rider.wins} win{rider.wins !== 1 ? 's' : ''}</span> */}
                                </div>
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

          {/* Third Card - Longest/Shortest Races */}
          {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(thirdSectionEndpoint)}</h4>

                  {thirdSectionEndpoint === "longestRace" && 
                    getSafeData(thirdSectionEndpoint, 'data.data.longest_stage_races', [])
                      .slice(0, 1)
                      .map((race, index) => (
                        <div className="name-wraper" key={index}>
                          <h6>{race.race}</h6>
                        </div>
                      ))}
                  
                  {thirdSectionEndpoint === "shortestRace" &&
                    getSafeData(thirdSectionEndpoint, 'data.data.shortest_stage_races', [])
                      .slice(0, 1)
                      .map((race, index) => (
                        <div className="name-wraper" key={index}>
                          <h6>{race.race}</h6>
                        </div>
                      ))}
                </div>
                
                {thirdSectionEndpoint === "longestRace" &&
                  getSafeData(thirdSectionEndpoint, 'data.data.longest_stage_races', [])
                    .slice(0, 1)
                    .map((race, index) => (
                      <h5 key={index}>
                        <strong>{race.distance}</strong> distance
                      </h5>
                    ))}
                
                {thirdSectionEndpoint === "shortestRace" &&
                  getSafeData(thirdSectionEndpoint, 'data.data.shortest_stage_races', [])
                    .slice(0, 1)
                    .map((race, index) => (
                      <h5 key={index}>
                        <strong>{race.distance}</strong> distance
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

          {/* Fourth Card - GC Top 10s / Most Consistent GC */}
          {shouldShowCard(fourthSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(fourthSectionEndpoint)}</h4>
                  {getSafeData(fourthSectionEndpoint, 'data.data', [])
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
                {fourthSectionEndpoint === "gcTop10s" &&
                  getSafeData(fourthSectionEndpoint, 'data.data', [])
                    .slice(0, 1)
                    .map((rider, index) => (
                      <h5 key={index}>
                        <strong>{rider.count || "N/A"}</strong> Race count
                      </h5>
                    ))}
                
                {fourthSectionEndpoint === "mostConsistentGC" &&
                  getSafeData(fourthSectionEndpoint, 'data.data', [])
                    .slice(0, 1)
                    .map((rider, index) => (
                      <h5 key={index}>
                        <strong>{rider.total_gc_races || "N/A"}</strong> Race count
                      </h5>
                    ))}
                
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Fifth Card - Stage Top 10s / GC Top 10s (List) */}
          {shouldShowCard(fifthSectionEndpoint) && (
            <div className="col-lg-5">
              <div className="list-white-cart">
                <h4 className="font-size-change">
                  {getEndpointMessage(fifthSectionEndpoint)}
                </h4>
                {getSafeData(fifthSectionEndpoint, 'data.data', [])
                  .slice(0, 5)
                  .map((rider, index) => (
                    <ul key={index}>
                      <li>
                        <strong>{index + 1}</strong>
                        <div className="name-wraper">
                          {rider.rider_country && (
                            <Flag
                              code={rider.rider_country}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                          <h6>{rider.rider_name}</h6>
                        </div>
                        <span>{rider.age || "-"} jaar</span>
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
          )}

          {(shouldShowCard(sixSectionEndpoint) || 
            shouldShowCard(seventhSectionEndpoint) || 
            shouldShowCard(eightSectionEndpoint) || 
            shouldShowCard(lastSectionEndpoint)) && (
            <div className="col-lg-7">
              <div className="row">
                {/* Sixth Card - Most Racing Days */}
                {shouldShowCard(sixSectionEndpoint) && (
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{getEndpointMessage(sixSectionEndpoint)}</h4>
                        {getSafeData(sixSectionEndpoint, 'data.result', [])
                          .slice(0, 5)
                          .map((rider, index) => (
                            <ul key={index}>
                              <li>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper">
                                  <h6>{rider.rider_key}</h6>
                                </div>
                                <span>{rider.racing_days} day{rider.racing_days !== 1 ? 's' : ''}</span>
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

                {/* Seventh Card - Most Top 5 No Wins / Most Second Places */}
                {shouldShowCard(seventhSectionEndpoint) && (
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">
                          {getEndpointMessage(seventhSectionEndpoint)}
                        </h4>
                        {getSafeData(seventhSectionEndpoint, 'data.data', [])
                          .slice(0, 1)
                          .map((rider, index) => (
                            <div className="name-wraper" key={index}>
                              {rider.rider_country && (
                                <Flag
                                  code={rider.rider_country}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginLeft: "10px",
                                  }}
                                />
                              )}
                              <h6>{rider.rider_name}</h6>
                            </div>
                          ))}
                      </div>
                      {getSafeData(seventhSectionEndpoint, 'data.data', [])
                        .slice(0, 1)
                        .map((rider, index) => (
                          <h5 key={index}>
                            <strong>{rider.age || "N/A"}</strong>
                            {" jaar"}
                          </h5>
                        ))}
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Eighth Card - Grand Tour Stage Win / Best Classics */}
                {shouldShowCard(eightSectionEndpoint) && (
                  <div className="col-lg-6 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">
                          {getEndpointMessage(eightSectionEndpoint)}
                        </h4>
                        {getSafeData(eightSectionEndpoint, 'data.data', [])
                          .slice(0, 3)
                          .map((rider, index) => (
                            <ul key={index} className="listdata">
                              <li>
                                <div className="name-wraper">
                                  {rider.rider_country && (
                                    <Flag
                                      code={rider.rider_country}
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginLeft: "10px",
                                      }}
                                    />
                                  )}
                                  <h6>{rider.rider_name}</h6>
                                  <span>{rider.wins} win{rider.wins !== 1 ? 's' : ''}</span>
                                </div>
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

                {/* Last Card - Most Weight / Lightest Rider */}
      
                {shouldShowCard(lastSectionEndpoint) && (
                  <div className="col-lg-6 col-md-6">
                    <div className="team-cart lime-green-team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{getEndpointMessage(lastSectionEndpoint)}</h4>
                        {(() => {
                          const riderData = getSafeData(lastSectionEndpoint, 'data.data', null);
                          return riderData ? (
                            <div className="name-wraper">
                              {riderData.rider_country && (
                                <Flag
                                  code={riderData.rider_country.toUpperCase()}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "10px",
                                  }}
                                />
                              )}
                              <h6>{riderData.name}</h6>
                            </div>
                          ) : null;
                        })()}
                      </div>
                      {(() => {
                        const riderData = getSafeData(lastSectionEndpoint, 'data.data', null);
                        return riderData ? (
                          <h5>
                            <strong>{riderData.weight || "N/A"}</strong> kg
                          </h5>
                        ) : null;
                      })()}
                      <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SecondSection;