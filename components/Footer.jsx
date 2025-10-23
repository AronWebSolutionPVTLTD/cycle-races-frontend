import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <>
    <footer>
      <div className="footer-content-wraper">
        <div className="row">
          <div className='col-md-5 d-sm-flex justify-content-between d-md-grid'>
            <div className="content-wrap content-wrap-intro">
                <h5>Wielerstats</h5>
                <p>Op Wielerstats vind je alle statistieken op het gebied van profwielrennen. Niet alleen van alle renners maar ook van de wedstrijden en de ploegen. Van vroeger tot nu. Van kleine wedstrijden tot grote wedstrijden en van de minder bekende tot de aller bekendste renners.</p>
            </div>
            <div className='d-none d-sm-grid align-content-start align-content-md-end'>
                <p className='disclaimer-text'>
                    Wielerstats is een onafhankelijk platform en niet gelieerd aan officiële wielerorganisaties, teams of wedstrijden. Afbeeldingen, merknamen en logo’s behoren toe aan hun respectieve eigenaars en worden uitsluitend gebruikt ter identificatie.
                </p>
                <Link href="/" className="logo">
                <img src="/images/footer-logo.png" alt="Footer Logo" />
                </Link>
            </div>
          </div>
          <div className='col-md-7'>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='row'>
                        <div className='col-md-12 col-6'>
                            <div className="content-wrap">
                                <h5>Grand Tours</h5>
                                <ul>
                                <li><Link href="#">Tour de France</Link></li>
                                <li><Link href="#">Giro d’Italia</Link></li>
                                <li><Link href="#">Vuelta a España</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 col-6'>
                            <div className="content-wrap mb-md-0">
                                <h5>Monuments</h5>
                                <ul>
                                <li><Link href="#">Milano-SanRemo</Link></li>
                                <li><Link href="#">Ronde van Vlaanderen</Link></li>
                                <li><Link href="#">Paris-Roubaix</Link></li>
                                <li><Link href="#">Liege-Bastogne-Liege</Link></li>
                                <li><Link href="#">Il Lombardia</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-8 col-12'>
                    <div className='row'>
                        <div className='col-6'>
                            <div className="content-wrap mb-md-0">
                                <h5>Classics</h5>
                                <ul>
                                <li><Link href="#">Omloop Het Nieuwsblad</Link></li>
                                <li><Link href="#">Strade Bianche</Link></li>
                                <li><Link href="#">E3 Classic</Link></li>
                                <li><Link href="#">Gent-Wevelgem</Link></li>
                                <li><Link href="#">Dwars door Vlaanderen</Link></li>
                                <li><Link href="#">Eschborn-Frankfurt</Link></li>
                                <li><Link href="#">Amstel Gold Race</Link></li>
                                <li><Link href="#">La Fleche Wallonne</Link></li>
                                <li><Link href="#">San Sebastian</Link></li>
                                <li><Link href="#">Bretagne Classic</Link></li>
                                <li><Link href="#">GP Quebec</Link></li>
                                <li><Link href="#">GP Montreal</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="content-wrap mb-md-0">
                                <h5>Popular riders</h5>
                                <ul>
                                <li><Link href="#">Tadej Pogacar</Link></li>
                                <li><Link href="#">Mathieu van der Poel</Link></li>
                                <li><Link href="#">Remco Evenepoel</Link></li>
                                <li><Link href="#">Wout van Aert</Link></li>
                                <li><Link href="#">Mads Pedersen</Link></li>
                                <li><Link href="#">Primoz Roglic</Link></li>
                                <li><Link href="#">Marc Hirschi</Link></li>
                                <li><Link href="#">Julian Alaphilippe</Link></li>
                                <li><Link href="#">Jonathan Milan</Link></li>
                                <li><Link href="#">Lance Armstrong</Link></li>
                                <li><Link href="#">Tim Merlier</Link></li>
                                <li><Link href="#">Jasper Philipsen</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div className='col-12 d-block d-sm-none'>
            <p className='disclaimer-text'>
                    Wielerstats is een onafhankelijk platform en niet gelieerd aan officiële wielerorganisaties, teams of wedstrijden. Afbeeldingen, merknamen en logo’s behoren toe aan hun respectieve eigenaars en worden uitsluitend gebruikt ter identificatie.
                </p>
            <Link href="/" className="logo">
            <img src="/images/footer-logo.png" alt="Footer Logo" />
            </Link>
        </div>
          
          
        
        </div>
      </div>
        <div className='footer_bottom py-2 py-md-0'>    
        <div className='footer-bottom-content-wraper'>
            <div className='row align-items-center' >
                <div className='col-md-4 my-2 my-md-4 text-center text-md-start'>
                    <p className='m-0 fw-medium'>© Wielerstats</p>
                </div>
                <div className='col-md-4 text-center my-2 my-md-4'>
                    <ul className='footer-bottom-links d-flex align-items-center justify-content-center gap-3 text-primary'>
                        <li><Link href="/contact">Contact us</Link></li>
                        <li><Link href="/cookie-policy">Cookie policy</Link></li>
                    </ul>
                </div>
                <div className='col-md-4 text-center text-md-end my-2 my-md-4'>
                    <div className='social-media-links'>
                        <Link href={'#'}><img src="/images/insta.svg" alt="Instagram" /></Link>
                        <Link href={'#'}><img src="/images/fb.svg" alt="Facebook" /></Link>
                        <Link href={'#'}><img src="/images/twitter.svg" alt="Twitter" /></Link>
                        <Link href={'#'}><img src="/images/social-media.svg" alt="Social media" /></Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </footer>
  
    </>
  );
};

export default Footer;
