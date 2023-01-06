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
          <div className="col-sm-12 col-md-6">
            <div className="sc-jOhDuK jXeQNE sideImageText">
            <RichText.Content className="wp-block-post-title"
                  tagName="h1"
                  value={ props.attributes.title }
                ></RichText.Content>

            <RichText.Content className="sc-eKBdFk hhA-dJm subTitle"
                  tagName="div"
                  value={ props.attributes.content }
                ></RichText.Content>
            </div>
          </div>

          <div className="col-sm-12 col-md-6">
            <InnerBlocks.Content></InnerBlocks.Content>
          </div>
        </div>
      </div>
    </div>
  	)
  }