import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";
import { useMultipleData } from "../home_api_data";
import {
  BoxSkeleton,
  ErrorStats,
  LoadingStats,
  NoDataMessage,
  PartialDataWarning,
} from "../loading&error";

// This component will handle the random rider statistics section
const RiderRandomStatsOne = ({ riderId, filterYear }) => {
  // Define endpoint groups for different sections of rider statistics
  const firstSectionEndpoints = ["first-win", "getRiderFirstWin"];
  const secondSectionEndpoints = [
    "getBestGCResult",
    "bestSeason",
    "getRiderMostRacedCountry",
  ];
  const thirdSectionEndpoints = ["getRiderYearsActive", "bestCountry"];
  const fourthSectionEndpoints = ["getRiderTotalWins"];
  const fifthSectionEndpoints = ["contactHistory", "homeCountryWins"];
  const sixthSectionEndpoints = ["riderFromSameHomeTown", "teamMates"];
  const seventhSectionEndpoints = [
    "getRiderBestMonumentResults",
    "getRiderAllVictories",
  ];
  const eightSectionEndpoints = [
    "uciPoints",
    "winsInOneDay",
    "getRiderLongestNoWinStreak",
  ];
  const ninthSectionEndpoints = [
    "getRiderWinsBySeason",
    "getRiderLastPlaceFinishes",
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
    seventhSectionEndpoints[0]
  );
  const [eightSectionEndpoint, setEightSectionEndpoint] = useState(
    eightSectionEndpoints[0]
  );
  const [ninthSectionEndpoint, setNinthSectionEndpoint] = useState(
    ninthSectionEndpoints[0]
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
      setSeventhSectionEndpoint(getRandomEndpoint(seventhSectionEndpoints));
      setEightSectionEndpoint(getRandomEndpoint(eightSectionEndpoints));
      setNinthSectionEndpoint(getRandomEndpoint(ninthSectionEndpoints));
    } catch (err) {
      console.error("Error selecting random endpoints:", err);
    }
  }, []);

  // Build query parameters based on selected filters
  const buildQueryParams = () => {
    let params = {};
    if (filterYear && filterYear !== "All-time") {
      params.year = filterYear;
    }
    return params;
  };

  const endpointsToFetch = [
    firstSectionEndpoint,
    secondSectionEndpoint,
    thirdSectionEndpoint,
    fourthSectionEndpoint,
    fifthSectionEndpoint,
    sixthSectionEndpoint,
    seventhSectionEndpoint,
    eightSectionEndpoint,
    ninthSectionEndpoint,
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
      id: riderId,
      queryParams: buildQueryParams(),
      endpointsMappings: endpointsMappings,
      idType: "rider", // Use "race" if needed for specific endpoints
    }
  );

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
      !data[endpoint].data ||
      !data[endpoint].data.data
    ) {
      return false;
    }

    const endpointData = data[endpoint].data.data;

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
      getRiderFirstWin: "First Career Win",
      "career-wins": "Career Wins",
      "biggest-win": "Biggest Win",
      "season-highlights": "Season Highlights",
      "best-season": "Best Season",
      "stage-wins": "Stage Wins",
      "gc-wins": "GC Victories",
      "comparison-rivals": "Vs Rivals",
      "comparison-teammates": "Vs Teammates",
      "racing-days-per-year": "Racing Days",
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
          <BoxSkeleton />
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
          <NoDataMessage filterYear={filterYear} />
        </div>
      )}

      {!isLoading && !noDataFound && (
        <div className="row">
          {/* First Card */}
          {shouldShowCard(firstSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
                <h4>{getEndpointMessage(firstSectionEndpoint)}</h4>
                <ul>
                  {/* <li>
                    <div className="name-wraper">
                      {getSafeData(
                        firstSectionEndpoint,
                        "data.data.rider_country"
                      ) && (
                        <Flag
                          code={getSafeData(
                            firstSectionEndpoint,
                            "data.data.rider_country"
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
                          firstSectionEndpoint,
                          "data.data.rider_name",
                          "..."
                        )}
                      </h6>
                    </div>
                  </li> */}
                  <li>
                    <div className="name-wraper">
                      {getSafeData(
                        firstSectionEndpoint,
                        "data.data.raceTitle"
                      ) && (
                        <h6 className="text-break text-dark fw-semibold">
                          Race :{" "}
                          {getSafeData(
                            firstSectionEndpoint,
                            "data.data.raceTitle"
                          )}
                        </h6>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="name-wraper">
                      {getSafeData(firstSectionEndpoint, "data.data.age") && (
                        <h5>
                          Jaar :{" "}
                          {getSafeData(firstSectionEndpoint, "data.data.age")}
                        </h5>
                      )}
                    </div>
                  </li>
                </ul>

                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Second Card */}
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart class-for-mobil">
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>
                  <div className="name-wraper">
                    {getSafeData(
                      secondSectionEndpoint,
                      "data.data.nationality"
                    ) && (
                      <Flag
                        code={getSafeData(
                          secondSectionEndpoint,
                          "data.data.nationality"
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
                        "data.data.rider_name",
                        "N/A"
                      )}
                    </h6>
                  </div>

                  <h5>
                    {secondSectionEndpoint === "getBestGCResult" &&
                      getSafeData(
                        secondSectionEndpoint,
                        "data.data.bestGCRank"
                      ) && (
                        <>
                          <strong>
                            {getSafeData(
                              secondSectionEndpoint,
                              "data.data.bestGCRank"
                            )}
                          </strong>
                          rank
                        </>
                      )}

                    {secondSectionEndpoint === "bestSeason" &&
                      getSafeData(
                        secondSectionEndpoint,
                        "data.data.bestSeasonYear"
                      ) && (
                        <>
                          <strong>
                            {getSafeData(
                              secondSectionEndpoint,
                              "data.data.bestSeasonYear"
                            )}
                          </strong>
                          Season Year
                        </>
                      )}
                    {secondSectionEndpoint === "getRiderMostRacedCountry" &&
                      getSafeData(
                        secondSectionEndpoint,
                        "data.data.raceData.races_count"
                      ) && (
                        <>
                          <strong>
                            {getSafeData(
                              secondSectionEndpoint,
                              "data.data.raceData.races_count"
                            )}
                          </strong>
                          count
                        </>
                      )}
                  </h5>
                </div>
                <a href="#?" className="white-circle-btn">
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
                  <h4>{getEndpointMessage(thirdSectionEndpoint)}</h4>
                  <div className="name-wraper">
                    {thirdSectionEndpoint === "bestCountry"
                      ? getSafeData(
                          thirdSectionEndpoint,
                          "data.data.rider_country"
                        ) && (
                          <Flag
                            code={getSafeData(
                              thirdSectionEndpoint,
                              "data.data.rider_country"
                            ).toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )
                      : getSafeData(
                          thirdSectionEndpoint,
                          "data.data.nationality"
                        ) && (
                          <Flag
                            code={getSafeData(
                              thirdSectionEndpoint,
                              "data.data.nationality"
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
                        thirdSectionEndpoint,
                        "data.data.rider_name",
                        "N/A"
                      )}
                    </h6>
                  </div>
                </div>
                <h5>
                  {thirdSectionEndpoint === "getRiderYearsActive" && (
                    <>
                      <strong>
                        {getSafeData(
                          thirdSectionEndpoint,
                          "data.data.yearsActive",
                          "N/A"
                        )}
                      </strong>{" "}
                      Years Active
                    </>
                  )}
                  {thirdSectionEndpoint === "bestCountry" && (
                    <>
                      <strong>
                        {getSafeData(
                          thirdSectionEndpoint,
                          "data.data.winCount",
                          "N/A"
                        )}
                      </strong>{" "}
                      wins
                    </>
                  )}
                </h5>

                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/*Fourth Card*/}

          {shouldShowCard(fourthSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <div className="text-wraper">
                  <h4 className="fs-chenge">
                    {getEndpointMessage(fourthSectionEndpoint)}
                  </h4>
                  <div className="name-wraper">
                    <h5>
                      <strong>
                        {getSafeData(
                          fourthSectionEndpoint,
                          "data.data.total_wins",
                          "N/A"
                        )}
                      </strong>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*Fifth Card*/}
          <div className="col-lg-7">
            <div className="row">
              {shouldShowCard(fifthSectionEndpoint) && (
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart class-for-mobil class-for-mobil2">
                    <div className="text-wraper">
                      <h4>{getEndpointMessage(fifthSectionEndpoint)}</h4>
                      {fifthSectionEndpoint === "homeCountryWins" && (
                        <div className="name-wraper">
                          {/* Flag */}
                          <Flag
                            code={getSafeData(
                              fifthSectionEndpoint,
                              "data.data.nationality"
                            ).toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          <h6>
                            {getSafeData(
                              fifthSectionEndpoint,
                              "data.data.rider_name"
                            )}
                          </h6>
                        </div>
                      )}

                      {/* Dynamic content based on endpoint */}
                      {fifthSectionEndpoint === "contactHistory" && (
                        <>
                          <ul>
                            {/* <h6 style={{marginTop:"5px"}}>Contract History:</h6> */}
                            {getSafeData(
                              fifthSectionEndpoint,
                              "data.data.contracts",
                              []
                            )
                              .slice(0, 3)
                              .map((contract, idx) => (
                                <li key={idx}>
                                  <div className="name-wraper" style={{marginBottom:"6px"}}>
                                    {contract.teamCountry && (
                                      <Flag
                                        code={contract.teamCountry.toUpperCase()}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          marginRight: "10px",
                                        }}
                                      />
                                    )}

                                    <h6>{contract.team}</h6>
                                    <span>({contract.year})</span>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          {/* </div> */}
                        </>
                      )}

                      {fifthSectionEndpoint === "homeCountryWins" && (
                        <h5>
                          <strong>
                            {getSafeData(
                              fifthSectionEndpoint,
                              "data.data.total_home_country_wins",
                              "N/A"
                            )}
                          </strong>{" "}
                          Wins
                        </h5>
                      )}
                    </div>

                    {/* Action Button */}
                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}

              {/* Sixth Card*/}
              {shouldShowCard(sixthSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div
                    className={"team-cart lime-green-team-cart class-for-mobil"}
                  >
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper class-for-mobil">
                      <h4>{getEndpointMessage(sixthSectionEndpoint)}</h4>

                      {sixthSectionEndpoint === "riderFromSameHomeTown" && (
                        <>
                          <p>
                            <strong>
                              {getSafeData(
                                sixthSectionEndpoint,
                                "data.data.target_rider",
                                "N/A"
                              )}
                            </strong>{" "}
                            from{" "}
                            <strong>
                              {getSafeData(
                                sixthSectionEndpoint,
                                "data.data.birth_place",
                                "N/A"
                              )}
                            </strong>
                          </p>

                          <ul>
                            {(
                              getSafeData(
                                sixthSectionEndpoint,
                                "data.data.others_from_same_birthplace",
                                []
                              ) || []
                            )
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={rider._id || index}>
                                  {rider.nationality && (
                                    <div className="name-wraper">
                                      <Flag
                                        code={rider.nationality.toUpperCase()}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          marginRight: "10px",
                                        }}
                                      />

                                      <h6>{rider.name}</h6>
                                    </div>
                                  )}
                                </li>
                              ))}
                          </ul>
                        </>
                      )}

                      {sixthSectionEndpoint === "teamMates" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <p style={{ margin: 0 }}>
                            <strong>
                              {getSafeData(
                                sixthSectionEndpoint,
                                "data.data.rider",
                                "N/A"
                              )}
                            </strong>
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h5 style={{ margin: 0, fontWeight: "bold" }}>
                              Teammate:
                            </h5>
                            <span>
                              <strong>
                                {getSafeData(
                                  sixthSectionEndpoint,
                                  "data.data.top_teammate",
                                  "N/A"
                                )}
                              </strong>{" "}
                              (
                              {getSafeData(
                                sixthSectionEndpoint,
                                "data.data.times_raced",
                                "0"
                              )}{" "}
                              times)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <a href="#?" className="white-circle-btn">
                      <img src="/images/arow.svg" alt="Arrow" />
                    </a>
                  </div>
                </div>
              )}

              {/*Seventh Card*/}
              {shouldShowCard(seventhSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="list-white-cart">
                    {/* Conditional title */}
                    <h4>{getEndpointMessage(seventhSectionEndpoint)}</h4>

                    {/* <ul>
        <li>
          <div className="name-wraper">
            {(() => {
              const nationality = getSafeData(seventhSectionEndpoint, "data.data.nationality");
              return nationality ? (
                <Flag
                  code={nationality.toUpperCase()}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                />
              ) : null;
            })()}
            <h6>
              {seventhSectionEndpoint === "getRiderAllVictories"
                ? getSafeData(seventhSectionEndpoint, "data.data.rider_name", "N/A")
                : getSafeData(seventhSectionEndpoint, "data.data.rider", "N/A")}
            </h6>
          </div>
        </li>
      </ul> */}

                    {/* Best Monument Results */}
                    {seventhSectionEndpoint ===
                      "getRiderBestMonumentResults" && (
                      <ul>
                        {getSafeData(
                          "getRiderBestMonumentResults",
                          "data.data.best_monument_results",
                          []
                        )
                          .slice(0, 3)
                          .map((result, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {result.race} ({result.year}) –
                              </div>
                              <span>{result.rank} rank</span>
                            </li>
                          ))}
                      </ul>
                    )}

                    {/* Rider All Victories */}
                    {seventhSectionEndpoint === "getRiderAllVictories" && (
                      <ul>
                        {getSafeData(
                          "getRiderAllVictories",
                          "data.data.data",
                          []
                        )
                          .slice(0, 3)
                          .map((victory, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {victory.race} ({victory.year}) –
                              </div>
                              <span>{victory.rank} rank</span>
                            </li>
                          ))}
                      </ul>
                    )}

                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="Arrow" />
                    </a>
                  </div>
                </div>
              )}

              {/*Eight Card*/}

              {shouldShowCard(eightSectionEndpoint) && (
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart class-for-mobil">
                    <div className="text-wraper">
                      <div className="text-wraper">
                        <h4>{getEndpointMessage(eightSectionEndpoint)}</h4>
                        <div className="name-wraper">
                          {eightSectionEndpoint === "uciPoints"
                            ? getSafeData(
                                eightSectionEndpoint,
                                "data.data.nationality"
                              ) && (
                                <Flag
                                  code={getSafeData(
                                    eightSectionEndpoint,
                                    "data.data.nationality"
                                  ).toUpperCase()}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "10px",
                                  }}
                                />
                              )
                            : getSafeData(
                                eightSectionEndpoint,
                                "data.data.rider_country"
                              ) && (
                                <Flag
                                  code={getSafeData(
                                    eightSectionEndpoint,
                                    "data.data.rider_country"
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
                              eightSectionEndpoint,
                              "data.data.rider_name",
                              "N/A"
                            )}
                          </h6>
                        </div>
                      </div>
                      <h5>
                        {eightSectionEndpoint === "uciPoints" ? (
                          <>
                            <strong>
                              {getSafeData(
                                eightSectionEndpoint,
                                "data.data.total_uci_points" || "0"
                              )}
                            </strong>
                            total points
                          </>
                        ) : eightSectionEndpoint ===
                            "getRiderLongestNoWinStreak" &&
                          getSafeData(
                            eightSectionEndpoint,
                            "data.data.longest_streak_without_win.streak_count"
                          ) ? (
                          <>
                            <strong>
                              {getSafeData(
                                eightSectionEndpoint,
                                "data.data.longest_streak_without_win.streak_count",
                                "N/A"
                              )}
                            </strong>
                            count
                          </>
                        ) : (
                          getSafeData(
                            eightSectionEndpoint,
                            "data.data.one_day_race_wins"
                          ) && (
                            <>
                              <strong>
                                {getSafeData(
                                  eightSectionEndpoint,
                                  "data.data.one_day_race_wins",
                                  "N/A"
                                )}
                              </strong>
                              wins
                            </>
                          )
                        )}
                      </h5>
                    </div>
                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*Ninth Card*/}
          {shouldShowCard(ninthSectionEndpoint) && (
            <div className="col-lg-5">
              <div className="list-white-cart lime-green-cart">
                <h4 className="fs-chenge">
                  {getEndpointMessage(ninthSectionEndpoint)}
                </h4>
                <ul>
                  {/* <li>
                    <div className="name-wraper">
                      {ninthSectionEndpoint === "getRiderLastPlaceFinishes"
                        ? getSafeData(
                            ninthSectionEndpoint,
                            "data.data.nationality"
                          ) && (
                            <Flag
                              code={getSafeData(
                                ninthSectionEndpoint,
                                "data.data.nationality"
                              ).toUpperCase()}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "10px",
                              }}
                            />
                          )
                        : getSafeData(
                            ninthSectionEndpoint,
                            "data.data.rider_country"
                          ) && (
                            <Flag
                              code={getSafeData(
                                ninthSectionEndpoint,
                                "data.data.rider_country"
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
                          ninthSectionEndpoint,
                          "data.data.rider_name",
                          "N/A"
                        )}
                      </h6>
                    </div>
                  </li> */}
                  <h4>
                    {" "}
                    {ninthSectionEndpoint === "getRiderLastPlaceFinishes"
                      ? "last place finishes"
                      : ""}
                  </h4>
                  {ninthSectionEndpoint === "getRiderLastPlaceFinishes"
                    ? (
                        getSafeData(
                          ninthSectionEndpoint,
                          "data.data.last_place_finishes",
                          []
                        ) || []
                      )
                        .slice(0, 5)
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <h6>
                                {rider.race} ({rider.year})
                              </h6>
                            </div>
                            {rider.rank && <span>{rider.rank} rank</span>}
                          </li>
                        ))
                    : (
                        getSafeData(
                          ninthSectionEndpoint,
                          "data.data.wins_per_season",
                          []
                        ) || []
                      )
                        .slice(0, 5)
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <h6>{rider.year}</h6>
                            </div>
                            <span>{rider.wins}</span>wins
                          </li>
                        ))}
                </ul>
                <a href="#?" className="glob-btn">
                  <strong>volledige stats</strong>
                  <span>
                    <img src="/images/arow.svg" alt="Arrow" />
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RiderRandomStatsOne;
