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



// const addImageTemplateUrl = ( settings, name ) => {
//     // if not core paragraph block just return props
//     if (name !== 'core/paragraph') {
//         return props
//       }
  
//       // extend attributs with the new extendedSettings object
//       const attributes = {
//         ...props.attributes,
//         templatedURL: {
//           type: 'string',
//           default: '',
//         }
//       }
  
//       return {...props, attributes}
// };

// /**
//  * Add mobile visibility controls on Advanced Block Panel.
//  *
//  * @param {function} BlockEdit Block edit component.
//  *
//  * @return {function} BlockEdit Modified block edit component.
//  */
// const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
// 	return ( props ) => {

// 		const {
// 			attributes,
// 			setAttributes,
// 			isSelected,
// 		} = props;

// 		const {
// 			templatedURL,
// 		} = attributes;
		
		
// 		return (
// 			<Fragment>
// 				<BlockEdit {...props} />
// 					<InspectorAdvancedControls>
//                     <TextControl
// 					label="Template URL"
// 					onChange={ () => setAttributes( {  visibleOnMobile: templatedURL } ) }
// 					value={templatedURL}
// 				/>
// 					</InspectorAdvancedControls>

// 			</Fragment>
// 		);
// 	};
// }, 'withAdvancedControls');

// addFilter(
// 	'editor.BlockEdit',
// 	'editorskit/custom-advanced-control',
// 	withAdvancedControls
// );

export const allowAriaLabel = () => {
    // addFilter('blocks.registerBlockType', 'multiple-blocks-plugin/attribute/image_template_url', addImageTemplateUrl);

    addFilter('blocks.registerBlockType', 'multiple-blocks-plugin/attribute/aria_label', addAriaLabelAttribute);
    addFilter('blocks.getSaveContent.extraProps','multiple-blocks-plugin/applyAriaLabelAttribute',applyAriaLabelAttribute);
}