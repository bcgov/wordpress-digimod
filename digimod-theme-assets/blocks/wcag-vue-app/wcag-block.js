const { registerBlockType } = wp.blocks;
const { createElement, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, __experimentalNumberControl } = wp.components;


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
        // todo: make this into jsx and introduce build process for the block
        const { className, columns } = this.props.attributes;

        return createElement(
            Fragment,
            null,
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: 'WCAG Filtering App Settings', initialOpen: true },
                    createElement(__experimentalNumberControl, {
                        label: 'Columns',
                        value: columns,
                        onChange: (newColumns) => this.props.setAttributes({ columns: newColumns }),
                    })
                )
            ),
            createElement('div', { id: 'app', class: className, 'data-columns': columns }, 'WCAG Filtering App Placeholder')
        );
    }
}

registerBlockType('my-plugin/vuejs-wordpress-block', {
    title: 'WCAG Filtering App',
    icon: 'format-image',
    category: 'common',
    attributes: {
        className: {
            type: 'string',
            default: '',
        },
        columns: {
            type: 'number',
            default: 3,
        },
    },
    edit: VueAppEditorComponent,
    save: ({ attributes }) => {
        const { className, columns } = attributes;
        return createElement('div', { id: 'app', class: className, 'data-columns': columns }, 'Loading WCAG Filtering App...');
    },
});
