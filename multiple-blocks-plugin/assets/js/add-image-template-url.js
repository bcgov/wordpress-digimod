import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { InspectorControls, InspectorAdvancedControls } from '@wordpress/block-editor'
import {TextControl, PanelBody, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components'

/**
 * Callback for the BlockEdit filter
 */
const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
  return ( props ) => {
    if (props.name !== 'core/image') {
      return (
        <BlockEdit { ...props } />
      )
    }

    const {attributes, setAttributes} = props
    const {
        templatedURL,
        templatedCustomField
    } = attributes;

    return (
          <Fragment>
				<BlockEdit {...props} />
					<InspectorAdvancedControls>
                    <TextControl
					label="Shortcode URL"
					onChange={ (new_val) => setAttributes( {  templatedURL: new_val } ) }
					value={templatedURL}
				/>
                <TextControl
					label="Template custom field URL"
					onChange={ (new_val) => setAttributes( {  templatedCustomField: new_val } ) }
					value={templatedCustomField}
				/>
					</InspectorAdvancedControls>

			</Fragment>
    );
  }
}, 'withInspectorControls')

export const addImageTemplateUrl = () => {
    /**
     * Hook into registerBlockType to add our custom prop
     */
    addFilter(
    'blocks.registerBlockType',
        'extending-gutenberg/add-attributes',
    (props, name) => {
        if (name !== 'core/image') {
        return props
        }

        // const attributes = {
        // ...props.attributes,
        // extendedSettings: {
        //     type: 'object',
        //     default: {},
        // }
        // }

        // return {...props, attributes}
        const attributes = {
            ...props.attributes,
            templatedURL: {
            type: 'string',
            default: '',
            },
            templatedCustomField: {
            type: 'string',
            default: '',
            },
            // finalUrl: { // for some reason url and other attributes don't appear in PHP, this will store final URL
            // type: 'string',
            // default: '',
            // }
        }
  
      return {...props, attributes}
    }
    )

    /**
     * Hook into BlockEdit to add our custom inspector controls
     */
    addFilter(
    'editor.BlockEdit',
    'extending-gutenberg/edit',
    withInspectorControls
    )

    // const getBlockAttributes = function(props, blockType){
    //   console.log('getBlockAttributes: ', props, blockType)
    //   return props;
    // }
    // console.log('adding getBlockAttributes filter..')
    // addFilter('blocks.getBlockAttributes','extending-gutenberg/testtt',getBlockAttributes);
}