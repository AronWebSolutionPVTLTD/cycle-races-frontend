import React from "react";
import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const fixedApis = {
  box1: "mostWin",
  box2: "stageTop10sRider",
  box3: "mostRacingDays",
  box4: "getTopStageRiders",
  box5: "ridersWithBirthdayToday",
  box6: "teamWithMostRider",
  box7: "finishRace",
  box8: "mostGCWins",
  box9: "mostDNFs",
};

const YearSection = () => {
  const endpointsToFetch = Object.values(fixedApis);
  const { data, loading, error } = useMultipleData(endpointsToFetch);
  const router = useRouter();
  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];

    // Try most common paths in order
    const paths = [
      response?.data?.data?.result,
      // response?.data?.result,
      response?.data?.data,
      // response?.data,
      response?.data?.data?.sorted,
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
    <section className="home-sec2 pb-96px">
      <div className="container">
        <div className="col-lg-12 d-flex justify-content-between align-items-center section-header">
          <h2 className="fw-900 fst-italic">dit jaar</h2>
          <a href="/stats" className="alle-link m-0 d-md-inline-block d-none">
            Alle statistieken <img src="/images/arow2.svg" alt="" />
          </a>
        </div>
        <div className="row">

          {loading && <BoxSkeleton />}

          {/* Show global error if all data failed */}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}

          {/* Show content only when not loading and no global error */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              {/* Box 1 - Most  won */}
              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart ctm-card">
                  <Link href="/most-races-won" className="pabs"></Link>

                  {getBoxData(fixedApis.box1).error ? (
                    <>  <h4 className="fs-chenge">
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
                      <div className="card-content-wraper aaaa">
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
                                <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                  {renderFlag(rider?.rider_country)}
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
                          <Link href="most-races-won" className="glob-btn green-bg-btn">
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
                {/* <div className="d-md-none d-flex justify-content-end pt-4 mobile_link_wrap">
                  <a href="/stats" className="alle-link m-0">
                    Alle statistieken <img src="/images/arow2.svg" alt="" />
                  </a>
                </div> */}
              </div>

              <div className="col-lg-7 box5 d-flex flex-column">
                <div className="row flex-grow-1">
                  {/*Box 2 - Most top 10 stage*/}

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href="/top-10-in-stages" className="pabs" />
                      <div className="text-wraper">
                        <h4> {data?.[fixedApis.box2]?.message}</h4>
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
                                    className="name-wraper name-wraper-white"
                                    onClick={() => router.push(`/riders/${rider?.rider_id}`)}
                                    key={index}
                                  >
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong> times
                                    </h5>
                                  )}
                                </>
                              ))}
                            <img
                              src="/images/player4.png"
                              alt=""
                              className="absolute-img"
                            />
                            <Link
                              href="/top-10-in-stages"
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
                    <div className="team-cart lime-green-team-cart img-active 33">
                      <Link href="/rider-with-most-racing-days" className="pabs" />
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
                                    className="name-wraper name-wraper-green"
                                    onClick={() => router.push(`/riders/${rider?.rider_id}`)}
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
                              href="/rider-with-most-racing-days"
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
                  <div className="col-lg-7 col-md-6">
                    <div className="list-white-cart">
                      <Link href="/teams-with-most-wins" className="pabs" />
                      <h4 className="font-size-change">{data?.[fixedApis.box4]?.message}</h4>
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
                                  <div className="name-wraper name-wraper-white" onClick={() => router.push(`/teams/${rider?.team_name}`)}>
                                    {renderFlag(rider?.flag)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.wins && <span>{rider.wins}</span>}
                                </li>
                              ))}
                          </ul>
                          <Link href="/teams-with-most-wins" className="green-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/*Box 5 - Birthdays */}
                  <div className="col-lg-5 col-md-6">
                    <div className="list-white-cart">
                      <Link href="/riders-with-birthday-today" className="pabs" />
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
                                  {/* <strong>{index + 1}</strong> */}
                                  <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${rider?._id}`)}>
                                    {renderFlag(rider?.nationality)}
                                    <h6>{rider?.name || "..."}</h6>
                                  </div>

                                  {rider?.age_today && (
                                    <span>{rider.age_today}</span>
                                  )}
                                </li>
                              ))}
                          </ul>
                          <Link href="/riders-with-birthday-today" className="green-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/*Box 6 - Team with most rider*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link href="/team-with-most-rider-to-win-race" className="pabs" />
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
                          {teams.slice(0, 1).map((team, index) => (
                            <div key={index} className="team-card">
                              <div className="name-wraper name-wraper-white sss" onClick={() => router.push(`/teams/${team?.teamName ||
                                    team?.officialTeamName ||
                                    "..."}`)}>
                                {renderFlag(team?.country)}
                                <h6>
                                  {team?.teamName ||
                                    team?.officialTeamName ||
                                    "..."}
                                </h6>
                              </div>

                              {team?.numberOfWinningRiders && (
                                <h5>
                                  <strong>{team.numberOfWinningRiders} </strong>
                                  riders
                                </h5>
                              )}

                              <img
                                src="/images/player7.png"
                                alt=""
                                className="absolute-img"
                              />
                              <Link href="/team-with-most-rider-to-win-race" className="green-circle-btn">
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

              {/*Box 7 - Finished  Races*/}

              <div className="col-lg-3 col-md-6">
                <div className="races">
                  <div className="text-wraper text-center">
                    <h3 className="text-uppercase fw-900 font-archivo fs-chenge">{data?.[fixedApis.box7]?.message}</h3>
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
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart lime-green-cart">
                  <Link href="/most-wins-overall-gc" className="pabs" />
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
                      <Link href="/most-wins-overall-gc" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/*Box 9 - Most DNF */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart team-cart">
                  <Link href="/race-with-most-dnfs" className="pabs" />
                  <div className="text-wraper">
                    <h4> {data?.[fixedApis.box9]?.message}</h4>
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
                          .map((race, index) => (
                            <>
                              <div
                                className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/races/${race?.race_name}`)}
                                key={index}
                              >
                                <>
                                  {renderFlag(race?.country_code)}
                                  <h6>{race?.race_name || "..."}</h6>
                                </>
                              </div>

                              {race?.count && (
                                <h5>
                                  <strong>{race.count} </strong> dnfs
                                </h5>
                              )}
                            </>
                          ))}

                        <Link href="/race-with-most-dnfs" className="green-circle-btn">
                          <Image
                            src="/images/arow.svg"
                            alt=""
                            width={10}
                            height={10}
                          />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="d-md-none d-flex justify-content-end pt-4 mobile_link_wrap">
                  <a href="/stats" className="alle-link m-0">
                    Alle statistieken <img src="/images/arow2.svg" alt="" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default YearSection;
