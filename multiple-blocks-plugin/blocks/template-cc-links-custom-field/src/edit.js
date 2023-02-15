import { __ } from '@wordpress/i18n';
  import { useBlockProps, RichText, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
  import { TextControl } from "@wordpress/components";

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    const blockProps = useBlockProps();

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };

    const setFieldName = ( newContent ) => {
      setAttributes( { field_name: newContent } );
    };

    return (
      <div {...blockProps}>
      <div style={{"marginBottom": "67px"}} role="navigation" aria-label="on this page">
      <div className="row">
        <div className="col-xs-12">
          <h2 aria-hidden="true" className="h2-heading">On this page</h2>
        </div>
      </div>
      <div className="row between-xs">
        <div className="col-sm-2">
          <a href="#" className="sc-bBrHrO kxVFkV">Overview</a>
        </div>
        <div className="col-sm-2">
          <a href="#" className="sc-bBrHrO kxVFkV">Why should I use this?</a>
        </div>
        <div className="col-sm-2">
          <a href="#" className="sc-bBrHrO kxVFkV">Who else is using this?</a>
        </div>
        <div className="col-sm-2">
          <a href="#" className="sc-bBrHrO kxVFkV">About Common Component</a>
        </div>
        <div className="col-sm-2">
          <a href="#" className="sc-bBrHrO kxVFkV">Getting started</a>
        </div>
        <div className="col-sm-2">
          <a href="#" className="sc-bBrHrO kxVFkV">Support</a>
        </div>
      </div>
      <InspectorControls>
				<TextControl
					label={__("Field Name")}
					onChange={setFieldName}
					value={attributes.field_name}
				/>
			</InspectorControls>
    </div>
    </div>
  	);
  }