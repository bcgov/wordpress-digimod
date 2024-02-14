import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

registerBlockType('digimod-plugin/search-results', {
    title: __('Digital Gov - Search Results'),
    description: 'Used to display Search Results',
    category: 'digimod-plugin',
    icon: 'search',
    edit: (props) => {
        const blockProps = useBlockProps();
        return (
            <div {...blockProps}>
                <ServerSideRender
                    block="digimod-plugin/search-results"
                    attributes={props.attributes}
                />
            </div>
        );
    },
});
