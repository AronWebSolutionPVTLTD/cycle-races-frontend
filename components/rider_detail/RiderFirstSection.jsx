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
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box1]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box1]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box1];
                    const riderData = response?.data?.data?.raceData;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.country)}
                          <h6>{riderData?.race || "..."}</h6>
                        </div>
                        {riderData?.totalKOMTitles && (
                          <h5>
                            <strong>{riderData.totalKOMTitles} </strong>wins
                          </h5>
                        )}

                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* SEcond Card */}
            <div className="col-lg-3 col-md-6">
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
            </div>

            {/* third Section */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box3]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    const riderData = response?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.flag)}
                          <h6>{riderData?.teamName || "..."}</h6>
                        </div>

                        {/* <img
                          src="/images/player3.png"
                          alt=""
                          className="absolute-img"
                        /> */}
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
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

            <div className="col-lg-7 box5">
              <div className="row">
                {/* Box5: Wins in one day */}

                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
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
                            {riderData?.one_day_race_wins && (
                              <h5>
                                <strong>{riderData.one_day_race_wins} </strong>
                              </h5>
                            )}

                            <a href="#?" className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </a>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/*Box 6 - Rider YearsActive */}
                <div className="col-lg-7 col-md-6">
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
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/*Box 8 - Time Since LastVictory */}
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <a href="#?" className="pabs"></a>
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

                        if (!riderData) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            {riderData?.days_since_last_win && (
                              <h5>
                                <strong>
                                  {riderData.days_since_last_win}{" "}
                                </strong>
                              </h5>
                            )}
                            <a href="#?" className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </a>
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
                    <a href="#?" className="glob-btn">
                      <strong>volledige stats</strong>{" "}
                      <span>
                        <img src="/images/arow.svg" alt="" />
                      </span>
                    </a>
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
