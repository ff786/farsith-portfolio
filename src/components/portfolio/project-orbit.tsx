'use client';

import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { projects } from '../../data/site';

export type Project = (typeof projects)[number];

/* -------------------------------------------------------------------------- */
/* Orbital geometry                                                            */
/* One source of truth for rings AND nodes: every node is computed onto the    */
/* exact ellipse its ring is drawn with, so nothing ever floats off-track.     */
/* -------------------------------------------------------------------------- */

type Geometry = { cx: number; cy: number; radii: { rx: number; ry: number }[] };

const RING_KEYS = ['inner', 'middle', 'outer'] as const;
/** Ring radius as a fraction of stage width — desktop / compact (phones). */
const RING_FRACTIONS = { wide: [0.29, 0.39, 0.49], compact: [0.27, 0.36, 0.45] };
/** ry = rx * tilt. Lower = flatter plane (more cinematic), higher = more top-down. */
const TILT = { wide: 0.38, compact: 0.72 };
const COMPACT_BREAKPOINT = 560;
/** Full revolution time. All builds share one angular velocity so their spacing is permanent. */
const REVOLUTION_MS = 90_000;

/** Which ring each build rides, alternating so neighbours never share a track. */
const RING_OF_INDEX = [0, 2, 1, 2, 1];
/** Evenly spaced phases; build 01 starts at the front (bottom-centre) of the system. */
const phaseOf = (index: number) => 90 + index * (360 / projects.length);

/**
 * Round to a fixed precision. Server (Node) and browser Math.sin/cos can differ in the
 * last few decimal places, which makes SSR'd SVG attributes mismatch on hydration.
 */
const round = (n: number, places = 2) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};

function geometry(w: number, h: number): Geometry {
  const compact = w < COMPACT_BREAKPOINT;
  const fractions = compact ? RING_FRACTIONS.compact : RING_FRACTIONS.wide;
  const tilt = compact ? TILT.compact : TILT.wide;
  return {
    cx: w / 2,
    cy: h * 0.5,
    radii: fractions.map((f) => ({ rx: round(w * f), ry: round(w * f * tilt) })),
  };
}

function pointOnRing(g: Geometry, ring: number, degrees: number) {
  const t = (degrees * Math.PI) / 180;
  const { rx, ry } = g.radii[ring];
  const sin = Math.sin(t);
  // depth: 0 = far side (behind the core), 1 = near side (in front of the core)
  return { x: round(g.cx + rx * Math.cos(t)), y: round(g.cy + ry * sin), depth: round((sin + 1) / 2, 3) };
}

/** Half-ellipse paths so the far half renders behind the core and the near half in front. */
function arcPath(g: Geometry, ring: number, half: 'back' | 'front') {
  const { rx, ry } = g.radii[ring];
  const left = `${g.cx - rx} ${g.cy}`;
  const right = `${g.cx + rx} ${g.cy}`;
  return half === 'back'
    ? `M ${left} A ${rx} ${ry} 0 0 1 ${right}`
    : `M ${right} A ${rx} ${ry} 0 0 1 ${left}`;
}

/* -------------------------------------------------------------------------- */

export function ProjectPreview({ project }: { project: Project }) {
  const state = project.id === '04' ? 'MODEL' : project.id === '02' ? 'STOREFRONT' : project.id === '03' ? 'PLATFORM' : project.id === '05' ? 'HOME' : 'SYSTEM';
  return <div className={`project-orbit-preview project-orbit-preview--${project.tone}`}>
    <div className="project-preview-top"><span>{project.id} / {state}</span><span>LIVE</span></div>
    <div className="project-preview-window">
      <div className="project-preview-sidebar"><i /><i /><i /><i /></div>
      <div className="project-preview-main">
        <span className="project-preview-line project-preview-line--wide" />
        <span className="project-preview-line" />
        <div className="project-preview-grid"><i /><i /><i /></div>
        <div className="project-preview-chart"><i /><i /><i /><i /><i /></div>
      </div>
    </div>
  </div>;
}

