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
      <div style={{'border': '2px solid rgb(35 64 117)','paddingTop': '8px', 'position':'relative'}}>
        <style>
          {
            `
            .condFieldEdit{
              background: rgb(242 242 242); 
              display: inline-block; 
              padding-right:5px;
            }
            `
          }
        </style>
        <div style={{'position': 'absolute', 'top': '-14px', 'paddingBottom': '5px'}}>
          <p style={{'background': 'rgb(242 242 242)','marginLeft': '9px', 'width': '227px', 'display': 'inline-block', 'paddingLeft':'5px'}}>Render if custom field exists:</p>
          <RichText
          className="condFieldEdit"
          tagName="p"
          onChange={ onChange_content }
          value={ attributes.content }
          allowedFormats={ [  ] }
          placeholder={ 'custom field name' }/>

{/* <RichText className="h1-heading"
      tagName="h1"
      value={ attributes.content }
      allowedFormats={ [  ] }
      onChange={ onChange_content }
      placeholder={ 'Heading...' }
    ></RichText> */}
        </div>    
        <InnerBlocks></InnerBlocks>
      
      </div>
  	);
  }