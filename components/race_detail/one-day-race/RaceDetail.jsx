import React, { useState, useEffect } from "react";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const RaceDetail = ({ selectedYear, selectedNationality, name }) => {
  
  const fixedApis = {
    box1: "mostWins",
    box2: "getFastestEditionOfRace",
    box3: "getRiderWithMostGCPodiums",
    box4: "getRaceParticipants",
    box5: "getRiderWithMostStageWins",
    box6: "getRiderWithMostGCTop10s",
    box7: "getNationalityWithMostTop10",
    box8: "getYoungestWinner",
    box9: "mostWins",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear && selectedYear !== "All-time") {
      params.year = selectedYear;
    }
    if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

  // Separate race and stage endpoints
  const raceEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    fixedApis.box4,
    fixedApis.box7,
    fixedApis.box9,
  ];
  const stageEndpoints = [
    fixedApis.box3,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box8,
  ];

  // Define endpoint mappings for specific cases if needed
  const endpointsMappings = {};

  // For race endpoints
  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
  } = useMultipleData(raceEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "raceDetailsStats",
  });

  // For stage endpoints
  const {
    data: stageData,
    loading: stageLoading,
    error: stageError,
  } = useMultipleData(stageEndpoints, {
    name: name,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "stageStats",
  });

  // Combine results
  const data = { ...raceData, ...stageData };
  const loading = raceLoading || stageLoading;
  const error = raceError || stageError;

  // Function to get box data similar to LastSection
  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
      response?.data?.editions,
      response?.data?.data,
      response?.data,
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
    <section className="home-sec5">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton />}

          {/* Show global error if all data failed */}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load rider statistics. Please try again later." />
          )}

          {/* Show content only when not loading and no global error */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
             <>
                  
                         {/* box1 - Most wins */}
                          <div className="col-lg-3 col-md-6">
                                           <div className="list-white-cart">
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
                                                           {renderFlag(rider?.nationality)}
                                                           <h6>{rider?.rider_name || "..."}  </h6>
                                                         </div>
                       
                                                         {rider?.wins && <span>{rider.wins}</span>}
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
          
                        {/* box2 - Fastest Edition*/}
                      <div className="col-lg-3 col-md-6">
                                     <div className="races">
                                       <div className="text-wraper">
                                         <h3>{data?.[fixedApis.box2]?.message}</h3>
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
          
                        {/* box3 - Rider With MostGCPodiums*/}
                        <div className="col-lg-3 col-md-6">
                          <div className="team-cart">
                            <a href="#?" className="pabs"></a>
                            <div className="text-wraper">
                              <h4>{data?.[fixedApis.box3]?.message}</h4>
                              {(() => {
                                if (!data?.[fixedApis.box3]) {
                                  return <ErrorMessage errorType="no_data" />;
                                }
          
                                const response = data[fixedApis.box3];
                                const riderData = response?.data.data;
          
                                if (!riderData) {
                                  return <ErrorMessage errorType="no_data_found" />;
                                }
          
                                return (
                                  <>
                                    <div className="name-wraper">
                                      {renderFlag(riderData?.country)}
                                      <h6>{riderData?.rider_name || "..."}</h6>
                                    </div>
                                    {riderData?.podiums && (
                                      <h5>
                                        <strong>{riderData.podiums}</strong>times
                                       </h5>
                                    )}
          
                                    <a href="#?" className="green-circle-btn">
                                      <img src="/images/arow.svg" alt="" />
                                    </a>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
          
                        {/* Box4: Race Participants  */}
                   
                                     <div className="col-lg-3 col-md-6">
                                       <div className="team-cart">
                                         <a href="#?" className="pabs"></a>
                                         <div className="text-wraper">
                                           <h4> {data?.[fixedApis.box4]?.message}</h4>
                                           {getBoxData(fixedApis.box4).error ? (
                                             <ErrorMessage
                                               errorType={getBoxData(fixedApis.box4).errorType}
                                             />
                                           ) : (
                                             <>
                                               {(Array.isArray(getBoxData(fixedApis.box4).data)
                                                 ? getBoxData(fixedApis.box4).data
                                                 : []
                                               )
                                                 .slice(0, 1)
                                                 .map((rider, index) => (
                                                   <>
                                                   {rider?.total_participants && (
                                                       <h5 key={index}>
                                                         <strong>{rider.total_participants} </strong> 
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

                        
                        <div className="col-lg-7 box5">
                          <div className="row">
                            {/*Box 5 - most stage wins*/}
                            <div className="col-lg-5 col-md-6">
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
                                            <div className="name-wraper">
                                              {renderFlag(rider?.rider_country)}
                                              <h6>{rider?.rider_name || "..."}</h6>
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
          
                            {/*Box 6 -Rider With MostGCTop10s*/}
                            <div className="col-lg-7 col-md-6">
                              <div className="team-cart lime-green-team-cart img-active">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                  <h4>{data?.[fixedApis.box6]?.message}</h4>
                                  {(() => {
                                if (!data?.[fixedApis.box6]) {
                                  return <ErrorMessage errorType="no_data" />;
                                }
          
                                const response = data[fixedApis.box6];
                                const riderData = response?.data.data;
          
                                if (!riderData) {
                                  return <ErrorMessage errorType="no_data_found" />;
                                }
          
                                return (
                                  <>
                                    <div className="name-wraper">
                                      {renderFlag(riderData?.country)}
                                      <h6>{riderData?.rider_name || "..."}</h6>
                                    </div>
                                    {riderData?.top_10_count && (
                                      <h5>
                                        <strong>{riderData.top_10_count}</strong>times
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
          
                            {/*Box 7 - Best Classic*/}
                            <div className="col-lg-7 col-md-6">
                              <div className="team-cart">
                                <div className="text-wraper">
                                  <h4>{data?.[fixedApis.box4]?.message}</h4>
                                  {getBoxData(fixedApis.box4).error ? (
                                    <ErrorMessage
                                      errorType={getBoxData(fixedApis.box4).errorType}
                                    />
                                  ) : (
                                    <>
                                      {(Array.isArray(getBoxData(fixedApis.box4).data)
                                        ? getBoxData(fixedApis.box4).data
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
                                                <strong>{rider.wins} </strong>wins
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
          
                            {/*Box 8 - oldest Rider */}
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
                                            <div className="name-wraper">
                                              {renderFlag(rider?.rider_country)}
                                              <h6>{rider?.rider_name || "..."}</h6>
                                            </div>
                                            {rider?.age && (
                                              <h5>
                                                <strong>{rider.age} </strong>jaar
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

                              {/*Box 9 - Most stage wins*/}
                        <div className="col-lg-5 box6">
                          <div className="list-white-cart">
                            <h4 className="fs-chenge">
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
                                        <div className="name-wraper">
                                          {renderFlag(rider?.rider_country)}
                                          <h6>{rider?.rider_name || "..."}</h6>
                                        </div>
          
                                        {rider?.count && <span>{rider.count}</span>}
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
                      </>
          )}
        </div>
      </div>
    </section>
  );
};
