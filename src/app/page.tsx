'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { site, stack, projects } from '../data/site';

const journeyStages = [
  { id: 'home', label: 'HERO', image: '/avatar/hero.png', alt: 'Farsith avatar in the hero workspace', angle: 'front' },
  { id: 'about', label: 'ABOUT', image: '/avatar/confident.png', alt: 'Farsith avatar in a confident pose', angle: 'three-quarter' },
  { id: 'projects', label: 'PROJECTS', image: '/avatar/laptop.png', alt: 'Farsith avatar working with a laptop', angle: 'work' },
  { id: 'toolkit', label: 'TOOLKIT', image: '/avatar/pointing.png', alt: 'Farsith avatar pointing toward the toolkit', angle: 'interaction' },
  { id: 'experience', label: 'EXPERIENCE', image: '/avatar/side.png', alt: 'Farsith avatar shown from the side', angle: 'side' },
  { id: 'contact', label: 'CONTACT', image: '/avatar/smile.png', alt: 'Farsith avatar smiling confidently', angle: 'front' },
];

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-wrap">
      <nav className="nav">
        <a href="#home" className="logo" aria-label="Farsith Fawzer home">FF</a>
        <div className="nav-links">
          {journeyStages.slice(0, -1).map((stage) => (
            <a key={stage.id} href={`#${stage.id}`}>{stage.label}</a>
          ))}
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href={`mailto:${site.email}`}>Let’s Talk</a>
        <button className="menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
          <span />
          <span />
        </button>
      </nav>
      {open && (
        <div className="mobile-menu">
          {journeyStages.map((stage) => (
            <a key={stage.id} href={`#${stage.id}`} onClick={() => setOpen(false)}>{stage.label}</a>
          ))}
        </div>
      )}
    </header>
  );
}

function WorkspaceDecor({ progress }: { progress: MotionValue<number> }) {
  const lightX = useTransform(progress, [0, 1], ['12%', '78%']);
  const lightY = useTransform(progress, [0, 1], ['22%', '64%']);
  const gridRotate = useTransform(progress, [0, 1], [64, 76]);
  const gridY = useTransform(progress, [0, 1], ['0%', '14%']);

  return (
    <div className="journey-decor" aria-hidden="true">
      <motion.div className="journey-light" style={{ left: lightX, top: lightY }} />
      <motion.div className="journey-grid" style={{ rotateX: gridRotate, y: gridY }} />
      <div className="journey-window" />
      <div className="journey-monitor monitor-one"><span>01</span><i /><i /><i /></div>
      <div className="journey-monitor monitor-two"><span>FF / SYSTEM</span><i /><i /><i /></div>
      <div className="journey-orb" />
      <div className="journey-particle particle-a" />
      <div className="journey-particle particle-b" />
      <div className="journey-particle particle-c" />
    </div>
  );
}

function AvatarFrame({ stage, index, progress }: { stage: typeof journeyStages[number]; index: number; progress: MotionValue<number> }) {
  const position = index * 0.2;
  const fadeStart = index === 0 ? 0 : position - 0.12;
  const fadePeak = position;
  const fadeEnd = index === journeyStages.length - 1 ? 1 : position + 0.12;
  const opacity = useTransform(progress, [fadeStart, fadePeak, fadeEnd], index === 0 ? [1, 1, 0] : index === journeyStages.length - 1 ? [0, 1, 1] : [0, 1, 0]);
  const scale = useTransform(progress, [fadeStart, fadePeak, fadeEnd], [0.975, 1, 0.975]);
  const blur = useTransform(progress, [fadeStart, fadePeak, fadeEnd], ['3px', '0px', '3px']);

  return (
    <motion.div className={`journey-avatar avatar-${index}`} style={{ opacity, scale, filter: blur }} aria-hidden>
      <Image src={stage.image} alt={stage.alt} fill sizes="(max-width: 900px) 80vw, 42vw" priority={index < 2} />
    </motion.div>
  );
}

function ProjectEnvironment({ progress, activeStage }: { progress: MotionValue<number>; activeStage: number }) {
  const opacity = useTransform(progress, [0.28, 0.36, 0.46, 0.54], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.28, 0.46, 0.54], [28, 0, -18]);
  const rotate = useTransform(progress, [0.28, 0.46, 0.54], [-2, 0, 2]);

  return (
    <motion.div className="project-environment" style={{ opacity, y, rotateZ: rotate }} aria-hidden={activeStage !== 2}>
      <div className="workbench-label"><span>03 / WORKBENCH</span><b>BUILD IN PROGRESS</b></div>
      <div className="workbench-window">
        <div className="workbench-top"><i /><i /><i /><span>farsith / project workspace</span></div>
        <div className="workbench-body">
          <div className="workbench-side">
            <b>PROJECTS</b>
            {projects.map((project, index) => <span key={project.id} className={index === 0 ? 'selected' : ''}>{project.id} · {project.title}</span>)}
          </div>
          <div className="workbench-main">
            <div className="workbench-heading"><span>MYNIX POS</span><b>inventory / sales</b></div>
            <div className="workbench-stats"><i /><i /><i /></div>
            <div className="workbench-chart"><i /><i /><i /><i /><i /><i /></div>
            <div className="workbench-code"><span>const workflow = build();</span><span>await system.validate();</span></div>
          </div>
        </div>
      </div>
      <div className="workbench-glow" />
    </motion.div>
  );
}

