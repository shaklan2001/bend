module.exports = {
  // Basic formatting
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  useTabs: false,

  // JSX specific
  jsxSingleQuote: true,
  jsxBracketSameLine: false,

  // Other options
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',

  // File extensions to format
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
  ],
};
