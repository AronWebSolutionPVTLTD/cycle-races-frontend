import React, { useState, useEffect } from "react";
import { useMultipleData } from "../../home_api_data";
import { ErrorMessage, ErrorStats, LoadingStats } from "../../loading&error";
import { renderFlag } from "@/components/RenderFlag";

const MostStageWins = ({
    selectedNationality = null,
    name = null,
}) => {
    const apiOptions = {
        box1: "getRiderWithMostStageWins",
    };

    const buildQueryParams = () => {
        let params = {};
        if (selectedNationality) params.nationality = selectedNationality;
        return params;
    };

    // Create array of endpoints to fetch
    const endpointsToFetch = [apiOptions.box1];

    // Fetch data using the selected API endpoint with optional filters
    const { data, loading, error } = useMultipleData(endpointsToFetch, {
        name: name || "UAE Tour", // Make sure name is set
        queryParams: buildQueryParams(),
        idType: "stageStats",
    });

    // Add more debugging
    console.log('Component props:', { selectedNationality, name });
    console.log('Query params:', buildQueryParams());

    // Add debugging
    console.log('API Response:', data);
    console.log('Box1 Data:', data?.[apiOptions.box1]);

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
                                    <h3>{data?.[apiOptions.box1]?.message || "Most Wins"}</h3>
                                    {(() => {
                                        if (!data?.[apiOptions.box1]) {
                                            return <ErrorMessage errorType="no_data" />;
                                        }

                                        const response = data[apiOptions.box1];
                                        // FIXED: Correct path to rider data
                                        const riderData = response?.data?.data?.rider;
                                        
                                        if (!riderData) {
                                            return <ErrorMessage errorType="no_data_found" />;
                                        }
                                        
                                        return (
                                            <>
                                                <div>
                                                    <div className="most-win">
                                                        {renderFlag(riderData?.country)}
                                                        <h4>{riderData.rider_name}</h4>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                {(() => {
                                    if (!data?.[apiOptions.box1]) {
                                        return <ErrorMessage errorType="no_data" />;
                                    }

                                    const response = data[apiOptions.box1];
                                    // FIXED: Use consistent path - same as above
                                    const riderData = response?.data?.data?.rider;
                                    
                                    if (!riderData) {
                                        return <ErrorMessage errorType="no_data_found" />;
                                    }
                                    
                                    return (
                                        <div className="win-count">
                                            {riderData.count && <span>{riderData.count}</span>}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MostStageWins;