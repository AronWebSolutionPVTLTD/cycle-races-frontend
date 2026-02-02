
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { callAPI } from "@/lib/api";
import TeamFirstSection from "@/components/team_detail/TeamFirstSection";
import { renderFlag } from "@/components/RenderFlag";
import TeamSecondSection from "@/components/team_detail/TeamSecondSection";
import TeamThirdSection from "@/components/team_detail/TeamThirdSection";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";

export default function TeamDetail({ initialTeam ,apiError}) {
  const router = useRouter();
  const [headerData, setHeaderData] = useState(initialTeam);
  const [filterYear, setFilterYear] = useState("All-time");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);
  const [dynamicYears, setDynamicYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(false);
  const allYearOptions = dynamicYears.length > 0 ? ["All-time", ...dynamicYears] : ["All-time"];
  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      return allYearOptions;
    }
    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return dynamicYears.filter((year) =>
        year.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return allYearOptions.filter((year) =>
      year.toString().toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setFilterYear(value);
        setYearInput("");
        setShowYearDropdown(false);
        break;
    }
  };
  const handleYearInputChange = (value) => {
    setYearInput(value);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!headerData?.slug) return;
  const fetchTeamActiveYears = async () => {
    try {
      setYearsLoading(true);
      const response = await callAPI("GET", `/teamDetails/${headerData?.slug}/getTeamActiveYears`);

      if (response && response.data && response.data.years) {
        const years = response.data.years;
        setDynamicYears(years);
      }
    } catch (err) {
      console.error("Error fetching team active years:", err);
      setDynamicYears([]);
    } finally {
      setYearsLoading(false);
    }
  };
  fetchTeamActiveYears();
  }, [headerData]);

  
  if (apiError) {
    return (
      <div className="container pt-161px">
      <div className="alert alert-danger text-center ">
        <h3>Something went wrong</h3>
        <p>
          We’re having trouble loading this team right now.
          Please try again later.
        </p>
        <a href="/teams" className="glob-btn green-bg-btn">
                    <strong>Go to Teams</strong>
                    <span>
                        <img src="/images/arow.svg" alt="arrow-right" />
                    </span>
                    </a>
                    
      </div>
      </div>
    );
  }

 if (!headerData) {
    return (
      <div className="container pt-161px">
        <div className="text-center">
          <h2>Team Information Not Available</h2>
          <p>We couldn't find information for this team.</p>
          <Link href="/teams">
            <button className="btn btn-primary mt-3">Back to Teams</button>
          </Link>
        </div>
      </div>
    );
  }

  const teamName = headerData?.team_name || "N/A";
  const teamImage = headerData?.image_url || headerData?.image;
  const teamFlag = headerData?.country_code || headerData?.flag || headerData?.country;
  const teamCountry = headerData?.country_name || headerData?.country || headerData?.countryName;
  const teamFounded = headerData?.start_year || headerData?.founded_year || headerData?.founded;
  const teamCountryName = headerData?.country_name || headerData?.country || headerData?.countryName;

  return (
    <main className="inner-pages-main rider-detail-main  header-layout-2">
      <div className="dropdown-overlay"></div>
      <section className="rider-details-sec pb-0 rider-details-sec-top bg-pattern ">
        <div className="top-wrapper-main">
          <div className="container">
            <div className="top-wraper">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">home</Link>
                </li>
                <li>
                  <Link href="/teams">teams</Link>
                </li>
                <li>{teamName}</li>
              </ul>
              <div className="wraper">
                {teamImage ? (
                  <img src={teamImage} alt={teamName || "Team"} />
                ) : (
                  <div className="hdr-img_wrap">
                    <img
                      src="/images/jersey1.png"
                      alt=""
                      className="absolute-img"
                    />
                    <ul className="plyr-dtls d-flex d-md-none mobile_plyr-dtls">
                      <li className="country">
                        {renderFlag(teamFlag)}
                        {teamCountry}</li>
                      <li className="age">SINCE {teamFounded || "..."}</li>
                    </ul>

                  </div>
                )}
                <h1>{teamName || "..."}</h1>
              </div>
              <ul className="plyr-dtls d-md-flex d-none">
                <li className="country">
                  {renderFlag(teamFlag)}
                  {teamCountry}</li>
                <li className="age">SINCE {teamFounded || "..."}</li>
              </ul>
            </div >
          </div>
        </div>
      </section>
      <section className="rider-details-sec">
        <div className="container">
          <div className="col-lg-12">
            <ul className="filter">
              <FilterDropdown
                ref={yearDropdownRef}
                isOpen={showYearDropdown}
                toggle={() => setShowYearDropdown(!showYearDropdown)}
                options={getFilteredYears(yearInput)}
                selectedValue={filterYear}
                placeholder="Year"
                onSelect={(value) => handleSelection("year", value)}
                onInputChange={handleYearInputChange}
                loading={yearsLoading}
                includeAllOption={false}
                classname="year-dropdown"
              />
            </ul>
          </div>
          <div className="row">
            <TeamFirstSection
              teamId={headerData?.team_id}
              teamName={headerData?.team_name}
              teamSlug={router.query?.name}
              filterYear={
                filterYear !== "All-time" ? filterYear : null
              } />

          <TeamSecondSection
              teamId={headerData?.team_id}
              teamName={headerData?.team_name}
              teamSlug={router.query?.name}
              filterYear={
                filterYear !== "All-time" ? filterYear : null
              }
            />

              <TeamThirdSection
              teamId={headerData?.team_id}
              teamName={headerData?.team_name}
              teamSlug={router.query?.name}
              filterYear={
                filterYear !== "All-time" ? filterYear : null
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { name } = context.params;
  const year = context.query.year || "All-time";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/teamDetails/${name}/teamDetailsForTeamPage`
    );

    if (res.status === 404) {
      return { notFound: true };
    }

    if (!res.ok) {
      return {
        props: {
          initialTeam: null,
          year,
          apiError: true,
        },
      };
    }

    const json = await res.json();

    if (!json?.data) {
      return { notFound: true };
    }

    return {
      props: {
        initialTeam: json.data,
        year,
      },
    };
  } catch {
    return {
      props: {
        initialTeam: null,
        year,
        apiError: true,
      },
    };
  }
}


