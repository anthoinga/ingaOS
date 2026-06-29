import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

// The three-tier architecture (see README) is enforced here, not by
// convention. Tokens/data flow INTO the signature (effects) tier; it never reaches back out.
export default tseslint.config(
  { ignores: ['dist', 'sanity', 'node_modules', '*.config.ts', '*.config.js', '*.config.mjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, boundaries },
    settings: {
      // Boundaries must resolve the @/ alias and .ts/.tsx targets, or every cross-tier
      // import reads as "unknown" and the rules silently never fire.
      'import/resolver': { typescript: { project: './tsconfig.app.json' } },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'ui', mode: 'full', pattern: 'src/components/ui/**' },
        { type: 'effects', mode: 'full', pattern: 'src/effects/**' },
        { type: 'system', mode: 'full', pattern: ['src/components/mtb/**', 'src/hooks/**', 'src/contexts/**'] },
        { type: 'apps', mode: 'full', pattern: 'src/components/apps/**' },
        { type: 'data', mode: 'full', pattern: 'src/data/**' },
        { type: 'lib', mode: 'full', pattern: 'src/lib/**' },
        { type: 'shared', mode: 'full', pattern: ['src/types/**', 'src/locales/**'] },
        // LandingPage carries the one sanctioned inline shader. It is classified as
        // composition (not effects) on purpose — the exception is declared here, in the open.
        { type: 'composition', mode: 'full', pattern: ['src/App.tsx', 'src/main.tsx', 'src/components/LandingPage.tsx'] },
      ],
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // A leading underscore marks an intentionally-unused binding (e.g. the app `onClose`
      // contract prop apps receive but don't call themselves).
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'boundaries/element-types': ['error', {
        default: 'allow',
        rules: [
          {
            from: ['ui'],
            disallow: ['system', 'effects', 'apps', 'composition'],
            message: 'Primitives (ui) take data via props only — they must not import ${target.type} code.',
          },
          {
            from: ['effects'],
            disallow: ['system', 'data', 'apps', 'composition'],
            message: 'Effects are leaf modules fed via props/args — they must not import ${target.type} code (would break the contract boundary).',
          },
        ],
      }],
    },
  },
)
