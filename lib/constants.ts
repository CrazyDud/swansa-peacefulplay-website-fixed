
import { ServiceType, GamePortfolioItem, StudioStats } from './types';

export const STUDIO_STATS: StudioStats = {
  totalProjects: 10, // Updated to reflect actual game count
  activeProjects: 10,
  totalVisits: 64300000, // Sum of all game visits
  totalActiveUsers: 14150, // Sum of all CCU - will be calculated dynamically
  successfulAcquisitions: 8,
  clientSatisfaction: 98.5
};

export const SERVICES: ServiceType[] = [
  {
    id: 'game-development',
    title: 'Full-Cycle Development',
    description: 'End-to-end game creation from concept to post-launch support with specialized Roblox expertise.',
    icon: 'https://cdn.abacus.ai/images/fba068ea-6980-4950-a47e-0e55401102c5.png',
    features: [
      'Lua scripting & multiplayer systems',
      '3D/2D art & UI/UX design',
      'Quality assurance & optimization',
      'Marketing assets & sonic branding',
      'Post-launch live operations'
    ],
    imageUrl: 'https://cdn.abacus.ai/images/1a001df5-a936-44f9-a501-27d40739bea1.png'
  },
  {
    id: 'game-acquisition',
    title: 'Game Acquisition & Buyouts',
    description: 'Professional game valuation, M&A advisory, and complete acquisition services for Roblox experiences.',
    icon: 'https://cdn.abacus.ai/images/df33d468-9681-41fe-b31c-e57823fff55a.png',
    features: [
      'Game valuation & due diligence',
      'M&A advisory through expert networks',
      'Portfolio optimization strategies',
      'Legal & technical transfer support',
      'Post-acquisition integration'
    ],
    imageUrl: 'https://cdn.abacus.ai/images/77289df4-004c-41ed-a86a-7a6ee7590274.png'
  },
  {
    id: 'growth-services',
    title: 'Growth & Live Operations',
    description: 'Data-driven growth strategies, analytics, and live-ops services to maximize your game\'s potential.',
    icon: 'https://cdn.abacus.ai/images/94c67932-c6c5-42d3-88cd-4a3db6b77827.png',
    features: [
      'Analytics & business intelligence',
      'A/B testing & experimentation',
      'Content cadence optimization',
      'Community management',
      'Performance & engagement boost'
    ],
    imageUrl: 'https://cdn.abacus.ai/images/3c8d66ae-ca63-4000-9567-a4ef3eaa9a24.png'
  },
  {
    id: 'developer-recruitment',
    title: 'Developer Recruitment',
    description: 'Connect with top-tier Roblox talent across all specializations for your development needs.',
    icon: 'https://cdn.abacus.ai/images/9ae9dcd7-d61d-48d4-b99d-6460ea6c0352.png',
    features: [
      'Specialized Roblox developers',
      'UI/UX designers & 3D modellers',
      'Community management experts',
      'Marketing & growth specialists',
      'Project management professionals'
    ],
    imageUrl: 'https://cdn.abacus.ai/images/b4deed67-d9a9-452b-be4b-f551c88d5897.png'
  },
  {
    id: 'investment',
    title: 'Investment Opportunities',
    description: 'Strategic investment partnerships and funding solutions for high-potential Roblox experiences.',
    icon: 'https://cdn.abacus.ai/images/ab50bf65-34d6-4e9c-a2bf-bbecafa29c99.png',
    features: [
      'Strategic funding partnerships',
      'Revenue sharing models',
      'Performance-based investments',
      'Portfolio diversification',
      'Long-term growth support'
    ],
    imageUrl: 'https://cdn.abacus.ai/images/d1e1e475-1a6c-4965-935c-27990f9ee6ed.png'
  },
  {
    id: 'networking',
    title: 'Professional Networking',
    description: 'Connect with industry leaders, potential partners, and expand your presence in the Roblox ecosystem.',
    icon: 'https://cdn.abacus.ai/images/db331a22-7a2c-4709-98f2-c8c1659cb14a.png',
    features: [
      'Industry networking events',
      'Partnership facilitation',
      'Developer community access',
      'Mentorship programs',
      'Business development support'
    ],
    imageUrl: 'https://cdn.abacus.ai/images/497d83ba-fabc-4da6-bace-33fd6b02ac68.png'
  }
];

// Real games data is now fetched from /api/games endpoint

export const SOCIAL_LINKS = {
  discord: 'https://discord.gg/95FDGrcd',
  twitter: 'https://x.com/SwansaXPPlay',
  tiktok: 'https://www.tiktok.com/@imaginze8'
};

export const CONTACT_INFO = {
  email: 'slashingsimulator@gmail.com',
  responseTime: '24-48 hours'
};

// Individual Discord contacts
export const TEAM_CONTACTS = {
  technical: {
    name: 'murat_avtzi',
    role: 'PeacefulPlay - Technical Side',
    discord: 'murat_avtzi'
  },
  creative: {
    name: 'cenastarite', 
    role: 'SwansInteractives - Creative Side',
    discord: 'cenastarite'
  }
};

// Company positioning
export const COMPANY_INFO = {
  swansa: {
    name: 'Swansa',
    role: 'Creative Powerhouse',
    description: 'The creative force behind captivating game experiences, innovative design concepts, and compelling player engagement strategies.',
    focus: 'Art Direction, Game Design, User Experience, Creative Vision'
  },
  peacefulplay: {
    name: 'PeacefulPlay',
    role: 'Technical Excellence',
    description: 'The technical backbone delivering robust systems, scalable architecture, and cutting-edge development solutions.',
    focus: 'Backend Systems, Performance Optimization, Technical Architecture, Development Infrastructure'
  }
};
