const urlSlug = require('url-slug');
const beautify = require('js-beautify').html;
const Diff = require('diff');

// Set the options for beautification
const options = {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 1,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    wrap_line_length: 0,
    unformatted: ['pre', 'code'],
    extra_liners: ['head', 'body', '/html'],
    eol: '\n'
};



// Run Cypress tests with the fetched URLs
  function runTests(urls) {
    let i = 0;
    const wordpressSiteUrl = Cypress.env('baseUrl');
    const snapshotsPath = urlSlug.convert('mobile_snapshots_for_'+wordpressSiteUrl);
    let snapshotName = {'slug':''};
    let fileContent = '';
    let actualHtml = '';

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
    
          let diffReport = Diff.createTwoFilesPatch('original', 'actual', fileContent, actualHtml);
    
          cy.writeFile('cypress/e2e/mobile-snapshots-report/' + snapshotName.slug + '.diff.txt', diffReport);
          cy.writeFile('cypress/e2e/mobile-snapshots-report/' + snapshotName.slug + '.expected.txt', fileContent);
          cy.writeFile('cypress/e2e/mobile-snapshots-report/' + snapshotName.slug + '.actual.txt', actualHtml);

        //   cy.writeFile(snapshotName.slug+'.txt', fileContent);
        }
    });

    urls.every((url) =>  {
        i++;
        it('snapshot test for '+url, ()=>{
            cy.viewport(375, 667);
            snapshotName.slug = urlSlug.convert(url);
            Cypress.env('snapshotName', snapshotName.slug);
            cy.readFile('cypress/e2e/'+snapshotsPath+'/'+snapshotName.slug+'.json').then((fileContents)=>{
                
                fileContent = fileContents.html;
                Cypress.on('fail', (error, runnable) => {

                    // let diffReport=Diff.createTwoFilesPatch('original', 'actual', fileContent.html, actualHtml)

                    // cy.writeFile('cypress/e2e/snapshots-report/'+snapshotName.slug+'.diff.txt',diffReport);
                    // cy.writeFile('cypress/e2e/snapshots-report/'+snapshotName.slug+'.expected.txt',fileContent.html);
                    // cy.writeFile('cypress/e2e/snapshots-report/'+snapshotName.slug+'.actual.txt',actualHtml);

                    throw new Error('snapshot comparison failed for: '+snapshotName.slug);
                })
                
                
                cy.log('running test for: ', url);
                cy.visit(url);
                cy.document().then((doc) => {
                    const bodyContent = doc.body.innerHTML;
                    const beautifiedHtml = beautify(bodyContent, options);
                    actualHtml = beautifiedHtml;

                    // Perform assertions or any other operations you need with the body content as a string
                    
                    cy.wrap({ html: beautifiedHtml }).snapshot("test",{
                        snapshotName: snapshotName.slug,
                        snapshotPath: 'cypress/e2e/'+snapshotsPath,
                        json: true                           
                    });
                });
                
                // cy.request(url).its('body', {log: false}).then(text => {
                //     cy.wrap({ html: text }).snapshot("test",{
                //             snapshotName: urlSlug.convert(url),
                //             snapshotPath: 'cypress/e2e/'+snapshotsPath,
                //             json: true                           
                //         });
                // });
            });
        })
        // if (i>2){
        //     return false;
        // }
        return true;
    })
}

function main(urls) {
  runTests(Cypress.env('sitemapUrls'));
};

describe('mobile-snapshot-test',  () =>{
    
   main();
});