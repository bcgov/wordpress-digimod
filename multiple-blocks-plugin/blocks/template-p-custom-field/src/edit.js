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
    
    return (
      <RichText
      tagName="p"
      value={ attributes.content }
      allowedFormats={ [  ] }
      onChange={ onChange_content }
      placeholder={ 'paragraph...' }
    ></RichText>
        // <RichText
        // placeholder={ 'Heading...' }
        // className="h1-heading"
        // // { ...blockProps }
        // tagName="h1"
        // allowedFormats={ [  ] }
        // onChange={ onChange_content }
        // value={ attributes.content }/>
  	);
  }