import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


export default function save(props) {
  const blockProps = useBlockProps.save();

  return (
    <div react-component="CollapseStyled">
      <div react-component="PanelStyled" header={props.attributes.title}>
        <div react-component="StyleRichText" assign-inner-content-to-prop="htmlOrMarkdown"><InnerBlocks.Content></InnerBlocks.Content></div>
      </div>
    </div>
  );
}