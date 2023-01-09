import { parse } from '@wordpress/block-serialization-spec-parser';
import { parse as html_parse } from 'node-html-parser';
import fs from "fs";
import {execSync} from 'child_process'

let prototypes = [
  `<!-- wp:multiple-blocks-plugin/four-columns-text {"className":"cc", "content":"cc"} -->
  <div dm-type="rich-text" dm-name="content"> cc </div>
  <!-- /wp:multiple-blocks-plugin/four-columns-text -->`,

   `<!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3-text {"className":"cc", "content":"cc"} -->
  <div dm-type="rich-text" dm-name="content"> cc </div>
  <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3-text -->`,

  `<!-- wp:multiple-blocks-plugin/content-banner {"className":"cc", "content":"cc"} -->
  <div dm-type="rich-text" dm-name="content"> cc </div>
  <!-- /wp:multiple-blocks-plugin/h2-heading -->`,

  `<!-- wp:multiple-blocks-plugin/h2-heading {"className":"sc-BeQoi sc-olbas iwFZjo iISgDu heading", "content":"Section Title"} -->
  <div dm-type="rich-text" dm-name="content"> Section Title </div>
  <!-- /wp:multiple-blocks-plugin/h2-heading -->`,

  // note - this block should have a blank output in the save function - this is just for the editor only
  `<!-- wp:multiple-blocks-plugin/annotate {"content":"Supports to help you create or improve a digital service."} -->
  <div class="dmAnnotate">
    <div dm-type="rich-text" dm-name="content"> Supports to help you create or improve a digital service. </div>
  </div>
  <!-- /wp:multiple-blocks-plugin/annotate -->`,

`<!-- wp:multiple-blocks-plugin/dm-content-banner -->
<div id="main-content-anchor" class="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
  <div class="row middle-xs">
    <dm-inner></dm-inner>
  </div>
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-banner -->`,

`<!-- wp:multiple-blocks-plugin/dm-content-banner-content {"content":"Supports to help you create or improve a digital service."} -->
<div class="col-sm-12 col-md-6">
  <div class="sc-jOhDuK jXeQNE sideImageText">
    <!-- <h1 class="sc-hlnMnd iQLvBu bannerTitle" dm-type="rich-text" dm-name="bannerTitle">Products and Services</h1> -->
    <dm-inner></dm-inner>
    <div class="sc-eKBdFk hhA-dJm subTitle" dm-type="rich-text" dm-name="content"> Supports to help you create or improve a digital service. </div>
  </div>
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-banner-content -->`,

`<!-- wp:multiple-blocks-plugin/dm-content-banner-image -->
<div class="col-sm-12 col-md-6">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-banner-image -->`,

`<!-- wp:multiple-blocks-plugin/dm-content-block-container -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-block-container -->`,

`<!-- wp:multiple-blocks-plugin/dm-col-sm-12 -->
<div class="col-sm-12">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-col-sm-12 -->`,

`<!-- wp:multiple-blocks-plugin/dm-row -->
<div class="row">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-row -->`,

`<!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
<div class="col-sm-12 col-md-3">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->`,

`<!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-6 -->
<div class="col-sm-12 col-md-6">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-6 -->`,

`<!-- wp:multiple-blocks-plugin/dm-4-cols -->
<div class="row">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-4-cols -->`,

`<!-- wp:multiple-blocks-plugin/dm-3-cols -->
<div class="row">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-3-cols -->`,

`<!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
<div class="col-sm-12 col-md-4">
  <dm-inner>
  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->`,

`<!-- wp:multiple-blocks-plugin/dm-card -->
<div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
  <div class="ant-card-body">
    <div class="cardText">
      <div>
        <dm-inner>
        </dm-inner>
      </div>
    </div>
  </div>
</div>
<!-- /wp:multiple-blocks-plugin/dm-card -->`,

`<!-- wp:multiple-blocks-plugin/card-image-header-content -->
<div class="row">
  <div class="sc-fvNpTx fXvxkj cardHorizontal">
    <dm-inner></dm-inner>
  </div>
</div>
<!-- /wp:multiple-blocks-plugin/card-image-header-content -->`,

`<!-- wp:multiple-blocks-plugin/card-image-header-content-image -->
<div class="sc-grREDI ehcsox cardHorizontalImage">
<dm-inner>
</dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/card-image-header-content-image -->`,

`<!-- wp:multiple-blocks-plugin/card-image-header-content-text -->
<div class="sc-bWXABl gFRdeg cardHorizontalText">
<dm-inner>
</dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/card-image-header-content-text -->`
];

// todo: dm-4-cols, dm-3-cols should be of the following format (include 4 columns and lock them)
// const BLOCK_TEMPLATE = [
//   ['image-slider', { width: 800, height: 400 }],
//   ['menu'],
// ];

// registerBlockType('peregrine/inner-block-demo', {

//   title: 'Inner Block Demo',

//   edit({ className }) {
//     return (
//       <div className={className}>
//         <InnerBlocks
//           template={BLOCK_TEMPLATE}
//           templateLock="all"
//         />
//       </div>
//     );
//   },

//   save() {
//     return (
//       <div>
//         <InnerBlocks.Content />
//       </div>
//     );
//   },
// });

{}

// todo: some rows had min-height, that was removed, what's the impact?
// todo: style attributes were removed - do not work with react

