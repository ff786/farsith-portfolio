'use client';

import Image from 'next/image';
import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { projects } from '../../data/site';
import { journeyStages } from './journey-stages';
import { WorkspaceDecor } from './workspace-decor';

function AvatarFrame({ stage, index, progress }: { stage: typeof journeyStages[number]; index: number; progress: MotionValue<number> }) {
  const position = index * 0.2;
  const fadeStart = index === 0 ? 0 : position - 0.12;
  const fadePeak = position;
  const fadeEnd = index === journeyStages.length - 1 ? 1 : position + 0.12;
  const opacity = useTransform(progress, [fadeStart, fadePeak, fadeEnd], index === 0 ? [1, 1, 0] : index === journeyStages.length - 1 ? [0, 1, 1] : [0, 1, 0]);
  const scale = useTransform(progress, [fadeStart, fadePeak, fadeEnd], [0.975, 1, 0.975]);
  const blur = useTransform(progress, [fadeStart, fadePeak, fadeEnd], ['3px', '0px', '3px']);
  return <motion.div className={`journey-avatar avatar-${index}`} style={{ opacity, scale, filter: blur }} aria-hidden>
    <Image src={stage.image} alt={stage.alt} fill sizes="(max-width: 900px) 80vw, 42vw" priority={index === 0} loading={index === 0 ? "eager" : "lazy"} />
  </motion.div>;
}

function ProjectEnvironment({ progress, activeStage }: { progress: MotionValue<number>; activeStage: number }) {
  const opacity = useTransform(progress, [0.28, 0.36, 0.46, 0.54], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.28, 0.46, 0.54], [28, 0, -18]);
  const x = useTransform(progress, [0.28, 0.36, 0.46, 0.54], ['8vw', '0vw', '-18vw', '-10vw']);
  const rotate = useTransform(progress, [0.28, 0.46, 0.54], [-2, 0, 2]);
  const scale = useTransform(progress, [0.28, 0.36, 0.46, 0.54], [0.92, 1, 1.02, 0.96]);
  return <motion.div className="project-environment" style={{ opacity, x, y, scale, rotateZ: rotate }} aria-hidden={activeStage !== 2}>
    <div className="workbench-label"><span>03 / WORKBENCH</span><b>BUILD IN PROGRESS</b></div>
    <div className="workbench-window"><div className="workbench-top"><i /><i /><i /><span>farsith / project workspace</span></div>
      <div className="workbench-body"><div className="workbench-side"><b>PROJECTS</b>{projects.map((project, index) => <span key={project.id} className={index === 0 ? 'selected' : ''}>{project.id} · {project.title}</span>)}</div>
        <div className="workbench-main"><div className="workbench-heading"><span>MYNIX POS</span><b>inventory / sales</b></div><div className="workbench-stats"><i /><i /><i /></div><div className="workbench-chart"><i /><i /><i /><i /><i /><i /></div><div className="workbench-code"><span>const workflow = build();</span><span>await system.validate();</span></div></div>
      </div>
    </div><div className="workbench-glow" />
  </motion.div>;
}

export function AvatarStage({ progress, activeStage }: { progress: MotionValue<number>; activeStage: number }) {
  const avatarY = useTransform(progress, [0, 1], ['1%', '-3%']);
  const avatarScale = useTransform(progress, [0, 0.18, 0.42, 0.7, 1], [1, 1.035, 0.97, 1.055, 1]);
  const avatarRotate = useTransform(progress, [0, 0.2, 0.4, 0.62, 0.82, 1], [0, -1.5, 2.5, -3, 2, 0]);
  // The avatar travels between two deliberate viewport lanes. The motion is large enough
  // to read as a composition change while the spring keeps the camera physically smooth.
  const cameraXTarget = useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], ['-28vw', '28vw', '-28vw', '28vw', '-28vw', '28vw']);
  const cameraX = useSpring(cameraXTarget, { stiffness: 90, damping: 22, mass: 0.7 });
  const cameraZ = useSpring(useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 18, 28, 18, 28, 0]), { stiffness: 80, damping: 24, mass: 0.8 });
  return <div className={`avatar-stage stage-${activeStage}`}><WorkspaceDecor progress={progress} /><ProjectEnvironment progress={progress} activeStage={activeStage} />
    <motion.div className="avatar-camera" style={{ x: cameraX, y: avatarY, scale: avatarScale, rotateY: avatarRotate, z: cameraZ }}><div className="avatar-halo" /><div className="avatar-floor" /><div className="avatar-image-stack">{journeyStages.map((stage, index) => <AvatarFrame key={stage.id} stage={stage} index={index} progress={progress} />)}</div></motion.div>
    <div className="stage-surface" /><div className="stage-caption"><span>SCROLL STATE / {String(activeStage + 1).padStart(2, '0')}</span><strong>{journeyStages[activeStage].label}</strong><small>{journeyStages[activeStage].angle} view</small></div>
  </div>;
}
