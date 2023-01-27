import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

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
            <RichText 
              tagName="div"
              value={ attributes.url }
              allowedFormats={ [  ] }
              onChange={ onChange_url }
              placeholder={ 'custom field url..' }
            ></RichText>
          </div>
        </div>
      </div>
     

  	);
  }