let html = `<!-- wp:multiple-blocks-plugin/dm-content-banner -->
<div id="main-content-anchor" class="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
  <div class="row middle-xs">
    <!-- wp:multiple-blocks-plugin/dm-content-banner-content {"content":"Supports to help you create or improve a digital service."} -->
    <div class="col-sm-12 col-md-6">
      <div class="sc-jOhDuK jXeQNE sideImageText">
        <!-- wp:post-title {"level":1} /-->
        <!-- <h1 class="sc-hlnMnd iQLvBu bannerTitle" dm-type="rich-text" dm-name="bannerTitle">Products and Services</h1> -->
        <div class="sc-eKBdFk hhA-dJm subTitle" dm-type="rich-text" dm-name="content"> Supports to help you create or improve a digital service. </div>
      </div>
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-content-banner-content -->
    <!-- wp:multiple-blocks-plugin/dm-content-banner-image -->
    <div class="col-sm-12 col-md-6">
      <!-- wp:image -->
      <figure class="wp-block-image"><img alt=""/></figure>
      <!-- /wp:image -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-content-banner-image -->
  </div>
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-banner -->

<!-- wp:multiple-blocks-plugin/dm-content-block-container -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
  <dm-inner>
    <!-- wp:multiple-blocks-plugin/dm-row -->
    <div class="row">
      <dm-inner>
        <!-- wp:multiple-blocks-plugin/dm-col-sm-12 -->
        <div class="col-sm-12">
          <dm-inner>
            <!-- wp:paragraph -->
              <p>Before you’re ready to create or improve a digital service, you will need to:</p>
            <!-- /wp:paragraph -->
          </dm-inner>
        </div>
        <!-- /wp:multiple-blocks-plugin/dm-col-sm-12 -->
      </dm-inner>
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-row -->

    <!-- wp:multiple-blocks-plugin/dm-4-cols -->
    <div class="row">
      <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <div class="col-sm-12 col-md-3">
        <dm-inner>
          <!-- wp:paragraph -->
            <p>Clearly define the <b>problems</b> you’re trying to solve, the <b>outcomes</b> you want to improve, or the <b>values</b> you want to deliver for the users of your service </p>
          <!-- /wp:paragraph -->
        </dm-inner>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <div class="col-sm-12 col-md-3">
        <dm-inner>
          <!-- wp:paragraph -->
            <p>Identify and consider <b>different technology approaches</b> you might pursue — for example, licensing a commercial digital product or building a custom application from scratch </p>
          <!-- /wp:paragraph -->
        </dm-inner>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <div class="col-sm-12 col-md-3">
        <dm-inner>
          <!-- wp:paragraph -->
            <p>Confirm <b>support and funding</b> to pursue your solution </p>
          <!-- /wp:paragraph -->
        </dm-inner>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
      <div class="col-sm-12 col-md-3">
        <dm-inner>
          <!-- wp:paragraph -->
            <p><b>Assemble a team</b> with the skills and capacity to deliver, test, improve, and maintain your digital service into the future</p>
          <!-- /wp:paragraph -->
        </dm-inner>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-4-cols -->

  </dm-inner>
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-block-container -->

<!-- wp:multiple-blocks-plugin/dm-content-block-container -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
  <!-- wp:multiple-blocks-plugin/dm-row -->
  <div class="row">
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12 -->
    <div class="col-sm-12">
      <!-- wp:heading {"level":2, "className":"sc-BeQoi sc-olbas iwFZjo iISgDu heading"} -->
        <h2 class="sc-BeQoi sc-olbas iwFZjo iISgDu heading">Here are some services to help you along this journey:</h2>
      <!-- /wp:heading -->
      <!-- wp:heading {"level":3, "className":"sc-hTtwUo sc-hiMGwR clKDgz fdhstP subHeading"} -->
        <h3 class="sc-hTtwUo sc-hiMGwR clKDgz fdhstP subHeading">Defining problems, outcomes, value</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
        <p>To truly improve something for people, it’s critical to take time to understand them and be clear about what you want to achieve.</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12 -->
  </div>
  <!-- /wp:multiple-blocks-plugin/dm-row -->

  <!-- wp:multiple-blocks-plugin/dm-3-cols -->
  <div class="row">
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
    <div class="col-sm-12 col-md-4">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p><a href="https://www2.gov.bc.ca/gov/content?id=4FB03369094247EF850BEFF8EFB201B3" class="sc-hHLeRK dvbaVe externalLink">The Service Design team</a> can help you discover and understand problems that currently exist with your service and where the best opportunities for improvement might lie.</p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
    <div class="col-sm-12 col-md-4">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>Consider if there are <a href="https://www2.gov.bc.ca/gov/content?id=1AE507FCE6A943199E9D2F8A7748B2B5" class="sc-hHLeRK dvbaVe externalLink">data and data services</a> that can enhance your research, analysis, and decision-making. </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
    <div class="col-sm-12 col-md-4">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>If you are trying to improve a <b>process</b>, <a href="https://www2.gov.bc.ca/gov/content?id=80D954CD54704A4C99E27D5B35037149" class="sc-hHLeRK dvbaVe externalLink">LeanBC</a> can help you identify areas for improvement as you apply the Lean continuous improvement philosophy. </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-4 -->
  </div>
  <!-- /wp:multiple-blocks-plugin/dm-3-cols -->
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-block-container -->

<!-- wp:multiple-blocks-plugin/dm-content-block-container -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
  <!-- wp:multiple-blocks-plugin/dm-row -->
  <div class="row">
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12 -->
    <div class="col-sm-12">
      <!-- wp:heading {"level":3, "className":"sc-hTtwUo sc-hiMGwR clKDgz fdhstP subHeading"} -->
      <h3 class="sc-hTtwUo sc-hiMGwR clKDgz fdhstP subHeading">Considering different technology approaches</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Depending on the complexity of your problem, you may apply a variety of methods to discover appropriate solutions. If your challenge is complex, you should take an Agile approach—that is, form a small team to incrementally build your solution, frequently testing it with users and reevaluating what should be done next. On the other hand, if your challenge is simple or complicated, adopting an existing solution with a bit of customization may meet your needs..</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12 -->
  </div>
  <!-- /wp:multiple-blocks-plugin/dm-row -->

  <!-- wp:multiple-blocks-plugin/dm-4-cols -->
  <div class="row">
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>If you are facing an urgent service delivery challenge due to COVID-19, connect with the Digital Delivery Network through the <a href="mailto:exchangelab@gov.bc.ca" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">Exchange Lab</a>, a community of digital experts who are working together to address urgent challenges. </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->

    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p><a href="https://www2.gov.bc.ca/gov/content?id=4FB03369094247EF850BEFF8EFB201B3" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">The Service Design team </a>can help you generate, prototype, and test ideas for improving your service before you decide to fully invest in a delivery team to build a new digital product.</p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->

    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>Gain a better understanding of solutions that already exist in the marketplace before you decide what to buy or build with the <a href="https://procurementconcierge.gov.bc.ca/" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">Procurement Concierge.</a>
              </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->

    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>If you are considering cloud storage or tools such as Salesforce, Service Now, MS Dynamics, or Microsoft Office, read about <a href="https://www2.gov.bc.ca/gov/content?id=7AAEDC2846904CBD963838A3392840BB" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">Cloud services.</a>
              </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
  </div>
  <!-- /wp:multiple-blocks-plugin/dm-4-cols -->

  <!-- wp:multiple-blocks-plugin/card-image-header-content -->
  <div class="row">
    <div class="sc-fvNpTx fXvxkj cardHorizontal">
      <!-- wp:multiple-blocks-plugin/card-image-header-content-image -->
      <div class="sc-grREDI ehcsox cardHorizontalImage">
        <!-- wp:image -->
        <figure class="wp-block-image"><img alt=""/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:multiple-blocks-plugin/card-image-header-content-image -->
      <!-- wp:multiple-blocks-plugin/card-image-header-content-text -->
      <div class="sc-bWXABl gFRdeg cardHorizontalText">
        <!-- wp:heading {"level":5, "className":"sc-eFWqGp inylga cardHorizontalTitle"} -->
        <h5 class="sc-eFWqGp inylga cardHorizontalTitle">Common Components</h5>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"sc-fctJkW jutyKU cardHorizonalDescription"} -->
        <p class="sc-fctJkW jutyKU cardHorizonalDescription">Reusable building blocks to create your product or service</p>
        <!-- /wp:paragraph -->
        <!-- wp:paragraph {"className":"sc-fctJkW jutyKU cardHorizonalDescription"} -->
        <p class="sc-fctJkW jutyKU cardHorizonalDescription"><a class="sc-kgflAQ imocyt internalLink" href="/common-components">View the collection</a></p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:multiple-blocks-plugin/card-image-header-content-text -->
    </div>
  </div>
  <!-- /wp:multiple-blocks-plugin/card-image-header-content -->
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-block-container -->

<!-- wp:multiple-blocks-plugin/dm-content-block-container -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
  <!-- wp:multiple-blocks-plugin/dm-row -->
  <div class="row">
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12 -->
    <div class="col-sm-12">
      <!-- wp:heading {"level":3, "className":"sc-hTtwUo sc-hiMGwR clKDgz fdhstP subHeading"} -->
      <h3 class="sc-hTtwUo sc-hiMGwR clKDgz fdhstP subHeading">Assembling and supporting your team</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Whatever technology solution you decide to pursue, you will need a team of people with all the skills necessary to implement and maintain it. Here are some services that can help you form that team and set them up for success.</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph -->
      <p>Here are some services that might help you at this stage.</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12 -->
  </div>
  <!-- /wp:multiple-blocks-plugin/dm-row -->

  <!-- wp:multiple-blocks-plugin/dm-4-cols -->
  <div class="row">
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p><a href="https://digital.gov.bc.ca/communities/bcdevexchange" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">The Exchange Lab</a> provides training, community, and digital service delivery residency programs that apply Agile and DevOps methods that can help you build your team.</p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>If you need to contract a team and want them to follow an Agile process, you can use the <a href="https://digital.gov.bc.ca/marketplace" target="_blank" class="sc-hHLeRK dvbaVe externalLink">Digital Marketplace.</a>
              </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>By requesting access to the B.C. Government’s <a href="https://developer.gov.bc.ca/Beginner-Guide-to-Developing-on-the-Platform/What-Is-OpenShift" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">DevOps Container Platform</a>, you can empower your developers to deploy digital applications quickly, securely, and at scale. </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <!-- wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
    <div class="col-sm-12 col-md-3">
      <!-- wp:multiple-blocks-plugin/dm-card -->
      <div class="ant-card ant-card-bordered sc-jQHtVU bGtrCL cardRound">
        <div class="ant-card-body">
          <div class="cardText">
            <div>
              <!-- wp:paragraph -->
              <p>Learn about <a href="https://www2.gov.bc.ca/gov/content?id=392A1445BD4E43DEA2B001ABBD77865E" target="_blank" rel="noopener noreferrer" class="sc-hHLeRK dvbaVe externalLink">IM/IT Capital Investment</a> that you may require to build your service. </p>
              <!-- /wp:paragraph -->
            </div>
          </div>
        </div>
      </div>
      <!-- /wp:multiple-blocks-plugin/dm-card -->
    </div>
    <!-- /wp:multiple-blocks-plugin/dm-col-sm-12-md-3 -->
  </div>
  <!-- /wp:multiple-blocks-plugin/dm-4-cols -->
</div>
<!-- /wp:multiple-blocks-plugin/dm-content-block-container -->
`


