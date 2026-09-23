export const site = {
  name: 'Farsith Fawzer',
  title: 'Software Developer',
  location: 'Colombo, Sri Lanka',
  email: 'mohammed.farsith@gmail.com',
  github: 'https://github.com/ff786',
  linkedin: 'https://www.linkedin.com/in/farsith-fawzer-b7051120',
};

export const stack: [string, string][] = [
  ['React', 'Component-driven interfaces.'], ['Next.js', 'Modern application architecture.'],
  ['TypeScript', 'Typed, maintainable frontend systems.'], ['Java', 'Backend application development.'],
  ['Spring Boot', 'REST APIs and business services.'], ['Python', 'Application and ML workflows.'],
  ['PostgreSQL', 'Structured relational data systems.'], ['MySQL', 'Relational application data.'],
  ['MongoDB', 'Document-oriented data models.'], ['Firebase', 'Application services and data.'],
  ['Docker', 'Consistent development environments.'], ['Git', 'Version control and collaboration.'],
  ['Tailwind CSS', 'Responsive UI systems.'], ['Vite', 'Fast frontend tooling.'],
  ['JWT', 'Token-based authentication.'], ['JPA / Hibernate', 'Java persistence.'],
  ['Flyway', 'Database migration workflows.'], ['MediaPipe', 'Landmark and vision processing.'],
  ['LSTM', 'Sequence-model experimentation.'], ['Random Forest', 'Classical ML workflows.']
];

export const projects = [
  { id:'01', title:'Mynix POS', subtitle:'Full-Stack Point-of-Sale & Inventory Management System', tech:'React 19 · Java 21 · Spring Boot · PostgreSQL · JWT · Tailwind CSS', description:'A full-stack POS platform covering authentication, role-based access, checkout, products, inventory, customers, sales history, reporting and settings.', contribution:'Built across frontend workflows, backend services, authentication, persistence and business features including barcode/label printing and thermal receipts.', tone:'blue', github: null, live: null },
  { id:'02', title:'Cosmalac', subtitle:'Luxury Skincare E-commerce Experience', tech:'React · JavaScript · Tailwind CSS · Framer Motion', description:'A production-oriented skincare and cosmetics e-commerce experience focused on responsive UI, product presentation and customer interaction.', contribution:'Worked across storefront UI, product/cart interactions, legal and privacy surfaces, cookie consent, SEO and anti-spam protections.', tone:'cream', github: null, live: null },
  { id:'03', title:'Mintro Labs', subtitle:'Digital Agency Platform', tech:'Next.js · React · TypeScript · Tailwind CSS · Framer Motion', description:'A modern digital agency platform presenting software development, web, mobile, business systems and AI-oriented services.', contribution:'Built responsive interfaces, reusable components, interactive sections and motion-driven presentation.', tone:'violet', github: null, live: null },
  { id:'04', title:'SignSight', subtitle:'Tamil Sign Language Recognition & Learning Platform', tech:'React · Python · MediaPipe · LSTM · Random Forest · SQL', description:'An accessibility-focused research project exploring Tamil Sign Language conversion and recognition.', contribution:'Frontend ownership across the platform and the Audio/Video-to-TSL conversion component, connecting user input with ML-assisted sign output.', tone:'green', github: null, live: null },
  { id:'05', title:'TrackTidy', subtitle:'Home Inventory & Management System', tech:'React · Tailwind CSS · Firebase', description:'A smart home management application for household inventory, groceries, essentials and maintenance scheduling.', contribution:'Frontend development with responsive React interfaces and Firebase-backed application flows.', tone:'amber', github: null, live: null },
];
