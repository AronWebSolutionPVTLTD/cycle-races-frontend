import React from "react";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

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
                   <div className="col-lg-3 col-md-6">
                                <div className="list-white-cart lime-green-cart">
                                    
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
                                                <div className="name-wraper">
                                                  {renderFlag(rider?.rider_country)}
                                                  <h6>{rider?.rider_name || "..."}</h6>
                                                </div>
              
                                                {rider?.wins && <span>{rider.wins}</span>}
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
              

            {/* SEcond Card */}
               <div className="col-lg-3 col-md-6">
                              <div className="team-cart">
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
                                            <div className="name-wraper" key={index}>
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
          
                                      <a href="#?" className="green-circle-btn">
                                        <img src="/images/arow.svg" alt="" />
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

            {/* third Section */}
             <div className="col-lg-3 col-md-6">
                              <div className="team-cart">
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
                                              {renderFlag(rider?.rider_country)}
                                              <h6>{rider?.team_name || "..."}</h6>
                                            </div>
                                            {rider?.count && (
                                              <h5>
                                                <strong>{rider.count} </strong>
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

            {/* Box4: total Race */}
            <div className="col-lg-3 col-md-6">
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
                      <div className="name-wraper">
                        {riderData.count && 
                        <h5>
                          <strong>{riderData.count}</strong>
                        </h5>
                        }
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="col-lg-7 box5">
              <div className="row">
                {/* Box5: GC Rider by team */}

              <div className="col-lg-5 col-md-6">
                              <div className="team-cart">
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
                                            <div className="name-wraper" key={index}>
                                              {renderFlag(rider?.rider_country)}
                                              <h6>{rider?.team_name || "..."}</h6>
                                            </div>
                                            {rider?.count && (
                                              <h5>
                                                <strong>{rider.count} </strong>wins
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

                {/*Box 6 -top 3GC Team */}
                   <div className="col-lg-7 col-md-6">
                                <div className="list-white-cart">
                                    
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

                {/*Box 7 - Most Consistent GCTeams*/}
                <div className="col-lg-7 col-md-6">
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
                           <div className="name-wraper" key={index}>
                                           
                                              <h6>{rider?.team_name || "..."}</h6>
                                            </div>
                                            {rider?.totalPoints && (
                                              <h5>
                                                <strong>{rider.totalPoints} </strong>points
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

                {/*Box 8 - longest Races */}
                     <div className="col-lg-5 col-md-6">
                     <div className="team-cart">
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
                           <div className="name-wraper" key={index}>
                                           
                                              <h6>{rider?.race || "..."}</h6>
                                            </div>
                                            {rider?.distance && (
                                              <h5>
                                                <strong>{rider.distance} </strong>kilometer
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
              </div>
            </div>

            {/*Box 9 - top 1o GC Teams  */}
            <div className="col-lg-5 box6">
              <div className="list-white-cart lime-green-cart">
                <h4 className="fs-chenge">
                  {" "}
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
                            <strong>{index+1}</strong>
                            <div className="name-wraper">
                              {renderFlag(rider?.rider_country)}
                              <h6>{rider?.team_name || "..."}</h6>
                            </div>

                            {rider?.count && <span>{rider.count}</span>}
                          
                          </li>
                        ))}
                    </ul>

                    <img
                      src="/images/player6.png"
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
          </>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsThirdSection;
