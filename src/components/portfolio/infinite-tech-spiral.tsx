'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

type TechItem = readonly [name: string, description: string];

type InfiniteTechSpiralProps = {
  items: TechItem[];
  progress: MotionValue<number>;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

export function InfiniteTechSpiral({ items, progress }: InfiniteTechSpiralProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const previousProgressRef = useRef(progress.get());
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);

  const normalizedItems = useMemo(() => items, [items]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frame = 0;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(root);

    const unsubscribe = progress.on('change', (value) => {
      const delta = value - previousProgressRef.current;
      previousProgressRef.current = value;
      if (!visibleRef.current || Math.abs(delta) < 0.0001) return;

      // The page's master cinematic progress becomes the spiral's travel input.
      targetRef.current += delta * normalizedItems.length * 1.15;
    });

    const render = (time: number) => {
      const deltaTime = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (visibleRef.current && !reducedMotion.matches && !hoveredRef.current) {
        targetRef.current += deltaTime * 0.34;
      }

      const followBlend = 1 - Math.exp(-deltaTime * 8);
      currentRef.current += (targetRef.current - currentRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const cardWidth = clamp(width * 0.12, 78, 118);
      const cardHeight = clamp(height * 0.19, 76, 116);
      const radius = clamp(width * 0.19, 120, 230);
      const verticalSpacing = clamp(height * 0.095, 34, 62);
      const cardsPerTurn = 7;
      const perspective = 1050;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        let offset = index - currentRef.current;
        offset = modulo(offset + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const focus = 1 - Math.min(Math.abs(offset) / 4.6, 1);
        const fade = 1 - smoothstep(0.68, 1, edge);
        const angle = offset * (360 / cardsPerTurn) - 8;
        const radians = (angle * Math.PI) / 180;
        const x = Math.sin(radians) * radius;
        const z = Math.cos(radians) * radius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.7, 1.38);
        const scale = (0.82 + focus * 0.22) * depthScale;
        const blur = 5.5 * smoothstep(0.45, 1, edge);
        const opacity = clamp(fade * (0.42 + focus * 0.58), 0, 1);
        const rotation = offset * -1.8;

        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing}px, 0) rotateZ(${rotation}deg) scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
        card.style.zIndex = String(Math.round((z + radius) * 100) + index);
      });

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [normalizedItems, progress]);

  return (
    <div
      ref={rootRef}
      className="infinite-tech-spiral"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      aria-label="Technology stack spiral"
    >
      <div className="infinite-tech-spiral__stage" role="list">
        {normalizedItems.map(([name, description], index) => (
          <div
            key={name}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="infinite-tech-spiral__item"
            role="listitem"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{name}</strong>
            <small>{description}</small>
          </div>
        ))}
      </div>


    </div>
  );
}
