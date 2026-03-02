"use client";

import Head from "next/head";
import Link from "next/link";

export const metadata = {
  title: 'Disclaimer | Wielerstats',
  description: 'Disclaimer en aansprakelijkheid van Wielerstats.',
}

export default function About() {
  return (
    <>
      <Head>
        <title>Over Wielerstats | Wielerstats</title>
        <meta name="description" content="Lees de disclaimer van Wielerstats over het gebruik van gegevens en aansprakelijkheid." />
      </Head>
      <main className="inner-pages-main">
        <section className="disclaimer-sec1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="top-wraper">
                  <ul className="breadcrumb">
                    <li><a href="/">home</a></li>
                    <li>Over Wielerstats</li>
                  </ul>
                  <h1>Over Wielerstats</h1>
                </div>
              </div>
              <div className="col-lg-8">


                <div className="disclaimer-content">
                  <p className="">
                    Wielerstats is een onafhankelijk online platform dat wielerstatistieken en wedstrijdgegevens overzichtelijk bundelt.
                    Op deze website vind je actuele uitslagen, rankings en historische data van professionele wielerwedstrijden, renners en teams.
                  </p>
                  <p>

                    Het doel van Wielerstats is om wielerliefhebbers, volgers en analisten eenvoudig toegang te geven tot betrouwbare en gestructureerde wielerdata.
                    Van grote rondes tot eendagskoersen en van individuele prestaties tot teamstatistieken — alle gegevens worden overzichtelijk gepresenteerd.
                  </p>

                  <p>
                    De statistieken worden geraadpleegd door wielerfans die prestaties willen analyseren en vergelijken, maar ook door deelnemers aan wielerpoules en
                    fantasycompetities die hun keuzes willen onderbouwen met historische en actuele gegevens.
                  </p>

                  <p>
                    Wielerstats is geen nieuwswebsite, maar een gespecialiseerd statistiekplatform dat zich volledig richt op wielerdata en prestatieoverzichten.
                  </p>

                  <h2>Databronnen en werkwijze</h2>
                  <p>VooDe statistieken op Wielerstats zijn gebaseerd op officiële wedstrijdresultaten en publiek beschikbare gegevens van wielerorganisaties.
                    De data wordt gestructureerd verwerkt en regelmatig geactualiseerd om een zo betrouwbaar mogelijk overzicht te bieden.
                    Rankings worden samengesteld op basis van vooraf vastgestelde criteria per statistiek.</p>

                  <p>
                    Heb je vragen, suggesties of zie je een onjuistheid in de gegevens? Neem dan gerust contact op via de contactpagina.</p>
                </div>

              </div>
            </div>
          </div>

        </section>
      </main>
    </>
  )
}