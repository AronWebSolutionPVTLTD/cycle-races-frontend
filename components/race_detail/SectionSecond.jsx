import React, { useState, useEffect } from "react";

import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

export const SectionSection = ({ selectedYear, selectedNationality, name }) => {
  // Define single API endpoint for each section box
  const fixedApis = {
    box1: "getTop5ResultsForOneDayRace",
    box2: "getMostParticipantsByNationality",
    box3: "getRiderWithMostGCPodiums",
    box4: "getRiderWithMostDNFs",
    box5: "getRiderWithMostFinishes",
    box6: "getYoungestNationalityRider",
    box7: "getOldestNationalityRider",
    box8: "getNationalityWithMostDNF",
    box9: "getLastWinByNationality",
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
    fixedApis.box6,
    fixedApis.box7,
    fixedApis.box8,
    fixedApis.box9,
  ];
  const stageEndpoints = [
    fixedApis.box3,
    fixedApis.box4,
    fixedApis.box5,

    ,
  ];

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

    // Check if editions[0].top_5 exists
    const editions = response?.data?.editions;
    if (Array.isArray(editions) && editions.length > 0) {
      const top5 = editions[0]?.top_5;
      if (Array.isArray(top5) && top5.length > 0) {
        return { data: top5, error: false };
      }
    }
    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
      response?.data?.data?.most_wins,
      response?.data?.data?.result,
      response?.data?.data,
      response?.data?.youngest_riders_by_nationality,
      response?.data?.oldest_riders_by_nationality,
       response?.data?.last_wins,
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
              {/*   Box 1 - Top5 Results ForOneDayRace*/}
              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart">
                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                      <h4 className="fs-chenge">
                        {" "}
                        {data?.[fixedApis.box1]?.message}
                      </h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.points && (
                                <span>{rider.points} points</span>
                              )}
                            </li>
                          ))}
                      </ul>

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
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-7">
                <div className="row">
                  {/* Box 2 - Most Participants By Nationality */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      {(() => {
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
                                {renderFlag(riderData?.nationality)}
                                <h6>{riderData?.race_name || "..."}</h6>
                              </div>
                              {riderData?.total_riders_matched && (
                                <h5>
                                  <strong>
                                    {riderData.total_riders_matched}{" "}
                                  </strong>{" "}
                                  total riders
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

                  {/*   Box 3 - Rider With MostGCPodiums */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      {(() => {
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
                              {riderData?.podiums && (
                                <h5>
                                  <strong>{riderData.podiums} </strong> podiums
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
                  {/*   Box 4 - Rider With MostDNFs */}

                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      {(() => {
                        if (!data?.[fixedApis.box4]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box4];
                        const riderData = response?.data.data;

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <div className="text-wraper">
                              <h4>{data?.[fixedApis.box4]?.message}</h4>
                              <div className="name-wraper">
                                {renderFlag(riderData?.country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.count && (
                                <h5>
                                  <strong>{riderData.count} </strong> count
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
                  {/*   Box5 - Rider with most Finishes*/}
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
                              {riderData?.count && (
                                <h5>
                                  <strong>{riderData.count} </strong> count
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
                </div>
              </div>

              {/* Box 6 -  Yougest rider by nationality */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box6).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box6).errorType}
                    />
                  ) : (
                    <>
                      <h4>{data?.[fixedApis.box6]?.message}</h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box6).data)
                          ? getBoxData(fixedApis.box6).data
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

                              {rider?.age && <span>{rider.age} jaar</span>}
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
              {/* Box 7 - Oldest Nationality Rider  */}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>{" "}
                  {getBoxData(fixedApis.box7).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box7).errorType}
                    />
                  ) : (
                    <>
                      {(Array.isArray(getBoxData(fixedApis.box7).data)
                        ? getBoxData(fixedApis.box7).data
                        : []
                      )
                        .slice(0, 1)
                        .map((rider, index) => (
                          <div className="text-wraper">
                            <h4 className="font-size-change">
                              {" "}
                              {data?.[fixedApis.box7]?.message}
                            </h4>
                            <div className="name-wraper" key={index}>
                              {renderFlag(rider?.nationality)}
                              <h6>{rider?.rider_name || "..."}</h6>
                            </div>

                            {rider?.age && (
                              <h5>
                                <strong>{rider.age} </strong> jaar
                              </h5>
                            )}
                          </div>
                        ))}

                      <a href="#?" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Box 8 - Oldest Winner  */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    // Special handling for box5 since it returns a single object, not an array
                    if (!data?.[fixedApis.box8]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box8];
                    const riderData = response?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4>{data?.[fixedApis.box8]?.message}</h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.nationality)}
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
              {/* Box 9 - LastWin By Nationality */}
                <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box9).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box9).errorType}
                    />
                  ) : (
                    <>
                      <h4>{data?.[fixedApis.box9]?.message}</h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box9).data)
                          ? getBoxData(fixedApis.box9).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.year && <span>{rider.year} year</span>}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};
