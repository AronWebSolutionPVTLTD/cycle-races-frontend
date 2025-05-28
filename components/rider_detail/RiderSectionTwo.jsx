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

const RiderSectionTwo = ({ riderId, filterYear }) => {
  const firstSectionEndpoints = [
    "bestGCResults",
    "getBestStageResult",
    "getBestParisRoubaixResult",
  ];
  const secondSectionEndpoints = [
    "getGrandToursRidden",
    "getGrandTourDNFs",
    "getBestMonumentResults",
  ];
  const thirdSectionEndpoints = [
    "getFirstEverGrandTourWin",
    "getMostFrequentGrandTourTeammate",
    "getTotalDistanceRacedInGrandTours",
  ];
  const fourthSectionEndpoints = [
    "getFirstRankInGrandTours",
    "getTotalRacingDaysInGrandTours",
    "getFirstRankInMonuments",
    "getTop10StagesInGrandTours",
  ];

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

  const [isMounted, setIsMounted] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [totalEndpoints, setTotalEndpoints] = useState(0);

  const getRandomEndpoint = (endpointArray) => {
    const randomIndex = Math.floor(Math.random() * endpointArray.length);
    return endpointArray[randomIndex];
  };

  useEffect(() => {
    setIsMounted(true);
    try {
      // Get random endpoints for each section
      setFirstSectionEndpoint(getRandomEndpoint(firstSectionEndpoints));
      setSecondSectionEndpoint(getRandomEndpoint(secondSectionEndpoints));
      setThirdSectionEndpoint(getRandomEndpoint(thirdSectionEndpoints));
      setFourthSectionEndpoint(getRandomEndpoint(fourthSectionEndpoints));
    } catch (err) {
      console.error("Error selecting random endpoints:", err);
    }
  }, []);

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
  ];

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
      idType: "race",
    }
  );

  useEffect(() => {
    if (!loading && data) {
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

    if (Array.isArray(endpointData)) {
      return endpointData.length > 0;
    } else if (typeof endpointData === "object") {
      return Object.keys(endpointData).length > 0;
    }

    return false;
  };

  const hasEndpointError = (endpoint) => {
    return (
      error && error.failedEndpoints && error.failedEndpoints.includes(endpoint)
    );
  };

  const shouldShowCard = (endpoint) => {
    if (hasEndpointError(endpoint)) return false;
    if (!hasValidData(endpoint)) return false;
    return true;
  };

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

  const getSafeData = (endpoint, path, defaultValue = null) => {
    try {
      if (!data || !data[endpoint]) return defaultValue;
      return getNestedProperty(data[endpoint], path, defaultValue);
    } catch (err) {
      console.error(`Error accessing ${path} for ${endpoint}:`, err);
      return defaultValue;
    }
  };

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
    const endpointName = endpoint.split("/").pop();
    const apiMessage = getSafeData(endpoint, "message");
    if (apiMessage) return apiMessage;
    return getDefaultMessage(endpointName);
  };

  // Default messages for endpoints
  const getDefaultMessage = (endpointName) => {
    const messages = {
      "first-win": "First Win",
      getRiderFirstWin: "First Win",
    };

    return messages[endpointName] || "Rider Statistics";
  };
  console.log(secondSectionEndpoint, "dghd");

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
              <div className="team-cart">
                <div className="text-wraper">
                 
                    <h4>{getEndpointMessage(firstSectionEndpoint)}</h4>
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
                          "N/A"
                        )}
                      </h6>
                   
                  </div>
                 {(() => {
    let rank;

    if (firstSectionEndpoint === "getBestStageResult") {
      rank = getSafeData(firstSectionEndpoint, "data.data.best_stage_rank");
    } else if (firstSectionEndpoint === "getBestParisRoubaixResult") {
      rank = getSafeData(firstSectionEndpoint, "data.data.best_result.rank");
    } else if (firstSectionEndpoint === "bestGCResults") {
      rank = getSafeData(firstSectionEndpoint, "data.data.best_gc_rank");
    }

    return rank ? (
      <h5>
        <strong>{rank}</strong> rank
      </h5>
    ) : null;
  })()}
                </div>
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Second Card */}
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart">
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>
                  <div
                    className="name-wraper"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {getSafeData(
                      secondSectionEndpoint,
                      "data.data.rider_country"
                    ) && (
                      <Flag
                        code={getSafeData(
                          secondSectionEndpoint,
                          "data.data.rider_country"
                        ).toUpperCase()}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <h6 style={{ margin: 0 }}>
                      {secondSectionEndpoint === "getGrandToursRidden"
                        ? getSafeData(
                            secondSectionEndpoint,
                            "data.data.rider",
                          )
                        : getSafeData(
                            secondSectionEndpoint,
                            "data.data.rider_name",
                          )}
                    </h6>
                  </div>

                  <ul style={{ paddingLeft: "10px", marginBottom: "15px" }}>
                    {secondSectionEndpoint === "getGrandToursRidden"
                      ? (
                          getSafeData(
                            secondSectionEndpoint,
                            "data.data.grand_tours_ridden",
                            []
                          ) || []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "left",
                                marginBottom: "6px",
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              <div
                                className="name-wraper"
                                style={{ fontWeight: "500" }}
                              >
                                {rider.race}
                              </div>
                              <span style={{ color: "#777" }}>
                                {rider.rank}
                              </span>
                            </li>
                          ))
                      : secondSectionEndpoint === "getBestMonumentResults"
                      ? (
                          getSafeData(
                            secondSectionEndpoint,
                            "data.data.best_monument_results",
                            []
                          ) || []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              <div
                                className="name-wraper"
                                style={{ fontWeight: "500" }}
                              >
                                {rider.race}({rider.year})
                              </div>
                              <span style={{ color: "#777" }}>
                                {rider.rank} rank
                              </span>
                            </li>
                          ))
                      : (
                          getSafeData(
                            secondSectionEndpoint,
                            "data.data.dnfs",
                            []
                          ) || []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              <div
                                className="name-wraper"
                                style={{ fontWeight: "500" }}
                              >
                                {rider.race}
                              </div>
                              <span style={{ color: "#777" }}>
                                {rider.year}
                              </span>
                            </li>
                          ))}
                  </ul>
                </div>
                <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* third Card */}
          {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <div className="text-wraper">
                  <div className="text-wraper">
                    <h4>{getEndpointMessage(thirdSectionEndpoint)}</h4>
                    <div className="name-wraper">
                      {getSafeData(
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
                      )}
                      <h6>
                        {thirdSectionEndpoint ===
                        "getMostFrequentGrandTourTeammate"
                          ? getSafeData(
                              thirdSectionEndpoint,
                              "data.data.teammate_name",
                            )
                          : getSafeData(
                              thirdSectionEndpoint,
                              "data.data.rider_name",
                            )}
                      </h6>
                    </div>
                  </div>
               {(() => {
  let value;
  let label;

  if (thirdSectionEndpoint === "getFirstEverGrandTourWin") {
    value = getSafeData(thirdSectionEndpoint, "data.data.first_grand_tour_win.year");
    label = "Year";
  } else if (thirdSectionEndpoint === "getTotalDistanceRacedInGrandTours") {
    value = getSafeData(thirdSectionEndpoint, "data.data.total_distance_raced");
    label = "total race";
  } else {
    value = getSafeData(thirdSectionEndpoint, "data.data.times_raced_together");
    label = "Races";
  }

  return value ? (
    <h5>
      <strong>{value}</strong> {label}
    </h5>
  ) : null;
})()}

                </div>
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* fourth Card */}

          {shouldShowCard(fourthSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <div className="text-wraper">
                  <div className="text-wraper">
                    <h4>{getEndpointMessage(fourthSectionEndpoint)}</h4>
                    <div className="name-wraper">
                      {getSafeData(
                        fourthSectionEndpoint,
                        "data.data.rider_country"
                      ) && (
                        <Flag
                          code={getSafeData(
                            fourthSectionEndpoint,
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
                          fourthSectionEndpoint,
                          "data.data.rider_name",
                          "N/A"
                        )}
                      </h6>
                    </div>
                  </div>

                  {/* {fourthSectionEndpoint === "getFirstRankInGrandTours" ? (
                    <>
                      <h5 style={{ textAlign: "left", marginBottom: "8px" }}>
                        First rank races:
                      </h5>
                      <ul
                        style={{
                          paddingLeft: "20px",
                          marginBottom: "10px",
                          listStyleType: "disc",
                        }}
                      >
                        {(
                          getSafeData(
                            fourthSectionEndpoint,
                            "data.data.first_rank_races",
                            []
                          ) || []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li
                              key={index}
                              style={{
                                marginBottom: "6px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              <div
                                className="name-wraper"
                                style={{ fontWeight: "500" }}
                              >
                                {rider.race}
                              </div>
                              <span style={{ color: "#555" }}>
                                {rider.year} wins
                              </span>
                            </li>
                          ))}
                      </ul>
                    </>
                  ) : fourthSectionEndpoint === "getFirstRankInMonuments" ? (
                    <>
                      <h5 style={{ textAlign: "left", marginBottom: "8px" }}>
                        First rank races:
                      </h5>
                      <ul
                        style={{
                          paddingLeft: "20px",
                          marginBottom: "10px",
                          listStyleType: "disc",
                        }}
                      >
                        {(
                          getSafeData(
                            fourthSectionEndpoint,
                            "data.data.first_rank_races",
                            []
                          ) || []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li
                              key={index}
                              style={{
                                marginBottom: "6px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              <div
                                className="name-wraper"
                                style={{ fontWeight: "500" }}
                              >
                                {rider.race}
                              </div>
                              <span style={{ color: "#555" }}>
                                {rider.year}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </>
                  ) : fourthSectionEndpoint === "getTop10StagesInGrandTours" ? (
                    <>
                      <h5 style={{ textAlign: "left", marginBottom: "8px" }}>
                        Top stages:
                      </h5>
                      <ul
                        style={{
                          paddingLeft: "20px",
                          marginBottom: "10px",
                          listStyleType: "disc",
                        }}
                      >
                        {(
                          getSafeData(
                            fourthSectionEndpoint,
                            "data.data.top_10_stages",
                            []
                          ) || []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li
                              key={index}
                              style={{
                                marginBottom: "6px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              <div
                                className="name-wraper"
                                style={{ fontWeight: "500" }}
                              >
                                {rider.race}
                              </div>
                              <span style={{ color: "#555" }}>
                                {rider.year}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </>
                  ) : (
                    <h5 style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "16px", marginRight: "5px" }}>
                        {getSafeData(
                          fourthSectionEndpoint,
                          "data.data.total_racing_days",
                          "N/A"
                        )}
                      </strong>
                      {fourthSectionEndpoint ===
                      "getTotalRacingDaysInGrandTours"
                        ? "days"
                        : ""}
                    </h5>
                  )} */}
                  {fourthSectionEndpoint === "getFirstRankInGrandTours" ? (
  <>
    {(() => {
      const firstRankRaces = getSafeData(
        fourthSectionEndpoint,
        "data.data.first_rank_races",
        []
      ) || [];
      
      return firstRankRaces.length > 0 ? (
        <>
          <h5 style={{ textAlign: "left", marginBottom: "8px" }}>
            First rank races:
          </h5>
          <ul
            style={{
              paddingLeft: "20px",
              marginBottom: "10px",
              listStyleType: "disc",
            }}
          >
            {firstRankRaces
              .slice(0, 5)
              .map((rider, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  <div
                    className="name-wraper"
                    style={{ fontWeight: "500" }}
                  >
                    {rider.race}
                  </div>
                  <span style={{ color: "#555" }}>
                    {rider.year} wins
                  </span>
                </li>
              ))}
          </ul>
        </>
      ) : null;
    })()}
  </>
) : fourthSectionEndpoint === "getFirstRankInMonuments" ? (
  <>
    {(() => {
      const firstRankRaces = getSafeData(
        fourthSectionEndpoint,
        "data.data.first_rank_races",
        []
      ) || [];
      
      return firstRankRaces.length > 0 ? (
        <>
          <h5 style={{ textAlign: "left", marginBottom: "8px" }}>
            First rank races:
          </h5>
          <ul
            style={{
              paddingLeft: "20px",
              marginBottom: "10px",
              listStyleType: "disc",
            }}
          >
            {firstRankRaces
              .slice(0, 5)
              .map((rider, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  <div
                    className="name-wraper"
                    style={{ fontWeight: "500" }}
                  >
                    {rider.race}
                  </div>
                  <span style={{ color: "#555" }}>
                    {rider.year}
                  </span>
                </li>
              ))}
          </ul>
        </>
      ) : null;
    })()}
  </>
) : fourthSectionEndpoint === "getTop10StagesInGrandTours" ? (
  <>
    {(() => {
      const topStages = getSafeData(
        fourthSectionEndpoint,
        "data.data.top_10_stages",
        []
      ) || [];
      
      return topStages.length > 0 ? (
        <>
          <h5 style={{ textAlign: "left", marginBottom: "8px" }}>
            Top stages:
          </h5>
          <ul
            style={{
              paddingLeft: "20px",
              marginBottom: "10px",
              listStyleType: "disc",
            }}
          >
            {topStages
              .slice(0, 5)
              .map((rider, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  <div
                    className="name-wraper"
                    style={{ fontWeight: "500" }}
                  >
                    {rider.race}
                  </div>
                  <span style={{ color: "#555" }}>
                    {rider.year}
                  </span>
                </li>
              ))}
          </ul>
        </>
      ) : null;
    })()}
  </>
) : (
  <>
    {(() => {
      const totalRacingDays = getSafeData(
        fourthSectionEndpoint,
        "data.data.total_racing_days",
        null
      );
      
      return totalRacingDays && totalRacingDays !== "N/A" ? (
        <h5 style={{ textAlign: "right" }}>
          <strong style={{ fontSize: "16px", marginRight: "5px" }}>
            {totalRacingDays}
          </strong>
          {fourthSectionEndpoint === "getTotalRacingDaysInGrandTours" ? "days" : ""}
        </h5>
      ) : null;
    })()}
  </>
)}
                </div>
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RiderSectionTwo;
