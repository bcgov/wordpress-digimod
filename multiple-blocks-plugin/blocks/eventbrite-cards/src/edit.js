import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {  SelectControl, TextControl } from "@wordpress/components";

import './editor.scss';

export default function Edit(props) {
const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  const options = [
    { value: 'Courses', label: 'Courses' },
    { value: 'Events', label: 'Events' },
  ];
  var saved_api_key = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'meta' )._multiple_blocks_api_key;

console.log(saved_api_key);
  return (
    <div {...blockProps}><InspectorControls>
      <SelectControl
        label="Event Type"
        value={attributes.eventType}
        options={options}
        onChange={function (value) {
          setAttributes({ eventType: value });
        }}
      />
    </InspectorControls>
    <InspectorControls key="setting">
    <TextControl
								label={__( 'API Key' )}
								value={ saved_api_key }
								onChange={ function( newkey ) {
                  const postId = wp.data.select( 'core/editor' ).getCurrentPostId();
                  saved_api_key = newkey;
                  if ( postId ) {
                    wp.data.dispatch( 'core/editor' ).editPost( { meta: { '_multiple_blocks_api_key': newkey } } );
                  }
                  const clientId = wp.data.select('core/block-editor').getSelectedBlockClientId();

                  // Dispatch the reload action for the current block
                  wp.data.dispatch('core/block-editor').updateBlock(clientId, {attributes: {}});
                } }
							/>
    </InspectorControls>
      <h2>Eventbrite {attributes.eventType}</h2>
      <div className="col-sm-12 col-md-6 col-lg-4" style={{ 'marginBottom': '20px' }}>
        <div className="cardRound">Image here
          <div >
            <h2 data-testid="title" className="cardTitle" style={{ 'fontSize': '25.92px', 'clear': 'both' }}>Title here</h2>
            <p data-testid="description">Description here</p>
            <a href="%4$s" target="_blank" rel="noopener noreferrer" className="externalLink" style={{ 'marginTop': 'auto' }}>
              View Details &amp; Register
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" className="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ 'marginLeft': '0.3em', 'height': '1em' }}>
                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z">
                </path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

  );
}