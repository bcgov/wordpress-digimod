import {
    createNewPost,
    enablePageDialogAccept,
    insertBlock,
    getEditedPostContent
} from '@wordpress/e2e-test-utils';

describe( 'Accordion block', () => {
    jest.setTimeout(60000);

    beforeAll( async () => {
        await enablePageDialogAccept();
    } );
    beforeEach( async () => {
        await createNewPost();
    } );

    it( 'Accordion block should be available', async () => {
        await insertBlock( 'accordi' );
		// Check if block was inserted
        
		expect( await page.$( '[data-type="multiple-blocks-plugin/accordian"]' ) ).not.toBeNull();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );