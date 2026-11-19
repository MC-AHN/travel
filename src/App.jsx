import React, { useEffect, useRef, useState } from 'react';
import { Headset, Volume2, VolumeX } from 'lucide-react';
import { getGalleryHref, isGalleryPage, WA_NUMBER } from './components/ui/common.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import GalleryPage from './components/pages/GalleryPage.jsx';
import Hero from './components/sections/Hero.jsx';
import TrustStrip from './components/sections/TrustStrip.jsx';
import Services from './components/sections/Services.jsx';
import Packages from './components/sections/Packages.jsx';
import DestinationMosaic from './components/sections/DestinationMosaic.jsx';
import About from './components/sections/About.jsx';
import GuideGallery from './components/sections/GuideGallery.jsx';
import Benefits from './components/sections/Benefits.jsx';
import PackageGuide from './components/sections/PackageGuide.jsx';
import VisualItinerary from './components/sections/VisualItinerary.jsx';
import Facilities from './components/sections/Facilities.jsx';
import Preparation from './components/sections/Preparation.jsx';
import Testimonials from './components/sections/Testimonials.jsx';
import Articles from './components/sections/Articles.jsx';
import FAQ from './components/sections/FAQ.jsx';
import ContactBanner from './components/sections/ContactBanner.jsx';

function shouldShowWelcomePoster() {
  try {
    return window.sessionStorage.getItem('safar-welcome-poster-dismissed') !== 'true';
  } catch (error) {
    console.error('Unable to read welcome poster state:', error);
    return true;
  }
}

function rememberWelcomePosterDismissal() {
  try {
    window.sessionStorage.setItem('safar-welcome-poster-dismissed', 'true');
  } catch (error) {
    console.error('Unable to save welcome poster state:', error);
  }
}

export default function App() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const [musicAutoplayBlocked, setMusicAutoplayBlocked] = useState(false);
  const [welcomePosterOpen, setWelcomePosterOpen] = useState(shouldShowWelcomePoster);
  const audioRef = useRef(null);
  const posterCloseRef = useRef(null);

  useEffect(() => {
    if (!welcomePosterOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    posterCloseRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        rememberWelcomePosterDismissal();
        setWelcomePosterOpen(false);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        posterCloseRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [welcomePosterOpen]);

  const startBackgroundMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    setMusicMuted(false);
    if (!audio.paused) return;
    setMusicError(false);
    setMusicAutoplayBlocked(false);
    try {
      await audio.play();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setMusicAutoplayBlocked(true);
        return;
      }
      setMusicError(true);
      console.error('Unable to play background music:', error);
    }
  };

  const toggleBackgroundMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void startBackgroundMusic();
      return;
    }
    audio.muted = !audio.muted;
    setMusicMuted(audio.muted);
  };

  const closePosterAndStartMusic = () => {
    rememberWelcomePosterDismissal();
    setWelcomePosterOpen(false);
    void startBackgroundMusic();
  };

  const galleryPage = isGalleryPage();
  const pauseBackgroundMusic = () => {
    if (audioRef.current && !audioRef.current.paused) audioRef.current.pause();
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('page') === 'galeri') {
      window.history.replaceState(null, '', getGalleryHref());
    }
  }, []);

  return <>
    <Navbar />
    {galleryPage
      ? <GalleryPage onVideoPlay={pauseBackgroundMusic} />
      : <main><Hero/><TrustStrip/><Services/><Packages/><Benefits/><DestinationMosaic/><About/><GuideGallery/><PackageGuide/><VisualItinerary/><Facilities/><Preparation/><Testimonials/><Articles/><FAQ/><ContactBanner/></main>}
    <Footer />
    {welcomePosterOpen && <div className="welcome-poster-backdrop" role="presentation">
      <section className="welcome-poster-dialog" role="dialog" aria-modal="true" aria-labelledby="welcome-poster-hint">
        <button
          ref={posterCloseRef}
          className="welcome-poster-close"
          type="button"
          onClick={closePosterAndStartMusic}
          aria-label="Tutup poster dan putar musik"
        >
          <span aria-hidden="true">×</span>
        </button>
        <img
          src="/assets/packages/umrah-full-ramadhan-lampung-2027-30-hari-rp39-juta.jpeg"
          alt="Poster paket Umrah Full Ramadan"
        />
        <p id="welcome-poster-hint">Tutup poster untuk memutar musik latar.</p>
      </section>
    </div>}
    <audio
      ref={audioRef}
      loop
      preload="none"
      onPlay={() => { setMusicPlaying(true); setMusicMuted(audioRef.current?.muted ?? false); setMusicError(false); setMusicAutoplayBlocked(false); }}
      onPause={() => setMusicPlaying(false)}
      onError={() => { setMusicPlaying(false); setMusicError(true); console.error('Unable to load background music.'); }}
    >
      <source src="/assets/audio/sad-piano-emotional-rain-story-575883.mp3" type="audio/mpeg" />
    </audio>
    <button
      className="background-music-toggle"
      type="button"
      onClick={toggleBackgroundMusic}
      aria-pressed={musicPlaying && !musicMuted}
      aria-label={musicError ? 'Coba putar musik lagi' : musicPlaying ? musicMuted ? 'Nyalakan suara musik' : 'Mute musik latar' : musicAutoplayBlocked ? 'Aktifkan musik latar' : 'Putar musik latar'}
    >
      {musicPlaying && !musicMuted ? <Volume2 size={19} /> : <VolumeX size={19} />}
      <span>{musicError ? 'Coba putar lagi' : musicPlaying ? musicMuted ? 'Nyalakan suara' : 'Mute musik' : musicAutoplayBlocked ? 'Aktifkan musik' : 'Putar musik'}</span>
    </button>
    <a className="floating-wa" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp"><Headset size={21}/><span>Butuh bantuan?</span></a>
  </>;
}
