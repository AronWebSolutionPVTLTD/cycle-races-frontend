import MostwinSection from '@/components/stats_section/MostwinSection';
import Head from 'next/head';
import Link from 'next/link';

export default function Stats() {
  return (
    <>
      <Head>
        <title>Stats - Wielerstats</title>
      </Head>

    <section className="stats-sec1 lazy">
        <div className="container">
            <div className="row">
        
                <div className="col-lg-12">
                    <ul className="breadcrumb">
                    <li><Link href="/">home</Link></li>
                        <li>stats</li>
                    </ul>
                    <h1>statistieken</h1>
                    <ul className="filter">
                        <li className="active">
                             <select name="" id="">
                                <option value="">2025</option>
                             </select>
                        </li>
        <li>
                            <select name="" id="">
                                <option value="">Nationaliteit</option>
                             </select>
                        </li>
                        <li>
                            <select name="" id="">
                                <option value="">Team</option>
                             </select>
                        </li>
                    </ul>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>Oudste top-10 renner in grote ronde</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg"  alt="" />
                                <h6>Domenico Pozzovivo</h6>
                            </div>
                        </div>
                        <h5><strong>39</strong>jaar</h5>
                        <img src="/images/player1.png" alt=""   className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg"  alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="races">
                        <h5>sinds <strong>1913</strong></h5>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>oudste team</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg"  alt="" />
                                <h6>Team Movistar</h6>
                            </div>
                        </div>
                        <h5><strong>31</strong>jaar</h5>
                        <img src="/images/player2.png" alt="" className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg"  alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart lime-green-team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>meest gekozen klim in de tour de france</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg"  alt="" />
                                <h6>Alpe d’Huez</h6>
                            </div>
                        </div>
                        <h5><strong>18</strong></h5>
                        <img src="/images/player3.png" alt=""  className="absolute-img" /> 
                        <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="row">
                        <div className="col-lg-5 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Snelste sprint</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Wout van Aert</h6>
                                    </div>
                                </div>
                                <h5><strong>78</strong>km/ph</h5>
                                <img src="/images/player6.png" alt="" className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="team-cart lime-green-team-cart img-active">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">meest aantal deelnames</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Primoz Roglic</h6>
                                    </div>
                                </div>
                                <h5><strong>12</strong></h5>
                                <img src="/images/player3.png" alt="" className="absolute-img" />
                                <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Meest opeenvolgende overwinningen</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Primoz Roglic</h6>
                                    </div>
                                </div>
                                <h5><strong>4</strong></h5>
                                <img src="/images/player3.png" alt="" className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div className="races">
                                <h5>editie <strong>54</strong></h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="list-white-cart">
                        <h4 className="fs-chenge">oudste team</h4>
                        <ul>
                            <li>
                                <strong>1.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Team Movistar</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>2.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Lotto Soedal</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>3.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Jumbo-Visma</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>4.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Intermarché</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>5.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Quickstep</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                        </ul>
                        <img src="/images/player4.png" alt=""  className="absolute-img" />
                        <h5><strong>31</strong>jaar</h5>
                        <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

   <MostwinSection/>

    <section className="stats-sec1 lazy pt-0">
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4 className="font-size-change">Snelste sprint</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Wout van Aert</h6>
                            </div>
                        </div>
                        <h5><strong>78</strong>km/ph</h5>
                        <img src="/images/player6.png" alt=""  className="absolute-img" />
                        <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>Oudste top-10 renner in grote ronde</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Domenico Pozzovivo</h6>
                            </div>
                        </div>
                        <h5><strong>39</strong>jaar</h5>
                        <img src="/images/player1.png" alt=""  className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>oudste team</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Team Movistar</h6>
                            </div>
                        </div>
                        <h5><strong>31</strong>jaar</h5>
                        <img src="/images/player2.png" alt="" className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart className-for-mobile">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>meest gekozen klim in de tour de france</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Alpe d’Huez</h6>
                            </div>
                        </div>
                        <h5><strong>18</strong></h5>
                        <img src="/images/player3.png" alt=""  className="absolute-img" /> 
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="list-white-cart">
                        <h4 className="fs-chenge">oudste team</h4>
                        <ul>
                            <li>
                                <strong>1.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Team Movistar</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>2.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Lotto Soedal</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>3.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Jumbo-Visma</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>4.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Intermarché</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>5.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Quickstep</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                        </ul>
                        <img src="/images/player4.png" alt=""  className="absolute-img" />
                        <h5><strong>31</strong>jaar</h5>
                        <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="row">
                        <div className="col-lg-7 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">meest aantal deelnames</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Primoz Roglic</h6>
                                    </div>
                                </div>
                                <h5><strong>12</strong></h5>
                                <img src="/images/player3.png" alt="" className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Snelste sprint</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Wout van Aert</h6>
                                    </div>
                                </div>
                                <h5><strong>78</strong>km/ph</h5>
                                <img src="/images/player6.png" alt="" className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Snelste sprint</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Wout van Aert</h6>
                                    </div>
                                </div>
                                <h5><strong>78</strong>km/ph</h5>
                                <img src="/images/player6.png" alt=""  className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="team-cart lime-green-team-cart img-active">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Meest opeenvolgende overwinningen</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Primoz Roglic</h6>
                                    </div>
                                </div>
                                <h5><strong>4</strong></h5>
                                <img src="/images/player3.png" alt=""  className="absolute-img" />
                                <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="home-sec3 lazy desktop-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-9 mx-auto">
                    <div className="add-wraper">
                        <a href="#?"><img src="/images/add3.png" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="winning-box">
                        <div className="text-wraper">
                            <h3>meeste overwinningen</h3>
                            <h4>Gilberto Simoni</h4>
                        </div>
                        <span>3</span>
                        <img src="/images/player5.png" alt=""  className="player-img" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="stats-sec1 lazy pt-0">
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart lime-green-team-cart img-active">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4 className="font-size-change">Snelste sprint</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Wout van Aert</h6>
                            </div>
                        </div>
                        <h5><strong>78</strong>km/ph</h5>
                        <img src="/images/player6.png" alt=""  className="absolute-img" />
                        <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>Oudste top-10 renner in grote ronde</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Domenico Pozzovivo</h6>
                            </div>
                        </div>
                        <h5><strong>39</strong>jaar</h5>
                        <img src="/images/player1.png" alt=""  className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>oudste team</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Team Movistar</h6>
                            </div>
                        </div>
                        <h5><strong>31</strong>jaar</h5>
                        <img src="/images/player2.png" alt=""  className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="team-cart className-for-mobile">
                        <a href="#?" className="pabs"></a>
                        <div className="text-wraper">
                            <h4>meest gekozen klim in de tour de france</h4>
                            <div className="name-wraper">
                                <img src="/images/flag9.svg" alt="" />
                                <h6>Alpe d’Huez</h6>
                            </div>
                        </div>
                        <h5><strong>18</strong></h5>
                        <img src="/images/player3.png" alt=""  className="absolute-img" />
                        <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="list-white-cart">
                        <h4 className="fs-chenge">oudste team</h4>
                        <ul>
                            <li>
                                <strong>1.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Team Movistar</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>2.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Lotto Soedal</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>3.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Jumbo-Visma</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>4.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Intermarché</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                            <li>
                                <strong>5.</strong>
                                <div className="name-wraper">
                                    <img src="/images/flag9.svg" alt="" />
                                    <h6>Quickstep</h6>
                                </div>
                                <span>31 jaar</span>
                            </li>
                        </ul>
                        <img src="/images/player4.png" alt=""  className="absolute-img" />
                        <h5><strong>31</strong>jaar</h5>
                        <a href="#?" className="glob-btn"><strong>volledige stats</strong> <span><img src="/images/arow.svg" alt="" /></span></a>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="row">
                        <div className="col-lg-7 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">meest aantal deelnames</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Primoz Roglic</h6>
                                    </div>
                                </div>
                                <h5><strong>12</strong></h5>
                                <img src="/images/player3.png" alt="" className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Snelste sprint</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Wout van Aert</h6>
                                    </div>
                                </div>
                                <h5><strong>78</strong>km/ph</h5>
                                <img src="/images/player6.png" alt=""  className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div className="team-cart">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Snelste sprint</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Wout van Aert</h6>
                                    </div>
                                </div>
                                <h5><strong>78</strong>km/ph</h5>
                                <img src="/images/player6.png" alt=""  className="absolute-img" />
                                <a href="#?" className="green-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="team-cart lime-green-team-cart img-active">
                                <a href="#?" className="pabs"></a>
                                <div className="text-wraper">
                                    <h4 className="font-size-change">Meest opeenvolgende overwinningen</h4>
                                    <div className="name-wraper">
                                        <img src="/images/flag9.svg" alt="" />
                                        <h6>Primoz Roglic</h6>
                                    </div>
                                </div>
                                <h5><strong>4</strong></h5>
                                <img src="/images/player3.png" alt=""  className="absolute-img" />
                                <a href="#?" className="white-circle-btn"><img src="/images/arow.svg" alt="" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="home-sec3 lazy mobile-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="winning-box">
                        <div className="text-wraper">
                            <h3>meeste overwinningen</h3>
                            <h4>Gilberto Simoni</h4>
                        </div>
                        <span>3</span>
                        <img src="/images/player5.png" alt="" className="player-img" />
                    </div>
                </div>
            </div>
        </div>
    </section>
 </>
  );
}