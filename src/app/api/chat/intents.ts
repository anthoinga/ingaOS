// Intent detection framework for intelligent routing

export type Intent =
  | 'greeting'
  | 'technology_inquiry'
  | 'process_methodology'
  | 'project_specific'
  | 'capability_browse'
  | 'elaboration'
  | 'comparison'
  | 'unknown';

interface IntentPattern {
  intent: Intent;
  triggers: string[];
  response_style: string;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'greeting',
    triggers: ['hi', 'hello', 'hey', 'sup', 'greetings'],
    response_style: 'casual_direct'
  },
  {
    intent: 'technology_inquiry',
    triggers: ['react', 'typescript', 'javascript', 'next', 'node', 'css', 'html', 'framework', 'library', 'tech stack'],
    response_style: 'experience_based'
  },
  {
    intent: 'process_methodology',
    triggers: ['process', 'approach', 'methodology', 'philosophy', 'how do you', 'strategy', 'thinking'],
    response_style: 'principle_based'
  },
  {
    intent: 'project_specific',
    triggers: ['7eleven', '7-eleven', 'curbside', 'project', 'built', 'worked on'],
    response_style: 'project_reference'
  },
  {
    intent: 'capability_browse',
    triggers: ['show me', 'what have you', 'your work', 'portfolio', 'examples'],
    response_style: 'overview'
  },
  {
    intent: 'elaboration',
    triggers: ['tell me more', 'elaborate', 'explain further', 'go on', 'continue'],
    response_style: 'deeper_context'
  },
  {
    intent: 'comparison',
    triggers: ['vs', 'versus', 'compare', 'difference between', 'better than'],
    response_style: 'analytical'
  }
];

export function detectIntent(query: string): Intent {
  const lowerQuery = query.toLowerCase().trim();

  // Check for exact matches first
  for (const pattern of INTENT_PATTERNS) {
    if (pattern.triggers.some(trigger => lowerQuery.includes(trigger))) {
      return pattern.intent;
    }
  }

  return 'unknown';
}

export function getResponseGuidance(intent: Intent, hasProjectContext: boolean): string {
  switch (intent) {
    case 'greeting':
      return `ULTRA BRIEF. Maximum 10 words. Example: "Hey. Design engineer. Build web apps." STOP THERE. Do NOT add examples or tech names.`;

    case 'technology_inquiry':
      if (hasProjectContext) {
        return `Reference actual projects. "Used X on Y project for Z." ONE sentence. STOP.`;
      }
      return `"Used it on past work. Good for [specific use case]." 20-30 words TOTAL. Don't explain the tech.`;

    case 'process_methodology':
      return `Share actual approach to DESIGN/PROCESS, not tech specifics. Use "I" and "we". Example: "I start by understanding constraints. Sketch fast. Test with users. Iterate." Focus on methodology, NOT which frameworks you use.`;

    case 'project_specific':
      if (hasProjectContext) {
        return `Reference ONLY the project details explicitly provided in context. Don't elaborate beyond what's given. If minimal info: "Worked on X. Used Y tech." Then STOP.`;
      }
      return `NO PROJECT CONTEXT: Stay extremely vague or deflect. Examples: "That was past work" or "Worked on that previously, mostly focused on frontend." NO invented details.`;

    case 'capability_browse':
      return `Give a brief overview without listing everything. Example: "Built web apps for e-commerce, internal tools, and mobile experiences. Check out the projects section to see specifics." Stay general, don't inventory every skill.`;

    case 'elaboration':
      return `They want more depth. Add one specific detail or tradeoff. Example: "The tradeoff was speed vs flexibility. We chose speed."`;

    case 'comparison':
      return `Compare directly. Example: "React for complex UIs. Vue for simpler projects. Both work, different tradeoffs."`;

    case 'unknown':
      return `Interpret the query generously. If unsure, respond to the likely intent. Keep it conversational. Don't say "I don't understand."`;
  }
}

export function getSystemPromptEnhancement(intent: Intent): string {
  const baseEnhancement = `
INTENT DETECTED: ${intent.toUpperCase()}

CRITICAL ANTI-HALLUCINATION RULES:
- ONLY reference projects explicitly provided in context
- If no project context: speak generally or say "past project"
- NEVER invent specific features, dates, or details
- If uncertain: be vague rather than make things up
- Examples: "worked on X" NOT "built a comprehensive platform with Y and Z features"

HUMAN-SOUNDING RULES:
- NO: "Sure, I can help with that" or "Let me explain"
- NO: "As a [role], I..."
- YES: Direct answers. "React's component model fits how I think."
- YES: Contractions, fragments, em dashes
- Drop the AI assistant tone completely
`;

  return baseEnhancement;
}
