import React from "react";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import Link from "next/link";
import { useRouter } from "next/router";

const StatsFirstSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  const fixedApis = {
    box1: "mostWin",
    box2: "stageTop10sRider",
    box3: "mostRacingDays",
    box4: "getTopStageRiders",
    box5: "mostPodiumInStages",
    box6: "teamWithMostRider",
    box7: "finishRace",
    box8: "mostGCWins",
    box9: "mostDNFs",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;
    return params;
  };
  const router = useRouter();

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
      response?.data?.data?.result,
      response?.data?.data?.shortest_stage_races,
      response?.data?.data,
      // response?.data,
      response?.data?.data?.sorted,
      response?.data.riders,
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
    <section className="home-sec2 mb-pb-16px pb-96px">
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
              {/* Box 1 - Youngest Rider */}
              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart 11 ctm-card">
                  <Link href={buildUrlWithParams("/stats/most-wins")} className="pabs" />

                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                      <div className="card-content-wraper">
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
                                <div className="name-wraper name-wraper-green sdsd" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                  {renderFlag(rider?.rider_country)}
                                  {console.log('---rider---', rider)}
                                  <h6>{rider?.rider_name || "..."}</h6>
                                </div>

                                {rider?.wins && <span>{rider.wins}</span>}
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
                            href={buildUrlWithParams("/stats/most-wins")}
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
              </div>

              <div className="col-lg-7 box5 d-flex flex-column">
                <div className="row flex-grow-1">
                  {/*Box 2 - Most top 10 stage*/}

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("/stats/top-rider-stage")} className="pabs" />
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
                                <div key={index}>
                                  <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong> Times
                                    </h5>
                                  )}
                                </div>
                              ))}
                            <img
                              src="/images/player4.png"
                              alt=""
                              className="absolute-img"
                            />
                            <Link
                              href={buildUrlWithParams("/stats/top-rider-stage")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 3 - Most Racing  Days */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <Link href={buildUrlWithParams("/stats/most-racing-days")} className="pabs" />
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
                                    className="name-wraper name-wraper-green " onClick={() => router.push(`/riders/${rider?.rider_id}`)}
                                    key={index}
                                  >
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.racing_days && (
                                    <h5>
                                      <strong>{rider.racing_days} </strong> days
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
                              href={buildUrlWithParams("/stats/most-racing-days")}
                              className="white-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 4 - Top stage rider by team*/}
                  <div className="col-lg-7 col-md-6 11">
                    <div className="list-white-cart">
                      <Link href={buildUrlWithParams("/stats/team-most-stage-wins")} className="pabs" />
                      <h4 className="fs-medium">{data?.[fixedApis.box4]?.message}</h4>
                      {getBoxData(fixedApis.box4).error ? (
                        <ErrorMessage
                          errorType={getBoxData(fixedApis.box4).errorType}
                        />
                      ) : (
                        <>
                          <ul>
                            {(Array.isArray(getBoxData(fixedApis.box4).data)
                              ? getBoxData(fixedApis.box4).data
                              : []
                            )
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={index}>
                                  <strong>{index + 1}</strong>
                                  <div className="name-wraper name-wraper-white ">
                                    {renderFlag(rider?.flag)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.wins && <span>{rider.wins}</span>}
                                </li>
                              ))}
                          </ul>
                          <Link
                            href={buildUrlWithParams("/stats/team-most-stage-wins")}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/*Box 5 - Birthdays */}
                  <div className="col-lg-5 col-md-6">
                    <div className="list-white-cart">
                      <Link href={buildUrlWithParams("/stats/most-podium-in-stages")} className="pabs" />
                      <h4>{data?.[fixedApis.box5]?.message}</h4>
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
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={index}>
                                  <strong>{index + 1}</strong>
                                  <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.count && <span>{rider.count}</span>}
                                </li>
                              ))}
                          </ul>
                          <Link
                            href={buildUrlWithParams("/stats/most-podium-in-stages")}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/*Box 6 - Team with most rider*/}
              <div className="col-lg-3 col-md-6 11">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/team-with-most-rider")} className="pabs" />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box6]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box6]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box6];
                      const teams = response?.data?.data; // Array

                      if (!Array.isArray(teams) || teams.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {teams.slice(0, 1).map(
                            (
                              team,
                              index // limit 3
                            ) => (
                              <div key={index} className="team-card">
                                <div className="name-wraper name-wraper-white">
                                  {renderFlag(team?.country)}
                                  <h6>
                                    {team?.teamName ||
                                      team?.officialTeamName ||
                                      "..."}
                                  </h6>
                                </div>

                                {team?.numberOfWinningRiders && (
                                  <h5>
                                    <strong>
                                      {team.numberOfWinningRiders}{" "}
                                    </strong>
                                    riders
                                  </h5>
                                )}

                                <img
                                  src="/images/player7.png"
                                  alt=""
                                  className="absolute-img"
                                />
                                <Link
                                  href={buildUrlWithParams("/stats/team-with-most-rider")}
                                  className="green-circle-btn"
                                >
                                  <img src="/images/arow.svg" alt="" />
                                </Link>
                              </div>
                            )
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/*Box 7 - Finished  Races*/}
              <div className="col-lg-3 col-md-6 22">
                <div className="races">
                  <div className="text-wraper text-center">
                    <h3 className="font-archivo text-uppercase fw-900 fs-chenge">{data?.[fixedApis.box7]?.message}</h3>
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
                        <div className="name-wraper name-wraper-white">
                          <h5>
                            <strong>{riderData.total_finished_races}</strong>
                          </h5>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/*Box 8 - Most GC wins*/}
              <div className="col-lg-3 col-md-6 33">
                <div className="list-white-cart lime-green-cart 22">
                  <Link href={buildUrlWithParams("/stats/most-gc-wins")} className="pabs" />
                  <h4>{data?.[fixedApis.box8]?.message}</h4>
                  {getBoxData(fixedApis.box8).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box8).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box8).data)
                          ? getBoxData(fixedApis.box8).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.count && <span>{rider.count}</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("/stats/most-gc-wins")}
                        className="white-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/*Box 9 - Most DNF */}
              <div className="col-lg-3 col-md-6 44">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/most-dnfs")} className="pabs" />
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
                                className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/races/${rider?.race_name}`)}
                                key={index}
                              >
                                {renderFlag(rider?.country_code)}
                                <h6>{rider?.race_name || "..."}</h6>
                              </div>

                              {rider?.count && (
                                <h5>
                                  <strong>{rider.count} </strong> dnfs
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/most-dnfs")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
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

export default StatsFirstSection;
