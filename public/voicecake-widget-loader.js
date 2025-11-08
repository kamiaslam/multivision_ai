/**
 * VoiceCake Widget Loader
 * 
 * This is a lightweight loader that can be used to load the VoiceCake widget
 * asynchronously without blocking page load.
 * 
 * Usage:
 * <script src="https://your-domain.com/voicecake-widget-loader.js" 
 *         data-agent-id="96" 
 *         data-position="bottom-right" 
 *         data-theme="light"></script>
 */

(function() {
    'use strict';

    // Configuration
    const WIDGET_SCRIPT_URL = './voicecake-widget.js'; // Change this to your actual widget URL
    const LOAD_TIMEOUT = 10000; // 10 seconds timeout

    // Get configuration from script tag
    function getScriptConfig() {
        const scripts = document.getElementsByTagName('script');
        let currentScript = null;
        
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('voicecake-widget-loader.js')) {
                currentScript = scripts[i];
                break;
            }
        }

        if (!currentScript) {
            console.error('VoiceCake Widget Loader: Could not find script tag');
            return null;
        }

        return {
            agentId: currentScript.getAttribute('data-agent-id'),
            position: currentScript.getAttribute('data-position') || 'bottom-right',
            theme: currentScript.getAttribute('data-theme') || 'light',
            widgetUrl: currentScript.getAttribute('data-widget-url') || WIDGET_SCRIPT_URL
        };
    }

    // Load the main widget script
    function loadWidgetScript(config) {
        return new Promise((resolve, reject) => {
            // Check if widget script is already loaded
            if (document.querySelector(`script[src="${config.widgetUrl}"]`)) {
                console.log('VoiceCake Widget: Script already loaded');
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = config.widgetUrl;
            script.async = true;
            script.defer = true;

            // Set configuration attributes
            script.setAttribute('data-agent-id', config.agentId);
            script.setAttribute('data-position', config.position);
            script.setAttribute('data-theme', config.theme);

            script.onload = () => {
                console.log('VoiceCake Widget: Script loaded successfully');
                resolve();
            };

            script.onerror = (error) => {
                console.error('VoiceCake Widget: Failed to load script:', error);
                reject(new Error('Failed to load VoiceCake widget script'));
            };

            // Add timeout
            setTimeout(() => {
                if (!script.onload.called) {
                    reject(new Error('VoiceCake widget script load timeout'));
                }
            }, LOAD_TIMEOUT);

            document.head.appendChild(script);
        });
    }

    // Initialize the widget loader
    function initLoader() {
        const config = getScriptConfig();
        
        if (!config) {
            return;
        }

        if (!config.agentId) {
            console.error('VoiceCake Widget Loader: Agent ID is required. Please add data-agent-id attribute to the script tag.');
            return;
        }

        console.log('VoiceCake Widget Loader: Initializing with config:', config);

        // Load the widget script
        loadWidgetScript(config)
            .then(() => {
                console.log('VoiceCake Widget Loader: Widget loaded successfully');
            })
            .catch((error) => {
                console.error('VoiceCake Widget Loader: Failed to load widget:', error);
                
                // Show a fallback message or create a simple error indicator
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #ef4444;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    z-index: 999999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                `;
                errorDiv.textContent = 'VoiceCake Widget failed to load';
                document.body.appendChild(errorDiv);

                // Remove error message after 5 seconds
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.remove();
                    }
                }, 5000);
            });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader);
    } else {
        initLoader();
    }

})();
