import type { Project } from '@/app/types';

export const column1Projects: Project[] = [
  {
    id: '7eleven R&D',
    size: 'small',
    imageUrl: '/images/7eleven.png',
    imageAlt: '7-Eleven AI Experiences',
    url: 'https://www.7-eleven.com/',
    header: 'Crafting AI Experiences at 7-Eleven',
    title: '7-Eleven R&D',
    location: 'Irving, TX',
    date: 'Current',
    metadata: {
      frameworks: ['React', 'Next.js'],
      tools: ['AI/ML', 'OpenAI', 'Claude', 'Cursor', 'Windsurf'],
      platform: ['Web', 'iOS', 'Android'],
      skills: ['AI Integration', 'Frontend Development', 'UI/UX Design'],
      projectType: 'AI Product',
      year: '2026',
    },
  },
  {
    id: 'ai-rsvp',
    size: 'large',
    imageUrl: '/images/rsvp-app.png',
    imageAlt: 'RSVP Reader',
    url: 'https://anthonyi.notion.site/Reading-at-the-Speed-of-Thought-30b037de312980d0b826e6b89511a157?source=copy_link',
    title: 'AI RSVP Reader',
    date: '2026',
    metadata: {
      frameworks: ['Tailwind'],
      tools: ['Claude', 'Cursor'],
      platform: ['Web'],
      skills: ['Agentic Engineering'],
      projectType: 'AI Product',
      year: '2026',
    },
  },
  {
    id: 'Rethinking Curbside',
    size: 'large',
    imageUrl: '/images/designing-scale.png',
    imageAlt: 'Designing for Scale',
    url: 'https://anthonyi.notion.site/Designing-for-Scale-259037de3129805b9822d688be9175ea?source=copy_link',
    title: 'Rethinking Curbside',
    location: 'Boise, ID',
    date: '2022–2023',
    metadata: {
      frameworks: ['React', 'Next.js', 'Tailwind'],
      tools: ['Figma', 'FigJam', 'Zeplin', 'Storybook', 'Jira', 'Android Studio'],
      platform: ['Android'],
      skills: ['UI/UX Design', 'Experience Architecture', 'Design Systems', 'Operational UX', 'Systems Design'],
      projectType: 'Design System',
      year: '2022–2023',
    },
    context: {
      client: 'Albertsons',
      industry: 'Retail / Grocery',
      category: 'Retail Fulfillment, Android Application',
      role: 'Experience Designer',
      team: 'In-store fulfillment, product and engineering',
      challenge:
        'A national grocer operating at massive scale struggled to adapt to accelerated demand for pickup and delivery services. Curbside teams were fragmented, workflows inconsistent, and the system was not built to scale across 2,000+ locations.',
      prompt:
        'Could we improve operational efficiency on the floor and reliably scale that process to more than 2,000 locations?',
      outcome:
        'Delivered an on-device mobile application that brought clarity to a fragmented fulfillment process. Workflows became more fluid, errors diminished, and the staff experience felt more intentional. The strength of the solution was not in adding more, but in creating something simple, scalable, and quietly reliable.',
    },
  },
  {
    id: 'robert-half-ios-1',
    size: 'large',
    imageUrl: '/images/mobile-app.png',
    imageAlt: 'Mobile Application',
    url: 'https://anthonyi.notion.site/Talent-in-Your-Pocket-25c037de312980b4815ef54e253f85dd',
    title: 'Robert Half',
    location: 'Menlo Park, CA',
    date: '2020–2022',
    metadata: {
      frameworks: ['Kotlin', 'Swift'],
      tools: ['Android Studio', 'XCode', 'Salesforce'],
      platform: ['iOS', 'Android'],
      skills: ['Cross-Platform Development', 'Mobile Development', 'UI/UX Design', 'Design Systems'],
      projectType: 'Mobile App',
      year: '2020–2022',
    },
    context: {
      client: 'Robert Half',
      industry: 'Staffing / Enterprise HR',
      category: 'Mobile Recruitment, iOS & Android Native App',
      role: 'Experience Designer',
      engagement: 'Bottle Rocket — brought in post-MVP as systems and UI designer on a two-person UX team',
      team: 'CTO, leading marketing teams, two-person UX team',
      projectName: 'Talent in Your Pocket',
      challenge:
        "Robert Half's temporary workers faced a visibility problem: the app would reject timesheets without indicating which category was wrong, turning every correction into guesswork. Worker profiles functioned as static forms rather than evolving records — skills and experience sat disconnected, making it harder to surface the right candidates for new assignments.",
      prompt:
        'How can we help people get through complex enterprise workflows as smoothly and as confidently as possible?',
      scope: [
        'Job discovery and application',
        'Interview scheduling and screening',
        'Job offer negotiation',
        'Timesheet management',
        'Time off and benefits portal',
        'Tax documents',
      ],
      approach:
        'Translated the existing web portal to a native mobile platform for their workforce network. The product leveraged Salesforce cloud data to build a frontend GUI that manipulated user accounts based on app feature flags. Designed the component library, specced every interaction state, and built a color-coded status system so workers could see exactly which timesheet category was in which state at a glance.',
      outcome:
        'Delivered a UI system that felt native to iOS and was buildable without constant revision. The visual language was designed to scale beyond the initial feature set. The project won awards.',
      awards: true,
    },
  },
];

