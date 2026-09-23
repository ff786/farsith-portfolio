'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { site } from '../../data/site';
import { journeyStages } from './journey-stages';
import { Nav } from './nav';
import { AvatarStage } from './avatar-stage';
import { JourneyProgress } from './journey-progress';
import { AboutChapter, ContactChapter, ExperienceChapter, HeroChapter, ProjectsChapter, ToolkitChapter } from './chapters';

export function PortfolioPage() {
  const journeyRef = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ['start start', 'end end'] });

  // One master progress value drives the whole experience. The spring removes
  // scroll-wheel jitter without disconnecting the choreography from the page.
  const journeyProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.45,
    restDelta: 0.001,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(journeyProgress, 'change', (value) => {
    setActiveStage(Math.min(journeyStages.length - 1, Math.floor(value * journeyStages.length)));
  });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <>
    {loading && (
      <motion.div
        className="loader"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
      >
        <div className="loader-mark">FF</div>
        <div>FARSITH FAWZER</div>
        <small>SOFTWARE DEVELOPER</small>
      </motion.div>
    )}

    <div ref={cursor} className="cursor" />
    <Nav />

    <main ref={journeyRef} className="portfolio-journey">
      <div className="journey-sticky">
        <AvatarStage progress={journeyProgress} activeStage={activeStage} />
        <JourneyProgress activeStage={activeStage} />
      </div>

      <div className="journey-content">
        <HeroChapter progress={journeyProgress} />
        <AboutChapter progress={journeyProgress} />
        <ProjectsChapter progress={journeyProgress} />
        <ToolkitChapter progress={journeyProgress} />
        <ExperienceChapter progress={journeyProgress} />
        <ContactChapter progress={journeyProgress} />
      </div>
    </main>

    <footer>
      <div><b>{site.name.toUpperCase()}</b><span>{site.title}</span></div>
      <p>Build · Solve · Improve · Create Impact</p>
      <small>© 2026 {site.name}</small>
    </footer>
  </>;
}
