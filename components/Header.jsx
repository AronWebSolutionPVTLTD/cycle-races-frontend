import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isRiderDetail, setIsRiderDetail] = useState(false);
  const router=useRouter();
  const isActive = (path) => router.pathname === path; // :point_left: helper function

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const riderDetailRegex = /^\/riders\/\d+$/;
    setIsRiderDetail(riderDetailRegex.test(pathname));
  }, [pathname]);

  return (
    <header
      className={`${isRiderDetail ? "absolute-header" : "relative-header"}`}
    >
      <div className="container">
        <div className="header-content-wraper">
          <Link href="/" className="logo">
            {!isRiderDetail ? (
              <img src="/images/header-logo.png" alt="Wielerstats Logo" />
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
                      <Link href="/">Home</Link>
                    </li>
                    <li className={isActive("/stats") ? "active" : ""}>
                      <Link
                        href="/stats"
                        
                      >
                        Stats
                      </Link>
                    </li>
                    <li  className={isActive("/result") ? "active" : ""}>  
                      <Link
                        href="/result"
                       
                      >
                        Results
                      </Link>
                    </li>
                    <li
                      className={`slim-last ${
                        isActive("/riders") ? "active" : ""
                      }`}
                    >
                      <Link href="/riders">Riders</Link>
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

                  <li className={isActive("/result") ? "active" : ""}>
                    <Link href="/result">Results</Link>
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
