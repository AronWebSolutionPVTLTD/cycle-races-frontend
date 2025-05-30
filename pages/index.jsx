// import { HomeData, useMultipleData } from "@/components/home/home_api_data";
import FirstSection from "@/components/home/sections/FirstSection";
import LastSection from "@/components/home/sections/LastSection";
import MostWin from "@/components/home/sections/MostWin";
import ResultSection from "@/components/home/sections/ResultSection";
import TeamsSection from "@/components/home/sections/TeamsSection";

import ThisYearSection from "@/components/home/sections/ThisYearSection";
import Upcoming from "@/components/home/sections/Upcoming";
import UpcomingYear from "@/components/home/sections/UpcomingYear";
import YearSection from "@/components/home/sections/YearSection";
import Head from "next/head";


export default function Home() {
return (
    <>
      <Head>
        <title>Wielerstats - Cycling Statistics</title>
        <meta name="description" content="Cycling statistics and results" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
  {/* <ResultSection/> */}
  {/* <ThisYearSection/> */}
 <FirstSection/>
<YearSection/> 
<MostWin/>
<UpcomingYear/>
<LastSection/> 
 
   {/*<Upcoming/>
   <TeamsSection/>*/}

 
      </main>

    </>
  );
}
