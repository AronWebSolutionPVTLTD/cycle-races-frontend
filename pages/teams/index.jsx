import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import TeamCard from "@/components/TeamCard";
import SidebarList from "@/components/SidebarList";
import { getTeamSearchList } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import { useMultipleData } from "@/components/home_api_data";
import { CardSkeleton, ListSkeleton } from "@/components/loading&error";

export default function Teams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [firstTenTeams, setFirstTenTeams] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const {
    data: sidebarsData,
    loading: sidebarsLoading,
    error: sidebarsError,
  } = useMultipleData(["teamWithMostWins", "teamRanking", "oldestTeam"], {
    endpointsMappings: {
      teamWithMostWins: "/teamDetails/TeamWithMostWinsThisYear",
      teamRanking: "/teamDetails/teamRankingCurrentYear",
      oldestTeam: "/teamDetails/OldestTeam",
    },
  });

  useEffect(() => {
    fetchTeams();
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

  const fetchTeams = async (query = "") => {
    setLoading(true);
    try {
      getTeamSearchList(query)
        .then((response) => {
          if (response.status === "success") {
            setTeams(response.data);
            setFirstTenTeams(response.data.slice(0, 18));
            setError(null);
          } else {
            setError(response.error || "Failed to load teams");
          }
        })
        .catch((err) => {
          console.error("Unhandled error in fetchTeams:", err);
          setError("An unexpected error occurred while fetching team data");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError("Critical error loading teams data");
      setLoading(false);
    }
  };

  const generateSuggestions = (query) => {
    if (!query.trim()) {
      return [];
    }

    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    teams.forEach((team) => {
      if (team.teamName && team.teamName.toLowerCase().includes(lowerQuery)) {
        suggestions.push(team);
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
      setSelectedTeam(null);
      setSearchSuggestions([]);
      setShowSuggestions(false);
      fetchTeams("");
      return;
    }
    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      getTeamSearchList(query)
        .then((response) => {
          if (response.status === "success") {
            setTeams(response.data);
            const suggestions = response.data.filter((team) => {
              return team.teamName && team.teamName.toLowerCase().includes(query.toLowerCase());
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
    fetchTeams(searchQuery);
  };

  const handleSearchReset = () => {
    setSearchQuery("");
    setSelectedTeam(null);
    setShowSuggestions(false);
    fetchTeams("");
  };

  const handleSelectSuggestion = (team) => {
    setSearchQuery(team.teamName);
    setSelectedTeam(team);

    const filteredList = [team];
    setFirstTenTeams(filteredList);
    setShowSuggestions(false);

    if (team?.teamSlug) {
      router.push(`/teams/${encodeURIComponent(team.teamSlug)}`);
    }
  };

  const handleFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
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

  const renderRidersList = () => {
    if (loading) {
      return <ListSkeleton />;
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

    if (firstTenTeams.length === 0) {
      return (
        <li
          className="empty-state"
          style={{ textAlign: "center", padding: "20px" }}
        >
          No teams found matching your search.
        </li>
      );
    }

    return firstTenTeams.map((team, teamIndex) => (
      <TeamCard
        key={`team-${teamIndex}-${team._id || team.teamSlug}`}
        teamName={team.teamSlug}
        flag={team.flag}
        teamId={team._id}
      />
    ));
  };

  const formatTeamsForSidebar = (teamsData, showWins = false, showPoints = false, showAge = false) => {
    if (!teamsData || !Array.isArray(teamsData)) return [];

    return teamsData.slice(0, 3).map((team) => {
      const flag = team.flag || team.country || "gb";
      let displayValue = "";

      if (showWins && team.wins !== undefined) {
        displayValue = `${team.wins} `;
      } else if (showPoints && (team.points !== undefined || team.point !== undefined)) {
        const points = team.points || team.point || 0;
        displayValue = `${points} pt`;
      } else if (showAge && (team.age !== undefined || team.teamAge !== undefined)) {
        const age = team.age || team.teamAge || 0;
        displayValue = `${age} jaar`;
      }

      return {
        name: team.teamName || team.team_name || team.name,
        age: displayValue,
        flag: typeof flag === "string" ? flag.toUpperCase() : flag,
        teamSlug: team.teamSlug
      };
    });
  };

  const renderSidebars = () => {
    if (sidebarsLoading) {
      return <CardSkeleton />;
    }

    if (sidebarsError) {
      return (
        <div
          className="sidebar-error"
          style={{ color: "red", padding: "15px" }}
        >
          Error loading team statistics
        </div>
      );
    }

    const teamWithMostWins = {
      data: sidebarsData?.teamWithMostWins?.data?.data || [],
      title: sidebarsData?.teamWithMostWins?.message || "Team met meeste overwinningen",
    };

    const teamRanking = {
      data: sidebarsData?.teamRanking?.data?.teams || [],
      title: sidebarsData?.teamRanking?.message || "Team ranking",
    };

    const oldestTeam = {
      data: sidebarsData?.oldestTeam?.data || [],
      title: sidebarsData?.oldestTeam?.message || "Oudste team",
    };

    return (
      <>
        {teamWithMostWins.data.length > 0 && (
          <SidebarList
            title={teamWithMostWins.title}
            riders={formatTeamsForSidebar(teamWithMostWins.data, true)}
            link="team-with-most-wins-this-year"
          />
        )}

        {teamRanking.data.length > 0 && (
          <SidebarList
            title={teamRanking.title}
            riders={formatTeamsForSidebar(teamRanking.data, false, true, false)}
            link="team-ranking"
          />
        )}

        {oldestTeam.data.length > 0 && (
          <SidebarList
            title={oldestTeam.title}
            riders={formatTeamsForSidebar(oldestTeam.data, false, false, true)}
            link="oldest-team"
          />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Teams | Cycling Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/ws_favicon.png" />
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
                  <li>Teams</li>
                </ul>
                <h1>Teams</h1>
                <div className="searchInput 333" ref={searchRef}>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="wraper">
                      <div className="wrap-top">
                        <input
                          type="text"
                          placeholder="Welke team zoek je ?"
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
                            </svg>
                          </span>
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
                            searchSuggestions.map((team, idx) => (
                              <li
                                key={`suggestion-${idx}-${team._id || team.teamName}`}
                                onClick={() => handleSelectSuggestion(team)}
                              >
                                <div>
                                  <span>{team.teamName}</span>
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

              <div className="col-lg-9 col-md-7 ctm-table-wrap">
                <ul className="head-heading teams ctm-table-ul">
                  <li>Uci worldTeams</li>
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
