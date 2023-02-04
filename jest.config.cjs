/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src/tests',
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  setupFiles: ["dotenv/config"],
};
