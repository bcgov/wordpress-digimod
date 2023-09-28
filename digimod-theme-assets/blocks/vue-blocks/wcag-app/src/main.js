import './assets/main.css';
import { createApp } from 'vue';
import App from './wcagFilterApp.vue';

const wcagFilterApp = {
    initVueApp: function (selector, attributes) {
        console.log('Mounting vue app...');

        // Check if there's an existing Vue instance and destroy it
        if (window.vueInstance) {
            window.vueInstance.unmount();
        }

        // Pass attributes to your Vue app via props or through some other method
        // Depending on your Vue app's structure, you might need to modify this
        App.props = attributes;

        // Create and mount the new Vue instance
        window.vueInstance = createApp(App);
        window.vueInstance.mount(selector);
    }
};

wcagFilterApp.initVueApp('#app');
