import { motion } from 'framer-motion';
import { site, stack, projects } from '../../data/site';

export function HeroChapter() {
  return <section id="home" className="journey-chapter hero-chapter"><div className="chapter-copy"><div className="eyebrow">COLOMBO · SRI LANKA / SOFTWARE DEVELOPER</div><h1>FARSITH<br /><em>FAWZER</em></h1><p>Building ideas into <strong>real-world software.</strong></p><div className="hero-actions"><a className="btn primary" href="#projects">Explore My Work <span>↘</span></a><a className="btn ghost" href={`mailto:${site.email}`}>Let’s Connect <span>↗</span></a></div><div className="hero-meta"><span>FULL-STACK</span><span>WEB APPLICATIONS</span><span>SOFTWARE ENGINEERING</span></div></div><div className="chapter-note"><span>01 / ENTER THE WORLD</span><p>The portfolio moves with the avatar. Scroll to change the camera, environment and point of view.</p></div></section>;
}

export function AboutChapter() {
  return <section id="about" className="journey-chapter about-chapter"><div className="chapter-copy"><div className="section-kicker">02 / MEET FARSITH</div><h2>BUILDING SOFTWARE<br /><span>WITH PURPOSE.</span></h2><p className="lead">Software Developer with hands-on experience building modern web applications across e-commerce, point-of-sale, digital platforms, healthcare, and accessibility-focused systems.</p><p>Experienced across frontend development, backend integration, databases, authentication and machine-learning-powered applications. The focus is practical: understand the problem, build the system, and make the experience feel considered.</p><div className="signature">BUILD · SOLVE · IMPROVE · REPEAT.</div></div><div className="chapter-card about-facts"><span>THE PERSON BEHIND THE SOFTWARE</span><div><b>Full-Stack Development</b><small>Web applications and real-world systems</small></div><div><b>Software Engineering</b><small>Problem solving, architecture and iteration</small></div><div><b>SLIIT · 2022 — March 2027</b><small>B.Sc. (Hons) Information Technology — Software Engineering</small></div></div></section>;
}

export function ProjectsChapter() {
  return <section id="projects" className="journey-chapter projects-chapter"><div className="chapter-copy"><div className="section-kicker">03 / SELECTED WORK</div><h2>WHAT I <em>BUILD.</em></h2><p>As the camera moves behind the workstation, each project becomes part of the environment.</p></div><div className="project-rail">{projects.map((project) => <article key={project.id} className={`journey-project journey-project-${project.tone}`}><span>{project.id}</span><h3>{project.title}</h3><h4>{project.subtitle}</h4><p>{project.description}</p><small>{project.tech}</small><a href="#contact">Discuss this build ↗</a></article>)}</div></section>;
}

export function ToolkitChapter() {
  return <section id="toolkit" className="journey-chapter toolkit-chapter"><div className="chapter-copy"><div className="section-kicker">04 / MY TOOLKIT</div><h2>THE TOOLS<br /><span>BEHIND THE WORK.</span></h2><p>A practical stack spanning interface design, application logic, data, infrastructure and applied machine learning.</p></div><div className="toolkit-orbit">{stack.map(([name, desc], index) => <motion.div key={name} className="orbit-tech" whileHover={{ y: -6, scale: 1.03 }}><span>{String(index + 1).padStart(2, '0')}</span><b>{name}</b><small>{desc}</small></motion.div>)}</div></section>;
}

export function ExperienceChapter() {
  return <section id="experience" className="journey-chapter experience-chapter"><div className="chapter-copy"><div className="section-kicker">05 / EXPERIENCE & JOURNEY</div><h2>FROM <em>SUPPORT</em><br />TO SOFTWARE.</h2><p>Professional experience shaped by structured troubleshooting, customer-facing problem solving, cross-functional collaboration and software engineering.</p></div><div className="experience-path"><div className="experience-node"><span>2020 — 2024</span><div><b>Dialog Axiata PLC</b><small>Customer Service Associate → Senior Customer Service Associate</small></div></div><div className="experience-node"><span>2024 — PRESENT</span><div><b>Sysco Labs Technologies</b><small>Analyst — L1 Operations Support</small></div></div><div className="experience-node"><span>NOW</span><div><b>Software Engineering</b><small>B.Sc. (Hons) IT — Software Engineering · SLIIT</small></div></div></div></section>;
}

export function ContactChapter() {
  return <section id="contact" className="journey-chapter contact-chapter"><div className="chapter-copy"><div className="section-kicker">06 / LET’S BUILD SOMETHING</div><h2>HAVE AN IDEA,<br /><em>A PRODUCT, OR A PROBLEM<br />WORTH SOLVING?</em></h2><a className="contact-mail" href={`mailto:${site.email}`}>{site.email} <span>↗</span></a><div className="contact-links"><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${site.email}`}>Email ↗</a></div></div><div className="chapter-note contact-note"><span>THE JOURNEY ENDS HERE.</span><p>The next move is yours. Let’s build something meaningful.</p></div></section>;
}