export const column2Projects: Project[] = [
  {
    id: 'ny-phil',
    size: 'small',
    imageUrl: '/images/ny-phil.png',
    imageAlt: 'NY Philharmonic',
    url: 'https://www.nyphil.org/',
    title: 'NY Philharmonic',
    location: 'New York, NY',
    date: '2022',
    metadata: {
      frameworks: ['React', 'TypeScript'],
      tools: ['Figma'],
      platform: ['Web'],
      skills: ['UI/UX Design', 'Frontend Development'],
      projectType: 'Website',
      year: '2022',
    },
  },
  {
    id: 'gh-sass',
    size: 'large',
    imageUrl: '/images/infrastructure.png',
    imageAlt: 'Building a Brokerage Platform',
    url: 'https://anthonyi.notion.site/Building-New-Infrastructure-257037de31298000bd68fa954cb48ec1?source=copy_link',
    title: 'Building a Brokerage Platform',
    location: 'Southlake, TX',
    date: '2023–2025',
    metadata: {
      frameworks: ['Node.js', 'TypeScript'],
      tools: ['Docker', 'Kubernetes', 'AWS', 'Salesforce'],
      platform: ['Cloud', 'Web'],
      skills: ['System Architecture', 'Frontend Development', 'UI/UX Design', 'Design Systems'],
      projectType: 'SaaS Platform',
      year: '2023–2025',
    },
    context: {
      industry: 'Insurance / Brokerage',
      category: 'Enterprise SaaS, Web Application',
      role: 'Experience Designer',
      challenge:
        "The brokerage's Salesforce CRM had grown brittle. Each new integration layered in another workflow mismatch. Agents were constantly re-entering data across tools, policy updates stalled in email threads, and clients received inconsistent documents. Growth slowed not because of lack of demand, but because operations were grinding under fragmented systems.",
      prompt:
        'How can we help people get through complex insurance forms as smoothly and as confidently as possible?',
      approach:
        'Built a proprietary web application split into two distinct experiences — client-facing and enterprise — because agents and clients had conflicting priorities. Agents needed dense information tools for policy management; clients needed a stripped-down, fast path through forms.',
      outcome:
        'Streamlined agent workflows and made purchasing processes more intuitive. Delivered a reusable library of web components so the business could continue to evolve the product independently.',
      experiences: [
        'Agent dashboard — policy management, dense information tooling',
        'Client portal — simplified forms and purchasing flow',
      ],
    },
  },
  {
    id: 'gh-sass-dashboard',
    size: 'small',
    imageUrl: '/images/dashboard.png',
    imageAlt: 'Brokerage Dashboard',
    url: 'https://anthonyi.notion.site/Building-New-Infrastructure-257037de31298000bd68fa954cb48ec1?source=copy_link',
    title: 'Building a Brokerage Platform',
    location: 'Southlake, TX',
    date: '2023–2025',
    metadata: {
      frameworks: ['React', 'TypeScript'],
      tools: ['Salesforce'],
      platform: ['Web'],
      skills: ['Data Visualization', 'Frontend Development', 'Analytics'],
      projectType: 'Dashboard',
      year: '2023–2025',
    },
    context: {
      industry: 'Insurance / Brokerage',
      category: 'Enterprise Dashboard',
      role: 'Experience Designer',
      notes:
        'Agent-facing analytics and policy management dashboard. Part of the larger brokerage platform initiative.',
    },
  },
];

