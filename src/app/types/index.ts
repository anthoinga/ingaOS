export type TileSize = 'large' | 'small';

export interface ProjectMetadata {
  frameworks?: string[];
  tools?: string[];
  platform?: string[];
  skills?: string[];
  projectType?: string;
  year?: string;
}

export interface ProjectContext {
  client?: string;
  industry?: string;
  category?: string;
  role?: string;
  team?: string;
  engagement?: string;
  projectName?: string;
  challenge?: string;
  prompt?: string;
  approach?: string;
  outcome?: string;
  scope?: string[];
  experiences?: string[];
  awards?: boolean;
  notes?: string;
}

export interface Project {
  id: string;
  size: TileSize;
  imageUrl: string;
  imageAlt: string;
  url: string;
  header?: string;
  category?: string;
  title?: string;
  location?: string;
  date?: string;
  metadata?: ProjectMetadata;
  context?: ProjectContext;
}

export interface Track {
  id: number;
  title: string;
  duration: string;
}

export interface NowPlaying {
  albumName: string;
  artistName: string;
  albumArt: string;
  currentTime: string;
  remainingTime: string;
  tracks: Track[];
  gradientColor: string;
}

export interface HeaderInfo {
  name: string;
  title?: string;
  location: string;
  onReset?: () => void;
}

export interface FooterInfo {
  name: string;
  copyright: string;
  tagline: string;
}

export interface FilterQuery {
  raw: string;
  frameworks?: string[];
  platforms?: string[];
  skills?: string[];
  tools?: string[];
  projectType?: string;
  year?: string;
}

export interface ParsedFilter {
  query: FilterQuery;
  matchedProjects: string[];
  totalMatches: number;
}

export interface FilterResult extends ParsedFilter {
  response: string;
  voiceProfile: VoiceProfile;
}

export interface ResponsePattern {
  triggers: string[];
  templates: string[];
}

export interface VoiceProfile {
  personality: string[];
  tone: string[];
  responsePatterns: {
    greeting: string[];
    results: string[];
    noResults: string[];
    clarification: string[];
  };
  intentPatterns?: {
    process?: ResponsePattern;
    problemFraming?: ResponsePattern;
    constraints?: ResponsePattern;
    collaboration?: ResponsePattern;
    failures?: ResponsePattern;
    techStack?: ResponsePattern;
    context?: {
      enterprise?: ResponsePattern;
      consumer?: ResponsePattern;
      startup?: ResponsePattern;
      scale?: ResponsePattern;
    };
  };
}

// AI Chat API Types
export interface ChatRequest {
  query: string;
  language: 'en' | 'es';
  matchedProjects: Project[];
  allProjectsCount: number;
}

export interface ChatResponse {
  response: string;
  model: string; // 'haiku' or 'sonnet'
  tokensUsed?: number;
}
