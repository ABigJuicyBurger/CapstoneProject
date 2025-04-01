export default {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  globals: {
    module: 'readonly',
    require: 'readonly',
    process: 'readonly',
    __dirname: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Add custom rules here
  }
};
