import React, { useState, useEffect } from "react";
import { useMultipleData } from "../../home_api_data";
import { ErrorMessage, ErrorStats, LoadingStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

const MostMoutainWin = ({
  // Optional filter props - component will work with or without them
  selectedYear = null,
  selectedNationality = null,
  name = null,
}) => {
  const apiOptions = {
    box1: "getMostMountainClassificationWins",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedNationality) params.nationality = selectedNationality;
    if (selectedYear) params.year = selectedYear;
    return params;
  };

  // Create array of endpoints to fetch
  const endpointsToFetch = [apiOptions.box1];

  // Fetch data using the selected API endpoint with optional filters
  const { data, loading, error } = useMultipleData(endpointsToFetch, {
    name: name,
    queryParams: buildQueryParams(),
    idType: "stageStats",
  });

  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];

    // Try most common paths in order
    const paths = [response?.data?.data, response?.data, response];

    for (const path of paths) {
      if (Array.isArray(path) && path.length > 0) {
        return { data: path, error: false };
      }
    }

    return { error: true, errorType: "no_data_found" };
  };
  return (
    <section className="home-sec3">
      <div className="container">
        <div className="row">
          {loading && (
            <div className="col-12">
              <LoadingStats />
            </div>
          )}

          {error && Object.keys(data || {}).length === 0 && (
            <ErrorStats message="Unable to load data. Please try again later." />
          )}

          {/* Only show content when data is loaded */}
          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <div className="col-lg-12">
              <div className="winning-box">
                <div className="text-wraper">
                  <h3>{data?.[apiOptions.box1].message || "Most Wins"}</h3>
                  {getBoxData(apiOptions.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(apiOptions.box1).errorType}
                    />
                  ) : (
                    (Array.isArray(getBoxData(apiOptions.box1).data)
                      ? getBoxData(apiOptions.box1).data
                      : []
                    )
                      .slice(0, 1)
                      .map((rider, index) => (
                        <div key={index}>
                          <div className="most-win">
                            {renderFlag(rider?.rider_country)}
                            <h4>{rider.rider_name}</h4>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {/* Move the count/wins outside text-wraper for large number display */}
                {!getBoxData(apiOptions.box1).error &&
                  (Array.isArray(getBoxData(apiOptions.box1).data)
                    ? getBoxData(apiOptions.box1).data
                    : []
                  )
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div key={`count-${index}`} className="win-count">
                        {rider.mountain_wins && (
                          <span>{rider.mountain_wins}</span>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MostMoutainWin;
