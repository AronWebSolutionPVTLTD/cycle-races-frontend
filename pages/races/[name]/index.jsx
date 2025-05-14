// pages/race/[name].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Placeholder flag component - replace with actual flag images
const Flag = ({ country = "belgium" }) => (
  <div className="w-6 h-4 bg-gray-200 flex items-center justify-center text-xs">
    {country?.charAt(0)?.toUpperCase()}
  </div>
);

const StatCard = ({ 
  title, 
  name, 
  value, 
  unit = "", 
  country = "belgium", 
  variant = "normal", 
  hasImage = true 
}) => {
  return (
    <div className={`team-cart relative rounded-lg p-4 shadow-md overflow-hidden
      ${variant === 'lime' ? 'lime-green-team-cart' : ''}
      ${variant === 'lime' && hasImage ? 'img-active' : ''}
      ${!hasImage ? 'class-for-mobile' : ''}`}>
      <a href="#?" className="pabs absolute inset-0 z-10"></a>
      <div className="text-wraper">
        <h4 className={hasImage ? "text-sm font-bold text-gray-800 capitalize" : "font-size-change text-sm font-bold text-gray-800 capitalize"}>
          {title}
        </h4>
        <div className="name-wraper flex items-center mt-2">
          <Flag country={country} />
          <h6 className="ml-2 font-semibold">{name}</h6>
        </div>
      </div>
      <h5 className="text-xl mt-3">
        <strong className="text-2xl font-bold">{value}</strong>
        {unit && ` ${unit}`}
      </h5>
      {hasImage && (
        <div className="absolute-img absolute right-0 bottom-0">
          {/* Placeholder for actual images */}
          <div className="w-24 h-32 bg-gray-100 rounded-tl-lg"></div>
        </div>
      )}
      <a href="#?" className={`${variant === 'lime' ? 'white-circle-btn' : 'green-circle-btn'} 
        absolute bottom-3 left-3 w-8 h-8 rounded-full flex items-center justify-center
        ${variant === 'lime' ? 'bg-white' : 'bg-green-600'} z-20`}>
        <span className="text-sm">→</span>
      </a>
    </div>
  );
};

const StatsBox = ({ title, value }) => (
  <div className="races bg-green-600 rounded-lg p-6 flex items-center justify-center h-full">
    <h5 className="text-white text-center text-xl">
      {title} <strong className="text-3xl block mt-2">{value}</strong>
    </h5>
  </div>
);

const TeamRankingList = ({ title, teams }) => (
  <div className="list-white-cart bg-white rounded-lg p-4 shadow-md relative h-full">
    <h4 className="fs-chenge text-lg font-bold mb-4">{title}</h4>
    <ul>
      {teams.map((team, index) => (
        <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
          <strong className="mr-2">{index + 1}.</strong>
          <div className="name-wraper flex items-center flex-1">
            <Flag country={team.country} />
            <h6 className="ml-2">{team.name}</h6>
          </div>
          <span className="text-sm">{team.value}</span>
        </li>
      ))}
    </ul>
    <div className="absolute-img absolute right-0 bottom-0">
      {/* Placeholder for actual image */}
      <div className="w-24 h-32 bg-gray-100 rounded-tl-lg"></div>
    </div>
    <h5 className="mt-4"><strong className="text-xl">31</strong> jaar</h5>
    <a href="#?" className="glob-btn inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-full">
      <strong>volledige stats</strong> <span className="ml-2">→</span>
    </a>
  </div>
);

const WinnerBox = ({ name, wins, country = "italy" }) => (
  <div className="winning-box bg-green-600 rounded-lg p-6 relative overflow-hidden text-white my-12">
    <div className="text-wraper z-10 relative">
      <h3 className="text-lg uppercase">meeste overwinningen</h3>
      <h4 className="text-2xl font-bold mt-2">{name}</h4>
    </div>
    <span className="text-6xl font-bold absolute right-12 top-1/2 transform -translate-y-1/2">
      {wins}
    </span>
    <div className="player-img absolute right-0 bottom-0">
      {/* Placeholder for actual image */}
      <div className="w-32 h-48 bg-green-700 rounded-tl-lg"></div>
    </div>
  </div>
);

// Generate years from 1990 to current year
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1990; year <= currentYear; year++) {
    years.push(year);
  }
  return years.reverse();
};

// Sample nationalities for the dropdown
const nationalities = [
  "All", "Belgium", "Italy", "France", "Netherlands", "Spain", 
  "Colombia", "Slovenia", "Denmark", "Great Britain", "Australia"
];

// Sample teams for the dropdown
const teams = [
  "All", "Team Movistar", "Lotto Soedal", "Jumbo-Visma", 
  "Intermarché", "Quickstep", "UAE Team Emirates", "Ineos Grenadiers"
];

