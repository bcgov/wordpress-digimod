// Run Cypress tests with the fetched URLs
  function runTests(urls) {
    let i = 0;
    let allBrokenLinks = [];
    let currentUrl = {'url':''};
    // urls = ['https://digital.gov.bc.ca/learning/',
    //         'https://digital.gov.bc.ca/contact/'];
    let okLinks = [];

    urls.every((pageUrl) =>  {
        i++;
        
        
        // if (i<49)
        //     return true;

        // url = 'https://wodpress-version-bump.apps.silver.devops.gov.bc.ca/cloud/public-cloud/';
       
        // Define a variable to store broken links
        it('broken links test for ' + pageUrl, () => {

            currentUrl['url'] = pageUrl;
            cy.log('resetting brokenLinks..');
            let brokenLinks = [];
        
            cy.visit(pageUrl);
        
            // Collect all the links on the page
            // Collect all the links on the page
        cy.get('a')
        .then(($links) => {
            const requests = [];

            $links.each((index, $link) => {
                // Get the link href attribute
                const url = $link.href;
                cy.log('requesting: ', url);
                cy.log('indexing: ', index, $links.length - 1);

                // Skip "#" links and email links
                if (url.startsWith('#') || url.startsWith('mailto:') || url == '') {
                    return;
                }

                if (okLinks.includes(url)) {
                    cy.log('link previously verified');
                    return;
                }

                // Make a request to the link and check if it returns a 200 status code
                const request = cy.request({
                    url: url,
                    failOnStatusCode: false,
                    timeout: 30000
                })
                    .then((response) => {
                        if (response.status !== 200 && response.status !== 401) {
                            cy.log('logged broken link');
                            brokenLinks.push({ text: $link.text, url: url, status: response.status });
                        } else {
                            okLinks.push(url)
                        }
                    });

                requests.push(request);
            });

            return Cypress.Promise.all(requests);
        })
        .then(() => {
            finishTest(brokenLinks, pageUrl, allBrokenLinks);
        });

            // finishTest(brokenLinks, pageUrl, allBrokenLinks);
        })
        
        
        // if (i>3){
        //     return false;
        // }
        return true;
    });

  

    after(() => {
        if (allBrokenLinks.length!=0){
            let report = allBrokenLinks.map((entry) => {
                let brokenLinksString = entry.brokenLinks.map((brokenLink) => {
                    return `  Text: ${brokenLink.text}\n  URL: ${brokenLink.url}\n  Status: ${brokenLink.status}\n`;
                }).join('\n');
                return `Page: ${entry.page}\nBroken Links:\n${brokenLinksString}`;
            }).join('\n\n');

            cy.writeFile('cypress/e2e/broken-links-report/report.txt', report);
        }
    })
}

function finishTest(brokenLinks, pageUrl, allBrokenLinks) {
    cy.log('finishTest, brokenLinks.length: ',brokenLinks,typeof(brokenLinks),Object.keys(brokenLinks).length, JSON.stringify(brokenLinks), Array.isArray(brokenLinks))
    if ( Object.keys(brokenLinks).length> 0) {
        cy.log('pushing report item: ', JSON.stringify({ 'page': pageUrl, 'brokenLinks': brokenLinks }))
        allBrokenLinks.push({ 'page': pageUrl, 'brokenLinks': brokenLinks });
    }
    cy.wait(100);
    expect(brokenLinks).to.be.empty;
}

describe('broken-link-checker',  () =>{
    runTests(Cypress.env('sitemapUrls'));
});