import {
    createNewPost,
    enablePageDialogAccept,
    insertBlock,
    getEditedPostContent
} from '@wordpress/e2e-test-utils';

describe( 'Annotate block', () => {
    jest.setTimeout(60000);

    beforeAll( async () => {
        await enablePageDialogAccept();
    } );
    beforeEach( async () => {
        await createNewPost();
    } );

    it( 'Annotate block should be available', async () => {
        await insertBlock( 'annotate' );
		// Check if block was inserted
        
		expect( await page.$( '[data-type="multiple-blocks-plugin/annotate"]' ) ).not.toBeNull();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );