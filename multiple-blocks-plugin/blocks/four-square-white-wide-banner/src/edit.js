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
<div style="background-color: rgb(255, 255, 255);">
  <div class="sc-cCsOjp sc-efBctP itMmZS kEKisT fourColBanner horizontalAlignment pageContainer container" style="padding-top: 20px; padding-bottom: 15px; background-color: rgb(255, 255, 255);">
    <div class="row">
      <div class="col-md-6 col-lg-6">
        <div class="ant-card ant-card-bordered sc-fvNpTx cCtazp cardRound">
          <div class="ant-card-body">
            <div style="background-color: rgb(255, 255, 255);">
              <h2 class="sc-kgUAyh pzOcJ heading" style="line-height: 1.2;">#DigitalBC Livestream</h2>
              <a href="https://eepurl.us3.list-manage.com/subscribe?u=2cd8863adab4f39ade7cbee34&amp;id=b331c22b50" target="_blank" class="sc-kDDrLX eNdiPm ExternalLinkButton" style="max-width: 160px; margin-bottom: 0px; display: block;">Subscribe</a>
              <div style="margin-top: 16px;">
                <div style="width: fit-content;">
                  <a href="https://www.youtube.com/playlist?list=PL9CV_8JBQHiqpIJZd7V4stSAwo4jxfJ9b" target="_blank" rel="noreferrer">
                    <p style="margin-bottom: 4px;">Watch past broadcasts on</p>
                    <img alt="YouTube" src="/static/media/yt_logo_rgb_light.a676ea31.png" style="height: 20px; width: 80px;"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-6">
        <div class="ant-card ant-card-bordered sc-fvNpTx cCtazp cardRound">
          <div class="ant-card-body">
            <h2 class="sc-kgUAyh pzOcJ heading" style="line-height: 1.2;">Digital Trust</h2>
            <p>A new, empowering solution to digital identity and communication.</p>
            <p>Visit the <a href="/digital-trust" class="sc-hHLeRK dvbaVe externalLink">BC Gov Digital Trust site</a>
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-6">
        <div class="ant-card ant-card-bordered sc-fvNpTx cCtazp cardRound">
          <div class="ant-card-body">
            <h2 class="sc-kgUAyh pzOcJ heading" style="line-height: 1.2;">Marketplace</h2>
            <p>Discover unique opportunities to collaborate with the BC Public Sector.</p>
            <p>Visit the <a href="https://marketplace.digital.gov.bc.ca/" class="sc-hHLeRK dvbaVe externalLink">Digital Marketplace</a> to find Code with Us and Sprint with Us opportunities </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-6">
        <div class="ant-card ant-card-bordered sc-fvNpTx cCtazp cardRound">
          <div class="ant-card-body">
            <h2 class="sc-kgUAyh pzOcJ heading" style="line-height: 1.2;">Feedback</h2>
            <p>Understanding your experience with digital.gov.bc.ca will help us develop it into a trusted wayfinding service. Please <a href="https://digital-feedback.apps.silver.devops.gov.bc.ca/" class="sc-hHLeRK dvbaVe externalLink">give us your feedback</a>. </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  	);
  }