function AvatarStage({ progress, activeStage }: { progress: MotionValue<number>; activeStage: number }) {
  const avatarY = useTransform(progress, [0, 1], ['1%', '-3%']);
  const avatarScale = useTransform(progress, [0, 0.18, 0.42, 0.7, 1], [1, 1.035, 0.97, 1.055, 1]);
  const avatarRotate = useTransform(progress, [0, 0.2, 0.4, 0.62, 0.82, 1], [0, -1.5, 2.5, -3, 2, 0]);
  // Deliberate left → right → left → right staging across the six chapters.
  const cameraX = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ['-12%', '12%', '-11%', '13%', '-10%', '14%']
  );
  const cameraZ = useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 18, 28, 18, 28, 0]);

  return (
    <div className={`avatar-stage stage-${activeStage}`}>
      <WorkspaceDecor progress={progress} />
      <ProjectEnvironment progress={progress} activeStage={activeStage} />
      <motion.div className="avatar-camera" style={{ x: cameraX, y: avatarY, scale: avatarScale, rotateY: avatarRotate, z: cameraZ }}>
        <div className="avatar-halo" />
        <div className="avatar-floor" />
        <div className="avatar-image-stack">
          {journeyStages.map((stage, index) => (
            <AvatarFrame key={stage.id} stage={stage} index={index} progress={progress} />
          ))}
        </div>
      </motion.div>
      <div className="stage-surface" />
      <div className="stage-caption">
        <span>SCROLL STATE / {String(activeStage + 1).padStart(2, '0')}</span>
        <strong>{journeyStages[activeStage].label}</strong>
        <small>{journeyStages[activeStage].angle} view</small>
      </div>
    </div>
  );
}
function JourneyProgress({ activeStage }: { activeStage: number }) {
  return (
    <aside className="journey-progress" aria-label="Portfolio sections">
      <div className="progress-line" />
      {journeyStages.map((stage, index) => (
        <a
          key={stage.id}
          href={`#${stage.id}`}
          className={activeStage === index ? 'active' : ''}
          aria-current={activeStage === index ? 'step' : undefined}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <b>{stage.label}</b>
        </a>
      ))}
    </aside>
  );
}

function HeroChapter() {
  return (
    <section id="home" className="journey-chapter hero-chapter">
      <div className="chapter-copy">
        <div className="eyebrow">COLOMBO · SRI LANKA / SOFTWARE DEVELOPER</div>
        <h1>FARSITH<br /><em>FAWZER</em></h1>
        <p>Building ideas into <strong>real-world software.</strong></p>
        <div className="hero-actions">
          <a className="btn primary" href="#projects">Explore My Work <span>↘</span></a>
          <a className="btn ghost" href={`mailto:${site.email}`}>Let’s Connect <span>↗</span></a>
        </div>
        <div className="hero-meta"><span>FULL-STACK</span><span>WEB APPLICATIONS</span><span>SOFTWARE ENGINEERING</span></div>
      </div>
      <div className="chapter-note"><span>01 / ENTER THE WORLD</span><p>The portfolio moves with the avatar. Scroll to change the camera, environment and point of view.</p></div>
    </section>
  );
}

function AboutChapter() {
  return (
    <section id="about" className="journey-chapter about-chapter">
      <div className="chapter-copy">
        <div className="section-kicker">02 / MEET FARSITH</div>
        <h2>BUILDING SOFTWARE<br /><span>WITH PURPOSE.</span></h2>
        <p className="lead">Software Developer with hands-on experience building modern web applications across e-commerce, point-of-sale, digital platforms, healthcare, and accessibility-focused systems.</p>
        <p>Experienced across frontend development, backend integration, databases, authentication and machine-learning-powered applications. The focus is practical: understand the problem, build the system, and make the experience feel considered.</p>
        <div className="signature">BUILD · SOLVE · IMPROVE · REPEAT.</div>
      </div>
      <div className="chapter-card about-facts">
        <span>THE PERSON BEHIND THE SOFTWARE</span>
        <div><b>Full-Stack Development</b><small>Web applications and real-world systems</small></div>
        <div><b>Software Engineering</b><small>Problem solving, architecture and iteration</small></div>
        <div><b>SLIIT · 2022 — March 2027</b><small>B.Sc. (Hons) Information Technology — Software Engineering</small></div>
      </div>
    </section>
  );
}

