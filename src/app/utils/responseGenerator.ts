import { ParsedFilter, FilterResult, Project, FilterQuery } from '@/app/types';
import { getResponseTemplate } from './voiceProfile';
import { voiceProfile } from '@/app/data/voiceProfile';
import { translations, Language } from '@/app/i18n/translations';

type IntentType = 'process' | 'problemFraming' | 'constraints' | 'collaboration' | 'failures' | 'techStack' | 'context';

export function generateFilterResponse(
  filter: ParsedFilter,
  allProjects: Project[],
  language: Language = 'en'
): FilterResult {
  const profile = voiceProfile;
  const queryLower = filter.query.raw.toLowerCase();
  const t = translations[language];

  // First check for intent-based queries
  const intent = detectIntent(queryLower, profile);

  let response: string;

  if (intent) {
    // Use intent-based response
    response = generateIntentResponse(intent, queryLower, filter, allProjects);
  } else if (filter.totalMatches === 0) {
    // No matches - use language-aware noResults template
    const templates = t.responses.noResults;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const tech = extractQueryTech(filter.query);
    response = template.replace('{technology}', tech);
  } else if (filter.totalMatches === allProjects.length) {
    // Showing all projects - use language-aware greeting template
    const templates = t.responses.greeting;
    const template = templates[Math.floor(Math.random() * templates.length)];
    response = template
      .replace('{count}', filter.totalMatches.toString())
      .replace('{range}', getProjectRange(allProjects));
  } else {
    // Has matches - use language-aware results template
    const templates = t.responses.results;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const tech = extractQueryTech(filter.query);
    const highlight = getHighlightProject(filter.matchedProjects, allProjects);

    response = template
      .replace('{count}', filter.totalMatches.toString())
      .replace('{technology}', tech)
      .replace('{highlight}', highlight?.title || 'one of them');
  }

  return {
    ...filter,
    response,
    voiceProfile: profile,
  };
}

function detectIntent(query: string, profile: typeof voiceProfile): { type: IntentType; subtype?: string } | null {
  if (!profile.intentPatterns) return null;

  // Check context-specific intents first (more specific)
  if (profile.intentPatterns.context) {
    const contextTypes = ['enterprise', 'consumer', 'startup', 'scale'] as const;
    for (const contextType of contextTypes) {
      const pattern = profile.intentPatterns.context[contextType];
      if (pattern?.triggers.some(trigger => query.includes(trigger))) {
        return { type: 'context', subtype: contextType };
      }
    }
  }

  // Check general intents
  const intentTypes: Array<keyof typeof profile.intentPatterns> = [
    'process', 'problemFraming', 'constraints', 'collaboration', 'failures', 'techStack'
  ];

  for (const intentType of intentTypes) {
    const pattern = profile.intentPatterns[intentType];
    if (pattern && 'triggers' in pattern && pattern.triggers.some(trigger => query.includes(trigger))) {
      return { type: intentType as IntentType };
    }
  }

  return null;
}

function generateIntentResponse(
  intent: { type: IntentType; subtype?: string },
  query: string,
  filter: ParsedFilter,
  allProjects: Project[]
): string {
  const profile = voiceProfile;

  let templates: string[] = [];

  if (intent.type === 'context' && intent.subtype && profile.intentPatterns?.context) {
    const contextPattern = profile.intentPatterns.context[intent.subtype as keyof typeof profile.intentPatterns.context];
    templates = contextPattern?.templates || [];
  } else if (intent.type !== 'context' && profile.intentPatterns) {
    const pattern = profile.intentPatterns[intent.type];
    templates = pattern?.templates || [];
  }

  if (templates.length === 0) {
    return "Interesting question. Let me show you relevant work.";
  }

  // Pick random template
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Replace variables
  const highlight = getHighlightProject(filter.matchedProjects, allProjects);
  const tech = extractQueryTech(filter.query);

  return template
    .replace('{project}', highlight?.title || 'one project')
    .replace('{other_project}', getAlternateProject(highlight?.id, allProjects)?.title || 'another project')
    .replace('{count}', filter.totalMatches.toString())
    .replace('{technology}', tech)
    .replace('{highlight}', highlight?.title || 'one of them');
}

function extractQueryTech(query: FilterQuery): string {
  const parts: string[] = [];

  if (query.frameworks?.length) parts.push(...query.frameworks);
  if (query.platforms?.length) parts.push(...query.platforms);
  if (query.skills?.length) parts.push(...query.skills);
  if (query.tools?.length) parts.push(...query.tools);
  if (query.year) parts.push(query.year);

  return parts.join(' & ') || 'that';
}

function getHighlightProject(ids: string[], projects: Project[]): Project | undefined {
  // Return the first matched project
  return projects.find(p => ids.includes(p.id));
}

function getAlternateProject(excludeId: string | undefined, projects: Project[]): Project | undefined {
  // Return a different project for contrast
  return projects.find(p => p.id !== excludeId);
}

function getProjectRange(projects: Project[]): string {
  const types = new Set<string>();

  projects.forEach(project => {
    if (project.metadata?.projectType) {
      types.add(project.metadata.projectType.toLowerCase());
    }
  });

  const typeArray = Array.from(types);

  if (typeArray.length === 0) return 'various projects';
  if (typeArray.length === 1) return typeArray[0];
  if (typeArray.length === 2) return `${typeArray[0]} to ${typeArray[1]}`;

  return `${typeArray[0]} to ${typeArray[typeArray.length - 1]}`;
}
