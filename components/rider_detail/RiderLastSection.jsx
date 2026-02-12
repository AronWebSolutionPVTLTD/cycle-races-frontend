import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton3, CardSkeleton, ErrorMessage } from "../loading&error";
import { renderFlag } from "../RenderFlag";

const RiderLastSection = ({ riderId }) => {
  const fixedApis = {
    box1: "getSimilarRiders",
  };

  const riderEndpoints = [fixedApis.box1];

  const { data, loading, error } = useMultipleData(riderEndpoints, {
    id: riderId,
    idType: "rider",
  });

  const riders =
    data?.[fixedApis.box1]?.data?.data || [];

  const rider1 = riders[0];
  const rider2 = riders[1];
  const rider3 = riders[2];

  return (
    <section className="featured-section">
    <div className="container">
          <h2 className="fw-900 fst-italic section-header">Similar Riders</h2>
     <div className="row">
        {loading && <BoxSkeleton3/>}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load statistics. Please try again later." />
        )}
        {!loading && !(error && Object.keys(data || {}).length === 0) && (

          <>
          <div className="col-12 col-lg-4 mb-3 sm:mb-4">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-green d-flex flex-row">
                  {rider1 && (
                    <>
                      <Link href={`/riders/${rider1.riderSlug}`} className="pabs" />
                      <div className="text-wraper flex-grow-1 d-flex flex-column">
                        <div className="rider-img-wrapper flex-grow-1 d-flex flex-column justify-content-end justify-content-md-between">

                          <img
                            src={rider1.image_url || "/images/rider_avatar.png"}
                            alt={rider1.rider_name}
                            className="rider-img-element d-md-block d-none"
                          />

                          <div className="name-wraper name-wraper-green name-left">
                            {renderFlag(rider1.nationality)}
                            <h6 className="text-white fw-medium" onClick={() => router.push(`/riders/${rider1.riderSlug}`)}>
                              {rider1.rider_name}
                            </h6>
                          </div>

                          <div className="d-flex align-items-center gap-2 justify-content-end">
                            <span className="fw-medium text-white d-none d-md-block">All stats</span>

                            <Link
                              href={`/riders/${rider1.riderSlug}`}
                              className="white-circle-btn position-static"
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

              {/* 🔹 BOX 2 - VOILET */}
              <div className="col-12 col-md-6 col-lg-4 mb-3 sm:mb-4 pe-md-2 pe-lg-3">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-voilet d-flex flex-row">
                  {rider2 && (
                    <>
                      <Link href={`/riders/${rider2.riderSlug}`} className="pabs" />
                      <div className="text-wraper flex-grow-1 d-flex flex-column">
                        <div className="rider-img-wrapper flex-grow-1 d-flex flex-column justify-content-end justify-content-md-between">

                          <img
                            src={rider2.image_url || "/images/rider_avatar.png"}
                            alt={rider2.rider_name}
                            className="rider-img-element d-md-block d-none"
                          />

                          <div className="name-wraper name-wraper-green name-left">
                            {renderFlag(rider2.nationality)}
                            <h6 className="text-white fw-medium" onClick={() => router.push(`/riders/${rider2.riderSlug}`)}>
                              {rider2.rider_name}
                            </h6>
                          </div>

                          <div className="d-flex align-items-center gap-2 justify-content-end">
                            <span className="fw-medium text-white d-none d-md-block">All stats</span>

                            <Link
                              href={`/riders/${rider2.riderSlug}`}
                              className="white-circle-btn position-static"
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

              {/* 🔹 BOX 3 - YELLOW */}
              <div className="col-12 col-md-6 col-lg-4 mb-3 sm:mb-4 ps-md-2 ps-lg-3">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-yellow d-flex flex-row">
                  {rider3 && (
                    <>
                      <Link href={`/riders/${rider3.riderSlug}`} className="pabs" />
                      <div className="text-wraper flex-grow-1 d-flex flex-column">
                        <div className="rider-img-wrapper flex-grow-1 d-flex flex-column justify-content-end justify-content-md-between">

                          <img
                            src={rider3.image_url || "/images/rider_avatar.png"}
                            alt={rider3.rider_name}
                            className="rider-img-element d-md-block d-none"
                          />

                          <div className="name-wraper name-wraper-green name-left">
                            {renderFlag(rider3.nationality)}
                            <h6 className="text-black fw-medium" onClick={() => router.push(`/riders/${rider3.riderSlug}`)}>
                              {rider3.rider_name}
                            </h6>
                          </div>

                          <div className="d-flex align-items-center gap-2 justify-content-end">
                            <span className="fw-medium text-black d-none d-md-block">All stats</span>

                            <Link
                              href={`/riders/${rider3.riderSlug}`}
                              className="white-circle-btn position-static"
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RiderLastSection;
