// import React from 'react'

// export const FirstSection = ({selectedNationality, selectedTeam,selectedYear}) => {
//     console.log((selectedNationality, selectedTeam,selectedYear))
//   return (
//     <>
   
//     <div className="col-lg-3 col-md-6">
//                     <div className="team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>Oudste top-10 renner in grote ronde</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg"  alt="" />
//                                 <h6>Domenico Pozzovivo</h6>
//                             </div>
//                         </div>
//                         <h5><strong>39</strong>jaar</h5>
//                         <img src="/images/player1.png" alt=""   className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg"  alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="races">
//                         <h5>sinds <strong>1913</strong></h5>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>oudste team</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg"  alt="" />
//                                 <h6>Team Movistar</h6>
//                             </div>
//                         </div>
//                         <h5><strong>31</strong>jaar</h5>
//                         <img src="/images/player2.png" alt="" className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg"  alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart lime-green-team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>meest gekozen klim in de tour de france</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg"  alt="" />
//                                 <h6>Alpe d’Huez</h6>
//                             </div>
//                         </div>
//                         <h5><strong>18</strong></h5>
//                         <img src="/images/player3.png" alt=""  className="absolute-img" /> 
//                         <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-7">
//                     <div className="row">
//                         <div className="col-lg-5 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Snelste sprint</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Wout van Aert</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>78</strong>km/ph</h5>
//                                 <img src="/images/player6.png" alt="" className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-7 col-md-6">
//                             <div className="team-cart lime-green-team-cart img-active">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">meest aantal deelnames</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Primoz Roglic</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>12</strong></h5>
//                                 <img src="/images/player3.png" alt="" className="absolute-img" />
//                                 <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-7 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Meest opeenvolgende overwinningen</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Primoz Roglic</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>4</strong></h5>
//                                 <img src="/images/player3.png" alt="" className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-5 col-md-6">
//                             <div className="races">
//                                 <h5>editie <strong>54</strong></h5>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-5">
//                     <div className="list-white-cart">
//                         <h4 className="fs-chenge">oudste team</h4>
//                         <ul>
//                             <li>
//                                 <strong>1.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Team Movistar</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>2.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Lotto Soedal</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>3.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Jumbo-Visma</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>4.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Intermarché</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>5.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Quickstep</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                         </ul>
//                         <img src="/images/player4.png" alt=""  className="absolute-img" />
//                         <h5><strong>31</strong>jaar</h5>
//                         <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
//                     </div>
//                 </div>
//                 </>
//   )
// }
import React, { useState, useEffect } from 'react';
import { useMultipleData } from '@/components/home_api_data';

import Flag from 'react-world-flags';
import { ErrorStats, LoadingStats } from '../home/sections/loading&error';

