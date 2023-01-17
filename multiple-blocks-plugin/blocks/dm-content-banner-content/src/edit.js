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
    
    const MY_TEMPLATE = [
      [ 'core/post-title', {'level':1} ]
    ]

    return (
<div class="col-sm-12 col-md-6">
  <div>
    <InnerBlocks template={ MY_TEMPLATE } templateLock="all"></InnerBlocks>
    <RichText className="content-banner-short-text"
      tagName="div"
      value={ attributes.content }
      allowedFormats={ [  ] }
      onChange={ onChange_content }
      placeholder={ 'Banner short text' }
    ></RichText>
  </div>
</div>
	);
  }