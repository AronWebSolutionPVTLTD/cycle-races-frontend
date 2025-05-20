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
const FirstSection = ({ selectedYear, selectedNationality, name }) => {
 
  // Define endpoint groups for different sections of rider statistics
  const firstSectionEndpoints = ["totalWinsByNationality", "mostWins"];
  const secondSectionEndpoints = [
    "getRaceParticipants",
    "getMostParticipantsByNationality",
    "getNationalityWithMostDNF",
  ];

  const thirdSectionEndpoints = ["getOldestStageWinner", "getYoungestWinner"];
  const fourthSectionEndpoints = [
    "getPodiumNationalityStats",
    "getLastWinByNationality",
  ];
  const fifthSectionEndpoints = [
    "getRiderWithMostStageWins",
    "getRiderWithMostGCPodiums",
  ];

  const sixthSectionEndpoints = [
    "getRiderWithMostGCTop10s",
    "getRiderWithMostDNFs",
    "getRiderWithMostFinishes",
  ];

  const seventhSEctionEndpoints = [
    "getNationalityWithMostTop10",
    "getYoungestNationalityRider",
    "getOldestNationalityRider",
  ];
  // State for selected endpoints
  const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(
    firstSectionEndpoints[0]
  );
  const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(
    secondSectionEndpoints[0]
  );

  const [thirdSectionEndpoint, setThirdSectionEndpoint] = useState(
    thirdSectionEndpoints[0]
  );
  const [fourthSectionEndpoint, setFourthSectionEndpoint] = useState(
    fourthSectionEndpoints[0]
  );
  const [fifthSectionEndpoint, setFifthSectionEndpoint] = useState(
    fifthSectionEndpoints[0]
  );
  const [sixthSectionEndpoint, setSixthSectionEndpoint] = useState(
    sixthSectionEndpoints[0]
  );
  const [seventhSectionEndpoint, setSeventhSectionEndpoint] = useState(
    seventhSEctionEndpoints[0]
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
      setSecondSectionEndpoint(getRandomEndpoint(secondSectionEndpoints));
      setThirdSectionEndpoint(getRandomEndpoint(thirdSectionEndpoints));
      setFourthSectionEndpoint(getRandomEndpoint(fourthSectionEndpoints));
      setFifthSectionEndpoint(getRandomEndpoint(fifthSectionEndpoints));
      setSixthSectionEndpoint(getRandomEndpoint(sixthSectionEndpoints));
      setSeventhSectionEndpoint(getRandomEndpoint(seventhSEctionEndpoints));
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

  const raceEndpointsToFetch = [
    firstSectionEndpoint,
    secondSectionEndpoint,

    fourthSectionEndpoint,
    seventhSectionEndpoint,
  ];

  const stageEndpointsToFetch = [
    thirdSectionEndpoint,
    fifthSectionEndpoint,
    sixthSectionEndpoint,
  ];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {
    // Add specific endpoint mappings here if needed
    // For example:
    // 'bestGCResults': '/race-stats/:id/bestGCResults'
  };

  // Use the updated hook with options object
  // const { data, loading, error, partialSuccess } = useMultipleData(
  //   endpointsToFetch,
  //   {
  //     name: name,
  //     queryParams: buildQueryParams(),
  //     endpointsMappings: endpointsMappings,
  //     idType: "raceDetailsStats",

  //   }
  // );
  // For race endpoints
  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
    partialSuccess: racePartialSuccess,
  } = useMultipleData(raceEndpointsToFetch, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "raceDetailsStats",
  });

  // For team endpoints
  const {
    data: stageData,
    loading: stageLoading,
    error: stageError,
    partialSuccess: stagePartialSuccess,
  } = useMultipleData(stageEndpointsToFetch, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "stageStats",
  });

  // Combine results
  const loading = raceLoading || stageLoading;
  const error = raceError || stageError;
  const data = { ...raceData, ...stageData };

  // Calculate the overall partialSuccess status
  const partialSuccess =
    !loading &&
    // At least one group had partial success
    (racePartialSuccess ||
      stagePartialSuccess ||
      // Or one group succeeded and one failed completely
      (raceError && !stageError) ||
      (!raceError && stageError));

  // Update state after data is loaded
  useEffect(() => {
    if (!loading && data) {
      // Count how many endpoints returned valid data
      let cardCount = 0;
      let totalCount =
        raceEndpointsToFetch.length + stageEndpointsToFetch.length;

      // endpointsToFetch.forEach((endpoint) => {
      //   if (hasValidData(endpoint)) {
      //     cardCount++;
      //   }
      // });

      raceEndpointsToFetch.forEach((endpoint) => {
        if (hasValidData(endpoint)) {
          cardCount++;
        }
      });

      // Check stage endpoints
      stageEndpointsToFetch.forEach((endpoint) => {
        if (hasValidData(endpoint)) {
          cardCount++;
        }
      });

      setVisibleCardCount(cardCount);
      setTotalEndpoints(totalCount);
      setNoDataFound(cardCount === 0);
    }
  }, [data, loading, raceEndpointsToFetch, stageEndpointsToFetch]);

  // Check if an endpoint has valid data
  const hasValidData = (endpoint) => {
    if (!data || !data[endpoint] || !data[endpoint].data) {
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
    // return (
    //   error && error.failedEndpoints && error.failedEndpoints.includes(endpoint)
    // );
    const errorObj = raceEndpointsToFetch.includes(endpoint)
      ? raceError
      : stageError;
    return (
      errorObj &&
      errorObj.failedEndpoints &&
      errorObj.failedEndpoints.includes(endpoint)
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
  // const showPartialWarning =
  //   partialSuccess ||
  //   (error &&
  //     error.failedEndpoints &&
  //     endpointsToFetch.some(
  //       (endpoint) =>
  //         !error.failedEndpoints.includes(endpoint) && hasValidData(endpoint)
  //     ));
  const showPartialWarning = partialSuccess;

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
                  <div className="name-wraper">
                    {getSafeData(
                      secondSectionEndpoint,
                      "data.rider_country"
                    ) && (
                      <Flag
                        code={getSafeData(
                          secondSectionEndpoint,
                          "data.nationality_filter"
                        ).toUpperCase()}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <h6>
                      {getSafeData(
                        secondSectionEndpoint,
                        "data.race_name",
                        "N/A"
                      )}
                    </h6>
                  </div>
                  {getSafeData(firstSectionEndpoint, "data.most_wins", [])
                    .slice(0, 3)
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
                            <h6>
                              {rider.rider_name || "N/A"}({rider.age})
                            </h6>
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
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>

                  <div className="name-wraper">
                    {getSafeData(
                      secondSectionEndpoint,
                      "data.rider_country"
                    ) && (
                      <Flag
                        code={getSafeData(
                          secondSectionEndpoint,
                          "data.nationality_filter"
                        ).toUpperCase()}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <h6>
                      {getSafeData(
                        secondSectionEndpoint,
                        "data.race_name",
                        "N/A"
                      )}
                    </h6>
                  </div>
                  {getSafeData(secondSectionEndpoint, "data.editions", [])
                    .slice(0, 3)
                    .map((rider, index) => (
                      <ul key={index}>
                        <li>
                          <div className="name-wraper">
                            <h6>{rider.total_participants}</h6>Participants
                            <h6>{rider.year || "N/A"}</h6>
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

          {/* Third Card */}
          {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">
                    {getEndpointMessage(thirdSectionEndpoint)}
                  </h4>
                  {getSafeData(thirdSectionEndpoint, "data.data") && (
                    <>
                      <div className="name-wraper">
                        <Flag
                          code={getSafeData(
                            thirdSectionEndpoint,
                            "data.data.country"
                          )}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "10px",
                          }}
                        />
                        <h6>
                          Rider:{" "}
                          {getSafeData(
                            thirdSectionEndpoint,
                            "data.data.rider_name"
                          ) || "N/A"}
                        </h6>
                      </div>
                    </>
                  )}
                </div>
                <h5>
                  <strong>
                    {getSafeData(thirdSectionEndpoint, "data.data.age") ||
                      "N/A"}
                  </strong>
                  age
                </h5>
                <a href="#?" className="green-circle-btn">
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
                      <div className="name-wraper">
                        {getSafeData(
                          fourthSectionEndpoint,
                          "data.nationality_filter"
                        ) && (
                          <Flag
                            code={getSafeData(
                              fourthSectionEndpoint,
                              "data.nationality_filter"
                            ).toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>
                          {getSafeData(
                            fourthSectionEndpoint,
                            "data.race_name",
                            "N/A"
                          )}
                        </h6>
                      </div>
                    </div>
                    {fourthSectionEndpoint === "getLastWinByNationality"
                      ? getSafeData(fourthSectionEndpoint, "data.last_wins", [])
                          .slice(0, 1)
                          .map((team, index) => (
                            <>
                              <Flag
                                code={team.rider_country.toUpperCase()}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />

                              <h5 key={index}>
                                <strong>{team.rider_name || "N/A"}</strong>
                              </h5>
                            </>
                          ))
                      : getSafeData(
                          fourthSectionEndpoint,
                          "data.nationality_podium_stats",
                          []
                        )
                          .slice(0, 1)
                          .map((team, index) => (
                            <>
                              <Flag
                                code={team.nationality.toUpperCase()}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />

                              <h5 key={index}>
                                <strong>{team.podiums || "N/A"}</strong>
                                podiums
                              </h5>
                            </>
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
                      {getSafeData(fifthSectionEndpoint, "data.data") && (
                        <>
                          <div className="name-wraper">
                            <Flag
                              code={getSafeData(
                                fifthSectionEndpoint,
                                "data.data.country"
                              )}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "10px",
                              }}
                            />
                            <h6>
                              Race:{" "}
                              {getSafeData(
                                fifthSectionEndpoint,
                                "data.data.race_name"
                              ) || "N/A"}
                            </h6>
                            <h6>
                              Rider:{" "}
                              {getSafeData(
                                fifthSectionEndpoint,
                                "data.data.rider_name"
                              ) || "N/A"}
                            </h6>
                          </div>
                        </>
                      )}
                    </div>
                    {fifthSectionEndpoint === "getRiderWithMostGCPodiums" ? (
                      <h5>
                        <strong>
                          {getSafeData(
                            fifthSectionEndpoint,
                            "data.data.podiums"
                          ) || "N/A"}
                        </strong>
                        podiums
                      </h5>
                    ) : (
                      <h5>
                        <strong>
                          {getSafeData(
                            fifthSectionEndpoint,
                            "data.data.stage_wins"
                          ) || "N/A"}
                        </strong>
                        wins
                      </h5>
                    )}

                    <a href="#?" className="white-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}

              {/* Sixth Card - Most DNFs */}
              {shouldShowCard(sixthSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {getEndpointMessage(sixthSectionEndpoint)}
                      </h4>
                      {getSafeData(sixthSectionEndpoint, "data.data") && (
                        <>
                          <div className="name-wraper">
                            <Flag
                              code={getSafeData(
                                sixthSectionEndpoint,
                                "data.data.country"
                              )}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "10px",
                              }}
                            />
                            <h6>
                              Race:{" "}
                              {getSafeData(
                                sixthSectionEndpoint,
                                "data.data.race_name"
                              ) || "N/A"}
                            </h6>
                            <h6>
                              Rider:{" "}
                              {getSafeData(
                                sixthSectionEndpoint,
                                "data.data.rider_name"
                              ) || "N/A"}
                            </h6>
                          </div>
                        </>
                      )}
                    </div>

                    {sixthSectionEndpoint === "getRiderWithMostGCTop10s" ? (
                      <h5>
                        <strong>
                          {getSafeData(
                            sixthSectionEndpoint,
                            "data.data.top_10_count"
                          ) || "N/A"}
                        </strong>
                        count
                      </h5>
                    ) : (
                      <h5>
                        <strong>
                          {getSafeData(
                            sixthSectionEndpoint,
                            "data.data.count"
                          ) || "N/A"}
                        </strong>
                        count
                      </h5>
                    )}

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
          {shouldShowCard(seventhSectionEndpoint) && (
            <div className="col-lg-5">
              <div className="list-white-cart">
                <h4 className="font-size-change">
                  {getEndpointMessage(seventhSectionEndpoint)}
                </h4>

                <div className="text-wraper">
                  {getSafeData(seventhSectionEndpoint, "data") && (
                    <>
                      <div className="name-wraper">
                        <Flag
                          code={getSafeData(
                            seventhSectionEndpoint,
                            "data.nationality_filter"
                          )}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "10px",
                          }}
                        />
                        <h6>
                          Race:{" "}
                          {getSafeData(
                            seventhSectionEndpoint,
                            "data.race_name"
                          ) || "N/A"}
                        </h6>
                      </div>
                    </>
                  )}
                </div>
                {seventhSectionEndpoint === "getYoungestNationalityRider"
                  ? getSafeData(
                      seventhSectionEndpoint,
                      "data.youngest_riders_by_nationality",
                      []
                    )
                      .slice(0, 5)
                      .map((team, index) => (
                        <ul key={index}>
                          <li>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <Flag
                                code={(team.nationality || "N/A").toUpperCase()}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />
                              <h6>{team.rider_name || "N/A"}</h6>
                            </div>
                          </li>
                        </ul>
                      ))
                  : seventhSectionEndpoint === "getOldestNationalityRider"
                  ? getSafeData(
                      seventhSectionEndpoint,
                      "data.getOldestNationalityRider",
                      []
                    )
                      .slice(0, 5)
                      .map((team, index) => (
                        <ul key={index}>
                          <li>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <Flag
                                code={(team.nationality || "N/A").toUpperCase()}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />
                              <h6>{team.rider_name || "N/A"}</h6>
                            </div>
                          </li>
                        </ul>
                      ))
                  : getSafeData(seventhSectionEndpoint, "data.editions", [])
                      .slice(0, 3)
                      .map((team, index) => (
                        <ul key={index}>
                          <li>
                            <div className="name-wraper">
                              {team.nationality_names && (
                                <Flag
                                  code={(
                                    team.nationality_names[0] || "N/A"
                                  ).toUpperCase()}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "10px",
                                  }}
                                />
                              )}
                              <h6>{team.total_participants || "N/A"}</h6>
                              Participants
                            </div>
                            <h6>{team.year || "N/A"}(year)</h6>
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
        </>
      )}
    </>
  );
};

export default FirstSection;
