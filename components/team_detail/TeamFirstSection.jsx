import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { useRouter } from "next/router";
import { renderFlag } from "../RenderFlag";

const TeamFirstSection = ({ teamId, teamName, teamSlug, filterYear }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "getRiderWithMostWinsInTeamHistory",
    box2: "totalTeamWins",
    box3: "AmountOfRider",
    box4: "getMostClassicWinsForTeam",
    box5: "getLastVictoriesByTeam",
    box6: "totalClassicWinsByTeam",
    box7: "totalGrandTourWinsByTeam",
    box8: "currentUciTeamRanking",
    box9: "last10WinsByTeam",
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
    fixedApis.box9,
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

            {/* Box1:Rider with Most Wins in Team History */}
            <div className="col-lg-3 col-md-6">
              <div className=" list-white-cart team-cart lime-green-team-cart  team-cart-extra">
                <Link href={buildUrlWithParams("rider-with-most-wins-in-team-history")} className="pabs" />
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

                    return (
                      <>
                        <div className="card-content-wraper">
                          <ul>
                            {ridersList
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={rider?.rider_id || index}>
                                  <span>{index + 1}</span>
                                  <div className="name-wraper name-wraper-white">
                                    <Link href={`/riders/${rider?.rider_id}`} className="pabs" />
                                    {renderFlag(rider?.rider_country || rider?.country_code || rider?.country || rider?.nationality)}
                                    <h6 className="clamp-text">
                                      {rider?.rider || rider?.name || "..."}
                                    </h6>
                                  </div>
                                  {rider?.total && <span>{rider.total}</span>}
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="image_link-wraper">
                          <div className="link_box">
                            <Link href={buildUrlWithParams("rider-with-most-wins-in-team-history")} className="white-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </div>
                        </div>

                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box2: Team Total Wins  */}
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <div className="text-wraper text-center">
                  <h3 className="text-uppercase fw-900 font-archivo fs-chenge ">
                    {data?.[fixedApis.box2]?.message}
                  </h3>
                  {(() => {
                    if (!data?.[fixedApis.box2]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box2];
                    const teamData = response?.data?.data || response?.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }
                    return (
                      <div className="name-wraper">
                        <h5 className="fst-italic">
                          <strong>{teamData.total_wins || teamData.totalTeamWins || teamData.wins || 0}</strong>
                        </h5>
                      </div>);
                  })()}
                </div>
              </div>
            </div>

            {/* Box3:Amount of rider   */}

            <div className="col-lg-3 col-md-6 12121">
              <div className="team-cart">
                <Link href={buildUrlWithParams("amount-of-riders")} className="pabs" />
                <div className="text-wraper">
                  <h4 >
                    {data?.[fixedApis.box3]?.message}
                  </h4>

                  {(() => {
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    const teamData = response?.data?.data || response?.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <h5 className="teamcard-number">
                          <strong>{teamData?.total_riders || teamData?.total_rider || 0}</strong>Riders
                        </h5>

                        <Link href={buildUrlWithParams("amount-of-riders")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box4: Rider with Most Classics Wins in Team History  */}

            <div className="col-lg-3 col-md-6">
              <div className="team-cart team-cart-extra">
                <Link href={buildUrlWithParams("rider-with-most-classic-wins-in-team-history")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box4]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box4]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box4];
                    const ridersArray = response?.data?.riders || response?.data?.data?.riders;

                    if (!ridersArray || !Array.isArray(ridersArray) || ridersArray.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    // Get the first rider (the one with most classic wins)
                    const rider = ridersArray[0];

                    // Get image from API or use fallback
                    const riderImage = rider?.image_url || rider?.image || "/images/player6.png";

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderId}`)}>
                          {renderFlag(rider?.riderCountry || rider?.country_code || rider?.country || rider?.flag)}
                          <h6>{rider?.riderName || rider?.rider_name || rider?.name || "..."}</h6>
                        </div>
                        {rider?.totalClassicWins && (
                          <h5>
                            <strong>{rider.totalClassicWins}</strong> wins
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("rider-with-most-classic-wins-in-team-history")} className="green-circle-btn">
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


            <div className="col-lg-7 col-md-12 d-flex flex-column">
              <div className="row flex-grow-1">
                {/* last victory */}
                <div className="col-lg-5 col-md-6 ">
                  <div className="list-white-cart lime-green-cart ctm-card ctm_card_2">
                    <Link href={buildUrlWithParams("last-victories")} className="pabs" />
                    {getBoxData(fixedApis.box5).error ? (
                      <>
                      <h4>
                        {" "}
                        {data?.[fixedApis.box5]?.message}
                      </h4>
                      <div className="no-data-wrap">
                        <ErrorMessage
                          errorType={getBoxData(fixedApis.box5).errorType}
                        />
                      </div>
                      </>
                    ) : (
                      <>
                        <div className="card-content-wraper">
                          <h4>
                            {" "}
                            {data?.[fixedApis.box5]?.message}
                          </h4>
                          <ul>
                            {(Array.isArray(getBoxData(fixedApis.box5)?.data)
                              ? getBoxData(fixedApis.box5)?.data
                              : []
                            )
                              .slice(0, 3)
                              .map((victory, index) => (
                                <li key={index}>
                                  <div className="name-wraper name-wraper-white">
                                    <Link href={`/races/${victory?.race_name}`} className="pabs" />
                                    {renderFlag(victory?.race_country || victory?.country)}
                                    <h6 className="clamp-text">
                                      {victory?.race_name || victory?.race || "..."}{" "}
                                      {victory?.type === "stage" && victory?.stage_number
                                        ? `Stage ${victory.stage_number}`
                                        : ""}
                                    </h6>
                                  </div>


                                </li>
                              ))}
                          </ul>
                        </div>

                        <div className="image_link-wraper">
                          <div className="link_box">
                            <Link href={buildUrlWithParams("last-victories")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>


                {/* ammount of classics wins */}
                <div className="col-lg-7 col-md-6 ">
                  <div className="team-cart lime-green-team-cart img-active">
                    <Link href={buildUrlWithParams("amount-of-classic-wins")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">{data?.[fixedApis.box6]?.message}</h4>
                      {(() => {
                        if (!data?.[fixedApis.box6]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box6];
                        const teamData = response?.data;

                        if (!teamData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const totalClassicWins = teamData?.totalClassicWins || teamData?.total_classic_wins || teamData?.total;

                        return (
                          <>

                            <h5 className="teamcard-number">
                              <strong>{totalClassicWins || 0}</strong>
                            </h5>
                            <Link href={buildUrlWithParams("amount-of-classic-wins")} className="white-circle-btn">
                              <img src="/images/arow.svg" alt="arrow" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* grand tour wins  */}
                <div className="col-lg-7 col-md-6 ">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("grand-tour-wins")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box7]?.message}
                      </h4>

                      {(() => {
                        if (!data?.[fixedApis.box7]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box7];
                        const teamData = response?.data;

                        if (!teamData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const totalGrandTourWins = teamData?.totalGrandTourWins || teamData?.total_GrandTourWins || 0;

                        return (
                          <>
 <h5 className="teamcard-number">
                              <strong>{totalGrandTourWins}</strong>
                              stages
                            </h5>

                            <Link href={buildUrlWithParams("grand-tour-wins")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* current uci team ranking */}
                <div className="col-lg-5 col-md-6 ">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("current-uci-team-ranking")} className="pabs" />
                    <div className="text-wraper">
                      <h4 >
                        {data?.[fixedApis.box8]?.message}
                      </h4>

                      {(() => {
                        if (!data?.[fixedApis.box8]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box8];
                        const teamData = response?.data;

                        if (!teamData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const totalPoints = teamData?.uci_ranking?.total_points
                        const currentRanking = teamData?.uci_ranking?.ranking

                        return (
                          <>
                            <div className="name-wraper name-wraper-white name-left">
                              <h6>{totalPoints} points</h6>
                            </div>

                            {currentRanking && (
                              <h5>
                                <strong>{currentRanking}</strong> Rank
                              </h5>
                            )}

                            <Link href={buildUrlWithParams("current-uci-team-ranking")} className="green-circle-btn">
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



            {/* Last ten wins */}
            <div className="col-lg-5 col-md-12">
              <div className="list-white-cart lime-green-cart ctm-card">
             
                <Link href={buildUrlWithParams("last-5-wins")} className="pabs" />
                {getBoxData(fixedApis.box9).error ? (
                  <>
                  <h4 className="fs-chenge">
                  {" "}
                  {data?.[fixedApis.box9]?.message}
                </h4>
                   <div className="no-data-wrap">
                   <ErrorMessage
                     errorType={getBoxData(fixedApis.box2).errorType}
                   />
                 </div>
                 </>
                ) : (
                  <>
                    <div className="card-content-wraper">
                    <h4 className="fs-chenge">
                        {" "}
                        {data?.[fixedApis.box9]?.message}
                      </h4>
                      <ul className="wins-team-list">
                        {(Array.isArray(getBoxData(fixedApis.box9).data)
                          ? getBoxData(fixedApis.box9).data
                          : []
                        )
                          .slice(0, 5)
                          .map((win, index) => (
                            <li key={index}>
                              <span>{index + 1}</span>
                              <Link href={`/races/${win?.race_name}`}>
                                <div className="name-wraper name-wraper-white">
                                  {renderFlag(win?.race_country || win?.country)}
                                  <h6>
                                    {win?.race_name || win?.race || "..."}{" "}
                                    {win?.type === "stage" && win?.stage_number
                                      ? `Stage ${win.stage_number}`
                                      : ""}
                                  </h6>
                                </div>
                              </Link>

                              {win?.year && <span>{win.year}</span>}
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
                        <Link href={buildUrlWithParams("last-5-wins")} className="glob-btn">
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

          </>
        )}
      </div>
    </div>
  );
};

export default TeamFirstSection;
