"use client";

import ContactForm from '../components/ContactForm'
export const metadata = {
  title: 'Contact | Wielerstats',
  description: 'Neem contact met ons op bij Wielerstats.',
}

export default function ContactPage() {
  return (
    <>
      <main className="inner-pages-main ">
        <section className="contact-sec1">
          <div className="container">
            <div className="row">
              <div className="co-lg-12">
                <div className="top-wraper">
                  <ul className="breadcrumb">
                    <li><a href="index.html">home</a></li>
                    <li>contact</li>
                  </ul>
                  <h1>contact</h1>
                </div>
              </div>
              <div className="col-lg-6 col-md-8">
                <p className="mb-4">
                  Bij Wielerstats waarderen we je bijdrage! Heb je ontbrekende informatie, tips of een bug gevonden?
                  Laat het ons weten zodat we het kunnen oplossen! Laat je e-mailadres achter als we contact met je
                  moeten opnemen, dit is niet verplicht.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

    </>
  )
}