function RingLayer({ g, half, activeRing }: { g: Geometry; half: 'back' | 'front'; activeRing: number | null }) {
  return <svg className={`project-orbit__plane project-orbit__plane--${half}`} aria-hidden>
    <defs>
      <linearGradient id={`orbit-fade-${half}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="currentColor" stopOpacity="0.15" />
        <stop offset="0.5" stopColor="currentColor" stopOpacity="1" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    {half === 'back' ? <line className="project-orbit__horizon" x1={round(g.cx - g.radii[2].rx * 1.08)} x2={round(g.cx + g.radii[2].rx * 1.08)} y1={g.cy} y2={g.cy} /> : null}
    {RING_KEYS.map((key, ring) => <path
      key={key}
      d={arcPath(g, ring, half)}
      className={`project-orbit__arc project-orbit__arc--${key} ${activeRing === ring ? 'is-active' : ''}`}
      stroke={`url(#orbit-fade-${half})`}
    />)}
    {/* Measurement ticks on the outer track sell the "instrument" feel. */}
    {Array.from({ length: 36 }, (_, i) => {
      const deg = i * 10;
      const inFront = Math.sin((deg * Math.PI) / 180) >= 0;
      if (inFront !== (half === 'front')) return null;
      const p = pointOnRing(g, 2, deg);
      return <circle key={deg} cx={p.x} cy={p.y} r={i % 3 === 0 ? 1.4 : 0.8} className="project-orbit__tick" style={{ opacity: round(0.25 + p.depth * 0.6, 3) }} />;
    })}
  </svg>;
}

function Comet({ angle, width, height }: { angle: MotionValue<number>; width: MotionValue<number>; height: MotionValue<number> }) {
  const point = (a: number, w: number, h: number) => pointOnRing(geometry(w, h), 2, a * 2.4 + 200);
  const cx = useTransform([angle, width, height], ([a, w, h]: number[]) => point(a, w, h).x);
  const cy = useTransform([angle, width, height], ([a, w, h]: number[]) => point(a, w, h).y);
  const opacity = useTransform([angle, width, height], ([a, w, h]: number[]) => round(Math.pow(point(a, w, h).depth, 2.2), 3));
  return <svg className="project-orbit__plane project-orbit__plane--comet" aria-hidden>
    <motion.circle r={2.2} className="project-orbit__comet" style={{ cx, cy, opacity }} />
  </svg>;
}

function ProjectOrbitNode({ project, index, angle, width, height, hovered, dimmed, onHover, onSelect }: {
  project: Project;
  index: number;
  angle: MotionValue<number>;
  width: MotionValue<number>;
  height: MotionValue<number>;
  hovered: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (project: Project) => void;
}) {
  const ring = RING_OF_INDEX[index] ?? index % 3;
  const phase = phaseOf(index);
  const locate = ([a, w, h]: number[]) => pointOnRing(geometry(w, h), ring, phase + a);

  const x = useTransform([angle, width, height], (v: number[]) => locate(v).x);
  const y = useTransform([angle, width, height], (v: number[]) => locate(v).y);
  const depth = useTransform([angle, width, height], (v: number[]) => locate(v).depth);
  // Perspective: far builds shrink and recede, near builds grow and sit in front of the core.
  const scale = useTransform(depth, (d) => round(0.74 + d * 0.34, 3));
  const opacity = useTransform(depth, (d) => round(0.42 + d * 0.58, 3));
  const zIndex = useTransform(depth, (d) => (d >= 0.5 ? 12 + Math.round(d * 10) : 2 + Math.round(d * 4)));

  const focus = () => { onHover(project.id); onSelect(project); };

  return <motion.div
    className={`project-orbit-slot ${hovered ? 'is-hovered' : ''} ${dimmed ? 'is-dimmed' : ''}`}
    style={{ x, y, scale, zIndex: hovered ? 40 : zIndex, opacity: hovered ? 1 : opacity, ['--tone' as string]: `var(--orbit-${project.tone})` }}
  >
    <button
      type="button"
      className={`project-orbit-node project-orbit-node--${project.id}`}
      onMouseEnter={focus}
      onMouseLeave={() => onHover(null)}
      onFocus={focus}
      onBlur={() => onHover(null)}
      onClick={focus}
      aria-label={`Preview ${project.title}`}
      aria-pressed={hovered}
    >
      <span className="project-orbit-node__halo" />
      <span className="project-orbit-node__core"><span>{project.id}</span></span>
      <span className="project-orbit-node__label">{project.title}</span>
      <span className="project-orbit-node__meta">{project.subtitle}</span>
    </button>
  </motion.div>;
}

