// pages/race/[name].jsx
import { generateYearOptions } from '@/components/GetYear';
import MostWin from '@/components/home/sections/MostWin';
import FirstSection from '@/components/race_detail/FirstSection';
import SecondSection from '@/components/race_detail/SecondSection';
import { FilterDropdown } from '@/components/stats_section/FilterDropdown';
import { callAPI } from '@/lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Flag from 'react-world-flags';

export default function RaceDetailsPage() {
  const router = useRouter();
  const { name } = router.query;
  const [isRouterReady, setIsRouterReady] = useState(false);
  
  // Filter states
  // const [selectedYear, setSelectedYear] = useState('All-time');
  // const [selectedNationality, setSelectedNationality] = useState("All");
const [activeFilter, setActiveFilter] = useState("year"); 
  const [years, setYears] = useState([]);
  const [nationalities, setNationalities] = useState([])
  const [selectedYear, setSelectedYear] = useState(
   "All time"
  );
  const [yearInput, setYearInput] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedNationality, setSelectedNationality] = useState("");
    const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

    // Refs for handling clicks outside dropdowns
    const yearDropdownRef = useRef(null);
    const nationalityDropdownRef = useRef(null);

     // Initialize years list
      useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearsList = Array.from({ length: 10 }, (_, i) =>
          (currentYear - i).toString()
        );
        setYears(yearsList);
      }, []);
        const yearOptions = generateYearOptions();
    
      // Fetch nationalities and teams based on filters
      const fetchFiltersData = useCallback(async () => {
        try {
          setIsLoading(true);
    
          const queryParams = {};

          if (selectedNationality) queryParams.q_country = selectedNationality;
          if (selectedYear) queryParams.q_year = selectedYear;
    
          const response = await callAPI(
            "GET",
            "/teams/getAllTeamsForFilters",
            queryParams
          );
    
          if (response.status && response.data) {
             setNationalities(response.data.rider_countries || []);
          }
        } catch (error) {
          console.error("Error fetching filters data:", error);
        } finally {
          setIsLoading(false);
        }
      }, [selectedNationality, selectedYear]);
    
      useEffect(() => {
        fetchFiltersData();
      }, [fetchFiltersData]);
    
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            yearDropdownRef.current &&
            !yearDropdownRef.current.contains(event.target)
          ) {
            setShowYearDropdown(false);
          }
          if (
            nationalityDropdownRef.current &&
            !nationalityDropdownRef.current.contains(event.target)
          ) {
            setShowNationalityDropdown(false);
          }
          
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

  const [raceData, setRaceData] = useState();
  console.log(raceData,"race")
   // Filter years based on input
  const getFilteredYears = (searchValue) => {
    return yearOptions.filter((year) =>
      year.toLowerCase().includes((searchValue || "").toLowerCase())
    );
  };

  // Handle year input change to filter the dropdown options without API call
  const handleYearInputChange = (value) => {
    setYearInput(value);
    // No API call on typing, just filter the dropdown options
  };

    const handleSelection = (type, value) => {
    switch (type) {
      case "year":
        setSelectedYear(value);
        setYearInput(value);
        setShowYearDropdown(false);
        fetchFiltersData(); // Fetch data with new year
        break;
      case "nationality":
        setSelectedNationality(value);
        setShowNationalityDropdown(false);
        fetchFiltersData(); // Fetch data with new nationality
        break;

    }
  };
 
  // Fetch data based on filters
  const fetchFilteredData = async (raceName, year, nationality, team) => {
    // console.log(`Fetching data for race: ${raceName}, year: ${year}, nationality: ${nationality}`);
    
    // This would be replaced with an actual API call
    // Example: 
    // const response = await fetch(`/api/race-stats?name=${raceName}&year=${year}&nationality=${nationality}&team=${team}`);
    // const data = await response.json();
    // setRaceData(data);
    
    // For now, just simulate a data change based on filters
    if (year !== "All-time") {
      setRaceData(prevData => ({
        ...prevData,
        edition: parseInt(year) - 1967, 
      }));
    }
  };
  
  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      
      if (name) {
        const raceName = decodeURIComponent(name);
        
        // Update the race name in state
        setRaceData(prevData => ({
          ...prevData,
          name: raceName
        }));
        
        // Initial data fetch
        fetchFilteredData(raceName, selectedYear, selectedNationality);
      }
    }
  }, [router.isReady, name]);
  
  // When filters change
  useEffect(() => {
    if (isRouterReady && name) {
      fetchFilteredData(
        decodeURIComponent(name),
        selectedYear,
        selectedNationality,
        
      );
    }
  }, [selectedYear, selectedNationality, isRouterReady, name]);

  if (!isRouterReady) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading race data...</p>
        </div>
      </div>
    );
  }



  return (
    <>
     <Head>
        <title>Races | Cycling Stats</title>
      </Head>
    <main>
         <section className='rider-details-sec pb-0 rider-details-sec-top'>
      <div className='top-wrapper-main'>
          <div className='container'>
            <div className="top-wraper">
              <ul className="breadcrumb">
                <li><Link href="/">home</Link></li>
                <li><Link href="/races">races</Link></li>
                <li>{raceData.name}</li>
              </ul>
              <div className="wraper">
                {/* <img src={rider.image_url} alt={raceData.name} width={300} height={300} /> */}
                <h1>{raceData.name}</h1>
              </div>
              <ul className="plyr-dtls">
                <li>
                 <Flag code={raceData.country}  style={{width:"20px",height:"20px",marginleft:"10px"}}/>
                  {/* <span>{rider.country}</span> */}
                </li>
                  {/* <li className="text-sm">{raceData.distance}</li> */}
              </ul>
            </div>
          </div>
        </div>
    
      </section>
      <section className="stats-sec1 race-details-sec py-8">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-6">


   <ul className="filter">
                {/* Year Dropdown with input change handling */}
                <FilterDropdown
                  ref={yearDropdownRef}
                  isOpen={showYearDropdown}
                  toggle={() => setShowYearDropdown(!showYearDropdown)}
                  options={getFilteredYears(yearInput)}
                  selectedValue={selectedYear}
                  placeholder="Year"
                  onSelect={(value) => handleSelection("year", value)}
                  onInputChange={handleYearInputChange}
                  loading={false}
                  includeAllOption={false}
                />

                {/* Nationality Dropdown */}
                <FilterDropdown
                  ref={nationalityDropdownRef}
                  isOpen={showNationalityDropdown}
                  toggle={() =>
                    setShowNationalityDropdown(!showNationalityDropdown)
                  }
                  options={nationalities}
                  selectedValue={selectedNationality}
                  placeholder="Nationaliteit"
                  onSelect={(value) => handleSelection("nationality", value)}
                  loading={isLoading}
                  allOptionText="All Nationalities"
                />
     </ul>
            </div>


            {/* <FirstSection  selectedYear={selectedYear !== "All time" ? selectedYear : null}  selectedNationality={selectedNationality}   name={name ? decodeURIComponent(name) : ''}/> */}
            {/* <MostWin/> */}
            <SecondSection selectedYear={selectedYear !== "All time" ? selectedYear : null}  selectedNationality={selectedNationality}   name={name ? decodeURIComponent(name) : ''}/>
            </div>
           </div>
           </section>


    </main>
    </>
  );
}

// Server-side props function for initial data fetching
export async function getServerSideProps(context) {
  const { name } = context.params;
  
  // Here you would fetch initial race data from your API
  // Example:
  // try {
  //   const res = await fetch(`${process.env.API_URL}/races/${encodeURIComponent(name)}`);
  //   const raceData = await res.json();
  //   
  //   return {
  //     props: {
  //       initialRaceData: raceData
  //     }
  //   };
  // } catch (error) {
  //   console.error("Failed to fetch race data:", error);
  //   return {
  //     props: {
  //       initialRaceData: null
  //     }
  //   };
  // }
  
  // For now, just return empty props
  return {
    props: {}
  };
}