import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content-wraper">
          <div className="content-wrap">
            <h5>Grand Tours</h5>
            <ul>
              <li><Link href="#">Tour de France</Link></li>
              <li><Link href="#">Giro d’Italia</Link></li>
              <li><Link href="#">Vuelta a España</Link></li>
            </ul>
          </div>
          <div className="content-wrap">
            <h5>Monuments</h5>
            <ul>
              <li><Link href="#">Milano-SanRemo</Link></li>
              <li><Link href="#">Ronde van Vlaanderen</Link></li>
              <li><Link href="#">Paris-Roubaix</Link></li>
              <li><Link href="#">Liege-Bastogne-Liege</Link></li>
              <li><Link href="#">Il Lombardia</Link></li>
            </ul>
          </div>
          <div className="content-wrap">
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
          <div className="content-wrap">
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
          <div className="content-wrap">
            <h5>About Wielerstats</h5>
            <ul>
              <li><Link href="/contact">Contact us</Link></li>
              <li><Link href="/cookie-policy">Cookie policy</Link></li>
            </ul>
            <Link href="/" className="logo">
              <img src="/images/footer-logo.png" alt="Footer Logo" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
