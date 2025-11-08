// VoiceCake Complete Theme for Sim AI - Light/Dark Mode with Switcher
(function() {
  'use strict';
  
  console.log('🎨 Applying VoiceCake Complete Theme to Sim AI...');
  
  // VoiceCake Color Palettes
  const voicecakeColors = {
    light: {
      primary: '#2a85ff',
      primaryHover: '#1a75ef',
      secondary: '#00a656',
      accent: '#7f5fff',
      accentHover: '#6f4fef',
      background: '#fdfdfd',
      card: '#f1f1f1',
      border: '#e2e2e2',
      text: '#101010',
      textMuted: '#727272',
      surface: '#f1f1f1',
      surfaceHover: '#e2e2e2'
    },
    dark: {
      primary: '#2a85ff',
      primaryHover: '#1a75ef',
      secondary: '#00a656',
      accent: '#7f5fff',
      accentHover: '#6f4fef',
      background: '#141414',
      card: '#191919',
      border: '#222222',
      text: '#f1f1f1',
      textMuted: '#727272',
      surface: '#191919',
      surfaceHover: '#222222'
    }
  };

  // Get current theme (default to light)
  let currentTheme = localStorage.getItem('voicecake-theme') || 'light';
  
  // Function to apply theme
  function applyTheme(theme) {
    const colors = voicecakeColors[theme];
    currentTheme = theme;
    localStorage.setItem('voicecake-theme', theme);
    
    // Remove existing styles
    const existingStyle = document.getElementById('voicecake-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject VoiceCake styles
    const style = document.createElement('style');
    style.id = 'voicecake-theme-styles';
    style.textContent = `
      /* VoiceCake Complete Theme - ${theme} mode */
      :root {
        --background: ${theme === 'light' ? '0 0% 100%' : '0 0% 6.3%'} !important;
        --foreground: ${theme === 'light' ? '0 0% 6.3%' : '0 0% 94.5%'} !important;
        --card: ${theme === 'light' ? '0 0% 94.5%' : '0 0% 9.8%'} !important;
        --card-foreground: ${theme === 'light' ? '0 0% 6.3%' : '0 0% 94.5%'} !important;
        --popover: ${theme === 'light' ? '0 0% 100%' : '0 0% 9.8%'} !important;
        --popover-foreground: ${theme === 'light' ? '0 0% 6.3%' : '0 0% 94.5%'} !important;
        --primary: 214 100% 58% !important;
        --primary-foreground: 0 0% 100% !important;
        --secondary: ${theme === 'light' ? '0 0% 94.5%' : '0 0% 13.7%'} !important;
        --secondary-foreground: ${theme === 'light' ? '0 0% 6.3%' : '0 0% 94.5%'} !important;
        --muted: ${theme === 'light' ? '0 0% 94.5%' : '0 0% 13.7%'} !important;
        --muted-foreground: 0 0% 45% !important;
        --accent: ${theme === 'light' ? '0 0% 94.5%' : '0 0% 13.7%'} !important;
        --accent-foreground: ${theme === 'light' ? '0 0% 6.3%' : '0 0% 94.5%'} !important;
        --destructive: 8 100% 58% !important;
        --destructive-foreground: 0 0% 100% !important;
        --border: ${theme === 'light' ? '0 0% 88.6%' : '0 0% 15.3%'} !important;
        --input: ${theme === 'light' ? '0 0% 88.6%' : '0 0% 15.3%'} !important;
        --ring: 214 100% 58% !important;
        --radius: 0.75rem !important;
        --brand-primary-hex: ${colors.primary} !important;
        --brand-primary-hover-hex: ${colors.primaryHover} !important;
        --brand-secondary-hex: ${colors.secondary} !important;
        --brand-accent-hex: ${colors.accent} !important;
        --brand-accent-hover-hex: ${colors.accentHover} !important;
        --brand-background-hex: ${colors.background} !important;
      }

      /* Global Font Family */
      * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }

      /* Button Styling */
      button[data-variant="default"],
      .btn-primary,
      [data-variant="default"],
      button[type="submit"],
      .btn {
        background-color: ${colors.primary} !important;
        border-color: ${colors.primary} !important;
        color: white !important;
        border-radius: 0.75rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }

      button[data-variant="default"]:hover,
      .btn-primary:hover,
      [data-variant="default"]:hover,
      button[type="submit"]:hover,
      .btn:hover {
        background-color: ${colors.primaryHover} !important;
        border-color: ${colors.primaryHover} !important;
        transform: translateY(-1px) !important;
      }

      /* Secondary Buttons */
      button[data-variant="secondary"],
      .btn-secondary {
        background-color: ${colors.secondary} !important;
        border-color: ${colors.secondary} !important;
        color: white !important;
      }

      button[data-variant="secondary"]:hover,
      .btn-secondary:hover {
        background-color: #009546 !important;
        border-color: #009546 !important;
      }

      /* Card Styling */
      .card,
      [data-variant="card"],
      [class*="card"],
      [class*="Card"],
      .bg-card {
        background-color: ${colors.card} !important;
        border: 1.5px solid ${colors.border} !important;
        border-radius: 1.5rem !important;
        box-shadow: ${theme === 'light' 
          ? '0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05)' 
          : 'inset 0 0 0 1.5px rgba(229,229,229,0.04), 0px 5px 1.5px -4px rgba(8,8,8,0.5), 0px 6px 4px -4px rgba(8,8,8,0.05)'} !important;
      }

      /* Input Styling */
      input,
      textarea,
      select {
        border-radius: 0.75rem !important;
        border: 1.5px solid ${colors.border} !important;
        transition: border-color 0.2s ease !important;
        background-color: ${colors.card} !important;
        color: ${colors.text} !important;
      }

      input:focus,
      textarea:focus,
      select:focus {
        border-color: ${colors.primary} !important;
        box-shadow: 0 0 0 2px ${colors.primary}20 !important;
        outline: none !important;
      }

      /* Navigation Styling */
      nav,
      .nav,
      [role="navigation"],
      .sidebar,
      [class*="nav"],
      [class*="Nav"] {
        background-color: ${colors.card} !important;
        border-color: ${colors.border} !important;
      }

      /* Link Styling */
      a {
        color: ${colors.primary} !important;
        transition: color 0.2s ease !important;
      }

      a:hover {
        color: ${colors.primaryHover} !important;
      }

      /* Text Colors */
      .text-muted-foreground,
      .text-muted {
        color: ${colors.textMuted} !important;
      }

      /* Background Colors */
      .bg-background {
        background-color: ${colors.background} !important;
      }

      .bg-card {
        background-color: ${colors.card} !important;
      }

      /* Border Colors */
      .border {
        border-color: ${colors.border} !important;
      }

      /* Workflow Canvas Styling */
      .workflow-canvas,
      [class*="canvas"],
      [class*="Canvas"] {
        background-color: ${colors.background} !important;
        background-image: radial-gradient(circle at 1px 1px, ${colors.card} 1px, transparent 0) !important;
        background-size: 20px 20px !important;
      }

      /* Workflow Node Styling */
      .workflow-node,
      [class*="node"],
      [class*="Node"] {
        background-color: ${colors.card} !important;
        border: 1.5px solid ${colors.primary}30 !important;
        border-radius: 0.75rem !important;
        box-shadow: ${theme === 'light' 
          ? '0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05)' 
          : 'inset 0 0 0 1.5px rgba(229,229,229,0.04), 0px 5px 1.5px -4px rgba(8,8,8,0.5), 0px 6px 4px -4px rgba(8,8,8,0.05)'} !important;
        transition: all 0.2s ease !important;
      }

      .workflow-node:hover,
      [class*="node"]:hover,
      [class*="Node"]:hover {
        border-color: ${colors.primary}60 !important;
        transform: translateY(-2px) !important;
        box-shadow: ${theme === 'light'
          ? '0px 8px 2px -4px rgba(8, 8, 8, 0.6), 0px 12px 6px -4px rgba(8, 8, 8, 0.08)'
          : 'inset 0 0 0 1.5px rgba(229,229,229,0.06), 0px 8px 2px -4px rgba(8,8,8,0.6), 0px 12px 6px -4px rgba(8,8,8,0.08)'} !important;
      }

      /* Success/Error States */
      .text-green-600,
      .text-green-500,
      .success,
      [class*="success"] {
        color: ${colors.secondary} !important;
      }

      .text-red-600,
      .text-red-500,
      .error,
      [class*="error"] {
        color: #ff381c !important;
      }

      /* Logo and Branding */
      .brand-logo,
      .logo,
      [class*="logo"],
      [class*="Logo"] {
        color: ${colors.primary} !important;
        font-weight: 600 !important;
      }

      /* Breadcrumbs */
      .breadcrumb,
      [class*="breadcrumb"],
      [class*="Breadcrumb"] {
        color: ${colors.textMuted} !important;
      }

      /* Loading States */
      .loading,
      [class*="loading"],
      [class*="Loading"] {
        color: ${colors.primary} !important;
      }

      /* Focus States */
      *:focus {
        outline: 2px solid ${colors.primary} !important;
        outline-offset: 2px !important;
      }

      /* Scrollbar Styling */
      ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }

      ::-webkit-scrollbar-track {
        background: ${colors.card} !important;
        border-radius: 4px !important;
      }

      ::-webkit-scrollbar-thumb {
        background: ${colors.textMuted} !important;
        border-radius: 4px !important;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${colors.text} !important;
      }

      /* Override any remaining Sim AI specific styles */
      [style*="purple"],
      [style*="#701ffc"],
      [style*="#802fff"] {
        color: ${colors.primary} !important;
        background-color: ${colors.primary} !important;
        border-color: ${colors.primary} !important;
      }

      /* Theme Switcher Styles */
      .voicecake-theme-switcher {
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
        background: ${colors.card} !important;
        border: 1.5px solid ${colors.border} !important;
        border-radius: 0.75rem !important;
        padding: 8px !important;
        box-shadow: ${theme === 'light' 
          ? '0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05)' 
          : 'inset 0 0 0 1.5px rgba(229,229,229,0.04), 0px 5px 1.5px -4px rgba(8,8,8,0.5), 0px 6px 4px -4px rgba(8,8,8,0.05)'} !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        color: ${colors.text} !important;
      }

      .voicecake-theme-switcher button {
        background: ${colors.primary} !important;
        color: white !important;
        border: none !important;
        border-radius: 0.5rem !important;
        padding: 6px 12px !important;
        cursor: pointer !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
        font-size: 12px !important;
      }

      .voicecake-theme-switcher button:hover {
        background: ${colors.primaryHover} !important;
        transform: translateY(-1px) !important;
      }

      .voicecake-theme-switcher button.active {
        background: ${colors.secondary} !important;
      }

      /* Body theme class */
      body.voicecake-theme-light {
        background-color: ${colors.background} !important;
        color: ${colors.text} !important;
      }

      body.voicecake-theme-dark {
        background-color: ${colors.background} !important;
        color: ${colors.text} !important;
      }
    `;

    // Inject styles
    document.head.appendChild(style);

    // Update body class
    document.body.className = document.body.className.replace(/voicecake-theme-(light|dark)/g, '');
    document.body.classList.add(`voicecake-theme-${theme}`);

    // Update page title
    document.title = document.title.replace('Sim', 'VoiceCake AI');

    // Update branding elements
    const logoElements = document.querySelectorAll('[data-brand="logo"], .brand-logo, .logo, h1, .text-xl, .text-2xl');
    logoElements.forEach(element => {
      if (element.textContent && element.textContent.includes('Sim')) {
        element.textContent = element.textContent.replace('Sim', 'VoiceCake AI');
        element.style.color = colors.primary;
      }
    });

    // Update theme switcher
    updateThemeSwitcher();
  }

  // Create theme switcher
  function createThemeSwitcher() {
    // Remove existing switcher
    const existingSwitcher = document.querySelector('.voicecake-theme-switcher');
    if (existingSwitcher) {
      existingSwitcher.remove();
    }

    const switcher = document.createElement('div');
    switcher.className = 'voicecake-theme-switcher';
    switcher.innerHTML = `
      <span>🎨</span>
      <button onclick="window.switchVoiceCakeTheme('light')" class="${currentTheme === 'light' ? 'active' : ''}">Light</button>
      <button onclick="window.switchVoiceCakeTheme('dark')" class="${currentTheme === 'dark' ? 'active' : ''}">Dark</button>
    `;

    document.body.appendChild(switcher);
  }

  // Update theme switcher buttons
  function updateThemeSwitcher() {
    const buttons = document.querySelectorAll('.voicecake-theme-switcher button');
    buttons.forEach(button => {
      button.classList.remove('active');
      if (button.textContent.toLowerCase() === currentTheme) {
        button.classList.add('active');
      }
    });
  }

  // Global theme switch function
  window.switchVoiceCakeTheme = function(theme) {
    applyTheme(theme);
  };

  // Initialize theme
  applyTheme(currentTheme);
  createThemeSwitcher();

  console.log('✅ VoiceCake Complete Theme applied successfully!');
  console.log(`🎨 Current theme: ${currentTheme}`);
  console.log('🌙 Use the theme switcher in the top-right corner to switch between light and dark modes');
  console.log('🔄 Theme preference is saved and will persist across sessions');
})();

