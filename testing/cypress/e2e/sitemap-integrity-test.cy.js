const urlSlug = require('url-slug');

// Run Cypress tests with the fetched URLs
  function runTests(urls) {
    let i = 0;
    urls.every((url) =>  {
        i++;
        cy.log('running test for: ', url);
        cy.visit(url);

        // Check for the presence of an H1 element
        cy.get('h1')
        .should('be.visible')
        .and('have.length', 1);

        // Check for the presence of at least 1 paragraph
        cy.get('p')
        .should('be.visible')
        .and(($p) => {
            expect($p).to.have.length.at.least(1);
        });

        // if (i>2){
        //     return false;
        // }
        return true;
    });
}

function main(urls) {
  runTests(Cypress.env('sitemapUrls'));
};

describe('sitemap-test',  () =>{
    
    it('validateSitemap', ()=>{
        main();
    })
});