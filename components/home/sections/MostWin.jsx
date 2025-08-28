import React, { useState, useEffect } from "react";
import { useMultipleData } from "../../home_api_data";
import { ErrorMessage, ErrorStats, LoadingStats } from "../../loading&error";
import Flag from "react-world-flags";

const MostWin = ({
  // Optional filter props - component will work with or without them
  selectedNationality = null,
  selectedTeam = null,
  selectedYear = null,
  // New props for different data types
  apiEndpoint = "mostWin",
  title = "Most Wins",
  dataField = "wins", // wins, count, etc.
}) => {
  const apiOptions = {
    box1: apiEndpoint,
  };

  const buildQueryParams = () => {
    let params = {};

    if (selectedYear) params.year = selectedYear;
    if (selectedNationality) params.rider_country = selectedNationality;
    if (selectedTeam) params.team_name = selectedTeam;

    return params;
  };

  // Create array of endpoints to fetch
const endpointsToFetch = Object.values(apiOptions);

  // Fetch data using the selected API endpoint with optional filters
  const { data, loading, error } = useMultipleData(endpointsToFetch, {
    queryParams: buildQueryParams(),
  });

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
    <section className="home-sec3 sdsdd">
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
        <h3>{data?.[apiOptions.box1].message || title}</h3>
        {getBoxData(apiOptions.box1).error ? (
          <ErrorMessage errorType={getBoxData(apiOptions.box1).errorType} />
        ) : (
          (Array.isArray(getBoxData(apiOptions.box1).data) 
            ? getBoxData(apiOptions.box1).data 
            : []
          )
            .slice(0, 1)
            .map((rider, index) => (
              <div key={index}>
                <div className="most-win">
                  <Flag
                    code={rider.rider_country?.toUpperCase()}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                  <h4>{rider.rider_name}</h4>
                </div>
              </div>
            ))
        )}
      </div>
      {/* Move the count/wins outside text-wraper for large number display */}
      {!getBoxData(apiOptions.box1).error && (
        (Array.isArray(getBoxData(apiOptions.box1).data) 
          ? getBoxData(apiOptions.box1).data 
          : []
        )
          .slice(0, 1)
          .map((rider, index) => {
            // Debug: Log the rider data to see what fields are available
            console.log(`MostWin ${apiEndpoint} rider data:`, rider);
            
            // Try multiple possible field names for the data
            const possibleFields = [dataField, 'wins', 'count', 'races', 'podiums', 'stages'];
            const value = possibleFields.find(field => rider[field] !== undefined && rider[field] !== null);
            
            console.log(`MostWin ${apiEndpoint} found value:`, value, 'for rider:', rider.rider_name);
            
            return (
              <div key={`count-${index}`} className="win-count">
                {value && <span>{rider[value]}</span>}
              </div>
            );
          })
      )}
    </div>
  </div>
)}
</div>
</div>
</section>
  );
};

export default MostWin;