export const column3Projects: Project[] = [
  {
    id: 'robert-half-ios',
    size: 'large',
    imageUrl: '/images/robert-half-ios.png',
    imageAlt: 'Robert Half iOS App',
    url: 'https://anthonyi.notion.site/Talent-in-Your-Pocket-25c037de312980b4815ef54e253f85dd',
    title: 'Robert Half',
    location: 'Menlo Park, CA',
    date: '2021',
    metadata: {
      frameworks: ['Swift', 'SwiftUI'],
      tools: ['Xcode', 'Salesforce'],
      platform: ['iOS'],
      skills: ['Mobile Development', 'UI/UX Design', 'Design Systems'],
      projectType: 'Mobile App',
      year: '2021',
    },
    context: {
      client: 'Robert Half',
      industry: 'Staffing / Enterprise HR',
      category: 'Mobile Recruitment, iOS & Android Native App',
      role: 'Experience Designer',
      engagement: 'Bottle Rocket — brought in post-MVP as systems and UI designer on a two-person UX team',
      team: 'CTO, leading marketing teams, two-person UX team',
      projectName: 'Talent in Your Pocket',
      challenge:
        "Robert Half's temporary workers faced a visibility problem: the app would reject timesheets without indicating which category was wrong, turning every correction into guesswork. Worker profiles functioned as static forms rather than evolving records — skills and experience sat disconnected, making it harder to surface the right candidates for new assignments.",
      prompt:
        'How can we help people get through complex enterprise workflows as smoothly and as confidently as possible?',
      scope: [
        'Job discovery and application',
        'Interview scheduling and screening',
        'Job offer negotiation',
        'Timesheet management',
        'Time off and benefits portal',
        'Tax documents',
      ],
      approach:
        'Translated the existing web portal to a native mobile platform for their workforce network. The product leveraged Salesforce cloud data to build a frontend GUI that manipulated user accounts based on app feature flags. Designed the component library, specced every interaction state, and built a color-coded status system so workers could see exactly which timesheet category was in which state at a glance.',
      outcome:
        'Delivered a UI system that felt native to iOS and was buildable without constant revision. The visual language was designed to scale beyond the initial feature set. The project won awards.',
      awards: true,
    },
  },
  {
    id: 'pulsar',
    size: 'small',
    imageUrl: '/images/pulsar.png',
    imageAlt: 'Bajaj Pulsar N160',
    url: 'https://www.bajajauto.com/bikes/pulsar/pulsar-n160',
    title: 'Bajaj Pulsar',
    location: 'Mumbai, India',
    date: '2022',
    metadata: {
      frameworks: ['React', 'Three.js'],
      tools: ['Blender', 'WebGL'],
      platform: ['Web'],
      skills: ['3D Visualization', 'Frontend Development', 'Product Marketing'],
      projectType: 'Product Website',
      year: '2022',
    },
    context: {
      client: 'Bajaj Auto',
      category: 'Micro Site Launch',
    },
  },
  {
    id: 'robert-half-android',
    size: 'large',
    imageUrl: '/images/robert-half-android.png',
    imageAlt: 'Robert Half Android App',
    url: 'https://anthonyi.notion.site/Talent-in-Your-Pocket-25c037de312980b4815ef54e253f85dd',
    title: 'Robert Half Android',
    location: 'Menlo Park, CA',
    date: '2020',
    metadata: {
      frameworks: ['Kotlin', 'Jetpack Compose'],
      tools: ['Android Studio', 'Salesforce'],
      platform: ['Android'],
      skills: ['Mobile Development', 'UI/UX Design', 'Design Systems'],
      projectType: 'Mobile App',
      year: '2020',
    },
    context: {
      client: 'Robert Half',
      industry: 'Staffing / Enterprise HR',
      category: 'Mobile Recruitment, Android Native',
      role: 'Experience Designer',
      engagement: 'Bottle Rocket',
      projectName: 'Talent in Your Pocket',
      notes:
        'Android-specific implementation of the Robert Half mobile platform. See robert-half-ios-1 for full project context including scope, challenge, and outcome.',
      awards: true,
    },
  },
];

export const allProjects: Project[] = [
  ...column1Projects,
  ...column2Projects,
  ...column3Projects,
];
