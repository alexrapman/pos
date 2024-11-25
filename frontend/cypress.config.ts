// frontend/cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      on('task', {
        'db:seed': () => {
          // Implementar seeding de base de datos para tests
          return null;
        },
        'db:cleanup': () => {
          // Limpiar base de datos después de tests
          return null;
        }
      });
    }
  },
  env: {
    apiUrl: 'http://localhost:3001',
    defaultPassword: 'password123'
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  video: false,
  screenshotOnRunFailure: true,
  watchForFileChanges: true
});