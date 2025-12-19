import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { useRouter } from "next/router";
import Flag from "react-world-flags";

const renderFlag = (code) => {
  if (!code || typeof code !== 'string') {
    return <div style={{ width: "30px", height: "20px", marginRight: "10px", backgroundColor: "#f0f0f0" }} />;
  }

  try {
    return (
      <Flag
        code={code.toUpperCase()}
        style={{ width: "20px", height: "20px", marginRight: "0", borderRadius: "2px" }}
      />
    );
  } catch (err) {
    console.warn(`Error rendering flag for code: ${code}`, err);
    return <div style={{ width: "30px", height: "20px", marginRight: "10px", backgroundColor: "#f0f0f0" }} />;
  }
};

const TeamSecondSection = ({ teamId, teamName, teamSlug, filterYear }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "oldestRiderUnderContract",
    box2: "bestMonumentResultsOfTeam",
    box3: "RiderWithLongestTeam",
    box4: "getTeamStartYear",
    box5: "last10PoduimsSpots",
    box6:"ridersWithMostRaces",
    box7:"youngestRiderUnderContract",
    box8:"MostSuccessfulRaces",
    box9:"DifferentNationalities"
  };

  const buildQueryParams = () => {

    let params = {};
    if (filterYear && filterYear !== "All-time") {
      params.year = filterYear;
    }
    return params;
  };

  const buildUrlWithParams = (statsPath) => {

    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    // For URL paths, use the slug as-is (Next.js router handles it)
    // But for API calls, we need to encode it
    const slugForUrl = teamSlug || (teamName ? teamName : teamId);
    const basePath = `/teams/${slugForUrl}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const teamEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    fixedApis.box3,
    fixedApis.box4,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box7,
    fixedApis.box8,
    fixedApis.box9

  ];


  const endpointsMappings = {};

  const rawTeamIdentifier = teamSlug || teamName;
  const teamIdentifier = rawTeamIdentifier ? encodeURIComponent(rawTeamIdentifier) : null;

  if (teamIdentifier) {
    teamEndpoints.forEach(endpoint => {
      endpointsMappings[endpoint] = `/teamDetails/${teamIdentifier}/${endpoint}`;
    });
  }

  const { data, loading, error } = useMultipleData(teamEndpoints, {
    id: teamId,
    name: teamName,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "team",
  });

  const getBoxData = (endpoint) => {

    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.podiums, // Direct access (API returns podiums at root level)
      response?.data?.podiums,
      response?.data?.best_monument_results,
      response?.data?.wins,
      response?.data?.last_victories,
      response?.data?.most_wins,
      response?.data?.data?.best_monument_results,
      response?.data?.data?.years,
      response?.data?.data?.wins_per_season,
      response?.data?.data,
      response?.data,
      response?.data?.riders,
      response,
      response?.data?.data?.raceData,
    ];

    for (const path of paths) {
      if (Array.isArray(path) && path.length > 0) {
        return { data: path, error: false };
      }
    }

    return { error: true, errorType: "no_data_found" };
  };

  return (
    <div className="col-12">
      <div className="row"
      // style={{ marginBottom: "30px" }}
      >
        {loading && <BoxSkeleton />}

        {/* Show global error if all data failed */}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load team statistics. Please try again later." />
        )}

        {!loading && !(error && Object.keys(data || {}).length === 0) && (
          <>


            {/* Box1: oldest rider under contract  */}

            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active team-cart-extra">
                <Link href={buildUrlWithParams("oldest-rider-under-contract")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box1]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box1]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box1];
                    const ridersList = response?.data?.list || response?.data?.data?.list || response?.data?.data || response?.data;

                    if (!ridersList || (Array.isArray(ridersList) && ridersList.length === 0)) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    // Handle both array and single object responses
                    const rider = Array.isArray(ridersList) ? ridersList[0] : ridersList;

                    // Get image from API or use fallback
                    const riderImage = rider?.image_url || rider?.image || "/images/player6.png";

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                          {renderFlag(rider?.nationality || rider?.country || rider?.flag)}
                          <h6>{rider?.rider || rider?.rider_name || rider?.riderName || rider?.name || "..."}</h6>
                        </div>
                        {(rider?.age) && (
                          <h5 className="teamcard-number">
                            <strong>{rider.age}</strong> Years
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("oldest-rider-under-contract")} className="white-circle-btn ">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                        <div className="image_link-wraper team-card-img">
                          <img
                            src={riderImage}
                            alt={rider?.rider || rider?.rider_name || rider?.riderName || rider?.name || "Rider"}
                            className="absolute-img"
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>


            {/* best monument results of team */}
            <div className="col-lg-3 col-md-6 ">
              <div className="list-white-cart lime-green-cart ctm-card ctm_card_2">
                <Link href={buildUrlWithParams("best-monuments-results")} className="pabs" />
                {getBoxData(fixedApis.box2).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box2).errorType}
                  />
                ) : (
                  <>
                    <div className="card-content-wraper">
                      <h4>
                        {" "}
                        {data?.[fixedApis.box2]?.message}
                      </h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box2)?.data)
                          ? getBoxData(fixedApis.box2)?.data
                          : []
                        )
                          .slice(0, 3)
                          .map((victory, index) => (
                            <li key={index}>
                              <div className="name-wraper name-wraper-white">
                                <Link href={`/race-result/${victory?.race}`} className="pabs" />
                                {renderFlag(victory?.country)}
                                <h6 className="clamp-text">
                                  {victory?.race || "..."}
                                </h6>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="image_link-wraper">
                      <div className="link_box">
                        <Link href={buildUrlWithParams("best-monument-results")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>


            {/* RiderWithLongestTeam */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart team-cart-extra">
                <Link href={buildUrlWithParams("rider-longest-with-the-team")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box3]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    // The API returns data as an array directly in response.data
                    const ridersArray = response?.data || response?.data?.data || response?.data?.riders;

                    if (!ridersArray || !Array.isArray(ridersArray) || ridersArray.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    // Get the first rider (the one with longest team tenure)
                    const rider = ridersArray[0];

                    // Get image from API or use fallback
                    const riderImage = rider?.image_url || rider?.image || "/images/player6.png";

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                          {renderFlag(rider?.riderCountry || rider?.country_code || rider?.country || rider?.flag)}
                          <h6>{rider?.riderName || rider?.rider_name || rider?.name || "..."}</h6>
                        </div>
                        {rider?.yearsWithTeam && (
                          <h5>
                            <strong>{rider.yearsWithTeam}</strong> YEARS
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("rider-longest-with-the-team")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                        <div className="image_link-wraper team-card-img">
                          <img
                            src={riderImage}
                            alt={rider?.riderName || rider?.rider_name || "Rider"}
                            className="absolute-img"
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>


            {/* since  */}
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <div className="text-wraper text-center">
                  <h3 className="text-uppercase fw-900 font-archivo fs-chenge ">
                    {data?.[fixedApis.box4]?.message}
                  </h3>
                  {(() => {
                    if (!data?.[fixedApis.box4]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box4];
                    const teamData = response?.data?.data || response?.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }
                    return (
                      <div className="name-wraper">
                        <h5 className="fst-italic">
                          <strong>{teamData.started_in || 0}</strong>
                        </h5>
                      </div>);
                  })()}
                </div>
              </div>
            </div>


            {/* last10PoduimsSpots */}
            <div className="col-lg-5 col-md-12">
              <div className="list-white-cart lime-green-cart ctm-card">
                <Link href={buildUrlWithParams("last-5-podium-spots")} className="pabs" />
                {getBoxData(fixedApis.box5).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box5).errorType}
                  />
                ) : (
                  <>
                    <div className="card-content-wraper">
                      <h4 className="fs-chenge">
                        {" "}
                        {data?.[fixedApis.box5]?.message}
                      </h4>
                      <ul className="wins-team-list">
                        {(Array.isArray(getBoxData(fixedApis.box5).data)
                          ? getBoxData(fixedApis.box5).data
                          : []
                        )
                          .slice(0, 5)
                          .map((podium, index) => (
                            <li key={index}>
                              <span>{index + 1}</span>
                              <Link href={`/races/${podium?.race_name}`}>
                                <div className="name-wraper name-wraper-white">
                                  {renderFlag(podium?.race_country || podium?.country)}
                                  <h6>
                                    {podium?.race_name || podium?.race || "..."}{" "}
                                    {podium?.stage_number
                                      ? `:Stage ${podium.stage_number}`
                                      : ""}
                                  </h6>
                                </div>
                              </Link>

                              {podium?.race_year && <span>{podium.race_year}</span>}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="image_link-wraper">
                      <img
                        src="/images/player6.png"
                        alt=""
                        className="absolute-img"
                      />
                      <div className="link_box">
                        <Link href={buildUrlWithParams("last-5-podium-spots")} className="glob-btn">
                          <strong>volledige stats</strong>{" "}
                          <span>
                            <img src="/images/arow.svg" alt="" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

{/* all 4 cards   */}
            <div className="col-lg-7 col-md-12 d-flex flex-column">
              <div className="row flex-grow-1">

                {/* rider with most races  */}
                <div className="col-lg-7 col-md-6 ">
                  <div className="team-cart lime-green-team-cart img-active team-cart-extra">
                    <Link href={buildUrlWithParams("rider-with-most-races")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box6]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box6]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box6];
                        const ridersArray = response?.data?.riders || response?.data?.data?.riders;

                        if (!ridersArray || !Array.isArray(ridersArray) || ridersArray.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const rider = ridersArray[0];

                        
                        const riderImage = rider?.image_url || rider?.image || "/images/player6.png";

                        return (
                          <>
                            <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                              {renderFlag(rider?.nationality || rider?.country_code || rider?.country || rider?.flag)}
                              <h6>{rider?.name || rider?.rider_name || rider?.riderName || "..."}</h6>
                            </div>
                            {rider?.total_races && (
                              <h5 className="teamcard-number">
                                <strong>{rider.total_races}</strong> RACES
                              </h5>
                            )}
                            <Link href={buildUrlWithParams("rider-with-most-races")} className="white-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                            <div className="image_link-wraper team-card-img">
                              <img
                                src={riderImage}
                                alt={rider?.name || rider?.rider_name || "Rider"}
                                className="absolute-img"
                              />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>


                {/* youngest rider under contract  */}
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart img-active team-cart-extra">
                    <Link href={buildUrlWithParams("youngest-rider-under-contract")} className="pabs" />
                    <div className="text-wraper">
                      <h4>
                        {data?.[fixedApis.box7]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box7]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box7];
                        const ridersList = response?.data || response?.data?.data || response?.data?.list;

                        if (!ridersList || (Array.isArray(ridersList) && ridersList.length === 0)) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }
                        const rider = Array.isArray(ridersList) ? ridersList[0] : ridersList;

                        const riderImage = rider?.image_url || rider?.image || "/images/player6.png";

                        return (
                          <>
                            <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                              {renderFlag(rider?.nationality || rider?.country_code || rider?.country || rider?.flag)}
                              <h6>{rider?.name || rider?.rider_name || rider?.riderName || "..."}</h6>
                            </div>
                            {rider?.age && (
                              <h5 className="teamcard-number">
                                <strong>{rider.age}</strong> YEARS
                              </h5>
                            )}
                            <Link href={buildUrlWithParams("youngest-rider-under-contract")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                            <div className="image_link-wraper team-card-img">
                              <img
                                src={riderImage}
                                alt={rider?.name || rider?.rider_name || rider?.riderName || "Rider"}
                                className="absolute-img"
                              />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>


                {/* Most successfull race */}
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("most-successful-race")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box8]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box8]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box8];
                        const allRaceVictories = response?.data?.all_race_victories || response?.data?.data?.all_race_victories;

                        if (!allRaceVictories || !Array.isArray(allRaceVictories) || allRaceVictories.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        // Get the first race (most successful - highest total_wins)
                        const mostSuccessfulRace = allRaceVictories[0];
                        
                        // Get country code from first year for flag
                        const countryCode = mostSuccessfulRace?.years?.[0]?.country_code || mostSuccessfulRace?.country_code;

                        return (
                          <>
                            <div className="name-wraper name-wraper-white name-left widthset" onClick={() => router.push(`/races/${mostSuccessfulRace?.race_name}`)}>
                              {renderFlag(countryCode)}
                              <h6>{mostSuccessfulRace?.race_name || "..."}</h6>
                            </div>
                            {mostSuccessfulRace?.total_wins && (
                              <h5 className="teamcard-number">
                                <strong>{mostSuccessfulRace.total_wins}</strong> WINS
                              </h5>
                            )}
                            <Link href={buildUrlWithParams("most-successful-race")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="arrow" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>


                {/* Different Nationalities*/}
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart number_btm">
                    <div className="text-wraper">
                      <h4>
                        {data?.[fixedApis.box9]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box9]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box9];
                        const teamData = response?.data;

                        if (!teamData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const totalNationalities = teamData?.total_different_nationality_riders || 0;

                        return (
                          <>
                            <h5 className="fst-italic">
                              <strong>{totalNationalities}</strong>
                            </h5>
                            <Link href={buildUrlWithParams("different-nationalities")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamSecondSection;
