
import { FilterDropdown } from '@/components/stats_section/FilterDropdown';
import { FirstSection } from '@/components/stats_section/FirstSection';
import MostwinSection from '@/components/stats_section/MostwinSection';
import { callAPI } from '@/lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// export default function Stats() {
//     const [years, setYears] = useState([]);
//     const [nationalities, setNationalities] = useState([]);
//     const [teams, setTeams] = useState([]);
    
//     // Selected filter values and search inputs combined
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
//     const [selectedNationality, setSelectedNationality] = useState('');
//     const [selectedTeam, setSelectedTeam] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [showYearDropdown, setShowYearDropdown] = useState(false);
//     const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
//     const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  
//     // Refs for handling clicks outside dropdowns
//     const yearDropdownRef = useRef(null);
//     const nationalityDropdownRef = useRef(null);
//     const teamDropdownRef = useRef(null);
  
   
//     useEffect(() => {
//       const currentYear = new Date().getFullYear();
//       const yearsList = Array.from({length: 10}, (_, i) => (currentYear - i).toString());
//       setYears(yearsList);
//     }, []);
  
//     // Fetch data from API based on filters
//     const fetchData = useCallback(async () => {
//       try {
//         setIsLoading(true);
        
//          const queryParams = {};
//       if (selectedTeam) queryParams.q_team = selectedTeam;
//       if (selectedNationality) queryParams.q_country = selectedNationality;
      
//       const response = await callAPI('GET', '/teams/getAllTeamsForFilters', queryParams);
      
//       if (response.status && response.data) {
//         setTeams(response.data.team_names || []);
//         setNationalities(response.data.rider_countries || []);
//       }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, [selectedNationality, selectedTeam]);
  
 
//     useEffect(() => {
//       fetchData();
//     }, [fetchData]);
  
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
//           setShowYearDropdown(false);
//         }
//         if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target)) {
//           setShowNationalityDropdown(false);
//         }
//         if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target)) {
//           setShowTeamDropdown(false);
//         }
//       };
  
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, []);
  

//     const getFilteredOptions = (options, searchValue) => {
//       return options.filter(option => 
//         option.toLowerCase().includes((searchValue || '').toLowerCase())
//       );
//     };
  
    
//     const handleSelection = (type, value) => {
//       switch(type) {
//         case 'year':
//           setSelectedYear(value);
//           setShowYearDropdown(false);
//           break;
//         case 'nationality':
//           setSelectedNationality(value);
//           setShowNationalityDropdown(false);
//           fetchData();
//           break;
//         case 'team':
//           setSelectedTeam(value);
//           setShowTeamDropdown(false);
//           fetchData();
//           break;
//       }
//     };
  

//     return (
//       <>
//         <Head>
//           <title>Stats - Wielerstats</title>
//         </Head>
  
//         <section className="stats-sec1 lazy">
//           <div className="container">
//             <div className="row">
//               <div className="col-lg-12">
//                 <ul className="breadcrumb">
//                   <li><Link href="/">home</Link></li>
//                   <li>stats</li>
//                 </ul>
//                 <h1>statistieken</h1>
                
//                 <ul className="filter">
//                   {/* Year Dropdown */}
//                   <FilterDropdown
//                     ref={yearDropdownRef}
//                     isOpen={showYearDropdown}
//                     toggle={() => setShowYearDropdown(!showYearDropdown)}
//                     options={getFilteredOptions(years, selectedYear)}
//                     selectedValue={selectedYear}
//                     placeholder="Year"
//                     onSelect={(value) => handleSelection('year', value)}
//                     loading={false}
//                     includeAllOption={false}
//                   />
  
//                   {/* Nationality Dropdown */}
//                   <FilterDropdown
//                     ref={nationalityDropdownRef}
//                     isOpen={showNationalityDropdown}
//                     toggle={() => setShowNationalityDropdown(!showNationalityDropdown)}
//                     options={getFilteredOptions(nationalities, selectedNationality)}
//                     selectedValue={selectedNationality}
//                     placeholder="Nationaliteit"
//                     onSelect={(value) => handleSelection('nationality', value)}
//                     loading={isLoading}
//                     allOptionText="All Nationalities"
//                   />
  
