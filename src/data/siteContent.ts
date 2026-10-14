export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'strava' | 'email';
};

export type Project = {
  title: string;
  season: string;
  shortDescription: string;
  details: string;
  impact: string;
  tags: string[];
  linkLabel: string;
  linkHref: string;
};

export type WorkExperience = {
  title: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type ToolGroup = {
  category: string;
  tools: string[];
};

export type Certification = {
  title: string;
  issuer: string;
  year: string;
  details: string;
};

export const profile = {
  name: 'Nikhil Menon',
  headline: 'CS + Math builder | runner, climber, hiker, and sports-leaning problem solver',
  summary:
    'I build software with the mindset of training for a long race: steady, focused, and relentlessly curious about what makes great products work.',
  location: 'Bay Area, CA',
  resumeHref: '/nikhil-menon-resume.txt'
} as const;

export const quotePool = [
  'Build systems that outlast hype and still move people forward.',
  'The best products feel obvious after they work, not before they launch.',
  'Curiosity is just discipline with a better story.',
  'I like to design for momentum, not just elegance.'
];

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/nmenon1215', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikhilmenon1215', icon: 'linkedin' },
  { label: 'Strava', href: 'https://www.strava.com/athletes/37335837', icon: 'strava' },
  { label: 'Email', href: 'mailto:menon.nik@northeastern.edu', icon: 'email' }
];

export const featuredProjects: Project[] = [
  {
    title: 'GameNite Tavern',
    season: 'Spring 2026',
    shortDescription: 'Real-time multiplayer platform with live spectating, DMs, and ranked progression.',
    details:
      'Built to feel fast and social, this project combines optimistic rendering, private lobbies, and community features into a single game-night hub.',
    impact: 'Real-time systems, multiplayer UX, and ELO-driven progression tuned for competitive play.',
    tags: ['React', 'TypeScript', 'Realtime', 'Ranking'],
    linkLabel: 'Explore the build',
    linkHref: 'https://example.com/'
  },
  {
    title: 'Generative AI for Climbing Routes',
    season: 'Nov 2022 - Present',
    shortDescription: 'Research and model work predicting climb grades on standardized walls.',
    details:
      'This project pairs climbing intuition with machine learning, using PyTorch and classical models to study route grading patterns.',
    impact: 'A strong bridge between athletics, research, and applied AI.',
    tags: ['PyTorch', 'ML', 'Research', 'Climbing'],
    linkLabel: 'Read more',
    linkHref: 'https://example.com/'
  },
  {
    title: 'Proof Fintech Co-op',
    season: 'Jul 2025 - Dec 2025',
    shortDescription: 'Full-stack orchestration of instant payouts, analytics, and fraud alerting.',
    details:
      'Led the workflow around Stripe-powered payouts and helped drive Visa Fast Track enrollment and Visa Direct integration.',
    impact: 'Scaled transactional data flows while improving product usability and reducing repeat signer entry time.',
    tags: ['Ruby', 'React', 'Fintech', 'Payments'],
    linkLabel: 'See impact notes',
    linkHref: 'https://example.com/'
  }
];

export const workExperience: WorkExperience[] = [
  {
    title: 'Software Engineer Co-op',
    company: 'Proof',
    period: 'Jul 2025 – Dec 2025',
    summary: 'Built product experiences and systems that move money and trust quickly across user flows.',
    highlights: [
      'Ship full-stack improvements around payout orchestration and customer-facing workflows.',
      'Partnered across product and backend teams to reduce friction in onboarding and transaction monitoring.',
      'Messaged technical tradeoffs clearly so stakeholders could move quickly without sacrificing reliability.'
    ]
  },
  {
    title: 'Research + Product Intern',
    company: 'Research Lab',
    period: 'Jan 2024 – Jun 2025',
    summary: 'Explored applied ML ideas in sport and decision-support systems with a practical product lens.',
    highlights: [
      'Built exploratory models and prototypes to test how data can improve performance and user decision-making.',
      'Turned abstract research questions into proof-of-concept tools that stakeholders could reason about quickly.',
      'Combined technical depth with communication skills to bridge research and product priorities.'
    ]
  }
];

export const toolGroups: ToolGroup[] = [
  {
    category: 'Languages',
    tools: ['TypeScript', 'Python', 'JavaScript', 'SQL', 'Ruby', 'C++', 'Java']
  },
  {
    category: 'Frontend',
    tools: ['React', 'Vite', 'CSS', 'HTML', 'Tailwind', 'Next.js']
  },
  {
    category: 'Backend',
    tools: ['Node.js', 'Express', 'Flask', 'PostgreSQL', 'REST APIs', 'Auth']
  },
  {
    category: 'Data & ML',
    tools: ['PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'Scikit-learn', 'Feature Engineering']
  },
  {
    category: 'Product & Tools',
    tools: ['Git', 'Figma', 'Notion', 'Stripe', 'Google Cloud', 'VS Code']
  }
];

export const certifications: Certification[] = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    year: '2025',
    details: 'Foundational cloud knowledge across AWS core services, security, and architecture principles.'
  },
  {
    title: 'Google Data Analytics Certificate',
    issuer: 'Google',
    year: '2024',
    details: 'Hands-on experience with SQL, spreadsheets, data cleaning, and dashboard-driven storytelling.'
  },
  {
    title: 'Machine Learning Specialization',
    issuer: 'Coursera / Stanford',
    year: '2023',
    details: 'Practical understanding of supervised learning, model evaluation, and applied ML workflows.'
  }
];
