
export interface Lead {
  id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  potentialScore: number;
  contactSuggestions: string[];
  location: string;
  email?: string;
  phone?: string;
  latitude?: number; // Adicionado para o mapa
  longitude?: number; // Adicionado para o mapa
  recentNews?: { title: string; url: string }[];
}

export interface SearchParams {
  niche: string;
  location: string;
  companySize?: string;
  intent?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
