import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { homePageSearch } from "@/lib/api";
import { useTranslation } from "@/lib/useTranslation";

export default function Header({ isDetailPage }) {
  const [isOpen, setIsOpen] = useState(false);
  // const [isDetailPage, setIsDetailPage] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [showStickyTop, setShowStickyTop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const isActive = (path) => {
    const router = useRouter();
    if (path === "/") {
      return router.pathname === "/";
    }
    return router.asPath.startsWith(path);
  };


  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  let headerClass = isDetailPage ? "absolute-header" : "relative-header";

  useEffect(() => {
    let timeoutId = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setAtTop(currentScrollY <= 100);

      if (currentScrollY > 100) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowStickyTop(true);
        }, 50);
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


  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  }, []);


  const handleSearchReset = () => {
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };


  const performSearch = async (query) => {
    setIsSearchLoading(true);
    try {
      const response = await homePageSearch(query);
      if (response.status === "success") {
        const results = response.data || [];
        const limitedResults = results.slice(0, 10);
        setSearchSuggestions(limitedResults);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchSuggestions([]);
      setShowSuggestions(true);
    } finally {
      setIsSearchLoading(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
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


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };


  const handleSearchIconClick = (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
    setTimeout(() => {
      const input = document.querySelector('.header-search-modal input[type="text"]');
      if (input) {
        input.focus();
      }
    }, 100);
  };


  const getResultUrl = (item) => {
    const itemType = item.type?.toLowerCase();

    if (itemType === "rider" || item.riderSlug) {
      const riderSlug = item.riderSlug;
      if (riderSlug) {
        return `/riders/${riderSlug}`;
      }
    }

    if (itemType === "race" || item.raceSlug) {
      const raceSlug = item.raceSlug;
      if (raceSlug) {
        return `/races/${encodeURIComponent(raceSlug)}`;
      }
    }

    if (itemType === "team" || item.teamSlug) {
      const teamSlug = item.teamSlug;
      if (teamSlug) {
        return `/teams/${encodeURIComponent(teamSlug)}`;
      }
    }

    return null;
  };

  const getResultName = (item) => {
    let name = "";
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
    const teamName = item.team_name || item.teamName || item.team || item.club || "";
    const teamType = item.team_type || item.teamType || ""; // e.g., "CLUB", "CT", "WT"
    const isRider = item.type === "rider" || item.rider_id || item._id || item.riderId;


    if (isRider) {
      if (teamName && teamName.trim() !== "") {
        if (teamType) {
          return `${name} (${teamName} (${teamType}))`;
        }
        return `${name} (${teamName})`;
      } else {
        return `${name} (NO TEAM)`;
      }
    } else {
      if (teamName && teamName.trim() !== "") {
        if (teamType) {
          return `${name} (${teamName} (${teamType}))`;
        }
        return `${name} (${teamName})`;
      }
      return name;
    }
  };

  const handleSelectSuggestion = (item) => {
    const url = getResultUrl(item);
    if (url) {
      router.push(url);
      handleSearchClose();
    }
  };

  // let headerClass = isDetailPage ? "absolute-header" : "relative-header";
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
                <img src="/images/site-logo-1.svg" alt="Wielerstats Logo" />
              ) : (
                <>
                  <img src="/images/footer.png" alt="Wielerstats Logo" className="dark-logo" />
                  <img src="/images/site-logo-1.svg" className="light-logo" alt="Wielerstats Logo" />
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
                        <Link href="/" onClick={() => setIsOpen(false)}>{t("header.home")}</Link>
                      </li>

                      <li className={isActive("/stats") ? "active" : ""}>
                        <Link href="/stats" onClick={() => setIsOpen(false)}>{t("header.stats")}</Link>
                      </li>

                      <li className={isActive("/races") ? "active" : ""}>
                        <Link href="/races" onClick={() => setIsOpen(false)}>{t("header.races")}</Link>
                      </li>

                      <li className={isActive("/riders") ? "active" : ""}>
                        <Link href="/riders" onClick={() => setIsOpen(false)}>{t("header.riders")}</Link>
                      </li>
                      <li className={isActive("/head-to-head") ? "active" : ""}>
                        <Link href="/head-to-head" onClick={() => setIsOpen(false)}>{t("header.head_to_head")}</Link>
                      </li>
                      <li className={`slim-last ${isActive("/teams") ? "active" : ""}`}>
                        <Link href="/teams" onClick={() => setIsOpen(false)}>{t("header.teams")}</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
                <nav className="d-none d-lg-block">
                  <ul>
                    <li className={isActive("/") ? "active" : ""}>
                      <Link href="/">{t("header.home")}</Link>
                    </li>

                    <li className={isActive("/stats") ? "active" : ""}>
                      <Link href="/stats">{t("header.stats")}</Link>
                    </li>

                    <li className={isActive("/races") ? "active" : ""}>
                      <Link href="/races">{t("header.races")}</Link>
                    </li>

                    <li className={isActive("/riders") ? "active" : ""}>
                      <Link href="/riders">{t("header.riders")}</Link>
                    </li>
                    <li className={isActive("/head-to-head") ? "active" : ""}>
                      <Link href="/head-to-head">{t("header.head_to_head")}</Link>
                    </li>
                    <li className={isActive("/teams") ? "active" : ""}>
                      <Link href="/teams">{t("header.teams")}</Link>
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
                            <span>{t("common.searching")}...</span>
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
                            <span>{t("common.no_items_matches_to_your_search")}</span>
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
