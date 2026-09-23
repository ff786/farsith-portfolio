'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

export type ProjectCarouselItem = {
  title: string;
  description: string;
  id: string;
  icon: ReactNode;
};

function CarouselItem({ item, index, itemWidth, trackItemOffset, x, transition }: {
  item: ProjectCarouselItem;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: ReturnType<typeof useMotionValue<number>>;
  transition: typeof SPRING_OPTIONS | { duration: number };
}) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });

  return (
    <motion.div
      key={`${item.id}-${index}`}
      className="project-carousel__item"
      style={{ width: itemWidth, rotateY }}
      transition={transition}
    >
      <div className="project-carousel__item-header">
        <span className="project-carousel__icon">{item.icon}</span>
        <span className="project-carousel__item-id">{item.id}</span>
      </div>
      <div className="project-carousel__item-content">
        <div className="project-carousel__item-title">{item.title}</div>
        <p className="project-carousel__item-description">{item.description}</p>
      </div>
    </motion.div>
  );
}

export function ProjectCarousel({
  items,
  selectedId,
  onSelect,
  baseWidth = 360,
  autoplay = false,
  autoplayDelay = 3600,
  pauseOnHover = true,
  loop = true,
}: {
  items: ProjectCarouselItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => {
    if (!loop || items.length === 0) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const [position, setPosition] = useState(loop ? selectedIndex + 1 : selectedIndex);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const enter = () => setIsHovered(true);
      const leave = () => setIsHovered(false);
      container.addEventListener('mouseenter', enter);
      container.addEventListener('mouseleave', leave);
      return () => {
        container.removeEventListener('mouseenter', enter);
        container.removeEventListener('mouseleave', leave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    const target = loop ? selectedIndex + 1 : selectedIndex;
    setPosition(target);
    x.set(-target * trackItemOffset);
  }, [selectedIndex, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1 || (pauseOnHover && isHovered)) return;
    const timer = window.setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;
    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    const active = (position - 1 + items.length) % items.length;
    if (items[active]) onSelect(items[active].id);
    setIsAnimating(false);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const direction =
      info.offset.x < -DRAG_BUFFER || info.velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : info.offset.x > DRAG_BUFFER || info.velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;
    setPosition((prev) => {
      const next = prev + direction;
      return Math.max(0, Math.min(next, itemsForRender.length - 1));
    });
  };

  const dragProps = loop
    ? {}
    : { dragConstraints: { left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0), right: 0 } };

  const activeIndex = items.length === 0 ? 0 : loop
    ? (position - 1 + items.length) % items.length
    : Math.min(position, items.length - 1);

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className="project-carousel"
      style={{ width: `min(${baseWidth}px, 100%)` }}
      aria-label="Project showcase"
    >
      <motion.div
        className="project-carousel__track"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{ width: itemWidth, gap: GAP, perspective: 1000, perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`, x }}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onDragEnd={handleDragEnd}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      <div className="project-carousel__indicators">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            className={activeIndex === index ? 'active' : ''}
            aria-label={`Select ${item.title}`}
            aria-current={activeIndex === index}
            animate={{ scale: activeIndex === index ? 1.2 : 1 }}
            onClick={() => {
              onSelect(item.id);
              setPosition(loop ? index + 1 : index);
            }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
