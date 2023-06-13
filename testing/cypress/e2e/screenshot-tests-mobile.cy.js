const urlSlug = require('url-slug');


// Run Cypress tests with the fetched URLs
  function runTests(urls) {
    let i = 0;
    const wordpressSiteUrl = Cypress.env('baseUrl');
    const screenshotPath = "cypress/e2e/"+ urlSlug.convert('mobile_screenshots_for_'+wordpressSiteUrl);
    urls.every((url) =>  {
        i++;
        
        // if (i<49)
        //     return true;

        // url = 'https://wodpress-version-bump.apps.silver.devops.gov.bc.ca/cloud/public-cloud/';
       

        it('screenshot test for '+url, ()=>{
            cy.viewport(375, 667);
            
            cy.log('running test for: ', url);
            cy.visit(url, {
                onBeforeLoad(win) {
                    // Add a style element to the head of the document
                    const styleElement = win.document.createElement('style');
                    styleElement.innerHTML = 'html { scroll-behavior: auto !important; }';
                    win.document.head.appendChild(styleElement);
                },
            });

            cy.get('.back-to-top', { timeout: 10000 });



            cy.document().then((doc) => {
                // Remove all elements with class 'is-type-video'
                const videoElements = doc.querySelectorAll('.is-type-video');
                videoElements.forEach((element) => element.remove());

                // remove back to top button since it appears to crop up in inconsistent spots
                
                const backToTop = doc.querySelectorAll('.back-to-top');
                backToTop.forEach((element) => element.remove());
                

                cy.wait(100) // for some reason needed to prevent js error on host page crashing the test..

                // Find all images with loading="lazy" attribute and remove the attribute
                // otherwise images may not load properly on screenshots
                const lazyImgs = doc.querySelectorAll('img[loading="lazy"]');

                // If there are images with the "lazy" attribute
                if (lazyImgs.length) {
                    // Remove the attribute from each image
                    lazyImgs.forEach(($img) => {
                        $img.removeAttribute('loading');
                    });
                }
              

                // Perform additional checks or actions after all images have loaded
                cy.log('All images have loaded successfully.');
                
                cy.matchImage({
                    // screenshotConfig: {
                    //     blackout: ['img']
                    // },
                    maxDiffThreshold: 0.0,
                    title: urlSlug.convert(url),
                    imagesPath: screenshotPath
                });

               
            });
            
        })

        // if (i>10){
            // return false;
        // }
        return true;
    });
}

describe('screenshot-test',  () =>{
    runTests(Cypress.env('sitemapUrls'));
});