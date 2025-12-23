import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";
import { useRouter } from "next/router";

export const RaceDetail = ({ selectedYear, selectedNationality, name }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "mostWins",
    box2: "getTotalEdition",
    box3: "getMostPodiumsByRiderInRace",
    box4: "getRaceParticipants",
    box5: "getTeamWithMostWinsInRace",
    box6: "getMostTop10ByRiderInRace",
    box7: "getLastWinner",
    box8: "getFastestRaceEdition",
    box9: "PreviousEditions",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedNationality) params.nationality = selectedNationality;
    if (selectedYear) params.year = selectedYear;
    return params;
  };

  const buildUrlWithParams = (statsPath) => {
    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    const basePath = `/races/${name}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Separate race and stage endpoints
  const raceEndpoints = [fixedApis.box1, fixedApis.box2, fixedApis.box4];

  const onedayRace = [
    fixedApis.box3,
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
    <section className="home-sec5 cccc">
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
                  <Link href={buildUrlWithParams("most-win")} className="pabs" />
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
                              <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."} </h6>
                              </div>

                              {rider?.wins && <span>{rider.wins}</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("most-win")}
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* box2 - Fastest Edition*/}
              <div className="col-lg-3 col-md-6">
                <div className="races">
                  <div className="text-wraper">
                    <h3 className="text-uppercase fw-900 font-archivo fs-chenge">
                      {data?.[fixedApis.box2]?.message}</h3>
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
                          <h5 className="fst-italic">
                            <strong>{riderData.total_editions}</strong>
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
                  <Link href={buildUrlWithParams("most-podiums-spots")} className="pabs" />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box3]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box3]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box3];
                      const ridersArray = response?.data?.data?.top_rider;

                      if (
                        !Array.isArray(ridersArray) ||
                        ridersArray.length === 0
                      ) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {ridersArray.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-item" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.podiums && (
                                <h5>
                                  <strong>{rider.podiums}</strong> times
                                </h5>
                              )}
                              <Link
                                href={buildUrlWithParams(
                                  "most-podiums-spots"
                                )}
                                className="green-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Box4: Race Participants  */}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <Link href={buildUrlWithParams("race-participants")} className="pabs" />
                  <div className="text-wraper">
                    <h4> {data?.[fixedApis.box4]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box4]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box4];
                      const riderData = response?.data.rider_participation;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }
                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                            {renderFlag(rider?.rider_country)}
                            <h6>{rider?.rider_name || "..."}</h6>
                          </div>
                          {rider?.participations && (
                            <h5>
                              <strong>{rider.participations}</strong>times
                            </h5>
                          )}

                          <Link
                            href={buildUrlWithParams("race-participants")}
                            className="white-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="col-lg-7 box5">
                <div className="row">
                  {/* Box5: Team with most wins  */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("team-with-most-win")} className="pabs" />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box5]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box5];
                          const riderData = response?.data.data.most_wins_team;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }
                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-white" onClick={() => router.push(`/teams/${rider?.team_name}`)}>
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>
                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins}</strong>times
                                </h5>
                              )}

                              <img
                                src="/images/player4.png"
                                alt=""
                                className="absolute-img"
                              />
                              <Link
                                href={buildUrlWithParams(
                                  "team-with-most-win"
                                )}
                                className="green-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/*Box 6 - Most Top 10 rider in Race */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link href={buildUrlWithParams("most-times-top10")} className="pabs" />
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box6]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box6]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box6];
                          const riderData = response?.data.data.top_rider;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.top_10s && (
                                <h5>
                                  <strong>{rider.top_10s}</strong>times
                                </h5>
                              )}

                              <img
                                src="/images/player4.png"
                                alt=""
                                className="absolute-img"
                              />
                              <Link
                                href={buildUrlWithParams("most-times-top10")}
                                className="white-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/*Box 7 - Last Winner*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="list-white-cart">
                      <Link href={buildUrlWithParams("last-winner")} className="pabs" />
                      <h4 className="font-size-change">{data?.[fixedApis.box7]?.message}</h4>
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
                                  <strong>{rider?.year}</strong>
                                  <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_name || "..."} </h6>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <Link
                            href={buildUrlWithParams("last-winner")}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/*Box 8 - Fastest Race */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("fastest-race-edition")} className="pabs" />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box8]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box8]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box8];
                          const riderData = response?.data.data;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-green">
                                <h6>{rider?.year || "..."}</h6>
                              </div>
                              {/* {riderData?.time && (
                                <h5>
                                  <strong>{riderData.time}</strong>

                                </h5>
                              )} */}
                              {rider?.time && (
                                <div
                                  style={{
                                    position: "relative",
                                    height: "80px",
                                  }}
                                >
                                  <h5
                                    style={{
                                      position: "absolute",
                                      top: "60px",
                                      left: 40,
                                      right: 0,
                                      textAlign: "center",
                                      fontSize: "50px",
                                      color: "#cbcbc7",
                                    }}
                                  >
                                    {rider.time}
                                  </h5>
                                </div>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "fastest-race-edition"
                                )}
                                className="green-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*Box 9 - Most stage wins*/}
              <div className="col-lg-5 col-md-6">
                <div className="list-white-cart lime-green-cart">
                  <Link href={buildUrlWithParams("previous-editions")} className="pabs" />
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
                              <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.winner_id}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.winner || "..."}</h6>
                              </div>

                              {rider?.time && <span>{rider.time}</span>}
                            </li>
                          ))}
                      </ul>

                      <img
                        src="/images/player3.png"
                        alt=""
                        className="absolute-img"
                      />
                      <Link
                        href={buildUrlWithParams("previous-editions")}
                        className="glob-btn green-bg-btn"
                      >
                        <strong>volledige stats</strong>{" "}
                        <span>
                          <img src="/images/arow.svg" alt="" />
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section >
  );
};
