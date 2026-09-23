import { AnimatePresence, motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { site, stack, projects } from '../../data/site';
import { InfiniteTechSpiral } from './infinite-tech-spiral';

type ChapterProps = { progress: MotionValue<number> };

const PROJECT_CAROUSEL_GAP = 16;
const PROJECT_CAROUSEL_SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };

type ProjectCarouselItem = { title: string; description: string; id: string; icon: ReactNode };

function ProjectCarousel({ items, selectedId, onSelect, baseWidth = 380, loop = true }: {
  items: ProjectCarouselItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}) {
  const itemWidth = Math.min(baseWidth, 720) - 32;
  const offset = itemWidth + PROJECT_CAROUSEL_GAP;
  const rendered = useMemo(() => loop && items.length ? [items[items.length - 1], ...items, items[0]] : items, [items, loop]);
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const [position, setPosition] = useState(loop ? selectedIndex + 1 : selectedIndex);
  const x = useMotionValue(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const target = loop ? selectedIndex + 1 : selectedIndex;
    setPosition(target);
    x.set(-target * offset);
  }, [selectedIndex, loop, offset, x]);

  const transition = PROJECT_CAROUSEL_SPRING;
  const activeIndex = items.length ? (loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1)) : 0;

  const selectPosition = (next: number) => {
    setPosition(Math.max(0, Math.min(next, rendered.length - 1)));
  };

  if (!items.length) return null;

  return <div className="project-carousel" style={{ width: 'min(380px, 100%)' }}>
    <motion.div
      className="project-carousel__track"
      drag={animating ? false : 'x'}
      dragConstraints={loop ? undefined : { left: -offset * Math.max(rendered.length - 1, 0), right: 0 }}
      style={{ width: itemWidth, gap: PROJECT_CAROUSEL_GAP, perspective: 1000, perspectiveOrigin: (position * offset + itemWidth / 2) + 'px 50%', x }}
      animate={{ x: -position * offset }}
      transition={transition}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => {
        if (loop && position === rendered.length - 1) {
          setPosition(1);
          x.set(-offset);
        } else if (loop && position === 0) {
          const target = items.length;
          setPosition(target);
          x.set(-target * offset);
        } else {
          const active = (position - 1 + items.length) % items.length;
          if (items[active]) onSelect(items[active].id);
        }
        setAnimating(false);
      }}
      onDragEnd={(_, info) => {
        const direction = info.offset.x < 0 || info.velocity.x < -500 ? 1 : info.offset.x > 0 || info.velocity.x > 500 ? -1 : 0;
        if (direction) selectPosition(position + direction);
      }}
    >
      {rendered.map((item, index) => {
        const range = [-(index + 1) * offset, -index * offset, -(index - 1) * offset];
        const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });
        return <motion.div key={item.id + '-' + index} className="project-carousel__item" style={{ width: itemWidth, rotateY }} transition={transition}>
          <div className="project-carousel__item-header"><span className="project-carousel__icon">{item.icon}</span><span className="project-carousel__item-id">{item.id}</span></div>
          <div className="project-carousel__item-content"><div className="project-carousel__item-title">{item.title}</div><p className="project-carousel__item-description">{item.description}</p></div>
        </motion.div>;
      })}
    </motion.div>
    <div className="project-carousel__indicators">
      {items.map((item, index) => <motion.button key={item.id} type="button" className={activeIndex === index ? 'active' : ''} aria-label={'Select ' + item.title} aria-current={activeIndex === index} animate={{ scale: activeIndex === index ? 1.2 : 1 }} onClick={() => { onSelect(item.id); selectPosition(loop ? index + 1 : index); }} transition={{ duration: .15 }} />)}
    </div>
  </div>;
}


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
  const carouselItems = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.subtitle,
    icon: project.id,
  }));

  return <div className="project-system">
    <ProjectCarousel
      items={carouselItems}
      selectedId={selected.id}
      onSelect={(id) => {
        const project = projects.find((item) => item.id === id);
        if (project) onSelect(project);
      }}
      baseWidth={380}
      autoplay={false}
      pauseOnHover
      loop
    />

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
