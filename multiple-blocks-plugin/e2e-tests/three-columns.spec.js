import {
    createNewPost,
    enablePageDialogAccept,
    insertBlock,
    getEditedPostContent
} from '@wordpress/e2e-test-utils';

describe( 'Three columns block', () => {
    jest.setTimeout(60000);

    beforeAll( async () => {
        await enablePageDialogAccept();
    } );
    beforeEach( async () => {
        await createNewPost();
    } );

    it( 'Three columns block should be available', async () => {
        await insertBlock( 'three-columns' );
		// Check if block was inserted
        
		expect( await page.$( '[data-type="multiple-blocks-plugin/three-columns"]' ) ).not.toBeNull();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );