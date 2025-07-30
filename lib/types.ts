
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  serviceType: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  experience?: string;
}

export interface GamePortfolioItem {
  id: string;
  name: string;
  description: string;
  gameUrl: string;
  imageUrl: string;
  visitCount: number;
  genre: string;
  launchDate: Date;
  isActive: boolean;
  // New fields for real Roblox data
  placeId?: string;
  universeId?: number;
  currentPlayers?: number;
  maxPlayers?: number;
  creator?: {
    id: number;
    name: string;
    type: string;
  };
}

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  imageUrl: string;
}

export interface StudioStats {
  totalProjects: number;
  activeProjects: number;
  totalVisits: number;
  totalActiveUsers: number; // Changed from developersRecruted
  successfulAcquisitions: number;
  clientSatisfaction: number;
}
