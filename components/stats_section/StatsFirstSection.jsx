import React from "react";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

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
    box10: "mostSecondPlaces",
    box11: "teamWithMostNationalities",
    box12: "youngestMostWins",
    box13: "olderstRiders",
    box14: "mostmountainwins",
    box15: "shortestRace",
    box16: "lightestRider",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;
    return params;
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
                              <div className="name-wraper">
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
                      <a href="#?" className="glob-btn">
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
                                < div key={index}>
                                  <div className="name-wraper" >
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong> wins
                                    </h5>
                                  )}
                                </div>
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
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>

                                  {rider?.count && (
                                    <span>{rider.count}</span>
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

              {/* Box 10 - Most Second  Places */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4 className="font-size-change">
                      {data?.[fixedApis.box10]?.message}
                    </h4>
                    {getBoxData(fixedApis.box10).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box10).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box10).data)
                          ? getBoxData(fixedApis.box10).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              <div className="name-wraper" key={index}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.second_place_count && (
                                <h5>
                                  <strong>{rider.second_place_count} </strong>{" "}
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
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Box 11 -  Most nationality  */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box11]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box11]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box11];
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
                          {riderData?.wins && (
                            <h5>
                              <strong>{riderData.wins} </strong>
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

              {/*Box 12 - Most youngest  wins*/}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box12]?.message}</h4>
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
                              <div className="name-wraper" key={index}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins} </strong> wins
                                </h5>
                              )}
                            </>
                          ))}

                        <img
                          src="/images/player6.png"
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

              {/*Box 13 - Most olderst Riders*/}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data?.[fixedApis.box13]?.message}</h4>
                  {getBoxData(fixedApis.box13).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box13).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box13).data)
                          ? getBoxData(fixedApis.box13).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.age && <span>{rider.age} jaar</span>}
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

              {/*Box 14 - Mountain  */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box14]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box14]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box14];
                      const riderData = response?.data;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper">
                            {renderFlag(riderData?.country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.totalKOMTitles && (
                            <h5>
                              <strong>{riderData.totalKOMTitles} </strong>wins
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

              {/*Box 15 - Shortest race */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box15]?.message}</h4>
                    {getBoxData(fixedApis.box15).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box15).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box15).data)
                          ? getBoxData(fixedApis.box15).data
                          : []
                        )
                          .slice(0, 1)
                          .map((race, index) => (
                            <>
                              <div className="name-wraper" key={index}>
                                <h6>
                                  {race?.race || "..."} ({race?.year})
                                </h6>
                              </div>

                              {race?.distance && (
                                <h5>
                                  <strong>{race.distance} </strong> km
                                </h5>
                              )}
                            </>
                          ))}
                        <img
                          src="/images/player2.png"
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
              {/*Box 16 -Lightest rider */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box16]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box16]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box16];
                      const riderData = response?.data.data;

                      if (!riderData) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          <div className="name-wraper">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.name || "..."}</h6>
                          </div>
                          {riderData?.weight && (
                            <h5>
                              <strong>{riderData.weight} </strong>kg
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsFirstSection;