export function ProjectOrbit({ selectedId, onSelect }: { selectedId: string; onSelect: (project: Project) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: '10% 0px' });

  // Stage size lives in motion values (for per-frame node maths) and in state (for SVG paths).
  const width = useMotionValue(760);
  const height = useMotionValue(560);
  const [size, setSize] = useState({ w: 760, h: 560 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      width.set(w);
      height.set(h);
      setSize({ w, h });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [width, height]);

  // Rigid rotation of the whole system; paused while a build is focused so it can be read and clicked.
  const angle = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (reducedMotion || hoveredId || !inView) return;
    angle.set((angle.get() + (delta / REVOLUTION_MS) * 360) % 360);
  });

  const g = geometry(size.w, size.h);
  const focused = projects.find((project) => project.id === (hoveredId ?? selectedId)) ?? projects[0];
  const hoveredIndex = hoveredId ? projects.findIndex((p) => p.id === hoveredId) : -1;
  const activeRing = hoveredIndex >= 0 ? RING_OF_INDEX[hoveredIndex] : null;

  return <div
    ref={stageRef}
    className={`project-orbit project-orbit--${focused.tone} ${hoveredId ? 'is-hovering' : ''}`}
    onMouseLeave={() => setHoveredId(null)}
  >
    <div className="project-orbit__eyebrow"><span>ORBITAL INDEX</span><b>{String(projects.length).padStart(2, '0')} BUILDS</b></div>

    <RingLayer g={g} half="back" activeRing={activeRing} />

    <div className="project-orbit__sun" style={{ left: g.cx, top: g.cy }}>
      <span>03 / SELECTED WORK</span>
      <strong>WHAT I<br /><em>BUILD.</em></strong>
      <small>PROJECT SYSTEM</small>
    </div>

    <RingLayer g={g} half="front" activeRing={activeRing} />
    {reducedMotion ? null : <Comet angle={angle} width={width} height={height} />}

    {projects.map((project, index) => <ProjectOrbitNode
      key={project.id}
      project={project}
      index={index}
      angle={angle}
      width={width}
      height={height}
      hovered={hoveredId === project.id}
      dimmed={!!hoveredId && hoveredId !== project.id}
      onHover={setHoveredId}
      onSelect={onSelect}
    />)}

    <div className="project-orbit-detail-anchor" style={{ top: g.cy }}>
      <AnimatePresence mode="wait">
        {hoveredId ? <motion.div
          key={focused.id}
          className={`project-orbit-detail project-orbit-detail--${focused.tone}`}
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="project-orbit-detail__header">
            <span>{focused.id} / PROJECT</span>
            <b>{RING_KEYS[RING_OF_INDEX[hoveredIndex] ?? 0].toUpperCase()} ORBIT</b>
          </div>
          <div className="project-orbit-detail__body">
            <div className="project-orbit-detail__visual"><ProjectPreview project={focused} /></div>
            <div className="project-orbit-detail__copy">
              <h3>{focused.title}</h3>
              <p>{focused.subtitle}</p>
              <small>{focused.tech}</small>
              <span>{focused.contribution}</span>
            </div>
          </div>
        </motion.div> : null}
      </AnimatePresence>
    </div>
  </div>;
}
