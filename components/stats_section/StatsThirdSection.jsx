import React from "react";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import Link from "next/link";
import { useRouter } from "next/router";

const StatsThirdSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  const fixedApis = {
    box1: "grandTourstageWin",
    box2: "mostKMsRaced",
    box3: "top3StageTeam",
    box4: "raceCount",
    box5: "topGCRiderbyTeam",
    box6: "top3GCTeam",
    box7: "getMostConsistentGCTeams",
    box8: "longestRace",
    box9: "top10GCTeams",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;
    return params;
  };
  const router = useRouter()
  const buildUrlWithParams = (basePath) => {
    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const endpointsToFetch = Object.values(fixedApis);
  const { data, loading, error } = useMultipleData(endpointsToFetch, {
    queryParams: buildQueryParams(),
  });

  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];
    const paths = [
      response?.data?.riders,
      response?.data?.data?.longest_stage_races,
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
    <section className="home-sec2 pb-96px">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton />}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}

          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              <div className="col-lg-4 col-md-6">
                <div className="list-white-cart lime-green-cart aa">
                  <Link href={buildUrlWithParams("/stats/grand-tour-stage-winners")} className="pabs" />
                  <h4 className="fs-medium">{data?.[fixedApis.box1]?.message}</h4>
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
                              <div className="name-wraper name-wraper-green" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && <span>{rider.wins}</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("/stats/grand-tour-stage-winners")}
                        className="white-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/most-distance-raced")} className="pabs" />
                  <div className="text-wraper">
                    <h4 className="font-size-change">{data?.[fixedApis.box2]?.message}</h4>
                    {getBoxData(fixedApis.box2).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box2).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box2).data)
                          ? getBoxData(fixedApis.box2).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              <div
                                className="name-wraper name-wraper-white name-left"
                                key={index}
                                onClick={() => router.push(`/riders/${rider?.rider_id}`)}
                              >
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_key || "..."}</h6>
                              </div>
                              {rider?.total_distance && (
                                <h5>
                                  <strong>{rider.total_distance}</strong> KM
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/most-distance-raced")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/team-with-most-stage-podium-finishes")} className="pabs" />
                  <div className="text-wraper">
                    <h4 className="font-size-change">{data?.[fixedApis.box3]?.message}</h4>
                    {getBoxData(fixedApis.box3).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box3).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box3).data)
                          ? getBoxData(fixedApis.box3).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              <div
                                className="name-wraper name-wraper-white name-left"
                                key={index}
                                onClick={() => router.push(`/teams/${rider?.team_name}`)}
                              >
                                {renderFlag(rider?.team_country)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>
                              {rider?.count && (
                                <h5>
                                  <strong>{rider.count} </strong>
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/team-with-most-stage-podium-finishes")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-7 box5 d-flex flex-column">
                <div className="row flex-grow-1">
                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("/stats/team-with-most-gc-wins")} className="pabs" />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box5]?.message}</h4>
                        {getBoxData(fixedApis.box5).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box5).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box5).data)
                              ? getBoxData(fixedApis.box5).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-white name-left"
                                    key={index}
                                    onClick={() => router.push(`/teams/${rider?.team_name}`)}
                                  >
                                    {renderFlag(rider?.team_country)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>
                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong>wins
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams("/stats/team-with-most-gc-wins")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams("/stats/longest-races")} className="pabs" />
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box8]?.message}</h4>
                        {getBoxData(fixedApis.box8).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box8).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box8).data)
                              ? getBoxData(fixedApis.box8).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-white name-left"
                                    key={index}
                                    onClick={() => router.push(`/races/${rider?.race}`)}
                                  >
                                    {renderFlag(rider?.country)}
                                    <h6>{rider?.race || "..."}</h6>
                                  </div>
                                  {rider?.distance && (
                                    <h5>
                                      <strong>{rider.distance} </strong>
                                      kilometer
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams("/stats/longest-races")}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-6">
                    <div className="list-white-cart">
                      <Link href={buildUrlWithParams("/stats/teams-with-most-gc-podium-finishes")} className="pabs" />
                      <h4 className="font-size-change">{data?.[fixedApis.box6]?.message}</h4>
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
                                  <div className="name-wraper name-wraper-white 15" onClick={() => router.push(`/teams/${rider?.team_name}`)}>
                                    {renderFlag(rider?.team_country)}
                                    <h6>{rider?.team_name || "..."}</h6>
                                  </div>

                                  {rider?.count && <span>{rider.count}</span>}
                                </li>
                              ))}
                          </ul>
                          <Link
                            href={buildUrlWithParams("/stats/teams-with-most-gc-podium-finishes")}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart ctm-card">
                  <Link href={buildUrlWithParams("/stats/teams-with-most-top-10-gc-finishes")} className="pabs" />

                  {getBoxData(fixedApis.box9).error ? (
                    <>  <h4 className="fs-chenge">
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
                                <strong>{index + 1}</strong>
                                <div className="name-wraper name-wraper-green" onClick={() => router.push(`/teams/${rider?.team_name}`)}>
                                  {renderFlag(rider?.team_country)}
                                  <h6>{rider?.team_name || "..."}</h6>
                                </div>

                                {rider?.count && <span>{rider.count}</span>}
                              </li>
                            ))}
                        </ul>

                        <div className="image_link-wraper">
                          <img
                            src="/images/player6.png"
                            alt=""
                            className="absolute-img"
                          />
                          <div className="link_box">
                            <Link href={buildUrlWithParams("/stats/teams-with-most-top-10-gc-finishes")} className="glob-btn">
                              <strong>volledige stats</strong>{" "}
                              <span>
                                <img src="/images/arow.svg" alt="" />
                              </span>
                            </Link>
                          </div>
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
    </section >
  );
};

export default StatsThirdSection;
