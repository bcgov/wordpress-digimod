import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
  // <RichText.Content className="undefined"
  //   tagName="div"
  //   value={ props.attributes.content }
  // ></RichText.Content>
  <div className="wp-block-group alignwide">
      <div id="main-content-anchor" className="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
        <div className="row middle-xs">
            <InnerBlocks.Content></InnerBlocks.Content>
        </div>
      </div>
    </div>
  	)
  }