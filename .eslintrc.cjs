module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  overrides: [],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      tsx: true,
      jsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  settings: {
    alias: {
      map: [['@', './src']]
    },
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'import/resolver': {
      typescript: {
        directory: './tsconfig.json'
      }
    }
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  // 0 = off, 1 = warn, 2 = error
  rules: {
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'import/order': 0,
    'import/first': 0,
    'import/newline-after-import': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    'no-shadow': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-redeclare': 0,
    'no-return-await': 0,
    'no-import-assign': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-unreachable': 0,
    'no-unused-vars': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-use-before-define': 0,
    'vue/require-component-is': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-unused-vars': 0,
    'vue/no-parsing-error': 0,
    'vue/return-in-computed-property': 0,
    'vue/no-async-in-computed-properties': 0,
    'vue/attributes-order': 0,
    'consistent-return': 0,
    'default-case': 0,
    'spaced-comment': 0,
    camelcase: 'off'
  }
}
