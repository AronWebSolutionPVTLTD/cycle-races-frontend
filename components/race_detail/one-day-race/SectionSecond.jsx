import React, { useState, useEffect } from "react";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const SectionSecond = ({ selectedYear, selectedNationality, name }) => {
  // Define single API endpoint for each section box
  const fixedApis = {
    box1: "getMostWinsNationality",
    box2: "getTotalNationalityWin",
    box3: "getMostParticipationsByRider",
    box4: "getMostDNFsByNationality",
    box5: "getTop5SpanishResults",
    box6: "getLastRaceWinnerByNationality",
    box7: "getTop10SpanishFinishes",
    box8: "getTopSpainshPodiumReach",
    box9: "getYoungestSpanishParticipant",
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

  const OnedayEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    fixedApis.box3,
    fixedApis.box4,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box7,
    fixedApis.box8,
    fixedApis.box9,
  ];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {};


  const {
    data,
    loading,
    error,
  } = useMultipleData(OnedayEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "oneDayRaceStats",
  });


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
  console.log(selectedNationality, "nato")
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
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box1]?.message}</h4>
                    {getBoxData(fixedApis.box1).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box1).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              <div className="name-wraper">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.total_wins && (
                                <h5>
                                  <strong>{rider.total_wins} </strong>times
                                </h5>
                              )}
                            </>
                          ))}

                        <img
                          src="/images/player6.png"
                          alt=""
                          className="absolute-img"
                        />

                        <a href="#?" className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>


              {/* box2 - Total  Wins by nationality*/}
              <div className="col-lg-3 col-md-6">
                <div className="races">
                  <div className="text-wraper">
                    <h3 className="fs-chenge">{data?.[fixedApis.box2]?.message}</h3>
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
                        <div className="name-wraper name-wraper-white">
                          <h5>
                            <strong>{riderData.totalWins}</strong>
                          </h5>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* box3- Most Participations ByRider */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>
                    {data?.[fixedApis.box3]?.message}
                  </h4>
                  {getBoxData(fixedApis.box3).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box3).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box3).data)
                          ? getBoxData(fixedApis.box3).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <div className="name-wraper">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.name || "..."}</h6>
                              </div>

                              {rider?.participations && <span>{rider.participations}</span>}
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

              {/* Box4: Rider with most DNFs  */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box4]?.message}</h4>
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
                          <div className="name-wraper">
                            {renderFlag(riderData?.rider?.nationality)}
                            <h6>{riderData?.rider?.name || "..."}</h6>
                          </div>
                          {riderData?.totalDNFs && (
                            <h5>
                              <strong>{riderData?.totalDNFs}</strong>
                              times
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

              {/*Box 5 - Top5 Spanish Results*/}
              <div className="col-lg-5 box6">
                <div className="list-white-cart">
                  <h4 className="fs-chenge">
                    {data?.[fixedApis.box5]?.message}
                  </h4>
                  {getBoxData(fixedApis.box5).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box5).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box5).data)
                          ? getBoxData(fixedApis.box5).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <div className="name-wraper">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.rank && <span>{rider.rank}</span>}
                            </li>
                          ))}
                      </ul>

                      <img
                        src="/images/player3.png"
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

              <div className="col-lg-7 box5">
                <div className="row">
                  {/*Box 6 - LastRace Winner By Nationality,*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box6]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box6]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box6];
                          const riderData = response?.data;


                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              <div className="name-wraper">
                                {renderFlag(riderData?.rider_country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.year && (
                                <h5>
                                  <strong>{riderData?.year}</strong>
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

                  {/*Box 7 -Top10 Finishes*/}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box7]?.message}</h4>
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
                              <div className="name-wraper">
                                {renderFlag(riderData?.rider_country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.top10_count && (
                                <h5>
                                  <strong>{riderData?.top10_count}</strong>times
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

                  {/*Box 8 - Top Podium Reach*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box8]?.message}</h4>
                        {(() => {
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
                              <div className="name-wraper">
                                {renderFlag(riderData?.rider_country)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.podium_count && (
                                <h5>
                                  <strong>{riderData?.podium_count}</strong>times
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

                  {/*Box 9 -Youngest Participant */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box9]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box9]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box9];
                          const riderData = response?.data;
                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }
                          return (
                            <>
                              <div className="name-wraper">
                                {renderFlag(riderData?.nationality)}
                                <h6>{riderData?.rider_name || "..."}</h6>
                              </div>
                              {riderData?.date_of_birth && (
                                <h5>
                                  <strong>{riderData?.date_of_birth}</strong>
                                </h5>
                              )}

                              <a href="#?" className="white-circle-btn">
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};
