import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

const RiderSecondSection = ({ riderId, filterYear }) => {

    const fixedApis = {
    box1: "getTop10StagesInGrandTours",
    box2: "getRiderFirstWin",
    box3: "bestGCResults",
    box4:"bestSeason",
    box5:'contactHistory',
    box6:'bestCountry',
    box7:'uciPoints',
    box8:'winsInOneDay',
    box9:"getRiderBestMonumentResults",
  
  };
 
  const buildQueryParams = () => {
    let params = {};
    if (filterYear && filterYear !== "All-time") {
      params.year = filterYear;
    }
    return params;
  };

   const raceEndpoints = [
    fixedApis.box1,
  fixedApis.box3,
  
   
      fixedApis.box9,
  ];
  const riderEndpoints = [
    fixedApis.box2,
     
       fixedApis.box4,
fixedApis.box5,
fixedApis.box6,
fixedApis.box7,
fixedApis.box8,
 
  ];
  
  const endpointsMappings = {
    // Add specific endpoint mappings here if needed
    // For example:
    // 'bestGCResults': '/race-stats/:id/bestGCResults'
  };


  const {  data: riderData,
    loading: riderLoading,
    error: riderError,} = useMultipleData(
    riderEndpoints,
    {
      id: riderId,
      queryParams: buildQueryParams(),
      endpointsMappings: endpointsMappings,
      idType: "rider",
    }
  );

    const {   data: raceData,
    loading: raceLoading,
    error: raceError, } = useMultipleData(
    raceEndpoints,
    {
      id: riderId,
      queryParams: buildQueryParams(),
      endpointsMappings: endpointsMappings,
      idType: "race",
    }
  );

  // Combine results
  const data = { ...raceData, ...riderData };
  const loading = raceLoading || riderLoading;
  const error = raceError || riderError;

   const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.data?.top_10_stages,
       response?.data?.data?.best_monument_results,
       response?.data?.data?.years,
       response?.data?.data?.contracts,
      response?.data?.data?.most_wins,
      response?.data?.data?.result,
      response?.data?.data,
      response?.data,
      response?.data?.riders,
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
    <>
    
        <div className="row">

                {loading && <BoxSkeleton />}

                    {/* Show global error if all data failed */}
                          {error && Object.keys(data || {}).length === 0 && (
                            <ErrorStats message="Unable to load rider statistics. Please try again later." />
                          )}

                             {!loading && !(error && Object.keys(data || {}).length === 0) && (
            <>

 {/*Box 1 - Top10 Stages InGrandTours */}
      <div className="col-lg-5 box6">
                <div className="list-white-cart lime-green-cart">
                     <h4 className="fs-chenge">
                      {data?.[fixedApis.box1]?.message}
                      </h4>
                  {getBoxData(fixedApis.box1).error ? (
                    <ErrorMessage
                      errorType={getBoxData(fixedApis.box1).errorType}
                    />
                  ) : (
                    <>
                   
                      <ul>
                        {(Array.isArray(getBoxData(fixedApis.box1).data)
                          ? getBoxData(fixedApis.box1).data
                          : []
                        )
                          .slice(0, 5)
                          .map((rider, index) => (
                            <li key={index}>
                             
                              <div className="name-wraper">
                                {renderFlag(rider?.rider_country)}
                                <h6>{rider?.race || "..."}</h6>
                              </div>

                              {rider?.rank && <span>{rider.rank}</span> }
                                {rider?.year && <span>{rider.year}</span> }
                            </li>
                          ))}
                      </ul>

                      <img
                        src="/images/player3.png"
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
                  
                  {/*Box 2 - Rider FirstWin*/}
 <div className="col-lg-5 col-md-6">
                       <div className="team-cart">
                           <a href="#?" className="pabs"></a>
                           <div className="text-wraper">
                                   <h4>
                                     {data?.[fixedApis.box2]?.message}
                                   </h4>
                           {(() => {
                             if (!data?.[fixedApis.box2]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box2];
                             const riderData = response?.data.data;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 
                                   <div className="name-wraper">
                                     {renderFlag(riderData?.country)}
                                     <h6>{riderData?.raceTitle || "..."}</h6>
                                   </div>
                                   {riderData?.age && (
                                     <h5>
                                       <strong>{riderData.age} </strong>jaar
                                     </h5>
                                   )}
                               
                               <a href="#?" className="green-circle-btn">
                                   <img src="/images/arow.svg" alt="" />
                                 </a>
                               </>
                             );
                           })()}
                             </div>
                         </div>
                  </div>

                  {/*Box 3 -Rider Years Active */}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                      <a href="#?" className="pabs"></a>
           <div className="text-wraper">
                                   <h4>
                                     {data?.[fixedApis.box3]?.message}
                                   </h4>
                           {(() => {
                             if (!data?.[fixedApis.box3]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box3];
                             const riderData = response?.data.data;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 
                                   <div className="name-wraper">
                                     {/* {renderFlag(riderData?.country)} */}
                                     <h6>{riderData?.race || "..."}</h6>
                                   </div>
                                   {riderData?.best_gc_rank && (
                                     <h5>
                                       <strong>{riderData.best_gc_rank} </strong>rank
                                     </h5>
                                   )}
                               
                               <a href="#?" className="white-circle-btn">
                                   <img src="/images/arow.svg" alt="" />
                                 </a>
                               </>
                             );
                           })()}
                             </div>
                    </div>
                  </div>

                  {/*Box 4 - best Season*/}
                  <div className="col-lg-7 col-md-6">
                    <div className="team-cart">
                           <a href="#?" className="pabs"></a>
                           {(() => {
                             if (!data?.[fixedApis.box4]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box4];
                             const riderData = response?.data.data;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 <div className="text-wraper">
                                   <h4 className="font-size-change">
                                     {data?.[fixedApis.box4]?.message}
                                   </h4>
                                   <div className="name-wraper">
                                     
                                     <h6>   <strong>{riderData?.bestSeasonYear || "..."} </strong></h6>
                                   </div>
                                   {riderData?.totalWins && (
                                     <h5>
                                       <strong>{riderData.totalWins} </strong>wins
                                     </h5>
                                   )}
                                 </div>
                               <a href="#?" className="green-circle-btn">
                                   <img src="/images/arow.svg" alt="" />
                                 </a>
                               </>
                             );
                           })()}
                         </div>
                  </div>

                  {/*Box 5 - contract History */}
                  <div className="col-lg-5 col-md-6">
                    <div className="list-white-cart">
                      {getBoxData(fixedApis.box5).error ? (
                        <ErrorMessage
                          errorType={getBoxData(fixedApis.box5).errorType}
                        />
                      ) : (
                        <>
                          <h4>
                            {data?.[fixedApis.box5]?.message}
                          </h4>
                          <ul>
                            {(Array.isArray(getBoxData(fixedApis.box5).data)
                              ? getBoxData(fixedApis.box5).data
                              : []
                            )
                              .slice(0, 3)
                              .map((rider, index) => (
                                <li key={index}>
                                  <strong>{index + 1}</strong>
                                  <div className="name-wraper">
                                    {renderFlag(rider?.teamCountry)}
                                    <h6>{rider?.team || "..."}</h6>
                                  </div>

                                  {rider?.year && (
                                    <span>
                                      {rider.year}
                                    </span>
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
                </div>
              </div>


          {/* box6 - best Country */}
          <div className="col-lg-3 col-md-6">
                         <div className="team-cart">
                           <a href="#?" className="pabs"></a>
                           {(() => {
                             if (!data?.[fixedApis.box6]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box6];
                             const riderData = response?.data.data;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 <div className="text-wraper">
                                   <h4 className="font-size-change">
                                     {data?.[fixedApis.box6]?.message}
                                   </h4>
                                   <div className="name-wraper">
                                     {renderFlag(riderData?.bestCountry)}
                                     <h6>({riderData?.bestCountry.toUpperCase() || "..."})</h6>
                                   </div>
                                   {riderData?.winCount && (
                                     <h5>
                                       <strong>{riderData.winCount} </strong>wins
                                     </h5>
                                   )}
                                 </div>
                               <a href="#?" className="green-circle-btn">
                                   <img src="/images/arow.svg" alt="" />
                                 </a>
                               </>
                             );
                           })()}
                         </div>
                       </div>

                       {/* box7 - uci Points */}
                         <div className="col-lg-3 col-md-6">
                                           <div className="team-cart lime-green-team-cart img-active">
                                             <a href="#?" className="pabs"></a>
                           {(() => {
                             if (!data?.[fixedApis.box7]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box7];
                             const riderData = response?.data.data;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 <div className="text-wraper">
                                   <h4 className="font-size-change">
                                     {data?.[fixedApis.box7]?.message}
                                   </h4>
                                 <h5>
                                       <strong>{riderData.total_uci_points || "0"} </strong>uci
                                     </h5>
                                 </div>
                               <a href="#?" className="white-circle-btn">
                                   <img src="/images/arow.svg" alt="" />
                                 </a>
                               </>
                             );
                           })()}
                                           </div>
                                         </div>

{/* box8 -  wins InOneDay */}
<div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                      <a href="#?" className="pabs"></a>
                  {(() => {
                             if (!data?.[fixedApis.box8]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box8];
                             const riderData = response?.data.data;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 <div className="text-wraper">
                                   <h4 className="font-size-change">
                                     {data?.[fixedApis.box8]?.message}
                                   </h4>
                                   
                                   {riderData?.one_day_race_wins && (
                                     <h5>
                                       <strong>{riderData.one_day_race_wins} </strong>wins
                                     </h5>
                                   )}
                                 </div>
                               <a href="#?" className="green-circle-btn">
                                   <img src="/images/arow.svg" alt="" />
                                 </a>
                               </>
                             );
                           })()}
                    </div>
                  </div>

{/* Box4: Rider Total Wins  */}
  <div className="col-lg-3 col-md-6">
                   <div className="races">
             
                                       {(() => {
                                 if (!data?.[fixedApis.box4]) {
                                   return <ErrorMessage errorType="no_data" />;
                                 }
             
                                 const response = data[fixedApis.box4];
                                 const riderData = response?.data.data;
             
                                 if (!riderData) {
                                   return <ErrorMessage errorType="no_data_found" />;
                                 } 
                                      return (
                             <div className="text-wraper">
                               <h3>
                               {data?.[fixedApis.box4]?.message}
                               </h3>
                               <div className="name-wraper">
                                 <h5>
                                   <strong>{riderData.total_wins}</strong>
                                 </h5>
                               </div>
                             </div>
                                  );
                               })()}
                           </div>
                            </div>
            
     

  </>
          )}
        </div>

    </>
  );
};

export default RiderSecondSection;
