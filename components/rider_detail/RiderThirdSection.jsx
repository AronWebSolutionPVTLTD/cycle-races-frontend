import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

const RiderThirdSection = ({ riderId, filterYear }) => {
  const fixedApis = {
    box1: "getGrandToursRidden",
    box2: "lastVictory",
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
    <>
      <div className="row" style={{ marginBottom: "30px" }}>
        {loading && <BoxSkeleton />}

        {/* Show global error if all data failed */}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load rider statistics. Please try again later." />
        )}

        {!loading && !(error && Object.keys(data || {}).length === 0) && (
          <>
            {/*Box 1 - Grand tour ridden*/}
            <div className="col-lg-4 col-md-6">
              <div className="list-white-cart">
                <h4>{data?.[fixedApis.box1]?.message}</h4>
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
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.country)}
                              <h6>
                                {rider?.race || "..."} ({rider.year})
                              </h6>
                            </div>

                            {rider?.best_rank && <span>{rider.best_rank}</span>}
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

            {/* Box 2 -  Last Victory  */}
            <div className="col-lg-4 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box2]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box2]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box2];
                    const riderData = response?.data?.data?.raceData;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-green">
                          {renderFlag(riderData?.country)}
                          <h6>{riderData?.race || "..."}</h6>
                        </div>
                        {riderData?.year && (
                          <h5>
                            <strong>{riderData.year} </strong>
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

            {/* Box 3 - Most Raced country*/}

            <div className="col-lg-4 col-md-6">
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
                    const riderData = response?.data?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.raceData?.country_code)}
                          <h6>
                            ({riderData?.raceData?.country_name || "..."})
                          </h6>
                        </div>

                        {riderData?.raceData?.races_count && (
                          <h5>
                            <strong>{riderData.raceData?.races_count} </strong>race days
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

            {/*Box 4 - Best StageResult*/}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box4]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box4]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box4];
                    const riderData = response?.data?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.country_code)}
                          <h6>
                            {riderData?.race || "..."} ({riderData.year})
                          </h6>
                        </div>
                        {riderData?.best_stage_rank && (
                          <h5>
                            <strong>{riderData.best_stage_rank} </strong>
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

            {/*Box 5 - Grand TourDNFs  */}
            <div className="col-lg-3 col-md-6">
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
                    const riderData = response?.data.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>

                        {/* {riderData?.dnf_count && ( */}
                        <h5>
                          {/* <strong>{riderData.dnf_count} </strong> */}
                          <strong>{riderData?.dnf_count ?? 0}</strong>dnfs
                        </h5>
                        {/* )} */}

                        <img
                          src="/images/player1.png"
                          alt=""
                          className="absolute-img"
                        />
                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 6 - First RankInGrand Tours */}
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
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
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.country_code)}
                              <h6>
                                {rider?.race || "..."} ({rider.year})
                              </h6>
                            </div>

                            {rider?.year && <span>{rider.year}</span>}
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

            {/*Box 7 -First RankInMonuments */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">
                    {data?.[fixedApis.box7]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box7]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box7];
                    const riderData = response?.data.data.first_grand_tour_win;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-green">
                          {renderFlag(riderData?.country_code)}
                          <h6>{riderData?.race || "..."}</h6>
                        </div>
                        {riderData?.year && (
                          <h5>
                            <strong>{riderData.year} </strong>
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

            {/*Box 8 -Total RacingDays InGrandTours */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
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
                    const riderData = response?.data.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        {/* {riderData?.total_racing_days && ( */}
                        <h5>
                          {/* <strong>{riderData.total_racing_days} </strong>days */}
                          <strong>{riderData?.total_racing_days ?? 0}</strong>days
                        </h5>
                        {/* // )} */}

                        <a href="#?" className="white-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 9 - TotalDistance Raced In GrandTours*/}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">
                    {data?.[fixedApis.box9]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box9]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box9];
                    const riderData = response?.data.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        {/* {riderData?.total_distance_raced && ( */}
                        <h5>
                          {/* <strong>{riderData.total_distance_raced} </strong>kilometers */}
                          <strong>{riderData?.total_distance_raced ?? 0}</strong>kilometers
                        </h5>
                        {/* // )} */}

                        <a href="#?" className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/*Box 10 - BestMonument Results*/}
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
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
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.country)}
                              <h6>
                                {rider?.race || "..."} ({rider.year})
                              </h6>
                            </div>

                            {rider?.rank && <span>{rider.rank}</span>}
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

            {/*Box 11 - Best ParisRoubaix Result*/}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">
                    {data?.[fixedApis.box11]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box11]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box11];
                    const riderData = response?.data.data?.best_result;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.country_code)}
                          <h6>
                            {riderData?.race_name || "..."} ({riderData.year})
                          </h6>
                        </div>
                        {riderData?.rank && (
                          <h5>
                            <strong>{riderData.rank} </strong>
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

            {/*Box 12 - First Rank InMonuments*/}
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
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
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.country_code)}
                              <h6>{rider?.race || "..."}</h6>
                            </div>

                            {rider?.year && <span>{rider.year}</span>}
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

            {/* Box 13 -  Last Victory  */}
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4>{data?.[fixedApis.box13]?.message}</h4>
                  {(() => {
                    if (!data?.[fixedApis.box13]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box13];
                    const riderData = response?.data?.best_gc;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.country_code)}
                          <h6>{riderData?.race || "..."}</h6>
                        </div>
                        {riderData?.gcRank && (
                          <h5>
                            <strong>{riderData.gcRank} </strong>
                            rank
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

            {/* Box 14 - Teammates*/}

            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <a href="#?" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">
                    {data?.[fixedApis.box14]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box14]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box14];
                    const riderData = response?.data?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-white">
                          {renderFlag(riderData?.country)}
                          <h6>{riderData?.top_teammate || "..."}</h6>
                        </div>
                        {riderData?.times_raced && (
                          <h5>
                            <strong>{riderData.times_raced} </strong>times
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

            {/* Box 15 - Rider LastPlace Finishes*/}
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
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
                        .map((rider, index) => (
                          <li key={index}>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper name-wraper-white">
                              {renderFlag(rider?.country)}
                              <h6>{rider?.race || "..."}</h6>
                            </div>

                            {rider?.rank && <span>{rider.rank}</span>}
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
          </>
        )}
      </div>
    </>
  );
};

export default RiderThirdSection;
