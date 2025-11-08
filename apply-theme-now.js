// 🎨 VoiceCake Theme for Sim AI - APPLY NOW
// Copy this entire script and paste it into Sim AI's browser console (F12 → Console)

(function() {
  'use strict';
  
  console.log('🎨 Applying VoiceCake theme to Sim AI...');
  
  // VoiceCake Brand Configuration
  const voicecakeConfig = {
    name: 'VoiceCake AI',
    primaryColor: '#2a85ff',
    primaryHoverColor: '#1a75ef',
    secondaryColor: '#00a656',
    accentColor: '#7f5fff',
    errorColor: '#ff381c',
    warningColor: '#ff9d34'
  };

  // Apply theme immediately
  function applyVoiceCakeTheme() {
    // Add theme class to body
    document.body.classList.add('voicecake-theme');
    
    // Update page title
    document.title = document.title.replace('Sim', 'VoiceCake AI');
    
    // Create and inject styles
    const style = document.createElement('style');
    style.id = 'voicecake-theme-styles';
    style.textContent = `
      /* VoiceCake Theme Styles */
      .voicecake-theme {
        --brand-primary: ${voicecakeConfig.primaryColor};
        --brand-primary-hover: ${voicecakeConfig.primaryHoverColor};
        --brand-secondary: ${voicecakeConfig.secondaryColor};
        --brand-accent: ${voicecakeConfig.accentColor};
        --brand-error: ${voicecakeConfig.errorColor};
        --brand-warning: ${voicecakeConfig.warningColor};
      }
      
      /* Typography */
      .voicecake-theme {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      
      /* Button Styling */
      .voicecake-theme button[data-variant="default"],
      .voicecake-theme .btn-primary,
      .voicecake-theme button[type="submit"],
      .voicecake-theme .btn {
        background-color: ${voicecakeConfig.primaryColor} !important;
        border-color: ${voicecakeConfig.primaryColor} !important;
        color: white !important;
        border-radius: 0.75rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }
      
      .voicecake-theme button[data-variant="default"]:hover,
      .voicecake-theme .btn-primary:hover,
      .voicecake-theme button[type="submit"]:hover,
      .voicecake-theme .btn:hover {
        background-color: ${voicecakeConfig.primaryHoverColor} !important;
        border-color: ${voicecakeConfig.primaryHoverColor} !important;
        transform: translateY(-1px) !important;
      }
      
      /* Card Styling */
      .voicecake-theme .card,
      .voicecake-theme [class*="card"],
      .voicecake-theme [class*="Card"] {
        border-radius: 1.5rem !important;
        box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
        border: 1.5px solid #e2e2e2 !important;
        background-color: #fdfdfd !important;
      }
      
      .dark .voicecake-theme .card,
      .dark .voicecake-theme [class*="card"],
      .dark .voicecake-theme [class*="Card"] {
        box-shadow: inset 0 0 0 1.5px rgba(229,229,229,0.04), 0px 5px 1.5px -4px rgba(8,8,8,0.5), 0px 6px 4px -4px rgba(8,8,8,0.05) !important;
        border: 1.5px solid #222222 !important;
        background-color: #191919 !important;
      }
      
      /* Input Styling */
      .voicecake-theme input,
      .voicecake-theme textarea,
      .voicecake-theme select {
        border: 1.5px solid #e2e2e2 !important;
        border-radius: 0.75rem !important;
        transition: border-color 0.2s ease !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      
      .voicecake-theme input:focus,
      .voicecake-theme textarea:focus,
      .voicecake-theme select:focus {
        border-color: ${voicecakeConfig.primaryColor} !important;
        box-shadow: 0 0 0 2px ${voicecakeConfig.primaryColor}20 !important;
        outline: none !important;
      }
      
      /* Link Styling */
      .voicecake-theme a {
        color: ${voicecakeConfig.primaryColor} !important;
        transition: color 0.2s ease !important;
      }
      
      .voicecake-theme a:hover {
        color: ${voicecakeConfig.primaryHoverColor} !important;
      }
      
      /* Navigation Styling */
      .voicecake-theme nav,
      .voicecake-theme .sidebar,
      .voicecake-theme [class*="nav"],
      .voicecake-theme [class*="Nav"] {
        background-color: #f1f1f1 !important;
        border-color: #e2e2e2 !important;
      }
      
      .dark .voicecake-theme nav,
      .dark .voicecake-theme .sidebar,
      .dark .voicecake-theme [class*="nav"],
      .dark .voicecake-theme [class*="Nav"] {
        background-color: #191919 !important;
        border-color: #222222 !important;
      }
      
      /* Workflow Canvas Styling */
      .voicecake-theme .workflow-canvas,
      .voicecake-theme [class*="canvas"],
      .voicecake-theme [class*="Canvas"] {
        background-color: #fdfdfd !important;
        background-image: radial-gradient(circle at 1px 1px, #f1f1f1 1px, transparent 0) !important;
        background-size: 20px 20px !important;
      }
      
      .dark .voicecake-theme .workflow-canvas,
      .dark .voicecake-theme [class*="canvas"],
      .dark .voicecake-theme [class*="Canvas"] {
        background-color: #141414 !important;
        background-image: radial-gradient(circle at 1px 1px, #191919 1px, transparent 0) !important;
      }
      
      /* Workflow Node Styling */
      .voicecake-theme .workflow-node,
      .voicecake-theme [class*="node"],
      .voicecake-theme [class*="Node"] {
        background-color: #fdfdfd !important;
        border: 1.5px solid ${voicecakeConfig.primaryColor}30 !important;
        border-radius: 0.75rem !important;
        box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
        transition: all 0.2s ease !important;
      }
      
      .voicecake-theme .workflow-node:hover,
      .voicecake-theme [class*="node"]:hover,
      .voicecake-theme [class*="Node"]:hover {
        border-color: ${voicecakeConfig.primaryColor}60 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0px 8px 2px -4px rgba(8, 8, 8, 0.6), 0px 12px 6px -4px rgba(8, 8, 8, 0.08) !important;
      }
      
      .dark .voicecake-theme .workflow-node,
      .dark .voicecake-theme [class*="node"],
      .dark .voicecake-theme [class*="Node"] {
        background-color: #191919 !important;
        border: 1.5px solid ${voicecakeConfig.primaryColor}30 !important;
        box-shadow: inset 0 0 0 1.5px rgba(229,229,229,0.04), 0px 5px 1.5px -4px rgba(8,8,8,0.5), 0px 6px 4px -4px rgba(8,8,8,0.05) !important;
      }
      
      /* Status Colors */
      .voicecake-theme .success,
      .voicecake-theme .text-success,
      .voicecake-theme [class*="success"] {
        color: ${voicecakeConfig.secondaryColor} !important;
      }
      
      .voicecake-theme .error,
      .voicecake-theme .text-error,
      .voicecake-theme [class*="error"] {
        color: ${voicecakeConfig.errorColor} !important;
      }
      
      .voicecake-theme .warning,
      .voicecake-theme .text-warning,
      .voicecake-theme [class*="warning"] {
        color: ${voicecakeConfig.warningColor} !important;
      }
      
      /* Logo and Branding */
      .voicecake-theme .brand-logo,
      .voicecake-theme .logo,
      .voicecake-theme [class*="logo"],
      .voicecake-theme [class*="Logo"] {
        color: ${voicecakeConfig.primaryColor} !important;
        font-weight: 600 !important;
      }
      
      /* Breadcrumbs */
      .voicecake-theme .breadcrumb,
      .voicecake-theme [class*="breadcrumb"],
      .voicecake-theme [class*="Breadcrumb"] {
        color: #727272 !important;
      }
      
      /* Loading States */
      .voicecake-theme .loading,
      .voicecake-theme [class*="loading"],
      .voicecake-theme [class*="Loading"] {
        color: ${voicecakeConfig.primaryColor} !important;
      }
      
      /* Focus States */
      .voicecake-theme *:focus {
        outline: 2px solid ${voicecakeConfig.primaryColor} !important;
        outline-offset: 2px !important;
      }
      
      /* Scrollbar Styling */
      .voicecake-theme ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }
      
      .voicecake-theme ::-webkit-scrollbar-track {
        background: #f1f1f1 !important;
        border-radius: 4px !important;
      }
      
      .voicecake-theme ::-webkit-scrollbar-thumb {
        background: #c1c1c1 !important;
        border-radius: 4px !important;
      }
      
      .voicecake-theme ::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8 !important;
      }
      
      .dark .voicecake-theme ::-webkit-scrollbar-track {
        background: #191919 !important;
      }
      
      .dark .voicecake-theme ::-webkit-scrollbar-thumb {
        background: #4c4c4c !important;
      }
      
      .dark .voicecake-theme ::-webkit-scrollbar-thumb:hover {
        background: #727272 !important;
      }
    `;
    
    // Remove existing theme styles if present
    const existingStyle = document.getElementById('voicecake-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new styles
    document.head.appendChild(style);
    
    // Update branding elements
    updateBranding();
    
    console.log('✅ VoiceCake theme applied successfully!');
    console.log('🎯 Sim AI now matches VoiceCake design system');
    console.log('🎨 Colors: Blue (#2a85ff), Green (#00a656), Purple (#7f5fff)');
    console.log('📝 Typography: Inter font family');
    console.log('🔘 Components: Rounded corners, VoiceCake shadows');
  }

  // Update branding elements
  function updateBranding() {
    // Update logo and brand name
    const logoElements = document.querySelectorAll('[data-brand="logo"], .brand-logo, .logo, [class*="logo"], [class*="Logo"]');
    logoElements.forEach(element => {
      if (element.tagName === 'IMG') {
        element.src = '/images/voicecake-logo.png';
        element.alt = voicecakeConfig.name;
      } else {
        element.textContent = element.textContent.replace('Sim', 'VoiceCake AI');
      }
    });

    // Update navigation text
    const navItems = document.querySelectorAll('nav a, .nav-item, [class*="nav"], [class*="Nav"]');
    navItems.forEach(item => {
      const text = item.textContent;
      if (text.includes('Sim')) {
        item.textContent = text.replace('Sim', 'VoiceCake AI');
      }
    });

    // Update breadcrumbs
    const breadcrumbs = document.querySelectorAll('.breadcrumb, [data-breadcrumb], [class*="breadcrumb"], [class*="Breadcrumb"]');
    breadcrumbs.forEach(breadcrumb => {
      const text = breadcrumb.textContent;
      if (text.includes('Sim')) {
        breadcrumb.textContent = text.replace('Sim', 'VoiceCake AI');
      }
    });
  }

  // Apply theme immediately
  applyVoiceCakeTheme();

  // Re-apply theme on navigation changes (for SPA)
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

  // Export for manual re-application
  window.reapplyVoiceCakeTheme = applyVoiceCakeTheme;
  
  console.log('🔄 Theme will automatically re-apply on navigation changes');
  console.log('💡 Use window.reapplyVoiceCakeTheme() to manually re-apply the theme');
  
})();

