import './assets/main.css';
import { createApp } from 'vue';
import WcagFilterApp from './wcagFilterApp.vue';

const appDefinitions = {
    'wcag-filter': WcagFilterApp,
};

function getAppProps(element, fallbackInstanceId) {
    const columns = Number.parseInt(element.dataset.columns || '3', 10);

    return {
        columns: Number.isNaN(columns) ? 3 : columns,
        postType: element.dataset.postType || 'wcag-card',
        postTypeLabel: element.dataset.postTypeLabel || 'WCAG card',
        instanceId: element.dataset.instanceId || fallbackInstanceId,
    };
}

function mountVueBlocks() {
    document.querySelectorAll('.digimod-vue-app-root[data-vue-app]').forEach((element, index) => {
        const appName = element.dataset.vueApp;
        const component = appDefinitions[appName];

        if (!component || 'true' === element.dataset.vueMounted) {
            return;
        }

        const app = createApp(component, getAppProps(element, `${appName}-${index}`));
        app.mount(element);
        element.dataset.vueMounted = 'true';
    });
}

if ('complete' === document.readyState || 'interactive' === document.readyState) {
    mountVueBlocks();
} else {
    document.addEventListener('DOMContentLoaded', mountVueBlocks);
}
