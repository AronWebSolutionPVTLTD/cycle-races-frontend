import Link from 'next/link'
import React from 'react'

const TopSection = () => {
  return (
    <section className="featured-section">
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-4 mb-4">
        <div className="team-cart lime-green-team-cart img-active featured-card bg-voilet d-flex flex-row">
                <Link href={'#'} className="pabs" />
                <div className="text-wraper d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <h4 className="text-white fw-900">Europees Kampioensch</h4>
                    <div
                      className="name-wraper name-wraper-green name-left" 
                    >
                      <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 12 6'%3e %3ctitle%3eFlag of Slovenia%3c/title%3e %3crect width='12' fill='%23ed1c24' height='6'/%3e %3crect width='12' fill='%23005da4' height='4'/%3e %3crect width='12' fill='%23fff' height='2'/%3e %3cg transform='translate(2.2238 1) scale(.12937)'%3e %3csvg width='12' viewBox='-120 -190.223125 240 309.188274' height='15.459'%3e %3cpath d='m110.26-19.478l9.74-143.75a280.22 280.22 0 0 0 -240 0l9.74 143.75a155.61 155.61 0 0 0 110.26 138.45 155.61 155.61 0 0 0 110.26 -138.45' fill='%23005da4'/%3e %3cpath d='m-90 0a138.29 138.29 0 0 0 90 100.77 138.29 138.29 0 0 0 90 -100.77l-45-60-18 24-27-54-27 54-18-24-45 60' fill='%23fff'/%3e %3cg id='wave' fill='%23005da4' transform='scale(5) translate(0 5.1962)'%3e %3cpath d='m-17.196-2.1962a6 6 0 0 0 8.1962 2.1962 6 6 0 0 1 6 0 6 6 0 0 0 6 0 6 6 0 0 1 6 0 6 6 0 0 0 8.1962 -2.1962v1.732a6 6 0 0 1 -8.1962 2.1962 6 6 0 0 0 -6 0 6 6 0 0 1 -6 0 6 6 0 0 0 -6 0 6 6 0 0 1 -8.1962 -2.1962z'/%3e %3c/g%3e %3cuse xlink:href='%23wave' transform='translate(0 17.321)'/%3e %3cg id='s' transform='translate(0,-120) scale(2.25)'%3e %3cpath stroke-width='.2' d='m0-5l1 3.2679 3.3301-0.7679-2.3301 2.5 2.3301 2.5-3.3301-0.7679-1 3.2679-1-3.2679-3.3301 0.7679 2.3301-2.5-2.3301-2.5 3.3301 0.7679z' fill='%23fd0'/%3e %3c/g%3e %3cuse xlink:href='%23s' transform='translate(-33.75,-45)'/%3e %3cuse xlink:href='%23s' transform='translate(33.75,-45)'/%3e %3cpath d='m-111.58-167.05l9.96 146.99a146.95 146.95 0 0 0 101.62 129.95 146.95 146.95 0 0 0 101.62 -129.95l9.96-146.99a280.22 280.22 0 0 0 8.42 3.82l-9.74 143.75a155.61 155.61 0 0 1 -110.26 138.45 155.61 155.61 0 0 1 -110.26 -138.45l-9.74-143.75a280.22 280.22 0 0 0 8.42 -3.82' fill='%23ed1c24'/%3e %3c/svg%3e %3c/g%3e %3c/svg%3e" />
                      <h6 className="text-white fw-medium">Tadej  Pogačar</h6>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 justify-content-end">
                    <span className="fw-medium text-white d-none d-md-block">All stats</span>
                    <Link
                    href={'#'}
                      className="white-circle-btn position-static"
                    >
                      <img src="/images/arow.svg" alt="" />
                    </Link>
                  </div>
              </div>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 mb-4">
        <div className="team-cart lime-green-team-cart img-active featured-card bg-green d-flex flex-row">
                <Link href={'#'} className="pabs" />
                <div className="text-wraper flex-grow-1 d-flex flex-column">
                  <h4 className="text-white">Europees Kampioensch</h4>
                  <div className="rider-img-wrapper flex-grow-1 d-flex flex-column justify-content-end justify-content-md-between">
                    <img src="/images/rider-img.png" alt="" className="rider-img-element d-lg-block d-none" />
                    <div
                      className="name-wraper name-wraper-green name-left" 
                    >
                      <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 12 6'%3e %3ctitle%3eFlag of Slovenia%3c/title%3e %3crect width='12' fill='%23ed1c24' height='6'/%3e %3crect width='12' fill='%23005da4' height='4'/%3e %3crect width='12' fill='%23fff' height='2'/%3e %3cg transform='translate(2.2238 1) scale(.12937)'%3e %3csvg width='12' viewBox='-120 -190.223125 240 309.188274' height='15.459'%3e %3cpath d='m110.26-19.478l9.74-143.75a280.22 280.22 0 0 0 -240 0l9.74 143.75a155.61 155.61 0 0 0 110.26 138.45 155.61 155.61 0 0 0 110.26 -138.45' fill='%23005da4'/%3e %3cpath d='m-90 0a138.29 138.29 0 0 0 90 100.77 138.29 138.29 0 0 0 90 -100.77l-45-60-18 24-27-54-27 54-18-24-45 60' fill='%23fff'/%3e %3cg id='wave' fill='%23005da4' transform='scale(5) translate(0 5.1962)'%3e %3cpath d='m-17.196-2.1962a6 6 0 0 0 8.1962 2.1962 6 6 0 0 1 6 0 6 6 0 0 0 6 0 6 6 0 0 1 6 0 6 6 0 0 0 8.1962 -2.1962v1.732a6 6 0 0 1 -8.1962 2.1962 6 6 0 0 0 -6 0 6 6 0 0 1 -6 0 6 6 0 0 0 -6 0 6 6 0 0 1 -8.1962 -2.1962z'/%3e %3c/g%3e %3cuse xlink:href='%23wave' transform='translate(0 17.321)'/%3e %3cg id='s' transform='translate(0,-120) scale(2.25)'%3e %3cpath stroke-width='.2' d='m0-5l1 3.2679 3.3301-0.7679-2.3301 2.5 2.3301 2.5-3.3301-0.7679-1 3.2679-1-3.2679-3.3301 0.7679 2.3301-2.5-2.3301-2.5 3.3301 0.7679z' fill='%23fd0'/%3e %3c/g%3e %3cuse xlink:href='%23s' transform='translate(-33.75,-45)'/%3e %3cuse xlink:href='%23s' transform='translate(33.75,-45)'/%3e %3cpath d='m-111.58-167.05l9.96 146.99a146.95 146.95 0 0 0 101.62 129.95 146.95 146.95 0 0 0 101.62 -129.95l9.96-146.99a280.22 280.22 0 0 0 8.42 3.82l-9.74 143.75a155.61 155.61 0 0 1 -110.26 138.45 155.61 155.61 0 0 1 -110.26 -138.45l-9.74-143.75a280.22 280.22 0 0 0 8.42 -3.82' fill='%23ed1c24'/%3e %3c/svg%3e %3c/g%3e %3c/svg%3e" />
                      <h6 className="text-white fw-medium">Tadej  Pogačar</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2 justify-content-end">
                      <span className="fw-medium text-white d-none d-md-block">All stats</span>
                      <Link
                      href={'#'}
                        className="white-circle-btn position-static"
                      >
                        <img src="/images/arow.svg" alt="" />
                      </Link>
                    </div>
                  </div>
              </div>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 mb-4">
        <div className="team-cart lime-green-team-cart img-active featured-card featured-card-banner-img bg-yellow">
                <Link href={'#'} className="pabs" />
                <div className="banner--img">
                  <img src="/images/head-to-head-banner.png" alt="" />
                    <Link
                    href={'#'}
                      className="white-circle-btn"
                    >
                      <img src="/images/arow.svg" alt="" />
                    </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default TopSection