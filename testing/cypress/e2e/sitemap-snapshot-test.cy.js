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
    const snapshotsPath = urlSlug.convert('snapshots_for_'+wordpressSiteUrl);
    let snapshotName = {'slug':''};
   
    let actualHtml = '';

    let fileContent_v={'value':'value'};
    let actualHtml_v={'value':'value'};

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
    
          let diffReport = Diff.createTwoFilesPatch('original', 'actual', fileContent_v['value'], actualHtml_v['value']);
    
          cy.writeFile('cypress/e2e/snapshots-report/' + snapshotName.slug + '.diff.txt', diffReport);
          cy.writeFile('cypress/e2e/snapshots-report/' + snapshotName.slug + '.expected.txt', fileContent_v['value']);
          cy.writeFile('cypress/e2e/snapshots-report/' + snapshotName.slug + '.actual.txt', actualHtml_v['value']);
        }
    });

    urls.every((url) =>  {
        i++;
        it('snapshot test for '+url, ()=>{
            snapshotName.slug = urlSlug.convert(url);
            Cypress.env('snapshotName', snapshotName.slug);
            cy.task('readFileMaybe2', 'cypress/e2e/'+snapshotsPath+'/'+snapshotName.slug+'.json').then((fileContents) => { 

            // cy.readFile('cypress/e2e/'+snapshotsPath+'/'+snapshotName.slug+'.json').then((fileContents)=>{
                let fileContent = '';
                if (fileContents)
                    fileContent = JSON.parse(fileContents).html;
                else
                    fileContent = null;

                fileContent_v['value'] = fileContent;
                // cy.log('fileContents: ', fileContents);
                // cy.log('fileContent_v: ', fileContent_v);


                Cypress.on('fail', (error, runnable) => {

                    // let diffReport=Diff.createTwoFilesPatch('original', 'actual', fileContent.html, actualHtml)

                    // cy.writeFile('cypress/e2e/snapshots-report/'+snapshotName.slug+'.diff.txt',diffReport);
                    // cy.writeFile('cypress/e2e/snapshots-report/'+snapshotName.slug+'.expected.txt',fileContent.html);
                    // cy.writeFile('cypress/e2e/snapshots-report/'+snapshotName.slug+'.actual.txt',actualHtml);

                    throw new Error('snapshot comparison failed for: '+snapshotName.slug);
                    // throw error;
                })
                
                
                cy.log('running test for: ', url);
                cy.visit(url);
                cy.get('.back-to-top', { timeout: 10000 }); // need to wait for this element because it appears after a delay
                cy.wait(500);

                cy.document().then((doc) => {
                    const bodyContent = doc.body.innerHTML;
                    const beautifiedHtml = beautify(bodyContent, options);
                    actualHtml = beautifiedHtml;
                    actualHtml_v['value']=actualHtml;
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

describe('snapshot-test',  () =>{
   main();
});