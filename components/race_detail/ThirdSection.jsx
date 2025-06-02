import React, { useState, useEffect } from "react";

import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

export const ThirdSection = ({ selectedYear, selectedNationality, name }) => {
  // Define single API endpoint for each section box
  const fixedApis = {
    box1: "getFastestEditionOfRace",
    box2: "getRaceParticipants",
    box3: "getOldestStageWinner",
    box4: "getPodiumNationalityStats",
    box5: "getRiderWithMostStageWins",
    box6: "getRiderWithMostGCTop10s",
    box7: "getNationalityWithMostTop10",
    box8: "getYoungestWinner",
    box9: "mostWins",
  };

  // Build query parameters based on selected filters
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

    fixedApis.box2,
    fixedApis.box4,
    fixedApis.box7,
    fixedApis.box9,
  ];
  const stageEndpoints = [
        fixedApis.box1,
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
    idType: "oneDayRaceStats",
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
      response?.data?.data?.most_wins,
      response?.data?.data?.result,
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
                      {/* Box 1 - Fastest edition of race */}
                     <div className="col-lg-4 col-md-6">
                                     <div className="team-cart img-active">
                                       <a href="#?" className="pabs"></a>
                                       {(() => {
                                         // Special handling for box5 since it returns a single object, not an array
                                         if (!data?.[fixedApis.box1]) {
                                           return <ErrorMessage errorType="no_data" />;
                                         }
                     
                                         const response = data[fixedApis.box1];
                                         const riderData = response?.data.data;
                     
                                         if (!riderData) {
                                           return <ErrorMessage errorType="no_data_found" />;
                                         }
                     
                                         return (
                                           <>
                                             <div className="text-wraper">
                                               <h4>{data?.[fixedApis.box1]?.message}</h4>
                                               <div className="name-wraper">
                                                 {renderFlag(riderData?.nationality_filter)}
                                                 <h6>{riderData?.race_name || "..."}</h6>
                                               </div>
                                               {riderData?.total_time_hours && (
                                                 <h5>
                                                   <strong>{riderData.total_time_hours} </strong> hours
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
                                  <div className="text-wraper" key={index}>
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
                          {(() => {
                           if (!data?.[fixedApis.box3]) {
                              return <ErrorMessage errorType="no_data" />;
                            }
        
                            const response = data[fixedApis.box3];
                            const riderData = response?.data;
        
                            if (!riderData) {
                              return <ErrorMessage errorType="no_data_found" />;
                            }
        
                            return (
                              <>
                                <div className="text-wraper">
                                  <h4 className="font-size-change">
                                    {data?.[fixedApis.box3]?.message}
                                  </h4>
                                  <div className="name-wraper">
                                    {renderFlag(riderData?.country)}
                                    <h6>{riderData?.rider_name || "..."}</h6>
                                  </div>
                                  {riderData?.totalKOMTitles && (
                                    <h5>
                                      <strong>{riderData.totalKOMTitles} </strong> wins
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
                               <div className="team-cart lime-green-team-cart img-active">
                                 <a href="#?" className="pabs"></a>
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
                                         <div className="text-wraper">
                                           <h4 className="font-size-change">
                                             {" "}
                                             {data?.[fixedApis.box7]?.message}
                                           </h4>
                                           <div className="name-wraper" key={index}>
                                             {renderFlag(rider?.rider_country)}
                                             <h6>{rider?.team_name || "..."}</h6>
                                           </div>
                   
                                           {rider?.count && (
                                             <h5>
                                               <strong>{rider.count} </strong> count
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
                    </>
          )}
        </div>
      </div>
    </section>
  );
};
