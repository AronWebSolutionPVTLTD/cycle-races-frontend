import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import RiderCard from "@/components/RiderCard";
import SidebarList from "@/components/SidebarList";
import { getTeamsRiders } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import { useMultipleData } from "@/components/home_api_data";
import { CardSkeleton, ListSkeleton, ErrorStats } from "@/components/loading&error";

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
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchRiders = async (query = "") => {
    setLoading(true);
    try {
      getTeamsRiders(query)
        .then((response) => {
          if (response.status === "success") {
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

    return suggestions.slice(0, 10);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (!query.trim()) {
      setSelectedRider(null);
      setSearchSuggestions([]);
      setShowSuggestions(false);
      fetchRiders("");
      return;
    }

    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceTimerRef.current = setTimeout(() => {
      getTeamsRiders(query)
        .then((response) => {
          if (response.status === "success") {
            setTeamRiders(response.data);
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
            setShowSuggestions(true);
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
          const localSuggestions = generateSuggestions(query);
          setSearchSuggestions(localSuggestions);
          setShowSuggestions(true);
        });
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    fetchRiders(searchQuery);
  };

  const handleSearchReset = () => {
    setSearchQuery("");
    setSelectedRider(null);
    setShowSuggestions(false);
    fetchRiders("");
  };

  const handleSelectSuggestion = (rider) => {
    setSearchQuery(rider.riderName);
    setSelectedRider(rider);

    const filteredTeam = teamRiders.find(
      (team) => team.teamName === rider.teamName
    );

    if (filteredTeam) {
      const filteredList = [
        {
          ...filteredTeam,
          riders: [rider],
        },
      ];

      setFirstTenRiders(filteredList);
    }
    if (rider?.rider_id) {
      router.push(`/riders/${rider.riderSlug}`);
    }
  };

  const renderRidersList = () => {
    if (loading) {
      return (
        <ListSkeleton />
      );
    }

    if (firstTenRiders.length === 0) {
      return null;
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
          riderSlug={rider.riderSlug}          />
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
      rider_id: rider.rider_id || rider._id || rider.riderId,
      slug:rider.riderSlug

    }));
  };

  const renderSidebars = () => {
    if (sidebarsLoading) {
      return (
        <CardSkeleton />
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
                    {showSuggestions && (
                      <div className="wrap-bottom">
                        <ul>
                          {searchSuggestions.length > 0 ? (
                            searchSuggestions.map((rider, idx) => (
                              <li
                                key={`suggestion-${idx}-${rider.teamName}-${rider.rider_id || rider._id || rider.riderName}`}
                                onClick={() => handleSelectSuggestion(rider)}
                              >
                                <div>
                                  <span>{`${rider.riderName} (${rider.teamName})`}</span>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="no-results">
                              <div>
                                <span>NO ITEMS MATCHES TO YOUR SEARCH</span>
                              </div>
                            </li>
                          )}
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
                {loading ? (
                  <ListSkeleton />
                ) : error ? (
                  <div className="col-12">
                    <ErrorStats message={error || "Failed to load riders. Please try again later."} />
                  </div>
                ) : firstTenRiders.length > 0 ? (
                  <ul className="transparent-cart ctm-table-ul">{renderRidersList()}</ul>
                ) : (
                  <ul className="transparent-cart ctm-table-ul">
                    <li>
                      <div
                        className="empty-state"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No riders found matching your search.
                      </div>
                    </li>
                  </ul>
                )}
              </div>
              <div className="col-lg-3 col-md-5 33">
                {sidebarsLoading ? (
                  <CardSkeleton />
                ) : sidebarsError ? (
                  <div className="col-12">
                    <ErrorStats message="Failed to load rider statistics. Please try again later." />
                  </div>
                ) : (
                  renderSidebars()
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
