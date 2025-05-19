import React, { useState, useEffect } from 'react'

import Flag from 'react-world-flags'
import { ErrorStats, LoadingStats } from '../../loading&error'
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
   

    // Prepare endpoints to fetch data from
    const endpointsToFetch = [firstSectionEndpoint, secondSectionEndpoint];
    
    // Fetch data for both sections using the selected endpoints
    const { data, loading, error } = useMultipleData(endpointsToFetch);

    // Check if we have all data for every endpoint
    const allDataLoaded = endpointsToFetch.every(endpoint => data && data[endpoint]);
    
    // Single loading state - only show loading when not all endpoints have data
    const isLoading = !allDataLoaded && loading;
    
    // Show data when all endpoints have returned data
    const showData = allDataLoaded;
    
    // Show error state only if there's an error and not all data loaded
    const showError = error && !allDataLoaded;

    // Check if we have partial success (some data loaded but not all)
    const partialSuccess = error && data && Object.keys(data).some(key => data[key]) && !allDataLoaded;

    // Custom warning component for partial success
    const PartialDataWarning = () => (
        <div className="warning-banner w-100 p-3 alert alert-warning">
            <p className="mb-1">Some data couldn't be loaded. Displaying available information.</p>
            {error && error.failedEndpoints && (
                <details>
                    <summary className="cursor-pointer">View details</summary>
                    <p className="mt-2 mb-0">Failed to load: {error.failedEndpoints.join(", ")}</p>
                    <p className="mb-0">Try refreshing for new random endpoints.</p>
                </details>
            )}
        </div>
    );

    return (
        <section className="home-banner">
            <div className="container">
                <div className="row">
                    {partialSuccess && <PartialDataWarning />}
                    
                    <div className="col-lg-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>uitslagen</h2>
                            <a href="#?" className="alle-link m-0">
                                Alle statistieken <img src="/images/arow2.svg" alt="" />
                            </a>
                        </div>
                    </div>

                    {/* Show single loading state until ALL endpoints return data */}
                    {isLoading && <div className="col-12"><LoadingStats /></div>}
                    
                    {/* Show error state only if there's an error and not all data loaded */}
                    {showError && !partialSuccess && <div className="col-12"><ErrorStats message={error.message} /></div>}

                    {/* Only show content when all data is loaded */}
                    {showData && (
                        <>
                        {/* First Section - Left Side */}
                        <div className="col-lg-3 col-md-5">
                            <div className="list-white-cart">
                                <h4>{data[firstSectionEndpoint].message || "Top Riders"}</h4>
                                {data[firstSectionEndpoint].data.data.slice(0, 3).map((el, index) => (
                                    <ul key={index}>
                                        <li>
                                            <strong>{index + 1}</strong>
                                            <div className="name-wraper">
                                                <Flag
                                                    code={el.rider_country.toUpperCase()}
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
                        </div>

                        {/* Second Section - Right Side */}
                        <div className="col-lg-9 col-md-7">
                            <div className="section-title mb-3">
                                <h4>{data[secondSectionEndpoint].message || "Race Results"}</h4>
                            </div>
                            {data[secondSectionEndpoint].data.data.slice(0, 4).map((riders, index) => (
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
                        </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ResultSection;