import { journeyStages } from './journey-stages';

export function JourneyProgress({ activeStage }: { activeStage: number }) {
  return <aside className="journey-progress" aria-label="Portfolio sections"><div className="progress-line" />
    {journeyStages.map((stage, index) => <a key={stage.id} href={`#${stage.id}`} className={activeStage === index ? 'active' : ''} aria-current={activeStage === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><b>{stage.label}</b></a>)}
  </aside>;
}
