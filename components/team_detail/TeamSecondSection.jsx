import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import { useRouter } from "next/router";
const TeamSecondSection = ({ teamId, filterYear }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "getTop10StagesInGrandTours",
    box2: "getRiderFirstWin",
    box3: "bestGCResults",
    box4: "getRiderLongestNoWinStreak",
    box5: "contactHistory",
    box6: "bestCountry",
    box7: "homeCountryWins",
    box8: "riderFromSameHomeTown",
    box9: "getRiderAllVictories",
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

  const raceEndpoints = [fixedApis.box1, fixedApis.box3];
  const riderEndpoints = [
    fixedApis.box2,

    fixedApis.box4,
    fixedApis.box5,
    fixedApis.box6,
    fixedApis.box7,
    fixedApis.box8,
    fixedApis.box9,
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
      response?.data?.data?.top_10_stages,
      response?.data?.data?.best_monument_results,
      response?.data?.data?.years,
      response?.data?.data?.contracts,
      response?.data?.data?.most_wins,
      response?.data?.data?.others_from_same_birthplace,
      response?.data?.data?.data,
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
            {/*Box 1 - Top10 Stages InGrandTours */}
            <div className="col-lg-5 box6">
              <div className="list-white-cart lime-green-cart ctm-card">
                <Link href={buildUrlWithParams("get-top10-stages-in-grand-tours")} className="pabs" />

                {getBoxData(fixedApis.box1).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box1).errorType}
                  />
                ) : (
                  <>
                    <div className="card-content-wraper">
                      <h4 className="fs-chenge">{data?.[fixedApis.box1]?.message}</h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 5)
                          .map((item, index) => (
                            <li key={index}>
                              <div className="name-wraper name-wraper-green">
                                <Link href={`/races/${item?.race}`} className="pabs" />
                                {renderFlag(item?.country)}
                                <h6>{item?.race || "..."} ({item.year}) {item?.tab_name !== null && `Stage ${item?.stage_number}`}</h6>
                              </div>

                              {item?.rank && <span>{item.rank}</span>}
                              {/* {item?.year && <span>{item.year}</span>} */}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="image_link-wraper">
                      <img
                        src="/images/player3.png"
                        alt=""
                        className="absolute-img"
                      />
                      <div className="link_box">
                        <Link href={buildUrlWithParams("get-top10-stages-in-grand-tours")} className="glob-btn">
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

            <div className="col-lg-7 box5 sdsd">
              <div className="row">
                {/*Box 2 - Rider FirstWin*/}
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("get-rider-first-win")} className="pabs" />
                    <div className="text-wraper">
                      <h4>{data?.[fixedApis.box2]?.message}</h4>
                      {(() => {
                        if (!data?.[fixedApis.box2]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box2];
                        const teamData = response?.data.data;


                        if (!Array.isArray(teamData) || teamData.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const firstTeam = teamData[0];

                        return (
                          <>
                            <div className="name-wraper name-wraper-white name-left">
                              <Link href={`/races/${firstTeam?.race}`} className="pabs" />
                              {renderFlag(firstTeam?.country_code)}
                              <h6>{firstTeam?.race_full_title || "..."}</h6>
                            </div>
                            {firstTeam?.age && (
                              <h5>
                                <strong>{firstTeam.age} </strong>jaar
                              </h5>
                            )}

                            <Link href={buildUrlWithParams("get-rider-first-win")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/*Box 3 -GC Results */}
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart lime-green-team-cart img-active">
                    <Link href={buildUrlWithParams("best-gc-results")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">{data?.[fixedApis.box3]?.message}</h4>
                      {(() => {
                        if (!data?.[fixedApis.box3]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box3];
                        const teamData = response?.data?.data;

                        if (!Array.isArray(teamData) || teamData.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        // const firstTeam = teamData[0];

                        return (
                          <>
                            {/* <div className="name-wraper name-wraper-green name-left">
                              {renderFlag(firstRider?.country_code)}
                              <h6>{firstRider?.race || "..."}</h6>
                            </div> */}
                            {/* {firstRider?.best_gc_rank && (
                              <h5>
                                <strong>{firstRider.best_gc_rank} </strong>rank
                              </h5>
                            )} */}

                            {response?.data?.total_gc_wins && (
                              <h5>
                                <strong>{response?.data?.total_gc_wins} </strong>wins
                              </h5>
                            )}

                            <Link href={buildUrlWithParams("best-gc-results")} className="white-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/*Box 4 - Rider LongestNoWinStreak*/}
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("get-rider-longest-no-win-streak")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box4]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box4]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box4];
                        const teamData =
                          response?.data.data.longest_streak_without_win;

                        if (!teamData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            {/* <div className="name-wraper">
                              <h6>
                                {" "}
                                <strong>
                                  {teamData?.bestSeasonYear || "..."}{" "}
                                </strong>
                              </h6>
                            </div> */}
                            {teamData?.total_days && (
                              <h5>
                                <strong>{teamData.total_days}</strong>
                                days
                              </h5>
                            )}

                            <Link href={buildUrlWithParams("get-rider-longest-no-win-streak")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/*Box 5 - contract History */}
                <div className="col-lg-5 col-md-6">
                  <div className="list-white-cart">
                    <Link href={buildUrlWithParams("contact-history")} className="pabs" />
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
                            .map((item, index) => (
                              <li key={index}>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper name-wraper-white">
                                  {renderFlag(item?.teamCountry)}
                                  <h6>{item?.team || "..."}</h6>
                                </div>

                                {item?.year && <span>{item.year}</span>}
                              </li>
                            ))}
                        </ul>
                        <Link href={buildUrlWithParams("contact-history")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* box6 - best Country */}
            <div className="col-lg-3 col-md-6 sss">
              <div className="team-cart">
                <Link href={buildUrlWithParams("best-country")} className="pabs" />
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box6]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box6]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box6];
                    const teamData = response?.data.data;

                    if (!Array.isArray(teamData) || teamData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstTeam = teamData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          {renderFlag(firstTeam?.best_country_code)}
                          <h6>
                            {firstTeam?.best_country_name || "..."}
                          </h6>
                        </div>
                        {firstTeam?.winCount && (
                          <h5>
                            <strong>{firstTeam.winCount} </strong>wins
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("best-country")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* box7 - home country wins*/}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <Link href={buildUrlWithParams("home-country-wins")} className="pabs" />
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
                        {/* {teamData.total_home_country_wins && (
                          <h5>
                            <strong>
                              {teamData.total_home_country_wins}{" "}
                            </strong>
                          </h5>
                        )} */}
                        <h5>
                          <strong>{firstTeam?.total_home_country_wins ?? 0}</strong>wins
                        </h5>

                        <Link href={buildUrlWithParams("home-country-wins")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* box8 -  Rider from same home town InOneDay */}
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
                <Link href={buildUrlWithParams("rider-from-same-home-town")} className="pabs" />
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
                        .map((item, index) => (
                          <li key={index}>
                            {/* <strong>{index + 1}</strong> */}
                            <div className="name-wraper name-wraper-white" onClick={() => router.push(`/riders/${item?._id}`)}>
                              {renderFlag(item?.nationality)}
                              <h6>{item?.name || "..."}</h6>
                            </div>
                          </li>
                        ))}
                    </ul>
                    <Link href={buildUrlWithParams("rider-from-same-home-town")} className="green-circle-btn">
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Box9: Rider AllVictories  */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart list-white-cart lime-green-team-cart ctm-lime-green-team-cart">
                <Link href={buildUrlWithParams("get-rider-all-victories")} className="pabs" />
                <h4>{data?.[fixedApis.box9]?.message}</h4>

                {getBoxData(fixedApis.box9).error ? (
                  <ErrorMessage errorType={getBoxData(fixedApis.box9).errorType} />
                ) : (
                  <>
                    <ul>
                      {(Array.isArray(getBoxData(fixedApis.box9).data)
                        ? getBoxData(fixedApis.box9).data
                        : []
                      )
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div
                              className="name-wraper name-wraper-green 11">
                              <Link href={`/races/${item?.race}`} className="pabs" />
                              {renderFlag(item?.country || item?.rider_country)}
                              <h6>
                                {item?.race || item?.rider_name || "..."} ({item.year})
                              </h6>
                            </div>

                            {item?.totalKOMTitles || item?.count ? (
                              <span>{item?.totalKOMTitles || item?.count}</span>
                            ) : null}
                          </li>
                        ))}
                    </ul>

                    {/* <img
                      src="/images/player6.png"
                      alt=""
                      className="absolute-img"
                    /> */}

                    <Link
                      href={buildUrlWithParams("get-rider-all-victories")}
                      className="white-circle-btn"
                    >
                      <img src="/images/arow.svg" alt="arrow" />
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

export default TeamSecondSection;
