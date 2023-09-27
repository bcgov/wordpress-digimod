import './assets/main.css'
import { createApp } from 'vue';
import PostFilterApp from './postFilterApp.vue';
import customFilterApp from './customFilterApp.vue';

// Common initialization function for creating and mounting a Vue app
const initVueApp = (appComponent, selector, attributes) => {
    
    // Check if there's an existing Vue instance for the same component and destroy it
    if (window.vueInstance && window.vueInstance.component === appComponent) {
        window.vueInstance.unmount();
    }
    
    // Pass attributes to your Vue app via props or through some other method
    // Depending on your Vue app's structure, you might need to modify this
    appComponent.props = attributes;
    
    // Create and mount the new Vue instance
    window.vueInstance = createApp(appComponent);
    window.vueInstance.mount(selector);
    window.vueInstance.component = appComponent; // Store the component type
    // console.info(appComponent, `Mounting ${appComponent.__name}...`);
}

if ('complete' === document.readyState) {
    initVueApp(PostFilterApp, '#postFilterApp');
    initVueApp(customFilterApp, '#customFilterApp');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initVueApp(PostFilterApp, '#postFilterApp');
    });
    document.addEventListener('DOMContentLoaded', () => {
        initVueApp(customFilterApp, '#customFilterApp');
    });
}