let html_learn_pt1 = `<!-- wp:multiple-blocks-plugin/contentbanner {"bannerTitle":"Learning","content":"Understand and adopt new approaches to teamwork and technology."} -->
  <div id="main-content-anchor" class="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
    <div class="row middle-xs">
      <div class="col-sm-12 col-md-6">
        <div class="sc-jOhDuK jXeQNE sideImageText">
          <h1 class="sc-hlnMnd iQLvBu bannerTitle" dm-type="rich-text" dm-name="bannerTitle">Learning</h1>
          <div class="sc-eKBdFk hhA-dJm subTitle" dm-type="rich-text" dm-name="content">Understand and adopt new approaches to teamwork and technology.</div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <img alt="" src="/static/media/learningWhite.9b5d2f4f.png" class="sc-ZyCDH fbqJYX sideImage">
      </div>
    </div>
  </div>
  <!-- /wp:multiple-blocks-plugin/contentbanner -->

  <!-- wp:multiple-blocks-plugin/contentblockcontainer -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
<div class="row">
  <div class="col-sm-12">
    <dm-inner>
    <!-- wp:heading {"level":3, "className":"sc-hTtwUo clKDgz subHeading"} -->
    <h3 class="sc-hTtwUo clKDgz subHeading">Digital Academy LearningHub</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"className":"sc-kLLXSd dYHGXD digitalParagraph"} -->
    <p class="sc-kLLXSd dYHGXD digitalParagraph">
      Visit the <a href="https://learningcentre.gww.gov.bc.ca/learninghub/learning_partner/digital-academy/" class="sc-hHLeRK dvbaVe externalLink">Digital Academy LearningHub</a> page to sign-up for scheduled: 
    </p>
    <!-- /wp:paragraph -->
    <!-- wp:list -->
    <ul>
      <!-- wp:list-item -->
      <li>internal courses related to Agile, OpenShift, Scrum Master, and Scrum Product Owner</li>
      <!-- /wp:list-item -->
      <!-- wp:list-item -->
      <li>external partner learning opportunities on a variety of topics</li>
      <!-- /wp:list-item -->
    </ul>
    <!-- /wp:list -->
    
    <!-- wp:paragraph {"className":"sc-kLLXSd dYHGXD digitalParagraph"} -->
    <p class="sc-kLLXSd dYHGXD digitalParagraph">
    For more information contact <a href="mailto:DigitalAcademy@gov.bc.ca" class="sc-hHLeRK dvbaVe externalLink">DigitalAcademy@gov.bc.ca</a>
    </p>
    <!-- /wp:paragraph -->
    </dm-inner>
  </div>
</div>
</div>
<!-- /wp:multiple-blocks-plugin/contentblockcontainer -->

<!-- wp:multiple-blocks-plugin/contentblockcontainer -->
<div class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
    <div class="row">
      <div class="col-sm-12">
        <!-- wp:heading {"level":3, "className":"sc-hTtwUo clKDgz subHeading"} -->
        <h3 class="sc-hTtwUo clKDgz subHeading">Newsletter</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"sc-kLLXSd dYHGXD digitalParagraph"} -->
        <p class="sc-kLLXSd dYHGXD digitalParagraph">Subscribe to the <a href="https://us3.list-manage.com/subscribe?u=2cd8863adab4f39ade7cbee34&amp;id=b331c22b50" class="sc-hHLeRK dvbaVe externalLink">BCDevExchange Newsletter</a> to stay up-to-date on events, learning opportunities, and what's happening at the Exchange Lab. </p>
        <!-- /wp:paragraph -->
      </div>
    </div>
  </div>
  <!-- /wp:multiple-blocks-plugin/contentblockcontainer -->`

