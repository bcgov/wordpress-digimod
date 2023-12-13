const { registerBlockType } = wp.blocks;
const { createElement, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl } = wp.components;

class VueAppEditorComponent extends wp.element.Component {
    componentDidMount() {
        this.initVueApp();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.attributes !== this.props.attributes) {
            this.initVueApp();
        }
    }

    initVueApp() {
        // Assuming 'initVueApp' is a function in your Vue JavaScript that starts the Vue app
        // window.initVueApp('#app');
    }

    render() {
        const { className, columns, postType, postTypeLabel } = this.props.attributes;
        const postTypes = [
            { label: 'WCAG card', value: 'wcag-card' },
            { label: 'Training card', value: 'training-card' },
            { label: 'Common Component', value: 'common-components' },
        ];
        const postTypeOptions = postTypes.map((type) => ({ label: type.label, value: type.value }));

        const selectedOption = postTypes.find((type) => type.value === postType);

        return createElement(
            Fragment,
            null,
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: 'Block Settings', initialOpen: true },
                    createElement(SelectControl, {
                        label: 'Card Type',
                        value: postType,
                        options: postTypeOptions,
                        onChange: (newPostType) => {
                            const selectedPostType = postTypes.find((type) => type.value === newPostType);
                            const newPostTypeLabel = selectedPostType ? selectedPostType.label : postTypeLabel;
                            this.props.setAttributes({
                                postType: newPostType,
                                postTypeLabel: newPostTypeLabel,
                            });
                        },
                    }),
                    createElement(TextControl, {
                        label: 'Columns',
                        value: columns,
                        onChange: (newColumns) => this.props.setAttributes({ columns: newColumns }),
                    })
                )
            ),
            createElement('div', { id: 'app', className: `${className} has-text-align-center has-gray-40-background-color has-background`, 'data-columns': columns, 'data-post-type': postType, style: { padding: "2rem" }}, `Card Filtering App Placeholder | ${selectedOption ? selectedOption.label : ''}s selected`)
        );
    }
}

registerBlockType('digimod-plugin/custom-filter-block', {
    title: 'Card Filtering App',
    icon: 'filter',
    category: 'common',
    attributes: {
        className: {
            type: 'string',
            default: 'card-filter',
        },
        columns: {
            type: 'number',
            default: 3,
        },
        postType: {
            type: 'string',
            default: 'wcag-card', // Set a default option
        },
        postTypeLabel: {
            type: 'string',
            default: 'WCAG card', // Default label
        },
    },
    edit: VueAppEditorComponent,
    save: ({ attributes }) => {
        const { className, columns, postType, postTypeLabel } = attributes; // Access postType from attributes
        return createElement('div', { id: 'app', className, 'data-columns': columns, 'data-post-type': postType, 'data-post-type-label': postTypeLabel }, 'Loading Card Filtering App...');
    },
});
