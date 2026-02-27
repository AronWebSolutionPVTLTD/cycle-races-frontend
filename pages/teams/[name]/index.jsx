
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { callAPI } from "@/lib/api";
import TeamFirstSection from "@/components/team_detail/TeamFirstSection";
import { renderFlag } from "@/components/RenderFlag";
import TeamSecondSection from "@/components/team_detail/TeamSecondSection";
import TeamThirdSection from "@/components/team_detail/TeamThirdSection";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";
import { useTranslation } from "@/lib/useTranslation";
import Head from "next/head";

export default function TeamDetail({ initialTeam, apiError, year }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [headerData, setHeaderData] = useState(initialTeam);
  const [filterYear, setFilterYear] = useState(year || "All-time");
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

  useEffect(() => {
    if (!router.query?.name) return;
    const { name } = router.query;
    if (!name) return;
  
    const fetchTeamDetails = async () => {
      try {
        const response = await callAPI("GET", `/teamDetails/${name}/teamDetailsForTeamPage`);
      console.log(response);
        if (response?.data) {
          setHeaderData(response.data);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };
    setFilterYear("All-time");
    fetchTeamDetails();
  }, [router.query.name, name]);

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
    if (!headerData?.teamSlug) return;
    const fetchTeamActiveYears = async () => {
      try {
        setYearsLoading(true);
        const response = await callAPI("GET", `/teamDetails/${headerData?.teamSlug}/getTeamActiveYears`);

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
          <h3>{t("common.something_went_wrong")}</h3>
          <p>
            {t("common.api_error")}

          </p>
          <a href="/teams" className="glob-btn green-bg-btn">
            <strong>{t("teams.go_to_teams")}</strong>
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
          <h2>{t("teams.not_available")}</h2>
          <p>{t("teams.not_found")}</p>
          <Link href="/teams">
            <button className="btn btn-primary mt-3">{t("teams.go_to_teams")}</button>
          </Link>
        </div>
      </div>
    );
  }

  const teamName = headerData?.team_name || "N/A";
  const teamImage = headerData?.image_url || headerData?.team_image_url;
  const teamFlag = headerData?.country_code
  const teamCountry = headerData?.country_name
  const teamFounded = headerData?.start_year

  return (
    <>  <Head>
      <title>{teamName || "..."}statistieken, renners & uitslagen | Wielerstats</title>
      <meta name="description" content={`Alle statistieken van${teamName || "..."}: renners, overwinningen, klassiekers en grote rondes. | Wielerstats`}/>
    </Head>
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
                      src="/images/rider_avatar.png"
                      alt=""
                      className="absolute-img"
                    />
                    <div className="plyr-dtls d-block d-md-none">
                    {teamName} is een
                      <span className="country">{ teamFlag ? renderFlag(teamFlag) : "..."} {teamCountry || "..."}</span>
                      wielerploeg, actief sinds  <span className="text-white">{teamFounded || "..."}</span>. Hier vind je statistieken over zeges, renners, klassiekers en grote rondes.
                    </div>

                  </div>
                )}
                <h1>{teamName || "..."}</h1>
              </div>
              <div className="plyr-dtls d-md-block d-none">
                {teamName} is een
                      <span className="country"> {teamFlag ? renderFlag(teamFlag) : "..."} {teamCountry || "..."}</span>
                      wielerploeg, actief sinds  <span className="text-white">{teamFounded || "..."}</span>. Hier vind je statistieken over zeges, renners, klassiekers en grote rondes.
              </div>
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
              }
              t={t}
            />

            <TeamSecondSection
              teamId={headerData?.team_id}
              teamName={headerData?.team_name}
              teamSlug={router.query?.name}
              filterYear={
                filterYear !== "All-time" ? filterYear : null
              }
              t={t}
            />

            <TeamThirdSection
              teamId={headerData?.team_id}
              teamName={headerData?.team_name}
              teamSlug={router.query?.name}
              filterYear={
                filterYear !== "All-time" ? filterYear : null
              }
              t={t}
            />
          </div>
        </div>
      </section>
    </main>
    </>
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
      return {
        notFound: true,
        props: {
          isDetailPage: false,
        },
      };
    }

    if (!res.ok) {
      return {
        props: {
          initialTeam: null,
          year,
          apiError: true,
          isDetailPage: false,
        },
      };
    }

    const json = await res.json();

    if (!json?.data) {
      return {
        notFound: true,
        props: {
          isDetailPage: false,
        },
      };
    }

    return {
      props: {
        initialTeam: json.data,
        year,
        isDetailPage: true,
      },
    };
  } catch {
    return {
      props: {
        initialTeam: null,
        year,
        apiError: true,
        isDetailPage: false,
      },
    };
  }
}


