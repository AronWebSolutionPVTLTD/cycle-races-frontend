import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";

const RiderFirstSection = ({ riderId, filterYear }) => {

    const fixedApis = {
    box1: "lastVictory",
    box2: "getBestGCResult",
    box3: "bestSeason",
  
  };
 
  const buildQueryParams = () => {
    let params = {};
    if (filterYear && filterYear !== "All-time") {
      params.year = filterYear;
    }
    return params;
  };

  const endpointsToFetch = [
       fixedApis.box1,
    fixedApis.box2,
        fixedApis.box3,

  ];

  
  const endpointsMappings = {
    // Add specific endpoint mappings here if needed
    // For example:
    // 'bestGCResults': '/race-stats/:id/bestGCResults'
  };


  const { data, loading, error } = useMultipleData(
    endpointsToFetch,
    {
      id: riderId,
      queryParams: buildQueryParams(),
      endpointsMappings: endpointsMappings,
      idType: "rider",
    }
  );

   const getBoxData = (endpoint) => {
    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
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
          {/* First Card */}
          <div className="col-lg-3 col-md-6">
                         <div className="team-cart">
                           <a href="#?" className="pabs"></a>
                           {(() => {
                             if (!data?.[fixedApis.box1]) {
                               return <ErrorMessage errorType="no_data" />;
                             }
         
                             const response = data[fixedApis.box1];
                             const riderData = response?.data.data.raceData;
         
                             if (!riderData) {
                               return <ErrorMessage errorType="no_data_found" />;
                             }
         
                             return (
                               <>
                                 <div className="text-wraper">
                                   <h4 className="font-size-change">
                                     {data?.[fixedApis.box1]?.message}
                                   </h4>
                                   <div className="name-wraper">
                                     {renderFlag(riderData?.country)}
                                     <h6>{riderData?.race || "..."}</h6>
                                   </div>
                                   {riderData?.totalKOMTitles && (
                                     <h5>
                                       <strong>{riderData.totalKOMTitles} </strong>wins
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


     </>
                             )}
        </div>

    </>
  );
};

export default RiderFirstSection;
