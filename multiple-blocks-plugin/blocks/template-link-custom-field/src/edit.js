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
    const onChange_linkText = ( newContent ) => {
      setAttributes( { linkText: newContent } );
    };
    
    return (
        <p style={{"color":"#1890ff"}}>
            <RichText 
          tagName="div"
          value={ attributes.content }
          allowedFormats={ [  ] }
          onChange={ onChange_content }
          placeholder={ 'Link custom field...' }
        ></RichText>
        <RichText 
          tagName="div"
          value={ attributes.linkText }
          allowedFormats={ [  ] }
          onChange={ onChange_linkText }
          placeholder={ 'Link text...' }
        ></RichText>
        <RichText 
          tagName="div"
          value={ attributes.url }
          allowedFormats={ [  ] }
          onChange={ onChange_url }
          placeholder={ 'Link URL..' }
        ></RichText>
      </p>

  	);
  }