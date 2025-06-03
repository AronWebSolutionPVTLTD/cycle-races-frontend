import React from "react";
import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton2, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

const fixedApis = {
  box1: "mostSecondPlaces",
  box2: "teamWithMostNationalities",
  box3: "youngestMostWins",
  box4: "olderstRiders",
  box5: "mostmountainwins",
  box6: "shortestRace",
  box7: "lightestRider",
};

const LastSection = () => {
  const endpointsToFetch = Object.values(fixedApis);
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };
    const response = data[key];
    // Try most common paths in order
    const paths = [
      response?.data?.data?.shortest_stage_races,
      response?.data?.data?.result,
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
          {loading && <BoxSkeleton2 />}

          {/* Show global error if all data failed */}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}

          {/* Show content only when not loading and no global error */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              {/* Box 1 - Most Second  Places */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>

                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                      {(Array.isArray(getBoxData(fixedApis.box1).data)
                        ? getBoxData(fixedApis.box1).data
                        : []
                      )
                        .slice(0, 1)
                        .map((rider, index) => (
                          <div className="text-wraper" key={index}>
                            <h4 className="font-size-change">
                              {" "}
                              {data?.[fixedApis.box1]?.message}
                            </h4>
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
                          </div>
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

              {/* Box 2 -  Most nationality  */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
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
                      <>
                        <div className="text-wraper">
                          <h4 className="font-size-change">
                            {data?.[fixedApis.box2]?.message}
                          </h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.country)}
                            <h6>{riderData?.team || "..."}</h6>
                          </div>
                          {riderData?.wins && (
                            <h5>
                              <strong>{riderData.wins} </strong>
                            </h5>
                          )}
                        </div>
                        <a href="#?" className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/*Box 3 - Most youngest  wins*/}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>

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
                          <div className="text-wraper" key={index}>
                            <h4 className="font-size-change">
                              {" "}
                              {data?.[fixedApis.box3]?.message}
                            </h4>
                            <div className="name-wraper" key={index}>
                              {renderFlag(rider?.rider_country)}
                              <h6>{rider?.rider_name || "..."}</h6>
                            </div>

                            {rider?.wins && (
                              <h5>
                                <strong>{rider.wins} </strong> wins
                              </h5>
                            )}
                          </div>
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

              {/*Box 4 - Most olderst Riders*/}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box4).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box4).errorType}
                    />
                  ) : (
                    <>
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box4]?.message}
                      </h4>
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

              {/*Box 5 - Mountain  */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    if (!data?.[fixedApis.box5]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box5];
                    const riderData = response?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4 className="font-size-change">
                            {data?.[fixedApis.box5]?.message}
                          </h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.country)}
                            <h6>{riderData?.rider_name || "..."}</h6>
                          </div>
                          {riderData?.totalKOMTitles && (
                            <h5>
                              <strong>{riderData.totalKOMTitles} </strong>wins
                            </h5>
                          )}
                        </div>
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

              {/*Box 6 - Shortest race */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>

                  {getBoxData(fixedApis.box6).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box6).errorType}
                    />
                  ) : (
                    <>
                      {(Array.isArray(getBoxData(fixedApis.box6).data)
                        ? getBoxData(fixedApis.box6).data
                        : []
                      )
                        .slice(0, 1)
                        .map((race, index) => (
                          <div className="text-wraper" key={index}>
                            <h4 className="font-size-change">
                              {data?.[fixedApis.box6]?.message}
                            </h4>
                            <div className="name-wraper">
                              <h6>
                                {race?.race || "..."} ({race?.year})
                              </h6>
                            </div>

                            {race?.distance && (
                              <h5>
                                <strong>{race.distance} </strong> km
                              </h5>
                            )}
                          </div>
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
              {/*Box 7 -shortestRaces */}
              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    if (!data?.[fixedApis.box7]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box7];
                    const riderData = response?.data.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="text-wraper">
                          <h4 className="font-size-change">
                            {data?.[fixedApis.box7]?.message}
                          </h4>
                          <div className="name-wraper">
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.name || "..."}</h6>
                          </div>
                          {riderData?.weight && (
                            <h5>
                              <strong>{riderData.weight} </strong>kg
                            </h5>
                          )}
                        </div>

                        <a href="#?" className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LastSection;
