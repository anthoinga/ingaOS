import { Project, FilterQuery, ParsedFilter, ProjectMetadata } from '@/app/types';
import {
  FRAMEWORK_KEYWORDS,
  PLATFORM_KEYWORDS,
  SKILL_KEYWORDS,
  TOOL_KEYWORDS,
  YEAR_PATTERN
} from '@/app/data/filterPatterns';
import { column3Projects } from '@/app/data/projects';

// IDs of projects in column3 (where Spotify widget lives) - exclude from filters
const EXCLUDED_PROJECT_IDS = new Set(column3Projects.map(p => p.id));

export function parseQuery(queryString: string): FilterQuery {
  // Input validation
  if (typeof queryString !== 'string') {
    throw new Error('Invalid query type');
  }

  // Limit length (prevent DoS)
  if (queryString.length > 500) {
    queryString = queryString.slice(0, 500);
  }

  // Remove HTML tags (defense in depth)
  const sanitized = queryString.replace(/[<>]/g, '').trim();

  const normalized = sanitized.toLowerCase();
  const query: FilterQuery = { raw: sanitized };

  // Extract frameworks
  query.frameworks = extractMatches(normalized, FRAMEWORK_KEYWORDS);

  // Extract platforms
  query.platforms = extractMatches(normalized, PLATFORM_KEYWORDS);

  // Extract skills
  query.skills = extractMatches(normalized, SKILL_KEYWORDS);

  // Extract tools
  query.tools = extractMatches(normalized, TOOL_KEYWORDS);

  // Extract year
  const yearMatch = queryString.match(YEAR_PATTERN);
  if (yearMatch) query.year = yearMatch[0];

  return query;
}

function extractMatches(text: string, keywords: Record<string, string[]>): string[] {
  const matches: string[] = [];

  for (const [key, variations] of Object.entries(keywords)) {
    if (variations.some(v => text.includes(v))) {
      matches.push(key);
    }
  }

  return matches;
}

export function filterProjects(projects: Project[], query: FilterQuery): string[] {
  return projects
    .filter(project => !EXCLUDED_PROJECT_IDS.has(project.id)) // Exclude column3 projects
    .filter(project => matchesFilter(project.metadata, query))
    .map(p => p.id);
}

function matchesFilter(metadata: ProjectMetadata | undefined, query: FilterQuery): boolean {
  if (!metadata) return false;

  const hasAnyFilter =
    (query.frameworks?.length ?? 0) > 0 ||
    (query.platforms?.length ?? 0) > 0 ||
    (query.skills?.length ?? 0) > 0 ||
    (query.tools?.length ?? 0) > 0 ||
    !!query.year;

  if (!hasAnyFilter) return true;

  let matchCount = 0;
  let filterCount = 0;

  // Match any framework
  if (query.frameworks?.length && metadata.frameworks) {
    filterCount++;
    if (query.frameworks.some(f => metadata.frameworks?.includes(f))) {
      matchCount++;
    }
  }

  // Match any platform
  if (query.platforms?.length && metadata.platform) {
    filterCount++;
    if (query.platforms.some(p => metadata.platform?.includes(p))) {
      matchCount++;
    }
  }

  // Match any skill
  if (query.skills?.length && metadata.skills) {
    filterCount++;
    if (query.skills.some(s =>
      metadata.skills?.some(ms => ms.toLowerCase().includes(s.toLowerCase()))
    )) {
      matchCount++;
    }
  }

  // Match any tool
  if (query.tools?.length && metadata.tools) {
    filterCount++;
    if (query.tools.some(t => metadata.tools?.includes(t))) {
      matchCount++;
    }
  }

  // Match year
  if (query.year) {
    filterCount++;
    if (metadata.year === query.year) {
      matchCount++;
    }
  }

  // Return true if all filters matched
  return filterCount > 0 && matchCount === filterCount;
}

export function executeFilter(queryString: string, projects: Project[]): ParsedFilter {
  const query = parseQuery(queryString);
  const matchedProjects = filterProjects(projects, query);

  return {
    query,
    matchedProjects,
    totalMatches: matchedProjects.length,
  };
}
