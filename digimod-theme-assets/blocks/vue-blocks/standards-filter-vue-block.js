import { registerBlockType } from '@wordpress/blocks';
import { FontSizePicker, InspectorControls } from '@wordpress/block-editor';
import { Component, createElement, Fragment } from '@wordpress/element';
import { PanelBody, SelectControl } from '@wordpress/components';
import { getResourceIcon } from './resource-icons.js';

const APP_NAME = 'standards-filter';
const APP_ROOT_CLASS = 'digimod-vue-app-root';
const APP_BLOCK_CLASS = 'digimod-standards-filter-block';
const HEADING_LEVEL_OPTIONS = ['h2', 'h3', 'h4', 'h5', 'h6'].map((level) => ({
    label: level.toUpperCase(),
    value: level,
}));
const COLUMN_OPTIONS = [2, 3, 4].map((columns) => ({
    label: `${columns} columns`,
    value: columns,
}));

class StandardsFilterBlockEditorComponent extends Component {
    render() {
        const {
            className,
            columns,
            cardHeadingLevel,
            cardHeadingFontSize,
            cardHeadingFontSizeSlug,
        } = this.props.attributes;
        const previewCards = [
            {
                code: '1.01',
                title: 'Example Standard',
                body: 'A preview of the Standard card content will appear here.',
                status: 'Active',
                statusColor: '#d9f2df',
                statusTextColor: '#145c27',
                categories: ['Data', 'Information management'],
                resource: { icon: 'pdf', label: 'Standard', size: '2.4 MB' },
            },
            {
                code: '2.04',
                title: 'Another Standard',
                body: 'Standards cards include their code, status, description, resources, and categories.',
                status: 'Under review',
                statusColor: '#fff0bf',
                statusTextColor: '#624b00',
                categories: ['IT Security', 'Software'],
                resource: { icon: 'url', label: 'Guidelines', size: '' },
            },
            {
                code: '3.12',
                title: 'Additional Standard',
                body: 'The live block loads these values from the Standards post type.',
                status: 'Retired',
                statusColor: '#f8d9d9',
                statusTextColor: '#8d1717',
                categories: ['Appropriate use'],
                resource: { icon: 'doc', label: 'Specifications', size: '842 KB' },
            },
            {
                code: '4.08',
                title: 'Resource Standard',
                body: 'The preview adapts to the selected column layout.',
                status: 'Available on request',
                statusColor: '#fff0bf',
                statusTextColor: '#624b00',
                categories: ['Software development'],
                resource: { icon: 'xls', label: 'Outline', size: '156 KB' },
            },
        ];

        return createElement(
            Fragment,
            null,
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: 'Filterable Standards Settings', initialOpen: true },
                    createElement(SelectControl, {
                        label: 'Columns',
                        value: columns,
                        options: COLUMN_OPTIONS,
                        onChange: (value) => this.props.setAttributes({ columns: Number(value) }),
                    }),
                    createElement(SelectControl, {
                        label: 'Card heading level',
                        value: cardHeadingLevel,
                        options: HEADING_LEVEL_OPTIONS,
                        onChange: (value) => this.props.setAttributes({ cardHeadingLevel: value }),
                    }),
                    createElement(FontSizePicker, {
                        label: 'Card heading font size',
                        value: cardHeadingFontSize
                            ? Number.isNaN(Number(cardHeadingFontSize))
                                ? cardHeadingFontSize
                                : Number(cardHeadingFontSize)
                            : undefined,
                        onChange: (value, fontSize) => this.props.setAttributes({
                            cardHeadingFontSize: undefined === value ? '' : String(value),
                            cardHeadingFontSizeSlug: fontSize?.slug || '',
                        }),
                    })
                )
            ),
            createElement(
                'div',
                {
                    className: `${APP_ROOT_CLASS} ${APP_BLOCK_CLASS} ${className}`.trim(),
                    'data-vue-app': APP_NAME,
                    'data-columns': columns,
                    'data-card-heading-level': cardHeadingLevel,
                    style: {
                        backgroundColor: '#fff',
                        border: '1px dashed #d3d3d3',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                    },
                },
                createElement(
                    'p',
                    {
                        style: {
                            color: 'rgb(162, 0, 0)',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            letterSpacing: '0.04em',
                            marginTop: 0,
                            textTransform: 'uppercase',
                        },
                    },
                    'Filterable Standards Block Preview'
                ),
                createElement(
                    'div',
                    {
                        style: {
                            backgroundColor: '#f5f5f5',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                        },
                    },
                    createElement(
                        'strong',
                        { style: { display: 'block', marginBottom: '0.75rem' } },
                        'Filterable Standards Categories'
                    ),
                    createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: '0.33rem' } },
                        ['Appropriate use', 'Data', 'IT Security', 'Software'].map((category) =>
                            createElement(
                                'span',
                                {
                                    key: category,
                                    style: {
                                        backgroundColor: '#eef4ff',
                                        border: '1px solid #4a81e7',
                                        borderRadius: '0.5rem',
                                        color: '#1f4f9a',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        padding: '0.3rem 0.55rem',
                                    },
                                },
                                category
                            )
                        )
                    )
                ),
                createElement(
                    'div',
                    {
                        style: {
                            display: 'grid',
                            gap: '1.25rem',
                            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        },
                    },
                    previewCards.slice(0, 2 === columns || 4 === columns ? 4 : 3).map((card) =>
                        createElement(
                            'article',
                            {
                                key: card.code,
                                style: {
                                    backgroundColor: '#fff',
                                    borderRadius: '1rem',
                                    boxShadow: 'rgba(0,0,0,.1) 0 20px 25px -5px, rgba(0,0,0,.04) 0 10px 10px -5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: 0,
                                    padding: '1.25rem',
                                },
                            },
                            createElement(
                                'span',
                                {
                                    style: {
                                        alignSelf: 'flex-end',
                                        backgroundColor: card.statusColor,
                                        borderRadius: '999px',
                                        color: card.statusTextColor,
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        marginBottom: '0.75rem',
                                        padding: '0.25rem 0.6rem',
                                    },
                                },
                                card.status
                            ),
                            createElement(
                                'p',
                                {
                                    style: {
                                        color: '#1f4f9a',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                        margin: 0,
                                        textTransform: 'uppercase',
                                    },
                                },
                                card.code
                            ),
                            createElement(
                                cardHeadingLevel,
                                {
                                    className: cardHeadingFontSizeSlug
                                        ? `has-${cardHeadingFontSizeSlug}-font-size`
                                        : undefined,
                                    style: {
                                        color: '#313132',
                                        margin: 0,
                                        ...(cardHeadingFontSize && !cardHeadingFontSizeSlug
                                            ? {
                                                fontSize: /^\d+(\.\d+)?$/.test(cardHeadingFontSize)
                                                    ? `${cardHeadingFontSize}px`
                                                    : cardHeadingFontSize,
                                            }
                                            : {}),
                                    },
                                },
                                card.title
                            ),
                            createElement(
                                'p',
                                { style: { fontSize: '0.9rem', margin: '0' } },
                                card.body
                            ),
                            createElement(
                                'div',
                                {
                                    style: {
                                        alignItems: 'center',
                                        backgroundColor: '#f5f5f5',
                                        border: '1px solid #4a81e7',
                                        borderRadius: '0.5rem',
                                        color: '#313132',
                                        display: 'flex',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        gap: '0.35rem',
                                        marginTop: 'auto',
                                        padding: '0.375rem 0.5rem',
                                    },
                                },
                                getResourceIcon(card.resource.icon)
                                    ? createElement(
                                        'svg',
                                        {
                                            'aria-hidden': true,
                                            fill: 'currentColor',
                                            focusable: false,
                                            height: '1rem',
                                            viewBox: getResourceIcon(card.resource.icon).viewBox,
                                            width: '1rem',
                                            xmlns: 'http://www.w3.org/2000/svg',
                                        },
                                        createElement('path', { d: getResourceIcon(card.resource.icon).path })
                                    )
                                    : null,
                                createElement('span', null, card.resource.label),
                                card.resource.size
                                    ? createElement(
                                        'span',
                                        { style: { fontWeight: '400', marginLeft: 'auto' } },
                                        card.resource.size
                                    )
                                    : null
                            ),
                            createElement(
                                'div',
                                { style: { display: 'flex', flexWrap: 'wrap', gap: '0.33rem', paddingTop: '1rem' } },
                                card.categories.map((category) =>
                                    createElement(
                                        'span',
                                        {
                                            key: category,
                                            style: {
                                                backgroundColor: '#eef4ff',
                                                borderRadius: '0.5rem',
                                                color: '#313132',
                                                fontSize: '0.75rem',
                                                padding: '0.3rem 0.55rem',
                                            },
                                        },
                                        category
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    }
}

registerBlockType('digimod-plugin/standards-filter-block', {
    title: 'Filterable Standards',
    description: 'A filterable list of Standards cards grouped by Standards Categories.',
    icon: 'filter',
    category: 'common',
    attributes: {
        className: {
            type: 'string',
            default: 'digimod-standards-filter-block',
        },
        columns: {
            type: 'number',
            default: 3,
        },
        cardHeadingLevel: {
            type: 'string',
            default: 'h3',
        },
        cardHeadingFontSize: {
            type: 'string',
            default: '',
        },
        cardHeadingFontSizeSlug: {
            type: 'string',
            default: '',
        },
    },
    edit: StandardsFilterBlockEditorComponent,
    save: () => null,
});
