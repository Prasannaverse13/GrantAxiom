export type ClaimStatus = 'verified' | 'warning' | 'contradiction';

export interface Reference {
  id: string;
  title: string;
  authors: string;
  year: number;
  contentSnippet: string; // Simulating the parsed PDF text
}

export interface Claim {
  id: string;
  text: string;
  status: ClaimStatus;
  confidence: number;
  sourceId?: string;
  explanation: string;
  suggestion?: string;
}

export interface SimulationState {
  isActive: boolean;
  type: 'double-slit' | 'none';
  params: {
    slitSeparation: number;
    wavelength: number;
    screenDistance: number;
  };
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface AnalysisReport {
  overallScore: number;
  claims: Claim[];
  complianceIssues: string[];
  toneAnalysis: string;
}

export const MOCK_PROPOSAL = `
Title: Investigating Wave-Particle Duality in Macroscopic Systems

Abstract:
This proposal seeks funding to develop a new apparatus for demonstrating quantum interference at the macroscopic scale. 
Our preliminary data suggests that photon coherence can be maintained over distances exceeding 50 meters in open air, a finding that contradicts the standard decoherence models proposed by Smith et al. (2019). 
We aim to construct a scalable Double Slit setup that can be used for both high-precision measurement and educational outreach. 
Furthermore, we assert that the fringe visibility remains constant regardless of slit width, which simplifies the manufacturing process.
`.trim();

export const MOCK_REFERENCES: Reference[] = [
  {
    id: 'ref-1',
    title: 'Decoherence Limits in Open Air Quantum Systems',
    authors: 'Smith, J., Doe, A.',
    year: 2019,
    contentSnippet: 'Our models predict rapid decoherence of photon states in open air beyond 10 meters due to atmospheric scattering. Coherence beyond this range requires vacuum conditions.'
  },
  {
    id: 'ref-2',
    title: 'Optics and Interference Patterns',
    authors: 'Young, T.',
    year: 1801,
    contentSnippet: 'The intensity of the interference pattern is strictly dependent on the ratio of slit width to wavelength. Changing slit width dramatically alters fringe visibility and the envelope of the diffraction pattern.'
  }
];
