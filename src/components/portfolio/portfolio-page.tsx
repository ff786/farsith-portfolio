'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import { site } from '../../data/site';
import { journeyStages } from './journey-stages';
import { Nav } from './nav';
import { AvatarStage } from './avatar-stage';
import { JourneyProgress } from './journey-progress';
import { AboutChapter, ContactChapter, ExperienceChapter, HeroChapter, ProjectsChapter, ToolkitChapter } from './chapters';

const DESKTOP_BREAKPOINT = 980;
const WHEEL_THRESHOLD = 46;
const WHEEL_SETTLE_MS = 110;
const STAGE_TRANSITION_MS = 780;

export function PortfolioPage() {
  const journeyRef = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const wheelRef = useRef({ delta: 0, timer: 0 as number | ReturnType<typeof setTimeout>, locked: false });
  const targetStageRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState('01');
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ['start start', 'end end'] });

  // One master progress value drives the whole experience. The spring keeps the
  // camera and chapter choreography fluid while the interaction layer below
  // decides where each desktop gesture is allowed to stop.
  const journeyProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.45,
    restDelta: 0.001,
  });

  const scrollToStage = useCallback((stageIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const journey = journeyRef.current;
    if (!journey) return;

    const stage = Math.max(0, Math.min(journeyStages.length - 1, stageIndex));
    const journeyTop = journey.getBoundingClientRect().top + window.scrollY;
    const chapterHeight = window.innerHeight;
    const top = journeyTop + stage * chapterHeight;

    targetStageRef.current = stage;
    window.scrollTo({ top, behavior });
    window.history.replaceState(null, '', '#' + journeyStages[stage].id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(journeyProgress, 'change', (value) => {
    setActiveStage(Math.min(journeyStages.length - 1, Math.round(value * (journeyStages.length - 1))));
  });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (cursor.current) {
        cursor.current.style.transform = 'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0)';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const onInternalNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href')?.slice(1);
      const stage = journeyStages.findIndex((item) => item.id === id);
      if (stage < 0 || window.innerWidth <= DESKTOP_BREAKPOINT) return;

      event.preventDefault();
      scrollToStage(stage);
    };

    document.addEventListener('click', onInternalNavigation);
    return () => document.removeEventListener('click', onInternalNavigation);
  }, [scrollToStage]);

  useEffect(() => {
    if (window.innerWidth <= DESKTOP_BREAKPOINT) return;

    const onWheel = (event: WheelEvent) => {
      const journey = journeyRef.current;
      if (!journey) return;

      const rect = journey.getBoundingClientRect();
      const insideJourney = rect.top <= window.innerHeight && rect.bottom >= 0;
      if (!insideJourney || Math.abs(event.deltaY) < 1) return;

      event.preventDefault();

      const state = wheelRef.current;
      if (state.locked) return;

      state.delta += event.deltaY;
      window.clearTimeout(state.timer);

      state.timer = window.setTimeout(() => {
        const direction = state.delta > WHEEL_THRESHOLD ? 1 : state.delta < -WHEEL_THRESHOLD ? -1 : 0;
        state.delta = 0;
        if (!direction) return;

        const current = targetStageRef.current;
        const next = Math.max(0, Math.min(journeyStages.length - 1, current + direction));
        if (next === current) return;

        state.locked = true;
        scrollToStage(next);

        window.setTimeout(() => {
          state.locked = false;
        }, STAGE_TRANSITION_MS);
      }, WHEEL_SETTLE_MS);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheelRef.current.timer);
    };
  }, [scrollToStage]);

  useEffect(() => {
    const syncTargetStage = () => {
      if (window.innerWidth <= DESKTOP_BREAKPOINT) return;

      const journey = journeyRef.current;
      if (!journey || wheelRef.current.locked) return;

      const journeyTop = journey.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(0, window.scrollY - journeyTop);
      targetStageRef.current = Math.max(
        0,
        Math.min(journeyStages.length - 1, Math.round(distance / window.innerHeight)),
      );
    };

    window.addEventListener('scroll', syncTargetStage, { passive: true });
    window.addEventListener('resize', syncTargetStage);
    syncTargetStage();

    return () => {
      window.removeEventListener('scroll', syncTargetStage);
      window.removeEventListener('resize', syncTargetStage);
    };
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
        <ProjectsChapter progress={journeyProgress} selectedProjectId={selectedProjectId} onSelectProject={(project) => setSelectedProjectId(project.id)} />
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
