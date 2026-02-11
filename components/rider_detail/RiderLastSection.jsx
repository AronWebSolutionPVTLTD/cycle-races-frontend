import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, BoxSkeleton3, CardSkeleton, ErrorMessage, ErrorStats, TwoSectionSkeleton } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import { useRouter } from "next/router";
  const RiderLastSection = ({ riderId, filterYear, imageUrl }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "getGrandToursRidden",
    box2: "getRiderLastVictorOneData",
    box3: "getRiderMostRacedCountry",
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

  const raceEndpoints = [
    fixedApis.box1,

  ];

  const riderEndpoints = [
    fixedApis.box2,
    fixedApis.box3,
  ]

  const endpointsMappings = {

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

  const data = { ...raceData, ...riderData };
  const loading = raceLoading || riderLoading;
  const error = raceError || riderError;

  const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];
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
    <section className="featured-section">
    <div className="container">
          <h2 className="fw-900 fst-italic section-header">Similar Riders</h2>
     <div className="row">
        {loading && <BoxSkeleton3 />}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load statistics. Please try again later." />
        )}
        {!loading && !(error && Object.keys(data || {}).length === 0) && (

          <>
          <div className="col-12 col-lg-4 mb-4">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-green d-flex flex-row">
                  {/* <Link href={`/races/${data[fixedApis.box1].data.raceSlug}`} className="pabs" /> */}
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
                            <span className="fw-medium text-white d-none d-md-block">All stats</span>
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

              <div className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-voilet d-flex flex-row">
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
                              <span className="fw-medium text-white d-none d-md-block">All stats</span>
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

          

              <div className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="team-cart lime-green-team-cart img-active featured-card bg-yellow d-flex flex-row">
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
                              <span className="fw-medium text-white d-none d-md-block">All stats</span>
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
          </>
        )}
      </div>

    </div>
  </section>
  );
};

export default RiderLastSection;
