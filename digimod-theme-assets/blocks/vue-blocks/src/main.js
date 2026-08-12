import './assets/main.css';
import { createApp } from 'vue';
import GlossaryApp from './glossaryApp.vue';
import WcagFilterApp from './wcagFilterApp.vue';

const appDefinitions = {
    glossary: {
        component: GlossaryApp,
        getProps: (element, fallbackInstanceId) => ({
            title: element.dataset.title || 'Glossary',
            titleHeadingLevel: element.dataset.titleHeadingLevel || 'h1',
            intro: element.dataset.intro || "It's important to have a shared vocabulary. The official CSBC glossary is the definitive guide for all BC Public Service employees.",
            searchToolsTitle: element.dataset.searchToolsTitle || 'Search tools',
            showAllLabel: element.dataset.showAllLabel || 'Show all',
            showTagCounts: 'false' !== (element.dataset.showTagCounts || 'true'),
            browseTitle: element.dataset.browseTitle || 'Browse terms',
            filterTitle: element.dataset.filterTitle || 'Filter by tag',
            suggestTitle: element.dataset.suggestTitle || 'Suggest a new glossary term',
            suggestBody: element.dataset.suggestBody || 'Send us your submission for review.',
            suggestEmail: element.dataset.suggestEmail || 'do_contentdesign@gov.bc.ca',
            instanceId: element.dataset.instanceId || fallbackInstanceId,
        }),
    },
    'wcag-filter': {
        component: WcagFilterApp,
        getProps: (element, fallbackInstanceId) => {
            const columns = Number.parseInt(element.dataset.columns || '3', 10);

            return {
                columns: Number.isNaN(columns) ? 3 : columns,
                postType: element.dataset.postType || 'wcag-card',
                postTypeLabel: element.dataset.postTypeLabel || 'WCAG card',
                instanceId: element.dataset.instanceId || fallbackInstanceId,
            };
        },
    },
};

function mountVueBlocks() {
    document.querySelectorAll('.digimod-vue-app-root[data-vue-app]').forEach((element, index) => {
        const appName = element.dataset.vueApp;
        const definition = appDefinitions[appName];

        if (!definition || 'true' === element.dataset.vueMounted) {
            return;
        }

        const app = createApp(
            definition.component,
            definition.getProps(element, `${appName}-${index}`)
        );
        app.mount(element);
        element.dataset.vueMounted = 'true';
    });
}

if ('complete' === document.readyState || 'interactive' === document.readyState) {
    mountVueBlocks();
} else {
    document.addEventListener('DOMContentLoaded', mountVueBlocks);
}
