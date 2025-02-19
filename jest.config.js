module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['dotenv/config'],
  testTimeout: 30000 // Increase timeout to 30 seconds
}; 