const html_learn_pt2=`
  
  
  <div id="courses" class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
    <div class="row">
      <div class="col-sm-12">
        <h2 class="sc-BeQoi iwFZjo heading">Courses</h2>
      </div>
    </div>
    <div class="row" style="margin-bottom: 4px;">
      <div class="col-sm-12 col-md-6 col-lg-4" style="margin-bottom: 20px;">
        <div class="sc-eEOqmf gQDbIN cardRound">
          <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F315538789%2F228490647317%2F1%2Foriginal.20220708-165803?h=200&amp;w=450&amp;auto=format%2Ccompress&amp;q=75&amp;sharp=10&amp;rect=0%2C0%2C2160%2C1080&amp;s=8edc0422c039bb197076f0e755fd59b2" data-testid="thumbnail" class="sc-fmRtwQ kzpoYh">
          <div class="sc-jmNpzm hgleNt">
            <h5 data-testid="title" class="sc-evrZIY khoSFL cardTitle" style="font-size: 25.92px; clear: both;">OpenShift 101 Workshop &amp; Lab</h5>
            <p data-testid="description">This session will cover DevOps platform and application operational tasks</p>
            <a href="https://www.eventbrite.ca/e/openshift-101-workshop-lab-tickets-429216456977" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="margin-top: auto;">View Details &amp; Register <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="standards" class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
    <div class="row">
      <div class="col-sm-12">
        <h2 class="sc-BeQoi iwFZjo heading">Events</h2>
      </div>
    </div>
    <div class="row" style="margin-bottom: 4px;">
      <div class="col-sm-12 col-md-6 col-lg-4" style="margin-bottom: 20px;">
        <div class="sc-eEOqmf gQDbIN cardRound">
          <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F217597619%2F228490647317%2F1%2Foriginal.20220124-225214?h=200&amp;w=450&amp;auto=format%2Ccompress&amp;q=75&amp;sharp=10&amp;rect=0%2C0%2C2160%2C1080&amp;s=de8dc1459fbe30e7e627bde55e6d1038" data-testid="thumbnail" class="sc-fmRtwQ kzpoYh">
          <div class="sc-jmNpzm hgleNt">
            <h5 data-testid="title" class="sc-evrZIY khoSFL cardTitle" style="font-size: 25.92px; clear: both;">Experts in Residence</h5>
            <p data-testid="description">Experts in Residence was created to help BC government employees find the advice they need.</p>
            <a href="https://www.eventbrite.ca/e/experts-in-residence-tickets-406458637727" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="margin-top: auto;">View Details &amp; Register <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4" style="margin-bottom: 20px;">
        <div class="sc-eEOqmf gQDbIN cardRound">
          <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F241214999%2F228490647317%2F1%2Foriginal.20220304-171147?h=200&amp;w=450&amp;auto=format%2Ccompress&amp;q=75&amp;sharp=10&amp;rect=0%2C0%2C2160%2C1080&amp;s=b6292e09ce6358010fc17bdffbc1c9d1" data-testid="thumbnail" class="sc-fmRtwQ kzpoYh">
          <div class="sc-jmNpzm hgleNt">
            <h5 data-testid="title" class="sc-evrZIY khoSFL cardTitle" style="font-size: 25.92px; clear: both;">Take a walk on the Agile side: Tour of BC Gov's Exchange Lab - in person</h5>
            <p data-testid="description">Learn about The Exchange Lab, meet teams and ask questions</p>
            <a href="https://www.eventbrite.ca/e/take-a-walk-on-the-agile-side-tour-of-bc-govs-exchange-lab-in-person-tickets-420675420507" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="margin-top: auto;">View Details &amp; Register <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4" style="margin-bottom: 20px;">
        <div class="sc-eEOqmf gQDbIN cardRound">
          <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F380408359%2F228490647317%2F1%2Foriginal.20221025-223335?h=200&amp;w=450&amp;auto=format%2Ccompress&amp;q=75&amp;sharp=10&amp;rect=0%2C38%2C1920%2C960&amp;s=1695795ee24d9a9a4f24302412964444" data-testid="thumbnail" class="sc-fmRtwQ kzpoYh">
          <div class="sc-jmNpzm hgleNt">
            <h5 data-testid="title" class="sc-evrZIY khoSFL cardTitle" style="font-size: 25.92px; clear: both;">Building a culture where digital professionals can thrive in government</h5>
            <p data-testid="description">What does it look like</p>
            <a href="https://www.eventbrite.ca/e/building-a-culture-where-digital-professionals-can-thrive-in-government-tickets-450991456587" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="margin-top: auto;">View Details &amp; Register <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4" style="margin-bottom: 20px;">
        <div class="sc-eEOqmf gQDbIN cardRound">
          <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F315482479%2F228490647317%2F1%2Foriginal.20220708-152918?h=200&amp;w=450&amp;auto=format%2Ccompress&amp;q=75&amp;sharp=10&amp;rect=0%2C0%2C2160%2C1080&amp;s=0042e2b721389a644ec28b0d6da509ab" data-testid="thumbnail" class="sc-fmRtwQ kzpoYh">
          <div class="sc-jmNpzm hgleNt">
            <h5 data-testid="title" class="sc-evrZIY khoSFL cardTitle" style="font-size: 25.92px; clear: both;">OpenShift 201 Workshop &amp; Lab</h5>
            <p data-testid="description">This training is designed to introduce new skills, and building on knowledge gained during OpenShift 101.</p>
            <a href="https://www.eventbrite.ca/e/openshift-201-workshop-lab-tickets-429220880207" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="margin-top: auto;">View Details &amp; Register <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="main-content-anchor" class="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
    <div class="row middle-xs">
      <div class="col-xs-12 col-lg-6">
        <div class="sc-bBXxYQ fGVkcW">
          <p>Is there a course you wish we offered? Got an idea for an event?</p>
          <h2 class="sc-BeQoi iwFZjo heading">We'd love to hear from you.</h2>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-lg-3">
        <div data-testid="learning-admin" style="text-align: left; margin-top: 16px;">
          <img src="https://strapi-prod-c0cce6-prod.apps.silver.devops.gov.bc.ca/uploads/ari_e240a52067.jpg" style="width: 100%; border-radius: 18px; max-width: 300px;">
          <p style="margin-bottom: 0px; max-width: 300px;">
            <b>Ari Hershberg</b>
            <a class="icon" href="mailto:Ari.Hershberg@gov.bc.ca" style="float: right;">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" class="svg-inline--fa fa-envelope " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="color: black;">
                <path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
              </svg>
            </a>
          </p>
          <p style="margin-bottom: 0px;">Manager, Digital Community and Engagement,</p>
          <p style="margin-bottom: 0px;">Exchange Lab</p>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div id="main-content-anchor" class="sc-cCsOjp sc-ciZhAO itMmZS cpyNMI horizontalAlignment bannerCenterText container">
      <div class="row middle-xs">
        <div class="col-xs-12 col-lg-6">
          <div class="sc-bBXxYQ fGVkcW">
            <h2 class="sc-BeQoi iwFZjo heading">The Exchange Podcast <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
                <path fill="currentColor" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path>
              </svg>
            </h2>
            <p>Ari Hershberg talks with members of the digital government community.</p>
          </div>
        </div>
        <div class="col-xs-12 col-lg-6">
          <img alt="" src="/static/media/podcastGray.6f5bb985.png" class="sc-cLFqLo eAvXqU sideImage">
        </div>
      </div>
    </div>
    <div id="podcasts" class="sc-cCsOjp sc-bZnhIo itMmZS fHWvXR horizontalAlignment contentBlockContainer container">
      <div class="row">
        <div class="col-sm-12" style="align-items: baseline; display: flex; margin-bottom: 16px; justify-content: space-between;">
          <h3 class="sc-hTtwUo clKDgz subHeading" style="margin-bottom: 0px;">Recent Episodes</h3>
          <a href="https://bcdevexchange.libsyn.com/" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="margin-bottom: 0px;">View all <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
              <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div>
        <div class="row" style="margin-bottom: 16px;">
          <div class="col-xs-12 col-md-4">
            <img src="https://strapi-prod-c0cce6-prod.apps.silver.devops.gov.bc.ca/uploads/John_Jordan_4313aa0473.png" style="width: 100%; max-height: 200px; max-width: 300px; object-fit: cover;">
          </div>
          <div class="col-xs-12 col-md-8">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <p style="color: rgb(96, 96, 96); font-size: 13px; margin-bottom: 4px;">Episode 16 · March 30, 2022</p>
              <h4 data-testid="podcast-title" class="sc-jgbSNz dcUbol subSubHeading">Why Digital Trust and Identity should matter to you</h4>
              <p>John has been working at the vanguard of digital trust and identity for many years, bringing his experience from the federal government to BC in 2016. We are continuing the conversation from the #DigitalBC Livestream with Jillian Carruthers on Why Digital Trust and Identity should Matter to you. We will be discussing the risks of shifting from a trust model to a verification model, visionary thinking about how verifiable credentials can be used and more.</p>
              <a href="https://bcdevexchange.libsyn.com/why-digital-trust-and-identity-should-matter-to-you" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="width: fit-content; margin-right: auto;">Listen on Libsyn <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                  <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: 16px;">
          <div class="col-xs-12 col-md-4">
            <img src="https://strapi-prod-c0cce6-prod.apps.silver.devops.gov.bc.ca/uploads/Honey_b705f539db.png" style="width: 100%; max-height: 200px; max-width: 300px; object-fit: cover;">
          </div>
          <div class="col-xs-12 col-md-8">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <p style="color: rgb(96, 96, 96); font-size: 13px; margin-bottom: 4px;">Episode 15 · February 23, 2022</p>
              <h4 data-testid="podcast-title" class="sc-jgbSNz dcUbol subSubHeading">Legacy Modernization Part 2: Policy by Design</h4>
              <p>Honey Dacanay, Executive Director, Benefits Delivery Modernization Employment and Social Development Canada to continue the conversation from the #DigitalBC Livestream with Jillian Carruthers on Legacy Modernization Part 2: Policy by Design. Honey answers questions on the complexity of government and how to evolve tech approach or culture across ministries, using policy to keep up with the pace of citizen demands and technology direction repurposing legacy systems and more.</p>
              <a href="https://bcdevexchange.libsyn.com/legacy-modernization-part-2-policy-by-design?_ga=2.230192543.243245633.1646162217-1520772045.1638228656" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="width: fit-content; margin-right: auto;">Listen on Libsyn <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                  <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: 16px;">
          <div class="col-xs-12 col-md-4">
            <img src="https://strapi-prod-c0cce6-prod.apps.silver.devops.gov.bc.ca/uploads/Russell_Jordan_Podcast_b973596db2.png" style="width: 100%; max-height: 200px; max-width: 300px; object-fit: cover;">
          </div>
          <div class="col-xs-12 col-md-8">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <p style="color: rgb(96, 96, 96); font-size: 13px; margin-bottom: 4px;">Episode 14 · February 21, 2022</p>
              <h4 data-testid="podcast-title" class="sc-jgbSNz dcUbol subSubHeading">The New Exchange Lab. Building Community for the Modernized Workforce</h4>
              <p>In the Exchange Podcast, Russell Treloar, Team Lead, Workplace Strategies and Planning, Real Properties Division and Jordan Samis, Director at the Exchange Lab continue the conversation from the #DigitalBC Livestream with CJ Ritchie on The New Exchange Lab. Building Community for the Modernized Workforce. COVID-19 has changed how people work. Listen to Russell and Jordan's thoughts on how the new Exchange Lab and Share Space will effect culture in government, moon shot or audacious goals for the new Exchange Lab, how the spaces support service delivery for the people of BC and more.</p>
              <a href="https://bcdevexchange.libsyn.com/the-new-exchange-lab-building-community-for-the-modernized-workforce?_ga=2.222401819.1035297162.1645554076-1520772045.1638228656" target="_blank" rel="noopener noreferrer" class="sc-dmRaPn lhXMgP externalLink" style="width: fit-content; margin-right: auto;">Listen on Libsyn <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;">
                  <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="ant-collapse ant-collapse-icon-position-right" style="background: rgb(242, 242, 242); border: none;">
        <div class="ant-collapse-item sc-elYLMi foWTyR PanelStyled">
          <div class="ant-collapse-header" role="button" tabindex="0" aria-expanded="false">
            <div>
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down ant-collapse-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="font-size: 35px; padding-top: 6px; padding-bottom: 6px; top: 12px;">
                <path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
              </svg>
            </div>How to Subscribe
          </div>
        </div>
      </div>
    </div>
  </div>

`

