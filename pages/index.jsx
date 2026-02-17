import FirstSection from "@/components/home/sections/FirstSection";
import LastSection from "@/components/home/sections/LastSection";
import MostWin from "@/components/home/sections/MostWin";
import TopSection from "@/components/home/sections/TopSection";
import UpcomingYear from "@/components/home/sections/UpcomingYear";
import YearSection from "@/components/home/sections/YearSection";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wielerstats | Wielerstatistieken, Uitslagen & Records van Renners en Wedstrijden</title>
        <meta
          name="description"
          content="Alle wielerstatistieken op één plek. Bekijk uitslagen, overwinningen, podiumplaatsen en historische records van renners, teams en wedstrijden."
        />
        <link rel="icon" href="/images/ws_favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="home-main inner-pages-main">
        <TopSection />
        <FirstSection />
        <YearSection />
        <MostWin
          apiEndpoint="mostWin"
          title="Most Wins"
          dataField="wins"
        />
        <UpcomingYear />
        {/* <LastSection /> */}
      </main>
    </>
  );
}
