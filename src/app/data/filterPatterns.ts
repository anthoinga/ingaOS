export const FRAMEWORK_KEYWORDS: Record<string, string[]> = {
  'React': ['react', 'reactjs', 'react.js'],
  'Next.js': ['nextjs', 'next.js', 'next'],
  'React Native': ['react native', 'react-native', 'rn'],
  'Vue': ['vue', 'vuejs', 'vue.js'],
  'Angular': ['angular', 'angularjs'],
  'Three.js': ['threejs', 'three.js', 'three', 'webgl'],
  'Swift': ['swift', 'swiftui'],
  'SwiftUI': ['swiftui', 'swift ui'],
  'Kotlin': ['kotlin'],
  'TypeScript': ['typescript', 'ts'],
  'Node.js': ['nodejs', 'node.js', 'node'],
  'Jetpack Compose': ['jetpack compose', 'jetpack', 'compose'],
  'Tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
};

export const PLATFORM_KEYWORDS: Record<string, string[]> = {
  'Web': ['web', 'website', 'webapp', 'web app'],
  'iOS': ['ios', 'iphone', 'ipad', 'apple'],
  'Android': ['android'],
  'Mobile': ['mobile', 'app'],
  'Cloud': ['cloud', 'aws', 'infrastructure'],
};

export const SKILL_KEYWORDS: Record<string, string[]> = {
  'UI/UX': ['ui', 'ux', 'design', 'interface', 'user experience', 'user interface'],
  'Full-stack': ['fullstack', 'full-stack', 'full stack'],
  'Frontend': ['frontend', 'front-end', 'front end'],
  'Backend': ['backend', 'back-end', 'back end'],
  '3D': ['3d', 'three dimensional', 'webgl', '3d visualization'],
  'Data Visualization': ['data viz', 'dataviz', 'visualization', 'charts', 'analytics'],
  'Mobile Development': ['mobile dev', 'mobile development', 'app development'],
  'Cross-Platform Development': ['cross-platform', 'cross platform', 'multiplatform'],
  'DevOps': ['devops', 'dev ops', 'deployment', 'ci/cd'],
  'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'ai integration'],
  'Agentic Engineering': ['agentic', 'agentic engineering', 'agent', 'agents'],
  'Design Systems': ['design system', 'design systems', 'component library'],
  'Experience Architecture': ['experience architecture', 'information architecture', 'ia'],
  'System Architecture': ['system architecture', 'systems architecture', 'architecture'],
  'Systems Design': ['systems design', 'system design'],
  'Operational UX': ['operational ux', 'operations', 'workflow design'],
  'Product Marketing': ['product marketing', 'marketing'],
  'Analytics': ['analytics', 'data analytics'],
};

export const TOOL_KEYWORDS: Record<string, string[]> = {
  'Figma': ['figma'],
  'FigJam': ['figjam', 'fig jam'],
  'Storybook': ['storybook'],
  'Docker': ['docker'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services'],
  'Xcode': ['xcode'],
  'Android Studio': ['android studio'],
  'Expo': ['expo'],
  'D3.js': ['d3', 'd3.js'],
  'Chart.js': ['chartjs', 'chart.js'],
  'Blender': ['blender'],
  'Salesforce': ['salesforce', 'sfdc', 'crm'],
  'Zeplin': ['zeplin'],
  'Jira': ['jira'],
  'AI/ML': ['ai', 'ml', 'ai/ml', 'machine learning', 'artificial intelligence'],
  'OpenAI': ['openai', 'open ai', 'gpt', 'chatgpt'],
  'Claude': ['claude', 'anthropic'],
  'Cursor': ['cursor'],
  'Windsurf': ['windsurf'],
};

export const YEAR_PATTERN = /\b(20\d{2})\b/g;
