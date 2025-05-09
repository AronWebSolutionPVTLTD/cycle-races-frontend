import React, { useState, useEffect } from "react";
import { useMultipleData } from "@/components/home_api_data";
import Flag from "react-world-flags";
import { ErrorStats, LoadingStats } from "../home/sections/loading&error";

export const FirstSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  const firstSectionEndpoints = ["oldestRider", "youngestRider"];
  const secondSectionEndpoints = ["oldestMostWins", "youngestMostWins"];
  const thirdSectionEndpoints = ["top3GCTeam", "topGCRiderbyTeam"];
  const fourthSectionEndpoints = ["getMostConsistentGCTeams"];
  const fifthSectionEndpoints = ["topStageRiderbyTeam", "top3StageTeam"];
  const sixSectionEndpoints = ["mostDNFs"];
  const lastSectionEndpoints = ["top10Stageteams"];
  

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
  const [sixSectionEndpoint, setSixSectionEndpoint] = useState(
    sixSectionEndpoints[0]
  );
  const [lastSectionEndpoint, setLastSectionEndpoint] = useState(
    lastSectionEndpoints[0]
  );

  const [isMounted, setIsMounted] = useState(false);

  const getRandomEndpoint = (endpointArray) => {
    const randomIndex = Math.floor(Math.random() * endpointArray.length);
    return endpointArray[randomIndex];
  };

  useEffect(() => {
    // Set mounted flag to true
    setIsMounted(true);

    try {
      // Get random endpoints for each section
      const randomFirstEndpoint = getRandomEndpoint(firstSectionEndpoints);
      const randomSecondEndpoint = getRandomEndpoint(secondSectionEndpoints);
      const randomThirdEndpoint = getRandomEndpoint(thirdSectionEndpoints);
      const randomFourthEndpoint = getRandomEndpoint(fourthSectionEndpoints);
      const randomFifthEndpoint = getRandomEndpoint(fifthSectionEndpoints);
      const randomSixEndpoint = getRandomEndpoint(sixSectionEndpoints);
      const randomLastEndpoint = getRandomEndpoint(lastSectionEndpoints);
      // Update state with the randomly selected endpoints
      setFirstSectionEndpoint(randomFirstEndpoint);
      setSecondSectionEndpoint(randomSecondEndpoint);
      setThirdSectionEndpoint(randomThirdEndpoint);
      setFourthSectionEndpoint(randomFourthEndpoint);
      setFifthSectionEndpoint(randomFifthEndpoint);
      setSixSectionEndpoint(randomSixEndpoint);
      setLastSectionEndpoint(randomLastEndpoint)
    } catch (err) {
      console.error("Error selecting random endpoints:", err);
    }
  }, []);

  const buildQueryParams = () => {
    let params = {};

    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;

    return params;
  };

  const endpointsToFetch = [
    firstSectionEndpoint,
    secondSectionEndpoint,
    thirdSectionEndpoint,
    fourthSectionEndpoint,
    fifthSectionEndpoint,
    sixSectionEndpoint,
    lastSectionEndpoint
  ];

  const { data, loading, error, partialSuccess } = useMultipleData(
    endpointsToFetch,
    buildQueryParams()
  );

  // Helper function to check if an endpoint has valid data
  const hasValidData = (endpoint) => {
    return (
      data &&
      data[endpoint] &&
      data[endpoint].data &&
      data[endpoint].data.data &&
      data[endpoint].data.data.length > 0
    );
  };

  // Helper function to check if an endpoint has an error
  const hasEndpointError = (endpoint) => {
    return (
      error && error.failedEndpoints && error.failedEndpoints.includes(endpoint)
    );
  };

  // Helper function to determine if we should show a specific card
  const shouldShowCard = (endpoint) => {
    // Don't show the card if:
    // 1. There's an error with this endpoint or
    // 2. There's no valid data for this endpoint
    if (hasEndpointError(endpoint)) return false;
    if (!hasValidData(endpoint)) return false;

    // Show card if it has valid data
    return true;
  };

  // Check if ANY endpoint has data loading
  const isLoading = loading;

  // Check if there was an error and NO data was loaded successfully
  const showFullError = error && !partialSuccess;

  // Check if we should show partial data warning (some endpoints failed but others succeeded)
  const showPartialWarning =
    partialSuccess ||
    (error &&
      error.failedEndpoints &&
      endpointsToFetch.some(
        (endpoint) =>
          !error.failedEndpoints.includes(endpoint) && hasValidData(endpoint)
      ));

  const PartialDataWarning = () => (
    <div className="warning-banner w-100 p-3 alert alert-warning">
      <p className="mb-1">
        Some data couldn't be loaded. Displaying available information.
      </p>
      {error && error.failedEndpoints && (
        <details>
          <summary className="cursor-pointer">View details</summary>
          <p className="mt-2 mb-0">
            Failed to load: {error.failedEndpoints.join(", ")}
          </p>
          <p className="mb-0">Try refreshing for new random endpoints.</p>
        </details>
      )}
    </div>
  );

  return (
    <>
      {showPartialWarning && <PartialDataWarning />}

      {isLoading && (
        <div className="col-12">
          <LoadingStats />
        </div>
      )}

      {showFullError && (
        <div className="col-12">
          <ErrorStats message={error.message} />
        </div>
      )}

      {!isLoading && (
        <>
          {/* First Card */}
          {shouldShowCard(firstSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data[firstSectionEndpoint]?.message || "Rider Stat"}</h4>
                  {data[firstSectionEndpoint].data.data
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div className="name-wraper" key={index}>
                        {rider.rider_country && (
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{rider.rider_name}</h6>
                      </div>
                    ))}
                </div>
                {data[firstSectionEndpoint].data.data
                  .slice(0, 1)
                  .map((rider, index) => (
                    <h5 key={index}>
                      <strong>{rider.value || rider.age}</strong>
                      {rider.unit || " jaar"}
                    </h5>
                  ))}
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Year Card - Always show this if we're displaying data */}
          {!isLoading && (
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <h5>
                  year <strong>{selectedYear || "1913"}</strong>
                </h5>
              </div>
            </div>
          )}

          {/* Second Card */}
          {shouldShowCard(secondSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data[secondSectionEndpoint]?.message || "Race Stat"}</h4>
                  {data[secondSectionEndpoint].data.data
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div className="name-wraper" key={index}>
                        {rider.rider_country && (
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{rider.rider_name}</h6>
                      </div>
                    ))}
                </div>
                {data[secondSectionEndpoint].data.data
                  .slice(0, 1)
                  .map((rider, index) => (
                    <h5 key={index}>
                      <strong>{rider.count || rider.value}</strong>
                    </h5>
                  ))}
                <img
                  src="/images/player2.png"
                  alt=""
                  className="absolute-img"
                />
                <a href="#?" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* Third Card */}
          {shouldShowCard(thirdSectionEndpoint) && (
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data[thirdSectionEndpoint]?.message || "Team Stat"}</h4>
                  {data[thirdSectionEndpoint].data.data
                    .slice(0, 1)
                    .map((team, index) => (
                      <div className="name-wraper" key={index}>
                        {team.country && (
                          <Flag
                            code={team.country.toUpperCase() || "N/A"}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <h6>{team.team_name}</h6>
                      </div>
                    ))}
                </div>
                {data[thirdSectionEndpoint].data.data
                  .slice(0, 1)
                  .map((team, index) => (
                    <h5 key={index}>
                      <strong>{team.rank || team.value}</strong>rank
                    </h5>
                  ))}

                <a href="#?" className="white-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            </div>
          )}

          {/* {shouldShowCard(fifthSectionEndpoint) && (
  <div className="col-lg-3 col-md-6">
    <div className="team-cart lime-green-team-cart">
      <a href="#?" className="pabs"></a>
      <div className="text-wraper">
        <h4>{data[fifthSectionEndpoint]?.message || "team top in stages"}</h4>
        
       
        {fifthSectionEndpoint === "topStageRiderbyTeam" ? (
         
          data[fifthSectionEndpoint]?.data?.data?.slice(0, 1).map((team, index) => (
            <div className="name-wraper" key={index}>
              <Flag
                code={(team.rider_country || "NA").toUpperCase()}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
              />
              <h6>{team.team_name}</h6>
            </div>
          ))
        ) : fifthSectionEndpoint === "top3StageTeam" ? (
   
          data[fifthSectionEndpoint]?.teams?.slice(0, 1).map((team, index) => (
            <div className="name-wraper" key={index}>
              <Flag
                code={(team.country || "NA").toUpperCase()}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
              />
              <h6>{team.name}</h6>
            </div>
          ))
        ) : null}
      </div>
      

      {fifthSectionEndpoint === "topStageRiderbyTeam" ? (
        data[fifthSectionEndpoint]?.data?.data?.slice(0, 1).map((team, index) => (
          <h5 key={index}><strong>{team.time}</strong></h5>
        ))
      ) : fifthSectionEndpoint === "top3StageTeam" ? (
        data[fifthSectionEndpoint]?.teams?.slice(0, 1).map((team, index) => (
          <h5 key={index}><strong>{team.score || team.time}</strong></h5>
        ))
      ) : null}
      
      <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
    </div>
  </div>
)} */}
          <div className="col-lg-7">
            <div className="row">
              {/* Fourth Card */}
              {shouldShowCard(fourthSectionEndpoint) && (
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data[fourthSectionEndpoint]?.message ||
                          "most consistent team"}
                      </h4>
                      {data[fourthSectionEndpoint].data.data
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <h6>{team.team_name}</h6>
                          </div>
                        ))}
                    </div>
                    {data[fourthSectionEndpoint].data.data
                      .slice(0, 1)
                      .map((team, index) => (
                        <h5 key={index}>
                          <strong>{team.totalPoints}</strong>
                          points
                        </h5>
                      ))}
                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}

              {/* Fifth Card */}
              {shouldShowCard(fifthSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart lime-green-team-cart img-active">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data[fifthSectionEndpoint]?.message ||
                          "team top in stages"}
                      </h4>
                      {data[fifthSectionEndpoint].data.data
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <h6>{team.team_name}</h6>
                          </div>
                        ))}
                    </div>
                    {data[fifthSectionEndpoint].data.data
                      .slice(0, 1)
                      .map((team, index) => (
                        <h5 key={index}>
                          <strong>{team.time}</strong>
                        </h5>
                      ))}

                    <a href="#?" className="white-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}

              {/* sixth Card */}
              {shouldShowCard(sixSectionEndpoint) && (
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data[sixSectionEndpoint]?.message || "most dnf"}
                      </h4>
                      {data[sixSectionEndpoint].data.data
                        .slice(0, 1)
                        .map((team, index) => (
                          <div className="name-wraper" key={index}>
                            <Flag
                              code={team.flag.toUpperCase()}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "10px",
                              }}
                            />
                            <h6>{team.team_name}</h6>
                          </div>
                        ))}
                    </div>

                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}
                     {/* seventh Card */}
              <div className="col-lg-5 col-md-6">
                <div className="races">
                  <h5>
                    editie <strong>54</strong>
                  </h5>
                </div>
              </div>
            </div>
          </div>

                {/* last Card */}
                {shouldShowCard(lastSectionEndpoint) && (
                <div className="col-lg-5">
                    <div className="list-white-cart">
                    <h4 className="font-size-change">
                        {data[lastSectionEndpoint]?.message || "top 10 stages"}
                      </h4>
                      {data[lastSectionEndpoint].data.data
                        .slice(0, 5)
                        .map((team, index) => (
                        <ul>
                            <li>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper">
                                
                                    <h6>{team.team_name}</h6>
                                </div>
                                <span>{team.rank} rank</span>
                            </li>
                           
                        </ul>
                        ))}
                        <img src="/images/player4.png" alt=""  className="absolute-img" />
                       
                        <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
                    </div>
                    </div>
                )}
        </>
      )}
    </>
  );
};

export default FirstSection;
