import React, { useState, useEffect } from "react";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const RaceDetail = ({ selectedYear, selectedNationality, name }) => {
  const fixedApis = {
    box1: "mostWins",
    box2: "mostWins",
    box3: "getMostPodiumsByRiderInRace",
    box4: "getRaceParticipants",
    box5: "getTeamWithMostWinsInRace",
    box6: "getMostTop10ByRiderInRace",
    box7: "getLastWinner",
    box8: "getFastestRaceEdition",
    box9: "mostWins",
  };

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
    fixedApis.box9,
  ];

  const onedayRace = [
    fixedApis.box3,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box7,
    fixedApis.box8,
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

  // For onedayRace endpoints
  const {
    data: OneDayData,
    loading: OneDayLoading,
    error: OneDayError,
  } = useMultipleData(onedayRace, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "oneDayRaceStats",
  });
  // Combine results
  const data = { ...raceData, ...OneDayData };
  const loading = raceLoading || OneDayLoading;
  const error = raceError || OneDayError;

  // Function to get box data similar to LastSection
  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
      response?.data?.editions,
      response?.data?.data,
      response?.data,
      response?.data?.winners,
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
              {/* box1 - Most wins */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data?.[fixedApis.box1]?.message}</h4>
                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."} </h6>
                              </div>

                              {rider?.wins && <span>{rider.wins}</span>}
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

              {/* box2 - Fastest Edition*/}
              <div className="col-lg-3 col-md-6">
                <div className="races">
                  <div className="text-wraper">
                    <h3>{data?.[fixedApis.box2]?.message}</h3>
                    {(() => {
                      if (!data?.[fixedApis.box2]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box2];
                      const riderData = response?.data.total_editions;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }
                      return (
                        <div className="name-wraper name-wraper-white">
                          <h5>
                            <strong>{riderData}</strong>
                          </h5>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* box3 - Rider With MostGCPodiums*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box3]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box3]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box3];
                      const riderData = response?.data.data.top_rider;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.podiums && (
                            <h5>
                              <strong>{riderData.podiums}</strong>times
                            </h5>
                          )}

                          <a href="#?" className="green-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </a>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Box4: Race Participants  */}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4> {data?.[fixedApis.box4]?.message}</h4>
                    {getBoxData(fixedApis.box4).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box4).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box4).data)
                          ? getBoxData(fixedApis.box4).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              {rider?.total_participants && (
                                <h5 key={index}>
                                  <strong>{rider.total_participants} </strong>
                                </h5>
                              )}
                            </>
                          ))}

                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-7 box5">
                <div className="row">
                  {/* Box5: Team with most wins  */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box5]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box5];
                          const riderData = response?.data.data.most_wins_team;

                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              <div className="name-wraper name-wraper-white">
                                <h6>{riderData?.team_name || "..."}</h6>
                              </div>
                              {riderData?.wins && (
                                <h5>
                                  <strong>{riderData.wins}</strong>times
                                </h5>
                              )}

                              <img
                                src="/images/player4.png"
                                alt=""
                                className="absolute-img"
                              />
                              <a href="#?" className="green-circle-btn">
                                <img src="/images/arow.svg" alt="" />
                              </a>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/*Box 6 - Most Top 10 rider in Race */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box6]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box6]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box6];
                          const riderData = response?.data.data.top_rider;

                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(riderData?.rider_country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.top_10s && (
                                <h5>
                                  <strong>{riderData.top_10s}</strong>times
                                </h5>
                              )}

                              <img
                                src="/images/player4.png"
                                alt=""
                                className="absolute-img"
                              />
                              <a href="#?" className="white-circle-btn">
                                <img src="/images/arow.svg" alt="" />
                              </a>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/*Box 7 - Last Winner*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="list-white-cart">
                      <h4>{data?.[fixedApis.box7]?.message}</h4>
                      {getBoxData(fixedApis.box7).error ? (
                        <ErrorMessage
                          errorType={getBoxData(fixedApis.box7).errorType}
                        />
                      ) : (
                        <>
                          <ul>
                            {(Array.isArray(getBoxData(fixedApis.box7).data)
                              ? getBoxData(fixedApis.box7).data
                              : []
                            )
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={index}>
                                  <strong>{index + 1}</strong>
                                  <div className="name-wraper name-wraper-white">
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_name || "..."} </h6>
                                  </div>

                                  {rider?.year && <span>{rider.year}</span>}
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

                  {/*Box 8 - Fastest Race */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box8]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box8]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box8];
                          const riderData = response?.data.data;

                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(riderData?.country)}
                                <h6>{riderData?.winner || "..."}</h6>
                              </div>
                              {riderData?.distance_km && (
                                <h5>
                                  <strong>{riderData.distance_km}</strong>
                                  kilometer
                                </h5>
                              )}

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
              </div>
              {/*Box 9 - Most stage wins*/}
              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart">
                  <h4 className="fs-chenge">
                    {data?.[fixedApis.box1]?.message}
                  </h4>
                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && <span>{rider.wins}</span>}
                            </li>
                          ))}
                      </ul>

                      <img
                        src="/images/player3.png"
                        alt=""
                        className="absolute-img"
                      />
                      <a href="#?" className="glob-btn green-bg-btn">
                        <strong>volledige stats</strong>{" "}
                        <span>
                          <img src="/images/arow.svg" alt="" />
                        </span>
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
