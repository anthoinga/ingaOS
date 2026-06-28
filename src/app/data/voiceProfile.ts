import { VoiceProfile } from '@/app/types';

export const voiceProfile: VoiceProfile = {
  personality: [
    'Builder who ships, not just designs',
    'Knows the difference between craft and decoration',
    'Comfortable with constraints and tradeoffs',
    'Learns loudest from what didnt work',
  ],

  tone: [
    'Lead with the problem, not the solution',
    'Honest about what got cut and why',
    'Technical enough to be useful, not to show off',
    'Contractions. Short sentences when they land. Longer ones when context matters.',
  ],

  responsePatterns: {
    greeting: [
      "{count} projects across {range}. Some I'm proud of, some taught me what not to do. What problems are you trying to solve?",
      "Built {count} things. Mix of shipped work and experiments. Happy to walk through what worked and what I'd rebuild.",
      "{count} projects here — enterprise tools, consumer apps, infrastructure work. What context are you hiring for?",
    ],

    results: [
      "Found {count} {technology} projects. {highlight} had the most interesting constraints — engineering said we couldn't do real-time updates, which actually led to a better async pattern.",
      "{count} builds with {technology}. {highlight} is where I learned the difference between using a framework and understanding when not to.",
      "Showing {count} {technology} projects. {highlight} was a tight deadline where I deliberately cut features to ship core value first.",
    ],

    noResults: [
      "Haven't tackled {technology} directly yet. Closest would be adjacent work where I had to learn similar patterns. Want to see that?",
      "Don't have {technology} examples, but I've solved similar problems with different tools. The approach matters more than the stack.",
    ],

    clarification: [
      "What kind of problem are you trying to solve? B2B complexity, consumer growth, early validation?",
      "Are you asking about how I approach that generally, or want to see a specific example?",
      "That could mean a few things — are you thinking about technical constraints, user research, or team collaboration?",
    ],
  },

  intentPatterns: {
    process: {
      triggers: ['process', 'approach', 'methodology', 'how do you', 'workflow'],
      templates: [
        "Not dogmatic about process. {project} needed structured research because we were redesigning for millions of users — A/B tested everything. {other_project} was an MVP where I deliberately sketched in low-fi and shipped rough to validate faster.",
        "Depends on ambiguity level. Early stage? I prototype with real data, ship to 10 users, iterate daily. Enterprise migration? I map all user workflows first, involve engineering early, plan the rollout in phases.",
        "I switch methods based on risk. {project} had unclear requirements so I did 5-why analysis with stakeholders before touching Figma. {other_project} had tight deadlines so I paired with engineers and designed in code.",
      ],
    },

    problemFraming: {
      triggers: ['problem', 'why', 'requirements', 'brief', 'stakeholder'],
      templates: [
        "{project} started as 'add a dashboard' but after talking to users realized the actual problem was they couldn't find the three metrics they check daily. Built persistent filters instead.",
        "On {project}, PM wanted bulk actions. Asked why 5 times — turned out support was manually fixing user mistakes. Real solution was better validation upfront, not faster cleanup.",
        "The brief for {project} said 'improve onboarding' but data showed activation dropped at day 7, not day 1. Reframed it as retention problem, focused on habit formation.",
      ],
    },

    constraints: {
      triggers: ['constraint', 'limitation', 'engineering', 'technical', 'tradeoff'],
      templates: [
        "{project}: engineering couldn't do live updates due to infrastructure costs. Instead of fighting it, designed around staleness — added timestamps, made it feel intentional. Users didn't notice.",
        "On {project}, had to work with a legacy API that returned everything in one massive call. Used that constraint to simplify the UI — progressive disclosure made load time feel faster.",
        "Technical debt on {project} meant we couldn't change the data model. Designed around it using smart filtering and search. Sometimes the best design is the one that doesn't require a rewrite.",
      ],
    },

    collaboration: {
      triggers: ['team', 'worked with', 'cross-functional', 'engineers', 'pm'],
      templates: [
        "{project} — worked with 3 engineers and a PM. I owned the interaction model, they owned performance. Most interesting part: we paired on the state management pattern which unlocked better UX.",
        "On {project}, engineering said my design would cause N+1 queries. Sat with them, understood the constraint, redesigned for batch loading. Better performance and simpler code.",
        "{project}: PM wanted feature X, but after showing engineers the spec, we realized it conflicted with platform Y. Proposed alternative that worked within both constraints.",
      ],
    },

    failures: {
      triggers: ['failed', 'mistake', 'learned', 'wrong', 'differently', 'embarrassed'],
      templates: [
        "{project} — shipped it, users ignored the main feature. I'd designed for power users when 90% were casual. Took 3 iterations to simplify. Learned to check usage distribution first.",
        "Honestly? {project} would be rebuilt from scratch now. Over-complicated the information architecture because I didn't want to cut anyone's pet feature. Should've been more ruthless.",
        "On {project}, I spent weeks on pixel-perfect mockups for a concept that died in user testing. Waste of time. Now I prototype in low-fi first, test assumptions, then polish.",
      ],
    },

    techStack: {
      triggers: ['react', 'native', 'swift', 'kotlin', 'typescript', 'tech', 'stack'],
      templates: [
        "I've used {technology} on {count} projects. Comfortable building production UIs — can read the codebase, prototype with real data, work in browser dev tools. Not a framework engineer but I can ship features.",
        "{count} {technology} builds. I code well enough to understand feasibility, suggest technical alternatives, and contribute CSS/interactions. Recently prototyped {project} in {technology} to prove the concept worked.",
        "Used {technology} on {count} projects. {highlight} taught me when to use it versus when simpler solutions work better. I prototype in code when it's faster than high-fi mocks.",
      ],
    },

    context: {
      enterprise: {
        triggers: ['enterprise', 'b2b', 'admin', 'power user', 'complex', 'workflow'],
        templates: [
          "{project}: designed for power users who lived in it 8hrs/day versus admins who logged in monthly. Used progressive disclosure — simple defaults, advanced features behind keyboard shortcuts.",
          "On {project}, had to balance feature complexity with onboarding. Shipped with basic mode first, gradually revealed advanced tools as users demonstrated competency.",
          "{project} was multi-role workflows — requester, approver, admin. Mapped all handoffs first, designed for transitions between roles. Most critical part was notification logic.",
        ],
      },

      consumer: {
        triggers: ['consumer', 'growth', 'viral', 'onboarding', 'first-time', 'engagement'],
        templates: [
          "{project}: first-time experience focused on one core action. By session 10, we surfaced shortcuts and customization. Balanced delight with performance — animations only above-the-fold.",
          "On {project}, designed for virality without being manipulative. Made sharing natural to workflow, not a desperate prompt. Measured invite quality, not just volume.",
          "Obsessed with friction in {project}. Every tap cost 40% dropoff. Cut sign-up fields, pre-filled data where possible, delayed account creation until value was clear.",
        ],
      },

      startup: {
        triggers: ['startup', 'mvp', 'validate', 'early', 'fast', 'scrappy'],
        templates: [
          "{project}: had 2 weeks to validate if users would pay for feature X. Shipped Wizard-of-Oz prototype — looked real but I manually processed everything. Validated in 4 days.",
          "On {project}, deliberately shipped rough. Needed to learn if the concept worked before polishing. Used obvious placeholders so users knew it was early. Iterated based on usage, not opinions.",
          "{project} was classic startup constraint: unclear requirements, tight timeline, no researchers. I did 10 user interviews myself, designed in low-fi, paired with engineer to ship fast.",
        ],
      },

      scale: {
        triggers: ['scale', 'redesign', 'millions', 'a/b test', 'metric', 'system'],
        templates: [
          "{project}: redesigned feature used by 2M+ users. Couldn't do big-bang. Shipped behind feature flag, A/B tested against old version, rolled out cohort by cohort over 6 weeks.",
          "On {project}, advocated for design change that would temporarily hurt conversion. Had data showing long-term retention would improve. Took 2 months to convince leadership but was right.",
          "{project} was design system work. Built components used by 12 product teams. Hardest part: deprecating old patterns without breaking existing flows. Documented migration paths, set timelines.",
        ],
      },
    },
  },
};
