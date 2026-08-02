import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'e2e/__screenshots__/**',
      'test-results/**',
      'playwright-report/**',
      'archive/**',
      'stitch-export/**',
      'docs/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The permission boundary is expressed in types. Silencing it is a security event.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // `const { wholesale: _w, ...base }` is how a restricted field is dropped.
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // Everything OUTSIDE src/data. Restricted fixture records must not be reachable from a
    // route, a component or a feature — only from the repositories that apply authorisation.
    files: ['src/app/**', 'src/ui/**', 'src/features/**', 'src/domain/**', 'src/auth/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/fixtures/products',
              importNames: ['PRODUCT_RECORDS'],
              message:
                'PRODUCT_RECORDS carries restricted wholesale terms. Read it through ' +
                'src/data/catalog-repository, which applies the authorisation seam.',
            },
          ],
        },
      ],
    },
  },
]

export default config
