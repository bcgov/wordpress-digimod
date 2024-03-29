const urlSlug = require('url-slug');


// Run Cypress tests with the fetched URLs
  function runTests(urls) {
    let i = 0;
    const wordpressSiteUrl = Cypress.env('baseUrl');
    const screenshotPath = "cypress/e2e/"+ urlSlug.convert('screenshots_for_'+wordpressSiteUrl);
    urls.every((url) =>  {
        i++;
        
        // if (i<65)
        //     return true;

        // url = 'https://wodpress-version-bump.apps.silver.devops.gov.bc.ca/cloud/public-cloud/';
       

        it('screenshot test for '+url, ()=>{
            cy.viewport(1440, 900);		//Upped to 1440 to check for mmenu header not full width issue.
             // // remove all js scripts
            // cy.intercept('*', (req) => {
            //     req.continue((res) => {
                    
            //        // Modify the HTML response to include the CSP without affecting the existing head content
            //         res.body = res.body.replace(
            //             /(<head[^>]*>)/,
            //             `$1<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none';">`
            //         );

            //         // Create a DOM parser to manipulate the HTML content
            //         const parser = new DOMParser();
            //         const doc = parser.parseFromString(res.body, 'text/html');

            //         // Remove all <script> elements from the <head> and <body> sections
            //         const scriptElements = doc.querySelectorAll('script');
            //         scriptElements.forEach((script) => script.remove());

            //         // Serialize the modified HTML back to a string
            //         const serializer = new XMLSerializer();
            //         res.body = serializer.serializeToString(doc);
            //     });
            //   });
        
            cy.log('running test for: ', url);
            cy.visit(url, {
                failOnStatusCode:false,
                onBeforeLoad(win) {
                    // Add a style element to the head of the document
                    const styleElement = win.document.createElement('style');
                    styleElement.innerHTML = 'html { scroll-behavior: auto !important; }';
                    win.document.head.appendChild(styleElement);
                },
                onLoad(win){
                    let doc = win.document;

                    
                    const formExists = Cypress.$('form[name="loginform"]', doc).length > 0;

                    if (formExists){
                        // cy.log("Login form present, skipping test..");
                        return true;
                    }


		    //Only proceed if we are still on the website, not redirected somewhere else, like SSO
	 	    cy.url().should('eq',url);


                    cy.get('.back-to-top', { timeout: 10000 });

                    cy.document().then((doc) => {

                        // Remove all images todo: for some reason lazy images are still loading in lazy fashion even with attribute removed, causing inconsistent screenshots
                        const imgElements = doc.querySelectorAll('img');
                        imgElements.forEach((element) => element.remove());

                        // Remove all elements with class 'is-type-video'
                        const videoElements = doc.querySelectorAll('.is-type-video');
                        videoElements.forEach((element) => element.remove());

                        // remove back to top button since it appears to crop up in inconsistent spots
                        
                        const backToTop = doc.querySelectorAll('.back-to-top');
                        backToTop.forEach((element) => element.remove());
                        

                        cy.wait(100) // for some reason needed to prevent js error on host page crashing the test..

                        // Find all images with loading="lazy" attribute and remove the attribute
                        // otherwise images may not load properly on screenshots
                        // cy.get('img[loading="lazy"]').each(($img) => {
                        //     // Use the 'invoke' command to manipulate the DOM element
                        //     cy.wrap($img).invoke('removeAttr', 'loading');
                        // });

                        // Find all images with loading="lazy" attribute using jQuery
                        const lazyImgs = doc.querySelectorAll('img[loading="lazy"]');

                        // If there are images with the "lazy" attribute
                        if (lazyImgs.length) {
                            // Remove the attribute from each image
                            lazyImgs.forEach(($img) => {
                                $img.removeAttribute('loading');
                            });
                        }

                        // Find all images with decoding="async" attribute using jQuery
                        const asyncImgs = doc.querySelectorAll('img[decoding="async"]');

                        // If there are images with the "lazy" attribute
                        if (asyncImgs.length) {
                            // Remove the attribute from each image
                            asyncImgs.forEach(($img) => {
                                $img.removeAttribute('decoding');
                            });
                        }
                    

                        // Perform additional checks or actions after all images have loaded
                        cy.log('All images have loaded successfully.');
                        

                        //force wait for ajax content to load if we find a app div which is usually vue content
                        const vueAppDiv = doc.querySelectorAll('#app');
                        if (vueAppDiv.length) {
				cy.wait(2000); 
                        }



                        cy.matchImage({
                            // screenshotConfig: {
                            //     blackout: ['img']
                            // },

                            maxDiffThreshold: 0.1,
                            title: urlSlug.convert(url),
                            imagesPath: screenshotPath
                        });

                        
                    
                    });
                 }
            });

        })

        // if (i>1){
        //     return false;
        // }
        return true;
    });
}

describe('screenshot-test',  () =>{
    runTests(Cypress.env('sitemapUrls'));
});