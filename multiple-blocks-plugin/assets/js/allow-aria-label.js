// Allow aria-label attribute on selected blocks
// Without this code any core blocks with aria-label in their code will be not applied

const { addFilter } = wp.hooks;

// Enable aria-label on the following blocks
const enableAriaLabelOnBlocks = [
    'core/list',
];


/**
 * Add aria-label attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addAriaLabelAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableAriaLabelOnBlocks.includes( name ) ) {
        return settings;
    }

    settings.attributes = Object.assign( settings.attributes, {
        ariaLabel: {
            type: 'string',
            default: '',
        },
    } );

    return settings;
};


// APPLY ATTRIBUTE


/**
 * Add custom element attribute in save element.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
function applyAriaLabelAttribute( extraProps, blockType, attributes ) {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableAriaLabelOnBlocks.includes( blockType.name ) ) {
        return extraProps;
    }

	const { ariaLabel } = attributes;
	
	//check if attribute exists for old Gutenberg version compatibility
	//add attribute only when it's dfined
	if ( typeof ariaLabel !== 'undefined' && ariaLabel!='' ) {
        Object.assign( extraProps, { 'aria-label': ariaLabel } );
	}

	return extraProps;
}

export const allowAriaLabel = () => {
    addFilter('blocks.registerBlockType', 'multiple-blocks-plugin/attribute/aria_label', addAriaLabelAttribute);
    addFilter('blocks.getSaveContent.extraProps','multiple-blocks-plugin/applyAriaLabelAttribute',applyAriaLabelAttribute);
}