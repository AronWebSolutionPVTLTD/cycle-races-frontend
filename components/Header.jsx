import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
  const raceDetailRegex = /^\/races\/[\w\d-%\s]+$/;
  setIsDetailPage(riderDetailRegex.test(pathname) || raceDetailRegex.test(pathname));
}, [pathname]);

useEffect(() => {
  let timeoutId = null;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setAtTop(currentScrollY <= 200);

    if (currentScrollY > 200) {
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
      <div className="container">
        <div className="header-content-wraper">
          <Link href="/" className="logo">
            {!isDetailPage ? (
              <img src="/images/site-logo.svg" alt="Wielerstats Logo" />
            ) : (
              <img src="/images/dark-bg-logo.svg" alt="Wielerstats Logo" />
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
                <Image
                  src="/images/search-icon.svg"
                  alt="Search"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
