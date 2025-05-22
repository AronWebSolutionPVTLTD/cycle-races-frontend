import React, { useState, useEffect } from "react";
import { useMultipleData } from "../../home_api_data";
import Flag from "react-world-flags";
import { BoxSkeleton, ErrorStats } from "../../loading&error";

const TeamsSection = () => {
  // Define possible API endpoints for each section box
  const apiOptions = {
    // box1: ["bestClassics", "bestCountryRanking"],
    box1: ["bestClassics"],
    box2: ["grandTourstageWin"],
    box3: ["top3teamwithrank1", "top3StageTeam"],
    box4: ["getMostConsistentGCTeams"],
    box5: ["top3GCTeam", "riderWithBirthday"],
    box6: ["DnfTeams"],
    box7: ["racesMOstRiderfromSameTeam"],
  };

  // Set initial static values for server-side rendering
  const [selectedApis, setSelectedApis] = useState({
    box1: apiOptions.box1[0],
    box2: apiOptions.box2[0],
    box3: apiOptions.box3[0],
    box4: apiOptions.box4[0],
    box5: apiOptions.box5[0],
    box6: apiOptions.box6[0],
    box7: apiOptions.box7[0],
  });

  // Client-side randomization after hydration
  useEffect(() => {
    // Function to get a random item from an array
    const getRandomItem = (array) => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    };

    // Update state with random selection for each section
    setSelectedApis({
      box1: getRandomItem(apiOptions.box1),
      box2: getRandomItem(apiOptions.box2),
      box3: getRandomItem(apiOptions.box3),
      box4: getRandomItem(apiOptions.box4),
      box5: getRandomItem(apiOptions.box5),
      box6: getRandomItem(apiOptions.box6),
      box7: getRandomItem(apiOptions.box7),
    });
  }, []); // Run once after initial render

  // Create a flat array of all selected API endpoints to fetch
  const endpointsToFetch = Object.values(selectedApis);

  // Fetch data using the selected endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Check if we have all data for every endpoint
  const allDataLoaded = endpointsToFetch.every((endpoint) => data[endpoint]);

  // Single loading state - only show loading when not all endpoints have data
  const isLoading = !allDataLoaded;
  const showData = allDataLoaded;
  const showError = error && !allDataLoaded;

  return (
    <section className="home-sec5">
      <div className="container">
        <div className="row">
          {/* Show single loading state until ALL endpoints return data */}
          {isLoading && <BoxSkeleton />}

          {/* Show error state only if there's an error and not all data loaded */}
          {showError && <ErrorStats message={error.message} />}

          {/* Only show content when all data is loaded */}
          {showData && (
            <>
              {/* Best Classics Section */}
              <div className="col-lg-4 col-md-6">
                {data[selectedApis.box1].data.data
                  .slice(0, 1)
                  .map((rider, index) => (
                    <div className="team-cart" key={index}>
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">
                          {data[selectedApis.box1].message}
                        </h4>

                        <div className="name-wraper">
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              height: "30px",
                              width: "20px",
                              marginRight: "10px",
                            }}
                          />
                          <h6>{rider.rider_name}</h6>
                        </div>
                      </div>
                      <h5>
                        {rider.wins && (
                          <>
                            <strong>{rider.wins}</strong>wins
                          </>
                        )}
                      </h5>
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  ))}
              </div>

              {/* Grand Tour Stage Win Section */}
              <div className="col-lg-4 col-md-6">
                {data[selectedApis.box2].data.data
                  .slice(0, 1)
                  .map((rider, index) => (
                    <div
                      className="team-cart lime-green-team-cart img-active"
                      key={index}
                    >
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4 className="font-size-change">
                          {data[selectedApis.box2].message}
                        </h4>
                        <div className="name-wraper">
                          <Flag
                            code={rider.rider_country}
                            style={{
                              height: "20px",
                              width: "20px",
                              marginRight: "10px",
                            }}
                          />
                          <h6>{rider.rider_name}</h6>
                        </div>
                      </div>
                      <h5>
                        {rider.wins && (
                          <>
                            <strong>{rider.wins}</strong>wins
                          </>
                        )}
                      </h5>
                      <a href="#?" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  ))}
              </div>

              {/* Top 3 Teams with Rank 1 && Top 3 Team in Stages*/}

              <div className="col-lg-4 col-md-6">
                <div className="list-white-cart">
                  <h4>{data[selectedApis.box3].message}</h4>
                  <ul>
                    {selectedApis.box3 === "top3teamwithrank1" &&
                      data[selectedApis.box3].data.data.stageResults.map(
                        (team, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              {team.wins && team.wins.length > 0 && (
                                <Flag
                                  code={team.wins[0].country.toUpperCase()}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "10px",
                                  }}
                                />
                              )}
                              <h6>{team.teamName}</h6>
                            </div>
                          </li>
                        )
                      )}
                  </ul>

                  <ul>
                    {selectedApis.box3 === "top3StageTeam" &&
                      data[selectedApis.box3].data.data
                        .slice(0, 3)
                        .map((team, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <Flag
                                code={team.rider_country}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />
                              <h6>{team.team_name}</h6>
                            </div>
                            {team.count && <span>{team.count} count</span>}
                          </li>
                        ))}
                  </ul>

                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* most Consistent GCTeams*/}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4 className="font-size-change">
                    {data[selectedApis.box4].message}
                  </h4>

                  <ul>
                    {data[selectedApis.box4].data.data
                      .slice(0, 3)
                      .map((team, index) => (
                        <li key={index}>
                          <strong>{index + 1}</strong>
                          <div className="name-wraper">
                            <h6>{team.team_name || "..."}</h6>
                          </div>
                          {team.totalPoints && (
                            <span>{team.totalPoints} points</span>
                          )}
                        </li>
                      ))}
                  </ul>

                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* Top GC Rider by Team & birthaday */}

              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data[selectedApis.box5].message || "Top GC Riders"}</h4>
                  {/* If top3GCTeam is selected */}
                  <ul>
                    {selectedApis.box5 === "top3GCTeam" &&
                      data[selectedApis.box5].data.data
                        .slice(0, 3)
                        .map((team, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <Flag
                                code={team.rider_country.toUpperCase()}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />
                              <h6>{team.team_name}</h6>
                            </div>
                            {team.count && <span>{team.count} count</span>}
                          </li>
                        ))}
                  </ul>

                  {/* If riderWithBirthday is selected */}
                  <ul>
                    {selectedApis.box5 === "riderWithBirthday" &&
                      data[selectedApis.box5].data.riders
                        .slice(0, 3)
                        .map((rider, index) => {
                          const birthDate = new Date(rider.original_dob);
                          const today = new Date();

                          // Calculate age
                          let age =
                            today.getFullYear() - birthDate.getFullYear();
                          const monthDiff =
                            today.getMonth() - birthDate.getMonth();

                          // Adjust age if birthday hasn't occurred this year
                          if (
                            monthDiff < 0 ||
                            (monthDiff === 0 &&
                              today.getDate() < birthDate.getDate())
                          ) {
                            age--;
                          }

                          return (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                <h6>{rider.name}</h6>
                              </div>
                              <span>Age: {age} years</span>
                            </li>
                          );
                        })}
                  </ul>

                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* Team with Only DNF */}
              <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
            
                    <h4>{data[selectedApis.box6].message}</h4>
                    <ul>
  {  data[selectedApis.box6].data.data?.slice(0, 5).map(
                        (team, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                                  <Flag
                            code={team.flag}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                             <h6>{team.team_name}</h6>
                            </div>
                          </li>
                        )
                      )}
                      </ul>
                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* Races with Most Riders from Same Team */}
              <div className="col-lg-3 col-md-6">
                {(() => {
                  const raceData = data[selectedApis.box7].data.data;
                  const title = data[selectedApis.box7].message;

                  return (
                    <div className="team-cart lime-green-team-cart class-for-mobil">
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        <h4>{title}</h4>
                        <div className="name-wraper">
                          {raceData.country_code && (
                            <Flag
                              code={raceData.country_code.toUpperCase()}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "10px",
                              }}
                            />
                          )}
                          <h6>{raceData.race_name || "N/A"}</h6>
                        </div>
                        {raceData.team_name && (
                          <div className="name-wraper">
                            <h6>Team: {raceData.team_name}</h6>
                          </div>
                        )}
                        {raceData.year && (
                          <div className="name-wraper">
                            <h6>Year: {raceData.year}</h6>
                          </div>
                        )}
                      </div>
                      <h5>
                        <strong>{raceData.rider_count || 0}</strong> rider count
                      </h5>
                      <a href="#?" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;
