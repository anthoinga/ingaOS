import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from './systemPrompt';
import { Project } from '@/app/types';
import { detectIntent, getResponseGuidance, getSystemPromptEnhancement } from './intents';

// Force dynamic rendering (required for rate limiting with request headers)
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Rate limiting: in-memory map (simple, no Redis needed)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Conversation memory: track last 2 responses per IP to avoid repetition
const conversationMemory = new Map<string, string[]>();

function addToMemory(ip: string, response: string) {
  const memory = conversationMemory.get(ip) || [];
  memory.push(response);

  // Keep only last 2 responses
  if (memory.length > 2) {
    memory.shift();
  }

  conversationMemory.set(ip, memory);
}

function getRecentResponses(ip: string): string {
  const memory = conversationMemory.get(ip) || [];
  if (memory.length === 0) return '';

  return `\n\nYOUR LAST ${memory.length} RESPONSE(S) TO THIS USER:\n${memory.map((r, i) => `${i + 1}. "${r}"`).join('\n')}\n\nCRITICAL: DO NOT repeat the same examples, tech mentions, or phrasing patterns from above. Vary your language and examples.`;
}

function rateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old rate limit records and conversation memory every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  });

  // Clear conversation memory after 5 minutes of inactivity
  conversationMemory.clear();
}, 5 * 60 * 1000);

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Invalid input type');
  }

  // Limit length (prevent DoS)
  if (input.length > 500) {
    input = input.slice(0, 500);
  }

  // Remove HTML tags (defense in depth)
  return input.replace(/[<>]/g, '').trim();
}

function isComplexQuery(query: string): boolean {
  // Triggers that indicate need for deeper reasoning (Sonnet)
  const complexTriggers = [
    'process',
    'approach',
    'methodology',
    'philosophy',
    'strategy',
    'why',
    'how do you',
    'how did you',
    'tell me about',
    'explain',
    'what made you',
    'thinking',
    'compare',
    'difference between',
    'deep dive',
    'in detail',
    'walk me through',
  ];

  const lowerQuery = query.toLowerCase();

  // Check for complex triggers
  const hasComplexTrigger = complexTriggers.some(trigger => lowerQuery.includes(trigger));

  // Also consider length - very short queries are usually simple
  const isShort = query.trim().split(' ').length <= 3;

  return hasComplexTrigger && !isShort;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const { query, language = 'en', matchedProjects = [], allProjectsCount = 0 } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeInput(query);

    // Detect intent for intelligent routing
    const intent = detectIntent(sanitizedQuery);
    const hasProjectContext = matchedProjects && matchedProjects.length > 0;

    // Hybrid approach: Haiku with variable tokens based on complexity
    const isComplex = isComplexQuery(sanitizedQuery);
    const model = 'claude-3-haiku-20240307';
    const maxTokens = isComplex ? 300 : 200;

    // Build intent-aware system prompt with conversation memory
    const responseGuidance = getResponseGuidance(intent, hasProjectContext);
    const intentEnhancement = getSystemPromptEnhancement(intent);
    const recentResponses = getRecentResponses(ip);
    const systemPrompt = buildSystemPrompt(
      language as 'en' | 'es',
      matchedProjects as Project[],
      responseGuidance,
      intentEnhancement + recentResponses
    );

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: sanitizedQuery,
        },
      ],
    });

    // Extract response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Sorry, I could not generate a response.';

    // Store response in conversation memory to avoid repetition
    addToMemory(ip, responseText);

    return NextResponse.json({
      response: responseText,
      model: isComplex ? 'haiku-extended' : 'haiku',  // Indicate token allocation
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    });

  } catch (error: any) {
    console.error('AI API error:', error);

    // Sanitize error message (don't leak API details)
    const errorMessage = error?.message?.includes('API key')
      ? 'AI service temporarily unavailable'
      : 'Unable to process request';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