//                   {/* Teams Dropdown */}
//                   <FilterDropdown
//                     ref={teamDropdownRef}
//                     isOpen={showTeamDropdown}
//                     toggle={() => setShowTeamDropdown(!showTeamDropdown)}
//                     options={getFilteredOptions(teams, selectedTeam)}
//                     selectedValue={selectedTeam}
//                     placeholder="Team"
//                     onSelect={(value) => handleSelection('team', value)}
//                     loading={isLoading}
//                     allOptionText="All Teams"
//                   />
//                 </ul>
//               </div>
//              <FirstSection selectedNationality={selectedNationality} selectedTeam={selectedTeam} selectedYear={selectedYear}/>
//             </div>
//           </div>
//         </section>

//    {/* <MostwinSection/> */}

//     {/* <section className="stats-sec1 lazy pt-0">
//         <div className="container">
//             <div className="row">
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart lime-green-team-cart img-active">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4 className="font-size-change">Snelste sprint</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Wout van Aert</h6>
//                             </div>
//                         </div>
//                         <h5><strong>78</strong>km/ph</h5>
//                         <img src="/images/player6.png" alt=""  className="absolute-img" />
//                         <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>Oudste top-10 renner in grote ronde</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Domenico Pozzovivo</h6>
//                             </div>
//                         </div>
//                         <h5><strong>39</strong>jaar</h5>
//                         <img src="/images/player1.png" alt=""  className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>oudste team</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Team Movistar</h6>
//                             </div>
//                         </div>
//                         <h5><strong>31</strong>jaar</h5>
//                         <img src="/images/player2.png" alt="" className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart className-for-mobile">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>meest gekozen klim in de tour de france</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Alpe d’Huez</h6>
//                             </div>
//                         </div>
//                         <h5><strong>18</strong></h5>
//                         <img src="/images/player3.png" alt=""  className="absolute-img" /> 
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-5">
//                     <div className="list-white-cart">
//                         <h4 className="fs-chenge">oudste team</h4>
//                         <ul>
//                             <li>
//                                 <strong>1.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Team Movistar</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>2.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Lotto Soedal</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>3.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Jumbo-Visma</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>4.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Intermarché</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>5.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Quickstep</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                         </ul>
//                         <img src="/images/player4.png" alt=""  className="absolute-img" />
//                         <h5><strong>31</strong>jaar</h5>
//                         <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-7">
//                     <div className="row">
//                         <div className="col-lg-7 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">meest aantal deelnames</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Primoz Roglic</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>12</strong></h5>
//                                 <img src="/images/player3.png" alt="" className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-5 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Snelste sprint</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Wout van Aert</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>78</strong>km/ph</h5>
//                                 <img src="/images/player6.png" alt="" className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-5 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Snelste sprint</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Wout van Aert</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>78</strong>km/ph</h5>
//                                 <img src="/images/player6.png" alt=""  className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-7 col-md-6">
//                             <div className="team-cart lime-green-team-cart img-active">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Meest opeenvolgende overwinningen</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Primoz Roglic</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>4</strong></h5>
//                                 <img src="/images/player3.png" alt=""  className="absolute-img" />
//                                 <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </section>

//     <section className="home-sec3 lazy desktop-section">
//         <div className="container">
//             <div className="row">
//                 <div className="col-lg-9 mx-auto">
//                     <div className="add-wraper">
//                         <a href="#?"><img src="/images/add3.png" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-12">
//                     <div className="winning-box">
//                         <div className="text-wraper">
//                             <h3>meeste overwinningen</h3>
//                             <h4>Gilberto Simoni</h4>
//                         </div>
//                         <span>3</span>
//                         <img src="/images/player5.png" alt=""  className="player-img" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </section>

