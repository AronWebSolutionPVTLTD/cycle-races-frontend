import Link from "next/link";
import { useMultipleData } from "../home_api_data";
import { BoxSkeleton, ErrorMessage, ErrorStats } from "../loading&error";
import { useRouter } from "next/router";
import { renderFlag } from "../RenderFlag";

const TeamThirdSection = ({ teamId, teamName, teamSlug, filterYear }) => {
  const router = useRouter();
  const fixedApis = {
    box1: "MostTop10InRaces",
    box2: "totalWinsPerYear",
    box3: "RiderWithMostUciPoints",

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
    const slugForUrl = teamSlug || (teamName ? teamName : teamId);
    const basePath = `/teams/${slugForUrl}/${statsPath}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const teamEndpoints = [
    fixedApis.box1,
    fixedApis.box2,
    fixedApis.box3,
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
    const paths = [
      response?.data?.wins,
      response?.data?.last_victories,
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
      <div className="row">
        {loading && <BoxSkeleton />}

        {error && Object.keys(data || {}).length === 0 && (
          <ErrorStats message="Unable to load team statistics. Please try again later." />
        )}

        {!loading && !(error && Object.keys(data || {}).length === 0) && (
          <>
            <div className="col-lg-4 col-md-6">
              <div className="list-white-cart lime-green-cart ctm-card ctm_card_2">
                <Link href={buildUrlWithParams("most-top-10-in-races")} className="pabs" />

                {(() => {

                  if (!data?.[fixedApis.box1]) {
                    return <> <h4 className="font-size-change">
                      {" "}
                      {data?.[fixedApis.box1]?.message || response?.message || "Most top 10 in races"}
                    </h4>
                      <div className="no-data-wrap">
                        <ErrorMessage errorType="no_data" />
                      </div>
                    </>;
                  }

                  const response = data[fixedApis.box1];
                  const ridersList = response?.data?.riders || response?.data?.data?.riders || response?.riders;

                  if (!ridersList || !Array.isArray(ridersList) || ridersList.length === 0) {
                    return <> <h4 className="font-size-change">
                      {" "}
                      {data?.[fixedApis.box1]?.message || response?.message || "Most top 10 in races"}
                    </h4>
                      <div className="no-data-wrap">
                        <ErrorMessage errorType="no_data_found" />
                      </div>
                    </>
                  }

                  return (
                    <>
                      <div className="card-content-wraper">
                        <h4 className="font-size-change">
                          {" "}
                          {data?.[fixedApis.box1]?.message || response?.message || "Most top 10 in races"}
                        </h4>
                        <ul>
                          {ridersList
                            .slice(0, 3)
                            .map((rider, index) => (
                              <li key={rider?.rider_id || index}>
                                <span>{index + 1}</span>
                                <div className="name-wraper name-wraper-white">
                                  <Link href={`/riders/${rider?.rider_id}`} className="pabs" />
                                  {renderFlag(rider?.rider_country || rider?.country_code || rider?.country || rider?.nationality)}
                                  <h6 className="clamp-text">
                                    {rider?.rider_name || rider?.name || "..."}
                                  </h6>
                                </div>
                                {rider?.top10_count && <span>{rider.top10_count}</span>}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="image_link-wraper">
                        <div className="link_box">
                          <Link href={buildUrlWithParams("most-top-10-in-races")} className="green-circle-btn">
                            <img src="/images/arow.svg" alt="" />
                          </Link>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="team-cart">
                <Link href={buildUrlWithParams("total-wins-per-year")} className="pabs" />

                <div className="text-wraper">

                  <h4 className="font-size-change">
                    {data?.[fixedApis.box2]?.message || "Total Wins per Year"}
                  </h4>

                  {(() => {
                    const response = data?.[fixedApis.box2];
                    if (!response) return <ErrorMessage errorType="no_data" />;

                    const winsData = response?.data?.wins?.[0];
                    if (!winsData) return <ErrorMessage errorType="no_data_found" />;

                    return (
                      <>

                        <div className="name-wraper name-wraper-green name-left">
                          <h6>{winsData.year}</h6>
                        </div>


                        <h5 className="wins-big-count">
                          <strong>{winsData.totalWins}</strong> wins
                        </h5>


                        <Link
                          href={buildUrlWithParams("total-wins-per-year")}
                          className="green-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="team-cart lime-green-team-cart img-active team-cart-extra">
                <Link href={buildUrlWithParams("rider-with-most-uci-points")} className="pabs" />

                <div className="text-wraper">

                  <h4 className="font-size-change">
                    {data?.[fixedApis.box3]?.message || "Riders with most UCI points"}
                  </h4>

                  {(() => {
                    const response = data?.[fixedApis.box3];
                    if (!response) return <ErrorMessage errorType="no_data" />;

                    const ridersList = response?.data?.riders;

                    if (!ridersList || ridersList.length === 0) {
                      return <ErrorMessage errorType="no_data_found" />;
                    }


                    const rider = ridersList[0];


                    const riderImage = "/images/player6.png";

                    return (
                      <>

                        <div className="name-wraper name-wraper-white name-left" onClick={() => router.push(`/riders/${rider?.rider_id}`)}>
                          {renderFlag(rider?.rider_country)}
                          <h6>{rider?.rider_name}</h6>
                        </div>


                        <h5 className="teamcard-number">
                          <strong>{rider?.total_uci_points}</strong> POINTS
                        </h5>


                        <Link
                          href={buildUrlWithParams("rider-with-most-uci-points")}
                          className="white-circle-btn"
                        >
                          <img src="/images/arow.svg" alt="" />
                        </Link>


                        <div className="image_link-wraper team-card-img">
                          <img
                            src={riderImage}
                            alt={rider?.rider_name}
                            className="absolute-img"
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default TeamThirdSection;
