import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

const RiderFirstSection = ({ riderId, filterYear }) => {
  const fixedApis = {
    box1: "lastVictory",
    box2: "uciPoints",
    box3: "CurrentTeam",
    box4: "getRiderTotalWins",
    box5: "winsInOneDay",
    box6: "getRiderYearsActive",
    box7: "getRiderWinsBySeason",
    box8: "getTimeSinceLastVictory",
    box9: "getRiderBestMonumentResults",
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

  const riderEndpoints = [
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

  const endpointsMappings = {
    // Add specific endpoint mappings here if needed
    // For example:
    // 'bestGCResults': '/race-stats/:id/bestGCResults'
  };

  const { data, loading, error } = useMultipleData(riderEndpoints, {
    id: riderId,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "rider",
  });

  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
      response?.data?.data?.best_monument_results,
      response?.data?.data?.years,
      response?.data?.data?.wins_per_season,
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
    <>
      <div className="row" style={{ marginBottom: "30px" }}>
        {loading && <BoxSkeleton />}

        {/* Show global error if all data failed */}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load rider statistics. Please try again later." />
        )}

        {!loading && !(error && Object.keys(data || {}).length === 0) && (
          <>
            {/* First Card */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <Link href={buildUrlWithParams("last-victory")} className="pabs" />
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box1]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box1]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box1];
                    const riderData = response?.data?.data?.raceData;

                    if (!Array.isArray(riderData) || riderData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstRider = riderData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(firstRider?.country)}
                          <h6>{firstRider?.race || "..."}</h6>
                        </div>
                        {firstRider?.totalKOMTitles && (
                          <h5>
                            <strong>{firstRider.totalKOMTitles} </strong>wins
                          </h5>
                        )}

                        <Link href={buildUrlWithParams("last-victory")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* SEcond Card */}
            {/* <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box2]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box2]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box2];
                    const riderData = response?.data?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-green">
                          {renderFlag(riderData?.nationality)}
                          <h6>{riderData?.rider_name || "..."}</h6>
                        </div>
                        {riderData?.total_uci_points && (
                          <h5>
                            <strong>{riderData.total_uci_points} </strong>
                          </h5>
                        )}

                        <a href="#?" className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div> */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <Link href={buildUrlWithParams("uci-points")} className="pabs" />
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box2]?.message}</h4>
                  {(() => {
                    const response = data?.[fixedApis.box2];
                    const riderDataArray = response?.data?.data;

                    if (!response) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    if (
                      !Array.isArray(riderDataArray) ||
                      riderDataArray.length === 0
                    ) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    // ✅ Find correct rider by ID
                    const riderData = riderDataArray.find(
                      (r) => r.rider_id === riderId
                    );

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-green">
                          <h6>{riderData?.total_uci_points || "..."}</h6>uci
                          points
                        </div>
                        {riderData?.rank && (
                          <h5>
                            <strong>{riderData.rank}</strong> rank
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("uci-points")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="arrow" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* third Section */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <Link href={buildUrlWithParams("current-team")} className="pabs" />
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box3]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    const riderData = response?.data;

                    if (!Array.isArray(riderData) || riderData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    const firstRider = riderData[0];

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(firstRider?.flag)}
                          <h6>{firstRider?.teamName || "..."}</h6>
                        </div>
                        {firstRider?.yearsInTeam && (
                          <h5>
                            <strong>{firstRider.yearsInTeam} </strong>years
                          </h5>
                        )}

                        {/* <img
                          src="/images/player3.png"
                          alt=""
                          className="absolute-img"
                        /> */}
                        <Link href={buildUrlWithParams("current-team")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box4: Rider Total Wins  */}
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <div className="text-wraper">
                  <h3 className="font-size-change">
                    {data?.[fixedApis.box4]?.message}
                  </h3>
                  {(() => {
                    if (!data?.[fixedApis.box4]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box4];
                    const riderData = response?.data.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }
                    return (
                      <div className="name-wraper">
                        <h5>
                          <strong>{riderData.total_wins}</strong>
                        </h5>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="col-lg-7 box5 sss">
              <div className="row">
                {/* Box5: Wins in one day */}
 
                <div className="col-lg-5 col-md-6 12121">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("wins-in-one-day")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box5]?.message}
                      </h4>
                      
                      {(() => {
                        if (!data?.[fixedApis.box5]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box5];
                        const riderData = response?.data?.data;

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <h5>
                              <strong>{riderData?.one_day_race_wins ?? 0}</strong>wins
                            </h5>

                            <Link href={buildUrlWithParams("wins-in-one-day")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/*Box 6 - Rider YearsActive */}
                {/* <div className="col-lg-7 col-md-6">
                  <div className="team-cart lime-green-team-cart img-active">
                    <a href="#?" className="pabs"></a>
                    <div className="text-wraper">
                      <h4>{data?.[fixedApis.box6]?.message}</h4>
                      {getBoxData(fixedApis.box6).error ? (
                        <ErrorMessage
                          errorType={getBoxData(fixedApis.box6).errorType}
                        />
                      ) : (
                        <>
                          {(Array.isArray(getBoxData(fixedApis.box6).data)
                            ? getBoxData(fixedApis.box6).data
                            : []
                          )
                            .slice(0, 1)
                            .map((rider, index) => (
                              <h5 key={index}>
                                <strong>{rider} </strong>
                              </h5>
                            ))}

                          <a href="#?" className="white-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div> */}
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("rider-years-active")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box6]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box6]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box6];
                        const riderData = response?.data?.data;

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <div className="name-wraper name-wraper-green">
                              <h6>
                                Since {riderData?.professional_since || "..."}
                              </h6>
                            </div>
                            {riderData?.career_duration_years && (
                              <h5>
                                <strong>
                                  {riderData.career_duration_years}{" "}
                                </strong>
                                jaar
                              </h5>
                            )}
                            <Link href={buildUrlWithParams("rider-years-active")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/*Box 7 - Rider Wins BySeason*/}
                <div className="col-lg-7 col-md-6">
                  <div className="list-white-cart">
                    <h4>{data?.[fixedApis.box7]?.message}</h4>
                    {getBoxData(fixedApis.box7).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box7).errorType}
                      />
                    ) : (
                      <>
                        <ul>
                          {(Array.isArray(getBoxData(fixedApis.box7).data)
                            ? getBoxData(fixedApis.box7).data
                            : []
                          )
                            .slice(0, 3)
                            .map((rider, index) => (
                              <li key={index}>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper name-wraper-white">
                                  <h6>{rider?.year || "..."}</h6>
                                </div>

                                {rider?.wins && <span>{rider.wins}</span>}
                              </li>
                            ))}
                        </ul>
                        <Link href={buildUrlWithParams("rider-wins-by-season")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/*Box 8 - Time Since LastVictory */}
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("time-since-last-victory")} className="pabs" />
                    <div className="text-wraper">
                      <h4 className="font-size-change">
                        {data?.[fixedApis.box8]?.message}
                      </h4>
                      {(() => {
                        if (!data?.[fixedApis.box8]) {
                          return <ErrorMessage errorType="no_data" />;
                        }

                        const response = data[fixedApis.box8];
                        const riderData = response?.data?.data;

                        if (!Array.isArray(riderData) || riderData.length === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        const firstRider = riderData[0];

                        return (
                          <>
                            <div className="name-wraper name-wraper-green">
                              {renderFlag(firstRider?.country)}
                              <h6>{firstRider?.race || "..."}</h6>
                            </div>
                            {firstRider?.days_since_last_win && (
                              <h5>
                                <strong>
                                  {firstRider.days_since_last_win}{" "}
                                </strong>
                                days
                              </h5>
                            )}
                            <Link href={buildUrlWithParams("time-since-last-victory")} className="green-circle-btn">
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

            {/*Box 9 - Best Monuments results  */}
            <div className="col-lg-5 box6">
              <div className="list-white-cart lime-green-cart">
                <h4 className="fs-chenge">
                  {" "}
                  {data?.[fixedApis.box9]?.message}
                </h4>
                {getBoxData(fixedApis.box9).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box9).errorType}
                  />
                ) : (
                  <>
                    <ul>
                      {(Array.isArray(getBoxData(fixedApis.box9).data)
                        ? getBoxData(fixedApis.box9).data
                        : []
                      )
                        .slice(0, 5)
                        .map((rider, index) => (
                          <li key={index}>
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.country)}
                              <h6>{rider?.race || "..."}</h6>
                            </div>

                            {rider?.rank && <span>{rider.rank}</span>}
                            {rider?.year && <span>({rider.year})</span>}
                          </li>
                        ))}
                    </ul>

                    <img
                      src="/images/player6.png"
                      alt=""
                      className="absolute-img"
                    />
                    <Link href={buildUrlWithParams("rider-best-monument-results")} className="glob-btn">
                      <strong>volledige stats</strong>{" "}
                      <span>
                        <img src="/images/arow.svg" alt="" />
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RiderFirstSection;
