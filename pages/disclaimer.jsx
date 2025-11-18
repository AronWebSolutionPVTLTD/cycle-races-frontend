"use client";

export const metadata = {
    title: 'Disclaimer | Wielerstats',
    description: 'Disclaimer en aansprakelijkheid van Wielerstats.',
}

export default function DisclaimerPage() {
    return (
        <>
            <main className="inner-pages-main">
                <section className="disclaimer-sec1">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="top-wraper">
                                    <ul className="breadcrumb">
                                        <li><a href="/">home</a></li>
                                        <li>disclaimer</li>
                                    </ul>
                                    <h1>DISCLAIMER</h1>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <p className="intro-text">
                                    Wielerstats is een onafhankelijk platform dat statistieken en informatie over wielerwedstrijden, renners, teams en etappes verzamelt en presenteert. Wij zijn op geen enkele manier gelieerd aan of gesponsord door officiële wielerorganisaties, wedstrijden of teams.
                                </p>

                                <div className="disclaimer-content">
                                    <h2>AANSPRAKELIJKHEID</h2>
                                    <p>
                                        Alle informatie op deze website is bedoeld voor informatieve doeleinden. Hoewel we ons best doen om de gegevens zo actueel en accuraat mogelijk te houden, geven we geen garanties over de volledigheid of juistheid van de informatie. Gebruik van de informatie op deze website is op eigen risico.
                                    </p>

                                    <h2>MERKEN EN EIGENDOMSRECHTEN</h2>
                                    <p>
                                        De namen en afbeeldingen van renners, teams, wedstrijden, organisaties, logo’s en andere handelsmerken die op deze site worden genoemd of afgebeeld, zijn eigendom van hun respectieve rechthebbenden. Wielerstats claimt geen eigendomsrechten en gebruikt deze namen en beelden uitsluitend ter identificatie en informatieve doeleinden. Dit gebruik impliceert op geen enkele wijze een relatie, goedkeuring of samenwerking met de rechthebbenden.
                                    </p>

                                    <h2>DATABRONNEN</h2>
                                    <p>De gegevens op deze site zijn afkomstig uit diverse bronnen, waaronder:</p>
                                    <ul>
                                        <li>Openbare datasets en officiële uitslagen</li>
                                        <li>API’s van externe partijen.</li>
                                        <li>Handmatig verzamelde data van vrij toegankelijke websites.</li>
                                        <li>Historische archieven en openbare informatie.</li>
                                    </ul>
                                    <p>
                                        Wij streven ernaar alleen data te gebruiken die vrij beschikbaar is of waarvoor hergebruik is toegestaan. Indien u van mening bent dat bepaalde gegevens inbreuk maken op rechten, neem dan contact met ons op, zodat we dit kunnen onderzoeken en waar nodig aanpassen of verwijderen.
                                    </p>

                                    <h2>CONTACT</h2>
                                    <p>Voor vragen of opmerkingen kunt u contact opnemen.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}