import { __ } from '@wordpress/i18n';

import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';

export default function Edit(props) {
  const {
    attributes,
    setAttributes,
  } = props;

  const blockProps = useBlockProps();

  const onChange_content = (newContent) => {
    setAttributes({ content: newContent });
  };

  const onChange_title = (newContent) => {
    setAttributes({ title: newContent });
  };
  const [isActive, setIsActive] = wp.element.useState(false);

  return (
    // <div className="dmccordian">
    //   <div className="accordion">
    //     <div className="accordion-item">
    //       <div
    //         className="accordion-title"
    //         onClick={() => setIsActive(!isActive)}
    //       >
    //         <div>
    //           {/* <RichText
    //           {...blockProps}
    //           tagName="h2"
    //           onChange={onChangeBannerTitle}
    //           value={bannerTitle} /> */}
    //           Title
    //         </div>
    //         <div>{isActive ? '-' : '+'}</div>
    //       </div>
    //       {<div className="accordion-content" style={{display: isActive ? "block" : "none"}}><RichText
    //         {...blockProps}
    //         tagName="p"
    //         value={ attributes.message }
    //         onChange={ ( val ) => setAttributes( { content: val } )}
    //       /></div>}
    //     </div>
    //   </div>

    // </div>
    <div className="ant-collapse ant-collapse-icon-position-right" {...blockProps}>
      <div className="ant-collapse-item ant-collapse-item-active sc-elYLMi foWTyR PanelStyled">
        <div className="ant-collapse-header" role="button" tabindex="0" aria-expanded="true">
          <div>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" className="svg-inline--fa fa-chevron-down ant-collapse-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ "fontSize": "35px", "paddingTop": "6px", "paddingBottom": "6px", "top": "12px" }}><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z">
            </path>
            </svg>
          </div>
          <RichText
            {...blockProps}
            tagName="p"
            value={attributes.title}
            onChange={(val) => setAttributes({ title: val })}
          />
        </div>
        <div className="ant-collapse-content ant-collapse-content-active">
          <div className="ant-collapse-content-box">
            <div className="sc-gkJlnC jCWRHs parsedHTML">
              <InnerBlocks></InnerBlocks>
              {/* <RichText className="content-banner-short-text"
                tagName="div"
                value={attributes.content}
                allowedFormats={[]}
                onChange={onChange_content}
                placeholder={'Banner short text'}
              ></RichText> */}
            </div>
          </div>
        </div>
      </div>
    </div>);
}