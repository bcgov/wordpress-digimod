// ------------
// Allow application of custom html attributes to various blocks, ex aria-label for list elements
// ------------

// import assign from 'lodash.assign';
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable spacing control on the following blocks
const enableSpacingControlOnBlocks = [
    'core/list',
];


/**
 * Add spacing control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addSpacingControlAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableSpacingControlOnBlocks.includes( name ) ) {
        return settings;
    }
    // console.log("APPLY");
    // Use Lodash's assign to gracefully handle if attributes are undefined
    settings.attributes = Object.assign( settings.attributes, {
        ariaLabel: {
            type: 'string',
            default: '',
        },
    } );

    return settings;
};

addFilter( 'blocks.registerBlockType', 'extend-block-example/attribute/spacing', addSpacingControlAttribute );


// APPLY ATTRIBUTE
/**
 * External Dependencies
 */


/**
 * Add custom element class in save element.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
function applyExtraClass( extraProps, blockType, attributes ) {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableSpacingControlOnBlocks.includes( blockType.name ) ) {
        return extraProps;
    }

	const { ariaLabel } = attributes;
	
    // console.log('visibleOnMobile: ', ariaLabel, extraProps, attributes);

	//check if attribute exists for old Gutenberg version compatibility
	//add class only when test = false
	if ( typeof ariaLabel !== 'undefined' && ariaLabel!='' ) {
        // console.log('ASSIGNING, extraprops: ', extraProps);
        Object.assign( extraProps, { 'aria-label': ariaLabel } );
		// extraProps.className = classnames( extraProps.className, 'mobile-hidden' );
	}

	return extraProps;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'editorskit/applyExtraClass',
	applyExtraClass
);