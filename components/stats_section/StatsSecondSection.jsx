import React from "react";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "@/lib/useTranslation";

const StatsSecondSection = ({
  selectedNationality,
  selectedTeam,
  selectedYear,
}) => {
  const fixedApis = {
    box1: "mostStageWins",
    box2: "gcPodiums",
    box3: "mostConsistentGC",
    box4: "bestClassics",
    box5: "oldestRider",
    box6: "youngestRider",
    box7: "oldestMostWins",
    box8: "youngestMostWins",
    box9: "mostweightRider",
    box10: "gcTop10s",
    box11: "sprintWins",
    box12: "DnfTeams",
    box13: "top3teamwithrank1",
  };

  const { t } = useTranslation();
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
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

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
      response?.data?.data,
      response?.data?.data?.stageResults,
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
    <section className="home-sec2 mb-pb-16px pb-96px">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton />}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              <div className="col-lg-5 box6">
                <div className="list-white-cart ctm-card">
                  <Link href={buildUrlWithParams("/stats/most-stage-wins")} className="pabs" />

                  {(() => {
                    const boxData = getBoxData(fixedApis.box1);
                    const list = Array.isArray(boxData?.data) ? boxData.data : [];
                    const firstImage = list[0]?.image_url || "/images/rider_avatar.png";

                    if (boxData.error) {
                      return (
                        <>
                          <h4 className="fs-chenge">
                            {data?.[fixedApis.box1]?.message}
                          </h4>
                          <div className="no-data-wrap">
                            <ErrorMessage
                              errorType={getBoxData(fixedApis.box1).errorType}
                            />
                          </div>
                        </>
                      )
                    }
                    return (
                      <>
                      <div className="card-content-wraper">
                        <h4 className="fs-chenge">
                          {data?.[fixedApis.box1]?.message}
                        </h4>
                        <ul>
                          {list.slice(0, 5)
                            .map((rider, index) => (
                              <li key={index}>
                                <strong>{index + 1}</strong>
                                <div className="name-wraper name-wraper-white aa" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                  {renderFlag(rider?.rider_country)}
                                  <h6>{rider?.rider_name || "..."}</h6>
                                </div>

                                {rider?.count && <span>{rider.count}</span>}
                              </li>
                            ))}
                        </ul>
                        <div className="image_link-wraper">
                          <img
                            src={firstImage}
                            alt=""
                            className="absolute-img"
                          />
                          <div className="link_box">
                            <Link
                              href={buildUrlWithParams("/stats/most-stage-wins")}
                              className="glob-btn"
                            >
                              <strong>{t("common.full_stats")}</strong>{" "}
                              <span>
                                <img src="/images/arow.svg" alt="" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                    )
                  })()}
                  
                </div>
              </div>

              <div className="col-lg-7 box5 d-flex flex-column">
                <div className="row flex-grow-1">
                  <div className="col-lg-12 col-md-12">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams(
                        "/stats/best-classics-rider"
                      )} className="pabs" />
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box4]?.message}</h4>
                        {getBoxData(fixedApis.box4).error ? (
                          <ErrorMessage
                            errorType={getBoxData(fixedApis.box4).errorType}
                          />
                        ) : (
                          <>
                            {(Array.isArray(getBoxData(fixedApis.box4).data)
                              ? getBoxData(fixedApis.box4).data
                              : []
                            )
                              .slice(0, 1)
                              .map((rider, index) => (
                                <>
                                  <div
                                    className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}
                                    key={index}
                                  >
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>
                                  {rider?.wins && (
                                    <h5>
                                      <strong>{rider.wins} </strong> {t("common.wins")}
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams(
                                "/stats/best-classics-rider"
                              )}
                              className="green-circle-btn"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5 col-md-6">
                    <div className="team-cart">
                      <Link href={buildUrlWithParams(
                        "/stats/most-podiums-in-gc"
                      )} className="pabs" />
                      <div className="text-wraper">
                        <h4>{data?.[fixedApis.box2]?.message}</h4>
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
                                  <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>
                                  {rider?.count && (
                                    <h5>
                                      <strong>{rider.count} </strong>
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams(
                                "/stats/most-podiums-in-gc"
                              )}
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
                      <Link href={buildUrlWithParams("/stats/oldest-rider-in-races")} className="pabs" />
                      <div className="text-wraper">
                        <h4 className="font-size-change">{data?.[fixedApis.box5]?.message}</h4>
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
                                  <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                    {renderFlag(rider?.rider_country)}
                                    <h6>{rider?.rider_name || "..."}</h6>
                                  </div>
                                  {rider?.age && (
                                    <h5>
                                      <strong>{rider.age} </strong> {t("common.year")}
                                    </h5>
                                  )}
                                </>
                              ))}

                            <Link
                              href={buildUrlWithParams("/stats/oldest-rider-in-races")}
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
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/youngest-riders-in-races")} className="pabs" />
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
                            <>
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.age && (
                                <h5>
                                  <strong>{rider.age} </strong> {t("common.year")}
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/youngest-riders-in-races")}
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
                  <Link href={buildUrlWithParams("/stats/oldest-riders-with-most-wins")} className="pabs" />
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
                            <>
                              <div className="name-wraper name-wraper-green name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>
                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins} </strong> {t("common.wins")}
                                </h5>
                              )}
                            </>
                          ))}

                        <Link
                          href={buildUrlWithParams("/stats/oldest-riders-with-most-wins")}
                          className="white-circle-btn"
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
                  <Link href={buildUrlWithParams(
                    "/stats/youngest-riders-with-most-wins"
                  )} className="pabs" />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box8]?.message}</h4>
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
                            <React.Fragment key={index}>
                              <div className="name-wraper name-wraper-green name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.wins && (
                                <h5>
                                  <strong>{rider.wins}</strong> {t("common.wins")}
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "/stats/youngest-riders-with-most-wins"
                                )}
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

              <div className="col-lg-3 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <Link href={buildUrlWithParams(
                    "/stats/heaviest-rider"
                  )} className="pabs" />
                  <div className="text-wraper">
                    <h4>{data?.[fixedApis.box9]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box9]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box9];
                      const riders = response?.data?.data;

                      if (!Array.isArray(riders) || riders.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {riders.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-card">
                              <div className="name-wraper name-wraper-green name-left" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.name || "..."}</h6>
                              </div>

                              {rider?.weight && (
                                <h5>
                                  <strong>{rider.weight}</strong> {t("common.kg")}
                                </h5>
                              )}

                              <Link
                                href={buildUrlWithParams(
                                  "/stats/heaviest-rider"
                                )}
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
                <div className="list-white-cart lime-green-cart">
                  <Link href={buildUrlWithParams("/stats/top-10-in-gc")} className="pabs" />
                  <h4 className="fs-medium">{data?.[fixedApis.box10]?.message}</h4>
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
                              <div className="name-wraper name-wraper-green qb" onClick={() => router.push(`/riders/${rider?.riderSlug}`)}>
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.rider_name || "..."}</h6>
                              </div>

                              {rider?.count && <span>{rider.count}</span>}
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={buildUrlWithParams("/stats/top-10-in-gc")}
                        className="white-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4   col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams("/stats/teams-with-most-dnf")} className="pabs" />
                  <div className="text-wraper">
                    <h4 className="font-size-change">{data?.[fixedApis.box12]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box12]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box12];
                      const riderData = response?.data;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return riderData.slice(0, 1).map((rider, index) => (
                        <div key={index} className="rider-card">
                          <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/teams/${rider?.teamSlug}`)}>
                            {renderFlag(rider?.flag)}
                            <h6>{rider?.team_name || "..."}</h6>
                          </div>
                          {rider?.dnfCount && (
                            <h5>
                              <strong>{rider.dnfCount}</strong> {t("common.dnf")}
                            </h5>
                          )}
                          <Link
                            href={buildUrlWithParams("/stats/teams-with-most-dnf")}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="team-cart">
                  <Link href={buildUrlWithParams(
                    "/stats/team-with-most-consecutive-wins"
                  )} className="pabs" />
                  <div className="text-wraper">
                    <h4 className="font-size-change">{data?.[fixedApis.box13]?.message}</h4>
                    {(() => {
                      if (!data?.[fixedApis.box13]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box13];
                      const riderData = response?.data?.teams;

                      if (!Array.isArray(riderData) || riderData.length === 0) {
                        return <ErrorMessage errorType="no_data_found" />;
                      }

                      return (
                        <>
                          {riderData.slice(0, 1).map((rider, index) => (
                            <div key={index} className="rider-card">
                              <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/teams/${rider?.teamSlug}`)}>
                                {renderFlag(rider?.flag)}
                                <h6>{rider?.team_name || "..."}</h6>
                              </div>
                              {rider?.year && (
                                <h5>
                                  <strong>{rider.year} </strong>
                                </h5>
                              )}
                              {rider?.maxConsecutiveWins && (
                                <h5>
                                  <strong>{rider.maxConsecutiveWins}</strong>
                                  {t("common.wins")}
                                </h5>
                              )}
                            </div>
                          ))}

                          <Link
                            href={buildUrlWithParams(
                              "/stats/team-with-most-consecutive-wins"
                            )}
                            className="green-circle-btn"
                          >
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </>
                      );
                    })()}
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

export default StatsSecondSection;
