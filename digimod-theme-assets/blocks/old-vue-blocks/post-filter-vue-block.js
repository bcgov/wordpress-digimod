// const { registerBlockType } = wp.blocks;
// const { createElement, Fragment } = wp.element;
// const { InspectorControls } = wp.blockEditor;
// const { PanelBody, TextControl, __experimentalNumberControl, SelectControl, ToggleControl, FontSizePicker } = wp.components;

/**
 * A custom WordPress block editor component for the CleanBC Post Filter block.
 *
 * @class PostFilterVueAppEditorComponent
 * @extends {wp.element.Component}
 */
class PostFilterVueAppEditorComponent extends wp.element.Component {

    /**
   * Constructor for the PostFilterVueAppEditorComponent class.
   * Initializes the component and sets the initial state.
   *
   * @constructor
   */
    constructor() {
        super(...arguments);

        this.state = {
            postTypes: [],
        };
    }

    /**
     * Lifecycle method called after the component is mounted.
     * Initializes the Vue app and fetches the available post types.
     *
     * @memberof PostFilterVueAppEditorComponent
     * @method componentDidMount
     * @returns {void}
     */
    componentDidMount() {
        this.initVueApp();
        this.fetchPostTypes();
    }

    /**
     * Lifecycle method called after the component is updated.
     * Re-initializes the Vue app if any attributes are updated.
     *
     * @memberof PostFilterVueAppEditorComponent
     * @method componentDidUpdate
     * @param {Object} prevProps - Previous props of the component.
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps.attributes !== this.props.attributes) {
            this.initVueApp();
        }
    }

    /**
     * Fetches the available post types from the WordPress REST API.
     * Filters out the blocked post types and updates the component state.
     *
     * @memberof PostFilterVueAppEditorComponent
     * @async
     * @method fetchPostTypes
     * @returns {void}
     */
    async fetchPostTypes() {
        try {
            const postTypes = await wp.apiFetch({ path: '/wp/v2/types' });

            // Add post types you want to exclude here
            const blockedPostTypes = ['attachment', 'revision', 'nav_menu_item', 'wp_block', 'wp_navigation', 'wp_template', 'wp_template_part', 'custom-pattern'];

            // Filter out the blocked post types and retrieve the label and slug for each post type
            const filteredPostTypes = Object.keys(postTypes)
                .filter((type) => !blockedPostTypes.includes(type))
                .map((type) => {
                    const postType = postTypes[type];
                    const label = postType.name ? postType.name : postType.rest_base;
                    return {
                        label,
                        value: postType.rest_base,
                    };
                });

            this.setState({ postTypes: filteredPostTypes });
        } catch (error) {
            console.error('Error fetching post types:', error);
        }
    }

      /**
     * Initializes the Vue app assuming 'initVueApp' is a function in the Vue JavaScript that starts the Vue app.
     *
     * @memberof PostFilterVueAppEditorComponent
     * @method initVueApp
     * @returns {void}
     */
    initVueApp() {
        // Assuming 'initVueApp' is a function in your Vue JavaScript that starts the Vue app
        // window.initVueApp('#postFilterApp');
    }

    /**
     * Renders the component JSX.
     *
     * @memberof PostFilterVueAppEditorComponent
     * @method render
     * @returns {JSX.Element} The JSX element representing the PostFilterVueAppEditorComponent.
     */
    render() {
        // todo: make this into jsx and introduce build process for the block
        const { className, columns, postType, postTypeLabel, headingSize, headingLinkActive, useExcerpt, } = this.props.attributes;
        const { postTypes } = this.state;

        const postTypeOptions = postTypes.map((type) => ({ label: type.label, value: type.value }));

        const headingSizeOptions = [
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'H5', value: 'h5' },
            { label: 'H6', value: 'h6' },
        ];

        // Options for "Use Content" and "Use Excerpt"
        const useExcerptOptions = [
            { label: 'Content', value: 'content' },
            { label: 'Excerpt', value: 'excerpt' },
        ];

        // Options for "Use Content" and "Use Excerpt"
        const headingLinkActiveOptions = [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
        ];

        // Find the currently selected post type object
        const selectedPostType = postTypes.find((type) => type.value === postType);

        return createElement(
            Fragment,
            null,
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: ' App Settings', initialOpen: true },
                    createElement(__experimentalNumberControl, {
                        label: 'Columns',
                        value: columns,
                        onChange: (newColumns) => this.props.setAttributes({ columns: newColumns }),
                    }),
                    createElement(SelectControl, {
                        label: 'Post Type',
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
                    createElement(SelectControl, {
                        label: 'Heading Size',
                        value: headingSize,
                        options: headingSizeOptions,
                        onChange: (newHeadingSize) =>
                            this.props.setAttributes({ headingSize: newHeadingSize }),
                    }),
                    createElement(ToggleControl, {
                        label: 'Heading Link Active',
                        checked: headingLinkActive === 'true',
                        onChange: (newHeadingLinkActive) =>
                            this.props.setAttributes({
                                headingLinkActive: newHeadingLinkActive ? 'true' : 'false',
                            }),
                    }),
                    createElement(SelectControl, {
                        label: 'Body',
                        description: 'Use Content or Excerpt',
                        value: useExcerpt,
                        options: useExcerptOptions,
                        onChange: (newUseExcerpt) => this.props.setAttributes({ useExcerpt: newUseExcerpt }),
                    }),
                )
            ),
            createElement('div', {
                id: 'postFilterApp',
                class: className,
                'data-heading-size': headingSize,
                'data-heading-link-active': headingLinkActive,
                'data-use-excerpt': useExcerpt,
                'data-columns': columns,
                'data-post-type': postType,
                'data-post-type-label': selectedPostType ? selectedPostType.label : postTypeLabel
            },
                `${selectedPostType ? selectedPostType.label : postTypeLabel} Filter Block Placeholder | ${columns} columns | Filter results show: ${useExcerpt === 'excerpt' ? 'Excerpt' : 'Content'}`,)
        );
    }
}

/**
 * Registers a custom WordPress block type.
 *
 * @function registerBlockType
 * @param {string} name - The unique name for the block, including the namespace.
 * @param {Object} settings - The block settings and attributes.
 * @param {string} settings.title - The title of the block displayed in the block editor.
 * @param {string} settings.icon - The icon representing the block in the block editor interface.
 * @param {string} settings.category - The category under which the block will be displayed in the block editor.
 * @param {Object} settings.attributes - The attributes and their default values for the block.
 * @param {Object} settings.edit - The component used to render the block in the editor.
 * @param {Function} settings.save - Set to null – uses register_block_type in PHP to render block.
 * @returns {void}
 */
registerBlockType('digimod-plugin/post-filter-block', {
    title: 'DigitalGov Post Filter',
    description: 'Use only one Post Filter block per page',
    icon: 'filter',
    category: 'plugin',
    attributes: {
        className: {
            type: 'string',
            default: '',
        },
        columns: {
            type: 'number',
            default: 3,
        },
        postType: {
            type: 'string',
            default: 'posts',
        },
        postTypeLabel: {
            type: 'string',
            default: 'Posts',
        },
        headingSize: {
            type: 'string',
            default: 'h3',
        },
        headingLinkActive: {
            type: 'string',
            default: 'false',
        },
        useExcerpt: {
            type: 'string',
            default: 'excerpt',
        },
    },
    edit: PostFilterVueAppEditorComponent,
    save: () => null,
});
