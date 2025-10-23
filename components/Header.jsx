import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RiSearchLine } from "react-icons/ri";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("");
  const [atTop, setAtTop] = useState(true);
  const [showStickyTop, setShowStickyTop] = useState(false);
    const router=useRouter();
    const isActive = (path) => pathname === path;

    const toggleNav = () => {
      setIsOpen(!isOpen);
    };
   
useEffect(() => {
  const riderDetailRegex = /^\/riders\/[\w\d-%\s]+$/;
  const raceDetailRegex = /^\/races\/[^/]+$/;
  setIsDetailPage(riderDetailRegex.test(pathname) || raceDetailRegex.test(pathname));
}, [pathname]);

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

let headerClass = isDetailPage ? "absolute-header" : "relative-header";
if (!atTop) {
  headerClass += " sticky-header";
  if (showStickyTop) {
    headerClass += " sticky-top";
  }
}


  return (
    <header className={headerClass}>
      <div className="header_overlay"></div>
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
                      <Link href="/" onClick={()=>setIsOpen(false)}>Home</Link>
                    </li>
                    <li className={isActive("/stats") ? "active" : ""}>
                      <Link
                        href="/stats"
                        onClick={()=>setIsOpen(false)}
                      >
                        Stats
                      </Link>
                    </li>
                    <li  className={isActive("/races") ? "active" : ""}>  
                      <Link
                        href="/races"
                       onClick={()=>setIsOpen(false)}
                      >
                        Races
                      </Link>
                    </li>
                    <li
                      className={`slim-last ${
                        isActive("/riders") ? "active" : ""
                      }`}
                    >
                      <Link href="/riders" onClick={()=>setIsOpen(false)}>Riders</Link>
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
                </ul>
              </nav>
            </div>
            <div className="search-wraper">
              <a href="#?">
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
    </header>
  );
}
