import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://barrigareact.wcaquino.me',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.apiBaseUrl = 'https://barrigarest.wcaquino.me'

      return config
    },
  },
});
