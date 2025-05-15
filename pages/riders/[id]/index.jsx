import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { mockRiderData } from '@/pages/data';

import axios from 'axios';
import RiderRandomStatsOne from '@/components/rider_detail/RiderStats';
import { callAPI } from '@/lib/api';
import Flag from 'react-world-flags';
import RiderSectionTwo from '@/components/rider_detail/RiderSectionTwo';
import { generateYearOptions } from '@/components/GetYear';

export default function RiderDetail({ initialRider }) {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [rider, setRider] = useState(initialRider || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState('All-time');

  
  // Available filter options
  const yearOptions = generateYearOptions();

  // Fetch rider details using rider ID
  const fetchRiderDetails = async (riderId) => {
    try {
      setIsLoading(true);
      console.log('Fetching rider details for ID:', riderId);
      
      const response = await callAPI("GET",`/rider-stats/${riderId}/detail`)
        .catch(error => {
          console.error('API call failed:', error);
          // If API fails, fallback to mock data
          throw new Error('API call failed: ' + (error.message || 'Unknown error'));
        });
        console.log(response,"response")
      
      if (response && response.data.data) {
        console.log('API response received:', response.data); 
        const riderData = response.data.data;
     setRider(riderData);
      } else {
        console.error('Invalid API response format:', response);
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching rider details:', err);
      setError(err.message || 'Failed to load rider details');
      setRider(mockRiderData);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      const { id } = router.query;
      console.log("Router is ready, id:", id);
      
      if (id) {
        const riderId = id;
        fetchRiderDetails(riderId);
      } else {
        console.error("No id/rider ID found in URL");
        setError("No rider ID found in URL");
        setIsLoading(false);
      }
    }
  }, [router.isReady, router.query]);

  // If loading state persists for more than 5 seconds, fall back to mock data
  useEffect(() => {
    let timeout;
    
    if (isLoading) {
      timeout = setTimeout(() => {
        console.log('Loading timeout reached, falling back to mock data');
        setRider(mockRiderData);
        setIsLoading(false);
      }, 5000); // 5 second timeout
    }
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

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

  return (
    <main>
      <section className='rider-details-sec pb-0 rider-details-sec-top'>
        {/* <div className='top-wrapper-main'>
          <div className='container'>
            <div className="top-wraper">
              <ul className="breadcrumb">
                <li><Link href="/">home</Link></li>
                <li><Link href="/riders-search">riders</Link></li>
                <li>{rider.name}</li>
              </ul>
              <div className="wraper">
                <Image src={rider.image_url} alt={rider.name} width={300} height={300} />
                <h1>{rider.name.split(' ')[0].toLowerCase()} <br /> {rider.name.split(' ').slice(1).join(' ').toLowerCase()}</h1>
              </div>
              <ul className="plyr-dtls">
                <li>
                  <Image src={rider.countryFlag} alt={rider.country} width={20} height={15} />
                  <span>{rider.country}</span>
                </li>
                <li>{rider.birthDate} ({rider.age})</li>
                <li>{rider.birthPlace.toLowerCase()}</li>
              </ul>
            </div>
          </div>
        </div> */}
         <div className='top-wrapper-main'>
          <div className='container'>
            <div className="top-wraper">
              <ul className="breadcrumb">
                <li><Link href="/">home</Link></li>
                <li><Link href="/riders-search">riders</Link></li>
                <li>{rider.name}</li>
              </ul>
              <div className="wraper">
                <Image src={rider.image_url} alt={rider.name} width={300} height={300} />
                <h1>{rider.name}</h1>
              </div>
              <ul className="plyr-dtls">
                <li>
                 <Flag code={rider.nationality} style={{width:"20px",height:"20px",marginleft:"10px"}}/>
                  {/* <span>{rider.country}</span> */}
                </li>
                <li>{rider.date_of_birth ||" N/A"} </li>
                <li>{rider.birth_place || "N/A"}</li>
              </ul>
            </div>
          </div>
        </div>
    
      </section>
      <section className="rider-details-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="filter">
                <li className="active">
                  <select 
                    value={filterYear} 
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="year-filter"
                  >
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </li>
              </ul>
            </div>
            
             <div className="col-lg-12">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h2>rider detail</h2>
                                    </div>
                                </div>
       {/* Random Stats Section */}
            <RiderRandomStatsOne 
              riderId={rider._id} 
              filterYear={filterYear}
            />

 <div className="col-lg-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>race detail</h2>
                        </div>
                    </div>
             {/* Random Stats Section */}
            <RiderSectionTwo
              riderId={rider._id} 
              filterYear={filterYear}
            />
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
      initialRider: null
    }
  };
}