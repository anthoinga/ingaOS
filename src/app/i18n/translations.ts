export type Language = 'en' | 'es';

export interface Translations {
  // Header
  location: string;

  // Footer
  copyright: string;
  tagline: string;

  // Chat Interface
  chatPlaceholder: string;
  chatLanguageToggle: string;
  email: string;
  linkedin: string;
  copied: string;

  // Project metadata labels
  frameworks: string;
  tools: string;
  platform: string;
  skills: string;
  year: string;

  // Response messages
  noResults: string;
  errorMessage: string;

  // AI Response templates
  responses: {
    greeting: string[];
    results: string[];
    noResults: string[];
    clarification: string[];
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    location: 'TEXAS',

    // Footer
    copyright: 'Copyright 2026',
    tagline: '🇵🇪 HECHO EN PERU',

    // Chat Interface
    chatPlaceholder: 'Ask about my experiences...',
    chatLanguageToggle: 'ES',
    email: 'Email',
    linkedin: 'LinkedIn',
    copied: 'Copied!',

    // Project metadata labels
    frameworks: 'Frameworks',
    tools: 'Tools',
    platform: 'Platform',
    skills: 'Skills',
    year: 'Year',

    // Response messages
    noResults: 'No projects found matching your query.',
    errorMessage: 'Sorry, something went wrong. Please try again.',

    // AI Response templates
    responses: {
      greeting: [
        "{count} projects across {range}. Some I'm proud of, some taught me what not to do. What problems are you trying to solve?",
        "Built {count} things. Mix of shipped work and experiments. Happy to walk through what worked and what I'd rebuild.",
        "{count} projects here — enterprise tools, consumer apps, infrastructure work. What context are you hiring for?",
      ],
      results: [
        "Found {count} {technology} projects. {highlight} had the most interesting constraints — worth checking out.",
        "{count} builds with {technology}. {highlight} is where I learned what works and what doesn't.",
        "Showing {count} {technology} projects. {highlight} demonstrates how I approach problems in this space.",
      ],
      noResults: [
        "Haven't tackled {technology} directly yet. Closest would be adjacent work where I solved similar problems. Want to see that?",
        "Don't have {technology} examples, but I've solved similar problems with different tools. The approach matters more than the stack.",
      ],
      clarification: [
        "What kind of problem are you trying to solve? B2B complexity, consumer growth, early validation?",
        "Are you asking about how I approach that generally, or want to see a specific example?",
        "That could mean a few things — are you thinking about technical constraints, user research, or team collaboration?",
      ],
    },
  },

  es: {
    // Header
    location: 'TEXAS',

    // Footer
    copyright: 'Derechos Reservados 2026',
    tagline: '🇵🇪 HECHO EN PERU',

    // Chat Interface
    chatPlaceholder: 'Pregunta sobre mis experiencias...',
    chatLanguageToggle: 'EN',
    email: 'Correo',
    linkedin: 'LinkedIn',
    copied: '¡Copiado!',

    // Project metadata labels
    frameworks: 'Frameworks',
    tools: 'Herramientas',
    platform: 'Plataforma',
    skills: 'Habilidades',
    year: 'Año',

    // Response messages
    noResults: 'No se encontraron proyectos que coincidan con tu búsqueda.',
    errorMessage: 'Lo siento, algo salió mal. Por favor, inténtalo de nuevo.',

    // AI Response templates
    responses: {
      greeting: [
        "{count} proyectos en {range}. Algunos de los que estoy orgulloso, otros me enseñaron qué no hacer. ¿Qué problemas buscas resolver?",
        "Construí {count} cosas. Mezcla de trabajo enviado y experimentos. Feliz de explicar qué funcionó y qué reconstruiría.",
        "{count} proyectos aquí — herramientas empresariales, aplicaciones de consumo, infraestructura. ¿Para qué contexto estás contratando?",
      ],
      results: [
        "Encontré {count} proyectos con {technology}. {highlight} tuvo las restricciones más interesantes — vale la pena revisarlo.",
        "{count} construcciones con {technology}. {highlight} es donde aprendí qué funciona y qué no.",
        "Mostrando {count} proyectos de {technology}. {highlight} demuestra cómo abordo problemas en este espacio.",
      ],
      noResults: [
        "Aún no he trabajado directamente con {technology}. Lo más cercano sería trabajo adyacente donde resolví problemas similares. ¿Quieres ver eso?",
        "No tengo ejemplos de {technology}, pero he resuelto problemas similares con diferentes herramientas. El enfoque importa más que el stack.",
      ],
      clarification: [
        "¿Qué tipo de problema intentas resolver? ¿Complejidad B2B, crecimiento de consumidor, validación temprana?",
        "¿Preguntas sobre cómo abordo eso en general, o quieres ver un ejemplo específico?",
        "Eso podría significar varias cosas — ¿estás pensando en restricciones técnicas, investigación de usuarios o colaboración en equipo?",
      ],
    },
  },
};

export function getTranslation(lang: Language, key: keyof Omit<Translations, 'responses'>): string {
  return translations[lang][key] as string;
}
