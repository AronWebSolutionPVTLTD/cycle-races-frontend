import React from "react";
import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

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
      response?.data,
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
    <section className="home-sec2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center">
            <h2>dit jaar</h2>
            <a href="#?" className="alle-link">
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
              {/* Box 1 - Youngest Rider */}
              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart">
                  <h4 className="fs-chenge">
                    {" "}
                    {data?.[fixedApis.box1]?.message}
                  </h4>
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
                          .slice(0, 5)
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

              <div className="col-lg-7 box5">
                <div className="row">
                  {/*Box 2 - Most top 10 stage*/}

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
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
                                  <div className="name-wraper name-wraper-white" key={index}>
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong> wins
                                    </h5>
                                  )}
                                </>
                              ))}
                            <img
                              src="/images/player4.png"
                              alt=""
                              className="absolute-img"
                            />
                            <a href="#?" className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 3 - Most Racing  Days */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <a href="#?" className="pabs"></a>
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
                                  <div className="name-wraper" key={index}>
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.rider_key || "..."}</h6>
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
                            <a href="#?" className="white-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*Box 4 - Top stage rider by team*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="list-white-cart">
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
                                  <div className="name-wraper">
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.count && <span>{rider.count}</span>}
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

                  {/*Box 5 - Birthdays */}
                  <div className="col-lg-5 col-md-6">
                    <div className="list-white-cart">
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
                                  <div className="name-wraper">
                                    {renderFlag(rider?.nationality)}
                                    <h6>{rider?.name || "..."}</h6>
                                  </div>

                                  {rider?.age_today && (
                                    <span>{rider.age_today}</span>
                                  )}
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
                </div>
              </div>
              {/*Box 6 - Team with most rider*/}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
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
                          <div className="name-wraper">
                            {renderFlag(riderData?.country)}
                            <h6>{riderData?.team || "..."}</h6>
                          </div>
                          {riderData?.numberOfWinningRiders && (
                            <h5>
                              <strong>
                                {riderData.numberOfWinningRiders}{" "}
                              </strong>
                              riders
                            </h5>
                          )}

                          <img
                            src="/images/player7.png"
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
                              <div className="name-wraper">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.count && <span>{rider.count}</span>}
                            </li>
                          ))}
                      </ul>
                      <a href="#?" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/*Box 9 - Most DNF */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
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
                          .map((rider, index) => (
                            <>
                              <div className="name-wraper" key={index}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>

                              {rider?.dnf_count && (
                                <h5>
                                  <strong>{rider.dnf_count} </strong> dnfs
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
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default YearSection;
