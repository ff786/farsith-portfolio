'use client';

import { useState } from 'react';
import { site } from '../../data/site';
import { journeyStages } from './journey-stages';

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="nav">
        <a href="#home" className="logo" aria-label="Farsith Fawzer home">FF</a>
        <div className="nav-links">
          {journeyStages.slice(0, -1).map((stage) => <a key={stage.id} href={`#${stage.id}`}>{stage.label}</a>)}
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href={`mailto:${site.email}`}>Let’s Talk</a>
        <button className="menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}><span /><span /></button>
      </nav>
      {open && <div className="mobile-menu">{journeyStages.map((stage) => <a key={stage.id} href={`#${stage.id}`} onClick={() => setOpen(false)}>{stage.label}</a>)}</div>}
    </header>
  );
}
