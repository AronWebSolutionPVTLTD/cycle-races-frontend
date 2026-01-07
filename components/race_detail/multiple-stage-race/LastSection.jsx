import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const LastSection = ({ selectedYear, selectedNationality, name }) => {
  const router = useRouter();
  const raceName = router.query.name || name; // Get name from router or fallback to prop
  const fixedApis = {
    box1: "getMostMountainClassificationWins",
    box2: "getMostSprintClassificationWins",
    box3: "getMostYoungsterClassificationWins",
    box4: "getRiderWithMostFinishes",
    box5: "getOldestStageWinner",
    box6: "getYoungestWinner",
    box7: "getFastestEditionOfRace",
    box8: "getLongestStageInRace",
    box9: "getMostStageDepartures",
    box10: "getTeamWithMostWins",
    box11: "getMostStageFinishes",
    box12: "getYoungestTop10Riders",
    box13: "getShortestStageInRace",
    box14: "getOldestTop10Finisher",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear && selectedYear !== "All-time") {
      params.year = selectedYear;
    }
    if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

  // Helper function to build URLs with query parameters for race-specific stats
  const buildUrlWithParams = (statsPath) => {
    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    const basePath = `/races/${raceName}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const stageEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    fixedApis.box4,
    fixedApis.box3,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box8,
    fixedApis.box7,
    fixedApis.box9,
    fixedApis.box10,
    fixedApis.box11,
    fixedApis.box12,
    fixedApis.box13,
    fixedApis.box14,
  ];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {};

  const { data, loading, error } = useMultipleData(stageEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "stageStats",
  });

  // Function to get box data similar to LastSection
  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.top_teams,
      response?.data?.data?.most_used_finish_cities,
      response?.data?.data,
      response?.data?.data?.most_used_departure_cities,
      response?.data,
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
    <section className="home-sec5 sdsdsd11 home-sec5--last">
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
              {/* Box 1 - MostMountain Classification Wins*/}
              <div className="col-lg-5 box6">
                <div className="list-white-cart ctm-card">
                  <Link href={buildUrlWithParams(
                    "most-wins-in-mountain-classification"
                  )} className="pabs" />

                  {getBoxData(fixedApis.box1).error ? (
                    <><h4 className="fs-chenge">
                    {data?.[fixedApis.box1]?.message}
                  </h4>
                    <div className="no-data-wrap">
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box1).errorType}
                      />
                    </div>
                    </>
                  ) : (
                    <>
                      <div className="card-content-wraper">
                        <h4 className="fs-chenge">
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
                                <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?._id}`)}>
                                  {renderFlag(rider?.rider_country)}
                                  <h6>{rider?.rider_name || "..."}</h6>
                                </div>

                                {rider?.mountain_wins && (
                                  <span>{rider.mountain_wins}</span>
                                )}
                              </li>
                            ))}
                        </ul>

                      </div>
                      <div className="image_link-wraper">
                        <img
                          src="/images/player3.png"
                          alt=""
                          className="absolute-img"
                        />
                        <div className="link_box">
                          <Link
                            href={buildUrlWithParams(
                              "most-wins-in-mountain-classification"
                            )}
                            className="glob-btn green-bg-btn"
                          >
                            <strong>volledige stats</strong>{" "}
                            <span>
                              <img src="/images/arow.svg" alt="" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="d-md-none d-flex justify-content-end pt-4 mobile_link_wrap">
                  <Link
                    href={buildUrlWithParams(
                      "most-wins-in-mountain-classification"
                    )}
                    className="alle-link m-0"
                  >
                    Alle statistieken <img src="/images/arow2.svg" alt="" />
                  </Link>
                </div>
              </div>

              <div className="col-lg-7 box5 d-flex flex-row">
                <div className="row">
                  {/*Box 2 - Most Sprint Classification Wins*/}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link
                        href={buildUrlWithParams(
                          "most-wins-in-sprint-classification"
                        )}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box2]?.message}</h4>
                        {getBoxData(fixedApis.box2).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box2).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box2).data)
                              ? getBoxData(fixedApis.box2).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-green"
                                    key={index} onClick={() => router.push(`/riders/${rider?._id}`)} >
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.sprint_wins && (
                                    <h5>
                                      <strong>{rider.sprint_wins} </strong>{" "}
                                      times
                                    </h5>
                                  )}
                                </>
                              ))}
                            <img
                              src="/images/player6.png"
                              alt=""
                              className="absolute-img"
                            />
                            <Link
                              href={buildUrlWithParams(
                                "most-wins-in-sprint-classification"
                              )}
                              className="white-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 3 - Youngest wins */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart img-active">
                      <Link
                        href={buildUrlWithParams(
                          "most-wins-in-youngster-classification"
                        )}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box3]?.message}</h4>
                        {getBoxData(fixedApis.box3).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box3).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box3).data)
                              ? getBoxData(fixedApis.box3).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-green name-left"
                                    key={index} onClick={() => router.push(`/riders/${rider?._id}`)} >
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.young_wins && (
                                    <h5>
                                      <strong>{rider.young_wins} </strong> times
                                    </h5>
                                  )}
                                </>
                              ))}
                            <Link
                              href={buildUrlWithParams(
                                "most-wins-in-youngster-classification"
                              )}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 4 - Rider With MostFinishes*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart img-active">
                      <Link
                        href={buildUrlWithParams("rider-with-most-finish")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box4]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box4]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box4];
                          const riderData = response?.data?.top_rider;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.finish_count && (
                                <h5>
                                  <strong>{rider.finish_count}</strong>
                                  times
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "rider-with-most-finish"
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

                  {/*Box 5 - Oldest Stage Winner */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link
                        href={buildUrlWithParams("oldest-stage-winners")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box5]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box5];
                          const riderArray = response?.data?.data;

                          if (
                            !Array.isArray(riderArray) ||
                            riderArray.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              {riderArray.slice(0, 1).map((rider, index) => (
                                <div key={index} className="rider-item">
                                  <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>
                                  {rider?.age && (
                                    <h5>
                                      <strong>{rider.age}</strong>
                                      jaar
                                    </h5>
                                  )}
                                  <Link
                                    href={buildUrlWithParams(
                                      "oldest-stage-winners"
                                    )}
                                    className="white-circle-btn"
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
                </div>
              </div>
              {/*Box 6 - Youngest Winner*/}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                <Link
                                href={buildUrlWithParams("youngest-stage-winners")}
                                className="pabs"
                              ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box6]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box6]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box6];
                      const riderArray = response?.data?.data;

                      if (
                        !Array.isArray(riderArray) ||
                        riderArray.length === 0
                      ) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {riderArray.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-item">
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.age && (
                                <h5>
                                  <strong>{rider.age}</strong>jaar
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams("youngest-stage-winners")}
                                className="white-circle-btn"
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

              {/*Box 7 - Edition*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams("fastest-editions")}
                    className="pabs"
                  ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box7]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box7]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box7];
                      const riderArray = response?.data?.data;

                      if (
                        !Array.isArray(riderArray) ||
                        riderArray.length === 0
                      ) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {riderArray.slice(0, 1).map((item, index) => (
                            <div key={index} className="rider-item">
                              <div className="name-wraper name-wraper-white name-left">
                                <h6>{item?.year || "..."}</h6>
                              </div>

                              {item?.total_time_formatted && (
                                <div
                                  style={{
                                    position: "relative",
                                    height: "80px",
                                  }}
                                >
                                  <h5
                                    style={{
                                      position: "absolute",
                                      top: "50px",
                                      left: 40,
                                      right: 0,
                                      textAlign: "center",
                                      fontSize: "40px",
                                      color: "#cbcbc7",
                                    }}
                                  >
                                    {item.total_time_formatted}
                                  </h5>
                                </div>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "fastest-editions"
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

              {/*Box 8 - Longest Stage InRace*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams("longest-stage-in-race")}
                    className="pabs"
                  ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box8]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box8]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box8];
                      const riderData = response?.data;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white name-left">
                            <h6>{rider?.subtitle || "..."}</h6>
                          </div>
                          {rider?.distance_km && (
                            <h5>
                              <strong>{rider.distance_km} </strong>
                              kilometers
                            </h5>
                          )}

                          <Link
                            href={buildUrlWithParams("longest-stage-in-race")}
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

              {/*Box 9 - Most Stage Departures */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart img-active">
                  <Link
                    href={buildUrlWithParams("cities-with-most-departures")}
                    className="pabs"
                  ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box9]?.message}</h4>
                    {getBoxData(fixedApis.box9).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box9).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box9).data)
                          ? getBoxData(fixedApis.box9).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              <div
                                className="name-wraper name-wraper-green name-left"
                                key={index}
                              >
                                <h6>{rider?.city || "..."}</h6>
                              </div>

                              {rider?.count && (
                                <h5>
                                  <strong>{rider.count} </strong> times
                                </h5>
                              )}
                            </>
                          ))}
                        <Link
                          href={buildUrlWithParams("cities-with-most-departures")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-7 box5 d-flex flex-row">
                <div className="row">
                  {/*Box 10 - Team With MostWins*/}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link
                        href={buildUrlWithParams("team-with-most-wins")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box10]?.message}</h4>
                        {getBoxData(fixedApis.box10).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box10).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box10)?.data)
                              ? getBoxData(fixedApis.box10)?.data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-green name-left"
                                    key={index}
                                    onClick={() => router.push(`/teams/${rider?.team_name}`)}
                                  >
                                    {renderFlag(rider?.team_country)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.wins && (
                                    <h5>
                                      <strong>{rider.wins} </strong> times
                                    </h5>
                                  )}
                                </>
                              ))}
                            <Link
                              href={buildUrlWithParams("team-with-most-wins")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 11 - Most Stage Finishes */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart img-active">
                      <Link
                        href={buildUrlWithParams("cities-with-most-often-used-as-finish")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box11]?.message}</h4>
                        {getBoxData(fixedApis.box11).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box11).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box11).data)
                              ? getBoxData(fixedApis.box11).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-green name-left"
                                    key={index}
                                  >
                                    <h6>{rider?.city || "..."}</h6>
                                  </div>

                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong> times
                                    </h5>
                                  )}
                                </>
                              ))}
                            <Link
                              href={buildUrlWithParams("cities-with-most-often-used-as-finish")}
                                className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 12 -Youngest Top10 Riders*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart img-active">
                      <Link
                        href={buildUrlWithParams("youngest-top10-riders")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box12]?.message}</h4>
                        {getBoxData(fixedApis.box12).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box12).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box12).data)
                              ? getBoxData(fixedApis.box12).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-green name-left"
                                    key={index} onClick={() => router.push(`/riders/${rider?.rider_id}`)} >
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.age && (
                                    <h5>
                                      <strong>{rider.age} </strong> jaar
                                    </h5>
                                  )}
                                </>
                              ))}
                            <Link
                              href={buildUrlWithParams("youngest-top10-riders")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 13 - Shortest Stage InRace*/}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link
                        href={buildUrlWithParams("shortest-stage-in-race")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box13]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box13]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box13];
                          const riderData = response?.data;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-white name-left">
                                <h6>{rider?.subtitle || "..."}</h6>
                              </div>
                              <h5>
                                <strong>{rider?.distance_km ?? 0}</strong>
                                kilometers
                              </h5>

                              <Link
                                href={buildUrlWithParams(
                                  "shortest-stage-in-race"
                                )}
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
                </div>
              </div>

              {/*Box 14 - OldestTop 10 Finisher */}
              <div className="col-lg-5 box6">
                <div className="list-white-cart ctm-card">
                  <Link href={buildUrlWithParams("oldest-top10-finisher")} className="pabs" />
                  {getBoxData(fixedApis.box14).error ? (
                    <><h4 className="fs-chenge"> {data?.[fixedApis.box14]?.message}</h4>
                    <div className="no-data-wrap">
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box14).errorType}
                    />
                    </div>
                    </> 
                  ) : (
                    <>
                      <div className="card-content-wraper">
                        <h4 className="fs-chenge">
                          {data?.[fixedApis.box14]?.message}
                        </h4>
                        <ul>
                          {(Array.isArray(getBoxData(fixedApis.box14).data)
                            ? getBoxData(fixedApis.box14).data
                            : []
                          )
                            .slice(0, 5)
                            .map((rider, index) => (
                              <li key={index}>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                  {renderFlag(rider?.country)}
                                  <h6>{rider?.rider_name || "..."}</h6>
                                </div>

                                {rider?.age && <span>{rider.age}</span>}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="image_link-wraper">
                        <img
                          src="/images/player3.png"
                          alt=""
                          className="absolute-img"
                        />
                        <div className="link_box">


                          <Link
                            href={buildUrlWithParams("oldest-top10-finisher")}
                            className="glob-btn green-bg-btn"
                          >
                            <strong>volledige stats</strong>{" "}
                            <span>
                              <img src="/images/arow.svg" alt="" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="d-md-none d-flex justify-content-end pt-4 mobile_link_wrap">
                  <Link
                    href={buildUrlWithParams("oldest-top10-finisher")}
                    className="alle-link m-0"
                  >
                    Alle statistieken <img src="/images/arow2.svg" alt="" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
