// VoiceCake Theme Configuration for Sim AI
// This script applies VoiceCake branding and styling to Sim AI

(function() {
  'use strict';
  
  // VoiceCake Brand Configuration
  const voicecakeConfig = {
    name: 'VoiceCake AI',
    logoUrl: '/images/voicecake-logo.png', // Update with actual logo path
    primaryColor: '#2a85ff',
    primaryHoverColor: '#1a75ef',
    secondaryColor: '#00a656',
    accentColor: '#7f5fff',
    accentHoverColor: '#6f4fef',
    backgroundColor: '#fdfdfd',
    darkBackgroundColor: '#141414'
  };

  // Apply VoiceCake theme to Sim AI
  function applyVoiceCakeTheme() {
    // Add VoiceCake theme class to body
    document.body.classList.add('voicecake-theme');
    
    // Update page title
    document.title = document.title.replace('Sim', 'VoiceCake AI');
    
    // Update branding elements
    updateBranding();
    
    // Apply custom styles
    applyCustomStyles();
    
    // Update navigation
    updateNavigation();
    
    console.log('🎨 VoiceCake theme applied to Sim AI');
  }

  // Update branding elements
  function updateBranding() {
    // Update logo and brand name
    const logoElements = document.querySelectorAll('[data-brand="logo"], .brand-logo, .logo');
    logoElements.forEach(element => {
      if (element.tagName === 'IMG') {
        element.src = voicecakeConfig.logoUrl;
        element.alt = voicecakeConfig.name;
      } else {
        element.textContent = voicecakeConfig.name;
        element.style.color = voicecakeConfig.primaryColor;
      }
    });

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = voicecakeConfig.logoUrl;
    }
  }

  // Apply custom VoiceCake styles
  function applyCustomStyles() {
    // Create style element for custom CSS
    const style = document.createElement('style');
    style.textContent = `
      /* VoiceCake Custom Overrides */
      .voicecake-theme {
        --brand-primary: ${voicecakeConfig.primaryColor};
        --brand-primary-hover: ${voicecakeConfig.primaryHoverColor};
        --brand-secondary: ${voicecakeConfig.secondaryColor};
        --brand-accent: ${voicecakeConfig.accentColor};
        --brand-accent-hover: ${voicecakeConfig.accentHoverColor};
      }
      
      /* Update button colors */
      .voicecake-theme button[data-variant="default"],
      .voicecake-theme .btn-primary {
        background-color: ${voicecakeConfig.primaryColor} !important;
        border-color: ${voicecakeConfig.primaryColor} !important;
      }
      
      .voicecake-theme button[data-variant="default"]:hover,
      .voicecake-theme .btn-primary:hover {
        background-color: ${voicecakeConfig.primaryHoverColor} !important;
        border-color: ${voicecakeConfig.primaryHoverColor} !important;
      }
      
      /* Update link colors */
      .voicecake-theme a {
        color: ${voicecakeConfig.primaryColor};
      }
      
      .voicecake-theme a:hover {
        color: ${voicecakeConfig.primaryHoverColor};
      }
      
      /* Update focus states */
      .voicecake-theme input:focus,
      .voicecake-theme textarea:focus,
      .voicecake-theme select:focus {
        border-color: ${voicecakeConfig.primaryColor} !important;
        box-shadow: 0 0 0 2px ${voicecakeConfig.primaryColor}20 !important;
      }
      
      /* Update workflow node colors */
      .voicecake-theme .workflow-node {
        border-color: ${voicecakeConfig.primaryColor}30 !important;
      }
      
      .voicecake-theme .workflow-node:hover {
        border-color: ${voicecakeConfig.primaryColor}60 !important;
      }
      
      /* Update sidebar and navigation */
      .voicecake-theme .sidebar,
      .voicecake-theme nav {
        background-color: #f1f1f1 !important;
        border-color: #e2e2e2 !important;
      }
      
      .dark .voicecake-theme .sidebar,
      .dark .voicecake-theme nav {
        background-color: #191919 !important;
        border-color: #222222 !important;
      }
      
      /* Update card styling */
      .voicecake-theme .card {
        border-radius: 1.5rem !important;
        box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
      }
      
      .dark .voicecake-theme .card {
        box-shadow: inset 0 0 0 1.5px rgba(229,229,229,0.04), 0px 5px 1.5px -4px rgba(8,8,8,0.5), 0px 6px 4px -4px rgba(8,8,8,0.05) !important;
      }
      
      /* Update typography */
      .voicecake-theme {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      
      /* Update success/error colors */
      .voicecake-theme .success,
      .voicecake-theme .text-success {
        color: ${voicecakeConfig.secondaryColor} !important;
      }
      
      .voicecake-theme .error,
      .voicecake-theme .text-error {
        color: #ff381c !important;
      }
      
      .voicecake-theme .warning,
      .voicecake-theme .text-warning {
        color: #ff9d34 !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Update navigation elements
  function updateNavigation() {
    // Update navigation text
    const navItems = document.querySelectorAll('nav a, .nav-item');
    navItems.forEach(item => {
      const text = item.textContent;
      if (text.includes('Sim')) {
        item.textContent = text.replace('Sim', 'VoiceCake AI');
      }
    });

    // Update breadcrumbs
    const breadcrumbs = document.querySelectorAll('.breadcrumb, [data-breadcrumb]');
    breadcrumbs.forEach(breadcrumb => {
      const text = breadcrumb.textContent;
      if (text.includes('Sim')) {
        breadcrumb.textContent = text.replace('Sim', 'VoiceCake AI');
      }
    });
  }

  // Wait for DOM to be ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyVoiceCakeTheme);
    } else {
      applyVoiceCakeTheme();
    }
  }

  // Initialize the theme
  init();

  // Re-apply theme when navigation changes (for SPA)
  let currentUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      setTimeout(applyVoiceCakeTheme, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

