const { defineConfig } = require("cypress");
const { functions } = require("./src/utils");

module.exports = defineConfig({
  snapshot: {
    snapshotPath: "cypress/snapshots/",
  },
  e2e: {
    setupNodeEvents(on, config) {
      functions.tasks(on, config);
    },
  },
});
