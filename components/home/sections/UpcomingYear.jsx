import React from "react";
import { useMultipleData } from "../../home_api_data";
import {
  ErrorMessage,
  ErrorStats,
  LoadingStats,
  TwoSectionSkeleton2,
} from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";


const UpcomingYear = () => {
  // Fixed APIs for each box - no random selection
  const fixedApis = {
    box2: "topStageRiderbyTeam",
    box3: "topGCRiderbyTeam",
  };

  const endpointsToFetch = Object.values(fixedApis);
  
  // Fetch data using the fixed endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Enhanced error checking function (same as YearSection)
  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];

    // Try most common paths in order
    const paths = [
      response?.data?.data?.result,
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
    <section className="home-sec4">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>aankomend</h2>
              <a href="#?" className="alle-link m-0">
                Alle statistieken <img src="/images/arow2.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Show loading state */}
          {loading && (
            <div className="col-12">
              <TwoSectionSkeleton2 />
            </div>
          )}

          {/* Show global error if all data failed */}
          {!loading && error && Object.keys(data || {}).length === 0 && (
            <div className="col-12">
              <ErrorStats message="Unable to load statistics. Please try again later." />
            </div>
          )}

          {/* Main content - show when not loading and we have some data */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>
              {/* Upcoming Races - Left Side (Static Content) */}
              <div className="col-lg-6">
                <ul className="transparent-cart">
                  <li>
                    <span>17-23/01</span>
                    <h5>
                      <img src="/images/flag3.svg" alt="" />
                      tour down under
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>22/01</span>
                    <h5>
                      <img src="/images/flag9.svg" alt="" />
                      Classica Comunitat Valenciana
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>22-29/01</span>
                    <h5>
                      <img src="/images/flag5.svg" alt="" />
                      vuelta a san juan
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>25 jan</span>
                    <h5>
                      <img src="/images/flag7.svg" alt="" />
                      trofeo calvia
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                  <li>
                    <span>26 jan</span>
                    <h5>
                      <img src="/images/flag7.svg" alt="" />
                      trofeo alcudia
                    </h5>
                    <a href="#?" className="r-details">
                      <img src="/images/hover-arow.svg" alt="" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Box 2 - Top stage rider by team */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box2).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box2).errorType}
                    />
                  ) : (
                    <>
                      <h4>
                        {data?.[fixedApis.box2]?.message || "Team With Most Stage wins"}
                      </h4>

                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box2).data)
                          ? getBoxData(fixedApis.box2).data
                          : []
                        )
                          .slice(0, 5)
                          .map((team, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(team?.rider_country)}
                                <h6>{team?.team_name || "..."}</h6>
                              </div>
                              {team?.count && <span>{team.count} count</span>}
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

              {/* Box 3 - Top GC rider by team */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  {getBoxData(fixedApis.box3).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box3).errorType}
                    />
                  ) : (
                    <>
                      <h4>
                        {data?.[fixedApis.box3]?.message || "Team With Most GC wins"}
                      </h4>

                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box3).data)
                          ? getBoxData(fixedApis.box3).data
                          : []
                        )
                          .slice(0, 5)
                          .map((team, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper">
                                {renderFlag(team?.rider_country)}
                                <h6>{team?.team_name || "..."}</h6>
                              </div>
                              {team?.count && <span>{team.count} count</span>}
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
      </div>
    </section>
  );
};

export default UpcomingYear;