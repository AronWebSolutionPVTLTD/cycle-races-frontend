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

export default function RiderDetail({ initialRider }) {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [rider, setRider] = useState(initialRider || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState("All-time");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const yearDropdownRef = useRef(null);

  // Available filter options
  const { withoutAllTime } = generateYearOptions();
  const allYearOptions = ["All-time", ...withoutAllTime];
  const getFilteredYears = (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      return allYearOptions;
    }
    const hasNumbers = /\d/.test(searchValue);
    if (hasNumbers) {
      return withoutAllTime.filter((year) =>
        year.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    // return withoutAllTime;
    return allYearOptions.filter((year) =>
      year.toLowerCase().includes(searchValue.toLowerCase())
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
  // Fetch rider details using rider ID
  // const fetchRiderDetails = async (riderId) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await callAPI(
  //       "GET",
  //       `/rider-stats/${riderId}/detail`
  //     ).catch((error) => {
  //       console.error("API call failed:", error);
  //       // If API fails, fallback to mock data
  //       throw new Error(
  //         "API call failed: " + (error.message || "Unknown error")
  //       );
  //     });

  //     if (response && response.data.data) {
  //       const riderData = response.data.data;
  //       setRider(riderData);
  //     } else {
  //       console.error("Invalid API response format:", response);
  //       throw new Error("Invalid response format from API");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching rider details:", err);
  //     setError(err.message || "Failed to load rider details");
  //     setRider(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchRiderDetails = async (riderId) => {
    try {
      setIsLoading(true);

      // Remove the .catch() chain and handle errors in the main try-catch
      const response = await callAPI("GET", `/rider-stats/${riderId}/detail`);

      if (response && response.data && response.data.data) {
        const riderData = response.data.data;
        setRider(riderData);
      } else {
      throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("Error fetching rider details:", err);

      // Handle API call failures here
      if (err.message && err.message.includes("API call failed")) {
        setError("Failed to connect to server. Please try again later.");
      } else {
        setError(err.message || "Failed to load rider details");
      }

      setRider(null);

      // Optional: Add fallback to mock data here if needed
      // setRider(mockRiderData);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate age from birth date
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
      const { id } = router.query;

      if (id) {
        const riderId = id;
        fetchRiderDetails(riderId);
      } else {
        setError("No rider ID found in URL");
        setIsLoading(false);
      }
    }
  }, [router.isReady, router.query]);

  // If loading state persists for more than 5 seconds, fall back to mock data
  // useEffect(() => {
  //   let timeout;

  //   if (isLoading) {
  //     timeout = setTimeout(() => {
  //       console.log('Loading timeout reached, falling back to mock data');
  //       setRider(mockRiderData);
  //       setIsLoading(false);
  //     }, 5000); // 5 second timeout
  //   }

  //   return () => clearTimeout(timeout);
  // }, [isLoading]);

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
  return (
    <main className="inner-pages-main rider-detail-main">
      <div className="dropdown-overlay"></div>
      <section className="rider-details-sec pb-0 rider-details-sec-top">
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
              <div className="wraper">
                {rider.image_url ? (
                  <img src={rider.image_url} alt={rider.name || "Rider"} />
                ) : (
                  <div className="hdr-img_wrap">
                    <img
                      src="/images/player6.png"
                      alt=""
                      className="absolute-img"
                    />
                    <ul className="plyr-dtls d-flex d-md-none mobile_plyr-dtls">
                      <li className="country">{renderFlag(rider?.nationality)} {rider?.country}</li>
                      <li className="age">{rider.date_of_birth || "..."} ({rider?.age})</li>
                      <li className="place">{rider.birth_place || "..."}</li>
                    </ul>

                  </div>
                  // <div className="placeholder-image" style={{ width: 200, height: 200, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  //   <span>No Image</span>
                  // </div>
                )}
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
                loading={false}
                includeAllOption={false}
                classname="year-dropdown"
              />
                {/* <li className="active">
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="year-filter"
                  >
                    {withoutAllTime.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </li> */}
              </ul>
            </div>
          <div className="row">
            {/* Random Stats Section */}
            <RiderFirstSection riderId={rider._id} 
             filterYear={
              filterYear !== "All-time" ? filterYear : null
            }/>

            <RiderSecondSection riderId={rider._id} filterYear={
              filterYear !== "All-time" ? filterYear : null
            }/>

            <RiderThirdSection riderId={rider._id}filterYear={
              filterYear !== "All-time" ? filterYear : null
            } />
          </div>
        </div>
      </section>
    </main>
  );
}

// Server-side props function - keep returning null to ensure client-side fetching
export async function getServerSideProps(context) {
  const { id } = context.params;
  // We're intentionally returning null to trigger client-side fetching
  return {
    props: {
      initialRider: null,
    },
  };
}
