import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PressMarquee } from '../components/widgets.jsx';
import Hero from '../components/sections/Hero.jsx';
import Stats from '../components/sections/Stats.jsx';
import HowItWorks from '../components/sections/HowItWorks.jsx';
import AvailableTests from '../components/sections/AvailableTests.jsx';
import BoostAbilities from '../components/sections/BoostAbilities.jsx';
import WhatYouGet from '../components/sections/WhatYouGet.jsx';
import ReviewsSection from '../components/sections/ReviewsSection.jsx';
import FAQSection from '../components/sections/FAQSection.jsx';
import Community from '../components/sections/Community.jsx';

export default function HomePage() {
  const [showCta, setShowCta] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > 520);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Hero />
      <PressMarquee />
      <Stats />
      <HowItWorks />
      <AvailableTests />
      <BoostAbilities />
      <WhatYouGet />
      <ReviewsSection />
      <FAQSection />
      <Community />

      <div className={'sticky-cta' + (showCta ? ' show' : '')}>
        <div className="row">
          <button className="btn btn-signal" style={{ flex: 1 }} onClick={() => navigate('/quiz/start')}>
            Begin my IQ test <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
}