export default function RaceDetailsPage() {
  const router = useRouter();
  const { name } = router.query;
  const [isRouterReady, setIsRouterReady] = useState(false);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState("All-time");
  const [selectedNationality, setSelectedNationality] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");
  
  const [raceData, setRaceData] = useState({
    name: "Loading race...",
    country: "belgium",
    distance: "194,6 km",
    edition: 54,
    careerWins: 62,
    oldestRider: {
      name: "Domenico Pozzovivo",
      age: 39,
      country: "italy"
    },
    oldestTeam: {
      name: "Team Movistar",
      age: 31,
      country: "spain"
    },
    mostPopularClimb: {
      name: "Alpe d'Huez",
      count: 18,
      country: "france"
    },
    fastestSprint: {
      name: "Wout van Aert",
      speed: 78,
      country: "belgium"
    },
    mostParticipations: {
      name: "Primoz Roglic",
      count: 12,
      country: "slovenia"
    },
    consecutiveWins: {
      name: "Primoz Roglic",
      count: 4,
      country: "slovenia"
    },
    mostWins: {
      name: "Gilberto Simoni",
      count: 3,
      country: "italy"
    },
    teamRankings: [
      { name: "Team Movistar", value: "31 jaar", country: "spain" },
      { name: "Lotto Soedal", value: "31 jaar", country: "belgium" },
      { name: "Jumbo-Visma", value: "31 jaar", country: "netherlands" },
      { name: "Intermarché", value: "31 jaar", country: "belgium" },
      { name: "Quickstep", value: "31 jaar", country: "belgium" }
    ]
  });
  
  // Fetch data based on filters
  const fetchFilteredData = async (raceName, year, nationality, team) => {
    console.log(`Fetching data for race: ${raceName}, year: ${year}, nationality: ${nationality}, team: ${team}`);
    
    // This would be replaced with an actual API call
    // Example: 
    // const response = await fetch(`/api/race-stats?name=${raceName}&year=${year}&nationality=${nationality}&team=${team}`);
    // const data = await response.json();
    // setRaceData(data);
    
    // For now, just simulate a data change based on filters
    if (year !== "All-time") {
      setRaceData(prevData => ({
        ...prevData,
        edition: parseInt(year) - 1967, // Example calculation
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
        fetchFilteredData(raceName, selectedYear, selectedNationality, selectedTeam);
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
        selectedTeam
      );
    }
  }, [selectedYear, selectedNationality, selectedTeam, isRouterReady, name]);

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
    <main>
      <section className="stats-sec1 race-details-sec py-8">
        <div className="container mx-auto px-4">
          <div className="row">
            {/* Advertisement - Can be added if needed */}
            {/* <div className="col-lg-7 mx-auto mb-6">
              <div className="add-wraper">
                <a href="#?"><div className="bg-gray-200 h-24 flex items-center justify-center">Advertisement</div></a>
              </div>
            </div> */}
            
            {/* Breadcrumb */}
            <div className="col-lg-12 mb-6">
              <div className="top-wraper">
                <ul className="breadcrumb flex items-center text-sm mb-4">
                  <li className="mr-2"><a href="/" className="text-gray-600 hover:text-green-600">home</a></li>
                  <li className="mx-2"><a href="/stats" className="text-gray-600 hover:text-green-600">stats</a></li>
                  <li className="mx-2 text-gray-800">{raceData.name}</li>
                </ul>
                <div className="wraper">
                  <h1 className="text-4xl font-bold mb-4">{raceData.name}</h1>
                </div>
                <ul className="plyr-dtls flex items-center mb-6">
                  <li className="flex items-center mr-6">
                    <Flag country={raceData.country} />
                    <span className="ml-2 text-sm">{raceData.country}</span>
                  </li>
                  <li className="text-sm">{raceData.distance}</li>
                </ul>
              </div>
              
              {/* Filters */}
              <ul className="filter flex flex-wrap mb-8">
                <li className="mr-4 mb-2">
                  <select 
                    className="border rounded p-2"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="All-time">All-time</option>
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </li>
                <li className="mr-4 mb-2">
                  <select 
                    className="border rounded p-2"
                    value={selectedNationality}
                    onChange={(e) => setSelectedNationality(e.target.value)}
                  >
                    {nationalities.map(nationality => (
                      <option key={nationality} value={nationality}>{nationality}</option>
                    ))}
                  </select>
                </li>
                <li className="mr-4 mb-2">
                  <select 
                    className="border rounded p-2"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </li>
              </ul>
            </div>
            
            {/* Top row of stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="col-span-1">
                <StatCard
                  title="Oudste top-10 renner in grote ronde"
                  name={raceData.oldestRider.name}
                  value={raceData.oldestRider.age}
                  unit="jaar"
                  country={raceData.oldestRider.country}
                />
              </div>
              
              <div className="col-span-1">
                <StatsBox title="wins in carriere" value={raceData.careerWins} />
              </div>
              
              <div className="col-span-1">
                <StatCard
                  title="oudste team"
                  name={raceData.oldestTeam.name}
                  value={raceData.oldestTeam.age}
                  unit="jaar"
                  country={raceData.oldestTeam.country}
                />
              </div>
              
              <div className="col-span-1">
                <StatCard
                  title="meest gekozen klim in de tour de france"
                  name={raceData.mostPopularClimb.name}
                  value={raceData.mostPopularClimb.count}
                  country={raceData.mostPopularClimb.country}
                  variant="lime"
                  hasImage={false}
                />
              </div>
            </div>
            
            {/* Middle content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <StatCard
                      title="Snelste sprint"
                      name={raceData.fastestSprint.name}
                      value={raceData.fastestSprint.speed}
                      unit="km/ph"
                      country={raceData.fastestSprint.country}
                    />
                  </div>
                  <div className="md:col-span-7">
                    <StatCard
                      title="meest aantal deelnames"
                      name={raceData.mostParticipations.name}
                      value={raceData.mostParticipations.count}
                      country={raceData.mostParticipations.country}
                      variant="lime"
                    />
                  </div>
                  <div className="md:col-span-7">
                    <StatCard
                      title="Meest opeenvolgende overwinningen"
                      name={raceData.consecutiveWins.name}
                      value={raceData.consecutiveWins.count}
                      country={raceData.consecutiveWins.country}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <StatsBox title="editie" value={raceData.edition} />
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5">
                <TeamRankingList title="oudste team" teams={raceData.teamRankings} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winner section */}
      <section className="home-sec3">
        <div className="container mx-auto px-4">
          <div className="row">
            {/* Advertisement - Can be added if needed */}
            {/* <div className="col-lg-9 mx-auto mb-6">
              <div className="add-wraper">
                <a href="#?"><div className="bg-gray-200 h-24 flex items-center justify-center">Advertisement</div></a>
              </div>
            </div> */}
            
            <div className="col-lg-12">
              <WinnerBox name={raceData.mostWins.name} wins={raceData.mostWins.count} />
            </div>
          </div>
        </div>
      </section>

      {/* Additional stats sections */}
      <section className="stats-sec1 pt-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1">
              <StatCard
                title="Snelste sprint"
                name={raceData.fastestSprint.name}
                value={raceData.fastestSprint.speed}
                unit="km/ph"
                country={raceData.fastestSprint.country}
                variant="lime"
              />
            </div>
            
            <div className="col-span-1">
              <StatCard
                title="Oudste top-10 renner in grote ronde"
                name={raceData.oldestRider.name}
                value={raceData.oldestRider.age}
                unit="jaar"
                country={raceData.oldestRider.country}
              />
            </div>
            
            <div className="col-span-1">
              <StatCard
                title="oudste team"
                name={raceData.oldestTeam.name}
                value={raceData.oldestTeam.age}
                unit="jaar"
                country={raceData.oldestTeam.country}
              />
            </div>
            
            <div className="col-span-1">
              <StatCard
                title="meest gekozen klim in de tour de france"
                name={raceData.mostPopularClimb.name}
                value={raceData.mostPopularClimb.count}
                country={raceData.mostPopularClimb.country}
              />
            </div>
          </div>
          
          {/* Additional layouts for more stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            <div className="lg:col-span-5">
              <TeamRankingList title="oudste team" teams={raceData.teamRankings} />
            </div>
            
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7">
                  <StatCard
                    title="meest aantal deelnames"
                    name={raceData.mostParticipations.name}
                    value={raceData.mostParticipations.count}
                    country={raceData.mostParticipations.country}
                  />
                </div>
                <div className="md:col-span-5">
                  <StatCard
                    title="Snelste sprint"
                    name={raceData.fastestSprint.name}
                    value={raceData.fastestSprint.speed}
                    unit="km/ph"
                    country={raceData.fastestSprint.country}
                  />
                </div>
                <div className="md:col-span-5">
                  <StatCard
                    title="Snelste sprint"
                    name={raceData.fastestSprint.name}
                    value={raceData.fastestSprint.speed}
                    unit="km/ph"
                    country={raceData.fastestSprint.country}
                  />
                </div>
                <div className="md:col-span-7">
                  <StatCard
                    title="Meest opeenvolgende overwinningen"
                    name={raceData.consecutiveWins.name}
                    value={raceData.consecutiveWins.count}
                    country={raceData.consecutiveWins.country}
                    variant="lime"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop-only section (duplicated Winner box) */}
      <section className="home-sec3 desktop-section hidden md:block">
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="col-lg-12">
              <WinnerBox name={raceData.mostWins.name} wins={raceData.mostWins.count} />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only section (duplicated Winner box) */}
      <section className="home-sec3 mobile-section block md:hidden">
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="col-lg-12">
              <WinnerBox name={raceData.mostWins.name} wins={raceData.mostWins.count} />
            </div>
          </div>
        </div>
      </section>
    </main>
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