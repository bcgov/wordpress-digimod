import { __ } from '@wordpress/i18n';
const { select } = wp.data;


import './editor.scss';

export default function Edit(props) {

  //const events =  getEvents();
  //console.log('blocks: ', parentBlock, childBlocks);
  return (
    <div class="row" style={{ 'marginBottom': '16px' }}>
      <div class="col-xs-12 col-md-4">
        Image here
      </div>
      <div class="col-xs-12 col-md-8">
        <div style={{ 'display': 'flex', 'flex-direction': 'column', 'height': '100%' }}>
          <p style={{ 'color': 'rgb(96, 96, 96)', 'fontSize': '13px', 'marginBottom': '4px' }}>Episode Date</p>
          <h4 data-testid="podcast-title" class="subSubHeading">Title Here</h4>
          <p> Description here </p>
          <a href="#" target="_blank" rel="noopener noreferrer" class="externalLink" style={{ 'width': 'fit-content', 'marginRight': 'auto' }}>
            Listen on Libsyn<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ 'marginLeft': '0.3em' }}>
              <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z">
              </path>
            </svg>
          </a>
        </div>
      </div>
    </div>

  );
}