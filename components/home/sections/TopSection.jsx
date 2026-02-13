import { useMultipleData } from '@/components/home_api_data';
import { BoxSkeleton2, BoxSkeleton3, ErrorMessage, ErrorStats, TwoSectionSkeleton } from '@/components/loading&error';
import { renderFlag } from '@/components/RenderFlag';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { useTranslation } from '@/lib/useTranslation';
const TopSection = () => {
  const fixedApis = {
    box1: "getFeatureRace",
    box2: "getFeatureRider",

  };
  const endpointsToFetch = Object.values(fixedApis);
  const router = useRouter();
  const { data, loading, error } = useMultipleData(endpointsToFetch);
const { t } = useTranslation();
return (
    <section className="featured-section">
      <div className="container">
        <div className="row">
          {loading && <BoxSkeleton3 />}
          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load statistics. Please try again later." />
          )}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              <div className="col-12 col-lg-4 mb-3 sm:mb-4">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-voilet d-flex flex-row">
                  <Link href={`/races/${data[fixedApis.box1].data.raceSlug}`} className="pabs" />
                  <div className="text-wraper d-flex flex-column justify-content-between flex-grow-1">
                    {(() => {
                      if (!data?.[fixedApis.box1]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box1];
                      const riderData = response.data.race;

                      if (!riderData || Object.keys(riderData).length === 0) {
                        return (
                          <>
                            <h4 className="text-white fw-900"> {data?.[fixedApis.box1]?.message}</h4>
                            <ErrorMessage errorType="no_data_found" />;
                          </>
                        )
                      }

                      return (
                        <>
                          <div>
                            <h4 className="text-white fw-900"> {data?.[fixedApis.box1]?.message}</h4>
                            <div
                              className="name-wraper name-wraper-green name-left"
                            >
                              {riderData.country_code && (
                                renderFlag(riderData.country_code)
                              )}
                              <h6 className="text-white fw-medium" onClick={() => router.push(`/races/${data[fixedApis.box1].data.raceSlug}`)}>{riderData.race}</h6>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2 justify-content-end">
                            <span className="fw-medium text-white d-none d-md-block">{t("home.all_stats")}</span>
                            <Link
                              href={`/races/${data[fixedApis.box1].data.raceSlug}`}
                              className="white-circle-btn position-static"
                            >
                              <img src="/images/arow.svg" alt="" />
                            </Link>
                          </div>
                        </>
                      );
                    })()}

                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4 mb-3 sm:mb-4 pe-md-2 pe-lg-3">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-green d-flex flex-row">
                  <Link href={`/riders/${data[fixedApis.box2]?.data?.riderSlug}`} className="pabs" />
                  <div className="text-wraper flex-grow-1 d-flex flex-column">
                    {(() => {
                      if (!data?.[fixedApis.box2]) {
                        return <ErrorMessage errorType="no_data" />;
                      }

                      const response = data[fixedApis.box2];
                      const riderData = response.data.data;

                      if (!riderData || Object.keys(riderData).length === 0) {
                        return (
                          <>
                            <h4 className="text-white fw-900"> {data?.[fixedApis.box2]?.message}</h4>
                            <ErrorMessage errorType="no_data_found" />;
                          </>
                        )
                      }

                      return (
                        <>
                          <h4 className="text-white"> {data?.[fixedApis.box2]?.message}</h4>
                          <div className="rider-img-wrapper flex-grow-1 d-flex flex-column justify-content-end justify-content-md-between">
                            {riderData.image ? (
                              <img src={riderData.image} alt="" className="rider-img-element d-lg-block d-none" />
                            ) : (
                              <img src="/images/rider_avatar.png" alt="" className="rider-img-element d-lg-block d-none" />
                            )}
                            <div
                              className="name-wraper name-wraper-green name-left"
                            >
                              {riderData.nationality && (
                                renderFlag(riderData.nationality)
                              )}
                              <h6 className="text-white fw-medium" onClick={() => router.push(`/riders/${data[fixedApis.box2]?.data?.riderSlug}`)}>{riderData.name}</h6>
                            </div>
                            <div className="d-flex align-items-center gap-2 justify-content-end">
                              <span className="fw-medium text-white d-none d-md-block">{t("home.all_stats")}</span>
                              <Link
                                href={`/riders/${data[fixedApis.box2]?.data?.riderSlug}`}
                                className="white-circle-btn position-static"
                              >
                                <img src="/images/arow.svg" alt="" />
                              </Link>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4 mb-3 sm:mb-4 ps-md-2 ps-lg-3">
                <div className="team-cart lime-green-team-cart img-active featured-card featured-card-banner-img bg-yellow">
                  <Link href={'#'} className="pabs" />
                  <div className="banner--img">
                    <img src="/images/head-to-head-banner.png" alt="" />
                    <Link
                      href={'/head-to-head'}
                      className="white-circle-btn"
                    >
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  )
}

export default TopSection