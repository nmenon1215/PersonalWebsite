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

export const profile = {
  name: 'Nikhil Menon',
  headline: 'CS + Math builder | runner, climber, hiker, and sports-leaning problem solver',
  summary:
    'I build software with the mindset of training for a long race: steady, focused, and a little obsessed with craft.',
  location: 'Bay Area, CA',
  resumeHref: '/nikhil-menon-resume.txt'
} as const;

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'Strava', href: 'https://www.strava.com/', icon: 'strava' },
  { label: 'Email', href: 'mailto:nikhil@example.com', icon: 'email' }
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
