import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

const RiderSecondSection = ({ riderId, filterYear }) => {
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

    const basePath = `/riders/${riderId}/${statsPath}`;
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
    data: riderData,
    loading: riderLoading,
    error: riderError,
  } = useMultipleData(riderEndpoints, {
    id: riderId,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "rider",
  });

  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
  } = useMultipleData(raceEndpoints, {
    id: riderId,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "race",
  });

  // Combine results
  const data = { ...raceData, ...riderData };
  const loading = raceLoading || riderLoading;
  const error = raceError || riderError;

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
          <ErrorStats message="Unable to load rider statistics. Please try again later." />
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
                          .map((rider, index) => (
                            <li key={index}>
                              <div className="name-wraper name-wraper-green">
                                {renderFlag(rider?.country)}
                                <h6>{rider?.race || "..."} ({rider.year}) {rider?.tab_name !== null && `Stage ${rider?.stage_number}`}</h6>
                              </div>

                              {rider?.rank && <span>{rider.rank}</span>}
                              {/* {rider?.year && <span>{rider.year}</span>} */}
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
                        const riderData = response?.data.data;


                        if (!Array.isArray(riderData) || riderData.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const firstRider = riderData[0];

                        return (
                          <>
                            <div className="name-wraper name-wraper-white name-left">
                              {renderFlag(firstRider?.country_code)}
                              <h6>{firstRider?.race_full_title || "..."}</h6>
                            </div>
                            {firstRider?.age && (
                              <h5>
                                <strong>{firstRider.age} </strong>jaar
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
                      <h4>{data?.[fixedApis.box3]?.message}</h4>
                      {(() => {
                        if (!data?.[fixedApis.box3]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box3];
                        const riderData = response?.data?.data;

                        if (!Array.isArray(riderData) || riderData.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        // const firstRider = riderData[0];

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
                        const riderData =
                          response?.data.data.longest_streak_without_win;

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            {/* <div className="name-wraper">
                              <h6>
                                {" "}
                                <strong>
                                  {riderData?.bestSeasonYear || "..."}{" "}
                                </strong>
                              </h6>
                            </div> */}
                            {riderData?.streak_count && (
                              <h5>
                                <strong>{riderData.streak_count}</strong>
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
                            .map((rider, index) => (
                              <li key={index}>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper name-wraper-white">
                                  {renderFlag(rider?.teamCountry)}
                                  <h6>{rider?.team || "..."}</h6>
                                </div>

                                {rider?.year && <span>{rider.year}</span>}
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
                    const riderData = response?.data.data;

                    if (!Array.isArray(riderData) || riderData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstRider = riderData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          {renderFlag(firstRider?.best_country_code)}
                          <h6>
                            {firstRider?.best_country_name || "..."}
                          </h6>
                        </div>
                        {firstRider?.winCount && (
                          <h5>
                            <strong>{firstRider.winCount} </strong>wins
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
                  <h4 className="font-size-change">
                    {data?.[fixedApis.box7]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box7]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box7];
                    const riderData = response?.data.data;

                    if (!Array.isArray(riderData) || riderData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstRider = riderData[0];

                    return (
                      <>
                        {/* {riderData.total_home_country_wins && (
                          <h5>
                            <strong>
                              {riderData.total_home_country_wins}{" "}
                            </strong>
                          </h5>
                        )} */}
                        <h5>
                          <strong>{firstRider?.total_home_country_wins ?? 0}</strong>wins
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
                        .map((rider, index) => (
                          <li key={index}>
                            {/* <strong>{index + 1}</strong> */}
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.nationality)}
                              <h6>{rider?.name || "..."}</h6>
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
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div
                              className="name-wraper name-wraper-green 11"
                              onClick={() =>
                                router.push(`/riders/${rider?.rider_id}`)
                              }
                            >
                              {renderFlag(rider?.country || rider?.rider_country)}
                              <h6>
                                {rider?.race || rider?.rider_name || "..."} ({rider.year})
                              </h6>
                            </div>

                            {rider?.totalKOMTitles || rider?.count ? (
                              <span>{rider?.totalKOMTitles || rider?.count}</span>
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

export default RiderSecondSection;
