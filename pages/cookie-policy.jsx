import Link from "next/link";

const CookiePolicy = () => (


  <main className="inner-pages-main ">
    <section className="cookiePolicy-sec1">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="top-wraper">
              <ul className="breadcrumb">
                <li><a href="/">home</a></li>
                <li>cookies</li>
              </ul>
              <h1>cookies</h1>
            </div>
          </div>
          <div className="col-lg-8 policy-content">
            <p>
              Laatst bijgewerkt: februari 2026                                </p>
            <p>
              Wielerstats gebruikt cookies om de website goed te laten functioneren en om inzicht te krijgen in het gebruik ervan. </p>
            <div className="disclaimer-content">
              <h2>Wat zijn cookies?</h2>
              <p>
                Cookies zijn kleine tekstbestanden die bij het bezoeken van een website op je apparaat worden opgeslagen.                                    </p>

              <h2>Welke cookies gebruiken wij?</h2>
              <h3><b className="fw-800">Functionele cookies</b></h3>
              <p>
                Deze cookies zijn nodig om de website goed te laten werken. Ze onthouden bijvoorbeeld instellingen of voorkeuren.                                    </p>

              <h3><b className="fw-800">Analytische cookies</b></h3>
              <p>Via Google Analytics gebruiken we cookies om:</p>
              <ul>
                <li>het aantal bezoekers te meten</li>
                <li>te zien welke pagina’s worden bezocht</li>
                <li>de website te verbeteren</li>
              </ul>
              <p>Deze gegevens zijn anoniem en niet te herleiden tot een persoon.</p>

              <h3><b className="fw-800">Advertentiecookies</b></h3>
              <p>Via Google AdSense kunnen cookies worden geplaatst om:</p>
              <ul>
                <li>advertenties relevanter te maken</li>
                <li>advertentieprestaties te meten</li>
                <li>advertentieprestaties te meten</li>
              </ul>
              <h2>Cookies beheren of uitschakelen</h2>
              <p>
                Je kunt cookies zelf verwijderen of uitschakelen via de instellingen van je browser.
                Houd er rekening mee dat de website dan mogelijk minder goed werkt. Meer informatie over het beheren van cookies per browser:
                https://www.consumentenbond.nl/internet-privacy/cookies-verwijderen</p>

              <h2>Contact</h2>


              <p>
                Voor vragen over cookies kun je contact opnemen via : {" "}
                <a href="mailto:info@wielerstats.nl" className="fw-semibold text-decoration-underline" style={{ color: "#2b534d" }} >
                  info@wielerstats.nl
                </a>
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  </main>


);

export default CookiePolicy;
