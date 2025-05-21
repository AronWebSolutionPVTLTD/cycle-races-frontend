import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { callAPI } from '../../lib/api';
import Flag from 'react-world-flags';
import { generateYearOptions } from '@/components/GetYear';

export default function Results() {
const [raceResults, setRaceResults] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [showSearchDropdown, setShowSearchDropdown] = useState(false);
// const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [selectedYear, setSelectedYear] = useState("2015")
const [selectedMonth, setSelectedMonth] = useState('');

const [featuredRaces, setFeaturedRaces] = useState([]);

const {withoutAllTime } = generateYearOptions();

const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

// Convert month name to number (1-12)
const getMonthNumber = (monthName) => {
  return months.findIndex(month => month === monthName) + 1;
};

// Fetch data from API with filters
const fetchRaceResults = async () => {
  setLoading(true);
  try {
    const monthParam = selectedMonth ? `&month=${getMonthNumber(selectedMonth)}` : '';
    const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
    
    const endpoint = `stages/getRecentStageRaceWinners?year=${selectedYear}${monthParam}${searchParam}`;
    const data = await callAPI("GET",endpoint);
    
    setRaceResults(data.recent_stage_race_winners || []);
    setSearchResults([]); // Clear search results after fetching
  } catch (error) {
    console.error('Error fetching race results:', error);
    setRaceResults([]);
  } finally {
    setLoading(false);
  }
};

// Initial data fetch and close dropdown on click outside
useEffect(() => {
  fetchRaceResults();
}, [selectedYear, selectedMonth]);

// Close search dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.searchInput')) {
      setShowSearchDropdown(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

// Debounce search to avoid excessive API calls
useEffect(() => {
  if (searchTerm.length >= 2) {
    const delayDebounce = setTimeout(() => {
      fetchSearchSuggestions();
    }, 300); // 300ms delay
    
    return () => clearTimeout(delayDebounce);
  } else {
    setSearchResults([]);
    setShowSearchDropdown(false);
  }
}, [searchTerm]);

useEffect(() => {
  fetchRaceResults();
  fetchFeaturedRaces();
}, [selectedYear, selectedMonth]);


// Fetch search suggestions separately from results
const fetchSearchSuggestions = async () => {
  try {
    const monthParam = selectedMonth ? `&month=${getMonthNumber(selectedMonth)}` : '';
    const searchParam = `&search=${encodeURIComponent(searchTerm)}`;
    
    const endpoint = `stages/getRecentStageRaceWinners?year=${selectedYear}${monthParam}${searchParam}`;
    const data = await callAPI("GET",endpoint);
    
    // Extract unique race names from results for the dropdown
    const uniqueRaces = Array.from(
      new Set(
        (data.recent_stage_race_winners || []).map(item => item.race_name)
      )
    ).map(raceName => {
      return {
        race_name: raceName
      };
    });
    
    setSearchResults(uniqueRaces);
    setShowSearchDropdown(uniqueRaces.length > 0);
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    setSearchResults([]);
  }
};

// Handle search input change
const handleSearchInput = (e) => {
  setSearchTerm(e.target.value);
};

// Handle search form submission
const handleSearch = (e) => {
  e.preventDefault();
  setShowSearchDropdown(false);
  fetchRaceResults();
};

// Handle search suggestion selection
const handleSuggestionSelect = (raceName) => {
  setSearchTerm(raceName);
  setShowSearchDropdown(false);
  fetchRaceResults();
};

// Handle year change
const handleYearChange = (e) => {
  setSelectedYear(e.target.value);
};

// Handle month change
const handleMonthChange = (e) => {
  setSelectedMonth(e.target.value);
};

// Clear search
const clearSearch = () => {
  setSearchTerm('');
  setSearchResults([]);
  setShowSearchDropdown(false);
  fetchRaceResults();
};

// Featured races data (could be moved to API later)
const fetchFeaturedRaces = async () => {
  try {
    const [victoryRes, teamRes, bestRes] = await Promise.all([
      callAPI("GET", `stages/getCurrentVictoryRanking?year=${selectedYear}`),
      callAPI("GET", `stages/getCurrentTeamRanking?year=${selectedYear}`),
      callAPI("GET", `stages/getBestRidersOfRecentYear?year=${selectedYear}`)
    ]);

    const featured = [];

    // Top Victory Rider
    if (victoryRes.data.top_riders?.length) {
      const topRider = victoryRes.data.top_riders[0];
      featured.push({
        title: victoryRes.message,
        rider: topRider.rider_name,
        flag: `/images/flags/${topRider.rider_country.toLowerCase()}.svg`,
        speed: `${topRider.wins}`,
        image: '/images/player6.png'
      });
    }

    // Top Team
    if (teamRes.data.recent_team_rankings?.length) {
      const topTeam = teamRes.data.recent_team_rankings[0];
      featured.push({
        title: teamRes.message,
        rider: topTeam.team_name,
        flag: '/images/flag-placeholder.svg',
        speed: `${topTeam.total_wins}`,
        image: '/images/player6.png'
      });
    }

   
    // Best Rider of the Year
    if (bestRes?.data.top_riders?.length) {
      const best = bestRes.data.top_riders[0];
      featured.push({
        title: bestRes.message,
        rider: best.rider_name,
        flag: `/images/flags/${best.rider_country.toLowerCase()}.svg`,
        speed: best.wins,
        image: '/images/player6.png'
      });
    }

    setFeaturedRaces(featured);

  } catch (error) {
    console.error("Error fetching featured races:", error);
    setFeaturedRaces([]);
  }
};


return (
  <>
    <Head>
      <title>Results - Cycling Stats</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/images/fav-icon.svg" type="image/svg+xml" />
    </Head>
    <main>
      <section className="riders-sec1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="breadcrumb">
                <li><Link href="/">home</Link></li>
                <li>results</li>
              </ul>
              <h1>Results</h1>
              <div className="searchInput">
                <form onSubmit={handleSearch}>
                  <div className="wraper">
                    <input 
                      type="text" 
                      placeholder="welke wedstrijd zoek je?" 
                      value={searchTerm}
                      onChange={handleSearchInput}
                      onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    />
                    <div className="icon">
                      <img src="/images/search-icon.svg" alt="Search" onClick={handleSearch} />
                      <input type="reset" value="" className="close" onClick={clearSearch} />
                    </div>
                  </div>
                  {showSearchDropdown && searchResults.length > 0 && (
                    <div>
                      <ul>
                        {searchResults.map((result, index) => (
                          <li 
                            key={index} 
                            onClick={() => handleSuggestionSelect(result.race_name)}
                          >
                            {/* <img 
                              src={`/images/flags/${result.race_name.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                              alt="" 
                              onError={(e) => {e.target.src = '/images/flag-placeholder.svg'}}
                            /> */}
                            <span>{result.race_name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </form>
              </div>
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
                    {withoutAllTime.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
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
              <div className="select-box">
                <select 
                  value={selectedYear} 
                  onChange={handleYearChange} 
                  className="active"
                >
                    {withoutAllTime.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
                </select>
                <select 
                  value={selectedMonth} 
                  onChange={handleMonthChange}
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-9 col-md-7">
              <ul className="head-heading">
                <li>Date</li>
                <li>Race</li>
                <li>Winner</li>
                <li>Team</li>
              </ul>
              
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <ul className="transparent-cart">
                  {raceResults.length > 0 ? (
                    raceResults.map((item, idx) => (
                      <li key={idx}>
                        <span>{item.date}</span>
                        <h5>
                        <Flag code={item.country_code.toUpperCase()} style={{ width: '30px', height: '20px', marginRight: '10px' }} />
                        
                          <Link href={`/races/${encodeURIComponent(item.race_name)}`}>{item.race_name}</Link>
                        </h5>
                        <h6>
                         <Flag code={item.rider_country.toUpperCase()} style={{ width: '30px', height: '20px', marginRight: '10px' }} />
                         {item.rider_name}
                        </h6>
                        <h6>{item.team_name}</h6>
                        <Link href={`/race-result/${encodeURIComponent(item.race_id)}`} className="r-details">
                      <img src="/images/eye.svg" alt="Details" width="24" height="24" />
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="no-results">No results found</li>
                  )}
                </ul>
              )}
            </div>
            
            <div className="col-lg-3 col-md-5">
             {featuredRaces.map((race, index) => (
              <div className="team-cart" key={index}>
                <a href="#" className="pabs"></a>
                <div className="text-wraper">
                  <h4 className="font-size-change">{race.title}</h4>
                  <div className="name-wraper">
                    <img src={race.flag} alt="" />
                    <h6>{race.rider}</h6>
                  </div>
                </div>
                <h5><strong>{race.speed}</strong></h5>
                <img src={race.image} alt="" className="absolute-img" />
                <a href="#" className="green-circle-btn">
                  <img src="/images/arow.svg" alt="" />
                </a>
              </div>
            ))}

            </div>
          </div>
        </div>
      </section>
    </main>
  </>
);
}