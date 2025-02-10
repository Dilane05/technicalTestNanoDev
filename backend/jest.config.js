module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Pour les fichiers TypeScript
    '^.+\\.js$': 'babel-jest',  // Pour les fichiers JavaScript
  },
  moduleFileExtensions: ['ts', 'js'],  // Acceptation des fichiers .ts et .js
};