import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { callAPI } from '@/lib/api';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        monuments: [],
        grandTours: [],
        classics: [],
        popularRiders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                setLoading(true);
                const response = await callAPI('GET', '/footer/footermenu');
                
                if (response && response.success && response.data) {
                    setFooterData({
                        monuments: response.data.monuments || [],
                        grandTours: response.data.grandTours || [],
                        classics: response.data.classics || [],
                        popularRiders: response.data.popularRiders || []
                    });
                }
            } catch (error) {
                console.error('Error fetching footer data:', error);
                // Keep empty arrays on error
            } finally {
                setLoading(false);
            }
        };

        fetchFooterData();
    }, []);

    return (
        <>
            <footer>
                <div className="footer-content-wraper container">
                    <div className="row">
                        <div className='col-md-5 d-sm-flex justify-content-between d-md-grid'>
                            <div className="content-wrap content-wrap-intro">
                                <h5>Wielerstats</h5>
                                <p>Op Wielerstats vind je alle statistieken op het gebied van profwielrennen. Niet alleen van alle renners maar ook van de wedstrijden en de ploegen. Van vroeger tot nu. Van kleine wedstrijden tot grote wedstrijden en van de minder bekende tot de aller bekendste renners.</p>
                            </div>
                            <div className='d-none d-sm-grid align-content-start align-content-md-end'>
                                <p className='disclaimer-text'>
                                    Wielerstats is een onafhankelijk platform en niet gelieerd aan officiële wielerorganisaties, teams of wedstrijden. Afbeeldingen, merknamen en logo's behoren toe aan hun respectieve eigenaars en worden uitsluitend gebruikt ter identificatie.
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
                                                    {loading ? (
                                                        <li>Loading...</li>
                                                    ) : footerData.grandTours.length > 0 ? (
                                                        footerData.grandTours.map((item, index) => (
                                                            <li key={index}>
                                                                <Link href={`/races/${encodeURIComponent(item.race_name)}`}>
                                                                    {item.race_name}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : null}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-md-12 col-6'>
                                            <div className="content-wrap mb-md-0">
                                                <h5>Monuments</h5>
                                                <ul>
                                                    {loading ? (
                                                        <li>Loading...</li>
                                                    ) : footerData.monuments.length > 0 ? (
                                                        footerData.monuments.map((item, index) => (
                                                            <li key={index}>
                                                                <Link href={`/races/${encodeURIComponent(item.race_name)}`}>
                                                                    {item.race_name}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : null}
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
                                                    {loading ? (
                                                        <li>Loading...</li>
                                                    ) : footerData.classics.length > 0 ? (
                                                        footerData.classics.map((item, index) => (
                                                            <li key={index}>
                                                                <Link href={`/races/${encodeURIComponent(item.race_name)}`}>
                                                                    {item.race_name}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : null}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-6'>
                                            <div className="content-wrap mb-md-0">
                                                <h5>Popular riders</h5>
                                                <ul>
                                                    {loading ? (
                                                        <li>Loading...</li>
                                                    ) : footerData.popularRiders.length > 0 ? (
                                                        footerData.popularRiders.map((item, index) => (
                                                            <li key={index}>
                                                                {item.rider_id ? (
                                                                    <Link href={`/riders/${item.rider_id}`}>
                                                                        {item.rider_name}
                                                                    </Link>
                                                                ) : (
                                                                    <span>{item.rider_name}</span>
                                                                )}
                                                            </li>
                                                        ))
                                                    ) : null}
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
                    <div className='footer-bottom-content-wraper container'>
                        <div className='row align-items-center' >
                            <div className='col-md-4 my-2 my-md-4 text-center text-md-start'>
                                <p className='m-0 fw-medium'>© Wielerstats</p>
                            </div>
                            <div className='col-md-4 text-center my-2 my-md-4'>
                                <ul className='footer-bottom-links d-flex align-items-center justify-content-center gap-3 text-primary'>
                                    <li><Link href="/contact">Contact us</Link></li>
                                    <li><Link href="/disclaimer">Disclaimer</Link></li>
                                    {/* <li><Link href="/cookie-policy">Cookie policy</Link></li> */}
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
