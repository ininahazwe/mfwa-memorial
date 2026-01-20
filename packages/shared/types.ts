// packages/shared/types.ts
// Types partagés entre le site public et le panneau admin

export interface Journalist {
  id: string;
  name: string;
  countryId: string;
  countryName?: string;
  role: string;
  yearOfDeath: number;
  photoUrl: string;
  bio?: string;
  placeOfDeath?: string;
  circumstances?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2 (ex: "ML" pour Mali)
  coords: {
    lat: number;
    lng: number;
  };
  description: string;
  riskLevel: 'high' | 'critical' | 'extreme';
  journalistCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type RiskLevel = Country['riskLevel'];

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  high: 'Élevé',
  critical: 'Critique',
  extreme: 'Extrême',
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  high: '#c4a77d',
  critical: '#d4845f',
  extreme: '#a65d57',
};
