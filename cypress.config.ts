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
    viewportWidth: 1280,
    viewportHeight: 720,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      on('task', {
        log(message: string) {
          console.log('  ' + message + '\n');
          return null;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table(tableData: any) {
          console.table(tableData);
          return null;
        },
      });
    },
  },
});
