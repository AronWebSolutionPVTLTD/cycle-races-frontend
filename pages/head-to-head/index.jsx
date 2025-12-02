import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function index() {
  return (
   <>
      <Head>
        <title>head-to-head</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <section className="slug-main-section">
        <div className="dropdown-overlay"></div>

        <section className="riders-sec1 pt-161px">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="breadcrumb">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/stats">Stats</Link>
                  </li>
                  <li>head-to-head</li>
                </ul>
                <h1 className="mb-0">head-to-head</h1>
              </div>
            </div>
          </div>
        </section>

      <section className="stat-main-sec head-to-head-heading">
  <div className="container">
    <div className="row justify-content-lg-center ">

     <div className="col-12  col-lg-10">
      <div className="row align-items-end justify-content-between">
          {/* Rider 1 */}
      <div className="col-lg-5">
        <h6>RIDER 1</h6>
        <div className="search-box">
          <input type="text" placeholder="SEARCH" />
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.1632 34.3632L48 43.2L43.2 48L34.3632 39.1656C30.6672 42.1224 26.6928 43.2 21.6 43.2C9.6912 43.2 0 33.5112 0 21.6C0 9.6888 9.6912 0 21.6 0C33.5088 0 43.2 9.6888 43.2 21.6C43.2 26.6904 42.1224 30.6648 39.1632 34.3632ZM21.6008 36.0008C13.6602 36.0008 7.2008 29.5414 7.2008 21.6008C7.2008 13.6623 13.6602 7.2008 21.6008 7.2008C29.5414 7.2008 36.0008 13.6623 36.0008 21.6008C36.0008 29.5414 29.5414 36.0008 21.6008 36.0008Z"
                fill="#D0F068"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* VS */}
      <div className="col-lg-2 text-center">
        <h6 className="vs-text">VS</h6>
      </div>

      {/* Rider 2 */}
      <div className="col-lg-5">
        <h6>RIDER 2</h6>
        <div className="search-box">
          <input type="text" placeholder="SEARCH" />
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.1632 34.3632L48 43.2L43.2 48L34.3632 39.1656C30.6672 42.1224 26.6928 43.2 21.6 43.2C9.6912 43.2 0 33.5112 0 21.6C0 9.6888 9.6912 0 21.6 0C33.5088 0 43.2 9.6888 43.2 21.6C43.2 26.6904 42.1224 30.6648 39.1632 34.3632ZM21.6008 36.0008C13.6602 36.0008 7.2008 29.5414 7.2008 21.6008C7.2008 13.6623 13.6602 7.2008 21.6008 7.2008C29.5414 7.2008 36.0008 13.6623 36.0008 21.6008C36.0008 29.5414 29.5414 36.0008 21.6008 36.0008Z"
                fill="#D0F068"
              />
            </svg>
          </span>
        </div>
      </div>
      </div>
     </div>

    </div>
  </div>
</section>

      </section>
   </>
  )
}
