// require("@datashard/snapshot").register();
require("../../lib/snapshot/src").register();
require("@frsource/cypress-plugin-visual-regression-diff");
// const axios = require('axios').default;
// // const fs = require('fs');
// const xml2js = require('xml2js');

// const urlSlug = require('url-slug');
// const wordpressSiteUrl = 'https://wodpress-version-bump.apps.silver.devops.gov.bc.ca/';
// const urlsFilePath = './urls_for_'+urlSlug.convert(wordpressSiteUrl)+'.json';

// // Function to fetch sitemap and parse XML to JSON
// async function getSitemapUrls() {
//     try {
//       // cy.log('getSitemapUrls', wordpressSiteUrl);
//       const response = await axios.get(`${wordpressSiteUrl}/sitemap.xml`);
//       // cy.log('response: ', response);
//       const parsedSitemap = await xml2js.parseStringPromise(response.data);
  
//       // cy.log('parsedSitemap: ', parsedSitemap);
//       const urls = parsedSitemap.urlset.url.map((entry) => entry.loc[0]);

//       // check for missing links

//       // add any new links
//       return urls;
//     } catch (error) {
//       cy.log('Error fetching sitemap:', error.message);
//       return [];
//     }
//   }

// // Load existing URLs from the local file
// async function loadExistingUrls() {
//     try {
//         const content = await cy.task('readFile', urlsFilePath);
//         const jsn = JSON.parse(JSON.parse(content));
//         return jsn;
//     } catch (error) {
//       console.error('Warning: error loading existing URLs:', error);
//     }
//     return [];
// }

// // Update local file with new URLs and find missing URLs
// async function updateUrlsFile(newUrls, existingUrls) {
//     const addedUrls = newUrls.filter((url) => !existingUrls.includes(url));
//     const missingUrls = existingUrls.filter((url) => !newUrls.includes(url));
  
//     // Save new URLs to the file
//     if (addedUrls.length > 0) {
//         // cy.log('WRITING: ', JSON.stringify([...existingUrls, ...addedUrls]));
//         await cy.task('writeFile', {filePath:urlsFilePath, 
//             content:JSON.stringify([...existingUrls, ...addedUrls])});
//     }
  
//     return { addedUrls, missingUrls };
// }

// before(async () => {
//     const newUrls = await getSitemapUrls();
//     const existingUrls = await loadExistingUrls();

//     const { addedUrls, missingUrls } = await updateUrlsFile(newUrls, existingUrls);

//     // cy.log('urls', newUrls);

//     // let newUrls = [];
//     Cypress.env('sitemapUrls', newUrls);
//     Cypress.env('missingUrls', missingUrls);

//     cy.log('missingUrls',missingUrls);

//     cy.log('commands.js');
// })

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test when an exception gets thrown
    return false
})

