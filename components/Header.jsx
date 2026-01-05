import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { RiSearchLine } from "react-icons/ri";
import { homePageSearch } from "@/lib/api";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("");
  const [atTop, setAtTop] = useState(true);
  const [showStickyTop, setShowStickyTop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Check if component is mounted (for SSR)
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const isActive = (path) => {
    const router = useRouter();

    // Special case for home
    if (path === "/") {
      return router.pathname === "/";
    }

    // For other routes, check if the current path starts with it
    return router.asPath.startsWith(path);
  };


  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const riderDetailRegex = /^\/riders\/[\w\d-%\s]+$/;
    // const teamDetailRegex = /^\/teams\/[\w\d-%\s]+$/;
    const teamDetailRegex = /^(https?:\/\/[^\s/]+)?\/teams\/[\w\d.%\s-]+$/;
    const raceDetailRegex = /^\/races\/[^/]+$/;
    const pathname = router.asPath.split('?')[0]; // Get pathname without query params
    setIsDetailPage(riderDetailRegex.test(pathname) || raceDetailRegex.test(pathname) || teamDetailRegex.test(pathname));
  }, [router.asPath]);

  useEffect(() => {
    let timeoutId = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setAtTop(currentScrollY <= 100);

      if (currentScrollY > 100) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowStickyTop(true);
        }, 50); // delay in ms
      } else {
        clearTimeout(timeoutId);
        setShowStickyTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle search close
  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  }, []);

  // Handle search reset
  const handleSearchReset = () => {
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Perform search API call
  const performSearch = async (query) => {
    setIsSearchLoading(true);
    try {
      const response = await homePageSearch(query);
      console.log("Search response:", response);
      if (response.status === "success") {
        const results = response.data || [];
        // Limit to first 10 results
        const limitedResults = results.slice(0, 10);
        console.log("Search results (limited to 10):", limitedResults);
        setSearchSuggestions(limitedResults);
        // Show suggestions dropdown even if no results (to show "no items matches" message)
        setShowSuggestions(true);
      } else {
        console.log("Search failed:", response);
        setSearchSuggestions([]);
        setShowSuggestions(true); // Show message even on error
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchSuggestions([]);
      setShowSuggestions(true); // Show message even on error
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Handle click outside search to close it and ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Don't close if clicking on the search icon
        if (!event.target.closest('.search-wraper')) {
          setShowSuggestions(false);
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isSearchOpen) {
        handleSearchClose();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isSearchOpen, handleSearchClose]);

  // Handle search input change with API call
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If query is empty, reset suggestions
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce API calls (300ms)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Handle search icon click
  const handleSearchIconClick = (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
    // Focus on input after modal opens
    setTimeout(() => {
      const input = document.querySelector('.header-search-modal input[type="text"]');
      if (input) {
        input.focus();
      }
    }, 100);
  };

  // Determine result type and get navigation URL
  const getResultUrl = (item) => {
    // Use type field if available (from API response)
    const itemType = item.type?.toLowerCase();
    
    if (itemType === "rider" || item.rider_id || item._id || item.riderId) {
      const riderId = item.rider_id || item._id || item.riderId;
      if (riderId) {
        return `/riders/${riderId}`;
      }
    }
    
    if (itemType === "race" || item.race_name || item.race) {
      const raceName = item.race_name || item.race || item.name;
      if (raceName) {
        return `/races/${encodeURIComponent(raceName)}`;
      }
    }
    
    if (itemType === "team" || item.team_name || item.teamName) {
      const teamName = item.team_name || item.teamName || item.name;
      if (teamName) {
        return `/teams/${encodeURIComponent(teamName)}`;
      }
    }
    
    return null;
  };

  // Get result display name with team/club info
  const getResultName = (item) => {
    let name = "";
    
    // Get the name
    if (item.name) {
      name = item.name;
    } else if (item.rider_name || item.riderName) {
      name = item.rider_name || item.riderName;
    } else if (item.race_name || item.race) {
      name = item.race_name || item.race;
    } else if (item.team_name || item.teamName) {
      name = item.team_name || item.teamName;
    } else {
      name = "Unknown";
    }
    
    // Get team/club information
    const teamName = item.team_name || item.teamName || item.team || item.club || "";
    const teamType = item.team_type || item.teamType || ""; // e.g., "CLUB", "CT", "WT"
    
    // Check if it's a rider with no team
    const isRider = item.type === "rider" || item.rider_id || item._id || item.riderId;
    
    // Format: "NAME (TEAM (TYPE))" or "NAME (TEAM)" or "NAME (NO TEAM)"
    if (isRider) {
      if (teamName && teamName.trim() !== "") {
        if (teamType) {
          return `${name} (${teamName} (${teamType}))`;
        }
        return `${name} (${teamName})`;
      } else {
        // Show "NO TEAM" for riders without a team
        return `${name} (NO TEAM)`;
      }
    } else {
      // For races and teams, only show team if available
      if (teamName && teamName.trim() !== "") {
        if (teamType) {
          return `${name} (${teamName} (${teamType}))`;
        }
        return `${name} (${teamName})`;
      }
      return name;
    }
  };

  // Get result type label
  const getResultType = (item) => {
    // Use type field from API if available
    if (item.type) {
      return item.type.charAt(0).toUpperCase() + item.type.slice(1);
    }
    // Fallback to detecting from fields
    if (item.rider_id || item._id || item.riderId) {
      return "Rider";
    }
    if (item.race_name || item.race) {
      return "Race";
    }
    if (item.team_name || item.teamName) {
      return "Team";
    }
    return "";
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (item) => {
    const url = getResultUrl(item);
    if (url) {
      router.push(url);
      handleSearchClose();
    }
  };

  let headerClass = isDetailPage ? "absolute-header" : "relative-header";
  if (!atTop) {
    headerClass += " sticky-header";
    if (showStickyTop) {
      headerClass += " sticky-top";
    }
  }


  return (
    <>
    <header className={headerClass}>
      <div className="container">
        <div className="header-content-wraper">
          <Link href="/" className="logo">
            {!isDetailPage ? (
              <img src="/images/site-logo.svg" alt="Wielerstats Logo" />
            ) : (
              <>
                <img src="/images/dark-bg-logo.svg" alt="Wielerstats Logo" className="dark-logo" />
                <img src="/images/site-logo.svg" className="light-logo" alt="Wielerstats Logo" />
              </>
            )}
          </Link>
          <div className="menu-wraper">
            <div id="navigation" className="slim-container">
              <div className="slim-bar d-block d-lg-none">
                <a
                  href="#nav"
                  className={`slimNav_sk78-reveal ${isOpen ? "slimclose" : ""}`}
                  onClick={toggleNav}
                  style={{
                    right: "0px",
                    left: "auto",
                    textAlign: "center",
                    textIndent: "0px",
                    fontSize: "18px",
                  }}
                >
                  <span></span>
                  <span></span>
                </a>
                <nav className={`slim-nav ${isOpen ? "active" : ""}`}>
                  <ul
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isOpen ? "500px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <li className={isActive("/") ? "active" : ""}>
                      <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
                    </li>

                    <li className={isActive("/stats") ? "active" : ""}>
                      <Link href="/stats" onClick={() => setIsOpen(false)}>Stats</Link>
                    </li>

                    <li className={isActive("/races") ? "active" : ""}>
                      <Link href="/races" onClick={() => setIsOpen(false)}>Races</Link>
                    </li>

                    <li className={isActive("/riders") ? "active" : ""}>
                      <Link href="/riders" onClick={() => setIsOpen(false)}>Riders</Link>
                    </li>
                    <li  className={isActive("/head-to-head") ? "active" : ""}>
                      <Link href="/head-to-head" onClick={() => setIsOpen(false)}>Head to Head</Link>
                    </li>
                    <li className={`slim-last ${isActive("/teams") ? "active" : ""}`}>
                      <Link href="/teams" onClick={() => setIsOpen(false)}>Teams</Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <nav className="d-none d-lg-block">
                <ul>
                  <li className={isActive("/") ? "active" : ""}>
                    <Link href="/">Home</Link>
                  </li>

                  <li className={isActive("/stats") ? "active" : ""}>
                    <Link href="/stats">Stats</Link>
                  </li>

                  <li className={isActive("/races") ? "active" : ""}>
                    <Link href="/races">Races</Link>
                  </li>

                  <li className={isActive("/riders") ? "active" : ""}>
                    <Link href="/riders">Riders</Link>
                  </li>
                  <li className={isActive("/head-to-head") ? "active" : ""}>
                    <Link href="/head-to-head">Head to Head</Link>
                  </li>
                  <li className={isActive("/teams") ? "active" : ""}>
                    <Link href="/teams">Teams</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="search-wraper">
              <a href="#?" onClick={handleSearchIconClick}>
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
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Modal - Rendered via Portal to ensure proper fixed positioning */}
      {isMounted && isSearchOpen && createPortal(
        <div className="header-search-modal-overlay" onClick={handleSearchClose}>
          <div className="header-search-modal" ref={searchRef} onClick={(e) => e.stopPropagation()}>
            <div className="searchInput">
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <div className="wraper">
                  <div className="wrap-top">
                    <input
                      type="text"
                      placeholder="ZOEK OP RENNER, TEAM OF RACE"
                      value={searchQuery}  
                      onChange={handleSearchChange}
                      onFocus={() => {
                        if (searchSuggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                    />
                    <div className="icon">
                      <span className="search-icon">
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
                      {searchQuery && (
                        <input
                          type="reset"
                          value=""
                          className="close"
                          onClick={handleSearchReset}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="wrap-bottom">
                    <ul>
                      {searchSuggestions.map((item, idx) => {
                        const resultName = getResultName(item);
                        const uniqueKey = `${idx}-${item.rider_id || item._id || item.riderId || item.race_name || item.race || item.team_name || item.teamName || idx}`;
                        
                        return (
                          <li
                            key={uniqueKey}
                            onClick={() => handleSelectSuggestion(item)}
                          >
                            <div>
                              <span className="result-name">{resultName}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {isSearchLoading && searchQuery && (
                  <div className="wrap-bottom">
                    <ul>
                      <li>
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <span>Searching...</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
                {!isSearchLoading && searchQuery && searchSuggestions.length === 0 && showSuggestions && (
                  <div className="wrap-bottom">
                    <ul>
                      <li>
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <span>no items matches to your search</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
    <div className="menu-overlay"></div>
    </>
  );
}
