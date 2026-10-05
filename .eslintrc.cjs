module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react-hooks', 'react-refresh'],
  ignorePatterns: ['dist', 'coverage', 'node_modules', '*.config.js', '.eslintrc.cjs'],
  rules: {
    // Los hooks son la única red de seguridad real en una app sin librería de
    // formularios ni typescript: errores de orden de efectos y de dependencias
    // aparecen como bugs de estado en el carrito y el checkout.
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': 'off',

    // Deuda heredada, pendiente de limpiar (~50 casos). En 'warn' para que
    // el gate sea utilizable desde ya; subir a 'error' cuando se limpie.
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Desactivadas a propósito: el proyecto no usa la librería `prop-types`
    // ni TypeScript, así que exigir validación de props genera 226 errores
    // sin ninguna señal real. `react/no-unescaped-entities` es cosmético y
    // rompe textos en español con comillas y signos de apertura.
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
  },
}
