import React from 'react';
import { Headphones } from 'lucide-react';
import { WA_NUMBER } from './components/ui/common.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import TrustStrip from './components/sections/TrustStrip.jsx';
import Services from './components/sections/Services.jsx';
import Packages from './components/sections/Packages.jsx';
import DestinationMosaic from './components/sections/DestinationMosaic.jsx';
import About from './components/sections/About.jsx';
import Benefits from './components/sections/Benefits.jsx';
import PackageGuide from './components/sections/PackageGuide.jsx';
import InformationTiles from './components/sections/InformationTiles.jsx';
import VisualItinerary from './components/sections/VisualItinerary.jsx';
import Facilities from './components/sections/Facilities.jsx';
import Preparation from './components/sections/Preparation.jsx';
import Testimonials from './components/sections/Testimonials.jsx';
import Articles from './components/sections/Articles.jsx';
import FAQ from './components/sections/FAQ.jsx';
import ContactBanner from './components/sections/ContactBanner.jsx';
import Promo from './components/sections/Promo.jsx';

export default function App() {
  return <><Navbar/><main><Hero/><TrustStrip/><Services/><Packages/><DestinationMosaic/><About/><Benefits/><PackageGuide/><InformationTiles/><VisualItinerary/><Facilities/><Preparation/><Testimonials/><Articles/><FAQ/><ContactBanner/><Promo/></main><Footer/><a className="floating-wa" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp"><Headphones size={21}/><span>Butuh bantuan?</span></a></>;
}
