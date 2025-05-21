import React, { useState, useEffect } from "react";
import { useMultipleData } from "@/components/home_api_data";
import Flag from "react-world-flags";
import { BoxSkeleton, ErrorStats, LoadingStats, NoDataMessage, PartialDataWarning } from "../loading&error";
import { FaHtml5 } from "react-icons/fa";

export const SecondSection =  ({ selectedYear, selectedNationality, name }) => {
  // Endpoint groups for different sections
   const firstSectionEndpoints = ["getFastestEditionOfRace","getLongestStageInRace","getShortestStageInRace"];
   const secondSectionEndpoints = [ "getMostGCWinsInRace" ];
  const thirdSectionEndpoints = ["getMostStageDepartures", "getMostStageFinishes"];
   const fourthSectionEndpoints = [ "getMostWinsByRiderInRace","getMostPodiumsByRiderInRace","getMostTop10ByRiderInRace"];  
   const fifthSectionEndpoints = ["getTopRidersInRace","getWinnersFromCountry" ];
 
   const sixthSectionEndpoints = [ "getRiderWithMostDNF", "getRiderWithMostFinishes", "getRiderWithMostConsecutiveWins"];
 
   const seventhSEctionEndpoints = ["getOldestTop10Rider","getYoungestTop10Rider","getFastestRaceEdition","getLongestRaceEdition"];
      const eightSectionEndpoints = ["getEditionWithMostDNFs","getMostSuccessfulTeamInRace","getTeamWithMostWinsInRace" ];
      const lastSectionEndpoints=["getLastWinnerFromCountry","getCountryWithMostWins"]
   // State for selected endpoints
   const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(
     firstSectionEndpoints[0]
   );
   const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(
     secondSectionEndpoints[0]
   );
 
   const [thirdSectionEndpoint, setThirdSectionEndpoint] = useState(
     thirdSectionEndpoints[0]
   );
   const [fourthSectionEndpoint, setFourthSectionEndpoint] = useState(
     fourthSectionEndpoints[0]
   );
   const [fifthSectionEndpoint, setFifthSectionEndpoint] = useState(
     fifthSectionEndpoints[0]
   );
   const [sixthSectionEndpoint, setSixthSectionEndpoint] = useState(
     sixthSectionEndpoints[0]
   );
   const [seventhSectionEndpoint, setSeventhSectionEndpoint] = useState(
     seventhSEctionEndpoints[0]
   );
    const [eightSectionEndpoint, setEightSectionEndpoint] = useState(
     eightSectionEndpoints[0]
   );

       const [lastSectionEndpoint, setLastSectionEndpoint] = useState(
     lastSectionEndpoints[0]
   );
   // Component state
   const [isMounted, setIsMounted] = useState(false);
   const [noDataFound, setNoDataFound] = useState(false);
   const [visibleCardCount, setVisibleCardCount] = useState(0);
   const [totalEndpoints, setTotalEndpoints] = useState(0);
 
   // Helper function to select random endpoint from array
   const getRandomEndpoint = (endpointArray) => {
     const randomIndex = Math.floor(Math.random() * endpointArray.length);
     return endpointArray[randomIndex];
   };
 
   // Initialize with random endpoints on mount
   useEffect(() => {
     setIsMounted(true);
     try {
       // Get random endpoints for each section
       setFirstSectionEndpoint(getRandomEndpoint(firstSectionEndpoints));
       setSecondSectionEndpoint(getRandomEndpoint(secondSectionEndpoints));
       setThirdSectionEndpoint(getRandomEndpoint(thirdSectionEndpoints));
       setFourthSectionEndpoint(getRandomEndpoint(fourthSectionEndpoints));
       setFifthSectionEndpoint(getRandomEndpoint(fifthSectionEndpoints));
       setSixthSectionEndpoint(getRandomEndpoint(sixthSectionEndpoints));
       setSeventhSectionEndpoint(getRandomEndpoint(seventhSEctionEndpoints));
        setEightSectionEndpoint(getRandomEndpoint(eightSectionEndpoints));
               setLastSectionEndpoint(getRandomEndpoint(lastSectionEndpoints));
     } catch (err) {
       console.error("Error selecting random endpoints:", err);
     }
   }, []);
 
   // Build query parameters based on selected filters
   const buildQueryParams = () => {
     let params = {};
     if (selectedYear && selectedYear !== "All-time") {
       params.year = selectedYear;
     }
     if (selectedNationality) params.nationality = selectedNationality;
     return params;
   };
 
   const raceEndpointsToFetch = [
  fourthSectionEndpoint,
 fifthSectionEndpoint,
sixthSectionEndpoint,
seventhSectionEndpoint,eightSectionEndpoint,
lastSectionEndpoint
   ];
 
   const stageEndpointsToFetch = [
      firstSectionEndpoint,
      secondSectionEndpoint,
    thirdSectionEndpoint,
];
 
   // Define endpoint mappings for specific cases if needed
   const endpointsMappings = {
     // Add specific endpoint mappings here if needed
     // For example:
     // 'bestGCResults': '/race-stats/:id/bestGCResults'
   };
 
   const {
     data: raceData,
     loading: raceLoading,
     error: raceError,
     partialSuccess: racePartialSuccess,
   } = useMultipleData(raceEndpointsToFetch, {
     name: name,
     queryParams: buildQueryParams(),
     endpointsMappings: endpointsMappings,
     idType: "oneDayRaceStats",
   });
 
   // For team endpoints
   const {
     data: stageData,
     loading: stageLoading,
     error: stageError,
     partialSuccess: stagePartialSuccess,
   } = useMultipleData(stageEndpointsToFetch, {
     name: name,
     queryParams: buildQueryParams(),
     endpointsMappings: endpointsMappings,
     idType: "stageStats",
   });
 
   // Combine results
   const loading = raceLoading || stageLoading;
   const error = raceError || stageError;
   const data = { ...raceData, ...stageData };
 
   // Calculate the overall partialSuccess status
   const partialSuccess =
     !loading &&
     // At least one group had partial success
     (racePartialSuccess ||
       stagePartialSuccess ||
       // Or one group succeeded and one failed completely
       (raceError && !stageError) ||
       (!raceError && stageError));
 
   // Update state after data is loaded
   useEffect(() => {
     if (!loading && data) {
       // Count how many endpoints returned valid data
       let cardCount = 0;
       let totalCount =
         raceEndpointsToFetch.length + stageEndpointsToFetch.length;
 
  raceEndpointsToFetch.forEach((endpoint) => {
         if (hasValidData(endpoint)) {
           cardCount++;
         }
       });
 
       // Check stage endpoints
       stageEndpointsToFetch.forEach((endpoint) => {
         if (hasValidData(endpoint)) {
           cardCount++;
         }
       });
 
       setVisibleCardCount(cardCount);
       setTotalEndpoints(totalCount);
       setNoDataFound(cardCount === 0);
     }
   }, [data, loading, raceEndpointsToFetch, stageEndpointsToFetch]);
 
   // Check if an endpoint has valid data
   const hasValidData = (endpoint) => {
     if (!data || !data[endpoint] || !data[endpoint].data) {
       return false;
     }
 
     const endpointData = data[endpoint].data;
 
     // Handle different data structures
     if (Array.isArray(endpointData)) {
       return endpointData.length > 0;
     } else if (typeof endpointData === "object") {
       return Object.keys(endpointData).length > 0;
     }
 
     return false;
   };
 
   // Check if an endpoint has an error
   const hasEndpointError = (endpoint) => {
     // return (
     //   error && error.failedEndpoints && error.failedEndpoints.includes(endpoint)
     // );
     const errorObj = raceEndpointsToFetch.includes(endpoint)
       ? raceError
       : stageError;
     return (
       errorObj &&
       errorObj.failedEndpoints &&
       errorObj.failedEndpoints.includes(endpoint)
     );
   };
 
   // Determine if a card should be shown
   const shouldShowCard = (endpoint) => {
     if (hasEndpointError(endpoint)) return false;
     if (!hasValidData(endpoint)) return false;
     return true;
   };
 
   // Status flags
   const isLoading = loading;
   const showFullError = error && !partialSuccess;
   const showPartialWarning = partialSuccess;
 
   // Get safe access to nested data properties
   const getSafeData = (endpoint, path, defaultValue = null) => {
     try {
       if (!data || !data[endpoint]) return defaultValue;
       return getNestedProperty(data[endpoint], path, defaultValue);
     } catch (err) {
       console.error(`Error accessing ${path} for ${endpoint}:`, err);
       return defaultValue;
     }
   };
 
   // Helper function to safely access nested properties
   const getNestedProperty = (obj, path, defaultValue = null) => {
     const keys = path.split(".");
     let result = obj;
 
     for (const key of keys) {
       if (
         result === undefined ||
         result === null ||
         !Object.prototype.hasOwnProperty.call(result, key)
       ) {
         return defaultValue;
       }
       result = result[key];
     }
 
     return result === undefined ? defaultValue : result;
   };
 
   // Get message for each endpoint
   const getEndpointMessage = (endpoint) => {
     // Extract endpoint name from the full path
     const endpointName = endpoint.split("/").pop();
    
     // First try to get the message from the API response
     const apiMessage = getSafeData(endpoint, "message");
 
     // If API message exists, return it
     if (apiMessage) return apiMessage;
 
     // Fallback to default messages if no API message
     return getDefaultMessage(endpointName);
   };
 
   // Default messages for endpoints
   const getDefaultMessage = (endpointName) => {
     const messages = {
       "first-win": "First Win",
     };
 
     return messages[endpointName] || "Rider Statistics";
   };

  return (
    <>
 {showPartialWarning && (
        <PartialDataWarning
          visibleCardCount={visibleCardCount}
          totalEndpoints={totalEndpoints}
          error={error}
        />
      )}

      {isLoading && (
        <div className="col-12">
          <BoxSkeleton />
        </div>
      )}

      {showFullError && (
        <div className="col-12">
          <ErrorStats
            message={error.message || "Failed to load rider statistics"}
          />
        </div>
      )}

      {!isLoading && noDataFound && !showFullError && (
        <div className="col-12">
          <NoDataMessage selectedYear={selectedYear} />
        </div>
      )}

      {!isLoading && !noDataFound && (
        <>
          {/* First Card - GC Podiums / Stage Podiums */}
          {shouldShowCard(firstSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(firstSectionEndpoint)}</h4>
                  {getSafeData(firstSectionEndpoint, 'data.data') &&
                 <div className="name-wraper">
                  
                        <h6> {getSafeData(firstSectionEndpoint, 'data.data.race_name')}</h6>
                       {getSafeData(firstSectionEndpoint, 'data.data.year')}
                      </div>
                  }
                </div>
           {firstSectionEndpoint ==="getFastestEditionOfRace" ?<h5>
                      <strong>  {getSafeData(firstSectionEndpoint, 'data.data.total_time_hours')}</strong> time
                    </h5>
                    :
                <h5>
                      <strong>  {getSafeData(firstSectionEndpoint, 'data.data.distance_km')}</strong> distance
                    </h5>
                           }
             

                <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}
 {/* Second Card - Top Teams */}
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(secondSectionEndpoint)}</h4>
                  {getSafeData(secondSectionEndpoint, 'data.data') &&
                  <>
                 <div >
                  
                        <h6> Race: {getSafeData(secondSectionEndpoint, 'data.data.race_name')}</h6>
                  
                      </div>
                          <div className="name-wraper">
                  <Flag code={getSafeData(secondSectionEndpoint, 'data.data.most_gc_wins.nationality')} style={{width:"20px",height:"20px",marginLeft:"10px"}}/>
                        <h6> {getSafeData(secondSectionEndpoint, 'data.data.most_gc_wins.rider_name')}</h6>
                       {getSafeData(secondSectionEndpoint, 'data.data.year')}
                      </div>
                      </>
                  }

                       
                </div>
                  <h5>
                      <strong>  {getSafeData(secondSectionEndpoint, 'data.data.most_gc_wins.wins')}</strong> wins
                    </h5>
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}
        {/* Third Card - Longest/Shortest Races */}
          {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(thirdSectionEndpoint)}</h4>

           
                  
                  
                    {getSafeData(thirdSectionEndpoint, 'data.data') &&
                  
                          <h6>Race: {getSafeData(thirdSectionEndpoint, 'data.data.race_name')}</h6>
                       
                  }
                </div>

                {thirdSectionEndpoint === "getMostStageDepartures" ?
                  getSafeData(thirdSectionEndpoint, 'data.data.most_used_departure_cities', [])
                    .slice(0, 1)
                    .map((race, index) => (
                      
                        <div className="name-wraper">
                      <h3 key={index}>
                        <strong>{race.city}({race.count})</strong> 
                      </h3>
                      </div>
                    ))
                  :
                      getSafeData(thirdSectionEndpoint, 'data.data.most_used_finish_cities', [])
                    .slice(0, 1)
                    .map((race, index) => (
                      
                        <div className="name-wraper" key={index}>
                      <h3 key={index}>
                        <strong>{race.city}({race.count})</strong> 
                      </h3>
                      </div>
                    ))
                  
                  }
           
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}


            {/* Fourth Card - GC Top 10s / Most Consistent GC */}
          {shouldShowCard(fourthSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{getEndpointMessage(fourthSectionEndpoint)}</h4>

                  <div className="name-wraper">
                        {getSafeData(fourthSectionEndpoint, 'data.data') &&
              <>
               <Flag code= {getSafeData(fourthSectionEndpoint, 'data.data.nationality_filter').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                       
                        <h6>{getSafeData(fourthSectionEndpoint, 'data.data.race_name')}</h6>
                        </>
                          }
                      </div>
                 
                  {getSafeData(fourthSectionEndpoint, 'data.data.top_rider') &&
              
                      <div className="name-wraper">
                        {getSafeData(fourthSectionEndpoint, 'data.data.top_rider') &&
                    <Flag
                            code= {getSafeData(fourthSectionEndpoint, 'data.data.top_rider.rider_country').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          }
                        <h6>{getSafeData(fourthSectionEndpoint, 'data.data.top_rider.rider_name')}</h6>
                       </div>
                  }
                </div>
                     {
                        fourthSectionEndpoint==="getMostWinsByRiderInRace"?
                         <h5>
                        <strong>{getSafeData(fourthSectionEndpoint, 'data.data.total_winners_analysed' || "N/A")}</strong>total winners
                      </h5>
                      :
                           <h5>
                        <strong>{getSafeData(fourthSectionEndpoint, 'data.data.total_riders_analysed' || "N/A")}</strong>total riders
                      </h5>
                       }
            
                 <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}
  {/* Fifth Card - Stage Top 10s / GC Top 10s (List) */}
          {shouldShowCard(fifthSectionEndpoint) && (
            <div className="col-lg-5">
              <div className="list-white-cart">
                <h4 className="font-size-change">
                  {getEndpointMessage(fifthSectionEndpoint)}
                </h4>
                   <div className="name-wraper">
                        {getSafeData(fifthSectionEndpoint, 'data.data') &&
              <>
               <Flag code= {getSafeData(fifthSectionEndpoint, 'data.data.nationality_filter').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                       
                        <h6>{getSafeData(fifthSectionEndpoint, 'data.data.race_name')}</h6>
                        </>
                          }
                      </div>
                      
                 {fifthSectionEndpoint === "getWinnersFromCountry" ?
                  getSafeData(fifthSectionEndpoint, 'data.data.top_riders', [])
                  .slice(0, 5)
                  .map((rider, index) => (
                    <ul key={index}>
                      <li>
                        <strong>{index + 1}</strong>
                        <div className="name-wraper">
                          {rider.rider_country && (
                            <Flag
                              code={rider.rider_country}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                          <h6>{rider.rider_name}</h6>
                        </div>
                        <span>{rider.wins || "N/A"} wins</span>
                      </li>
                    </ul>
                  ))
                :
                 getSafeData(fifthSectionEndpoint, 'data.data.winners', [])
                  .slice(0, 5)
                  .map((race, index) => (
                    <ul key={index}>
                      <li>
                        <strong>{index + 1}</strong>
                        <div className="name-wraper">
                          {race.country && (
                            <Flag
                              code={race.country}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                          <h6>{race.winner_name}</h6>
                        </div>
                        <span>{race.year || "N/A"} year</span>
                      </li>
                    </ul>
                  ))
                }
                <img
                  src="/images/player4.png"
                  alt=""
                  className="absolute-img"
                />

                <a href="#?" className="glob-btn">
                  <strong>volledige stats</strong>{" "}
                  <span>
                    <img src="/images/arow.svg" alt="" />
                  </span>
                </a>
              </div>
            </div>
          )}

        <div className="col-lg-7">
              <div className="row">
                {/* Sixth Card - Most Racing Days */}
                {shouldShowCard(sixthSectionEndpoint) && (
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{getEndpointMessage(sixthSectionEndpoint)}</h4>
                         <div className="name-wraper">
                        {getSafeData(sixthSectionEndpoint, 'data.data.nationality_filter') &&
             
               <Flag code= {getSafeData(sixthSectionEndpoint, 'data.data.nationality_filter').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                         }
                        <h6>{getSafeData(sixthSectionEndpoint, 'data.data.race_name')}</h6>
                       
                        
                      </div>
              {sixthSectionEndpoint ==="getRiderWithMostConsecutiveWins" ?
                 getSafeData(sixthSectionEndpoint, 'data.top_streak') &&
              
                      <div className="name-wraper">
                        
                        <h6>{getSafeData(sixthSectionEndpoint, 'data.data.top_streak.rider_name')}</h6>
                      
                        </div>
                        :
                getSafeData(sixthSectionEndpoint, 'data.top_rider') &&
              
                      <div className="name-wraper">
                        {getSafeData(sixthSectionEndpoint, 'data.data.top_rider.rider_country') &&
            
                          <Flag
                            code= {getSafeData(sixthSectionEndpoint, 'data.data.top_rider.rider_country').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                         }
                        <h6>{getSafeData(sixthSectionEndpoint, 'data.data.top_rider.rider_name')}</h6>
                        </div>
                  }
                </div>
                   { sixthSectionEndpoint ==="getRiderWithMostConsecutiveWins" ?
                     <h5>{getSafeData(sixthSectionEndpoint, 'data.data.top_streak.streak' || "N/A")} streak</h5>
                     :
                           <h5>
                        <strong>{getSafeData(sixthSectionEndpoint, 'data.data.total_riders_analysed' || "N/A")}</strong>total riders
                      </h5>
}
             <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Seventh Card - Most Top 5 No Wins / Most Second Places */}
                {shouldShowCard(seventhSectionEndpoint) && (
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">
                          {getEndpointMessage(seventhSectionEndpoint)}
                        </h4>
                           <div className="name-wraper">
                        {getSafeData(seventhSectionEndpoint, 'data.data.nationality_filter') &&
             
               <Flag code= {getSafeData(seventhSectionEndpoint, 'data.data.nationality_filter').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                         }
                        <h6>{getSafeData(seventhSectionEndpoint, 'data.data.race_name')}</h6>
                       
                        
                      </div>
                      </div>
                                    <ul>
                                      {getSafeData(seventhSectionEndpoint, 'data.data.result') &&
                                            <li>
                       <div className="name-wraper">
                        {getSafeData(seventhSectionEndpoint, 'data.data.result.rider_country') &&
             
               <Flag code= {getSafeData(seventhSectionEndpoint, 'data.data.result.rider_country').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                         }
                        <h6>{getSafeData(seventhSectionEndpoint, 'data.data.result.rider_name')}</h6>
                         </div>
                    </li>
                                      }
</ul>

{seventhSectionEndpoint === "getFastestRaceEdition" || seventhSectionEndpoint === "getLongestRaceEdition" ?
       <h5>
                            <strong>{getSafeData(seventhSectionEndpoint, 'data.data.distance_km') || "N/A"}</strong>
                           distance
                           </h5>
                           :
                            <h5>
                            <strong>{getSafeData(seventhSectionEndpoint, 'data.data.result.age') || "N/A"}</strong>
                           age
                           </h5>
                           }
               
                        
                    
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Eighth Card - Grand Tour Stage Win / Best Classics */}
                {shouldShowCard(eightSectionEndpoint) && (
                  <div className="col-lg-6 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">
                          {getEndpointMessage(eightSectionEndpoint)}
                        </h4>
                            <div className="name-wraper">
                       <h6>{getSafeData(seventhSectionEndpoint, 'data.data.race_name')}</h6>
                        </div>
                        {eightSectionEndpoint ==="getTeamWithMostWinsInRace" ?
                      
                         ( getSafeData(eightSectionEndpoint, 'data.data.most_wins_team') &&
                          
                            <ul className="listdata">
                              <li>
                                <div className="name-wraper">
                               
                                  <h6>{getSafeData(eightSectionEndpoint, 'data.data.most_wins_team.team_name')}</h6>
                                  
                                </div>
                              </li>
                            </ul>
                       )
                       :
                        
                       ( getSafeData(eightSectionEndpoint, 'data.data.most_successful_team') &&
                          
                            <ul className="listdata">
                              <li>
                                <div className="name-wraper">
                               
                                  <h6>{getSafeData(eightSectionEndpoint, 'data.data.most_successful_team.team_name')}</h6>
                                  <span>{getSafeData(eightSectionEndpoint, 'data.data.most_successful_team.wins')} wins</span>
                                </div>
                              </li>
                            </ul>
                       )
                              }
                      </div>

{
  eightSectionEndpoint === "getTeamWithMostWinsInRace" ?
  
   <h5>
                            <strong>{getSafeData(eightSectionEndpoint, 'data.data.most_wins_team.wins') || "N/A"}</strong>
                           wins
                           </h5>
                           :
  eightSectionEndpoint === "getMostSuccessfulTeamInRace" ?
                           <h5>
                            <strong>  {getSafeData(eightSectionEndpoint, 'data.data.most_successful_team.wins')}
                              </strong>
                           wins
                           </h5>
                           :
                            <h5>
                            <strong>{getSafeData(eightSectionEndpoint, 'data.data.dnf_count') || "N/A"}</strong>
                           count
                           </h5>
}
                    
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Last Card - Most Weight / Lightest Rider */}
      
                {shouldShowCard(lastSectionEndpoint) && (
                  <div className="col-lg-6 col-md-6">
                    <div className="team-cart lime-green-team-cart">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{getEndpointMessage(lastSectionEndpoint)}</h4>
   <div >
                  
                        <h6> Race: {getSafeData(lastSectionEndpoint, 'data.race_name')}</h6>
                  
                      </div>
                      {lastSectionEndpoint === "getCountryWithMostWins" ?
                                 <div className="name-wraper">
                        {getSafeData(lastSectionEndpoint, 'data.most_wins_country') &&
             
               <Flag code= {getSafeData(lastSectionEndpoint, 'data.most_wins_country').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                         }
                        <h6>{getSafeData(lastSectionEndpoint, 'data.wins')}</h6>wins
                       
                        
                      </div>
                      :
                                 <div className="name-wraper">
                        {getSafeData(lastSectionEndpoint, 'data.country') &&
             
               <Flag code= {getSafeData(lastSectionEndpoint, 'data.country').toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                         }
                        <h6>{getSafeData(lastSectionEndpoint, 'data.winner_name')}</h6>
                       
                        
                      </div>
                      }
                            
                      </div>
                      {lastSectionEndpoint === "getLastWinnerFromCountry" &&
                        <h5>
                            <strong>{getSafeData(lastSectionEndpoint, 'data.time' || "N/A")}</strong> time
                          </h5>
                  
                      }
                        
                      <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
       
        </>
      )}
    </>
  );
};

export default SecondSection;