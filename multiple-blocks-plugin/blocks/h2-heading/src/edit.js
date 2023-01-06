import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

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
    
    const onChange_bannerTitle = ( newContent ) => {
      setAttributes( { bannerTitle: newContent } );
    };
    
    return (
  <RichText className="sc-BeQoi sc-olbas iwFZjo iISgDu heading"
      tagName="h2"
      value={ attributes.content }
      allowedFormats={ [  ] }
      onChange={ onChange_content }
      placeholder={ 'Heading...' }
    ></RichText>
  	);
  }