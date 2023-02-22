import {
    createNewPost,
    enablePageDialogAccept,
    insertBlock,
    getEditedPostContent
} from '@wordpress/e2e-test-utils';

describe( 'Pros and cons block', () => {
    jest.setTimeout(60000);

    beforeAll( async () => {
        await enablePageDialogAccept();
    } );
    beforeEach( async () => {
        await createNewPost();
    } );

    it( 'Pros and cons block should be available', async () => {
        await insertBlock( 'pros-and-cons' );
		// Check if block was inserted
        
		expect( await page.$( '[data-type="multiple-blocks-plugin/pros-and-cons"]' ) ).not.toBeNull();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );