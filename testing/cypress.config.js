const { defineConfig } = require('cypress')
const { initPlugin } = require("@frsource/cypress-plugin-visual-regression-diff/plugins")
const fsHandler = require('./cypress/plugins/fsHandler');
const fs = require('fs');

// require("@datashard/snapshot").register();


const axios = require('axios').default;
// const fs = require('fs');
const xml2js = require('xml2js');

const urlSlug = require('url-slug');
// const wordpressSiteUrl = Cypress.config('baseUrl');
// const urlsFilePath = './urls_for_'+urlSlug.convert(wordpressSiteUrl)+'.json';

module.exports = defineConfig({
  viewportHeight:900,
  viewportWidth:1440,
  e2e: {
    // supportFile:false,
    async setupNodeEvents(on, config) {
      on('task', {
        readFileMaybe2(filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8')
          }

          return null
        },
      })

      // let wordpressSiteUrl ='https://digital-dev.apps.silver.devops.gov.bc.ca/';
      let envUrl = process.env.WORDPRESS_SITE_URL || config.env.url;
      let wordpressSiteUrl;

      if (envUrl === "prod") {
          wordpressSiteUrl = "https://digital.gov.bc.ca";
      } else {
          wordpressSiteUrl = `https://digital-${envUrl}.apps.silver.devops.gov.bc.ca/`;
      }

      wordpressSiteUrl = wordpressSiteUrl || 'https://digital-test.apps.silver.devops.gov.bc.ca/';

      // let wordpressSiteUrl ='https://wodpress-version-bump.apps.silver.devops.gov.bc.ca/';

      let urlsFilePath = './urls_for_'+urlSlug.convert(wordpressSiteUrl)+'.json';
      let urls = await getUpdatedUrls(wordpressSiteUrl,urlsFilePath);
      config.env.sitemapUrls = urls.newUrls;
      config.env.missingUrls = urls.missingUrls;
      config.env.baseUrl = wordpressSiteUrl;
      // require("@datashard/snapshot").tasks(on, config);
      require("./lib/snapshot/src").tasks(on, config);

      initPlugin(on, config);

      return config;
    }
  },
  component: {
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  }
})




// Function to fetch sitemap and parse XML to JSON
async function getSitemapUrls(wordpressSiteUrl) {
    // try {
      // cy.log('getSitemapUrls', wordpressSiteUrl);
      const response = await axios.get(`${wordpressSiteUrl}/sitemap.xml`);
      // cy.log('response: ', response);
      const parsedSitemap = await xml2js.parseStringPromise(response.data);
  
      // cy.log('parsedSitemap: ', parsedSitemap);
      const urls = parsedSitemap.urlset.url.map((entry) => entry.loc[0]);

      // check for missing links

      // add any new links
      return urls;
    // } catch (error) {
    //   cy.log('Error fetching sitemap:', error.message);
    //   return [];
    // }
  }

// Load existing URLs from the local file
async function loadExistingUrls(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');//await cy.task('readFile', urlsFilePath);
        const jsn = JSON.parse(JSON.parse(content));
        return jsn;
    } catch (error) {
      console.error('Warning: error loading existing URLs:', error);
    }
    return [];
}

// Update local file with new URLs and find missing URLs
async function updateUrlsFile(newUrls, existingUrls, urlsFilePath) {
    const addedUrls = newUrls.filter((url) => !existingUrls.includes(url));
    const missingUrls = existingUrls.filter((url) => !newUrls.includes(url));
  
    // Save new URLs to the file
    if (addedUrls.length > 0) {
        // cy.log('WRITING: ', JSON.stringify([...existingUrls, ...addedUrls]));
        // await cy.task('writeFile', {filePath:urlsFilePath, 
        //     content:JSON.stringify([...existingUrls, ...addedUrls])});
        fs.writeFileSync(urlsFilePath, JSON.stringify(JSON.stringify([...existingUrls, ...addedUrls]), null, 2));

    }
  
    return { addedUrls, missingUrls };
}

async function getUpdatedUrls(wordpressSiteUrl,urlsFilePath){
    const newUrls = await getSitemapUrls(wordpressSiteUrl);
    const existingUrls = await loadExistingUrls(urlsFilePath);

    const { addedUrls, missingUrls } = await updateUrlsFile(newUrls, existingUrls, urlsFilePath);

    // cy.log('urls', newUrls);

    // let newUrls = [];
    // module.exports = newUrls;
    // Cypress.env('sitemapUrls', newUrls);
    // Cypress.env('missingUrls', missingUrls);

    // cy.log('missingUrls',missingUrls);

    

    // globalVars.newUrls = newUrls;
    // globalVars.missingUrls = missingUrls;
    // cy.log('commands.js', globalVars.newUrls);
    return {newUrls, missingUrls};
}