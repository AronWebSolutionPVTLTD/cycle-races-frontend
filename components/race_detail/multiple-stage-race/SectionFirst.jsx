import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const FirstSection = ({ selectedYear, selectedNationality, name }) => {
  const router = useRouter();
  const raceName = router.query.name || name;

  const fixedApis = {
    box1: "getTopGC_RidersLastYear",
    box2: "getRiderWithMostStageWins",
    box3: "getMostGCWinsInRace",
    box4: "getLastWinner",
    box5: "getRiderWithMostGCTop10s",
    box6: "getRiderWithMostDNFs",
    box7: "getNumberOfEditions",
    box8: "getRiderWithMostGCPodiums",
    box9: "getRiderWithMostStarts",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear && selectedYear !== "All-time") {
      params.year = selectedYear;
    }
    if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

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
  ];
  const endpointsMappings = {};
  const { data, loading, error } = useMultipleData(stageEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "stageStats",
  });
  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];
    const paths = [
      response?.data?.most_wins,
      response?.data?.editions,
      response?.data?.data,
      response?.data,
      response?.data?.data?.top_riders,
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
    <section className="home-sec5 11111111 p-0 pb-96px">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton />}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load rider statistics. Please try again later." />
          )}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              <div className="col-lg-5 box6">
                <div className="list-white-cart ctm-card">
                  <Link href={buildUrlWithParams("top-last-year-gc")} className="pabs" />
                  {getBoxData(fixedApis.box1).error ? (
                    <>
                      <h4 className="fs-chenge">
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
                                <strong>{rider.rank}</strong>
                                <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>

                                  {renderFlag(rider?.country)}
                                  <h6>{rider?.rider_name || "..."}</h6>
                                </div>

                                {rider?.time && <span>{rider.time}</span>}
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
                            href={buildUrlWithParams("top-last-year-gc")}
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
                    href={buildUrlWithParams("top-last-year-gc")}
                    className="alle-link m-0"
                  >
                    Alle statistieken <img src="/images/arow2.svg" alt="" />
                  </Link>
                </div>
              </div>

              <div className="col-lg-7 box5 d-flex flex-row">
                <div className="row">
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link
                        href={buildUrlWithParams("rider-most-stage-wins")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box2]?.message}</h4>

                        {(() => {
                          const response = data?.[fixedApis.box2];
                          const riders = response?.data?.data?.riders;

                          if (!Array.isArray(riders) || riders.length === 0) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          const rider = riders[0];

                          return (
                            <>
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins}</strong> times
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "rider-most-stage-wins"
                                )}
                                className="white-circle-btn mt-2"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link
                        href={buildUrlWithParams("most-wins-gc")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4> {data?.[fixedApis.box3]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box3]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box3];
                          const riderData = response?.data?.data?.most_gc_wins;

                          if (
                            !Array.isArray(riderData) ||
                            riderData.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }
                          const rider = riderData[0];
                          return (
                            <>
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.nationality)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins}</strong>
                                  times
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "most-wins-gc"
                                )}
                                className="green-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-7 col-md-6">
                    <div className="list-white-cart">
                      <Link
                        href={buildUrlWithParams("last-winners")}
                        className="pabs"
                      ></Link>
                      <h4 className="font-size-change">{data?.[fixedApis.box4]?.message}</h4>

                      {(() => {
                        const response = data?.[fixedApis.box4];
                        const riderList = response?.data?.data;

                        if (
                          !Array.isArray(riderList) ||
                          riderList.length === 0
                        ) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <ul>
                              {riderList.slice(0, 3).map((rider, index) => (
                                <li key={index}>
                                  <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.year && (
                                    <span className="fw-bold">
                                      {rider.year}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>

                            <Link
                              href={buildUrlWithParams("last-winners")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="arrow" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link
                        href={buildUrlWithParams("rider-with-most-top10-gc")}
                        className="pabs"
                      ></Link>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {(() => {
                          if (!data?.[fixedApis.box5]) {
                            return <ErrorMessage errorType="no_data" />;
                          }

                          const response = data[fixedApis.box5];
                          const ridersArray = response?.data?.riders;

                          if (
                            !Array.isArray(ridersArray) ||
                            ridersArray.length === 0
                          ) {
                            return <ErrorMessage errorType="no_data_found" />;
                          }

                          return (
                            <>
                              {ridersArray.slice(0, 1).map((rider, index) => (
                                <div key={index} className="rider-item">
                                  <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>
                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count}</strong>
                                    </h5>
                                  )}

                                  <Link
                                    href={buildUrlWithParams(
                                      "rider-with-most-top10-gc"
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
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams("rider-with-most-dnfs")}
                    className="pabs"
                  ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box6]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box6]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box6];
                      const ridersArray = response?.data?.riders;

                      if (
                        !Array.isArray(ridersArray) ||
                        ridersArray.length === 0
                      ) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {ridersArray.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-item">
                              <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.count && (
                                <h5>
                                  <strong>{rider.count}</strong> dnfs
                                </h5>
                              )}

                              <img
                                src="/images/player7.png"
                                alt=""
                                className="absolute-img"
                              />
                              <Link
                                href={buildUrlWithParams("rider-with-most-dnfs")}
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

              <div className="col-lg-3 col-md-6">
                <div className="races">
                  <div className="text-wraper text-center">
                    <h3 className=" fw-900 font-archivo text-uppercase fs-chenge ">{data?.[fixedApis.box7]?.message}</h3>
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
                        <div className="name-wraper">
                          <h5 className="fst-italic" >
                            <strong>{riderData.number_of_editions}</strong>
                          </h5>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link
                    href={buildUrlWithParams("rider-with-most-gc-podiums")}
                    className="pabs"
                  ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box8]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box8]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box8];
                      const ridersArray = response?.data?.top_riders;

                      if (
                        !Array.isArray(ridersArray) ||
                        ridersArray.length === 0
                      ) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {ridersArray.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-item">
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.podiums && (
                                <h5>
                                  <strong>{rider.podiums}</strong> times
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "rider-with-most-gc-podiums"
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

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <Link
                    href={buildUrlWithParams("rider-with-most-starts")}
                    className="pabs"
                  ></Link>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box9]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box9]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box9];
                      const riderData = response?.data.data;
                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }
                      const rider = riderData[0];
                      return (
                        <>
                          <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                            {renderFlag(rider?.country)}
                            <h6>{rider?.rider_name || "..."}</h6>
                          </div>
                          {rider?.count && (
                            <h5>
                              <strong>{rider.count}</strong>
                            </h5>
                          )}

                          <Link
                            href={buildUrlWithParams("rider-with-most-starts")}
                            className="white-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      );
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
