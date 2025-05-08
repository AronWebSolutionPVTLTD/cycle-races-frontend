// import { HomeData, useMultipleData } from "@/components/home/home_api_data";
import MostWin from "@/components/home/sections/MostWin";
import ResultSection from "@/components/home/sections/ResultSection";
import TeamsSection from "@/components/home/sections/TeamsSection";

import ThisYearSection from "@/components/home/sections/ThisYearSection";
import Upcoming from "@/components/home/sections/Upcoming";
import Head from "next/head";


export default function Home() {
  // const { data, loading, error, partialSuccess } = useMultipleData([
  //   "mostStageWins",
  //   "mostGCWins",
  //   "oldestRider",
  //   "stageTop10sRider",
  //   "oldestMostWins",
  //   "youngestMostWins",
  //   "raceCount",
  //   "mostGCWins",
  //   "mostConsistentGC",
  //   "youngestRider",
  //   "mostWin",
  //   "bestClassics",
  //   "top3StageTeam",
  //   "grandTourstageWin",
  //   "topGCRiderbyTeam",
  //   "DnfTeams",
  //   "topStageRider",
  //   "longestRace",
  //   "shortestRace",
  //   "top3teamwithrank1",
  //   "lightestRider",
  // ]);

  // if (loading) return <div>Loading statistics...</div>;
  // if (error && !partialSuccess) {
  //   return (
  //     <div className="error-container">
  //       <h3>Error Loading Data</h3>
  //       <p>{error.message}</p>

  //       {/* Show detailed errors if available */}
  //       {error.details && (
  //         <div className="error-details">
  //           <h4>Failed endpoints:</h4>
  //           <ul>
  //             {Object.keys(error.details).map((key) => (
  //               <li key={key}>
  //                 <strong>{key}:</strong> {error.details[key].message}
  //                 {error.details[key].status && (
  //                   <span> (Status: {error.details[key].status})</span>
  //                 )}
  //               </li>
  //             ))}
  //           </ul>
  //           <p>
  //             Please try refreshing the page or contact support if the problem
  //             persists.
  //           </p>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }


 return (
    <>
      <Head>
        <title>Wielerstats - Cycling Statistics</title>
        <meta name="description" content="Cycling statistics and results" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
   <ResultSection/>
<ThisYearSection/>
<MostWin/>
<Upcoming/>
<TeamsSection/>
      </main>

      {/* Add other sections from your index.html */}
    </>
  );
}
