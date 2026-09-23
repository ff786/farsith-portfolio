export type JourneyStage = {
  id: string;
  label: string;
  image: string;
  alt: string;
  angle: string;
};

export const journeyStages: JourneyStage[] = [
  { id: 'home', label: 'HERO', image: '/avatar/hero.png', alt: 'Farsith avatar in the hero workspace', angle: 'front' },
  { id: 'about', label: 'ABOUT', image: '/avatar/confident.png', alt: 'Farsith avatar in a confident pose', angle: 'three-quarter' },
  { id: 'projects', label: 'PROJECTS', image: '/avatar/laptop.png', alt: 'Farsith avatar working with a laptop', angle: 'work' },
  { id: 'toolkit', label: 'TOOLKIT', image: '/avatar/pointing.png', alt: 'Farsith avatar pointing toward the toolkit', angle: 'interaction' },
  { id: 'experience', label: 'EXPERIENCE', image: '/avatar/side.png', alt: 'Farsith avatar shown from the side', angle: 'side' },
  { id: 'contact', label: 'CONTACT', image: '/avatar/smile.png', alt: 'Farsith avatar smiling confidently', angle: 'front' },
];
