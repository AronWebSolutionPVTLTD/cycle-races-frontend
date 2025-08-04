import React, { useState, useEffect } from "react";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const LastSection = ({ selectedNationality, name }) => {
  const fixedApis = {
    box1: "getRiderWithMostDNF",
    box2: "getRiderWithMostFinishes",
    box3: "getRiderWithMostConsecutiveWins",
    box4: "getLongestRaceEdition",
    box5: "getEditionWithMostDNFs",
    box6: "getCountryWithMostWins",
    box7: "getMostSuccessfulTeamInRace",
    box8: "getOldestTop10Rider",
    box9: "getDebutRidersInRace",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

  // Separate race and stage endpoints
  const raceEndpoints = [
   
    
    

  ];

  const onedayRace = [
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
      response?.data?.previouseditions,
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
              {/* box1 - Most DNF*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box1]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box1]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box1];
                      const riderData = response?.data.data.top_rider;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.dnf_count && (
                            <h5>
                              <strong>{riderData.dnf_count}</strong>dnfs
                            </h5>
                          )}

<img
                                src="/images/player6.png"
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

              {/* box2 - Rider With Most Finishes*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box2]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box2]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box2];
                      const riderData = response?.data.top_rider;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.finish_count && (
                            <h5>
                              <strong>{riderData.finish_count}</strong>times
                            </h5>
                          )}

<img
                                src="/images/player1.png"
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

              {/* box3 - Rider With Consecutive WIns*/}
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
                      const riderData = response?.data?.top_streak;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.streak && (
                            <h5>
                              <strong>{riderData.streak}</strong>times
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

              {/* Box4: Longest Edition  */}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box4]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box4]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box4];
                      const riderData = response?.data?.data;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                         <div className="name-wraper name-wraper-white">
                           <h6>{riderData?.subtitle || "..."}</h6>
                          </div>
                          {riderData?.distance_km && (
                            <h5>
                              <strong>{riderData.distance_km}</strong>kilometers
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

              <div className="col-lg-7 box5">
                <div className="row">
                  {/* Box5: Edition With Most DNFs */}
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
                      const riderData = response?.data?.data;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(riderData?.country)}
                            <h6>{riderData?.race_name || "..."}</h6>
                          </div>
                          {riderData?.dnf_count && (
                            <h5>
                              <strong>{riderData.dnf_count}</strong>dnfs
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

                  {/*Box 6 -Country With MostWins */}
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
                          const riderData = response?.data;

                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(riderData?.country_code)}
                                <h6>{riderData?.most_wins_country || "..."}</h6>
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
                              <a href="#?" className="white-circle-btn">
                                <img src="/images/arow.svg" alt="" />
                              </a>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/*Box 7 - Most Successful TeamInRace*/}
                  <div className="col-lg-5 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box7]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box7]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box7];
                      const riderData = response?.data?.most_successful_team;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(riderData?.flag)}
                            <h6>{riderData?.team_name || "..."}</h6>
                          </div>
                          {riderData?.wins && (
                            <h5>
                              <strong>{riderData.wins}</strong>wins
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

                  {/*Box 8 - Oldest Top 10Rider */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box8]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box8]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box8];
                          const riderData = response?.data.result;

                          if (!riderData) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                               <div className="name-wraper name-wraper-white">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.rank && (
                            <h5>
                              <strong>{riderData.rank}</strong>times
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
              {/*Box 9 - Most debut riders*/}
              <div className="col-lg-5 col-md-6">
                <div className="list-white-cart lime-green-cart">
                  <h4 className="fs-chenge">
                    {data?.[fixedApis.box9]?.message}
                  </h4>
                  {getBoxData(fixedApis.box9).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box9).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box9).data)
                          ? getBoxData(fixedApis.box9).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{rider?.year}</strong>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                        
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
