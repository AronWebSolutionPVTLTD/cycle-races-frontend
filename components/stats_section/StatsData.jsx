import React from "react";
import { useMultipleData } from "../home_api_data";
import {
  BoxSkeleton2,
  ErrorMessage,
  ErrorStats,
} from "../loading&error";
import { renderFlag } from "../RenderFlag";
import Link from "next/link";
import { useRouter } from "next/router";

const StatsData = ({ selectedNationality, selectedTeam, selectedYear }) => {
  const fixedApis = {
    box1: "mostSecondPlaces",
    box2: "teamWithMostNationalities",
    box3: "youngestMostWins",
    box4: "olderstRiders",
    box5: "mostmountainwins",
    box6: "shortestRace",
    box7: "lightestRider",
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
      response?.data?.data?.result,
      response?.data?.data?.shortest_stage_races,
      response?.data?.data,
      response?.data,
      response?.data.riders,
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
          {loading && <BoxSkeleton2 />}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              <div className="col-lg-4 col-md-6 ">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/most-second-places")} className="pabs" />
                  <div className="text-wraper">
                    <h4 className="font-size-change">
                      {data?.[fixedApis.box1]?.message}
                    </h4>
                    {getBoxData(fixedApis.box1).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box1).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <>
                              <div
                                className="name-wraper name-wraper-white " onClick={() => router.push(`/riders/${rider?.riderSlug}`)}
                                key={index}
                              >
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.second_place_count && (
                                <h5>
                                  <strong>{rider.second_place_count} </strong>{" "}
                                  times
                                </h5>
                              )}
                            </>
                          ))}

                        <img
                          src="/images/player6.png"
                          alt=""
                          className="absolute-img"
                        />
                        <Link
                          href={buildUrlWithParams("/stats/most-second-places")}
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
                <div className="team-cart lime-green-team-cart img-active">
                  <Link href={buildUrlWithParams("/stats/team-with-most-nationalities")} className="pabs" />
                  <div className="text-wraper">
                    <h4 className="font-size-change">{data?.[fixedApis.box2]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box2]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box2];
                      const teams = response?.data?.data;

                      if (!Array.isArray(teams) || teams.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {teams.slice(0, 1).map((team, index) => (
                            <div key={index} className="team-card">
                              <div className="name-wraper name-wraper-green name-left" onClick={() => router.push(`/teams/${team?.teamSlug}`)} >
                                {renderFlag(team?.country)}
                                <h6>{team?.team || "..."}</h6>
                              </div>

                              {team?.win && (
                                <h5>
                                  <strong>{team.win} </strong>
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams("/stats/team-with-most-nationalities")}
                                className="white-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/youngest-riders-with-most-wins")} className="pabs" />
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
                                className="name-wraper name-wraper-white " onClick={() => router.push(`/riders/${rider?.riderSlug}`)}
                                key={index}
                              >
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins} </strong> wins
                                </h5>
                              )}
                            </>
                          ))}

                        <img
                          src="/images/player6.png"
                          alt=""
                          className="absolute-img"
                        />
                        <Link
                          href={buildUrlWithParams("/stats/youngest-riders-with-most-wins")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <Link href={buildUrlWithParams("/stats/oldest-active-riders")} className="pabs" />
                  <h4>{data?.[fixedApis.box4]?.message}</h4>
                  {getBoxData(fixedApis.box4).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box4).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box4).data)
                          ? getBoxData(fixedApis.box4).data
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-white " onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.age && <span>{rider.age} jaar</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("/stats/oldest-active-riders")}
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/most-mountain-wins")} className="pabs" />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box5]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box5]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box5];
                      const riders = response?.data?.data;

                      if (!Array.isArray(riders) || riders.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {riders.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-card">
                              <div className="name-wraper name-wraper-white 23" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.totalKOMTitles && (
                                <h5>
                                  <strong>{rider.totalKOMTitles} </strong>wins
                                </h5>
                              )}

                              <img
                                src="/images/player1.png"
                                alt=""
                                className="absolute-img"
                              />
                              <Link
                                href={buildUrlWithParams("/stats/most-mountain-wins")}
                                className="green-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/shortest-races")} className="pabs" />
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
                          .map((race, index) => (
                            <>
                              <div
                                className="name-wraper name-wraper-white 24" onClick={() => router.push(`/races/${race?.raceSlug}`)}
                                key={index}
                              >
                                {renderFlag(race?.country_code)}
                                <h6>
                                  {race?.race || "..."} ({race?.year})
                                </h6>
                              </div>

                              {race?.distance && (
                                <h5>
                                  <strong>{race.distance} </strong> km
                                </h5>
                              )}
                            </>
                          ))}
                        <img
                          src="/images/player2.png"
                          alt=""
                          className="absolute-img"
                        />
                        <Link
                          href={buildUrlWithParams("/stats/shortest-races")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <Link href={buildUrlWithParams("/stats/lightest-riders")} className="pabs" />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box7]?.message}</h4>
                    {getBoxData(fixedApis.box7).error ? (
                      <ErrorMessage
                        errorType={getBoxData(fixedApis.box7).errorType}
                      />
                    ) : (
                      <>
                        {(Array.isArray(getBoxData(fixedApis.box7).data)
                          ? getBoxData(fixedApis.box7).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <React.Fragment key={index}>
                              <div className="name-wraper name-wraper-green name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)} >
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.name || "..."}</h6>
                              </div>

                              {rider?.weight && (
                                <h5>
                                  <strong>{rider.weight}</strong> kilogram
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams("/stats/lightest-riders")}
                                className="white-circle-btn"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </React.Fragment>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsData;
