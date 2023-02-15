import {
    createNewPost,
    enablePageDialogAccept,
    insertBlock,
    getEditedPostContent
} from '@wordpress/e2e-test-utils';

describe( 'Two columns block', () => {
    jest.setTimeout(60000);

    beforeAll( async () => {
        await enablePageDialogAccept();
    } );
    beforeEach( async () => {
        await createNewPost();
    } );

    it( 'Two columns block should be available', async () => {
        await insertBlock( 'two-columns' );
		// Check if block was inserted
        
		expect( await page.$( '[data-type="multiple-blocks-plugin/two-columns"]' ) ).not.toBeNull();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );