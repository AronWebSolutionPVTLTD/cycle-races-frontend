// pages/riders/index.js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import RiderCard from "@/components/RiderCard";
import SidebarList from "@/components/SidebarList";
import { getTeamsRiders } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { useMultipleData } from "@/components/home_api_data";
import { CardSkeleton, ListSkeleton } from "@/components/loading&error";
import { RiSearchLine } from "react-icons/ri";

export default function Riders() {
  const router = useRouter();
  const [teamRiders, setTeamRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [firstTenRiders, setFirstTenRiders] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const {
    data: sidebarsData,
    loading: sidebarsLoading,
    error: sidebarsError,
  } = useMultipleData(["olderstRiders", "youngestRiders", "victoryRanking"], {
    endpointsMappings: {
      olderstRiders: "/riders/oldestRiders",
      youngestRiders: "/riders/youngestRiders",
      victoryRanking: "/riders/victoryRanking",
    },
  });

  useEffect(() => {
    fetchRiders();

    // Add click outside listener to close suggestions
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Function to fetch riders data
  const fetchRiders = async (query = "") => {
    setLoading(true);
    try {
      getTeamsRiders(query)
        .then((response) => {
          if (response.status === "success") {
            // Process data for display
            console.log(response);
            
            setTeamRiders(response.data);
            setFirstTenRiders(response.data.slice(0, 10));
            setError(null);
          } else {
            setError(response.error || "Failed to load riders");
          }
        })
        .catch((err) => {
          console.error("Unhandled error in fetchRiders:", err);
          setError("An unexpected error occurred while fetching rider data");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError("Critical error loading riders data");
      setLoading(false);
    }
  };

  // Generate suggestions from teamRiders based on search query
  const generateSuggestions = (query) => {
    if (!query.trim()) {
      return [];
    }

    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    teamRiders.forEach((team) => {
      if (team.riders && team.riders.length > 0) {
        team.riders.forEach((rider) => {
          if (rider.riderName.toLowerCase().includes(lowerQuery)) {
            suggestions.push({
              ...rider,
              teamName: team.teamName,
            });
          }
        });
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  };

  // Handle search input change with API call
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If query is empty, reset to default view
    if (!query.trim()) {
      setSelectedRider(null);
      setSearchSuggestions([]);
      setShowSuggestions(false);
      fetchRiders("");
      return;
    }

    // Debounce API calls (300ms)
    debounceTimerRef.current = setTimeout(() => {
      // Make API call for search results
      getTeamsRiders(query)
        .then((response) => {
          if (response.status === "success") {
            // Update teamRiders with the filtered results
            setTeamRiders(response.data);

            // Create suggestions from these results
            const suggestions = [];
            response.data.forEach((team) => {
              if (team.riders && team.riders.length > 0) {
                team.riders.forEach((rider) => {
                  suggestions.push({
                    ...rider,
                    teamName: team.teamName,
                  });
                });
              }
            });
            setSearchSuggestions(suggestions.slice(0, 10));
            setShowSuggestions(suggestions.length > 0);
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
          // On error, use local filtering as fallback
          const localSuggestions = generateSuggestions(query);
          setSearchSuggestions(localSuggestions);
          setShowSuggestions(localSuggestions.length > 0);
        });
    }, 300);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    fetchRiders(searchQuery);
  };

  // Handle search reset
  const handleSearchReset = () => {
    setSearchQuery("");
    setSelectedRider(null);
    setShowSuggestions(false);
    fetchRiders("");
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (rider) => {
    setSearchQuery(rider.riderName);
    // setShowSuggestions(false);
    setSelectedRider(rider);

    // Create a filtered list with just the selected rider's team
    const filteredTeam = teamRiders.find(
      (team) => team.teamName === rider.teamName
    );

    if (filteredTeam) {
      // Create a filtered version of the team with only the selected rider
      const filteredList = [
        {
          ...filteredTeam,
          riders: [rider],
        },
      ];

      setFirstTenRiders(filteredList);
    }

    // Navigate directly to rider detail page per UX requirement
    if (rider?.rider_id) {
      router.push(`/riders/${rider.rider_id}`);
    }
  };

  // Display content based on state
  const renderRidersList = () => {
    if (loading) {
      return (
        // <li
        //   className="loading-state"
        //   style={{ textAlign: "center", padding: "20px" }}
        // >
        //   Loading riders data...
        // </li>
        <ListSkeleton />
      );
    }

    if (error) {
      return (
        <li
          className="error-state"
          style={{
            textAlign: "center",
            padding: "20px",
            color: "red",
          }}
        >
          Error: {error}
        </li>
      );
    }

    if (firstTenRiders.length === 0) {
      return (
        <li
          className="empty-state"
          style={{ textAlign: "center", padding: "20px" }}
        >
          No riders found matching your search.
        </li>
      );
    }

    return firstTenRiders.map((team, teamIndex) =>
      team.riders && team.riders.length > 0
        ? team.riders.map((rider, riderIndex) => (
          <RiderCard
            key={`rider-${teamIndex}-${riderIndex}-${team.teamName}-${rider.rider_id || rider._id || rider.riderName}`}
            name={rider.riderName}
            team={team.teamName}
            flag={rider.riderCountry}
            riderId={rider.rider_id}
          />
        ))
        : null
    );
  };

  const formatRidersForSidebar = (ridersData, showVictories = false) => {
    if (!ridersData || !Array.isArray(ridersData)) return [];

    return ridersData.slice(0, 3).map((rider) => ({
      name: rider.rider_name || rider.riderName || rider.name,
      age:
        showVictories && rider.victories
          ? `${rider.victories} wins`
          : rider.age
            ? `${rider.age} jaar`
            : "",
      flag: rider.country || rider.riderCountry || "/images/flag-default.svg",
    }));
  };

  // Render sidebars with dynamic data
  const renderSidebars = () => {
    if (sidebarsLoading) {
      return (
        // <div className="sidebar-loading">
        //   <FaSpinner
        //     className="animate-spin text-blue-600"
        //     style={{ fontSize: "2rem" }}
        //   />
        //   <p>Loading statistics...</p>
        // </div>
        <CardSkeleton />
      );
    }

    if (sidebarsError) {
      return (
        <div
          className="sidebar-error"
          style={{ color: "red", padding: "15px" }}
        >
          Error loading rider statistics
        </div>
      );
    }

    const oldestRiders = {
      data: sidebarsData?.olderstRiders?.data?.data || [],
      title: sidebarsData?.olderstRiders?.message || "Oudste renner",
    };

    const youngestRiders = {
      data: sidebarsData?.youngestRiders?.data?.data || [],
      title: sidebarsData?.youngestRiders?.message || "Jongste renner",
    };

    const victoryRiders = {
      data: sidebarsData?.victoryRanking?.data?.data || [],
      title:
        sidebarsData?.victoryRanking?.message ||
        `Meeste overwinningen (${sidebarsData?.victoryRanking?.data?.year || ""
        })`,
    };

    return (
      <>
        {oldestRiders.data.length > 0 && (
          <SidebarList
            title={oldestRiders.title}
            riders={formatRidersForSidebar(oldestRiders.data)}
            link="oldest-riders"
          />
        )}

        {youngestRiders.data.length > 0 && (
          <SidebarList
            title={youngestRiders.title}
            riders={formatRidersForSidebar(youngestRiders.data)}
            link="youngest-riders"
          />
        )}

        {victoryRiders.data.length > 0 && (
          <SidebarList
            title={victoryRiders.title}
            riders={formatRidersForSidebar(victoryRiders.data, true)}
            link="victory-ranking"
          />
        )}
      </>
    );
  };

  const handleFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true)
    }
    if (searchRef.current) {
      searchRef.current.classList.add("active-parent");
    }
  };

  const handleBlur = () => {
    if (searchRef.current) {
      searchRef.current.classList.remove("active-parent");
    }
  };

  return (
    <>
      <Head>
        <title>Riders | Cycling Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="inner-pages-main inner-riders-main">
        <div className="dropdown-overlay"></div>
        <section className="riders-sec1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="breadcrumb">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>Riders</li>
                </ul>
                <h1>Riders</h1>
                <div className="searchInput 333" ref={searchRef}>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="wraper">
                      <div className="wrap-top">
                        <input
                          type="text"
                          placeholder="Wie zoek je ?"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        <div className="icon">
                          <span className="search-icon" onClick={handleSearchSubmit}>
                            {/* <RiSearchLine /> */}

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={48}
                              height={48}
                              viewBox="0 0 48 48"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M39.1632 34.3632L48 43.2L43.2 48L34.3632 39.1656C30.6672 42.1224 26.6928 43.2 21.6 43.2C9.6912 43.2 0 33.5112 0 21.6C0 9.6888 9.6912 0 21.6 0C33.5088 0 43.2 9.6888 43.2 21.6C43.2 26.6904 42.1224 30.6648 39.1632 34.3632ZM21.6008 36.0008C13.6602 36.0008 7.2008 29.5414 7.2008 21.6008C7.2008 13.6623 13.6602 7.2008 21.6008 7.2008C29.5414 7.2008 36.0008 13.6623 36.0008 21.6008C36.0008 29.5414 29.5414 36.0008 21.6008 36.0008Z"
                                fill="#D0F068"
                              />
                            </svg>   </span>
                          <input
                            type="reset"
                            value=""
                            className="close"
                            onClick={handleSearchReset}
                          />
                        </div>
                      </div>

                    </div>
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="wrap-bottom">
                        <ul>
                          {searchSuggestions.map((rider, idx) => (
                            <li
                              key={`suggestion-${idx}-${rider.teamName}-${rider.rider_id || rider._id || rider.riderName}`}
                              onClick={() => handleSelectSuggestion(rider)}
                            >
                              <div>
                                <span>{`${rider.riderName} (${rider.teamName})`}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-banner riders-sec2">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h5 className="fw-900">Popular</h5>
              </div>
              <div className="col-lg-9 col-md-7 ctm-table-wrap">
                <ul className="head-heading ctm-table-ul">
                  <li>Name</li>
                  <li>Team</li>
                </ul>

                <ul className="transparent-cart ctm-table-ul">{renderRidersList()}</ul>
              </div>
              <div className="col-lg-3 col-md-5 33">{renderSidebars()}</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