//     <section className="stats-sec1 lazy pt-0">
//         <div className="container">
//             <div className="row">
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart lime-green-team-cart img-active">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4 className="font-size-change">Snelste sprint</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Wout van Aert</h6>
//                             </div>
//                         </div>
//                         <h5><strong>78</strong>km/ph</h5>
//                         <img src="/images/player6.png" alt=""  className="absolute-img" />
//                         <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>Oudste top-10 renner in grote ronde</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Domenico Pozzovivo</h6>
//                             </div>
//                         </div>
//                         <h5><strong>39</strong>jaar</h5>
//                         <img src="/images/player1.png" alt=""  className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>oudste team</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Team Movistar</h6>
//                             </div>
//                         </div>
//                         <h5><strong>31</strong>jaar</h5>
//                         <img src="/images/player2.png" alt=""  className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="team-cart className-for-mobile">
//                         <a href="#?" className="pabs"></a>
//                         <div className="text-wraper">
//                             <h4>meest gekozen klim in de tour de france</h4>
//                             <div className="name-wraper">
//                                 <img src="/images/flag9.svg" alt="" />
//                                 <h6>Alpe d’Huez</h6>
//                             </div>
//                         </div>
//                         <h5><strong>18</strong></h5>
//                         <img src="/images/player3.png" alt=""  className="absolute-img" />
//                         <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-5">
//                     <div className="list-white-cart">
//                         <h4 className="fs-chenge">oudste team</h4>
//                         <ul>
//                             <li>
//                                 <strong>1.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Team Movistar</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>2.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Lotto Soedal</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>3.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Jumbo-Visma</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>4.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Intermarché</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                             <li>
//                                 <strong>5.</strong>
//                                 <div className="name-wraper">
//                                     <img src="/images/flag9.svg" alt="" />
//                                     <h6>Quickstep</h6>
//                                 </div>
//                                 <span>31 jaar</span>
//                             </li>
//                         </ul>
//                         <img src="/images/player4.png" alt=""  className="absolute-img" />
//                         <h5><strong>31</strong>jaar</h5>
//                         <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
//                     </div>
//                 </div>
//                 <div className="col-lg-7">
//                     <div className="row">
//                         <div className="col-lg-7 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">meest aantal deelnames</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Primoz Roglic</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>12</strong></h5>
//                                 <img src="/images/player3.png" alt="" className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-5 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Snelste sprint</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Wout van Aert</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>78</strong>km/ph</h5>
//                                 <img src="/images/player6.png" alt=""  className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-5 col-md-6">
//                             <div className="team-cart">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Snelste sprint</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Wout van Aert</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>78</strong>km/ph</h5>
//                                 <img src="/images/player6.png" alt=""  className="absolute-img" />
//                                 <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                         <div className="col-lg-7 col-md-6">
//                             <div className="team-cart lime-green-team-cart img-active">
//                                 <a href="#?" className="pabs"></a>
//                                 <div className="text-wraper">
//                                     <h4 className="font-size-change">Meest opeenvolgende overwinningen</h4>
//                                     <div className="name-wraper">
//                                         <img src="/images/flag9.svg" alt="" />
//                                         <h6>Primoz Roglic</h6>
//                                     </div>
//                                 </div>
//                                 <h5><strong>4</strong></h5>
//                                 <img src="/images/player3.png" alt=""  className="absolute-img" />
//                                 <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </section>

//     <section className="home-sec3 lazy mobile-section">
//         <div className="container">
//             <div className="row">
//                 <div className="col-lg-12">
//                     <div className="winning-box">
//                         <div className="text-wraper">
//                             <h3>meeste overwinningen</h3>
//                             <h4>Gilberto Simoni</h4>
//                         </div>
//                         <span>3</span>
//                         <img src="/images/player5.png" alt="" className="player-img" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </section> */}
//  </>
//   );
// }

// import { FilterDropdown } from '@/components/stats_section/FilterDropdown';
// import { FirstSection } from '@/components/stats_section/FirstSection';
// import MostwinSection from '@/components/stats_section/MostwinSection';
// import { callAPI } from '@/lib/api';
// import Head from 'next/head';
// import Link from 'next/link';
// import { useCallback, useEffect, useRef, useState } from 'react';



