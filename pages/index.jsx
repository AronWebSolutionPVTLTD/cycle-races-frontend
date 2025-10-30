// import { HomeData, useMultipleData } from "@/components/home/home_api_data";
import FirstSection from "@/components/home/sections/FirstSection";
import LastSection from "@/components/home/sections/LastSection";
import MostWin from "@/components/home/sections/MostWin";
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="home-main">
        <FirstSection />
        <YearSection />
        <MostWin
          apiEndpoint="mostWin"
          title="Most Wins"
          dataField="wins"
        />
        <UpcomingYear />
        <LastSection />
      </main>
    </>
  );
}
