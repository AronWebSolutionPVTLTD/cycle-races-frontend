import React from "react";
import { useMultipleData } from "../../home_api_data";
import Flag from "react-world-flags";
import { BoxSkeleton, ErrorStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

const fixedApis = {
  box1: "mostWin",
  box2: "mostGCWins",
  box3: "mostSecondPlaces",
  box4: "mostTop5Wins",
  box5Race: "raceCount",
  box5GC: "mostRacingDays",
  box5Consistent: "gcPodiums",
  box6Young: "youngestMostWins",
  box6Teams: "gcTop10s",
};

const YearSection = () => {
  const endpointsToFetch = Object.values(fixedApis);
  const { data, loading, error } = useMultipleData(endpointsToFetch);

  // Enhanced error checking function
  const getBoxData = (key) => {
    try {
      // Check for network/API errors
      if (error && error[key]) {
        console.warn(`API error for ${key}:`, error[key]);
        return { error: true, errorType: 'api_error' };
      }

      // Check if data exists at all
      if (!data || !data[key]) {
        return { error: true, errorType: 'no_data' };
      }

      const endpointData = data[key];

      // Check for various data structure scenarios
      if (!endpointData) {
        return { error: true, errorType: 'no_endpoint_data' };
      }

      // Handle different response structures
      let actualData = null;
      
      // Check different possible data structures
      if (endpointData.data?.data !== undefined) {
        actualData = endpointData.data.data;
      } else if (endpointData.data !== undefined) {
        actualData = endpointData.data;
      } else if (endpointData.result !== undefined) {
        actualData = endpointData.result;
      } else {
        actualData = endpointData;
      }

      // Check if actualData is null, undefined, or empty
      if (actualData === null || actualData === undefined) {
        return { error: true, errorType: 'null_data' };
      }

      // Check for empty arrays
      if (Array.isArray(actualData) && actualData.length === 0) {
        return { error: true, errorType: 'empty_array' };
      }

      // Check for empty objects
      if (typeof actualData === 'object' && !Array.isArray(actualData) && Object.keys(actualData).length === 0) {
        return { error: true, errorType: 'empty_object' };
      }

      return { data: actualData, error: false };
    } catch (err) {
      console.error(`Error processing data for ${key}:`, err);
      return { error: true, errorType: 'processing_error' };
    }
  };

   // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Error message component
  const ErrorMessage = ({ errorType = 'general' }) => {
    
    const errorMessages = {
      api_error: 'API Error',
      no_data: 'No Data Available',
      no_endpoint_data: 'No Endpoint Data',
      null_data: 'Data Not Found',
      empty_array: 'No Records Found',
      empty_object: 'No Information Available',
      processing_error: 'Data Processing Error',
      general: 'No Data Available'
    };

    return (
      <div className="text-danger text-center py-3">
        {errorMessages[errorType] || errorMessages.general}
      </div>
    );
  };

  // Show loading skeleton
  if (loading) return <BoxSkeleton />;

  // Show global error if all data failed
  if (error && Object.keys(data || {}).length === 0) {
    return <ErrorStats message="Unable to load statistics. Please try again later." />;
  }

  return (
    <section className="home-sec2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center">
            <h2>dit jaar</h2>
            <a href="#?" className="alle-link">
              Alle statistieken <img src="/images/arow2.svg" alt="" />
            </a>
          </div>
          
          {/* Box 1 - Youngest Rider */}
        <div className="col-lg-5 box6">
                     <div className="list-white-cart lime-green-cart">
                    {getBoxData(fixedApis.box1).error ? (
                <ErrorMessage errorType={getBoxData(fixedApis.box1).errorType} />
              ) : (
                  <>
                   <h4 className="fs-chenge">   {data?.[fixedApis.box1]?.message}</h4>
                              <ul>
                                {(Array.isArray(getBoxData(fixedApis.box1).data) ? getBoxData(fixedApis.box1).data : [])
                    .slice(0, 5)
                    .map((rider, index) => (
                                    <li key={index}>
                                      <strong>{index + 1}</strong>
                                      <div className="name-wraper">
                                               {renderFlag(rider?.rider_country)}
                         <h6>{rider?.rider_name || '...'}</h6>
                                      </div>
                                    
                                      {rider?.wins && (
                            <span>{rider.wins} wins</span>
                          )}
                                    </li>
                                  ))}
                              </ul>
          
                              <img
                                src="/images/player4.png"
                                alt=""
                                className="absolute-img"
                              />
                              <a href="#?" className="glob-btn">
                                <strong>volledige stats</strong>{" "}
                                <span>
                                  <img src="/images/arow.svg" alt="" />
                                </span>
                              </a>
                              </>
                                   )}
                            </div>
                          
                        </div>

                           <div className="col-lg-7 box5">
                <div className="row">
                  {/* Race Count */}
             
  <div className="col-lg-5 col-md-6">
            <div className="team-cart">
              <a href="#?" className="pabs"></a>
             
              {getBoxData(fixedApis.box2).error ? (
                <ErrorMessage errorType={getBoxData(fixedApis.box2).errorType} />
              ) : (
                <>
                     <h4 className="fs-chenge">   {data?.[fixedApis.box2]?.message}</h4>
                   {(Array.isArray(getBoxData(fixedApis.box2).data.data) ? getBoxData(fixedApis.box2).data.data : [])
                    .slice(0, 5)
                    .map((rider, index) => (
                        <>
                  <div className="name-wraper">
                      {renderFlag(rider?.rider_country)}
                         <h6>{rider?.rider_name || '...'}</h6>
                  </div>
                   {rider?.count && 
                  <h5>
                    <strong>{rider.count} </strong> count
                  </h5>
}
</>
                    ))}

                </>
              )}
              <a href="#?" className="green-circle-btn">
                <img src="/images/arow.svg" alt="" />
              </a>
            </div>
          </div>


                    </div>
                      </div>

          {/* Box 2 - Most Weight Rider */}
          <div className="col-lg-3 col-md-6 box2">
            <div className="team-cart">
              <a href="#?" className="pabs"></a>
              <h4>{safeGet(data, `${fixedApis.box2}.message`)}</h4>
              {getBoxData(fixedApis.box2).error ? (
                <ErrorMessage errorType={getBoxData(fixedApis.box2).errorType} />
              ) : (
                <>
                  <div className="name-wraper">
                    {renderFlag(safeGet(getBoxData(fixedApis.box2).data, 'rider_country'))}
                    <h6>{safeGet(getBoxData(fixedApis.box2).data, 'name', 'Unknown Rider')}</h6>
                  </div>
                  <h5>
                    <strong>{safeGet(getBoxData(fixedApis.box2).data, 'weight', 'N/A')}</strong> Kilogram
                  </h5>
                </>
              )}
              <a href="#?" className="green-circle-btn">
                <img src="/images/arow.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Box 3 - Most Second Places */}
          <div className="col-lg-3 col-md-6 box3">
            <div className="team-cart">
              <a href="#?" className="pabs"></a>
              <h4>{safeGet(data, `${fixedApis.box3}.message`)}</h4>
              {getBoxData(fixedApis.box3).error ? (
                <ErrorMessage errorType={getBoxData(fixedApis.box3).errorType} />
              ) : (
                (Array.isArray(getBoxData(fixedApis.box3).data) ? getBoxData(fixedApis.box3).data : [])
                  .slice(0, 1)
                  .map((rider, index) => (
                    <React.Fragment key={index}>
                      <div className="name-wraper">
                        {renderFlag(safeGet(rider, 'rider_country'))}
                        <h6>{safeGet(rider, 'rider_name', 'Unknown Rider')}</h6>
                      </div>
                      <h5>
                        <strong>{safeGet(rider, 'second_place_count', 'N/A')}</strong> count
                      </h5>
                      <img src="/images/player2.png" alt="" className="absolute-img" />
                    </React.Fragment>
                  ))
              )}
              <a href="#?" className="green-circle-btn">
                <img src="/images/arow.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Box 4 - Most Top 5 Wins */}
          <div className="col-lg-3 col-md-6 box4">
            <div className="team-cart">
              <a href="#?" className="pabs"></a>
              <h4>{safeGet(data, `${fixedApis.box4}.message`,)}</h4>
              {getBoxData(fixedApis.box4).error ? (
                <ErrorMessage errorType={getBoxData(fixedApis.box4).errorType} />
              ) : (
                (Array.isArray(getBoxData(fixedApis.box4).data) ? getBoxData(fixedApis.box4).data : [])
                  .slice(0, 1)
                  .map((rider, index) => (
                    <React.Fragment key={index}>
                      <div className="name-wraper">
                        {renderFlag(safeGet(rider, 'rider_country'))}
                        <h6>{safeGet(rider, 'rider_name', 'Unknown Rider')}</h6>
                      </div>
                      <h5>
                        <strong>{safeGet(rider, 'top5_count', 'N/A')}</strong> count
                      </h5>
                    </React.Fragment>
                  ))
              )}
              <a href="#?" className="green-circle-btn">
                <img src="/images/arow.svg" alt="" />
              </a>
            </div>
          </div>

          {/* Box 5 Group: Race Count, Most Racing Days, GC Podiums */}
          <div className="col-lg-7 box5">
            <div className="row">
              {/* Race Count */}
              <div className="col-lg-5 col-md-6">
                <div className="races">
                  <h5>
                    {safeGet(data, `${fixedApis.box5Race}.message`,)}{" "}
                    <strong>
                      {safeGet(data, `${fixedApis.box5Race}.data.count`) || 
                       safeGet(data, `${fixedApis.box5Race}.count`) || 
                       "No data"}
                    </strong>
                  </h5>
                </div>
              </div>

              {/* Most Racing Days */}
              <div className="col-lg-7 col-md-6">
                <div className="team-cart">
                  <a href="#?" className="pabs"></a>
                  <h4>{safeGet(data, `${fixedApis.box5GC}.message`,)}</h4>
                  {getBoxData(fixedApis.box5GC).error ? (
                    <ErrorMessage errorType={getBoxData(fixedApis.box5GC).errorType} />
                  ) : (
                    (() => {
                      const boxData = getBoxData(fixedApis.box5GC).data;
                      const resultArray = boxData?.result || boxData || [];
                      return (Array.isArray(resultArray) ? resultArray : [])
                        .slice(0, 1)
                        .map((rider, index) => (
                          <React.Fragment key={index}>
                            <div className="name-wraper">
                              {renderFlag(safeGet(rider, 'country'))}
                              <h6>{safeGet(rider, 'rider_key', 'Unknown Rider')}</h6>
                            </div>
                            <h5>
                              <strong>{safeGet(rider, 'racing_days', 'N/A')}</strong> days
                            </h5>
                          </React.Fragment>
                        ));
                    })()
                  )}
                  <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>

              {/* GC Podiums */}
              <div className="col-lg-7 col-md-6">
                <div className="team-cart lime-green-team-cart img-active">
                  <a href="#?" className="pabs"></a>
                  <h4>{safeGet(data, `${fixedApis.box5Consistent}.message`,)}</h4>
                  {getBoxData(fixedApis.box5Consistent).error ? (
                    <ErrorMessage errorType={getBoxData(fixedApis.box5Consistent).errorType} />
                  ) : (
                    (Array.isArray(getBoxData(fixedApis.box5Consistent).data) ? getBoxData(fixedApis.box5Consistent).data : [])
                      .slice(0, 1)
                      .map((rider, index) => (
                        <React.Fragment key={index}>
                          <div className="name-wraper">
                            {renderFlag(safeGet(rider, 'rider_country'))}
                            <h6>{safeGet(rider, 'rider_name', 'Unknown Rider')}</h6>
                          </div>
                          <h5>
                            <strong>{safeGet(rider, 'count', 'N/A')}</strong> count
                          </h5>
                        </React.Fragment>
                      ))
                  )}
                  <a href="#?" className="white-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearSection;