import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { Component, Fragment } from '@wordpress/element';
import {
    PanelBody,
    SelectControl,
    TextareaControl,
    TextControl,
    ToggleControl,
} from '@wordpress/components';

const APP_NAME = 'glossary';
const APP_ROOT_CLASS = 'digimod-vue-app-root';
const APP_BLOCK_CLASS = 'digimod-glossary-block';
const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALLOWED_HTML_TAGS = new Set(['p', 'div', 'span', 'strong', 'br', 'a']);
const ALLOWED_HTML_ATTRIBUTES = {
    a: new Set(['href', 'target', 'rel', 'title', 'aria-label']),
};
const TITLE_HEADING_OPTIONS = [
    { label: 'H1', value: 'h1' },
    { label: 'H2', value: 'h2' },
    { label: 'H3', value: 'h3' },
    { label: 'H4', value: 'h4' },
];

function getHeadingCascade(titleHeadingLevel = 'h1') {
    const titleIndex = Math.max(HEADING_LEVELS.indexOf(titleHeadingLevel), 0);

    return {
        title: HEADING_LEVELS[titleIndex],
        letter: HEADING_LEVELS[Math.min(titleIndex + 1, HEADING_LEVELS.length - 1)],
        entry: HEADING_LEVELS[Math.min(titleIndex + 2, HEADING_LEVELS.length - 1)],
    };
}

function sanitizeUrl(url = '') {
    const trimmedUrl = url.trim();

    if (!trimmedUrl || /^\s*(javascript:|data:)/i.test(trimmedUrl)) {
        return '';
    }

    return trimmedUrl;
}

function sanitizeLimitedHtml(html = '') {
    if (!html) {
        return '';
    }

    const parser = new window.DOMParser();
    const documentFragment = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const sourceRoot = documentFragment.body.firstElementChild;
    const outputRoot = window.document.createElement('div');

    const appendChildren = (sourceNode, targetNode) => {
        Array.from(sourceNode.childNodes).forEach((childNode) => {
            if (window.Node.TEXT_NODE === childNode.nodeType) {
                targetNode.appendChild(window.document.createTextNode(childNode.textContent || ''));
                return;
            }

            if (window.Node.ELEMENT_NODE !== childNode.nodeType) {
                return;
            }

            const tagName = childNode.tagName.toLowerCase();

            if (!ALLOWED_HTML_TAGS.has(tagName)) {
                appendChildren(childNode, targetNode);
                return;
            }

            const sanitizedElement = window.document.createElement(tagName);

            Array.from(childNode.attributes).forEach((attribute) => {
                if (!ALLOWED_HTML_ATTRIBUTES[tagName]?.has(attribute.name)) {
                    return;
                }

                if ('href' === attribute.name) {
                    const safeUrl = sanitizeUrl(attribute.value);

                    if (!safeUrl) {
                        return;
                    }

                    sanitizedElement.setAttribute('href', safeUrl);
                    return;
                }

                sanitizedElement.setAttribute(attribute.name, attribute.value);
            });

            if (
                '_blank' === sanitizedElement.getAttribute('target') &&
                !sanitizedElement.getAttribute('rel')
            ) {
                sanitizedElement.setAttribute('rel', 'noopener noreferrer');
            }

            appendChildren(childNode, sanitizedElement);
            targetNode.appendChild(sanitizedElement);
        });
    };

    if (sourceRoot) {
        appendChildren(sourceRoot, outputRoot);
    }

    return outputRoot.innerHTML;
}

function prepareLimitedPreviewHtml(value = '') {
    const normalizedValue = value.replace(/\r\n?/g, '\n').trim();

    if (!normalizedValue) {
        return '';
    }

    const htmlCandidate = /<[a-z!/]/i.test(normalizedValue)
        ? normalizedValue
        : normalizedValue
            .split(/\n{2,}/)
            .map((paragraph) => `${paragraph.replace(/\n/g, '<br />')}`)
            .join('');

    return sanitizeLimitedHtml(htmlCandidate);
}

class GlossaryVueBlockEditorComponent extends Component {
    render() {
        const {
            className,
            title,
            titleHeadingLevel,
            intro,
            searchToolsTitle,
            showAllLabel,
            filterTitle,
            showTagCounts,
            browseTitle,
            suggestTitle,
            suggestBody,
            suggestEmail,
        } = this.props.attributes;

        const headingCascade = getHeadingCascade(titleHeadingLevel);
        const introPreviewHtml = prepareLimitedPreviewHtml(intro);
        const suggestBodyPreviewHtml = prepareLimitedPreviewHtml(suggestBody);

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Glossary Settings" initialOpen>
                        <TextControl
                            label="Glossary title"
                            value={title}
                            onChange={(value) => this.props.setAttributes({ title: value })}
                        />
                        <SelectControl
                            label="Glossary title heading level"
                            value={titleHeadingLevel}
                            options={TITLE_HEADING_OPTIONS}
                            onChange={(value) =>
                                this.props.setAttributes({ titleHeadingLevel: value })
                            }
                        />
                        <TextareaControl
                            label="Intro text"
                            value={intro}
                            help="HTML allowed: p, div, span, strong, br, a"
                            onChange={(value) => this.props.setAttributes({ intro: value })}
                        />
                        <TextControl
                            label="Sidebar title"
                            value={searchToolsTitle}
                            onChange={(value) =>
                                this.props.setAttributes({ searchToolsTitle: value })
                            }
                        />
                        <TextControl
                            label="Clear button label"
                            value={showAllLabel}
                            onChange={(value) =>
                                this.props.setAttributes({ showAllLabel: value })
                            }
                        />
                        <TextControl
                            label="Filter tag section title"
                            value={filterTitle}
                            onChange={(value) =>
                                this.props.setAttributes({ filterTitle: value })
                            }
                        />
                        <ToggleControl
                            label="Show tag counts in chip"
                            checked={!!showTagCounts}
                            onChange={(value) =>
                                this.props.setAttributes({ showTagCounts: value })
                            }
                        />
                        <TextControl
                            label="Letter navigation title"
                            value={browseTitle}
                            onChange={(value) =>
                                this.props.setAttributes({ browseTitle: value })
                            }
                        />
                        <TextControl
                            label="Contact section title"
                            value={suggestTitle}
                            onChange={(value) =>
                                this.props.setAttributes({ suggestTitle: value })
                            }
                        />
                        <TextareaControl
                            label="Contact body"
                            value={suggestBody}
                            help="HTML allowed: p, div, span, strong, br, a"
                            onChange={(value) =>
                                this.props.setAttributes({ suggestBody: value })
                            }
                        />
                        <TextControl
                            label="Contact email"
                            value={suggestEmail}
                            help="Only add the email address"
                            onChange={(value) =>
                                this.props.setAttributes({ suggestEmail: value })
                            }
                        />
                    </PanelBody>
                </InspectorControls>

                <div
                    className={`${APP_ROOT_CLASS} ${APP_BLOCK_CLASS} ${className} has-white-background-color has-background`.trim()}
                    data-vue-app={APP_NAME}
                    style={{
                        border: '1px dashed #d3d3d3',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                    }}
                >
                    <p
                        style={{
                            color: 'rgb(162, 0, 0)',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            letterSpacing: '0.04em',
                            marginTop: 0,
                            textTransform: 'uppercase',
                        }}
                    >
                        Definitions Glossary Block
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gap: '1rem',
                            gridTemplateColumns: 'minmax(200px, 28%) minmax(0, 1fr)',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gap: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    background: '#f5f5f5',
                                    borderRadius: '0.25rem',
                                    padding: '1rem',
                                }}
                            >
                                <div style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                                    {searchToolsTitle}
                                </div>
                                <div
                                    style={{
                                        textDecoration: 'underline',
                                        fontSize: '1rem',
                                        margin: 0,
                                        padding: '4px 0 0',
                                    }}
                                >
                                    {showAllLabel}
                                </div>
                            </div>

                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '1.15rem',
                                        borderBottom: '1px solid rgb(231, 231, 231)',
                                        paddingBlockEnd: '0.5rem',
                                    }}
                                >
                                    {filterTitle}
                                </div>
                                <p
                                    style={{
                                        color: 'rgb(162, 0, 0)',
                                        fontWeight: 'bold',
                                        marginBottom: 0,
                                    }}
                                >
                                    Auto-generated filterable tags chips{' '}
                                    <span style={{ fontWeight: 'normal', marginBottom: 0 }}>
                                        {showTagCounts ? 'Tag counts: visible' : 'Tag counts: hidden'}
                                    </span>
                                </p>
                            </div>

                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '1.15rem',
                                        borderBottom: '1px solid rgb(231,231,231)',
                                        paddingBlockEnd: '0.5rem',
                                    }}
                                >
                                    {browseTitle}
                                </div>
                                <p
                                    style={{
                                        color: 'rgb(162, 0, 0)',
                                        fontWeight: 'bold',
                                        marginBottom: 0,
                                    }}
                                >
                                    Auto-generated scroll-to letter links
                                </p>
                            </div>

                            <div
                                style={{
                                    background: '#f5f5f5',
                                    borderRadius: '0.25rem',
                                    padding: '1rem',
                                }}
                            >
                                <div style={{ fontSize: '1.15rem', marginBottom: 0 }}>
                                    {suggestTitle}
                                </div>
                                <div
                                    style={{ fontSize: '1rem', marginBottom: 0 }}
                                    dangerouslySetInnerHTML={{ __html: suggestBodyPreviewHtml }}
                                />
                                <div style={{ fontSize: '1rem', marginBottom: 0 }}>
                                    Email {suggestEmail}
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingInline: '0.5rem' }}>
                            <headingCascade.title
                                style={{
                                    fontSize: '2rem',
                                    marginBottom: '0.5rem',
                                    marginTop: 0,
                                }}
                            >
                                {title}
                                <span
                                    style={{
                                        color: 'rgb(162, 0, 0)',
                                        fontSize: '1rem',
                                        fontWeight: 'normal',
                                        position: 'relative',
                                        top: '-0.5rem',
                                    }}
                                >
                                    {' '}
                                    ({headingCascade.title.toUpperCase()})
                                </span>
                            </headingCascade.title>

                            <div
                                style={{ marginBottom: '1rem' }}
                                dangerouslySetInnerHTML={{ __html: introPreviewHtml }}
                            />

                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: '0.75rem',
                                    marginBottom: '1rem',
                                    padding: 0,
                                }}
                            >
                                <headingCascade.letter
                                    style={{
                                        borderBottom: '1px solid #d3d3d3',
                                        fontSize: '1.75rem',
                                        marginBottom: 0,
                                        marginTop: 0,
                                    }}
                                >
                                    A
                                    <span
                                        style={{
                                            color: 'rgb(162, 0, 0)',
                                            fontSize: '1rem',
                                            fontWeight: 'normal',
                                            paddingBottom: '0.5rem',
                                            position: 'relative',
                                            top: '-0.35rem',
                                        }}
                                    >
                                        {' '}
                                        ({headingCascade.letter.toUpperCase()})
                                    </span>
                                </headingCascade.letter>
                            </div>

                            <div
                                style={{
                                    background: '#eef4ff',
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    padding: '1rem',
                                }}
                            >
                                <headingCascade.entry
                                    style={{
                                        fontSize: '1.25rem',
                                        marginBottom: '0.5rem',
                                        marginTop: 0,
                                    }}
                                >
                                    Aardvark
                                    <span
                                        style={{
                                            color: 'rgb(162, 0, 0)',
                                            fontSize: '1rem',
                                            fontWeight: 'normal',
                                            position: 'relative',
                                            top: '-0.15rem',
                                        }}
                                    >
                                        {' '}
                                        ({headingCascade.entry.toUpperCase()})
                                    </span>
                                </headingCascade.entry>

                                <div style={{ color: 'rgb(162, 0, 0)' }}>
                                    <strong>Aggregated glossary terms </strong>
                                    imported from site Definitions posts which are using the <strong>'Show in glossary' </strong>
                                    setting. Output includes grouped letter titles for navigation and definition-link dialog behaviours.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

registerBlockType('digimod-plugin/glossary-block', {
    title: 'Glossary',
    description: 'A two-column defintions-powered glossary with letter navigation and tag filtering.',
    icon: 'book-alt',
    category: 'common',
    attributes: {
        className: {
            type: 'string',
            default: 'digimod-glossary-block',
        },
        title: {
            type: 'string',
            default: 'Glossary',
        },
        titleHeadingLevel: {
            type: 'string',
            default: 'h1',
        },
        intro: {
            type: 'string',
            default: "It's important to have a shared vocabulary. The official CSBC glossary is the definitive guide for all BC Public Service employees.",
        },
        searchToolsTitle: {
            type: 'string',
            default: 'Search tools',
        },
        showAllLabel: {
            type: 'string',
            default: 'Show all',
        },
        filterTitle: {
            type: 'string',
            default: 'Filter: tag',
        },
        showTagCounts: {
            type: 'boolean',
            default: true,
        },
        browseTitle: {
            type: 'string',
            default: 'Jump to',
        },
        suggestTitle: {
            type: 'string',
            default: 'Suggest a new glossary term',
        },
        suggestBody: {
            type: 'string',
            default: 'Send us your submission for review.',
        },
        suggestEmail: {
            type: 'string',
            default: 'do.contentdesign@gov.bc.ca',
        },
    },
    edit: GlossaryVueBlockEditorComponent,
    save: () => null,
});
