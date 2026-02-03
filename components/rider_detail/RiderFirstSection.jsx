import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import { useRouter } from "next/router";


const RiderFirstSection = ({ riderId, filterYear, imageUrl }) => {
  const router = useRouter();
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
    box10: "getRiderWinsPodiumsTop10sCurrentYear"
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
    fixedApis.box10,
  ];

  const endpointsMappings = {
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
    const paths = [
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
      <div className="row">
        {loading && <BoxSkeleton />}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load rider statistics. Please try again later." />
        )}
        {!loading && !(error && Object.keys(data || {}).length === 0) && (
          <>
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart lime-green-cart ctm-card ctm_card_2 ">
                <Link href={buildUrlWithParams("rider-results-this-year")} className="pabs" />

                {(() => {
                  if (!data?.[fixedApis.box10]) {
                    return (
                      <>
                        <h4>{data?.[fixedApis.box10]?.message || "Result of year"}</h4>
                        <div className="no-data-wrap">
                          <ErrorMessage errorType="no_data" />
                        </div>
                      </>
                    );
                  }

                  const response = data[fixedApis.box10];
                  const riderData = response?.data;
                  const winsCount = riderData?.wins_count ?? 0;
                  const podiumCount = riderData?.podium_count ?? 0;
                  const top10Count = riderData?.top10_count ?? 0;
                  if (!riderData || (winsCount === 0 && podiumCount === 0 && top10Count === 0)) {
                    return (
                      <>
                        <h4>{response?.message}</h4>
                        <div className="no-data-wrap">
                          <ErrorMessage errorType="no_data_found" />
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="card-content-wraper">
                        <h4>{response?.message}</h4>

                        <ul>
                          <li>
                            <Link href={buildUrlWithParams("rider-results-this-year")} className="name-wraper name-wraper-white Result-value result-of-year-card">
                              <span className="label">Wins</span>

                            </Link>
                            <span className="value">
                              {winsCount}
                            </span>
                          </li>

                          <li>
                            <Link href={buildUrlWithParams("rider-results-this-year")} className="name-wraper name-wraper-white Result-value result-of-year-card">
                              <span className="label">Podium</span>

                            </Link>
                            <span className="value">
                              {podiumCount}
                            </span>
                          </li>

                          <li>
                            <Link href={buildUrlWithParams("rider-results-this-year")} className="name-wraper name-wraper-white result-of-year-card ">
                              <span className="label">Top 10</span>

                            </Link>
                            <span className="value">
                              {top10Count}
                            </span>
                          </li>
                        </ul>

                      </div>

                      <div className="image_link-wraper">
                        <div className="link_box">
                          <Link href={buildUrlWithParams("rider-results-this-year")} className="green-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
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
                    const riderData = response?.data?.data;

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }
                    return (
                      <div className="name-wraper">
                        <h5 className="fst-italic">
                          <strong>{riderData.total_wins}</strong>
                        </h5>
                      </div>);
                  })()}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart img-active">
                <Link href={buildUrlWithParams("current-uci-ranking")} className="pabs" />
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

                    const riderData = riderDataArray.find(
                        (r) => r.riderSlug === riderId
                    );

                    if (!riderData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <div className="name-wraper name-wraper-green name-left">
                          <h6>{riderData?.total_uci_points || "..."} UCI points</h6>
                        </div>
                        {riderData?.rank && (
                          <h5>
                            <strong>{riderData.rank}</strong> rank
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("current-uci-ranking")} className="white-circle-btn">
                          <img src="/images/arow.svg" alt="arrow" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-12">
              <div className="list-white-cart lime-green-cart ctm-card ctm_card_2">

                <Link href={buildUrlWithParams("rider-last-victories")} className="pabs" />
                {getBoxData(fixedApis.box1).error ? (
                  <>
                    <h4>
                      {" "}
                      {data?.[fixedApis.box1]?.message}
                    </h4>
                    <div className="no-data-wrap">
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box1).errorType}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="card-content-wraper">
                      <h4>
                        {" "}
                        {data?.[fixedApis.box1]?.message}
                      </h4>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1)?.data)
                          ? getBoxData(fixedApis.box1)?.data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <div className="name-wraper name-wraper-white">
                                <Link href={`/races/${rider?.raceSlug}?year=${rider.year}`} className="pabs" />
                                {renderFlag(rider?.country)}
                                <h6>
                                  {rider?.race || "..."}{" "}
                                  {rider?.tab_name === "stage" && rider?.stage_number
                                    ? `Stage ${rider.stage_number}`
                                    : ""}
                                </h6>
                              </div>
                              {rider?.year && <span>{rider.year}</span>}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="image_link-wraper">
                      <div className="link_box">
                        <Link href={buildUrlWithParams("rider-last-victories")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>



            <div className="col-lg-7 box5 sss">
              <div className="row">
                <div className="col-lg-4 col-md-6 12121">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("wins-in-one-day-races")} className="pabs" />
                    <div className="text-wraper">
                      <h4 >
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

                        const oneDayWins = riderData?.one_day_race_wins ?? 0;

                        if (oneDayWins === 0) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <h5>
                              <strong>{oneDayWins}</strong>wins
                            </h5>

                            <Link href={buildUrlWithParams("wins-in-one-day-races")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>


                <div className="col-lg-4 col-md-6 qq">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("professional since")} className="pabs" />
                    <div className="text-wraper">
                      <h4>
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
                        if (!riderData?.professional_since && !riderData?.career_duration_years) {
                          return <ErrorMessage errorType="no_data_found" />;
                        }

                        return (
                          <>
                            <div className="name-wraper name-wraper-green name-left">
                              {riderData?.professional_since && (
                                <h6>
                                  Since {riderData?.professional_since || "..."}
                                </h6>
                              )}
                            </div>
                            {riderData?.career_duration_years && (
                              <h5>
                                <strong>
                                  {riderData.career_duration_years}{" "}
                                </strong>
                                jaar

                              </h5>
                            )}
                            <Link href={buildUrlWithParams("professional since")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 www">
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
                            <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/teams/${firstRider?.teamSlug}`)}>
                              {renderFlag(firstRider?.flag)}
                              <h6>{firstRider?.teamName || "..."}</h6>
                            </div>
                            {firstRider?.yearsInTeam && (
                              <h5>
                                <strong>{firstRider.yearsInTeam} </strong>years
                              </h5>
                            )}
                            <Link href={buildUrlWithParams("current-team")} className="green-circle-btn">
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="col-lg-7 col-md-6 qw">
                  <div className="list-white-cart">
                    <Link href={buildUrlWithParams("number-of-wins-per-season")} className="pabs" />
                    <h4 className="font-size-change">{data?.[fixedApis.box7]?.message}</h4>
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
                                <div className="name-wraper name-wraper-white ">
                                  <h6>{rider?.year || "..."}</h6>
                                </div>

                                {rider?.wins && <span>{rider.wins}</span>}
                              </li>
                            ))}
                        </ul>
                        <Link href={buildUrlWithParams("number-of-wins-per-season")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-lg-5 col-md-6">
                  <div className="team-cart">
                    <Link href={buildUrlWithParams("time-since-last-win")} className="pabs" />
                    <div className="text-wraper">
                      <h4>
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
                            <div className="name-wraper name-wraper-green name-left">
                              <Link href={`/races/${firstRider?.raceSlug}`} className="pabs last-win" />
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
                            <Link href={buildUrlWithParams("time-since-last-win")} className="green-circle-btn">
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

            <div className="col-lg-5 box6">
              <div className="list-white-cart lime-green-cart ctm-card">
                <Link href={buildUrlWithParams("best-monuments-result")} className="pabs" />
                {getBoxData(fixedApis.box9).error ? (
                  <>
                    <h4 className="fs-chenge">
                      {" "}
                      {data?.[fixedApis.box9]?.message}
                    </h4>
                    <div className="no-data-wrap">
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box9).errorType}
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
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box9).data)
                          ? getBoxData(fixedApis.box9).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                              <div className="name-wraper name-wraper-white">
                                <Link href={`/races/${rider?.raceSlug}`} className="pabs" />
                                {renderFlag(rider?.country)}
                                <h6>{rider?.race || "..."}</h6>
                              </div>

                              {rider?.rank && <span>{rider.rank}</span>}
                              {rider?.year && <span>({rider.year})</span>}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="image_link-wraper">
                      <img
                        src={imageUrl || "/images/rider_avatar.png"}
                        alt=""
                        className="absolute-img"
                      />
                      <div className="link_box">
                        <Link href={buildUrlWithParams("best-monuments-result")} className="glob-btn">
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
export default RiderFirstSection;