export default function Stats() {
    const [years, setYears] = useState([]);
    const [nationalities, setNationalities] = useState([]);
    const [teams, setTeams] = useState([]);
    
    // Selected filter values and search inputs combined
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
    const [selectedNationality, setSelectedNationality] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  
    // Refs for handling clicks outside dropdowns
    const yearDropdownRef = useRef(null);
    const nationalityDropdownRef = useRef(null);
    const teamDropdownRef = useRef(null);
  
    // Initialize years list
    useEffect(() => {
      const currentYear = new Date().getFullYear();
      const yearsList = Array.from({length: 10}, (_, i) => (currentYear - i).toString());
      setYears(yearsList);
    }, []);
  
    // Fetch nationalities and teams based on filters
    const fetchFiltersData = useCallback(async () => {
      try {
        setIsLoading(true);
        
        const queryParams = {};
        if (selectedTeam) queryParams.q_team = selectedTeam;
        if (selectedNationality) queryParams.q_country = selectedNationality;
        if (selectedYear) queryParams.q_year = selectedYear;
      
        const response = await callAPI('GET', '/teams/getAllTeamsForFilters', queryParams);
      
        if (response.status && response.data) {
          setTeams(response.data.team_names || []);
          setNationalities(response.data.rider_countries || []);
        }
      } catch (error) {
        console.error('Error fetching filters data:', error);
      } finally {
        setIsLoading(false);
      }
    }, [selectedNationality, selectedTeam, selectedYear]);
  
    useEffect(() => {
      fetchFiltersData();
    }, [fetchFiltersData]);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
          setShowYearDropdown(false);
        }
        if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target)) {
          setShowNationalityDropdown(false);
        }
        if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target)) {
          setShowTeamDropdown(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    // Filter years based on input
    const getFilteredYears = (searchValue) => {
      return years.filter(year => 
        year.toLowerCase().includes((searchValue || '').toLowerCase())
      );
    };
    
    // Handle year input change to filter the dropdown options without API call
    const handleYearInputChange = (value) => {
      setYearInput(value);
      // No API call on typing, just filter the dropdown options
    };
    
    const handleSelection = (type, value) => {
      switch(type) {
        case 'year':
          setSelectedYear(value);
          setYearInput(value);
          setShowYearDropdown(false);
          fetchFiltersData(); // Fetch data with new year
          break;
        case 'nationality':
          setSelectedNationality(value);
          setShowNationalityDropdown(false);
          fetchFiltersData(); // Fetch data with new nationality
          break;
        case 'team':
          setSelectedTeam(value);
          setShowTeamDropdown(false);
          fetchFiltersData(); // Fetch data with new team
          break;
      }
    };
  
    return (
      <>
        <Head>
          <title>Stats - Wielerstats</title>
        </Head>
  
        <section className="stats-sec1 lazy">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="breadcrumb">
                  <li><Link href="/">home</Link></li>
                  <li>stats</li>
                </ul>
                <h1>statistieken</h1>
                
                <ul className="filter">
                  {/* Year Dropdown with input change handling */}
                  <FilterDropdown
                    ref={yearDropdownRef}
                    isOpen={showYearDropdown}
                    toggle={() => setShowYearDropdown(!showYearDropdown)}
                    options={getFilteredYears(yearInput)}
                    selectedValue={selectedYear}
                    placeholder="Year"
                    onSelect={(value) => handleSelection('year', value)}
                    onInputChange={handleYearInputChange}
                    loading={false}
                    includeAllOption={false}
                  />
  
                  {/* Nationality Dropdown */}
                  <FilterDropdown
                    ref={nationalityDropdownRef}
                    isOpen={showNationalityDropdown}
                    toggle={() => setShowNationalityDropdown(!showNationalityDropdown)}
                    options={nationalities}
                    selectedValue={selectedNationality}
                    placeholder="Nationaliteit"
                    onSelect={(value) => handleSelection('nationality', value)}
                    loading={isLoading}
                    allOptionText="All Nationalities"
                  />
  
                  {/* Teams Dropdown */}
                  <FilterDropdown
                    ref={teamDropdownRef}
                    isOpen={showTeamDropdown}
                    toggle={() => setShowTeamDropdown(!showTeamDropdown)}
                    options={teams}
                    selectedValue={selectedTeam}
                    placeholder="Team"
                    onSelect={(value) => handleSelection('team', value)}
                    loading={isLoading}
                    allOptionText="All Teams"
                  />
                </ul>
              </div>
              <FirstSection 
                selectedNationality={selectedNationality} 
                selectedTeam={selectedTeam} 
                selectedYear={selectedYear}
              />
            </div>
          </div>
        </section>

        {/* You can uncomment these sections as needed */}
        {/* <MostwinSection/> */}
      </>
    );
}