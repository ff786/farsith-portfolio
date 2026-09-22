'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { site, stack, projects } from '../data/site';

function GlowScene(){
  const x=useMotionValue(0), y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:90,damping:20}), sy=useSpring(y,{stiffness:90,damping:20});
  const zero=useMotionValue(0);
  const sz=useSpring(zero,{stiffness:90,damping:20});
  return <div className="scene" onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left-r.width/2)/20);y.set((e.clientY-r.top-r.height/2)/20)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>
    <div className="scene-grid"/>
    <motion.div className="orb orb-a" style={{x:sx,y:sy}}/>
    <motion.div className="avatar-shell" style={{x:sx, y:sy}}>
      <div className="avatar-glow"/>
      <Image src="/avatar/hero.png" alt="Farsith avatar, front view" fill sizes="(max-width: 900px) 70vw, 35vw" className="avatar-img" priority/>
    </motion.div>
    <motion.div className="floating-card card-code" style={{x:sz, y:sy}}><span>BUILD</span><b>real-world software</b></motion.div>
    <div className="floating-card card-stack"><span>STACK</span><b>React · Java · Spring</b></div>
    <div className="desk"><div className="laptop"><div className="screen-lines"/><span>FF</span></div><div className="cup">◎</div><div className="book">SYSTEMS<br/>DESIGN</div></div>
  </div>
}

function Nav(){
  const [open,setOpen]=useState(false);
  return <header className="nav-wrap"><nav className="nav"><a href="#home" className="logo">FF</a><div className="nav-links">{[['About','#about'],['Toolkit','#toolkit'],['Projects','#projects'],['Experience','#experience'],['Contact','#contact']].map(([t,h])=><a key={h} href={h}>{t}</a>)}</div><a className="nav-cta" href={`mailto:${site.email}`}>Let’s Talk</a><button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu"><span/><span/></button></nav>{open&&<div className="mobile-menu">{[['About','#about'],['Toolkit','#toolkit'],['Projects','#projects'],['Experience','#experience'],['Contact','#contact']].map(([t,h])=><a key={h} href={h} onClick={()=>setOpen(false)}>{t}</a>)}</div>}</header>
}

function ProjectVisual({tone}:{tone:string}){
  return <div className={`project-visual ${tone}`}><div className="browser"><div className="browser-top"><i/><i/><i/><span>farsith.build</span></div><div className="dashboard"><div className="dash-side"><b>FF</b><span/><span/><span/><span/></div><div className="dash-main"><div className="dash-heading"><div/><div/></div><div className="dash-chart"><i/><i/><i/><i/><i/><i/></div><div className="dash-row"><div/><div/><div/></div></div></div></div><div className="project-orb"/></div>
}

