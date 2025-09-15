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

  // Enhanced error checking function
  // const getBoxData = (key) => {
  //   try {
  //     // Check for network/API errors
  //     if (error && error[key]) {
  //       console.warn(`API error for ${key}:`, error[key]);
  //       return { error: true, errorType: "api_error" };
  //     }

  //     // Check if data exists at all
  //     if (!data || !data[key]) {
  //       return { error: true, errorType: "no_data" };
  //     }

  //     const endpointData = data[key];

  //     // Check for various data structure scenarios
  //     if (!endpointData) {
  //       return { error: true, errorType: "no_endpoint_data" };
  //     }

  //     // Handle different response structures
  //     let actualData = null;

  //     // Check different possible data structures
  //     if (endpointData.data?.data !== undefined) {
  //       actualData = endpointData.data.data;
  //     } else if (endpointData.data !== undefined) {
  //       actualData = endpointData.data;
  //     } else if (endpointData.data.result !== undefined) {
  //       actualData = endpointData.data.result;
  //     } else {
  //       actualData = endpointData;
  //     }

  //     // Check if actualData is null, undefined, or empty
  //     if (actualData === null || actualData === undefined) {
  //       return { error: true, errorType: "null_data" };
  //     }

  //     // Check for empty arrays
  //     if (Array.isArray(actualData) && actualData.length === 0) {
  //       return { error: true, errorType: "empty_array" };
  //     }

  //     // Check for empty objects
  //     if (
  //       typeof actualData === "object" &&
  //       !Array.isArray(actualData) &&
  //       Object.keys(actualData).length === 0
  //     ) {
  //       return { error: true, errorType: "empty_object" };
  //     }

  //     return { data: actualData, error: false };
  //   } catch (err) {
  //     console.error(`Error processing data for ${key}:`, err);
  //     return { error: true, errorType: "processing_error" };
  //   }
  // };

  // Error message component
  // const ErrorMessage = ({ errorType = "general" }) => {
  //   const errorMessages = {
  //     api_error: "API Error",
  //     no_data: "No Data Available",
  //     no_endpoint_data: "No Endpoint Data",
  //     null_data: "Data Not Found",
  //     empty_array: "No Records Found",
  //     empty_object: "No Information Available",
  //     processing_error: "Data Processing Error",
  //     general: "No Data Available",
  //   };

  //   return (
  //     <div className="text-danger text-center py-3">
  //       {errorMessages[errorType] || errorMessages.general}
  //     </div>
  //   );
  // };

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
    <section className="home-sec2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center">
            <h2>dit jaar</h2>
            <a href="/stats" className="alle-link m-0 d-md-inline-block d-none">
              Alle statistieken <img src="/images/arow2.svg" alt="" />
            </a>
          </div>
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
                  <Link href="/most-wins" className="pabs"></Link>

                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
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
                          <Link href="/most-wins" className="glob-btn green-bg-btn">
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
                <div className="d-md-none d-flex justify-content-end pt-4">
                  <a href="/stats" className="alle-link m-0">
                    Alle statistieken <img src="/images/arow2.svg" alt="" />
                  </a>
                </div>
              </div>

              <div className="col-lg-7 box5 d-flex flex-column">
                <div className="row flex-grow-1">
                  {/*Box 2 - Most top 10 stage*/}

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href="/top-rider-stage" className="pabs" />
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
                              href="/top-rider-stage"
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
                      <Link href="/most-racing-days" className="pabs" />
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
                              href="/most-racing-days"
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
                      <Link href="/team-most-stage-wins" className="pabs" />
                      <h4>{data?.[fixedApis.box4]?.message}</h4>
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
                                  <div className="name-wraper name-wraper-white">
                                    {renderFlag(rider?.flag)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.wins && <span>{rider.wins}</span>}
                                </li>
                              ))}
                          </ul>
                          <Link href="/team-most-stage-wins" className="green-circle-btn">
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
                                    {console.log('---rider birthday---', rider)}
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
                  <Link href="/team-with-most-rider" className="pabs" />
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
                              <div className="name-wraper name-wraper-white sss">
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
                              <Link href="/team-with-most-rider" className="green-circle-btn">
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
                  <div className="text-wraper">
                    <h3>{data?.[fixedApis.box7]?.message}</h3>
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
                  <Link href="/most-gc-wins" className="pabs" />
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
                      <Link href="/most-gc-wins" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/*Box 9 - Most DNF */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart team-cart">
                  <Link href="/most-dnfs" className="pabs" />
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

                        <Link href="/most-dnfs" className="green-circle-btn">
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
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default YearSection;
