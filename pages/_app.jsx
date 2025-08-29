import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

import '../styles/owl.carousel.min.css'
import '../styles/owl.theme.default.css'

import '../styles/slimNav_sk78.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
 
 import '../styles/style.scss'
 import '../styles/responsive.css'
 import '../styles/custom.css'
function MyApp({ Component, pageProps }) {
  return (
    <>
      
      <main>
      <div className="dropdown-overlay"></div>
        <Header />
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;