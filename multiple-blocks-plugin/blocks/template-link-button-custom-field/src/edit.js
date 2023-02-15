import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks , InspectorControls } from '@wordpress/block-editor';
  import { TextControl } from "@wordpress/components";

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    // const blockProps = useBlockProps();

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };
    const onChange_url = ( newContent ) => {
      setAttributes( { url: newContent } );
    };
    
    return (
      <div className="row" style={{"marginTop": "30px"}}>
        <div className="col-xs-12" style={{"flexBasis": "auto"}}>
          <div className="ExternalLinkButton">
                <RichText 
              tagName="div"
              value={ attributes.content }
              allowedFormats={ [  ] }
              onChange={ onChange_content }
              placeholder={ 'Button text...' }
            ></RichText>
            <InspectorControls>
				<TextControl
					label="Field Name"
					onChange={onChange_url}
					value={attributes.url}
				/>
			</InspectorControls>
      
          </div>
        </div>
      </div>
     

  	);
  }