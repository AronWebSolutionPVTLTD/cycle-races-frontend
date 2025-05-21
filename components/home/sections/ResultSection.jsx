import React, { useState, useEffect } from 'react';
import Flag from 'react-world-flags';
import { LoadingStats, ErrorStats, NoDataMessage, PartialDataWarning } from '../../loading&error';
import { useMultipleData } from '@/components/home_api_data';

const ResultSection = () => {
    const firstSectionEndpoints = [
        "mostStageWins",
        "stagePodiums",
        "mostGCWins"
    ];

    const secondSectionEndpoints = [
        "getTopStageRiders",
        "topGCRiderbyTeam"
    ];

    // State to track the currently selected endpoints
    const [firstSectionEndpoint, setFirstSectionEndpoint] = useState(firstSectionEndpoints[0]);
    const [secondSectionEndpoint, setSecondSectionEndpoint] = useState(secondSectionEndpoints[0]);
    
    // State to track if component is mounted (client-side)
    const [isMounted, setIsMounted] = useState(false);

    // Function to get a random endpoint from an array
    const getRandomEndpoint = (endpointArray) => {
        const randomIndex = Math.floor(Math.random() * endpointArray.length);
        return endpointArray[randomIndex];
    };                   
  
    // Only select random endpoints on client-side after hydration is complete
    useEffect(() => {
        // Set mounted flag to true
        setIsMounted(true);
        
        try {
            // Get a random endpoint for each section
            const randomFirstEndpoint = getRandomEndpoint(firstSectionEndpoints);
            const randomSecondEndpoint = getRandomEndpoint(secondSectionEndpoints);
            
            // Update state with the randomly selected endpoints
            setFirstSectionEndpoint(randomFirstEndpoint);
            setSecondSectionEndpoint(randomSecondEndpoint);
        } catch (err) {
            console.error("Error selecting random endpoints:", err);
            // Keep the default endpoints if there's an error
        }
    }, []); // Empty dependency array means this runs once on component mount
   
    // Prepare endpoints to fetch data from - only after mounted to ensure client-side execution
    const endpointsToFetch = isMounted ? [firstSectionEndpoint, secondSectionEndpoint] : [];
    
    // Fetch data for both sections using the selected endpoints
    const { data, loading, error } = useMultipleData(endpointsToFetch);
 
    // Debug: Log whenever data or loading status changes
    useEffect(() => {
        console.log("Data status:", { data, loading, error, endpointsToFetch });
    }, [data, loading, error, endpointsToFetch]);

    // Check if we have data for the specific endpoints we're currently using
    const firstSectionDataLoaded = data && data[firstSectionEndpoint];
    const secondSectionDataLoaded = data && data[secondSectionEndpoint];
    
    // Track loaded endpoints for partial data warning
    const loadedEndpoints = [
        firstSectionDataLoaded ? firstSectionEndpoint : null,
        secondSectionDataLoaded ? secondSectionEndpoint : null
    ].filter(Boolean);
    
    // Determine if we have different data states
    const isInitialLoading = loading && loadedEndpoints.length === 0;
    const hasCompleteData = loadedEndpoints.length === endpointsToFetch.length && endpointsToFetch.length > 0;
    const hasPartialData = loadedEndpoints.length > 0 && loadedEndpoints.length < endpointsToFetch.length;
    const hasNoData = !loading && loadedEndpoints.length === 0 && error;
    
    // Helper function to render the first section content
    const renderFirstSectionContent = () => {
        const sectionData = data?.[firstSectionEndpoint];
        if (!sectionData?.data?.data || sectionData.data.data.length === 0) {
            return <NoDataMessage filterYear="All-time" />;
        }
        
        return (
            <div className="list-white-cart">
                <h4>{sectionData.message || "Top Riders"}</h4>
                {sectionData.data.data.slice(0, 3).map((el, index) => (
                    <ul key={index}>
                        <li>
                            <strong>{index + 1}</strong>
                            <div className="name-wraper">
                                <Flag
                                    code={el.rider_country?.toUpperCase()}
                                    style={{
                                        width: "30px",
                                        height: "20px",
                                        marginRight: "10px",
                                    }}
                                />
                                <h6>{el.rider_name}</h6>
                            </div>
                            <span>{el.age}</span>
                        </li>
                    </ul>
                ))}
                <a href="#?" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                </a>
            </div>
        );
    };
    
    // Helper function to render the second section content
    const renderSecondSectionContent = () => {
        const sectionData = data?.[secondSectionEndpoint];
        if (!sectionData?.data?.data || sectionData.data.data.length === 0) {
            return <NoDataMessage filterYear="All-time" />;
        }
        
        return (
            <>
                <div className="section-title mb-3">
                    <h4>{sectionData.message || "Race Results"}</h4>
                </div>
                {sectionData.data.data.slice(0, 4).map((riders, index) => (
                    <ul key={index} className="transparent-cart">
                        <li>
                            <span>{riders.race_date}</span>
                            <h5>
                                <a href="#?">{riders.race_name}</a>
                            </h5>
                            <h6>
                                <Flag 
                                    code={riders.country} 
                                    style={{width:"20px", height:"20px", marginRight:"10px"}}
                                />
                                <a href="#?">{riders.rider_name}</a>
                            </h6>
                            <h6>{riders.team_name}</h6>
                            <a href="#?" className="r-details">
                                <img src="/images/hover-arow.svg" alt="" />
                            </a>
                        </li>
                    </ul>
                ))}
            </>
        );
    };

    // Show a global loading state if we haven't mounted yet (pre-hydration)
    if (!isMounted) {
        return (
            <section className="home-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <LoadingStats />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show global loading state during initial data fetch
    if (isInitialLoading) {
        return (
            <section className="home-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <LoadingStats />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show global error when no data could be loaded
    if (hasNoData) {
        return (
            <section className="home-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <ErrorStats message={error?.message || "Failed to load statistics"} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="home-banner">
            <div className="container">
                <div className="row">
                    {/* Show partial data warning if applicable */}
                    {hasPartialData && (
                        <div className="col-12">
                            <PartialDataWarning 
                                visibleCardCount={loadedEndpoints.length}
                                totalEndpoints={endpointsToFetch.length}
                                error={error}
                            />
                        </div>
                    )}
                    
                    <div className="col-lg-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>uitslagen</h2>
                            <a href="#?" className="alle-link m-0">
                                Alle statistieken <img src="/images/arow2.svg" alt="" />
                            </a>
                        </div>
                    </div>

                    {/* First Section - Only render if data is available */}
                    {firstSectionDataLoaded && (
                        <div className="col-lg-3 col-md-5">
                            {renderFirstSectionContent()}
                        </div>
                    )}

                    {/* Second Section - Only render if data is available */}
                    {secondSectionDataLoaded && (
                        <div className="col-lg-9 col-md-7">
                            {renderSecondSectionContent()}
                        </div>
                    )}
                    
                    {/* Show message if both sections failed but we have partial success */}
                    {hasPartialData && !firstSectionDataLoaded && !secondSectionDataLoaded && (
                        <div className="col-12">
                            <ErrorStats message="Failed to load section data" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ResultSection;