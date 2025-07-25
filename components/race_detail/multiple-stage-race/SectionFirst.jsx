import React, { useState, useEffect } from "react";

import { useMultipleData } from "../../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../../loading&error";
import { renderFlag } from "../../RenderFlag";

export const FirstSection = ({ selectedYear, selectedNationality, name }) => {
  
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
                         {/* Box 1 - Youngest Rider */}
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
                           <div className="d-md-none d-flex justify-content-end pt-4">
                             <a href="#?" className="alle-link m-0">
                               Alle statistieken <img src="/images/arow2.svg" alt="" />
                             </a>
                           </div>
                         </div>
           
                         <div className="col-lg-7 box5">
                           <div className="row">
                             {/*Box 2 - Most top 10 stage*/}
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
                                             <div
                                               className="name-wraper name-wraper-green"
                                               key={index}
                                             >
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
                             
                              {/*Box 3 - Most Racing  Days */}
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
                                             <div
                                               className="name-wraper name-wraper-white"
                                               key={index}
                                             >
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
                                             <div className="name-wraper name-wraper-white">
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
                                             <div className="name-wraper name-wraper-white">
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
                                     <div className="name-wraper name-wraper-white">
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
                                         <div className="name-wraper name-wraper-green">
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
                                             <div
                                               className="name-wraper name-wraper-green"
                                               key={index}
                                             >
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
                       </>
          )}
        </div>
      </div>
    </section>
  );
};
