import React from "react";
import { useMultipleData } from "../../home_api_data";
import {
  ErrorMessage,
  ErrorStats,
  LoadingStats,
  TwoSectionSkeleton,
} from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";
import Link from "next/link";

function convertDateRange(dateStr) {
  const format = (d) => {
    const [day, month] = d.split(".");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}`;
  };

  if (dateStr.includes(" - ")) {
    const [start, end] = dateStr.split(" - ");
    return {
      start: format(start),
      end: format(end),
    };
  } else {
    return {
      start: format(dateStr),
      end: null,
    };
  }
}

const FirstSection = () => {
  // Fixed APIs for each section - no random selection
  const fixedApis = {
    // section1: "tourDownUnderStage2",
    section2: "recentCompleteRace",
  };

  const endpointsToFetch = Object.values(fixedApis);

  // Fetch data using the fixed endpoints
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Enhanced error checking function (same as UpcomingYear)
  const getSectionData = (key) => {
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
    <section className="home-banner">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2>uitslagen</h2>
              <a href="#?" className="alle-link m-0 d-md-inline-block d-none">
                Alle uitslagen <img src="/images/arow2.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Show loading state */}
          {loading && (
            <div className="col-12">
              <TwoSectionSkeleton />
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
              {/* First Section - Top Stage Winners */}
              <div className="col-lg-3 col-md-5">
                <div className="list-white-cart">
                  <h4>
                    {getSectionData(fixedApis.section2).data?.[0]?.raceName}
                  </h4>
                  {getSectionData(fixedApis.section2).error ? (
                    <ErrorMessage
                      errorType={getSectionData(fixedApis.section2).errorType}
                    />
                  ) : (
                    <>
                      <ul>
                        {(Array.isArray(getSectionData(fixedApis.section2).data)
                          ? getSectionData(fixedApis.section2).data?.[0]?.result
                          : []
                        )
                          .slice(0, 3)
                          .map((rider, index) => (
                            <li key={index}>
                              <strong>{index + 1}</strong>
                              <div className="name-wraper name-wraper-white ">
                                {renderFlag(rider?.riderCountry)}
                                <h6>{rider?.rider}</h6>
                              </div>
                              {rider.time && (
                                <span>{rider?.time || "..."}</span>
                              )}
                            </li>
                          ))}
                      </ul>

                      <Link
                        href={`/races/${encodeURIComponent(
                          getSectionData(fixedApis.section2).data?.[0]?.raceName
                        )}`}
                        className="green-circle-btn"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Second Section - Top Stage Riders */}
              <div className="col-lg-9 col-md-7">
                {getSectionData(fixedApis.section2).error ? (
                  <ErrorMessage
                    errorType={getSectionData(fixedApis.section2).errorType}
                  />
                ) : (
                  <>
                    {/* <div className="section-title mb-3">
                      <h4>{data?.[fixedApis.section2]?.message}</h4>
                    </div> */}
                    <ul className="transparent-cart">
                      {(Array.isArray(getSectionData(fixedApis.section2).data)
                        ? getSectionData(fixedApis.section2).data
                        : []
                      ).map((result, index) => {
                        const { start, end } = convertDateRange(result?.date);
                        return (
                          <li key={index}>
                            <span>
                              {/* {new Date(result.date).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "2-digit" }
                              )} */}
                              {start}
                              {end ? ` - ${end}` : ""}
                            </span>
                            <h5>
                              {renderFlag(result?.raceCountry)}
                              <a href="#?">{result.raceName}</a>
                            </h5>
                            <h6>
                              {renderFlag(result?.result[0]?.riderCountry)}
                              <a href="#?">{result?.result[0]?.rider}</a>
                            </h6>
                            <h6>{result?.result[0]?.team}</h6>
                            <Link
                              href={`/races/${result?.raceName}`}
                              className="r-details"
                            >
                              <img src="/images/hover-arow.svg" alt="" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
              <div className="d-md-none d-flex justify-content-end pt-4">
                <a href="#?" className="alle-link m-0">
                  Alle uitslagen <img src="/images/arow2.svg" alt="" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FirstSection;
