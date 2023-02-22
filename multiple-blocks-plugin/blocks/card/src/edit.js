import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    const blockProps = useBlockProps({
      className:"ant-card ant-card-bordered dm-card"
    });

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };
    
    const onChange_bannerTitle = ( newContent ) => {
      setAttributes( { bannerTitle: newContent } );
    };
    
    return (
<div {...blockProps}>
  <div class="ant-card-body">
    <div class="cardText">
      <div>
        <InnerBlocks></InnerBlocks>
      </div>
    </div>
  </div>
</div>
	);
  }