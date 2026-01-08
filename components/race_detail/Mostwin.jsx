import React from "react";
import { ErrorMessage, ErrorStats, LoadingStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import { useMultipleData } from "../home_api_data";



const RaceMostWin = ({
  selectedYear = null,
  selectedNationality = null,
  name = null,

}) => {
  const apiOptions = {
    box1: "mostWins",
  };

  const buildQueryParams = () => {
    let params = {};
    if (selectedYear && selectedYear !== "All-time") params.year = selectedYear;
    if (selectedNationality) params.nationality = selectedNationality;
    return params;
  };

  const endpointsToFetch = [
    apiOptions.box1,]

  const { data, loading, error } = useMultipleData(endpointsToFetch, {
    name: name,
    queryParams: buildQueryParams(),
    idType: "raceDetailsStats",
  });

  const getBoxData = (key) => {
    if (!data?.[key]) return { error: true, errorType: "no_data" };

    const response = data[key];
    const paths = [
      response?.data?.most_wins,
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

          {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <div className="col-lg-12">
              <div className="winning-box">
                <div className="text-wraper">
                  <h3>{data?.[apiOptions.box1].message || "Most Wins"}</h3>
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

                            {renderFlag(rider?.nationality)}
                            <h4>{rider.rider_name}</h4>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {!getBoxData(apiOptions.box1).error && (
                  (Array.isArray(getBoxData(apiOptions.box1).data)
                    ? getBoxData(apiOptions.box1).data
                    : []
                  )
                    .slice(0, 1)
                    .map((rider, index) => (
                      <div key={`count-${index}`} className="win-count">
                        {rider.wins && <span>{rider.wins}</span>}

                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RaceMostWin;
