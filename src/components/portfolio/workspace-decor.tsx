'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

export function WorkspaceDecor({ progress }: { progress: MotionValue<number> }) {
  const lightX = useTransform(progress, [0, 1], ['12%', '78%']);
  const lightY = useTransform(progress, [0, 1], ['22%', '64%']);
  const gridRotate = useTransform(progress, [0, 1], [64, 76]);
  const gridY = useTransform(progress, [0, 1], ['0%', '14%']);
  return <div className="journey-decor" aria-hidden="true">
    <motion.div className="journey-light" style={{ left: lightX, top: lightY }} />
    <motion.div className="journey-grid" style={{ rotateX: gridRotate, y: gridY }} />
    <div className="journey-window" />
    <div className="journey-monitor monitor-one"><span>01</span><i /><i /><i /></div>
    <div className="journey-monitor monitor-two"><span>FF / SYSTEM</span><i /><i /><i /></div>
    <div className="journey-orb" /><div className="journey-particle particle-a" /><div className="journey-particle particle-b" /><div className="journey-particle particle-c" />
  </div>;
}
