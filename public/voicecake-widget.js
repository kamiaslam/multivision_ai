/**
 * VoiceCake Widget - Embeddable Voice AI Chat Widget
 * 
 * Usage:
 * <script src="https://your-domain.com/voicecake-widget.js" 
 *         data-agent-id="96" 
 *         data-position="bottom-right" 
 *         data-theme="light"></script>
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        apiBaseUrl: 'https://voicecakedevelop-hrfygverfwe8g4bj.canadacentral-01.azurewebsites.net/api/v1',
        wsBaseUrl: 'wss://voice-cake-mg8n2q4e.livekit.cloud',
        humeEndpoint: '/api/v1/hume/ws/inference'
    };

    // Load LiveKit SDK dynamically
    function loadLiveKitSDK() {
        return new Promise((resolve, reject) => {
            // Check if LiveKit is already loaded
            if (window.LiveKit) {
                console.log('VoiceCake Widget: LiveKit SDK already loaded');
                resolve(window.LiveKit);
                return;
            }

            // Create script tag to load LiveKit - use the same version as your app
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/livekit-client@2.15.6/dist/livekit-client.umd.js';
            script.type = 'text/javascript';
            script.onload = () => {
                console.log('VoiceCake Widget: LiveKit SDK loaded');
                console.log('VoiceCake Widget: Available LiveKit exports:', Object.keys(window.LiveKit || {}));
                console.log('VoiceCake Widget: Window LiveKit object:', window.LiveKit);
                console.log('VoiceCake Widget: Window LiveKitClient object:', window.LiveKitClient);
                
                // Try different ways to access the Room class
                let LiveKitSDK = null;
                
                // Check various possible locations
                if (window.LiveKit && window.LiveKit.Room) {
                    console.log('VoiceCake Widget: Found Room class in window.LiveKit');
                    LiveKitSDK = window.LiveKit;
                } else if (window.LiveKitClient && window.LiveKitClient.Room) {
                    console.log('VoiceCake Widget: Found Room class in window.LiveKitClient');
                    LiveKitSDK = window.LiveKitClient;
                } else if (window.LivekitClient && window.LivekitClient.Room) {
                    console.log('VoiceCake Widget: Found Room class in window.LivekitClient');
                    LiveKitSDK = window.LivekitClient;
                } else if (window.livekit && window.livekit.Room) {
                    console.log('VoiceCake Widget: Found Room class in window.livekit');
                    LiveKitSDK = window.livekit;
                } else {
                    // Check if it's available as a global
                    const possibleGlobals = ['LiveKit', 'LiveKitClient', 'LivekitClient', 'livekit', 'Room'];
                    for (const global of possibleGlobals) {
                        if (window[global] && window[global].Room) {
                            console.log(`VoiceCake Widget: Found Room class in window.${global}`);
                            LiveKitSDK = window[global];
                            break;
                        }
                    }
                }
                
                if (LiveKitSDK && LiveKitSDK.Room) {
                    resolve(LiveKitSDK);
                } else {
                    console.error('VoiceCake Widget: Room class not found in LiveKit SDK');
                    console.error('VoiceCake Widget: Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('livekit')));
                    reject(new Error('Room class not found in LiveKit SDK'));
                }
            };
            script.onerror = () => {
                console.error('VoiceCake Widget: Failed to load LiveKit SDK from unpkg, trying jsdelivr...');
                
                // Try alternative CDN
                const altScript = document.createElement('script');
                altScript.src = 'https://cdn.jsdelivr.net/npm/livekit-client@2.15.6/dist/livekit-client.umd.js';
                altScript.type = 'text/javascript';
                altScript.onload = () => {
                    console.log('VoiceCake Widget: LiveKit SDK loaded from jsdelivr');
                    // Use the same logic as above
                    let LiveKitSDK = null;
                    if (window.LiveKit && window.LiveKit.Room) {
                        LiveKitSDK = window.LiveKit;
                    } else if (window.LiveKitClient && window.LiveKitClient.Room) {
                        LiveKitSDK = window.LiveKitClient;
                    }
                    
                    if (LiveKitSDK && LiveKitSDK.Room) {
                        resolve(LiveKitSDK);
                    } else {
                        reject(new Error('Room class not found in LiveKit SDK from jsdelivr'));
                    }
                };
                altScript.onerror = () => {
                    console.error('VoiceCake Widget: Failed to load LiveKit SDK from both CDNs');
                    reject(new Error('Failed to load LiveKit SDK from any CDN'));
                };
                document.head.appendChild(altScript);
            };
            document.head.appendChild(script);
        });
    }

    // CSS Styles
    const WIDGET_STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
        
        /* VoiceCake Widget Styles */
        .voicecake-widget {
            position: fixed;
            z-index: 999999;
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        }

        .voicecake-widget.bottom-right { bottom: 20px; right: 20px; }
        .voicecake-widget.bottom-left { bottom: 20px; left: 20px; }
        .voicecake-widget.top-right { top: 20px; right: 20px; }
        .voicecake-widget.top-left { top: 20px; left: 20px; }

        .voicecake-widget-button {
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.09),
                        0px 6px 4px -4px rgba(8, 8, 8, 0.05);
            transition: all 0.2s ease;
            position: relative;
            overflow: visible;
        }

        .voicecake-widget-button:hover {
            transform: scale(1.05);
            box-shadow: 0px 0px 0px 3px #fff inset;
        }

        .voicecake-widget-button:active { 
            transform: scale(0.98); 
        }

        .voicecake-widget.light .voicecake-widget-button {
            background: linear-gradient(to bottom, #2c2c2c, #282828);
            color: #fdfdfd;
            box-shadow: inset 2px 0px 8px 2px rgba(248, 248, 248, 0.20);
        }

        .voicecake-widget.light .voicecake-widget-button::after {
            content: '';
            position: absolute;
            inset: 0;
            border: 1.5px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            mask-image: linear-gradient(to top, transparent 0, black 100%);
        }

        .voicecake-widget.dark .voicecake-widget-button {
            background: linear-gradient(to bottom, #dedede, #dedede);
            color: #141414;
        }

        .voicecake-widget.dark .voicecake-widget-button::after {
            content: '';
            position: absolute;
            inset: 0;
            border: 1.5px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            box-shadow: inset 2px 0px 8px 2px rgba(24, 24, 24, 0.25);
        }

        .voicecake-status-indicator {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid white;
            transition: all 0.3s ease;
            z-index: 10;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .voicecake-status-indicator.idle { background: #727272; }
        .voicecake-status-indicator.connecting { 
            background: #2a85ff; 
            animation: voicecake-pulse 1.5s infinite; 
        }
        .voicecake-status-indicator.active { 
            background: #00a656; 
            animation: voicecake-pulse 1.5s infinite; 
        }
        .voicecake-status-indicator.error { background: #ff381c; }

        .voicecake-widget.dark .voicecake-status-indicator {
            border-color: #000000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        @keyframes voicecake-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @keyframes voicecake-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        @keyframes voicecake-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .voicecake-loading {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .voicecake-loading-dots {
            display: flex;
            gap: 4px;
        }

        .voicecake-loading-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
            animation: voicecake-pulse 1.4s ease-in-out infinite both;
        }

        .voicecake-loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .voicecake-loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .voicecake-loading-dots span:nth-child(3) { animation-delay: 0s; }

        .voicecake-widget-panel {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 400px;
            max-height: 600px;
            background: #fdfdfd;
            border-radius: 2rem;
            box-shadow: 0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.25),
                        0px 24px 24px -16px rgba(8, 8, 8, 0.04),
                        0px 6px 13px 0px rgba(8, 8, 8, 0.03),
                        0px 6px 4px -4px rgba(8, 8, 8, 0.05),
                        0px 5px 1.5px -4px rgba(8, 8, 8, 0.09);
            border: 1.5px solid rgba(229, 229, 229, 0.04);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .voicecake-widget.dark .voicecake-widget-panel {
            background: #000000;
            border-color: rgba(229, 229, 229, 0.04);
            color: #ffffff;
            box-shadow: inset 0 0 0 1.5px rgba(229, 229, 229, 0.04), 
                        0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 
                        0px 6px 4px -4px rgba(8, 8, 8, 0.05);
        }

        .voicecake-widget-panel.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .voicecake-widget-panel.bottom-left { right: auto; left: 0; }
        .voicecake-widget-panel.top-right { bottom: auto; top: 70px; }
        .voicecake-widget-panel.top-left { 
            bottom: auto; 
            top: 70px; 
            right: auto; 
            left: 0; 
        }

        .voicecake-panel-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
            border-bottom: 1px solid rgba(123, 123, 123, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .voicecake-widget.dark .voicecake-panel-header {
            border-bottom-color: #1a1a1a;
        }

        .voicecake-panel-title {
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-weight: 600;
            font-size: 1.25rem;
            color: #101010;
            letter-spacing: -0.01em;
        }

        .voicecake-widget.dark .voicecake-panel-title {
            color: #ffffff;
        }

        .voicecake-close-btn {
            width: 2rem;
            height: 2rem;
            border: none;
            background: #f1f1f1;
            cursor: pointer;
            color: #727272;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.75rem;
            transition: all 0.2s ease;
        }

        .voicecake-close-btn:hover {
            background: #e2e2e2;
            color: #4c4c4c;
            transform: scale(1.05);
        }

        .voicecake-widget.dark .voicecake-close-btn {
            background: #222222;
            color: #b0b0b0;
        }

        .voicecake-widget.dark .voicecake-close-btn:hover {
            background: #4c4c4c;
            color: #e0e0e0;
        }

        .voicecake-panel-content {
            padding: 1.5rem;
            max-height: 500px;
            overflow-y: auto;
        }

        .voicecake-agent-info {
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background: #f9f9f9;
            border-radius: 1.5rem;
            border: 1.5px solid rgba(123, 123, 123, 0.1);
        }

        .voicecake-widget.dark .voicecake-agent-info {
            background: rgba(10, 10, 10, 0.7);
            border-color: #1a1a1a;
        }

        .voicecake-agent-name {
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-weight: 600;
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
            color: #101010;
            letter-spacing: -0.01em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .voicecake-widget.dark .voicecake-agent-name {
            color: #ffffff;
        }

        .voicecake-agent-description {
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 0.875rem;
            color: #727272;
            margin-bottom: 0.75rem;
            line-height: 1.5;
        }

        .voicecake-widget.dark .voicecake-agent-description {
            color: #b0b0b0;
        }

        .voicecake-agent-type {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.375rem 0.75rem;
            background: #00a656;
            color: white;
            border-radius: 1.25rem;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .voicecake-controls {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .voicecake-control-btn {
            width: 100%;
            height: 3rem;
            border: none;
            border-radius: 1.5rem;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            position: relative;
            overflow: hidden;
        }

        .voicecake-control-btn.primary {
            background: linear-gradient(to bottom, #2c2c2c, #282828);
            color: #fdfdfd;
            box-shadow: inset 2px 0px 8px 2px rgba(248, 248, 248, 0.20);
            border: 0;
        }

        .voicecake-control-btn.primary::after {
            content: '';
            position: absolute;
            inset: 0;
            border: 1.5px solid rgba(255, 255, 255, 0.2);
            border-radius: 1.5rem;
            mask-image: linear-gradient(to top, transparent 0, black 100%);
        }

        .voicecake-control-btn.primary:hover {
            box-shadow: none;
        }

        .voicecake-widget.dark .voicecake-control-btn.primary {
            background: linear-gradient(to bottom, #dedede, #dedede);
            color: #141414;
        }

        .voicecake-widget.dark .voicecake-control-btn.primary::after {
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: inset 2px 0px 8px 2px rgba(24, 24, 24, 0.25);
        }

        .voicecake-widget.dark .voicecake-control-btn.primary:hover {
            color: #191919;
        }

        .voicecake-widget.dark .voicecake-control-btn.primary:hover::after {
            opacity: 0;
        }

        .voicecake-control-btn.secondary {
            background: #f1f1f1;
            color: #727272;
            border: 1.5px solid #e2e2e2;
        }

        .voicecake-widget.dark .voicecake-control-btn.secondary {
            background: #222222;
            color: #b0b0b0;
            border-color: #4c4c4c;
        }

        .voicecake-control-btn.secondary:hover {
            background: #e2e2e2;
            color: #4c4c4c;
        }

        .voicecake-widget.dark .voicecake-control-btn.secondary:hover {
            background: #4c4c4c;
            color: #e0e0e0;
        }

        .voicecake-control-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .voicecake-status {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            background: #f9f9f9;
            border-radius: 1.5rem;
            font-size: 0.875rem;
            margin-bottom: 1.25rem;
            border: 1.5px solid rgba(123, 123, 123, 0.1);
        }

        .voicecake-widget.dark .voicecake-status {
            background: rgba(10, 10, 10, 0.7);
            border-color: #1a1a1a;
        }

        .voicecake-status-text {
            color: #101010;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-weight: 600;
        }

        .voicecake-widget.dark .voicecake-status-text {
            color: #ffffff;
        }


        .voicecake-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: voicecake-spin 1s linear infinite;
        }

        @keyframes voicecake-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .voicecake-error {
            padding: 12px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            color: #dc2626;
            font-size: 13px;
            margin-bottom: 12px;
        }

        .voicecake-widget.dark .voicecake-error {
            background: #7f1d1d;
            border-color: #991b1b;
            color: #fca5a5;
        }

        @media (max-width: 480px) {
            .voicecake-widget-panel {
                width: 280px;
                right: -10px;
            }
            .voicecake-widget-panel.bottom-left {
                left: -10px;
            }
        }

        .voicecake-panel-content::-webkit-scrollbar,
        .voicecake-panel-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .voicecake-panel-content::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 2px;
        }

        .voicecake-widget.dark .voicecake-panel-content::-webkit-scrollbar-thumb {
            background: #6b7280;
        }
    `;

    // Widget class
    class VoiceCakeWidget {
        constructor(options = {}) {
            this.agentId = options.agentId;
            this.position = options.position || 'bottom-right';
            this.theme = options.theme || 'light';
            this.agentType = options.agentType || null; // Allow forcing agent type
            this.isOpen = false;
            this.isConnected = false;
            this.isLoading = false;
            this.agent = null;
            this.socket = null;
            this.mediaStream = null;
            this.mediaRecorder = null;
            this.audioQueue = [];
            this.isPlaying = false;
            this.isUserSpeaking = false;
            this.audioContext = null;
            this.currentAudioSource = null;
            this.shouldInterrupt = false;
            this.isProcessing = false; // Prevent multiple simultaneous operations
            this.room = null;
            this.sessionData = null;
            this.liveKitSDK = null;

            this.init();
        }

        init() {
            this.injectStyles();
            this.createWidget();
            this.fetchAgent();
            this.setupEventListeners();
        }

        injectStyles() {
            // Check if styles are already injected
            if (document.getElementById('voicecake-widget-styles')) {
                return;
            }

            const style = document.createElement('style');
            style.id = 'voicecake-widget-styles';
            style.textContent = WIDGET_STYLES;
            document.head.appendChild(style);
        }

        createWidget() {
            // Remove existing widget if any
            const existingWidget = document.querySelector('.voicecake-widget');
            if (existingWidget) {
                existingWidget.remove();
            }

            const widget = document.createElement('div');
            widget.className = `voicecake-widget ${this.theme} ${this.position}`;
            widget.innerHTML = `
                <button class="voicecake-widget-button" id="voicecake-toggle">
                    🎤
                    <div class="voicecake-status-indicator idle" id="voicecake-status"></div>
                </button>
                <div class="voicecake-widget-panel ${this.position}" id="voicecake-panel">
                    <div class="voicecake-panel-header">
                        <div class="voicecake-panel-title">Voice AI Chat</div>
                        <button class="voicecake-close-btn" id="voicecake-close">×</button>
                    </div>
                    <div class="voicecake-panel-content" id="voicecake-content">
                        <div class="voicecake-loading">
                            <div class="voicecake-spinner"></div>
                            Loading agent...
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(widget);
        }

        setupEventListeners() {
            const toggleBtn = document.getElementById('voicecake-toggle');
            const closeBtn = document.getElementById('voicecake-close');

            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePanel();
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closePanel();
                });
            }

            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                const widget = document.querySelector('.voicecake-widget');
                if (widget && !widget.contains(e.target) && this.isOpen) {
                    this.closePanel();
                }
            });
        }

        async fetchAgent() {
            if (!this.agentId) {
                this.showError('Agent ID is required');
                return;
            }

            try {
                console.log('VoiceCake Widget: Starting agent fetch...');
                this.setLoading(true);
                console.log('VoiceCake Widget: Fetching agent from:', `${CONFIG.apiBaseUrl}/agents/${this.agentId}/public`);
                
                // Test connectivity first
                console.log('VoiceCake Widget: Testing API connectivity...');
                
                // Add timeout to prevent hanging
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
                
                const response = await fetch(`${CONFIG.apiBaseUrl}/agents/${this.agentId}/public`, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                clearTimeout(timeoutId);
                console.log('VoiceCake Widget: Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('VoiceCake Widget: Response data:', data);

                // Handle both direct agent data and wrapped response
                if (data.success && data.data) {
                    this.agent = data.data;
                    this.renderAgentInfo();
                } else if (data.id && data.agent_type) {
                    // Direct agent data (like from your share component)
                    this.agent = data;
                    this.renderAgentInfo();
                } else {
                    throw new Error(data.message || 'Failed to fetch agent');
                }
            } catch (error) {
                console.error('VoiceCake Widget: Error fetching agent:', error);
                
                // Show a more user-friendly error message
                let errorMessage = 'Failed to load agent';
                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out - please try again';
                } else if (error.message.includes('HTTP 404')) {
                    errorMessage = 'Agent not found or not publicly accessible';
                } else if (error.message.includes('HTTP 401')) {
                    errorMessage = 'Agent requires authentication';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error - please check your connection';
                } else if (error.message.includes('CORS')) {
                    errorMessage = 'CORS error - agent may not be publicly accessible';
                } else {
                    errorMessage = error.message;
                }
                
                console.log('VoiceCake Widget: Showing error:', errorMessage);
                this.showError(errorMessage);
                
                // Don't render fallback UI - just show the error
                console.log('VoiceCake Widget: Connection failed - showing error only');
            } finally {
                console.log('VoiceCake Widget: Setting loading to false');
                this.setLoading(false);
            }
        }

        renderAgentInfo() {
            console.log('VoiceCake Widget: renderAgentInfo called');
            const content = document.getElementById('voicecake-content');
            if (!content || !this.agent) {
                console.log('VoiceCake Widget: No content or agent, returning');
                return;
            }

            const agentType = this.agent.agent_type || this.agent.type || 'SPEECH';
            const typeLabel = agentType === 'TEXT' ? 'Text-To-Speech' : 'Speech-To-Speech';
            console.log('VoiceCake Widget: Rendering agent info for:', this.agent.name, 'Type:', agentType);

            content.innerHTML = `
                <div class="voicecake-agent-info">
                    <div class="voicecake-agent-name">${this.agent.name}</div>
                    <div class="voicecake-agent-description">AI Voice Assistant</div>
                    <div class="voicecake-agent-type">${typeLabel}</div>
                </div>
                <div class="voicecake-controls">
                    <button class="voicecake-control-btn primary" id="voicecake-start">
                        <span>🎤</span>
                        Start Voice Chat
                    </button>
                </div>
                <div class="voicecake-status" id="voicecake-status-display">
                    <span class="voicecake-status-text">Ready to start</span>
                </div>
            `;

            // Set up event listeners for the agent info UI
            console.log('VoiceCake Widget: Setting up controls for agent info');
            this.updateControls();
        }

        // Removed renderFallbackUI - no more demo mode

        async startInference() {
            if (!this.agentId) {
                this.showError('Agent ID is required');
                return;
            }

            // Prevent multiple simultaneous operations
            if (this.isProcessing) {
                console.log('VoiceCake Widget: Already processing, ignoring start request');
                return;
            }

            this.isProcessing = true;

            try {
                this.setStatus('connecting');
                this.setLoading(true);

                // Determine agent type - use forced type or detect from agent data
                const agentType = (this.agentType || this.agent?.agent_type || this.agent?.type || 'TEXT').toUpperCase();
                console.log('VoiceCake Widget: Agent type detected:', agentType);
                console.log('VoiceCake Widget: Agent data available:', !!this.agent);
                console.log('VoiceCake Widget: Forced agent type:', this.agentType);

                if (agentType === 'TEXT') {
                    // Use LiveKit session for TEXT agents
                    await this.startTextAgentSession();
                } else {
                    // Use WebSocket for SPEECH agents
                    await this.startSpeechAgentSession();
                }

            } catch (error) {
                console.error('VoiceCake Widget: Error starting inference:', error);
                this.setStatus('error');
                
                let errorMessage = 'Failed to start: ' + error.message;
                if (error.name === 'NotAllowedError') {
                    errorMessage = 'Microphone permission denied. Please allow microphone access.';
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'No microphone found. Please connect a microphone.';
                }
                
                this.showError(errorMessage);
                this.setLoading(false);
                this.isProcessing = false;
            }
        }

        async startTextAgentSession() {
            try {
                console.log('VoiceCake Widget: Starting TEXT agent session');
                
                // Load LiveKit SDK
                this.liveKitSDK = await loadLiveKitSDK();
                console.log('VoiceCake Widget: LiveKit SDK loaded successfully');
                console.log('VoiceCake Widget: LiveKit SDK object:', this.liveKitSDK);

                // Create LiveKit session
                const sessionResponse = await fetch(`${CONFIG.apiBaseUrl}/livekit/session/start/public`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        agent_id: this.agentId,
                        participant_name: `WidgetUser_${Date.now()}`
                    })
                });

                if (!sessionResponse.ok) {
                    throw new Error(`Failed to create LiveKit session: ${sessionResponse.status}`);
                }

                const responseData = await sessionResponse.json();
                console.log('VoiceCake Widget: LiveKit session response:', responseData);
                
                // Extract the actual session data from the nested response structure
                // The API returns: {success: true, data: {session_id, url, token, ...}}
                let sessionData;
                if (responseData.success === true && responseData.data) {
                    sessionData = responseData.data;
                } else {
                    sessionData = responseData; // Fallback for direct data
                }
                
                console.log('VoiceCake Widget: Extracted session data:', sessionData);
                console.log('VoiceCake Widget: Session URL:', sessionData.url);
                console.log('VoiceCake Widget: Session token:', sessionData.token ? 'Present' : 'Missing');
                console.log('VoiceCake Widget: Session data keys:', Object.keys(sessionData));
                this.sessionData = sessionData;

                // Create LiveKit room
                console.log('VoiceCake Widget: Creating LiveKit Room...');
                console.log('VoiceCake Widget: Room class available:', !!this.liveKitSDK.Room);
                
                if (!this.liveKitSDK.Room) {
                    throw new Error('LiveKit Room class not available');
                }
                
                const room = new this.liveKitSDK.Room();
                this.room = room;
                console.log('VoiceCake Widget: LiveKit Room created successfully');

                // Set up room event listeners
                this.setupLiveKitRoomEvents(room);

                // Validate session data before connecting
                if (!sessionData.url) {
                    throw new Error('LiveKit session URL is missing');
                }
                if (!sessionData.token) {
                    throw new Error('LiveKit session token is missing');
                }
                
                // Validate URL format
                try {
                    new URL(sessionData.url);
                } catch (urlError) {
                    console.error('VoiceCake Widget: Invalid session URL:', sessionData.url);
                    throw new Error(`Invalid LiveKit session URL: ${sessionData.url}`);
                }
                
                console.log('VoiceCake Widget: Connecting to room with URL:', sessionData.url);
                
                // Connect to room
                await room.connect(sessionData.url, sessionData.token);
                console.log('VoiceCake Widget: Connected to LiveKit room');

                // Enable microphone
                await room.localParticipant.setMicrophoneEnabled(true);
                console.log('VoiceCake Widget: Microphone enabled');

                this.isConnected = true;
                this.setStatus('active');
                this.setLoading(false);
                this.isProcessing = false;
                this.updateControls();

            } catch (error) {
                console.error('VoiceCake Widget: Error starting TEXT agent session:', error);
                this.setStatus('error');
                this.showError('Failed to start TEXT agent session: ' + error.message);
                this.setLoading(false);
                
                // Show close connection button even on error
                this.showCloseButton();
            }
        }

        setupLiveKitRoomEvents(room) {
            // Handle room connection
            room.on(this.liveKitSDK.RoomEvent.Connected, () => {
                console.log('VoiceCake Widget: LiveKit room connected');
                this.isConnected = true;
                this.setStatus('active');
                this.setLoading(false);
                this.updateControls();
            });

            // Handle room disconnection
            room.on(this.liveKitSDK.RoomEvent.Disconnected, () => {
                console.log('VoiceCake Widget: LiveKit room disconnected');
                this.isConnected = false;
                this.setStatus('idle');
                this.updateControls();
            });

            // Handle participant connection
            room.on(this.liveKitSDK.RoomEvent.ParticipantConnected, (participant) => {
                console.log('VoiceCake Widget: Participant connected:', participant.identity);
                if (participant.identity.includes('agent')) {
                    console.log('VoiceCake Widget: TEXT agent participant detected');
                }
            });

            // Handle audio tracks from agent
            room.on(this.liveKitSDK.RoomEvent.TrackSubscribed, (track, publication, participant) => {
                if (track.kind === this.liveKitSDK.Track.Kind.Audio && participant.identity.includes('agent')) {
                    console.log('VoiceCake Widget: Agent audio track received');
                    
                    // Create audio element for playback
                    const audioElement = track.attach();
                    audioElement.autoplay = true;
                    audioElement.volume = 1.0;
                    document.body.appendChild(audioElement);

                    // Handle audio events
                    audioElement.onplay = () => {
                        console.log('VoiceCake Widget: Agent audio started playing');
                    };

                    audioElement.onended = () => {
                        console.log('VoiceCake Widget: Agent audio ended');
                    };

                    audioElement.onerror = (error) => {
                        console.error('VoiceCake Widget: Agent audio error:', error);
                    };
                }
            });

            // Handle transcription
            room.on(this.liveKitSDK.RoomEvent.TranscriptionReceived, (segments, participant, publication) => {
                console.log('VoiceCake Widget: Transcription received:', segments);
                // Transcription handling removed as requested
            });
        }

        async startSpeechAgentSession() {
            try {
                console.log('VoiceCake Widget: Starting SPEECH agent session');
                
                // Get microphone access
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        channelCount: 1,
                        sampleRate: 48000,
                        echoCancellation: true,
                        noiseSuppression: true
                    }
                });

                this.mediaStream = stream;

                // Create WebSocket connection
                const wsUrl = `${CONFIG.wsBaseUrl}${CONFIG.humeEndpoint}/${this.agentId}`;
                console.log('VoiceCake Widget: Connecting to WebSocket:', wsUrl);
                this.socket = new WebSocket(wsUrl);

                this.socket.onopen = () => {
                    console.log('VoiceCake Widget: WebSocket connected');
                    this.isConnected = true;
                    this.setStatus('active');
                    this.setLoading(false);
                    this.updateControls();
                };

                this.socket.onmessage = async (event) => {
                    await this.handleWebSocketMessage(event);
                };

                this.socket.onclose = (event) => {
                    console.log('VoiceCake Widget: WebSocket closed:', event.code, event.reason);
                    this.isConnected = false;
                    this.setStatus('idle');
                    this.updateControls();
                };

                this.socket.onerror = (error) => {
                    console.error('VoiceCake Widget: WebSocket error:', error);
                    this.setStatus('error');
                    this.showError('WebSocket connection failed. This could be due to CORS, agent not being active, or network issues.');
                    this.showCloseButton();
                };

                // Set up media recorder
                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType: "audio/webm;codecs=opus"
                });

                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(event.data);
                    }
                };

                this.mediaRecorder.start(100);

            } catch (error) {
                console.error('VoiceCake Widget: Error starting SPEECH agent session:', error);
                throw error;
            }
        }

        async handleWebSocketMessage(event) {
            try {
                // Handle binary audio data
                if (event.data instanceof Blob) {
                    this.playAudio(event.data);
                    return;
                }

                if (event.data instanceof ArrayBuffer) {
                    const audioBlob = new Blob([event.data], { type: 'audio/webm;codecs=opus' });
                    this.playAudio(audioBlob);
                    return;
                }

                // Handle JSON messages
                const data = JSON.parse(event.data);

                if (data.interrupt || data.type === "interruption") {
                    this.stopCurrentAudio();
                    return;
                }

                if (data.audio) {
                    const audioBlob = this.base64ToBlob(data.audio, data.audio_format || 'audio/wav');
                    if (audioBlob) {
                        this.playAudio(audioBlob);
                    }
                }

            } catch (error) {
                console.error('VoiceCake Widget: Error handling WebSocket message:', error);
            }
        }

        async playAudio(audioBlob) {
            try {
                if (this.shouldInterrupt) {
                    return;
                }

                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }

                const arrayBuffer = await audioBlob.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                const source = this.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.audioContext.destination);

                this.currentAudioSource = source;
                source.start(0);

                source.onended = () => {
                    this.currentAudioSource = null;
                    this.isPlaying = false;
                };

                this.isPlaying = true;

            } catch (error) {
                console.error('VoiceCake Widget: Error playing audio:', error);
            }
        }

        stopCurrentAudio() {
            this.shouldInterrupt = true;
            
            if (this.currentAudioSource) {
                try {
                    this.currentAudioSource.stop();
                    this.currentAudioSource = null;
                } catch (error) {
                    console.warn('VoiceCake Widget: Error stopping audio:', error);
                }
            }
            
            this.isPlaying = false;
            this.shouldInterrupt = false;
        }

        base64ToBlob(base64, mimeType = 'audio/wav') {
            try {
                const base64Data = base64.replace(/^data:audio\/[^;]+;base64,/, '');
                const binaryString = atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                return new Blob([bytes], { type: mimeType });
            } catch (error) {
                console.error('VoiceCake Widget: Error converting base64 to blob:', error);
                return null;
            }
        }

        stopInference() {
            console.log('VoiceCake Widget: Stopping inference...');
            
            // Stop WebSocket connection (for SPEECH agents)
            if (this.socket) {
                this.socket.close();
                this.socket = null;
            }

            // Stop media recorder (for SPEECH agents)
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            // Stop media stream
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.mediaStream = null;
            }

            // Disconnect from LiveKit room (for TEXT agents)
            if (this.room) {
                console.log('VoiceCake Widget: Disconnecting from LiveKit room');
                this.room.disconnect();
                this.room = null;
            }

            // Clean up audio elements created by LiveKit
            const audioElements = document.querySelectorAll('audio[data-livekit-track]');
            audioElements.forEach(element => {
                element.pause();
                element.src = '';
                element.remove();
            });

            this.stopCurrentAudio();
            this.isConnected = false;
            this.setStatus('idle');
            this.setLoading(false);
            this.isProcessing = false;
            this.updateControls();
            
            // Remove any close connection buttons that might have been added
            const closeBtn = document.querySelector('.voicecake-close-connection');
            if (closeBtn) {
                closeBtn.remove();
            }
            
            console.log('VoiceCake Widget: Inference stopped successfully');
        }

        updateControls() {
            const startBtn = document.getElementById('voicecake-start');
            if (!startBtn) return;

            // Remove all existing event listeners
            startBtn.onclick = null;
            startBtn.removeEventListener('click', this.startInference);
            startBtn.removeEventListener('click', this.stopInference);

            if (this.isConnected) {
                startBtn.innerHTML = '<span>⏹️</span> End Chat';
                startBtn.onclick = () => {
                    console.log('VoiceCake Widget: End Chat button clicked');
                    this.stopInference();
                };
            } else {
                startBtn.innerHTML = '<span>🎙️</span> Start Voice Chat';
                startBtn.onclick = () => {
                    console.log('VoiceCake Widget: Start Chat button clicked');
                    this.startInference();
                };
            }
        }

        setStatus(status) {
            // Update the floating button status indicator
            const statusIndicator = document.getElementById('voicecake-status');
            if (statusIndicator) {
                statusIndicator.className = `voicecake-status-indicator ${status}`;
            }

            // Update the status text in the popup
            const statusDisplay = document.getElementById('voicecake-status-display');
            const statusText = statusDisplay?.querySelector('.voicecake-status-text');
            if (statusText) {
                const statusMessages = {
                    idle: 'Ready to start',
                    connecting: 'Connecting...',
                    active: 'Conversation active',
                    error: 'Connection error'
                };
                statusText.textContent = statusMessages[status] || 'Unknown status';
            }
        }

        setLoading(loading) {
            console.log('VoiceCake Widget: setLoading called with:', loading);
            this.isLoading = loading;
            const startBtn = document.getElementById('voicecake-start');
            if (startBtn) {
                console.log('VoiceCake Widget: Found start button, setting disabled to:', loading);
                startBtn.disabled = loading;
                if (loading) {
                    startBtn.innerHTML = `
                        <span class="voicecake-loading">
                            <span class="voicecake-loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                            Connecting...
                        </span>
                    `;
                } else {
                    // Restore button content when loading is false
                    console.log('VoiceCake Widget: Restoring button content via updateControls');
                    this.updateControls();
                }
            } else {
                console.log('VoiceCake Widget: Start button not found!');
            }
        }

        showError(message) {
            const content = document.getElementById('voicecake-content');
            if (!content) return;

            const errorDiv = document.createElement('div');
            errorDiv.className = 'voicecake-error';
            errorDiv.textContent = message;

            // Remove existing error messages
            const existingErrors = content.querySelectorAll('.voicecake-error');
            existingErrors.forEach(error => error.remove());

            // Insert error at the top
            content.insertBefore(errorDiv, content.firstChild);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        }

        togglePanel() {
            const panel = document.getElementById('voicecake-panel');
            if (!panel) return;

            this.isOpen = !this.isOpen;
            panel.classList.toggle('open', this.isOpen);
        }

        closePanel() {
            const panel = document.getElementById('voicecake-panel');
            if (!panel) return;

            this.isOpen = false;
            panel.classList.remove('open');
        }


        showCloseButton() {
            const content = document.getElementById('voicecake-content');
            if (!content) return;

            // Remove existing close button if any
            const existingCloseBtn = content.querySelector('.voicecake-close-connection');
            if (existingCloseBtn) {
                existingCloseBtn.remove();
            }

            // Add close connection button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'voicecake-control-btn secondary voicecake-close-connection';
            closeBtn.style.marginTop = '10px';
            closeBtn.innerHTML = '<span>❌</span> Close Connection';
            closeBtn.onclick = () => this.stopInference();

            // Find the controls section and add the close button
            const controls = content.querySelector('.voicecake-controls');
            if (controls) {
                controls.appendChild(closeBtn);
            }
        }

        // Public API methods
        destroy() {
            this.stopInference();
            const widget = document.querySelector('.voicecake-widget');
            if (widget) {
                widget.remove();
            }
        }

        getStatus() {
            return {
                isConnected: this.isConnected,
                isOpen: this.isOpen,
                isLoading: this.isLoading,
                agent: this.agent
            };
        }
    }

    // Initialize widget when script loads
    function initVoiceCakeWidget() {
        // Get configuration from script tag
        const scripts = document.getElementsByTagName('script');
        let currentScript = null;
        
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('voicecake-widget.js')) {
                currentScript = scripts[i];
                break;
            }
        }

        if (!currentScript) {
            console.error('VoiceCake Widget: Could not find script tag');
            return;
        }

        const agentId = currentScript.getAttribute('data-agent-id');
        const position = currentScript.getAttribute('data-position') || 'bottom-right';
        const theme = currentScript.getAttribute('data-theme') || 'light';

        if (!agentId) {
            console.error('VoiceCake Widget: Agent ID is required. Please add data-agent-id attribute to the script tag.');
            return;
        }

        // Create widget instance
        window.voicecakeWidget = new VoiceCakeWidget({
            agentId: agentId,
            position: position,
            theme: theme,
            agentType: 'TEXT' // Force TEXT agent type since you mentioned it's text-to-speech
        });

        console.log('VoiceCake Widget initialized:', {
            agentId: agentId,
            position: position,
            theme: theme
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVoiceCakeWidget);
    } else {
        initVoiceCakeWidget();
    }

    // Export for global access
    window.VoiceCakeWidget = VoiceCakeWidget;

})();
