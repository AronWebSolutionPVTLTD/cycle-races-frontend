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
import RiderLastSection from "@/components/rider_detail/RiderLastSection";

export default function RiderDetail({ year, initialRider, apiError }) {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [rider, setRider] = useState(initialRider || null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
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


  useEffect(() => {
    if (!router.isReady) return;
  
    const { slugOrId } = router.query;
    if (!slugOrId) return;
  
    const fetchRider = async () => {
      try {
        const response = await callAPI(
          "GET",
          `/rider-stats/${slugOrId}/detail`
        );
  
        if (response?.data?.data) {
          setRider(response.data.data);
        } else {
          setRider(null);
        }
      } catch (err) {
        setRider(null);
      }
    };
  
    fetchRider();
  }, [router.query.slugOrId]);
  


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

  if (apiError) {
    return (
      <div className="container pt-161px">
        <div className="alert alert-danger text-center ">
          <h3>Something went wrong</h3>
          <p>
            We’re having trouble loading this rider right now.
            Please try again later.
          </p>
          <a href="/riders" className="glob-btn green-bg-btn">
            <strong>Go to Riders</strong>
            <span>
              <img src="/images/arow.svg" alt="arrow-right" />
            </span>
          </a>

        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!rider?.slug) return;

    const fetchActiveYears = async () => {
      try {
        setYearsLoading(true);
        const response = await callAPI("GET", `/rider-stats/${rider.slug}/getRiderActiveYears`);

        if (response && response?.data?.data?.years) {
          const years = response.data.data.years;
          setDynamicYears(years);
        }
      } catch {
        setDynamicYears([]);
      } finally {
        setYearsLoading(false);
      }
    };


    fetchActiveYears();
  }, [rider]);

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


  // const fetchRiderActiveYears = async (riderId) => {
  //   try {
  //     setYearsLoading(true);
  //     const response = await callAPI("GET", `/rider-stats/${riderId}/getRiderActiveYears`);

  //     if (response && response?.data?.data?.years) {
  //       const years = response.data.data.years;
  //       setDynamicYears(years);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching rider active years:", err);
  //     setDynamicYears([]);
  //   } finally {
  //     setYearsLoading(false);
  //   }
  // };

  // const fetchRiderDetails = async (riderId) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await callAPI("GET", `/rider-stats/${riderId}/detail`);
  //     if (response && response.data && response.data.data) {
  //       const riderData = response.data.data;
  //       setRider(riderData);
  //     } else {
  //       setIsLoading(false);
  //       setError("Invalid response format from API");
  //       setRider(null);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching rider details:", err);
  //     if (err.message && err.message.includes("API call failed")) {
  //       setError("Failed to connect to server. Please try again later.");
  //     } else {
  //       setError(err.message || "Failed to load rider details");
  //     }
  //     setRider(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  // useEffect(() => {
  //   if (router.isReady) {
  //     setIsRouterReady(true);
  //     const { slugOrId } = router.query;

  //     if (slugOrId) {
  //       const riderId = slugOrId;
  //       fetchRiderDetails(riderId);
  //       fetchRiderActiveYears(riderId);
  //     } else {
  //       setError("No rider ID found in URL");
  //       setIsLoading(false);
  //     }
  //   }
  // }, [router.isReady, router.query]);

  // if (!isRouterReady || isLoading) {
  //   return (
  //     <div className="container py-5">
  //       <div className="text-center">
  //         <div className="spinner-border text-primary mb-3" role="status">
  //           <span className="visually-hidden">Loading...</span>
  //         </div>
  //         <p>Loading rider data...</p>
  //       </div>
  //     </div>
  //   );
  // }

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

            <RiderLastSection riderId={rider.slug}
              filterYear={filterYear !== "All-time" ? filterYear : null}
              imageUrl={rider.image_url} />
          </div>
        </div>
      </section>
    </main>
  );
}

// export async function getServerSideProps(context) {
//   const { year } = context.query;
//   return {
//     props: {
//       initialRider: null,
//       year: year || "All-time",
//     },
//   };
// }
export async function getServerSideProps(context) {
  const { slugOrId } = context.params;
  const year = context.query.year || "All-time";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/rider-stats/${slugOrId}/detail`
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
          initialRider: null,
          year,
          apiError: true,
          isDetailPage: false,
        },
      };
    }

    const json = await res.json();

    if (!json?.data?.data) {
      return {
        notFound: true,
        props: {
          isDetailPage: false,
        },
      };
    }

    return {
      props: {
        initialRider: json.data.data,
        year,
        isDetailPage: true,
      },
    };
  } catch {
    return {
      props: {
        initialRider: null,
        year,
        apiError: true,
        isDetailPage: false,
      },
    };
  }
}

