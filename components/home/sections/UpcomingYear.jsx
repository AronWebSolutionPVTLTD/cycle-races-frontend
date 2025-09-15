import React from "react";
import { useMultipleData } from "../../home_api_data";
import {
  ErrorMessage,
  ErrorStats,
  LoadingStats,
  TwoSectionSkeleton2,
} from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";
import Link from "next/link";
import { useRouter } from "next/router";


function convertDateRange(dateStr) {
  const monthNames = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec"
  ];

  const format = (d) => {
    const [day, month] = d.split(".");
    return {
      day: parseInt(day),
      month: parseInt(month)
    };
  };

  if (dateStr.includes(" - ")) {
    const [start, end] = dateStr.split(" - ");
    const startDate = format(start);
    const endDate = format(end);
    
    // Check if same month
    if (startDate.month === endDate.month) {
      return {
        start: `${startDate.day} - ${endDate.day} ${monthNames[startDate.month - 1]}`,
        end: null,
      };
    } else {
      // Different months - keep current format
      const formatOld = (d) => {
        const [day, month] = d.split(".");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}`;
      };
      return {
        start: formatOld(start),
        end: formatOld(end),
      };
    }
  } else {
    // Single date
    const date = format(dateStr);
    return {
      start: `${date.day} ${monthNames[date.month - 1]}`,
      end: null,
    };
  }
}

const UpcomingYear = () => {
  const router = useRouter();
  // Fixed APIs for each box - no random selection
  const fixedApis = {
    box1: "getUpcomingRacesByDate",
    // box2: "tourDownUnder24",
    box2: "getUpcomingRacesByDate",
    // box3: "mostWinTourDownUnder",
    box3: "getUpcomingRacesByDate",
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
              <a href="/races" className="alle-link m-0 d-md-inline-block d-none">
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
                    <ul className="transparent-cart sss">
                      {(Array.isArray(getBoxData(fixedApis.box1).data)
                        ? getBoxData(fixedApis.box1).data
                        : []
                      )
                        .slice(0, 5)
                        .map((race, index) => {
                          const { start, end } = convertDateRange(race?.date);
                          return (
                          <li className="hoverState-li" key={index}>
                            <Link href={`/races/${race?.race}`} className="pabs"/>
                            <span className="text-capitalize">
                                {/* {new Date(result.date).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "2-digit" }
                              )} */}
                                {start}
                                {end ? ` - ${end}` : ""}
                              </span>
                            <h5>
                              {renderFlag(race?.country)}
                              {race.race}
                            </h5>
                            <Link
                              href={`/races/${race?.race}`}
                              className="r-details"
                            >
                              <img src="/images/hover-arow.svg" alt="" />
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
                <div className="d-md-none d-flex justify-content-end pb-4 mb-4">
                  <a href="/races" className="alle-link m-0">
                    Alle wedstrijden <img src="/images/arow2.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* Box 2 -tour Down Under24 */}
              <div className="col-lg-3 col-md-6 sssss">
                <div className="list-white-cart">
                  <Link href="/upcoming-races-last-year-riders" className="pabs"/>
                  <h4>{data?.[fixedApis.box2]?.message}</h4>
                  {getBoxData(fixedApis.box2).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box2).errorType}
                    />
                  ) : (
                    <>
                      {/* <ul>
                        {(Array.isArray(getBoxData(fixedApis.box2).data)
                          ? getBoxData(fixedApis.box2).data
                          : []
                        )
                          .slice(0, 1)
                          .map((team, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(team?.rider_country)}
                                <h6>{team?.rider_name || "..."}</h6>
                              </div>
                              {team?.rider_time && (
                                <span>{team.rider_time} </span>
                              )}

                              
                            </li>
                          ))}
                      </ul> */}
                      <ul className="mb-0">
                        {(Array.isArray(getBoxData(fixedApis.box2).data)
                          ? getBoxData(fixedApis.box2).data
                          : []
                        )
                          .slice(0, 1)
                          .map((rider, index) => (
                            <li key={index}>
                              
                              {Array.isArray(rider.last_year_top_riders) &&
                                rider.last_year_top_riders.length > 0 && (
                                  <ul className="mb-0">
                                    {rider.last_year_top_riders
                                      .slice(0, 5)
                                      .map((rider, i) => (
                                        <li key={i}>
                                          <strong>{rider.rank}</strong>
                                          {console.log('riderrrr',rider)}
                                          <div className="name-wraper name-wraper-white 111111" onClick={() => router.push(`/riders/${rider?.id}`)}>
                                            {renderFlag(rider?.country)}
                                            <h6>{rider?.name || "..."}</h6>
                                          </div>
                                          {rider?.time && (
                                            <span>{rider.time}</span>
                                          )}
                                        </li>
                                      ))}
                                  </ul>
                                )}
                            </li>
                          ))}
                      </ul>

                      <Link
                        href="/upcoming-races-last-year-riders"
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Box 3 - most Win TourDownUnder */}
              <div className="col-lg-3 col-md-6 11">
                <div className="list-white-cart">
                  <Link href="/most-win-upcoming-rider-last-year" className="pabs"/>
                  <h4>{data?.[fixedApis.box3]?.data?.winners_message}</h4>
                  {getBoxData(fixedApis.box3).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box3).errorType}
                    />
                  ) : (
                    <>
                      {/* <ul>
                        {(Array.isArray(getBoxData(fixedApis.box3).data)
                          ? getBoxData(fixedApis.box3).data
                          : []
                        )
                          .slice(0, 5)
                          .map((team, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-white">
                                {renderFlag(team?.country)}
                                <h6>{team?.rider_name || "..."}</h6>
                              </div>
                              {team?.winCount && <span>{team.winCount}</span>}
                            </li>
                          ))}
                      </ul> */}
                      <ul className="mb-0">
                        {(Array.isArray(getBoxData(fixedApis.box3).data)
                          ? getBoxData(fixedApis.box3).data
                          : []
                        )
                          .slice(0, 1)
                          .map((winner, index) => (
                            <li key={index}>
                              {Array.isArray(winner.all_time_top_winners) &&
                                winner.all_time_top_winners.length > 0 && (
                                  <ul className="mb-0">
                                    {winner.all_time_top_winners
                                      .slice(0, 5)
                                      .map((winner, i) => (
                                        <li key={i}>
                                           <strong>{winner.rank}</strong>
                                          <div className="name-wraper name-wraper-white">
                                            {renderFlag(winner?.country)}
                                            <h6>{winner?.name || "..."}</h6>
                                          </div>

                                          {winner?.wins && (
                                            <span>{winner.wins}</span>
                                          )}
                                        </li>
                                      ))}
                                  </ul>
                                )}
                            </li>
                          ))}
                      </ul>

                      <Link
                        href="/most-win-upcoming-rider-last-year"
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
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
