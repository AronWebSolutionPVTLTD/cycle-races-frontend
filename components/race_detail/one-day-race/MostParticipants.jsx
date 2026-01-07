import React, { useState, useEffect } from "react";
import { renderFlag } from "../../RenderFlag";
import {
  ErrorMessage,
  ErrorStats,
  LoadingStats,
} from "@/components/loading&error";
import { useMultipleData } from "../../home_api_data";

const Mostparticipants = ({ selectedYear = null, selectedNationality = null, name = null }) => {
  const apiOptions = {
    box1: "getRaceParticipants",
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
    idType: "raceDetailsStats",
  });

  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];

    // Try most common paths in order
    const paths = [response?.data?.rider_participation, response];

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
                  {(() => {
                    if (!data?.[apiOptions.box1]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[apiOptions.box1];
                    const riderData = response?.data?.rider_participation;
                    if (!Array.isArray(riderData) || riderData.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }
                    return riderData.slice(0, 1).map((rider, index) => (
                      <>
                        <div>
                          <div className="most-win">
                            {renderFlag(rider?.rider_country)}
                            <h4>{rider?.rider_name}</h4>
                          </div>
                        </div>
                      </>
                    ));
                  })()}
                </div>

                {(() => {
                  if (!data?.[apiOptions.box1]) {
                    return <ErrorMessage errorType="no_data" />;
                  }

                  const response = data[apiOptions.box1];
                  const riderData = response?.data?.rider_participation;
                  // if (!Array.isArray(riderData) || riderData.length === 0) {
                  //   return <ErrorMessage errorType="no_data_found" />;
                  // }
                  return riderData
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div className="win-count">
                        {rider?.participations && (
                          <span>{rider.participations}</span>
                        )}
                      </div>
                    ));
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Mostparticipants;
