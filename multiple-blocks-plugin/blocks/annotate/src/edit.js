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
  <div class="dmAnnotate" {...blockProps}>
    <RichText className="undefined"
      tagName="div"
      value={ attributes.content }
      onChange={ onChange_content }
      placeholder={ 'Annotation...' }
    ></RichText>
  </div>
  	);
  }