import React, { useState, useEffect } from 'react'
import { useMultipleData } from '../../home_api_data'
import Flag from 'react-world-flags'
import { BoxSkeleton, ErrorStats, LoadingStats } from '../../loading&error';

const ThisYearSection = () => {
  // Define possible API endpoints for each section box
  const apiOptions = {
    box1: ["oldestRider","youngestRider"],
    box2: ["mostweightRider","lightestRider"],
    box3: ["mostSecondPlaces"],
    box4: ["mostTop5NoWins"],
    box5Race: ["raceCount"],
    box5GC: ["mostRacingDays"],
    box5Consistent: ["mostConsistentGC","gcPodiums"],
    box6Young: ["oldestMostWins","youngestMostWins"],
    box6Teams: ["stageTop10sRider","gcTop10s"]
  };

  // Set initial static values for server-side rendering to prevent hydration errors
  const [selectedApis, setSelectedApis] = useState({
    box1: apiOptions.box1[0],
    box2: apiOptions.box2[0],
    box3: apiOptions.box3[0],
    box4: apiOptions.box4[0],
    box5Race: apiOptions.box5Race[0],
    box5GC: apiOptions.box5GC[0],
    box5Consistent: apiOptions.box5Consistent[0],
    box6Young: apiOptions.box6Young[0],
    box6Teams: apiOptions.box6Teams[0]
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
      box5Race: getRandomItem(apiOptions.box5Race),
      box5GC: getRandomItem(apiOptions.box5GC),
      box5Consistent: getRandomItem(apiOptions.box5Consistent),
      box6Young: getRandomItem(apiOptions.box6Young),
      box6Teams: getRandomItem(apiOptions.box6Teams)
    });
  }, []); // Run once after initial render
  
  // Create a flat array of all selected API endpoints to fetch
  const endpointsToFetch = Object.values(selectedApis);

  // Fetch data using the selected endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Check if we have all data for every endpoint
  const allDataLoaded = endpointsToFetch.every(endpoint => data[endpoint]);
  
  // Single loading state - only show loading when not all endpoints have data
  const isLoading = !allDataLoaded;
  const showData = allDataLoaded;
  const showError = error && !allDataLoaded;

  return (
    <section className="home-sec2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>dit jaar</h2>
              <a href="#?" className="alle-link">
                Alle statistieken <img src="/images/arow2.svg" alt="" />
              </a>
            </div>
          </div>
          
          {/* Show single loading state until ALL endpoints return data */}
          {isLoading &&
          //  <LoadingStats />
          <BoxSkeleton/>
           }
          
          {/* Show error state only if there's an error and not all data loaded */}
          {showError && <ErrorStats message={error.message} />}
          
          {/* Only show content when not fully loading and either no error or partial success */}
          {showData && (
            <>
              {/* Box 1 - Oldest/Youngest Rider */}
              <div className="col-lg-3 col-md-6 box1">
                <div className="list-white-cart lime-green-cart">
                  {data[selectedApis.box1] && (
                    <>
                      {/* Dynamic heading from API response message */}
                      <h4>{data[selectedApis.box1].message}</h4>
                      {data[selectedApis.box1].data.data
                        .slice(0, 3)
                        .map((rider, index) => (
                          <ul key={index}>
                            <li>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                <Flag
                                  code={rider.rider_country.toUpperCase()}
                                  style={{
                                    width: "30px",
                                    height: "20px",
                                    marginRight: "10px",
                                  }}
                                />
                                <h6>{rider.rider_name}</h6>
                              </div>
                              <span>{rider.age} jaar</span>
                            </li>
                          </ul>
                        ))}
                      <a href="#?" className="white-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Box 2 - Most weight Rider */}
              <div className="col-lg-3 col-md-6 box2">
                {data[selectedApis.box2] && (
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      {/* Dynamic heading from API response message */}
                      <h4>{data[selectedApis.box2].message}</h4>
                      <div className="name-wraper">
                        <Flag
                          code={data[selectedApis.box2].data.data.rider_country.toUpperCase()}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <h6>{data[selectedApis.box2].data.data.name}</h6>
                      </div>
                    </div>
                    <h5>
                      <strong>{data[selectedApis.box2].data.data.weight}</strong> weight
                    </h5>
                    <a href="#?" className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </a>
                  </div>
                )}
              </div>

              {/* Box 3 - Rider With Most SecondPlaces */}
              <div className="col-lg-3 col-md-6 box3">
                {data[selectedApis.box3] && data[selectedApis.box3].data.data
                  .slice(0, 1)
                  .map((rider, index) => (
                    <div className="team-cart" key={index}>
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        {/* Dynamic heading from API response message */}
                        <h4>{data[selectedApis.box3].message}</h4>
                        <div className="name-wraper">
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          <h6>{rider.rider_name}</h6>
                        </div>
                      </div>
                      <h5>
                        <strong>{rider.age}</strong>jaar
                      </h5>
                      <img
                        src="/images/player2.png"
                        alt=""
                        className="absolute-img"
                      />
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  ))}
              </div>

              {/* Box 4 - Rider with Most Top Wins */}
              <div className="col-lg-3 col-md-6 box4">
                {data[selectedApis.box4] && data[selectedApis.box4].data.data
                  .slice(0, 1)
                  .map((rider, index) => (
                    <div className="team-cart" key={index}>
                      <a href="#?" className="pabs"></a>
                      <div className="text-wraper">
                        {/* Dynamic heading from API response message */}
                        <h4>{data[selectedApis.box4].message}</h4>
                        <div className="name-wraper">
                          <Flag
                            code={rider.rider_country.toUpperCase()}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
                          />
                          <h6>{rider.rider_name}</h6>
                        </div>
                      </div>
                      <h5>
                        <strong>{rider.age}</strong>jaar
                      </h5>
                      <a href="#?" className="green-circle-btn">
                        <img src="/images/arow.svg" alt="" />
                      </a>
                    </div>
                  ))}
              </div>

              {/* Box 5 - Combined */}
              <div className="col-lg-7 box5">
                <div className="row">
                  {/* Race Count */}
                  <div className="col-lg-5 col-md-6">
                    {data[selectedApis.box5Race] && (
                      <div className="races">
                        <h5>
                          {/* Dynamic heading from API response message */}
                          {data[selectedApis.box5Race].message}{" "}
                          <strong>{data[selectedApis.box5Race].data.count}</strong>
                        </h5>
                      </div>
                    )}
                  </div>

                  {/* rider with Most racing days */}
                  <div className="col-lg-7 col-md-6">
                    {data[selectedApis.box5GC] && data[selectedApis.box5GC].data.result
                      .slice(0, 1)
                      .map((race, index) => (
                        <div className="team-cart" key={index}>
                          <a href="#?" className="pabs"></a>
                          <div className="text-wraper">
                            {/* Dynamic heading from API response message */}
                            <h4 className="font-size-change">
                              {data[selectedApis.box5GC].message}
                            </h4>
                            <div className="name-wraper">
                              <h6>{race.rider_key}</h6>
                            </div>
                          </div>
                          <h5>
                            <strong>{race.racing_days} </strong>days
                          </h5>
                          <a href="#?" className="green-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </a>
                        </div>
                      ))}
                  </div>

                  {/* Most Consistent GC && podiums GC */}
                  <div className="col-lg-7 col-md-6">
                    {data[selectedApis.box5Consistent] && data[selectedApis.box5Consistent].data.data
                      .slice(0, 1)
                      .map((rider, index) => (
                        <div className="team-cart lime-green-team-cart img-active" key={index}>
                          <a href="#?" className="pabs"></a>
                          <div className="text-wraper">
                            {/* Dynamic heading from API response message */}
                            <h4 className="font-size-change">
                              {data[selectedApis.box5Consistent].message}
                            </h4>
                            <div className="name-wraper">
                              <Flag
                                code={rider.rider_country.toUpperCase()}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />
                              <h6>{rider.rider_name}</h6>
                            </div>
                          </div>
                          <h5>
                            <strong>{rider.age}</strong>
                          </h5>
                          <img
                            src="/images/player3.png"
                            alt=""
                            className="absolute-img"
                          />
                          <a href="#?" className="white-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </a>
                        </div>
                      ))}
                  </div>

                  {/* most Youngest/oldest wins Rider */}
                  <div className="col-lg-5 col-md-6">
                    {data[selectedApis.box6Young] && (
                      <div className="list-white-cart">
                        {/* Dynamic heading from API response message */}
                        <h4>{data[selectedApis.box6Young].message}</h4>
                        {data[selectedApis.box6Young].data.data
                          .slice(0, 3)
                          .map((rider, index) => (
                            <ul key={index}>
                              <li>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper">
                                  <Flag
                                    code={rider.rider_country.toUpperCase()}
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <h6>{rider.rider_name}</h6>
                                </div>
                                <span>{rider.age} jaar</span>
                              </li>
                            </ul>
                          ))}
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Box 6 - top rider && team in GC and stage Stats */}
              <div className="col-lg-5 box6">
                {data[selectedApis.box6Teams] && (
                  <div className="list-white-cart lime-green-cart">
                    {/* Dynamic heading from API response message */}
                    <h4 className="fs-chenge">
                      {data[selectedApis.box6Teams].message}
                    </h4>
                    {data[selectedApis.box6Teams].data.data
                      .slice(0, 5)
                      .map((rider, index) => (
                        <ul key={index}>
                          <li>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                              <Flag 
                                code={rider.rider_country} 
                                style={{
                                  height: "20px",
                                  width: "20px",
                                  marginRight: "10px"
                                }}
                              />
                              <h6>{rider.rider_name}</h6>count:{rider.count}
                            </div>
                            <span>{rider.age} </span>jaar
                          </li>
                        </ul>
                      ))}
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
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ThisYearSection;