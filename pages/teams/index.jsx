import Head from 'next/head'
import React from 'react'

export default function index() {
  return (
    <>
    <Head>
      <title>head-to-head</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <main className="inner-pages-main inner-riders-main ">
      <div className="dropdown-overlay"></div>

      <section className="riders-sec1 head-head-search-val">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>Teams</li>
              </ul>
              <h1>Teams</h1>

        
            </div>
          </div>
        </div>
      </section>


   


   
    </main>
  </>
  )
}
