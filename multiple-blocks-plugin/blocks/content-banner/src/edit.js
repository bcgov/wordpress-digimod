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
    
    const onChange_title = ( newContent ) => {
      setAttributes( { title: newContent } );
    };
    
    const MY_TEMPLATE = [
      // [ 'core/image', {} ]
      // [ 'core/image', {} ],
      ['multiple-blocks-plugin/dm-content-banner-content', {}],
     
      ['multiple-blocks-plugin/dm-content-banner-image', {} ]
  ];

    return (
  // <RichText className="undefined"
  //     tagName="div"
  //     value={ attributes.content }
  //     allowedFormats={ [  ] }
  //     onChange={ onChange_content }
  //     placeholder={ 'Heading...' }
  //   ></RichText>
    <div className="wp-block-group alignwide">
      <div id="main-content-anchor" className="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
        

        <div className="row middle-xs">
          <InnerBlocks template={ MY_TEMPLATE } templateLock="all" />

          {/* <div className="col-sm-12 col-md-6">
            <div className="sc-jOhDuK jXeQNE sideImageText">
              <RichText className="wp-block-post-title"
                    tagName="h1"
                    value={ attributes.title }
                    allowedFormats={ [  ] }
                    onChange={ onChange_title }
                    placeholder={ 'Banner title' }
                  ></RichText>

              <RichText className="sc-eKBdFk hhA-dJm subTitle"
                    tagName="div"
                    value={ attributes.content }
                    allowedFormats={ [  ] }
                    onChange={ onChange_content }
                    placeholder={ 'Banner short text.' }
                  ></RichText>
            </div>
          </div>

          <div className="col-sm-12 col-md-6">
            <InnerBlocks template={ MY_TEMPLATE } templateLock="all" />
          </div> */}

        </div>


      </div>
    </div>
  	);
  }