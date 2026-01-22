import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { callAPI } from "@/lib/api";
import { generateYearOptions } from "@/components/GetYear";
import RiderFirstSection from "@/components/rider_detail/RiderFirstSection";
import { renderFlag } from "@/components/RenderFlag";
import RiderSecondSection from "@/components/rider_detail/RiderSecondSection";
import RiderThirdSection from "@/components/rider_detail/RiderThirdSection";
import { FilterDropdown } from "@/components/stats_section/FilterDropdown";

export default function RiderDetail({ year, initialRider }) {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [rider, setRider] = useState(initialRider || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState(year || "All-time");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);
  const [dynamicYears, setDynamicYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(false);
  const { withoutAllTime } = generateYearOptions();
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

  const fetchRiderActiveYears = async (riderId) => {
    try {
      setYearsLoading(true);
      const response = await callAPI("GET", `/rider-stats/${riderId}/getRiderActiveYears`);

      if (response && response.data.data.years) {
        const years = response.data.data.years;
        setDynamicYears(years);
      }
    } catch (err) {
      console.error("Error fetching rider active years:", err);
      setDynamicYears([]);
    } finally {
      setYearsLoading(false);
    }
  };

  const fetchRiderDetails = async (riderId) => {
    try {
      setIsLoading(true);
      const response = await callAPI("GET", `/rider-stats/${riderId}/detail`);
      if (response && response.data && response.data.data) {
        const riderData = response.data.data;
        setRider(riderData);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("Error fetching rider details:", err);
      if (err.message && err.message.includes("API call failed")) {
        setError("Failed to connect to server. Please try again later.");
      } else {
        setError(err.message || "Failed to load rider details");
      }
      setRider(null);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown";
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      const { slugOrId } = router.query;

      if (slugOrId) {
        const riderId = slugOrId;
        fetchRiderDetails(riderId);
        fetchRiderActiveYears(riderId);
      } else {
        setError("No rider ID found in URL");
        setIsLoading(false);
      }
    }
  }, [router.isReady, router.query]);

  if (!isRouterReady || isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading rider data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Error loading rider data</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => router.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Rider Information Not Available</h2>
          <p>We couldn't find information for this rider.</p>
          <Link href="/riders">
            <button className="btn btn-primary mt-3">Back to Riders</button>
          </Link>
        </div>
      </div>
    );
  }
  console.log(rider, "rider");
  return (
    <main className="inner-pages-main rider-detail-main  header-layout-2">
      <div className="dropdown-overlay"></div>
      <section className="rider-details-sec pb-0 rider-details-sec-top bg-pattern">
        <div className="top-wrapper-main">
          <div className="container">
            <div className="top-wraper">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">home</Link>
                </li>
                <li>
                  <Link href="/riders">riders</Link>
                </li>
                <li>{rider.name || "N/A"}</li>
              </ul>
              <div className="wraper ">
                <div className="hdr-img_wrap">
                  {rider.image_url ? (
                    <img src={rider.image_url} alt={rider.name || "Rider"} />
                  ) : (
                    <img
                      src="/images/rider_avatar.png"
                      alt=""
                      className="absolute-img"
                    />
                  )}
                  <ul className="plyr-dtls d-flex d-md-none mobile_plyr-dtls">
                    <li className="country">{renderFlag(rider?.nationality)} {rider?.country}</li>
                    <li className="age">{rider.date_of_birth || "..."} ({rider?.age})</li>
                    <li className="place">{rider.birth_place || "..."}</li>
                  </ul>
                </div>
                <h1>{rider.name || "..."}</h1>
              </div>
              <ul className="plyr-dtls d-md-flex d-none">
                <li className="country">{renderFlag(rider?.nationality)} {rider?.country}</li>
                <li className="age">{rider.date_of_birth || "..."} ({rider?.age})</li>
                <li className="place">{rider.birth_place || "..."}</li>
              </ul>
            </div>
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
            <RiderFirstSection riderId={rider.slug}
              filterYear={filterYear !== "All-time" ? filterYear : null}
              imageUrl={rider.image_url} />

            <RiderSecondSection riderId={rider.slug}
              filterYear={filterYear !== "All-time" ? filterYear : null}
              imageUrl={rider.image_url} />

            <RiderThirdSection riderId={rider.slug}
              filterYear={filterYear !== "All-time" ? filterYear : null}
              imageUrl={rider.image_url} />
          </div>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { year } = context.query;
  return {
    props: {
      initialRider: null,
      year: year || "All-time",
    },
  };
}