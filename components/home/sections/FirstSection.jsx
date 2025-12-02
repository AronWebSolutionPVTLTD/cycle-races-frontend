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

const FirstSection = () => {
  // Fixed APIs for each section - no random selection
  const fixedApis = {

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
    <section className="home-banner ctm-home-banner pb-96px">
      <div className="container">
        <div className="col-lg-12">
          <div className="d-flex justify-content-between align-items-center section-header">
            <h2 className="fw-900 fst-italic">uitslagen</h2>
            <a href="/races" className="alle-link m-0 d-md-inline-block d-none">
              Alle uitslagen <img src="/images/arow2.svg" alt="" />
            </a>
          </div>
        </div>
        <div className="row">


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
                  <Link
                    href={`/races/${encodeURIComponent(
                      getSectionData(fixedApis.section2).data?.[0]?.raceName
                    )}`} className="pabs" />
                  <h4 className="fw-900">
                    {getSectionData(fixedApis.section2).data?.[0]?.raceName}
                  </h4>

                  <span className="start-end-location">
                    {getSectionData(fixedApis.section2).data?.[0]?.stage_number && (
                      <>Stage {getSectionData(fixedApis.section2).data[0].stage_number}: </>
                    )}
                    {getSectionData(fixedApis.section2).data?.[0]?.start_Location}
                    {getSectionData(fixedApis.section2).data?.[0]?.start_Location &&
                      getSectionData(fixedApis.section2).data?.[0]?.finish_Location &&
                      " - "}
                    {getSectionData(fixedApis.section2).data?.[0]?.finish_Location}
                    {getSectionData(fixedApis.section2).data?.[0]?.distance && (
                      <> ({getSectionData(fixedApis.section2).data[0].distance} km)</>
                    )}
                  </span>


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
                      )
                        .slice(1)
                        .map((result, index) => {
                          console.log(result)
                          const { start, end } = convertDateRange(result?.date);
                          return (
                            <li className="hoverState-li custom-list-el" key={index}>
                              <Link href={`/races/${result?.raceName}`} className="pabs" />
                              <span className="text-capitalize">
                                {/* {new Date(result.date).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "2-digit" }
                              )} */}
                                {start}
                                {end ? ` - ${end}` : ""}
                              </span>
                              {result?.raceName && <h5 className="race-name-el fw-900">
                                {renderFlag(result?.raceCountry)}
                                <a className="d-flex flex-column">
                                  <strong>{result.raceName}</strong>

                                  {result.start_Location && result.finish_Location && result.distance && (
                                    <span className="start-end-location">
                                      Stage {result.stage_number}: {result.start_Location} - {result.finish_Location} ({result.distance} km)
                                    </span>

                                  )}
                                </a>

                              </h5>}
                              {result?.result[0]?.rider &&
                                <h6>
                                  {renderFlag(result?.result[0]?.riderCountry)}
                                  <a href="#?">{result?.result[0]?.rider}</a>
                                </h6>}
                              {result?.result[0]?.team && <h6>{result?.result[0]?.team}</h6>}
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
              <div className="d-md-none d-flex justify-content-end pt-4 mobile_link_wrap">
                <a href="/races" className="alle-link m-0">
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
