import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps();
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );
	const bookTitle = meta[ '_digital_gov_book_title' ];
	const updateBookTitleMetaValue = ( newValue ) => {
		console.log("setting status: " + newValue);
		setMeta( { ...meta, _digital_gov_book_title: newValue } );
		dispatch( 'core/editor' ).editPost( { status: newValue } );

    };
  return (
		<>
			<InspectorControls>
				<PanelBody 
					title={ __( 'Workflow Details' )}
					initialOpen={true}
				>
					<PanelRow>
						<fieldset>
							<TextControl
								label={__( 'PageStatus' )}
								value={ pageStatus }
								onChange={ updatePageStatusMetaValue }
							/>
						</fieldset>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<RichText 
					tagName="h3"
					onChange={ updateBookTitleMetaValue }
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
					value={ bookTitle }
					placeholder={ __( 'Write your text...' ) }
				/>
return (
        <SelectControl
            label="Page Status"
            value={ pageStatus }
            options={ [
                { label: 'Publish', value: 'Publish' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Updating', value: 'Updating' },
            ] }
            onChange={ ( newStatus ) => setStatus( newStatus ) }
            __nextHasNoMarginBottom
        />
			</div>
		</>
	);
}