// generate HTML to be pasted into WordPress:
// - add closing img "/"
// - remove dm- attributes
// - unwrap dm-inner

let html_parsed = html_parse(html,{comment:true});

while (true){
  let dmInner = html_parsed.querySelector('dm-inner');
  if (dmInner==null)
    break;
  dmInner.replaceWith(dmInner.innerHTML)
  html_parsed = html_parse(html_parsed.toString(),{comment:true})
  // dmInnerAll.forEach(dmInnerEl=>{
    // dmInnerEl.replaceWith(dmInnerEl.innerHTML)
  // })
}

let htmlForWordPress = html_parsed.toString();
htmlForWordPress=htmlForWordPress.replace(/dm-type="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, "")
htmlForWordPress=htmlForWordPress.replace(/dm-name="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, "")
htmlForWordPress=htmlForWordPress.replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>")
fs.writeFileSync('wordpress.html', htmlForWordPress);


// remove dm-inner, replace it with <InnerBlocks />
let i = 0;
prototypes.forEach(prototype=>{
  let prototype_parsed = html_parse(prototype,{comment:true});
  let dmInnerAll = prototype_parsed.querySelectorAll('dm-inner')

  dmInnerAll.forEach(dmInnerEl=>{
    dmInnerEl.replaceWith('<InnerBlocks />')
  })

  prototypes[i]=prototype_parsed.toString();
  i++;
})


let prototypesAll=prototypes.join('\r\n');

// generate PLUGIN PHP
let processed = [];
const wp_parsed_all = parse(prototypesAll);
let forPluginPHP = "";
wp_parsed_all.forEach(wp_parsed=>{
  if (wp_parsed.blockName == null)
    return;

  
  const blockName = wp_parsed.blockName.substring(wp_parsed.blockName.indexOf('/')+1);
  if (processed.includes(blockName))
    return;
  processed.push(blockName);
  forPluginPHP += `register_block_type( __DIR__ . '/blocks/`+blockName+`/build' );\r\n`
})


let pluginPHP = `<?php
/**
 * Plugin Name:       Multiple Blocks Plugin
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       multiple-blocks-plugin
 *
 * @package           create-block
 */

function create_block_multiple_blocks_plugin_block_init() {
  `+forPluginPHP+`
}
add_action( 'init', 'create_block_multiple_blocks_plugin_block_init' );

require('custom.php');

?>`

// write plugin php

fs.writeFileSync('multiple-blocks-plugin/multiple-blocks-plugin.php', pluginPHP);

processed = [];
let html_parsed_all_arr = [];
let ii = 0;
prototypes.forEach(prototype=>{
  html_parsed_all_arr[ii]=html_parse(prototype,{comment:true});
  ii++;
})

function assert(condition, message) {
  if (!condition) {
      throw message || "Assertion failed";
  }
}

//assert(html_parsed_all_arr.length==wp_parsed_all.length);

let wp_parsed_i = -1;
wp_parsed_all.forEach(wp_parsed=>{
  if (wp_parsed.blockName == null)
    return;

  wp_parsed_i++;
  // let html = wp_parsed.innerHTML; // no - this gets rid of comments, we may have other blocks inside
  let html = html_parsed_all_arr[wp_parsed_i].innerHTML

  const blockName = wp_parsed.blockName.substring(wp_parsed.blockName.indexOf('/')+1);
  if (processed.includes(blockName)){
    console.log(blockName, ' already processed, skipping..')
    return;
  }

  if (fs.existsSync('multiple-blocks-plugin/blocks/'+blockName+'/src')){
    console.log(blockName, ' already exists, skipping..')
    return;
  }

  processed.push(blockName);
  // if (blockName != 'contentblockcontainer')
  //   return


  // BLOCK.JSON
  let attrs = {}
  Object.keys(wp_parsed.attrs).forEach(k=>{
    attrs[k]={"type":"string"};
  })
  let attrs_str = JSON.stringify(attrs)

  let blockJSON = `{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 2,
    "name": "multiple-blocks-plugin/`+blockName+`",
    "version": "0.1.0",
    "title": "`+blockName+`",
    "category": "widgets",
    "icon": "smiley",
    "description": "Example block scaffolded with Create Block tool.",
    "attributes": `+attrs_str+`,
    "supports": {
      "html": false
    },
    "textdomain": "multiple-blocks-plugin",
    "editorScript": "file:./index.js",
    "editorStyle": "file:./index.css",
    "style": "file:./style-index.css"
  }
  `

  // INDEX.JS
  let indexJsContents = `import { registerBlockType } from '@wordpress/blocks';

  import './style.scss';

  import Edit from './edit';
  import save from './save';
  import metadata from './block.json';

  registerBlockType( metadata.name, {
    edit: Edit,
    save,
  } );
  `

  // EDITOR.SCSS
  let editorScss = `.wp-block-multiple-blocks-plugin-`+blockName+` {
    border: 1px dotted #f00;
  }`

  // STYLE.SCSS
  let styleScss = `.wp-block-multiple-blocks-plugin-`+blockName+` {
    background-color: #21759b;
    color: #fff;
    padding: 2px;
  }
  `

  // make "EDIT" contents
  let editHead = `import { __ } from '@wordpress/i18n';

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
    
    return (`;

  html_parsed = html_parse(html) // ,{comment:true}

  let dmTypeNodes = html_parsed.querySelectorAll('[dm-type]')
  // let dmTypeNode = html_parsed.querySelector('[dm-type]')
  // dmTypeNode.attrs['dm-name']

  dmTypeNodes.forEach(dmTypeNode=>{
      dmTypeNode.replaceWith(`<RichText className="`+dmTypeNode.attrs['class']+`"
      tagName="`+dmTypeNode.tagName.toLowerCase()+`"
      value={ attributes.`+dmTypeNode.attrs['dm-name']+` }
      allowedFormats={ [  ] }
      onChange={ onChange_`+dmTypeNode.attrs['dm-name']+` }
      placeholder={ 'Heading...' }
    />`)
  })

  let editBody = html_parsed.toString();
  editBody=editBody.replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>") // fix image tags so they are closed

  let editFooter = `	);
  }`

  let editContents = editHead + editBody + editFooter;


  // make "SAVE" contents
  let saveHead = `import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(`

  html_parsed = html_parse(html) 
  dmTypeNodes = html_parsed.querySelectorAll('[dm-type]')
  dmTypeNodes.forEach(dmTypeNode=>{
    dmTypeNode.replaceWith(`<RichText.Content className="`+dmTypeNode.attrs['class']+`"
    tagName="`+dmTypeNode.tagName.toLowerCase()+`"
    value={ props.attributes.`+dmTypeNode.attrs['dm-name']+` }
  />`)
  })

  // replace InnerBlocks with InnerBlocks.Content

  let innerBlocks = html_parsed.querySelectorAll('innerblocks')
  innerBlocks.forEach(innerBlock=>{
    innerBlock.replaceWith(`<InnerBlocks.Content />`)
  })

  let saveBody = html_parsed.toString()

  let saveFoot = `	)
  }`

  let saveContents = saveHead + saveBody + saveFoot;
  saveContents=saveContents.replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>") // fix image tags so they are closed

  // PACKAGE.JSON
  let pkgJSONHead = `{
    "name": "multiple-blocks-plugin",
    "version": "0.1.0",
    "description": "Example block scaffolded with Create Block tool",
    "author": "The WordPress Contributors",
    "license": "GPL-2.0-or-later",
    "main": "build/index.js",
    "scripts": {`

  let pkgJSONBody = `"build:`+blockName+`": "wp-scripts build --webpack-src-dir=blocks/`+blockName+`/src/ --output-path=blocks/`+blockName+`/build/",\r\n`

  let pkgJSONTail = `		"build": "wp-scripts build",
  "format": "wp-scripts format",
  "lint:css": "wp-scripts lint-style",
  "lint:js": "wp-scripts lint-js",
  "packages-update": "wp-scripts packages-update",
  "plugin-zip": "wp-scripts plugin-zip",
  "start": "wp-scripts start"
  },
  "devDependencies": {
  "@wordpress/scripts": "^24.4.0"
  },
  "dependencies": {
  "npm": "^8.19.3"
  }
  }
  `

  let pkgJSON = pkgJSONHead + pkgJSONBody + pkgJSONTail;

  // WRITE ALL FILES
  let writeStrings = [blockJSON, indexJsContents, editorScss, styleScss, editContents, saveContents, pkgJSON]
  let writeFilePaths = ['multiple-blocks-plugin/blocks/'+blockName+'/src/block.json', 
                        'multiple-blocks-plugin/blocks/'+blockName+'/src/index.js', 'multiple-blocks-plugin/blocks/'+blockName+'/src/editor.scss',
                        'multiple-blocks-plugin/blocks/'+blockName+'/src/style.scss', 
                        'multiple-blocks-plugin/blocks/'+blockName+'/src/edit.js', 'multiple-blocks-plugin/blocks/'+blockName+'/src/save.js',
                        'multiple-blocks-plugin/package.json']

  let i = 0;
  // console.log('current dir: ', process.cwd());

  if (!fs.existsSync('multiple-blocks-plugin/blocks/'+blockName+'/src')){
    fs.mkdirSync('multiple-blocks-plugin/blocks/'+blockName+'/src', { recursive: true });
  }

  writeStrings.forEach(writeString=>{
    let writePath= writeFilePaths[i];
    fs.writeFileSync(writePath, writeString);
    i++;
  });

  // BUILD BLOCKS
  console.log('building block: ', blockName)
  process.chdir('multiple-blocks-plugin');
  execSync("npm run build:"+blockName);
  process.chdir('..');

});

// execSync('wp-scripts build --webpack-src-dir=blocks/'+blockName+'/src/ --output-path=blocks/'+blockName+'/build/')

// npm.commands.run('build:contentbanner', (err) => { 
//   console.log('BUILD ERROR: ', err)
//  });
// series([
//   () => exec('npm run build:contentbanner')
//  ]); 


// console.log(saveContents);

// function processChildNode_recurs(childNode){
//   console.log("processChildNode_recurs: ", childNode)
//   console.log('to_string: ', childNode.toString())
//   if (childNode.toString().startsWith("<!--"))
//   {
//     //if (childNode.toString().startsWith("<!--"))
//   }

//   childNode.childNodes.forEach(cd =>{
//     processChildNode_recurs(cd)
//   })
// }

// processChildNode_recurs(parsedInnerHtml);



// parsed.forEach(item => {
//   if (item.blockName == null)
//     return;
//   console.log('== processing: ', item.blockName)
  
//   let blockName = item.blockName;
//   let innerHtml = item.innerHTML;
//   let parsedInnerHtml = html_parse(innerHtml,{comment:true})
//   parsedInnerHtml.toString()

//   processChildNode_recurs(parsedInnerHtml);
//   console.log(parsedInnerHtml)
// })


// console.log(parsed)