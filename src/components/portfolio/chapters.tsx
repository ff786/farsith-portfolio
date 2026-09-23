import { AnimatePresence, motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { site, stack, projects } from '../../data/site';
import { InfiniteTechSpiral } from './infinite-tech-spiral';

type ChapterProps = { progress: MotionValue<number> };
type Project = (typeof projects)[number];

function ChapterReveal({ progress, center, children }: { progress: MotionValue<number>; center: number; children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const revealStart = Math.max(0, center - 0.095);
  const isHero = center <= 0.055;
  const opacity = useTransform(progress, isHero ? [0, center + 0.07] : [revealStart, center - 0.035, center + 0.07], isHero ? [1, 0.86] : [0, 1, 0.86]);
  const y = useTransform(progress, isHero ? [0, center + 0.07] : [revealStart, center - 0.035, center + 0.07], isHero ? [0, -12] : [34, 0, -12]);
  const blur = useTransform(progress, isHero ? [0, center + 0.07] : [revealStart, center - 0.035, center + 0.07], isHero ? ['0px', '1px'] : ['7px', '0px', '1px']);
  return <motion.div className="chapter-reveal" style={reducedMotion ? undefined : { opacity, y, filter: blur }}>{children}</motion.div>;
}

export function HeroChapter({ progress }: ChapterProps) {
  return <section id="home" className="journey-chapter hero-chapter">
    <ChapterReveal progress={progress} center={0.055}>
      <div className="chapter-copy">
        <div className="eyebrow">COLOMBO · SRI LANKA / SOFTWARE DEVELOPER</div>
        <h1>FARSITH<br /><em>FAWZER</em></h1>
        <p>Building ideas into <strong>real-world software.</strong></p>
        <div className="hero-actions"><a className="btn primary" href="#projects">Explore My Work <span>↘</span></a><a className="btn ghost" href={`mailto:${site.email}`}>Let’s Connect <span>↗</span></a></div>
        <div className="hero-meta"><span>FULL-STACK</span><span>WEB APPLICATIONS</span><span>SOFTWARE ENGINEERING</span></div>
      </div>
    </ChapterReveal>
    <div className="chapter-note"><span>01 / ENTER THE WORLD</span><p>The portfolio moves with the avatar. Scroll to change the camera, environment and point of view.</p></div>
  </section>;
}

export function AboutChapter({ progress }: ChapterProps) {
  return <section id="about" className="journey-chapter about-chapter">
    <ChapterReveal progress={progress} center={0.225}>
      <div className="about-layout">
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
      </div>
    </ChapterReveal>
  </section>;
}

function ProjectDeck({ selectedId, onSelect }: { selectedId: string; onSelect: (project: Project) => void }) {
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const reducedMotion = useReducedMotion();

  return <div className="project-system">
    <div className="project-index" role="tablist" aria-label="Select a project">
      {projects.map((project, index) => (
        <button key={project.id} type="button" role="tab" aria-selected={project.id === selected.id} className={project.id === selected.id ? 'active' : ''} onClick={() => onSelect(project)}>
          <span>{project.id}</span><b>{project.title}</b><i />
        </button>
      ))}
    </div>
    <div className={`project-feature project-feature-${selected.tone}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.article key={selected.id} className="project-feature-card" initial={reducedMotion ? false : { opacity: 0, x: 24, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reducedMotion ? undefined : { opacity: 0, x: -18, scale: 0.985 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
          <div className="project-feature-top"><span>{selected.id} / SELECTED BUILD</span><span>{selected.tone.toUpperCase()}</span></div>
          <h3>{selected.title}</h3>
          <h4>{selected.subtitle}</h4>
          <p>{selected.description}</p>
          <div className="project-contribution"><span>CONTRIBUTION</span>{selected.contribution}</div>
          <small>{selected.tech}</small>
          <a href="#contact">Discuss this build <span>↗</span></a>
        </motion.article>
      </AnimatePresence>
      <div className="project-signal" aria-hidden><span /><span /><span /></div>
    </div>
  </div>;
}

export function ProjectsChapter({ progress, selectedProjectId, onSelectProject }: ChapterProps & { selectedProjectId: string; onSelectProject: (project: Project) => void }) {
  return <section id="projects" className="journey-chapter projects-chapter">
    <ChapterReveal progress={progress} center={0.395}>
      <div className="chapter-copy"><div className="section-kicker">03 / SELECTED WORK</div><h2>WHAT I <em>BUILD.</em></h2><p>Select a build. The workstation reacts with the same project state.</p></div>
      <ProjectDeck selectedId={selectedProjectId} onSelect={onSelectProject} />
    </ChapterReveal>
  </section>;
}

export function ToolkitChapter({ progress }: ChapterProps) {
  return <section id="toolkit" className="journey-chapter toolkit-chapter">
    <ChapterReveal progress={progress} center={0.565}>
      <div className="toolkit-layout">
        <div className="chapter-copy">
          <div className="section-kicker">04 / MY TOOLKIT</div>
          <h2>THE TOOLS<br /><span>BEHIND THE WORK.</span></h2>
          <p>A practical stack spanning interface design, application logic, data, infrastructure and applied machine learning.</p>
        </div>
        <InfiniteTechSpiral items={stack} progress={progress} />
      </div>
    </ChapterReveal>
  </section>;
}

export function ExperienceChapter({ progress }: ChapterProps) {
  return <section id="experience" className="journey-chapter experience-chapter"><ChapterReveal progress={progress} center={0.735}><div className="chapter-copy"><div className="section-kicker">05 / EXPERIENCE & JOURNEY</div><h2>FROM <em>SUPPORT</em><br />TO SOFTWARE.</h2><p>Professional experience shaped by structured troubleshooting, customer-facing problem solving, cross-functional collaboration and software engineering.</p></div><div className="experience-path"><div className="experience-node"><span>2020 — 2024</span><div><b>Dialog Axiata PLC</b><small>Customer Service Associate → Senior Customer Service Associate</small></div></div><div className="experience-node"><span>2024 — PRESENT</span><div><b>Sysco Labs Technologies</b><small>Analyst — L1 Operations Support</small></div></div><div className="experience-node"><span>NOW</span><div><b>Software Engineering</b><small>B.Sc. (Hons) IT — Software Engineering · SLIIT</small></div></div></div></ChapterReveal></section>;
}

export function ContactChapter({ progress }: ChapterProps) {
  return <section id="contact" className="journey-chapter contact-chapter"><ChapterReveal progress={progress} center={0.92}><div className="chapter-copy"><div className="section-kicker">06 / LET’S BUILD SOMETHING</div><h2>HAVE AN IDEA,<br /><em>A PRODUCT, OR A PROBLEM<br />WORTH SOLVING?</em></h2><a className="contact-mail" href={`mailto:${site.email}`}>{site.email} <span>↗</span></a><div className="contact-links"><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${site.email}`}>Email ↗</a></div></div><div className="chapter-note contact-note"><span>THE JOURNEY ENDS HERE.</span><p>The next move is yours. Let’s build something meaningful.</p></div></ChapterReveal></section>;
}
