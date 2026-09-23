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

function ProjectEnvironment({ progress, activeStage, selectedProjectId }: { progress: MotionValue<number>; activeStage: number; selectedProjectId: string }) {
  const opacity = useTransform(progress, [0.28, 0.36, 0.46, 0.54], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.28, 0.46, 0.54], [28, 0, -18]);
  const x = useTransform(progress, [0.28, 0.36, 0.46, 0.54], ['8vw', '0vw', '-18vw', '-10vw']);
  const rotate = useTransform(progress, [0.28, 0.46, 0.54], [-2, 0, 2]);
  const scale = useTransform(progress, [0.28, 0.36, 0.46, 0.54], [0.92, 1, 1.02, 0.96]);
  const selected = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const projectIndex = Math.max(0, projects.findIndex((project) => project.id === selected.id));
  const reaction = useTransform(progress, [0.34, 0.395, 0.46], [0, 1, 0]);
  const projectGlow = useTransform(reaction, [0, 1], [0.08, 0.2]);
  const screenTilt = useTransform(reaction, [0, 1], [0, projectIndex % 2 === 0 ? -1.4 : 1.4]);
  return <motion.div className={`project-environment project-environment--${selected.tone}`} style={{ opacity, x, y, scale, rotateZ: rotate, ['--project-glow' as string]: projectGlow, ['--screen-tilt' as string]: screenTilt }} aria-hidden={activeStage !== 2}>
    <div className="workbench-label"><span>03 / WORKBENCH</span><b>{selected.id} / {selected.tone.toUpperCase()}</b></div>
    <div className="workbench-window"><div className="workbench-top"><i /><i /><i /><span>farsith / {selected.title.toLowerCase()}</span><em>LIVE STATE</em></div>
      <div className="workbench-body"><div className="workbench-side"><b>PROJECTS</b>{projects.map((project) => <span key={project.id} className={project.id === selected.id ? 'selected' : ''}>{project.id} · {project.title}</span>)}</div>
        <div className="workbench-main"><div className="workbench-heading"><span>{selected.title.toUpperCase()}</span><b>{selected.subtitle}</b></div><div className="workbench-metrics"><div><small>STATE</small><strong>{selected.id === '04' ? 'MODEL' : selected.id === '02' ? 'STOREFRONT' : selected.id === '03' ? 'PLATFORM' : selected.id === '05' ? 'HOME' : 'SYSTEM'}</strong></div><div><small>STACK</small><strong>{selected.tech.split(' · ')[0]}</strong></div><div><small>BUILD</small><strong>ACTIVE</strong></div></div><div className="workbench-chart"><i /><i /><i /><i /><i /><i /></div><div className="workbench-code"><span>{selected.id === '01' ? 'const checkout = await pos.sale();' : selected.id === '02' ? 'const cart = await storefront.add();' : selected.id === '03' ? 'const page = buildAgencySection();' : selected.id === '04' ? 'const signs = await model.predict();' : 'const home = await inventory.sync();'}</span><span>{selected.id === '04' ? 'await recognition.validate();' : 'await system.validate();'}</span></div></div>
      </div>
    </div><div className="workbench-glow" /><div className="workbench-ambient"><i /><i /><i /><span>{selected.tone}</span></div>
  </motion.div>;
}

export function AvatarStage({ progress, activeStage, selectedProjectId }: { progress: MotionValue<number>; activeStage: number; selectedProjectId: string }) {
  const avatarY = useTransform(progress, [0, 1], ['1%', '-3%']);
  const avatarScale = useTransform(progress, [0, 0.18, 0.42, 0.7, 1], [1, 1.035, 0.97, 1.055, 1]);
  const avatarRotate = useTransform(progress, [0, 0.2, 0.4, 0.62, 0.82, 1], [0, -1.5, 2.5, -3, 2, 0]);
  // The avatar travels between two deliberate viewport lanes. The motion is large enough
  // to read as a composition change while the spring keeps the camera physically smooth.
  const cameraXTarget = useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], ['-28vw', '28vw', '-28vw', '28vw', '-28vw', '28vw']);
  const cameraX = useSpring(cameraXTarget, { stiffness: 90, damping: 22, mass: 0.7 });
  const cameraZ = useSpring(useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 18, 28, 18, 28, 0]), { stiffness: 80, damping: 24, mass: 0.8 });
  const projectIndex = Math.max(0, projects.findIndex((project) => project.id === selectedProjectId));
  const projectReaction = useTransform(progress, [0.34, 0.395, 0.46], [0, 1, 0]);
  const reactionRotate = useTransform(projectReaction, [0, 1], [0, (projectIndex - 2) * 0.7]);
  const reactionLift = useTransform(projectReaction, [0, 1], [0, -Math.abs(projectIndex - 2) * 3]);
  return <div className={`avatar-stage stage-${activeStage}`}><WorkspaceDecor progress={progress} /><ProjectEnvironment progress={progress} activeStage={activeStage} selectedProjectId={selectedProjectId} />
    <motion.div className="avatar-camera" style={{ x: cameraX, y: avatarY, scale: avatarScale, rotateY: avatarRotate, rotateZ: reactionRotate, z: cameraZ }}><div className="avatar-halo" /><div className="avatar-floor" /><div className="avatar-image-stack">{journeyStages.map((stage, index) => <AvatarFrame key={stage.id} stage={stage} index={index} progress={progress} />)}</div></motion.div>
    <div className="stage-surface" /><div className="stage-caption"><span>SCROLL STATE / {String(activeStage + 1).padStart(2, '0')}</span><strong>{journeyStages[activeStage].label}</strong><small>{journeyStages[activeStage].angle} view</small></div>
  </div>;
}