export default function Home(){
  const [loading,setLoading]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),900);return()=>clearTimeout(t)},[]);
  const cursor=useRef<HTMLDivElement>(null);
  useEffect(()=>{const move=(e:MouseEvent)=>{if(cursor.current){cursor.current.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`}};window.addEventListener('mousemove',move);return()=>window.removeEventListener('mousemove',move)},[]);
  return <>
    {loading&&<motion.div className="loader" initial={{opacity:1}} animate={{opacity:0}} transition={{duration:.45,delay:.65}}><div className="loader-mark">FF</div><div>FARSITH FAWZER</div><small>SOFTWARE DEVELOPER</small></motion.div>}
    <div ref={cursor} className="cursor"/>
    <Nav/>
    <main>
      <section id="home" className="hero"><div className="hero-copy"><div className="eyebrow">COLOMBO · SRI LANKA / SOFTWARE DEVELOPER</div><h1>FARSITH<br/><em>FAWZER</em></h1><p>Building ideas into <strong>real-world software.</strong></p><div className="hero-actions"><a className="btn primary" href="#projects">Explore My Work <span>↘</span></a><a className="btn ghost" href={`mailto:${site.email}`}>Let’s Connect <span>↗</span></a></div><div className="hero-meta"><span>FULL-STACK</span><span>WEB APPLICATIONS</span><span>SOFTWARE ENGINEERING</span></div></div><GlowScene/><div className="scroll-cue"><span>SCROLL TO EXPLORE</span><i/></div></section>

      <section id="about" className="section about"><div className="section-kicker">01 / MEET FARSITH</div><div className="about-grid"><div><h2>BUILDING SOFTWARE<br/><span>WITH PURPOSE.</span></h2><p className="lead">Software Developer with hands-on experience building modern web applications across e-commerce, point-of-sale, digital platforms, healthcare, and accessibility-focused systems.</p><p>Experienced across frontend development, backend integration, databases, authentication and machine-learning-powered applications. The focus is practical: understand the problem, build the system, and make the experience feel considered.</p><div className="signature">BUILD · SOLVE · IMPROVE · REPEAT.</div></div><div className="about-stage"><Image src="/avatar/confident.png" alt="Farsith avatar, confident expression" fill sizes="40vw"/><div className="stage-label">FARSITH / 01</div></div></div><div className="stat-row"><div><span>FOCUS</span><b>Full-Stack<br/>Development</b></div><div><span>SPECIALIZATION</span><b>Web<br/>Applications</b></div><div><span>CURRENTLY</span><b>Software<br/>Engineering</b></div><div><span>EDUCATION</span><b>B.Sc. (Hons)<br/>IT — SE</b></div></div></section>

      <section id="toolkit" className="section toolkit"><div className="section-kicker">02 / MY TOOLKIT</div><div className="toolkit-head"><h2>THE TOOLS<br/><span>BEHIND THE WORK.</span></h2><p>A practical stack spanning interface design, application logic, data, infrastructure and applied machine learning.</p></div><div className="constellation">{stack.map(([name,desc],i)=><motion.div key={name} className="tech" whileHover={{scale:1.04, y:-6}} style={{'--i':i} as React.CSSProperties}><span>{String(i+1).padStart(2,'0')}</span><b>{name}</b><small>{desc}</small></motion.div>)}</div></section>

      <section id="projects" className="projects"><div className="section project-intro"><div className="section-kicker">03 / SELECTED WORK</div><h2>WHAT I <em>BUILD.</em></h2><p>Case-study style snapshots of systems, products and research experiences built across different problem spaces.</p></div>{projects.map((p,i)=><article className={`project project-${p.tone}`} key={p.id}><div className="project-number">{p.id}</div><div className="project-copy"><div className="project-tag">FEATURED PROJECT</div><h3>{p.title}</h3><h4>{p.subtitle}</h4><p>{p.description}</p><div className="techline">{p.tech}</div><div className="contribution"><span>CONTRIBUTION</span>{p.contribution}</div><div className="project-actions">{p.github&&<a href={p.github}>GitHub ↗</a>}{p.live&&<a href={p.live}>Live Demo ↗</a>}<a href="#contact">Discuss this build ↗</a></div></div><ProjectVisual tone={p.tone}/></article>)}</section>

      <section id="experience" className="section experience"><div className="section-kicker">04 / EXPERIENCE & JOURNEY</div><div className="experience-head"><h2>FROM <em>SUPPORT</em><br/>TO SOFTWARE.</h2><p>Professional experience shaped by structured troubleshooting, customer-facing problem solving, cross-functional collaboration and software engineering.</p></div><div className="timeline"><div className="timeline-item"><div className="time">MAR 2024 — PRESENT</div><div className="dot"/><div><h3>Sysco Labs Technologies</h3><h4>Analyst — L1 Operations Support</h4><p>Structured troubleshooting, issue investigation, root-cause analysis and collaboration with engineering and finance teams to resolve technical and process issues.</p></div></div><div className="timeline-item"><div className="time">DEC 2020 — FEB 2024</div><div className="dot"/><div><h3>Dialog Axiata PLC</h3><h4>Customer Service Associate → Senior Customer Service Associate</h4><p>Career progression built through problem solving, cross-functional collaboration, customer-facing communication and service excellence.</p></div></div></div><div className="journey-card"><Image src="/avatar/side.png" alt="Farsith avatar side profile" fill sizes="30vw"/><div><span>EDUCATION</span><h3>B.Sc. (Hons) Information Technology<br/><em>Software Engineering</em></h3><p>SLIIT · 2022 — March 2027</p><small>ITIL® v4 Foundation in IT Service Management</small></div></div></section>

      <section className="brand-section"><div className="brand-lines"><span>BUILD.</span><span>SOLVE.</span><span>IMPROVE.</span><span>REPEAT.</span></div><div className="brand-avatar"><Image src="/avatar/pointing.png" alt="Farsith avatar pointing" fill sizes="40vw"/></div><div className="brand-footer"><p>Better software.<br/><em>A brighter tomorrow.</em></p><span>04 / PERSONAL BRAND</span></div></section>

      <section id="contact" className="contact"><div className="section-kicker">05 / LET’S BUILD SOMETHING</div><h2>HAVE AN IDEA,<br/><em>A PRODUCT, OR A PROBLEM<br/>WORTH SOLVING?</em></h2><a className="contact-mail" href={`mailto:${site.email}`}>{site.email} <span>↗</span></a><div className="contact-links"><a href={site.linkedin} target="_blank">LinkedIn ↗</a><a href={site.github} target="_blank">GitHub ↗</a><a href={`mailto:${site.email}`}>Email ↗</a></div></section>
    </main>
    <footer><div><b>FARSITH FAWZER</b><span>Software Developer</span></div><p>Build · Solve · Improve · Create Impact</p><small>© 2026 Farsith Fawzer</small></footer>
  </>
}
