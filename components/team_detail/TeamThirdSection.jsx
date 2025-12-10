import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import { useRouter } from "next/router";
const TeamThirdSection = ({ teamId, filterYear }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "getGrandToursRidden",
    box2: "getRiderLastVictorOneData",
    box3: "getRiderMostRacedCountry",
    box4: "getBestStageResult",
    box5: "getGrandTourDNFs",
    box6: "getFirstRankInGrandTours",
    box7: "getFirstEverGrandTourWin",
    box8: "getTotalRacingDaysInGrandTours",
    box9: "getTotalDistanceRacedInGrandTours",
    box10: "getBestMonumentResults",
    box11: "getBestParisRoubaixResult",
    box12: "getFirstRankInMonuments",
    box13: "getBestGCResult",
    box14: "teamMates",
    box15: "getRiderLastPlaceFinishes",
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

    const basePath = `/teams/${teamId}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const raceEndpoints = [
    fixedApis.box1,
    fixedApis.box4,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box7,
    fixedApis.box8,
    fixedApis.box9,
    fixedApis.box10,
    fixedApis.box11,
    fixedApis.box12,
  ];

  const riderEndpoints = [
    fixedApis.box2,
    fixedApis.box3,
    fixedApis.box13,
    fixedApis.box14,
    fixedApis.box15,
  ];

  const endpointsMappings = {
    // Add specific endpoint mappings here if needed
    // For example:
    // 'bestGCResults': '/race-stats/:id/bestGCResults'
  };

  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
  } = useMultipleData(riderEndpoints, {
    id: teamId,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "team",
  });

  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
  } = useMultipleData(raceEndpoints, {
    id: teamId,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "team",
  });

  // Combine results
  const data = { ...raceData, ...teamData };
  const loading = raceLoading || teamLoading;
  const error = raceError || teamError;

  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.data?.grand_tours_ridden,
      response?.data?.data?.best_monument_results,
      response?.data?.data?.first_rank_races,
      response?.data?.data?.first_grand_tour_win,
      response?.data?.data?.last_place_finishes,
      response?.data?.data,
      response?.data,
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
            {/*Box 1 - Grand tour ridden*/}
            <div className="col-lg-4 col-md-6 11">
              <div className="list-white-cart">
                <h4 className="font-size-change">{data?.[fixedApis.box1]?.message}</h4>
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
                        .map((item, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white sdsdsd">
                              <Link href={`/races/${item?.race}`} className="pabs" />
                              {renderFlag(item?.country)}
                              <h6>
                                {item?.race || "..."}
                                {/* ({item.year}) */}
                              </h6>
                            </div>

                            {item?.count ? <span>{item.count}</span> : <span>0</span>}
                          </li>
                        ))}
                    </ul>
                    <Link href={buildUrlWithParams("get-grand-tours-ridden")} className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Box 2 -  Last Victory  */}
            <div className="col-lg-4 col-md-6 22">
              <div className="team-cart lime-green-team-cart img-active">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">{data?.[fixedApis.box2]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box2]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box2];
                    console.log("getRiderLastVictorOneData API Response:", response);
                    const teamData = response?.data?.data?.raceData;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-green name-left">
                          <Link href={`/races/${firstTeam?.race}`} className="pabs" />
                          {renderFlag(firstTeam?.country)}
                          <h6>{firstTeam?.race || "..."}</h6>
                        </div>
                        {firstTeam?.year && (
                          <h5>
                            <strong>{firstTeam.year} </strong>
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("rider-last-victory")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box 3 - Most Raced country*/}

            <div className="col-lg-4 col-md-6 33">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">
                    {data?.[fixedApis.box3]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    const teamData = response?.data?.data?.raceData;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];
                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          {renderFlag(firstTeam?.country_code)}
                          <h6>{firstTeam?.country_name || "..."}</h6>
                        </div>

                        {firstTeam?.races_count && (
                          <h5>
                            <strong>{firstTeam.races_count} </strong>
                            race days
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("get-rider-most-raced-country")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 4 - Best StageResult*/}
            <div className="col-lg-3 col-md-6 a">
              <div className="team-cart">
                <Link href={buildUrlWithParams("get-best-stage-result")} className="pabs" />
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box4]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box4]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box4];
                    const teamData = response?.data?.data?.results;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          <Link href={`/races/${firstTeam?.race}`} className="pabs" />
                          {renderFlag(firstTeam?.country_code)}
                          <h6>
                            {firstTeam?.race || "..."} ({firstTeam.year})
                          </h6>
                        </div>
                        {firstTeam?.best_stage_rank && (
                          <h5>
                            <strong>{firstTeam.best_stage_rank} </strong>
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("get-best-stage-result")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 5 - Grand TourDNFs  */}
            <div className="col-lg-3 col-md-6 b">
              <div className="team-cart">
                <Link href={buildUrlWithParams("get-grand-tour-dnfs")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box5]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box5]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box5];
                    const teamData = response?.data.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        {/* {teamData?.dnf_count && (
                          <h5>
                            <strong>{teamData.dnf_count} </strong>
                          </h5>
                        )} */}
                        <h5>
                          <strong>{teamData?.dnf_count ?? 0}</strong>dnfs
                        </h5>

                        <img
                          src="/images/player1.png"
                          alt=""
                          className="absolute-img"
                        />
                        <Link href={buildUrlWithParams("get-grand-tour-dnfs")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 6 - First RankInGrand Tours */}
            <div className="col-lg-3 col-md-6 c">
              <div className="list-white-cart">
                <Link href={buildUrlWithParams("get-first-rank-in-grand-tours")} className="pabs" />
                <h4>{data?.[fixedApis.box6]?.message}</h4>
                {getBoxData(fixedApis.box6).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box6).errorType}
                  />
                ) : (
                  <>
                    <ul>
                      {(Array.isArray(getBoxData(fixedApis.box6).data)
                        ? getBoxData(fixedApis.box6).data
                        : []
                      )
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              <Link href={`/races/${item?.race}`} className="pabs" />
                              {renderFlag(item?.country_code)}
                              <h6>
                                {item?.race || "..."} {item?.tab_name !== null && `Stage ${item?.stage_number}`}
                                {/* ({item.year}) */}
                              </h6>
                            </div>

                            {item?.year && <span>{item.year}</span>}
                          </li>
                        ))}
                    </ul>
                    <Link href={buildUrlWithParams("get-first-rank-in-grand-tours")} className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/*Box 7 -First RankInMonuments */}
            <div className="col-lg-3 col-md-6 d">
              <div className="team-cart lime-green-team-cart img-active">
                <Link href={buildUrlWithParams("get-first-ever-grand-tour-win")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box7]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box7]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box7];
                    const teamData = response?.data.data;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-green name-left">
                          <Link href={`/races/${firstTeam?.race}`} className="pabs" />
                          {renderFlag(firstTeam?.country_code)}
                          <h6>{firstTeam?.race_name || "..."}</h6>
                        </div>
                        {firstTeam?.year && (
                          <h5>
                            <strong>{firstTeam.year} </strong>
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("get-first-ever-grand-tour-win")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 8 -Total RacingDays InGrandTours */}
            <div className="col-lg-3 col-md-6 e">
              <div className="team-cart lime-green-team-cart img-active">
                <Link href={buildUrlWithParams("get-total-racing-days-in-grand-tours")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box8]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box8]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box8];
                    const teamData = response?.data.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        {/* {teamData?.total_racing_days && (
                          <h5>
                            <strong>{teamData.total_racing_days} </strong>
                          </h5>
                        )} */}
                        <h5>
                          <strong>{teamData?.total_racing_days ?? 0}</strong>
                          days
                        </h5>

                        <Link href={buildUrlWithParams("get-total-racing-days-in-grand-tours")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 9 - TotalDistance Raced In GrandTours*/}
            <div className="col-lg-3 col-md-6 total-distance-raced-cart">
              <div className="team-cart">
                <Link href={buildUrlWithParams("get-total-distance-raced-in-grand-tours")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box9]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box9]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box9];
                    const teamData = response?.data.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        {/* {teamData?.total_distance_raced && (
                          <h5>
                            <strong>{teamData.total_distance_raced} </strong>
                          </h5>
                        )} */}
                        <h5>
                          <strong>
                            {teamData?.total_distance_raced ?? 0}
                          </strong>
                          kilometers
                        </h5>

                        <Link href={buildUrlWithParams("get-total-distance-raced-in-grand-tours")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 10 - BestMonument Results*/}
            <div className="col-lg-3 col-md-6 f">
              <div className="list-white-cart">
                <Link href={buildUrlWithParams("get-best-monument-results")} className="pabs" />
                <h4>{data?.[fixedApis.box10]?.message}</h4>
                {getBoxData(fixedApis.box10).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box10).errorType}
                  />
                ) : (
                  <>
                    <ul>
                      {(Array.isArray(getBoxData(fixedApis.box10).data)
                        ? getBoxData(fixedApis.box10).data
                        : []
                      )
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              <Link href={`/races/${item?.race}`} className="pabs" />
                              {renderFlag(item?.country)}
                              <h6>
                                {item?.race || "..."}
                                ({item.year})
                              </h6>
                            </div>

                            {item?.rank && <span>{item.rank}</span>}
                          </li>
                        ))}
                    </ul>
                    <Link href={buildUrlWithParams("get-best-monument-results")} className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/*Box 11 - Best ParisRoubaix Result*/}
            <div className="col-lg-3 col-md-6 g">
              <div className="team-cart">
                <Link href={buildUrlWithParams("get-best-paris-roubaix-result")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box11]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box11]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box11];
                    const teamData = response?.data.data?.best_result;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          <Link href={`/races/${teamData?.race}`} className="pabs" />
                          {renderFlag(teamData?.country_code)}
                          <h6>
                            {teamData?.race_name || "..."} ({teamData.year})
                          </h6>
                        </div>
                        {teamData?.rank && (
                          <h5>
                            <strong>{teamData.rank} </strong>
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("get-best-paris-roubaix-result")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 12 - First Rank InMonuments*/}
            <div className="col-lg-3 col-md-6 h">
              <div className="list-white-cart">
                <Link href={buildUrlWithParams("get-first-rank-in-monuments")} className="pabs" />
                <h4>{data?.[fixedApis.box12]?.message}</h4>
                {getBoxData(fixedApis.box12).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box12).errorType}
                  />
                ) : (
                  <>
                    <ul>
                      {(Array.isArray(getBoxData(fixedApis.box12).data)
                        ? getBoxData(fixedApis.box12).data
                        : []
                      )
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              <Link href={`/races/${item?.race}`} className="pabs" />
                              {renderFlag(item?.country_code)}
                              <h6>{item?.race || "..."}</h6>
                            </div>

                            {item?.year && <span>{item.year}</span>}
                          </li>
                        ))}
                    </ul>
                    <Link href={buildUrlWithParams("get-first-rank-in-monuments")} className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Box 13 -  Last Victory  */}
            <div className="col-lg-3 col-md-6 i">
              <div className="team-cart lime-green-team-cart img-active">
                <Link href={buildUrlWithParams("get-best-gc-result")} className="pabs" />
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box13]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box13]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box13];
                    const teamData = response?.data?.best_gc_results;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          <Link href={`/races/${firstTeam?.race}`} className="pabs" />
                          {renderFlag(firstTeam?.country_code)}
                          {/* <h6>{firstTeam?.race || "..."}</h6> */}
                          <h6>
                            {firstTeam?.race || "..."}{" "}
                            {firstTeam?.year ? `(${firstTeam.year})` : ""}
                          </h6>
                        </div>
                        {firstTeam?.gcRank && (
                          <h5>
                            <strong>{firstTeam.gcRank} </strong>
                            rank
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("get-best-gc-result")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box 14 - Teammates*/}

            <div className="col-lg-3 col-md-6 j">
              <div className="team-cart">
                <Link href={buildUrlWithParams("team-mates")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box14]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box14]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box14];
                    const teamData = response?.data?.data?.teammates;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${firstTeam?.rider_id}`)}>
                          {renderFlag(firstTeam?.country)}
                          <h6>{firstTeam?.top_teammate || "..."}</h6>
                        </div>
                        {firstTeam?.number_of_race && (
                          <h5>
                            <strong>{firstTeam.number_of_race} </strong>Race days
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("team-mates")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box 15 - Rider LastPlace Finishes*/}
            <div className="col-lg-3 col-md-6 k">
              <div className="list-white-cart">
                <Link href={buildUrlWithParams("get-rider-last-place-finishes")} className="pabs" />
                <h4>{data?.[fixedApis.box15]?.message}</h4>
                {getBoxData(fixedApis.box15).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box15).errorType}
                  />
                ) : (
                  <>
                    <ul>
                      {(Array.isArray(getBoxData(fixedApis.box15).data)
                        ? getBoxData(fixedApis.box15).data
                        : []
                      )
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              <Link href={`/races/${item?.race}`} className="pabs" />
                              {renderFlag(item?.country)}
                              <h6>
                                {item?.race || "..."}{" "}
                                {item?.year ? `(${item.year})` : ""}{" "}

                                {item?.stage_number ? `Stage ${item.stage_number}` : ""}
                              </h6>

                            </div>
                            {item?.rank && <span>{item.rank}</span>}
                          </li>
                        ))}
                    </ul>
                    <Link href={buildUrlWithParams("get-rider-last-place-finishes")} className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </Link>
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

export default TeamThirdSection;
