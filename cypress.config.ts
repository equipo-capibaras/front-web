import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
    video: true,
    videoCompression: true,
  },
});
