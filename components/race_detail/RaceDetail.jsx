import React, { useState, useEffect } from "react";

import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

export const RaceDetail = ({ selectedYear, selectedNationality, name }) => {
  // Define single API endpoint for each section box
  const fixedApis = {
    box1: "totalWinsByNationality",
    box2: "getRaceParticipants",
    box3: "getOldestStageWinner",
    box4: "getPodiumNationalityStats",
    box5: "getRiderWithMostStageWins",
    box6: "getRiderWithMostGCTop10s",
    box7: "getNationalityWithMostTop10",
    box8:"mostWins"
  };

  // Build query parameters based on selected filters
  const buildQueryParams = () => {
    let params = {};
    if (selectedYear && selectedYear !== "All-time") {
      params.year = selectedYear;
    }
    if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

  // Separate race and stage endpoints
  const raceEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    fixedApis.box4,
    fixedApis.box7,
     fixedApis.box8,
  ];
  const stageEndpoints = [
    fixedApis.box3, 
    fixedApis.box5, 
    fixedApis.box6];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {};

  // For race endpoints
  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
  } = useMultipleData(raceEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "raceDetailsStats",
  });

  // For stage endpoints
  const {
    data: stageData,
    loading: stageLoading,
    error: stageError,
  } = useMultipleData(stageEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "stageStats",
  });

  // Combine results
  const data = { ...raceData, ...stageData };
  const loading = raceLoading || stageLoading;
  const error = raceError || stageError;

  // Function to get box data similar to LastSection
  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
      response?.data?.data?.most_wins,
      response?.data?.data?.result,
      response?.data?.data,
      response?.data,
      response?.data?.riders,
      response,
    ];

    for (const path of paths) {
      if (Array.isArray(path) && path.length > 0) {
        return { data: path, error: false };
      }
    }

    return { error: true, errorType: "no_data_found" };
  };

  return (
    <section className="home-sec5">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton />}

          {/* Show global error if all data failed */}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load rider statistics. Please try again later." />
          )}

          {/* Show content only when not loading and no global error */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              {/* Box 1 - Total Wins by Nationality */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                      <h4>{data?.[fixedApis.box1]?.message}</h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && <span>{rider.wins} wins</span>}
                            </li>
                          ))}
                      </ul>
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>
              {/* Box 2 - Race Participants  */}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    // Special handling for box5 since it returns a single object, not an array
                    if (!data?.[fixedApis.box2]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box2];
                    const riderData = response?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4>{data?.[fixedApis.box2]?.message}</h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.nationality_filter)}
                            <h6>{riderData?.race_name || "..."}</h6>
                          </div>
                          {riderData?.total_unique_riders && (
                            <h5>
                              <strong>{riderData.total_unique_riders} </strong>{" "}
                              total participants
                            </h5>
                          )}
                        </div>
                        <a href="#?" className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Box 3 - Oldest Winner  */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    // Special handling for box5 since it returns a single object, not an array
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    const riderData = response?.data.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4>{data?.[fixedApis.box3]?.message}</h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.age && (
                            <h5>
                              <strong>{riderData.age} </strong> jaar
                            </h5>
                          )}
                        </div>
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
              {/* Box 4 - PodiumNationalityStats */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    if (!data?.[fixedApis.box4]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box4];
                    const riderData = response?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4>{data?.[fixedApis.box4]?.message}</h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.nationality_filter)}
                            <h6>{riderData?.race_name || "..."}</h6>
                          </div>
                          {riderData?.total_podiums_matched && (
                            <h5>
                              <strong>
                                {riderData.total_podiums_matched}{" "}
                              </strong>{" "}
                              total podium
                            </h5>
                          )}
                        </div>
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="col-lg-7">
                <div className="row">
                  {/* Box 5 - Rider With MostStageWins */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      {(() => {
                        if (!data?.[fixedApis.box5]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box5];
                        const riderData = response?.data.data;

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <div className="text-wraper">
                              <h4>{data?.[fixedApis.box5]?.message}</h4>
                              <div className="name-wraper">
                                {renderFlag(riderData?.country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.stage_wins && (
                                <h5>
                                  <strong>{riderData.stage_wins} </strong> wins
                                </h5>
                              )}
                            </div>
                            <a href="#?" className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </a>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  {/*   Box 6 - Rider With MostGCTop10s */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      {(() => {
                        if (!data?.[fixedApis.box6]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box6];
                        const riderData = response?.data.data;

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <div className="text-wraper">
                              <h4>{data?.[fixedApis.box6]?.message}</h4>
                              <div className="name-wraper">
                                {renderFlag(riderData?.country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.top_10_count && (
                                <h5>
                                  <strong>{riderData.top_10_count} </strong>{" "}
                                  count
                                </h5>
                              )}
                            </div>
                            <a href="#?" className="white-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </a>
                          </>
                        );
                      })()}
                    </div>
                  </div>
{/*   Box 7 - Nationality With MostTop10 */}

 <div className="col-lg-7 col-md-6">
                <div className="team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                   if (!data?.[fixedApis.box7]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box7];
                    const riderData = response?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4>{data?.[fixedApis.box7]?.message}</h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.nationality_filter)}
                            <h6>{riderData?.race_name || "..."}</h6>
                          </div>
                          {riderData?.total_riders_matched && (
                            <h5>
                              <strong>{riderData.total_riders_matched} </strong> total riders
                            </h5>
                          )}
                        </div>
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
              {/*   Box 8 - Mots win*/} 
  <div className="col-lg-5 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box8).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box8).errorType}
                    />
                  ) : (
                    <>
                      <h4>{data?.[fixedApis.box8]?.message}</h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box8).data)
                          ? getBoxData(fixedApis.box8).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && <span>{rider.wins} wins</span>}
                            </li>
                          ))}
                      </ul>
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>
                </div>
              </div>
            </>
          )}

          {/* Box 5 - PodiumNationalityStats */}
        </div>
      </div>
    </section>
  );
};
