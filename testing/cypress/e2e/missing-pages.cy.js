// Run Cypress tests with the fetched URLs
  function runTests(urls) {
    let i = 0;
    urls.every((url) =>  {
        i++;
        cy.log('running test for: ', url);
       
         cy.request({ url: url, failOnStatusCode: false }).its('status').should((status) => {
            expect(status).to.satisfy((code) => {
                return code === 200 || (code >= 300 && code < 400);
            }, `Expected status to be 200 or 3xx, but got ${status}`);
        });
        return true;
    });
}

function main() {
  runTests(Cypress.env('missingUrls'));
};

describe('missing-pages-test',  () =>{
    
    // check that pages that are now missing have redirects setup
    it('validateSitemap', ()=>{
        main();
    })
});