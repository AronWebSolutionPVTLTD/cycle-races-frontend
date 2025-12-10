import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { renderFlag } from "../RenderFlag";
import { useRouter } from "next/router";


const TeamFirstSection = ({ teamId, teamName, teamSlug, filterYear }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "AmountOfRider",
    box2: "totalTeamWins",
    // box3: "getRiderWithMostWinsInTeamHistory",
  };

  const buildQueryParams = () => {

    let params = {};
    if (filterYear && filterYear !== "All-time") {
      params.year = filterYear;
    }
    return params;
  };

  const buildUrlWithParams = (statsPath) => {

    const params = buildQueryParams();
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    // For URL paths, use the slug as-is (Next.js router handles it)
    // But for API calls, we need to encode it
    const slugForUrl = teamSlug || (teamName ? teamName : teamId);
    const basePath = `/teams/${slugForUrl}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const teamEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    // fixedApis.box3,
  ];


  const endpointsMappings = {};

  const rawTeamIdentifier = teamSlug || teamName;
  const teamIdentifier = rawTeamIdentifier ? encodeURIComponent(rawTeamIdentifier) : null;

  if (teamIdentifier) {
    teamEndpoints.forEach(endpoint => {
      endpointsMappings[endpoint] = `/teamDetails/${teamIdentifier}/${endpoint}`;
    });
  }

  const { data, loading, error } = useMultipleData(teamEndpoints, {
    id: teamId,
    name: teamName,
    queryParams: buildQueryParams(),
    endpointsMappings: endpointsMappings,
    idType: "team",
  });

  const getBoxData = (endpoint) => {

    if (!data?.[endpoint]) return { error: true, errorType: "no_data" };
    const response = data[endpoint];

    // Try most common paths in order
    const paths = [
      response?.data?.most_wins,
      response?.data?.data?.best_monument_results,
      response?.data?.data?.years,
      response?.data?.data?.wins_per_season,
      response?.data?.data,
      response?.data,
      response?.data?.riders,
      response,
      response?.data?.data?.raceData,
    ];

    for (const path of paths) {
      if (Array.isArray(path) && path.length > 0) {
        return { data: path, error: false };
      }
    }

    return { error: true, errorType: "no_data_found" };
  };

  return (
    <div className="col-12">
      <div className="row"
      // style={{ marginBottom: "30px" }}
      >
        {loading && <BoxSkeleton />}

        {/* Show global error if all data failed */}
        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load team statistics. Please try again later." />
        )}

        {!loading && !(error && Object.keys(data || {}).length === 0) && (
          <>

            {/* Box1: Amount of rider  */}
            <div className="col-lg-3 col-md-6 12121">
              <div className="team-cart">
                <Link href={buildUrlWithParams("amount-of-riders")} className="pabs" />
                <div className="text-wraper">
                  <h4 >
                    {data?.[fixedApis.box1]?.message}
                  </h4>

                  {(() => {
                    if (!data?.[fixedApis.box1]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box1];
                    const teamData = response?.data?.data || response?.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    return (
                      <>
                        <h5>
                          <strong>{teamData?.total_riders || teamData?.total_rider || 0}</strong>Riders
                        </h5>

                        <Link href={buildUrlWithParams("amount-of-riders")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Box2: Team Total Wins  */}
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <div className="text-wraper text-center">
                  <h3 className="text-uppercase fw-900 font-archivo fs-chenge ">
                    {data?.[fixedApis.box2]?.message}
                  </h3>
                  {(() => {
                    if (!data?.[fixedApis.box2]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box2];
                    const teamData = response?.data?.data || response?.data;

                    if (!teamData) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }
                    return (
                      <div className="name-wraper">
                        <h5 className="fst-italic">
                          <strong>{teamData.total_wins || teamData.totalTeamWins || teamData.wins || 0}</strong>
                        </h5>
                      </div>);
                  })()}
                </div>
              </div>
            </div>

            {/* Box3: Rider with Most Wins in Team History  */}
            {/* <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <Link href={buildUrlWithParams("rider-with-most-wins")} className="pabs" />
                <div className="text-wraper">
                  <h4>
                    {data?.[fixedApis.box3]?.message}
                  </h4>
                  {(() => {
                    if (!data?.[fixedApis.box3]) {
                      return <ErrorMessage errorType="no_data" />;
                    }

                    const response = data[fixedApis.box3];
                    const riderData = response?.data?.data || response?.data;

                    if (!riderData || (Array.isArray(riderData) && riderData.length === 0)) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }

                    // Handle both array and single object responses
                    const rider = Array.isArray(riderData) ? riderData[0] : riderData;

                    return (
                      <>
                        <div className="name-wraper name-wraper-white name-left">
                          {renderFlag(rider?.country_code || rider?.country || rider?.flag)}
                          <h6>{rider?.rider_name || rider?.riderName || rider?.name || "..."}</h6>
                        </div>
                        {rider?.wins && (
                          <h5>
                            <strong>{rider.wins}</strong> wins
                          </h5>
                        )}
                        <Link href={buildUrlWithParams("rider-with-most-wins")} className="green-circle-btn">
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div> */}

          </>
        )}
      </div>
    </div>
  );
};

export default TeamFirstSection;