export const FirstSection = ({ selectedNationality, selectedTeam, selectedYear }) => {
    // Define endpoint arrays for random selection
    const firstSectionEndpoints = [
       "oldestRider","youngestRider"
    ];

    const secondSectionEndpoints = [
        "oldestMostWins","youngestMostWins"
    ];

    const thirdSectionEndpoints = [
        "top3GCTeam",
        "topGCRiderbyTeam",
        "getMostConsistentGCTeams"
    ];

    // State to track the currently selected endpoints
    const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(firstSectionEndpoints[0]);
    const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(secondSectionEndpoints[0]);
    const [thirdSectionEndpoint, setThirdSectionEndpoint] = useState(thirdSectionEndpoints[0]);
    
    // State to track if component is mounted (client-side)
    const [isMounted, setIsMounted] = useState(false);

    // Function to get a random endpoint from an array
    const getRandomEndpoint = (endpointArray) => {
        const randomIndex = Math.floor(Math.random() * endpointArray.length);
        return endpointArray[randomIndex];
    };
console.log(firstSectionEndpoint,"fhshf")
    // Only select random endpoints on client-side after hydration is complete
    useEffect(() => {
        // Set mounted flag to true
        setIsMounted(true);
        
        try {
            // Get random endpoints for each section
            const randomFirstEndpoint = getRandomEndpoint(firstSectionEndpoints);
            const randomSecondEndpoint = getRandomEndpoint(secondSectionEndpoints);
            const randomThirdEndpoint = getRandomEndpoint(thirdSectionEndpoints);
            
            // Update state with the randomly selected endpoints
            setFirstSectionEndpoint(randomFirstEndpoint);
            setSecondSectionEndpoint(randomSecondEndpoint);
            setThirdSectionEndpoint(randomThirdEndpoint);
        } catch (err) {
            console.error("Error selecting random endpoints:", err);
            // Keep the default endpoints if there's an error
        }
    }, []); // Empty dependency array means this runs once on component mount

    // Build query parameters based on selected filters
    const buildQueryParams = () => {
        let params = {};
        
        if (selectedYear) params.year = selectedYear;
        if (selectedNationality) params.rider_country = selectedNationality;
        if (selectedTeam) params.team_name = selectedTeam;
        
        return params;
    };

    // Prepare endpoints to fetch data from
    const endpointsToFetch = [firstSectionEndpoint, secondSectionEndpoint, thirdSectionEndpoint];
    
    // Fetch data for all sections using the selected endpoints with query parameters
    const { data, loading, error, partialSuccess } = useMultipleData(endpointsToFetch, buildQueryParams());

    // Check if we have all data for every endpoint
    const allDataLoaded = endpointsToFetch.every(endpoint => data && data[endpoint]);
    
    // Single loading state - only show loading when not all endpoints have data
    const isLoading = !allDataLoaded && loading;
    
    // Show data when all endpoints have returned data
    const showData = allDataLoaded;
    
    // Show error state only if there's an error and not all data loaded
    const showError = error && !allDataLoaded;

    // Custom warning component for partial success
    const PartialDataWarning = () => (
        <div className="warning-banner w-100 p-3 alert alert-warning">
            <p className="mb-1">Some data couldn't be loaded. Displaying available information.</p>
            {error && error.failedEndpoints && (
                <details>
                    <summary className="cursor-pointer">View details</summary>
                    <p className="mt-2 mb-0">Failed to load: {error.failedEndpoints.join(", ")}</p>
                    <p className="mb-0">Try refreshing for new random endpoints.</p>
                </details>
            )}
        </div>
    );

    return (
        <>
            {partialSuccess && <PartialDataWarning />}
            
            {/* Show single loading state until ALL endpoints return data */}
            {isLoading && <div className="col-12"><LoadingStats /></div>}
            
            {/* Show error state only if there's an error and not all data loaded */}
            {showError && !partialSuccess && <div className="col-12"><ErrorStats message={error.message} /></div>}

            {/* Only show content when data is loaded */}
            {showData && (
    <>
    {/* First Row - Top Statistics */}
    <div className="col-lg-3 col-md-6">
        <div className="team-cart">
            <a href="#?" className="pabs"></a>
            <div className="text-wraper">
                <h4>{data[firstSectionEndpoint]?.message || "Rider Stat"}</h4>
                {data[firstSectionEndpoint]?.data?.data?.length > 0 && 
                    data[firstSectionEndpoint].data.data.slice(0, 1).map((rider, index) => (
                        <div className="name-wraper" key={index}>
                            {rider.rider_country && (
                                <Flag
                                    code={rider.rider_country.toUpperCase()}
                                    style={{
                                        width: "30px",
                                        height: "20px",
                                        marginRight: "10px",
                                    }}
                                />
                            )}
                            <h6>{rider.rider_name}</h6>
                        </div>
                    ))
                }
            </div>
            {data[firstSectionEndpoint]?.data?.data?.length > 0 && 
                data[firstSectionEndpoint].data.data.slice(0, 1).map((rider, index) => (
                    <h5 key={index}>
                        <strong>{rider.value || rider.age}</strong>
                        {rider.unit || " jaar"}
                    </h5>
                ))
            }
            <img src="/images/player1.png" alt="" className="absolute-img" />
            <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
        </div>
    </div>
    
    <div className="col-lg-3 col-md-6">
        <div className="races">
            <h5>sinds <strong>{selectedYear || "1913"}</strong></h5>
        </div>
    </div>
    
    <div className="col-lg-3 col-md-6">
        <div className="team-cart">
            <a href="#?" className="pabs"></a>
            <div className="text-wraper">
                <h4>{data[secondSectionEndpoint]?.message || "Race Stat"}</h4>
                {data[secondSectionEndpoint]?.data?.data?.length > 0 && 
                    data[secondSectionEndpoint].data.data.slice(0, 1).map((rider, index) => (
                        <div className="name-wraper" key={index}>
                            {rider.rider_country && (
                                <Flag
                                    code={rider.rider_country.toUpperCase()}
                                    style={{
                                        width: "30px",
                                        height: "20px",
                                        marginRight: "10px",
                                    }}
                                />
                            )}
                            <h6>{rider.rider_name}</h6>
                        </div>
                    ))
                }
            </div>
            {data[secondSectionEndpoint]?.data?.data?.length > 0 && 
                data[secondSectionEndpoint].data.data.slice(0, 1).map((rider, index) => (
                    <h5 key={index}><strong>{rider.count || rider.value}</strong></h5>
                ))
            }
            <img src="/images/player2.png" alt="" className="absolute-img" />
            <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
        </div>
    </div>
    
    <div className="col-lg-3 col-md-6">
        <div className="team-cart lime-green-team-cart">
            <a href="#?" className="pabs"></a>
            <div className="text-wraper">
                <h4>{data[thirdSectionEndpoint]?.message || "Team Stat"}</h4>
                {data[thirdSectionEndpoint]?.data?.data?.length > 0 && 
                    data[thirdSectionEndpoint].data.data.slice(0, 1).map((team, index) => (
                        <div className="name-wraper" key={index}>
                            {team.country && (
                                <Flag
                                    code={team.country.toUpperCase() || "BE"}
                                    style={{
                                        width: "30px",
                                        height: "20px",
                                        marginRight: "10px",
                                    }}
                                />
                            )}
                            <h6>{team.team_name}</h6>
                        </div>
                    ))
                }
            </div>
            {data[thirdSectionEndpoint]?.data?.data?.length > 0 && 
                data[thirdSectionEndpoint].data.data.slice(0, 1).map((team, index) => (
                    <h5 key={index}><strong>{team.count || team.value}</strong></h5>
                ))
            }
            <img src="/images/player3.png" alt="" className="absolute-img" /> 
            <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
        </div>
    </div>

    {/* Second Row - Middle Section */}
    <div className="col-lg-7">
        <div className="row">
            <div className="col-lg-5 col-md-6">
                <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                        <h4 className="font-size-change">{data[secondSectionEndpoint]?.message || "Rider Statistic"}</h4>
                        {data[secondSectionEndpoint]?.data?.data?.length > 1 && 
                            data[secondSectionEndpoint].data.data.slice(1, 2).map((rider, index) => (
                                <div className="name-wraper" key={index}>
                                    {rider.rider_country && (
                                        <Flag
                                            code={rider.rider_country.toUpperCase()}
                                            style={{
                                                width: "30px",
                                                height: "20px",
                                                marginRight: "10px",
                                            }}
                                        />
                                    )}
                                    <h6>{rider.rider_name || "Wout van Aert"}</h6>
                                </div>
                            ))
                        }
                    </div>
                    {data[secondSectionEndpoint]?.data?.data?.length > 1 && 
                        data[secondSectionEndpoint].data.data.slice(1, 2).map((rider, index) => (
                            <h5 key={index}><strong>{rider.count || "78"}</strong></h5>
                        ))
                    }
                    <img src="/images/player6.png" alt="" className="absolute-img" />
                    <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                </div>
            </div>
            <div className="col-lg-7 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                        <h4 className="font-size-change">{data[firstSectionEndpoint]?.message || "Race Statistic"}</h4>
                        {data[firstSectionEndpoint]?.data?.data?.length > 1 && 
                            data[firstSectionEndpoint].data.data.slice(1, 2).map((rider, index) => (
                                <div className="name-wraper" key={index}>
                                    {rider.rider_country && (
                                        <Flag
                                            code={rider.rider_country.toUpperCase()}
                                            style={{
                                                width: "30px",
                                                height: "20px",
                                                marginRight: "10px",
                                            }}
                                        />
                                    )}
                                    <h6>{rider.rider_name || "Primoz Roglic"}</h6>
                                </div>
                            ))
                        }
                    </div>
                    {data[firstSectionEndpoint]?.data?.data?.length > 1 && 
                        data[firstSectionEndpoint].data.data.slice(1, 2).map((rider, index) => (
                            <h5 key={index}><strong>{rider.value || rider.age || "12"}</strong></h5>
                        ))
                    }
                    <img src="/images/player3.png" alt="" className="absolute-img" />
                    <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                </div>
            </div>
            <div className="col-lg-7 col-md-6">
                <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                        <h4 className="font-size-change">{data[thirdSectionEndpoint]?.message || "Team Statistic"}</h4>
                        {data[thirdSectionEndpoint]?.data?.data?.length > 1 && 
                            data[thirdSectionEndpoint].data.data.slice(1, 2).map((team, index) => (
                                <div className="name-wraper" key={index}>
                                    {team.country && (
                                        <Flag
                                            code={team.country.toUpperCase() || "SI"}
                                            style={{
                                                width: "30px",
                                                height: "20px",
                                                marginRight: "10px",
                                            }}
                                        />
                                    )}
                                    <h6>{team.team_name || "Jumbo-Visma"}</h6>
                                </div>
                            ))
                        }
                    </div>
                    {data[thirdSectionEndpoint]?.data?.data?.length > 1 && 
                        data[thirdSectionEndpoint].data.data.slice(1, 2).map((team, index) => (
                            <h5 key={index}><strong>{team.count || team.value || "4"}</strong></h5>
                        ))
                    }
                    <img src="/images/player3.png" alt="" className="absolute-img" />
                    <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                </div>
            </div>
            <div className="col-lg-5 col-md-6">
                <div className="races">
                    <h5>editie <strong>{selectedYear || "54"}</strong></h5>
                </div>
            </div>
        </div>
    </div>

    {/* Third Row - Team List */}
    <div className="col-lg-5">
        <div className="list-white-cart">
            <h4 className="fs-chenge">{data[thirdSectionEndpoint]?.message || "Top Teams"}</h4>
            <ul>
                {data[thirdSectionEndpoint]?.data?.data?.length > 0 && 
                    data[thirdSectionEndpoint].data.data.slice(0, 5).map((item, index) => (
                        <li key={index}>
                            <strong>{index + 1}.</strong>
                            <div className="name-wraper">
                                {item.country && (
                                    <Flag
                                        code={item.country.toUpperCase() || "BE"} 
                                        style={{
                                            width: "30px",
                                            height: "20px",
                                            marginRight: "10px",
                                        }}
                                    />
                                )}
                                <h6>{item.team_name}</h6>
                            </div>
                            <span>{item.count || item.value}</span>
                        </li>
                    ))
                }
            </ul>
            <img src="/images/player4.png" alt="" className="absolute-img" />
            {data[thirdSectionEndpoint]?.data?.data?.length > 0 && 
                data[thirdSectionEndpoint].data.data.slice(0, 1).map((team, index) => (
                    <h5 key={index}><strong>{team.count || team.value}</strong></h5>
                ))
            }
            <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
        </div>
    </div>
    </>
)}
        </>
    );
};

export default FirstSection;
