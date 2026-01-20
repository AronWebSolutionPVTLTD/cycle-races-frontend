import { Roboto } from "next/font/google";
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

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
function MyApp({ Component, pageProps }) {
  return (
    <>
      <main className={`${roboto.variable} antialiased`}>
        <Header />
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;