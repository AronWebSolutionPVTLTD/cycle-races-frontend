import { Roboto, Archivo } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

import '../styles/owl.carousel.min.css'
import '../styles/owl.theme.default.css'
import Script from 'next/script';
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
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
});

function MyApp({ Component, pageProps }) {
  return (
    <>
    <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4Z8XV3MDD5"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4Z8XV3MDD5');
          `}
        </Script>
      </head>
      <main className={`${roboto.variable} ${archivo.variable} antialiased`}>
        <Header isDetailPage={!!pageProps.isDetailPage}/>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;