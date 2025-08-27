import React from "react";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import Link from "next/link";

const StatsThirdSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  const fixedApis = {
    box1: "grandTourstageWin",
    box2: "mostKMsRaced",
    box3: "top3StageTeam",
    box4: "raceCount",
    box5: "topGCRiderbyTeam",
    box6: "top3GCTeam",
    box7: "getMostConsistentGCTeams",
    box8: "longestRace",
    box9: "top10GCTeams",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;
    return params;
  };

  // Helper function to build URLs with query parameters
  const buildUrlWithParams = (basePath) => {
    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const endpointsToFetch = Object.values(fixedApis);
  const { data, loading, error } = useMultipleData(endpointsToFetch, {
    queryParams: buildQueryParams(),
  });

  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];

    // Try most common paths in order
    const paths = [
      response?.data?.riders,
      response?.data?.data?.longest_stage_races,
      response?.data?.data,
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
    <section className="home-sec2">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton />}

          {/* Show global error if all data failed */}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}

          {/* Show content only when not loading and no global error */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              {/* First Card */}
              <div className="col-lg-4 col-md-6">
                <div className="list-white-cart lime-green-cart aa">
                  <Link href={buildUrlWithParams("/stats/grand-tour-stage-wins")} className="pabs"/>
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
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && <span>{rider.wins}</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("/stats/grand-tour-stage-wins")}
                        className="white-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* SEcond Card */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/most-kms-raced")} className="pabs"/>
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
                                className="name-wraper name-wraper-white name-left"
                                key={index}
                              >
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_key || "..."}</h6>
                              </div>
                              {rider?.total_distance && (
                                <h5>
                                  <strong>{rider.total_distance} </strong>
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/most-kms-raced")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* third Section */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/top3-stage-teams")} className="pabs"/>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box3]?.message}</h4>
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
                                className="name-wraper name-wraper-white name-left"
                                key={index}
                              >
                                {renderFlag(rider?.team_country)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>
                              {rider?.count && (
                                <h5>
                                  <strong>{rider.count} </strong>
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/top3-stage-teams")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-7 box5">
                <div className="row">
                  {/* Box5: GC Rider by team */}

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("/stats/top-gc-riders-by-team")} className="pabs"/>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {getBoxData(fixedApis.box5).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box5).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box5).data)
                              ? getBoxData(fixedApis.box5).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-white name-left"
                                    key={index}
                                  >
                                    {renderFlag(rider?.team_country)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>
                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong>wins
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams("/stats/top-gc-riders-by-team")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 6 -top 3GC Team */}
                  <div className="col-lg-7 col-md-6">
                    <div className="list-white-cart">
                      <Link href={buildUrlWithParams("/stats/top-gc-teams")} className="pabs"/>
                      <h4>{data?.[fixedApis.box6]?.message}</h4>
                      {getBoxData(fixedApis.box6).error ? (
                        <ErrorMessage
                          errorType={getBoxData(fixedApis.box6).errorType}
                        />
                      ) : (
                        <>
                          <ul>
                            {(Array.isArray(getBoxData(fixedApis.box6).data)
                              ? getBoxData(fixedApis.box6).data
                              : []
                            )
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={index}>
                                  <strong>{index + 1}</strong>
                                  <div className="name-wraper name-wraper-white 15">
                                    {renderFlag(rider?.team_country)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.count && <span>{rider.count}</span>}
                                </li>
                              ))}
                          </ul>
                          <Link
                            href={buildUrlWithParams("/stats/top-gc-teams")}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/*Box 7 - Most Consistent GCTeams*/}
                  {/* <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box7]?.message}</h4>
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
                                <>
                                  <div
                                    className="name-wraper name-wraper-white"
                                    key={index}
                                  >
                                    {renderFlag(rider?.flag)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>
                                  {rider?.gcWinCount && (
                                    <h5>
                                      <strong>{rider.gcWinCount} </strong>
                                      count
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
                  </div> */}

                  {/*Box 8 - longest Races */}
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("/stats/longest-races")} className="pabs"/>
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box8]?.message}</h4>
                        {getBoxData(fixedApis.box8).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box8).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box8).data)
                              ? getBoxData(fixedApis.box8).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-white name-left"
                                    key={index}
                                  >
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.race || "..."}</h6>
                                  </div>
                                  {rider?.distance && (
                                    <h5>
                                      <strong>{rider.distance} </strong>
                                      kilometer
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams("/stats/longest-races")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Box4: race Count */}
                  <div className="col-lg-7 col-md-6">
                    <div className="races">
                      <div className="text-wraper">
                        <h3 className="font-size-change">
                          {data?.[fixedApis.box4]?.message}
                        </h3>
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
                            <div className="name-wraper name-wraper-white 17">
                              {riderData.count && (
                                <h5>
                                  <strong>{riderData.count}</strong>
                                </h5>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*Box 9 - top 1o GC Teams  */}
              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart ctm-card">
                  <Link href={buildUrlWithParams("/stats/top10-gc-teams")} className="pabs"/>
                  
                  {getBoxData(fixedApis.box9).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box9).errorType}
                    />
                  ) : (
                    <>
                    <div className="card-content-wraper">
                    <h4 className="fs-chenge">
                      {" "}
                      {data?.[fixedApis.box9]?.message}
                    </h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box9).data)
                          ? getBoxData(fixedApis.box9).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.team_country)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>

                              {rider?.count && <span>{rider.count}</span>}
                            </li>
                          ))}
                      </ul>

                      <div className="image_link-wraper">
                        <img
                          src="/images/player6.png"
                          alt=""
                          className="absolute-img"
                        />
                          <div className="link_box">
                            <Link href={buildUrlWithParams("/stats/top10-gc-teams")} className="glob-btn">
                              <strong>volledige stats</strong>{" "}
                              <span>
                                <img src="/images/arow.svg" alt="" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
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

export default StatsThirdSection;