function ProjectsChapter() {
  return (
    <section id="projects" className="journey-chapter projects-chapter">
      <div className="chapter-copy">
        <div className="section-kicker">03 / SELECTED WORK</div>
        <h2>WHAT I <em>BUILD.</em></h2>
        <p>As the camera moves behind the workstation, each project becomes part of the environment.</p>
      </div>
      <div className="project-rail">
        {projects.map((project) => (
          <article key={project.id} className={`journey-project journey-project-${project.tone}`}>
            <span>{project.id}</span>
            <h3>{project.title}</h3>
            <h4>{project.subtitle}</h4>
            <p>{project.description}</p>
            <small>{project.tech}</small>
            <a href="#contact">Discuss this build ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolkitChapter() {
  return (
    <section id="toolkit" className="journey-chapter toolkit-chapter">
      <div className="chapter-copy">
        <div className="section-kicker">04 / MY TOOLKIT</div>
        <h2>THE TOOLS<br /><span>BEHIND THE WORK.</span></h2>
        <p>A practical stack spanning interface design, application logic, data, infrastructure and applied machine learning.</p>
      </div>
      <div className="toolkit-orbit">
        {stack.map(([name, desc], index) => (
          <motion.div key={name} className="orbit-tech" whileHover={{ y: -6, scale: 1.03 }}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{name}</b>
            <small>{desc}</small>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ExperienceChapter() {
  return (
    <section id="experience" className="journey-chapter experience-chapter">
      <div className="chapter-copy">
        <div className="section-kicker">05 / EXPERIENCE & JOURNEY</div>
        <h2>FROM <em>SUPPORT</em><br />TO SOFTWARE.</h2>
        <p>Professional experience shaped by structured troubleshooting, customer-facing problem solving, cross-functional collaboration and software engineering.</p>
      </div>
      <div className="experience-path">
        <div className="experience-node"><span>2020 — 2024</span><div><b>Dialog Axiata PLC</b><small>Customer Service Associate → Senior Customer Service Associate</small></div></div>
        <div className="experience-node"><span>2024 — PRESENT</span><div><b>Sysco Labs Technologies</b><small>Analyst — L1 Operations Support</small></div></div>
        <div className="experience-node"><span>NOW</span><div><b>Software Engineering</b><small>B.Sc. (Hons) IT — Software Engineering · SLIIT</small></div></div>
      </div>
    </section>
  );
}

function ContactChapter() {
  return (
    <section id="contact" className="journey-chapter contact-chapter">
      <div className="chapter-copy">
        <div className="section-kicker">06 / LET’S BUILD SOMETHING</div>
        <h2>HAVE AN IDEA,<br /><em>A PRODUCT, OR A PROBLEM<br />WORTH SOLVING?</em></h2>
        <a className="contact-mail" href={`mailto:${site.email}`}>{site.email} <span>↗</span></a>
        <div className="contact-links"><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${site.email}`}>Email ↗</a></div>
      </div>
      <div className="chapter-note contact-note"><span>THE JOURNEY ENDS HERE.</span><p>The next move is yours. Let’s build something meaningful.</p></div>
    </section>
  );
}

export default function Home() {
  const journeyRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (value) => {
      const next = Math.min(journeyStages.length - 1, Math.floor(value * journeyStages.length));
      setActiveStage(next);
    });
  }, [scrollYProgress]);

  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      {loading && (
        <motion.div className="loader" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.55 }}>
          <div className="loader-mark">FF</div>
          <div>FARSITH FAWZER</div>
          <small>SOFTWARE DEVELOPER</small>
        </motion.div>
      )}
      <div ref={cursor} className="cursor" />
      <Nav />

      <main ref={journeyRef} className="portfolio-journey">
        <div className="journey-sticky">
          <AvatarStage progress={scrollYProgress} activeStage={activeStage} />
          <JourneyProgress activeStage={activeStage} />
        </div>

        <div className="journey-content">
          <HeroChapter />
          <AboutChapter />
          <ProjectsChapter />
          <ToolkitChapter />
          <ExperienceChapter />
          <ContactChapter />
        </div>
      </main>

      <footer>
        <div><b>FARSITH FAWZER</b><span>Software Developer</span></div>
        <p>Build · Solve · Improve · Create Impact</p>
        <small>© 2026 Farsith Fawzer</small>
      </footer>
    </>
  );
}
