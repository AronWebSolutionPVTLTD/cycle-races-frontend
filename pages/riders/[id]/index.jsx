
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { mockRiderData } from '@/pages/data';


export default function RiderDetail({ initialRider }) {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [rider, setRider] = useState(initialRider || null);
  const [filterType, setFilterType] = useState('All-time');

useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      const { slug } = router.query;
      console.log("Router is ready, slug:", slug);
      if (!initialRider && slug) {
      console.log("Fetching rider data for slug:", slug);
        setTimeout(() => {
          setRider(mockRiderData);
        }, 100);
      }
    }
  }, [router.isReady, router.query, initialRider]);

  if (!isRouterReady || !rider) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <p>Loading rider data...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className='rider-details-sec pb-0 rider-details-sec-top'>
      <div className='top-wrapper-main'>
          <div className='container'>
            <div className="top-wraper">
                <ul className="breadcrumb">
                  <li><Link href="/">home</Link></li>
                  <li><Link href="/riders-search">riders</Link></li>
                  <li>{rider.name.toLowerCase()}</li>
                </ul>
                <div className="wraper">
                  <Image src={rider.image} alt={rider.name} width={300} height={300} />
                  <h1>{rider.name.split(' ')[0].toLowerCase()} <br /> {rider.name.split(' ').slice(1).join(' ').toLowerCase()}</h1>
                </div>
                <ul className="plyr-dtls">
                  <li>
                    <Image src={rider.countryFlag} alt={rider.country} width={20} height={15} />
                    <span>{rider.country}</span>
                  </li>
                  <li>{rider.birthDate} ({rider.age})</li>
                  <li>{rider.birthPlace.toLowerCase()}</li>
                </ul>
              </div>
          </div>
        </div>
      </section>
      <section className="rider-details-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="filter">
                <li className={filterType === 'All-time' ? 'active' : ''}>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="All-time">All-time</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </li>
                <li><Link href="#?">Tour de France</Link></li>
                <li><Link href="#?">Giro d'Italia</Link></li>
                <li><Link href="#?">Vuelta a España</Link></li>
                <li><Link href="#?">Monumenten</Link></li>
                <li><Link href="#?">Klassiekers</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="list-white-cart">
                <h4>laatste overwinningen</h4>
                <ul>
                  {rider.latestWins.map((win, index) => (
                    <li key={index}>
                      <div className="name-wraper">
                        <Image src={win.flag} alt="Flag" width={20} height={15} />
                        <h6>{win.race}</h6>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="#?" className="green-circle-btn">
                  <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                </Link>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="team-cart lime-green-team-cart class-for-mobil">
                <Link href="#?" className="pabs"></Link>
                <div className="text-wraper">
                  <h4>aantal grote rondes gereden</h4>
                </div>
                <h5><strong>{rider.stats.grandToursRidden}</strong></h5>
                <Link href="#?" className="white-circle-btn">
                  <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                </Link>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="team-cart">
                <Link href="#?" className="pabs"></Link>
                <div className="text-wraper">
                  <h4>huidig team</h4>
                  <div className="name-wraper">
                    <Image src={rider.team.flag} alt="Flag" width={20} height={15} />
                    <h6>{rider.team.name}</h6>
                  </div>
                </div>
                <h5><strong>{rider.team.years}</strong>jaar</h5>
                <Image src="/images/player7.png" alt="Player" width={150} height={150} className="absolute-img" />
                <Link href="#?" className="green-circle-btn">
                  <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                </Link>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="races">
                <h5>wins in carriere <strong>{rider.stats.careerWins}</strong></h5>
              </div>
            </div>
            
            <div className="col-lg-7">
              <div className="row">
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart class-for-mobil class-for-mobil2">
                    <Link href="#?" className="pabs"></Link>
                    <div className="text-wraper">
                      <h4>profjaren</h4>
                      <div className="name-wraper">
                        <h6>Sinds {rider.stats.proSince}</h6>
                      </div>
                    </div>
                    <h5><strong>{rider.stats.proYears}</strong>jaar</h5>
                    <Link href="#?" className="green-circle-btn">
                      <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                    </Link>
                  </div>
                </div>
                
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart lime-green-team-cart class-for-mobil">
                    <Link href="#?" className="pabs"></Link>
                    <div className="text-wraper class-for-mobil">
                      <h4 className="font-size-change">aantal zeges in <br /> klassiekers</h4>
                    </div>
                    <h5><strong>{rider.stats.classicWins}</strong></h5>
                    <Link href="#?" className="white-circle-btn">
                      <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                    </Link>
                  </div>
                </div>
                
                <div className="col-lg-7 col-md-6">
                  <div className="team-cart class-for-mobil">
                    <Link href="#?" className="pabs"></Link>
                    <div className="text-wraper class-for-mobil">
                      <h4 className="font-size-change">aantal top-10 <br /> noteringen in 2025</h4>
                    </div>
                    <h5><strong>{rider.stats.top10Finishes2025}</strong></h5>
                    <Link href="#?" className="green-circle-btn">
                      <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                    </Link>
                  </div>
                </div>
                
                <div className="col-lg-5 col-md-6">
                  <div className="team-cart class-for-mobil">
                    <Link href="#?" className="pabs"></Link>
                    <div className="text-wraper">
                      <h4>meeste etappezeges in één grote ronde</h4>
                    </div>
                    <h5><strong>{rider.stats.mostStageWinsInGrandTour}</strong></h5>
                    <Link href="#?" className="green-circle-btn">
                      <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5">
              <div className="list-white-cart lime-green-cart">
                <h4 className="fs-chenge">laatste 10 zeges</h4>
                <ul>
                  {rider.last10Wins.map((win, index) => (
                    <li key={index}>
                      <strong>{win.position}</strong>
                      <div className="name-wraper">
                        <Image src={win.flag} alt="Flag" width={20} height={15} />
                        <h6>{win.race}</h6>
                      </div>
                      <span>{win.year}</span>
                    </li>
                  ))}
                </ul>
                <Image src={rider.image} alt={rider.name} width={150} height={150} className="absolute-img" />
                <Link href="#?" className="glob-btn">
                  <strong>volledige stats</strong> 
                  <span>
                    <Image src="/images/arow.svg" alt="Arrow" width={20} height={20} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// If you want to use SSR, you can use this function to fetch rider data on the server
export async function getServerSideProps(context) {
  const { slug } = context.params;

  return {
    props: {
      initialRider: mockRiderData
    }
  };
}