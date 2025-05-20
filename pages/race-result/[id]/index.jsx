import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { callAPI } from '@/lib/api';
import Flag from 'react-world-flags';
import Link from 'next/link';

export default function RaceResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isRouterReady, setIsRouterReady] = useState(false);

  const [race, setRace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [featuredStats, setFeaturedStats] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [selectedMonth, setSelectedMonth] = useState('');

  const fetchRaceDetails = async (raceId) => {
    try {
      setIsLoading(true);
      const response = await callAPI(
        'GET',
        `/raceDetailsStats/${raceId}/getRaceDetails`
      );
      if (response?.data) {
        setRace(response.data);
        await fetchFeaturedStats(raceId);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to load race data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedStats = async (raceId) => {
    try {
      // Fetch all stats in parallel
      const [winnersByNationality, oldestRider, youngestRider, bestTeam] = await Promise.all([
        callAPI('GET', `/stages/${raceId}/getRaceWinnersByNationality`),
        callAPI('GET', `/stages/${raceId}/getOldestRiderInRace`),
        callAPI('GET', `/stages/${raceId}/getYoungestRiderInRace`),
        callAPI('GET', `/stages/${raceId}/getBestTeamInRace`)
      ]);

      const stats = [];

      // Add winners by nationality if available
      if (winnersByNationality?.data?.data?.length > 0) {
        const topNationality = winnersByNationality.data.data[0];
        stats.push({
          title: 'Top Nationality',
          rider: `${topNationality.wins} win${topNationality.wins > 1 ? 's' : ''}`,
          flag: `/images/flags/${topNationality.country_code.toLowerCase()}.svg`,
          image: '/images/rider-placeholder.png',
          value: topNationality.wins,
          unit: 'wins'
        });
      }

      // Add oldest rider if available
      if (oldestRider?.data) {
        stats.push({
          title: 'Oldest Rider',
          rider: oldestRider.data.rider_name,
          speed: oldestRider.data.age,
          flag: `/images/flags/${oldestRider.data.country_code.toLowerCase()}.svg`,
          image: '/images/rider-placeholder.png',
          value: oldestRider.data.age,
          unit: 'years'
        });
      }

      // Add youngest rider if available
      if (youngestRider?.data) {
        stats.push({
          title: 'Youngest Rider',
          rider: youngestRider.data.rider_name,
          speed: youngestRider.data.age,
          flag: `/images/flags/${youngestRider.data.country_code.toLowerCase()}.svg`,
          image: '/images/rider-placeholder.png',
          value: youngestRider.data.age,
          unit: 'years'
        });
      }

      // Add best team if available
      if (bestTeam?.data) {
        stats.push({
          title: 'Best Team',
          rider: bestTeam.data.team_name,
          speed: bestTeam.data.rider_count,
          flag: '/images/team-icon.svg',
          image: '/images/rider-placeholder.png',
          value: bestTeam.data.rider_count,
          unit: 'riders'
        });
      }

      // Fallback if no stats were found
      if (stats.length === 0) {
        stats.push(
          {
            title: 'Fastest Sprint',
            rider: 'Fabio Jakobsen',
            speed: '72.5',
            flag: '/images/flags/ned.svg',
            image: '/images/rider-placeholder.png',
            value: '72.5',
            unit: 'km/ph'
          },
          {
            title: 'Most Wins',
            rider: 'Tadej Pogačar',
            speed: '28',
            flag: '/images/flags/slo.svg',
            image: '/images/rider-placeholder.png',
            value: '28',
            unit: 'wins'
          }
        );
      }

      setFeaturedStats(stats);
    } catch (err) {
      console.error('Error fetching featured stats:', err);
      // Fallback to default stats if API calls fail
      setFeaturedStats([
        {
          title: 'Fastest Sprint',
          rider: 'Fabio Jakobsen',
          speed: '72.5',
          flag: '/images/flags/ned.svg',
          image: '/images/rider-placeholder.png',
          value: '72.5',
          unit: 'km/ph'
        },
        {
          title: 'Most Wins',
          rider: 'Tadej Pogačar',
          speed: '28',
          flag: '/images/flags/slo.svg',
          image: '/images/rider-placeholder.png',
          value: '28',
          unit: 'wins'
        }
      ]);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      if (typeof id === 'string') {
        fetchRaceDetails(id);
      }
    }
  }, [router.isReady, id]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    // Implement search logic here if needed
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const handleSuggestionSelect = (raceName) => {
    setSearchTerm(raceName);
    setShowSearchDropdown(false);
    // Implement navigation or search here
  };
  const convertTimeToSeconds = (timeStr) => {
    if (!timeStr) return null;  // return null if no time
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  };
  
  const formatTimeToDisplay = (timeStr) => {
    if (!timeStr) return '';
    const [h, m, s] = timeStr.split(':').map(str => parseInt(str, 10));
    return `${h}h${m.toString().padStart(2, '0')}${s.toString().padStart(2, '0')}`;
  };
  
  const getTimeGapDisplay = (baseTime, compareTime) => {
    if (!baseTime || !compareTime) return ''; // empty string if either time missing
  
    const base = convertTimeToSeconds(baseTime);
    const compare = convertTimeToSeconds(compareTime);
  
    if (base === null || compare === null) return ''; // empty if parse failed
  
    const diff = compare - base;
  
    // Always show time, even if diff === 0 (same time)
    if (diff <= 0) return formatTimeToDisplay(compareTime);
  
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
  
    return minutes > 0 ? `+${minutes}'${seconds}"` : `+${seconds}"`;
  };
  
  if (!isRouterReady || isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading race data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2xl font-bold text-red-600">Error loading race data</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => router.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!race) return null;

  return (
    <main>
      <section className="riders-sec1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="breadcrumb">
                <li><Link href="/">home</Link></li>
                <li><Link href="/races">race</Link></li>
                <li>{race.race_name}</li>
              </ul>
              <h1>{race.race_name.toUpperCase()}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="home-banner result-sec1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="filter">
                <li className="active">
                  <select 
                    value={selectedYear} 
                    onChange={handleYearChange} 
                    id="yearSelect"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </li>
                {months.map(month => (
                  <li key={month} className={selectedMonth === month ? 'active' : ''}>
                    <Link 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMonth(month);
                      }}
                    >
                      {month}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-9 col-md-7">
              <ul className="head-heading">
                <li>#</li>
                <li>Name</li>
                <li>Team</li>
                <li>Time</li>
              </ul>
              
              <ul className="transparent-cart">
                {race.riders?.sort((a, b) => a.rank - b.rank).slice(0, 25).map((rider, index) => (
                  <li key={index}>
                    <span>{index + 1}</span>
                    <h5>
                      <Flag 
                        code={rider.country_code?.toUpperCase() || 'BE'} 
                        style={{ width: '30px', height: '20px', marginRight: '10px' }} 
                      />
                      {rider.rider_name.toUpperCase()}
                    </h5>
                    <h6>{rider.team_name}</h6>
                    <h6 className="time-result">
                      {index === 0
                        ? formatTimeToDisplay(rider.time)
                        : getTimeGapDisplay(race.riders[0]?.time, rider.time)}
                    </h6>
                    <Link 
                      href={`/rider/${encodeURIComponent(rider.rider_name)}`} 
                      className="r-details"
                    >
                      <img src="/images/hover-arow.svg" alt="Details" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-5">
              {featuredStats.map((stat, index) => (
                <div className="team-cart" key={index}>
                  <div className="text-wraper">
                    <h4 className="font-size-change">{stat.title}</h4>
                    <div className="name-wraper">
                      {/* <img 
                        src={stat.flag} 
                        alt="" 
                        onError={(e) => { e.target.src = '/images/flag-placeholder.svg' }}
                      /> */}
                      <h6>{stat.rider}</h6>
                    </div>
                  </div>
                  <h5>
                    <strong>{stat.value}</strong>
                    {stat.unit && ` ${stat.unit}`}
                  </h5>
                  <img src={stat.image} alt="" className="absolute-img" />
                  <Link href="#" className="green-circle-btn">
                    <img src="/images/arow.svg" alt="" />
                  </Link>
                </div>
                
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}