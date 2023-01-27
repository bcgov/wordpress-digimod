import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
    <div className="row" style={{"marginTop": "30px"}}>
      <div className="col-xs-12" style={{"flexBasis": "auto"}}>
        <div className="ExternalLinkButton">
          <RichText.Content
          tagName="p"
          value={ props.attributes.content }
          ></RichText.Content>
          <RichText.Content
          tagName="p"
          value={ props.attributes.url }
          ></RichText.Content>
        </div>
      </div>
    </div>
  	)
  }