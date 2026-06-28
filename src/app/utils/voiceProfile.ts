import { VoiceProfile } from '@/app/types';

export function parseVoiceProfile(markdown: string): VoiceProfile {
  const lines = markdown.split('\n');

  const personality: string[] = [];
  const tone: string[] = [];
  const responsePatterns = {
    greeting: [] as string[],
    results: [] as string[],
    noResults: [] as string[],
    clarification: [] as string[],
  };

  let currentSection: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect sections
    if (trimmed === '## Personality Traits') {
      currentSection = 'personality';
      continue;
    } else if (trimmed === '## Tone Guidelines') {
      currentSection = 'tone';
      continue;
    } else if (trimmed === '### When showing filtered results:') {
      currentSection = 'results';
      continue;
    } else if (trimmed === '### When no matches found:') {
      currentSection = 'noResults';
      continue;
    } else if (trimmed === '### When showing all projects:') {
      currentSection = 'greeting';
      continue;
    } else if (trimmed === '### Clarification:') {
      currentSection = 'clarification';
      continue;
    }

    // Parse bullet points
    if (trimmed.startsWith('- ') && trimmed.length > 2) {
      const content = trimmed.substring(2);

      if (currentSection === 'personality') {
        personality.push(content);
      } else if (currentSection === 'tone') {
        tone.push(content);
      } else if (currentSection === 'results') {
        responsePatterns.results.push(content);
      } else if (currentSection === 'noResults') {
        responsePatterns.noResults.push(content);
      } else if (currentSection === 'greeting') {
        responsePatterns.greeting.push(content);
      } else if (currentSection === 'clarification') {
        responsePatterns.clarification.push(content);
      }
    }
  }

  return {
    personality,
    tone,
    responsePatterns,
  };
}

export function getResponseTemplate(
  profile: VoiceProfile,
  type: 'results' | 'noResults' | 'greeting' | 'clarification'
): string {
  const templates = profile.responsePatterns[type];

  if (templates.length === 0) {
    return 'No template available.';
  }

  // Select random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}
