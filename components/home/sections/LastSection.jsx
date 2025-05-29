import React from "react";
import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton2, ErrorStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

const fixedApis = {
  box1: "olderstRiders",
  box2: "youngestMostWins",
  box3: "stageTop10sRider",
  box4: "mostSecondPlaces",
  box5: "lightestRider",
  box6: "shortestRace",
  box7: "olderstRiders",
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

  // Error message component
  const ErrorMessage = ({ errorType = "general" }) => {
    const errorMessages = {
      api_error: "API Error",
      no_data: "No Data Available",
      no_endpoint_data: "No Endpoint Data",
      null_data: "Data Not Found",
      empty_array: "No Records Found",
      empty_object: "No Information Available",
      processing_error: "Data Processing Error",
      no_data_found: "No Records Found", // Added this
      general: "No Data Available",
    };

    return (
      <div className="text-danger text-center py-3">
        {errorMessages[errorType] || errorMessages.general}
      </div>
    );
  };

  console.log(data, "data");

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
              {/* Box 1 - oldest Rider */}
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
                          <div className="text-wraper">
                            <h4 className="font-size-change">
                              {" "}
                              {data?.[fixedApis.box1]?.message}
                            </h4>
                            <div className="name-wraper" key={index}>
                              {renderFlag(rider?.country)}
                              <h6>{rider?.rider_name || "..."}</h6>
                            </div>

                            {rider?.age && (
                              <h5>
                                <strong>{rider.age} </strong> jaar
                              </h5>
                            )}
                          </div>
                        ))}

                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Box 2 - Youngest Rider most win  */}
              <div className="col-lg-4 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
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
                          <div className="text-wraper">
                            <h4 className="font-size-change">
                              {" "}
                              {data?.[fixedApis.box2]?.message}
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

                      <a href="#?" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/*Box 3 - Most Distance race*/}
              <div className="col-lg-4 col-md-6">
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
                        .map((rider, index) => (
                          <div className="text-wraper">
                            <h4 className="font-size-change">
                              {data?.[fixedApis.box6]?.message}
                            </h4>
                            <div className="name-wraper" key={index}>
                              {renderFlag(rider?.rider_country)}
                              <h6>{rider?.rider_key || "..."}</h6>
                            </div>

                            {rider?.total_distance !== undefined &&
                              rider?.total_distance !== null && (
                                <h5>
                                  <strong>{rider.total_distance} </strong>{" "}
                                  distance
                                </h5>
                              )}
                          </div>
                        ))}

                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/*Box 4 - Most second places */}
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
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.second_place_count && (
                                <span>{rider.second_place_count} count</span>
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

              {/*Box 5 - Lightest rider */}
            <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  {(() => {
                    // Special handling for box5 since it returns a single object, not an array
                    if (!data?.[fixedApis.box5]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box5];
                    const riderData = response?.data?.data;

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
                            {renderFlag(riderData?.rider_country)}
                            <h6>{riderData?.name || "..."}</h6>
                          </div>
                          {riderData?.weight && (
                            <h5>
                              <strong>{riderData.weight} </strong> Kilogram
                            </h5>
                          )}
                        </div>
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
              {/*Box 6 - Shortest race */}
         {/* Box 6 - Shortest Races */}
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
          ? getBoxData(fixedApis.box6).data  // ← Fixed: was box2, now box6
          : []
        )
          .slice(0, 1)
          .map((race, index) => (
            <div className="text-wraper" key={index}>
              <h4 className="font-size-change">
                {data?.[fixedApis.box6]?.message}
              </h4>
              <div className="name-wraper">
                <h6>{race?.race || "..."} ({race?.year})</h6>
              </div>

              {race?.distance && (
                <h5>
                  <strong>{race.distance} </strong> kilometer
                </h5>
              )}
            </div>
          ))}

        <a href="#?" className="green-circle-btn">
          <img src="/images/arow.svg" alt="" />
        </a>
      </>
    )}
  </div>
</div>
              {/*Box 7 -shortestRaces */}
               <div className="col-lg-3 col-md-6">
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
                          <div className="text-wraper">
                            <h4 className="font-size-change">
                              {" "}
                              {data?.[fixedApis.box1]?.message}
                            </h4>
                            <div className="name-wraper" key={index}>
                              {renderFlag(rider?.country)}
                              <h6>{rider?.rider_name || "..."}</h6>
                            </div>

                            {rider?.age && (
                              <h5>
                                <strong>{rider.age} </strong> jaar
                              </h5>
                            )}
                          </div>
                        ))}

                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
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

export default LastSection;
