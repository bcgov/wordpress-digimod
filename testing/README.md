This repository contains end-to-end tests for digital.gov.bc.ca using cypress. Tests include GitHub actions as well as tools that can be run manually.

## Contents
- [Installation and Configuration](#installation-and-configuration)
- [GitHub Actions](#github-actions)
  * [Broken Link Checker (broken-link-checker.yaml)](#broken-link-checker--broken-link-checkeryaml-)
  * [Missing Pages (missing-pages.yaml)](#missing-pages--missing-pagesyaml-)
  * [Smoke Test (smoke-test.yaml)](#smoke-test--smoke-testyaml-)
  * [Home Page Screenshot (homepage-screenshot.yaml)](#home-page-screenshot--homepage-screenshotyaml-)
- [Tools](#tools)
  * [Screenshot tests](#screenshot-tests)
  * [Snapshot tests](#snapshot-tests)
  * [Notes](#notes)
  * [Broken Links](#broken-links)
  * [Missing Pages](#missing-pages)

## Installation and Configuration
Clone the repository, navigate to `testing` directory and run `npm i`.

To configure the URL of the site, change the value of `wordpressSiteUrl` variable in `cypress.config.js` file

## GitHub Actions
### Broken Link Checker (broken-link-checker.yaml)
This action uses sitemap.xml retrieved from the digital.gov.bc.ca/sitemap.xml and scans through all of the pages and all of the links on those pages and verifies that those links return 200 or 401 (401 indicates that the link is behind login). Once the run is complete, if any of the links failed, a report is generated and submitted to a designated email:

```
Page: https://digital.gov.bc.ca/guidance/acquire-saas/
Broken Links:
  URL: https://www2.gov.bc.ca/gov/content/bc-procurement-resources/sell-to-government/understand-government-processes/ministry-contacts
  Status: 404


Page: https://digital.gov.bc.ca/policies-standards/digital-code-of-practice/
Broken Links:
  URL: https://digital.gov.bc.ca/guidance/how-to-acquire-low-touch-saas/
  Status: 404
```

### Missing Pages (missing-pages.yaml)
This action keeps track of pages that have been deleted and verifies that they don't return a 404 status code. This handles the case of pages that have been present for a long time that users have bookmarked and expect to continue to work. If a page is being deleted, a redirect to an alternative resource should be setup to handle visits to the old link.

To accomplish this test, the script additively modifies local sitemap.xml data stored in the root of the repository in json files with the format of `urls_for_SITE-NAME.json`. This means that if a new link was found in sitemap.xml downloaded from a website, it gets added to the json file, but if a link was removed at the remote location, it does not get removed locally. This allows for calculation of which pages have good missing on the remote site.

**Todo:** Currently this does not send out a report with a summary of broken pages, just a notification that the test has failed. Generate a text file report to be attached with the email

### Smoke Test (smoke-test.yaml)
This action simply verifies that the site is accessible. This action runs on a frequent basis (every hour) to rapidly detect any catastrophic failures of the site. A notification gets sent to a designated email

### Home Page Screenshot (homepage-screenshot.yaml)
This action detects changes on the front page via a screenshot test and notifies over a designed email.

**Todo:** Currently screenshots generated locally do not match screenshots generated via GitHub actions, likely due to differences in environments. Determine an appropriate environment configuration to generate identical screenshots or generate initial screenshots via GitHub actions and commit them to the repository programmatically.

## Tools
### Screenshot tests
There are two sets of screenshot tests - one for desktop and one for mobile. The screenshots are stored in /testing/cypress/e2e folder with an auto generated name of the format `screenshots-for-SITE-NAME` and `mobile-screenshots-for-SITE-NAME`. On the first run the screenshots will be generated and all tests will pass. On subsequent runs, new screenshots will be compared to existing ones and if any difference are found, tests will fail and diff/actual image files will be written that demonstrate the differences into the screenshot folders.

These tests are useful for tracking site-wide visual regressions that may occur due to system-wide changes, such as WordPress version upgrades, theme upgrades or plugin updates. The workflow for using this tool involves taking a fresh set of screenshots before upgrade is done, performing the upgrade and running the tests again. Any deviations from the original site state will be captured.

**Implementation Notes:** 
- Scroll behavior on the page should be standard, CSS rule `scroll-behavior: smooth` interferes with screenshot capture, causing corrupted and inconsistent images. The testing script automatically sets `<html>` CSS rule to `scroll-behavior: auto`
- Elements that appear on the page in response to scroll position, such as "back to top" button need to be removed as they may appear in inconsistent places on the screenshots (in this test set this is the `.back-to-top` element)
- YouTube videos have been removed from the pages by targeting the `.is-type-video` element. YouTube videos load at inconsistent time and contain a fade effect that produces inconsistent screenshots.
- `loading="lazy"` likewise interferes with screenshot generation. The tests remove this attribute to ensure consistent image loading in response to automatic scrolling.

To run screenshot tests, use the following command:

``` npx cypress run --spec "cypress/e2e/screenshot-tests.cy.js" --browser firefox --env url=https://digital.gov.bc.ca```

For mobile screenshots use:

``` npx cypress run --spec "cypress/e2e/screenshot-tests-mobile.cy.js" --browser firefox --env url=https://digital.gov.bc.ca```

For a more convenient interface, run the tests through Cypress UI by running:

``` npx cypress open ```

With above, when screenshot test fail, there is an interface that allows for replacement of existing screenshots with new ones.

### Snapshot tests
Snapshot tests work similarly to screenshot tests, except these capture the HTML contents of the page (specifically the `<body>` tag), save them to a designated folder `snapshots-for-SITE-NAME` and `mobile-snapshots-for-SITE-NAME` and perform actual/expected comparison. The results of comparisons are saved into `snapshots-report` and `mobile-snapshots-report` folders. For each failed test, 3 files get generated:

1. Actual snapshot
2. Expected snapshot
3. Diff patch file showing the differences between files

These tests are useful for comparing the state of the site before/after system-wide upgrades (like screenshot tests) demonstrating differences on the code level. Also these tests could be used to generated daily reports of site-wide changes due to normal editing activities (**todo**)

To run snapshot tests, use the following command:

``` npx cypress run --spec "cypress/e2e/sitemap-snapshot-test.cy.js" --browser firefox --env url=https://digital.gov.bc.ca```

And for mobile:

``` npx cypress run --spec "cypress/e2e/sitemap-snapshot-test-mobile.cy.js" --browser firefox --env url=https://digital.gov.bc.ca```

### Broken Links
In addition to running broken links via GitHub actions, they can also be run locally via cypress. To run broken link checker locally, run:

``` npx cypress run --spec "cypress/e2e/broken-link-checker.cy.js" --browser firefox --env url=https://digital.gov.bc.ca```

The report will be generated into `cypress/e2e/broken-links-report/report.txt` file.

### Missing Pages
To check if any of the pages that have been deleted are now set to redirect to an alternative resource, run:

``` npx cypress run --spec "cypress/e2e/missing-pages.cy.js" --browser firefox --env url=https://digital.gov.bc.ca```

There is no report generated, review test results to determine which pages need to be setup for redirects. If a page errors, and a 404 response is acceptable, manually remove it from `urls_for_SITE-NAME.json` file located in the root of the repository.

## Notes
- The snapshot plugin for Cypress library had undergone a transition into a new project and at the date of construction of this test set the plugin was not in a stable configuration. To address issues with the plugin, it has been cloned locally and modified to address an issue where comparison between actual and expected snapshots was not working properly (crashing with recursion limit).

**Todo:** Once the plugin is stable (https://github.com/datashard/snapshot), remove `lib/snapshot` folder and re-adjust dependencies to point to node_modules.
