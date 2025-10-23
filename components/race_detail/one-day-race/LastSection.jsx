import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const LastSection = ({
  selectedYear = null,
  selectedNationality = null,
  name = null,
}) => {
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
    box10: "getWinnersFromCountry",
    box11: "getYoungestTop10Rider",
    box12: "getLastWinnerFromCountry",
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
    fixedApis.box10,
    fixedApis.box11,
    fixedApis.box12,
  ];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {};

  const { data, loading, error } = useMultipleData(onedayRace, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "oneDayRaceStats",
  });

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
    <section className="home-sec5 bbbbb">
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
                  <Link
                    href={buildUrlWithParams("rider-with-most-dnf")}
                    className="pabs"
                  />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box1]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box1]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box1];
                      const riderData = response?.data.data.top_rider;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(rider?.rider_country)}
                            <h6>{rider?.rider_name || "..."}</h6>
                          </div>
                          {rider?.dnf_count && (
                            <h5>
                              <strong>{rider.dnf_count}</strong>dnfs
                            </h5>
                          )}

                          <img
                            src="/images/player6.png"
                            alt=""
                            className="absolute-img"
                          />
                          <Link
                            href={buildUrlWithParams("rider-with-most-dnf")}
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

              {/* box2 - Rider With Most Finishes*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams("rider-with-most-finishes")}
                    className="pabs"
                  />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box2]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box2]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box2];
                      const riderData = response?.data.top_rider;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(rider?.rider_country)}
                            <h6>
                              {rider?.rider_name
                                ? rider.rider_name.charAt(0).toUpperCase() +
                                rider.rider_name.slice(1)
                                : "..."}
                            </h6>
                          </div>
                          {rider?.finish_count && (
                            <h5>
                              <strong>{rider.finish_count}</strong>times
                            </h5>
                          )}

                          <img
                            src="/images/player1.png"
                            alt=""
                            className="absolute-img"
                          />
                          <Link
                            href={buildUrlWithParams(
                              "rider-with-most-finishes"
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

              {/* box3 - Rider With Consecutive WIns*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams(
                      "rider-with-most-consecutive-wins"
                    )}
                    className="pabs"
                  />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box3]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box3]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box3];
                      const riderData = response?.data?.top_streak;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(rider?.rider_country)}
                            <h6>{rider?.rider_name || "..."}</h6>
                          </div>
                          {rider?.streak && (
                            <h5>
                              <strong>{rider.streak}</strong>times
                            </h5>
                          )}
                          <Link
                            href={buildUrlWithParams(
                              "rider-with-most-consecutive-wins"
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

              {/* Box4: Longest Edition  */}

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <Link
                    href={buildUrlWithParams("longest-race-edition")}
                    className="pabs"
                  />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box4]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box4]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box4];
                      const riderData = response?.data?.data;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white">
                            <h6>{rider?.subtitle || "..."}</h6>
                          </div>
                          {rider?.distance_km && (
                            <h5>
                              <strong>{rider.distance_km}</strong>kilometers
                            </h5>
                          )}
                          <Link
                            href={buildUrlWithParams("longest-race-edition")}
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
                  {/* Box5: Edition With Most DNFs */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link
                        href={buildUrlWithParams("edition-with-most-dnfs")}
                        className="pabs"
                      />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box5]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box5];
                          const riderData = response?.data?.data;

                          if (!Array.isArray(riderData) || riderData.length === 0) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => {
                            // ✅ Capitalize each word of race_name
                            const formattedRaceName = rider?.race_name
                              ? rider.race_name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                )
                                .join(" ")
                              : "...";

                            return (
                              <>
                                <div className="name-wraper name-wraper-white">
                                  {renderFlag(rider?.country)}
                                  <h6>
                                    {formattedRaceName} ({rider?.year})
                                  </h6>
                                </div>

                                {rider?.dnf_count && (
                                  <h5>
                                    <strong>{rider.dnf_count}</strong> dnfs
                                  </h5>
                                )}

                                <Link
                                  href={buildUrlWithParams("edition-with-most-dnfs")}
                                  className="green-circle-btn"
                                >
                                  <img src="/images/arow.svg" alt="" />
                                </Link>
                              </>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>


                  {/*Box 6 -Country With MostWins */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link
                        href={buildUrlWithParams("country-with-most-wins")}
                        className="pabs"
                      />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box6]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box6]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box6];
                          const riderData = response?.data?.data;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.country_code)}
                                <h6>{rider?.most_wins_country || "..."}</h6>
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
                                  "country-with-most-wins"
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

                  {/*Box 7 - Most Successful TeamInRace*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <Link
                        href={buildUrlWithParams(
                          "most-successful-team-in-race"
                        )}
                        className="pabs"
                      />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box7]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box7]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box7];
                          const riderData = response?.data?.data;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(rider?.flag)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>
                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins}</strong>wins
                                </h5>
                              )}
                              <Link
                                href={buildUrlWithParams(
                                  "most-successful-team-in-race"
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

                  {/*Box 8 - Oldest Top 10Rider */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link
                        href={buildUrlWithParams("oldest-top10-rider")}
                        className="pabs"
                      />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box8]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box8]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box8];
                          const riderData = response?.data?.data;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return riderData.slice(0, 1).map((rider, index) => (
                            <>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.rank && (
                                <h5>
                                  <strong>{rider.rank}</strong>times
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams("oldest-top10-rider")}
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
              {/*Box 9 - Most debut riders*/}
              <div className="col-lg-5 col-md-6">
                <div className="list-white-cart lime-green-cart">
                  <Link
                    href={buildUrlWithParams("debut-riders-in-race")}
                    className="pabs"
                  />
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
                      <Link
                        href={buildUrlWithParams("debut-riders-in-race")}
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

              {/*Box 10 - Winners From Country*/}
              {/* <div className="col-lg-5 col-md-6">
                <div className="list-white-cart lime-green-cart">
                  <h4 className="fs-chenge">
                    {data?.[fixedApis.box10]?.message}
                  </h4>
                  {getBoxData(fixedApis.box10).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box10).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box10).data)
                          ? getBoxData(fixedApis.box10).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{rider?.year}</strong>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.country)}
                                <h6>{rider?.winner_name || "..."}</h6>
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
                      <a href="#?" className="glob-btn green-bg-btn">
                        <strong>volledige stats</strong>{" "}
                        <span>
                          <img src="/images/arow.svg" alt="" />
                        </span>
                      </a>
                    </>
                  )}
                </div>
              </div> */}
              <div className="col-lg-4 col-md-6">
                <div className="list-white-cart">
                  <Link
                    href={buildUrlWithParams("winners-from-country")}
                    className="pabs"
                  />
                  <h4>{data?.[fixedApis.box10]?.message}</h4>
                  {getBoxData(fixedApis.box10).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box10).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box10).data)
                          ? getBoxData(fixedApis.box10).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <div className="name-wraper">
                                {renderFlag(rider?.country)}
                                <h6>{rider?.winner_name || "..."}</h6>
                              </div>

                              {rider?.time && <span>{rider.time}</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("winners-from-country")}
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Box11: Youngest  top 10 */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams("youngest-top10-rider")}
                    className="pabs"
                  />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box11]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box11]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box11];
                      const riderData = response?.data?.data;
                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-white">
                            {renderFlag(rider?.rider_country)}
                            <h6>{rider?.rider_name || "..."}</h6>
                          </div>
                          {rider?.rank && (
                            <h5>
                              <strong>{rider.rank}</strong>times
                            </h5>
                          )}
                          <Link
                            href={buildUrlWithParams("youngest-top10-rider")}
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

              {/*Box 12 -Last Winner FromCountry */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <Link
                    href={buildUrlWithParams("last-winner-from-country")}
                    className="pabs"
                  />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box12]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box12]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box12];
                      const riderData = response?.data?.lastWinner;
                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <>
                          <div className="name-wraper name-wraper-green">
                            {renderFlag(rider?.country)}
                            <h6>{rider?.winner_name || "..."}</h6>
                          </div>
                          {rider?.year && (
                            <h5>
                              <strong>{rider?.year}</strong>
                            </h5>
                          )}

                          <img
                            src="/images/player4.png"
                            alt=""
                            className="absolute-img"
                          />
                          <Link
                            href={buildUrlWithParams(
                              "last-winner-from-country"
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};
