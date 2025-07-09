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
    box1: "getUpcomingRacesByDate",
    // box2: "tourDownUnder24",
    box2: "getUpcomingRacesByDate",
    // box3: "mostWinTourDownUnder",
    box3: "getUpcomingRacesByDate"
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
      response?.data?.races,

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
              <a href="#?" className="alle-link m-0 d-md-inline-block d-none">
                Alle wedstrijden <img src="/images/arow2.svg" alt="" />
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
              {/* Upcoming Races - Left Side (by date) */}
              <div className="col-lg-6">
                {getBoxData(fixedApis.box2).error ? (
                  <ErrorMessage
                    errorType={getBoxData(fixedApis.box1).errorType}
                  />
                ) : (
                  <>
                    {/* <h4>{data?.[fixedApis.box1]?.message}</h4> */}
                    <ul className="transparent-cart">
                      {(Array.isArray(getBoxData(fixedApis.box1).data)
                        ? getBoxData(fixedApis.box1).data
                        : []
                      )
                        .slice(0, 5)
                        .map((race, index) => (
                          <li key={index}>
                            <span>{race.date}</span>
                            <h5>
                              {renderFlag(race?.country)}
                              {race.race}
                            </h5>
                            <a href="#?" className="r-details">
                              <img src="/images/hover-arow.svg" alt="" />
                            </a>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
                <div className="d-md-none d-flex justify-content-end pt-4">
                  <a href="#?" className="alle-link m-0">
                    Alle wedstrijden <img src="/images/arow2.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* Box 2 -tour Down Under24 */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data?.[fixedApis.box2]?.message}</h4>
                  {getBoxData(fixedApis.box2).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box2).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box2).data)
                          ? getBoxData(fixedApis.box2).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <li key={index}>
                              {/* <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(team?.rider_country)}
                                <h6>{team?.rider_name || "..."}</h6>
                              </div> */}
                              {Array.isArray(rider.last_year_top_riders) && rider.last_year_top_riders.length > 0 && (
                                <ul>
                                  {rider.last_year_top_riders.map((rider, i) => (
                                    <li key={i}>
                                      <div className="name-wraper name-wraper-white">
                                        {renderFlag(rider?.country)}
                                        <h6>{rider?.name || "..."}</h6>
                                      </div>
                                      {rider?.time && <span>{rider.time}</span>}
                                    </li>
                                  ))}
                                </ul>
                              )}
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

              {/* Box 3 - most Win TourDownUnder */}
              <div className="col-lg-3 col-md-6">
                <div className="list-white-cart">
                  <h4>{data?.[fixedApis.box3]?.data.winners_message}</h4>
                  {getBoxData(fixedApis.box3).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box3).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box3).data)
                          ? getBoxData(fixedApis.box3).data
                          : []
                        )
                          .slice(0, 1)
                          .map((winner, index) => (
                            <li key={index}>

                              {Array.isArray(winner.all_time_top_winners) && winner.all_time_top_winners.length > 0 && (
                                <ul>
                                  {winner.all_time_top_winners.map((winner, i) => (
                                    <li key={i}>
                                      <div className="name-wraper name-wraper-white">
                                        {renderFlag(winner?.country)}
                                        <h6>{winner?.name || "..."}</h6>
                                      </div>

                                      {winner?.wins && <span>{winner.wins}</span>}
                                    </li>
                                  ))}
                                </ul>
                              )}

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
