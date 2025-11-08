// VoiceCake Theme for Sim AI - Direct Application Script
// Run this in the browser console on http://localhost:3001

(function() {
  'use strict';
  
  console.log('🎨 Applying VoiceCake theme to Sim AI...');
  
  // VoiceCake Color Palette
  const voicecakeColors = {
    primary: '#2a85ff',
    primaryHover: '#1a75ef',
    secondary: '#00a656',
    accent: '#7f5fff',
    accentHover: '#6f4fef',
    background: '#fdfdfd',
    card: '#f1f1f1',
    border: '#e2e2e2',
    text: '#101010',
    textMuted: '#727272'
  };

  // Create and inject VoiceCake styles
  const style = document.createElement('style');
  style.textContent = `
    /* VoiceCake Theme Override */
    :root {
      --background: 0 0% 100% !important;
      --foreground: 0 0% 6.3% !important;
      --card: 0 0% 94.5% !important;
      --card-foreground: 0 0% 6.3% !important;
      --popover: 0 0% 100% !important;
      --popover-foreground: 0 0% 6.3% !important;
      --primary: 214 100% 58% !important;
      --primary-foreground: 0 0% 100% !important;
      --secondary: 0 0% 94.5% !important;
      --secondary-foreground: 0 0% 6.3% !important;
      --muted: 0 0% 94.5% !important;
      --muted-foreground: 0 0% 45% !important;
      --accent: 0 0% 94.5% !important;
      --accent-foreground: 0 0% 6.3% !important;
      --destructive: 8 100% 58% !important;
      --destructive-foreground: 0 0% 100% !important;
      --border: 0 0% 88.6% !important;
      --input: 0 0% 88.6% !important;
      --ring: 214 100% 58% !important;
      --radius: 0.75rem !important;
      --brand-primary-hex: ${voicecakeColors.primary} !important;
      --brand-primary-hover-hex: ${voicecakeColors.primaryHover} !important;
      --brand-secondary-hex: ${voicecakeColors.secondary} !important;
      --brand-accent-hex: ${voicecakeColors.accent} !important;
      --brand-accent-hover-hex: ${voicecakeColors.accentHover} !important;
      --brand-background-hex: ${voicecakeColors.background} !important;
    }

    /* Global Font Family */
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    /* Button Styling */
    button[data-variant="default"],
    .btn-primary,
    [data-variant="default"] {
      background-color: ${voicecakeColors.primary} !important;
      border-color: ${voicecakeColors.primary} !important;
      color: white !important;
      border-radius: 0.75rem !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
    }

    button[data-variant="default"]:hover,
    .btn-primary:hover,
    [data-variant="default"]:hover {
      background-color: ${voicecakeColors.primaryHover} !important;
      border-color: ${voicecakeColors.primaryHover} !important;
      transform: translateY(-1px) !important;
    }

    /* Card Styling */
    .card,
    [data-variant="card"],
    .bg-card {
      background-color: ${voicecakeColors.card} !important;
      border: 1.5px solid ${voicecakeColors.border} !important;
      border-radius: 1.5rem !important;
      box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
    }

    /* Input Styling */
    input,
    textarea,
    select {
      border-radius: 0.75rem !important;
      border: 1.5px solid ${voicecakeColors.border} !important;
      transition: border-color 0.2s ease !important;
    }

    input:focus,
    textarea:focus,
    select:focus {
      border-color: ${voicecakeColors.primary} !important;
      box-shadow: 0 0 0 2px ${voicecakeColors.primary}20 !important;
      outline: none !important;
    }

    /* Navigation Styling */
    nav,
    .nav,
    [role="navigation"] {
      background-color: ${voicecakeColors.card} !important;
    }

    /* Link Styling */
    a {
      color: ${voicecakeColors.primary} !important;
    }

    a:hover {
      color: ${voicecakeColors.primaryHover} !important;
    }

    /* Text Colors */
    .text-muted-foreground,
    .text-muted {
      color: ${voicecakeColors.textMuted} !important;
    }

    /* Background Colors */
    .bg-background {
      background-color: ${voicecakeColors.background} !important;
    }

    .bg-card {
      background-color: ${voicecakeColors.card} !important;
    }

    /* Border Colors */
    .border {
      border-color: ${voicecakeColors.border} !important;
    }

    /* Workflow Node Colors - VoiceCake Palette */
    .workflow-node {
      border-radius: 0.75rem !important;
    }

    /* Success/Error States */
    .text-green-600,
    .text-green-500 {
      color: ${voicecakeColors.secondary} !important;
    }

    .text-red-600,
    .text-red-500 {
      color: #ff381c !important;
    }

    /* Scrollbar Styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${voicecakeColors.card};
    }

    ::-webkit-scrollbar-thumb {
      background: ${voicecakeColors.textMuted};
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${voicecakeColors.text};
    }
  `;

  // Inject styles
  document.head.appendChild(style);

  // Update page title
  document.title = document.title.replace('Sim', 'VoiceCake AI');

  // Update branding elements
  const logoElements = document.querySelectorAll('[data-brand="logo"], .brand-logo, .logo, h1, .text-xl, .text-2xl');
  logoElements.forEach(element => {
    if (element.textContent && element.textContent.includes('Sim')) {
      element.textContent = element.textContent.replace('Sim', 'VoiceCake AI');
      element.style.color = voicecakeColors.primary;
    }
  });

  // Add VoiceCake class to body
  document.body.classList.add('voicecake-theme');

  console.log('✅ VoiceCake theme applied successfully!');
  console.log('🎨 Colors: Blue (#2a85ff), Green (#00a656), Purple (#7f5fff)');
  console.log('📝 Font: Inter (VoiceCake typography)');
  console.log('🔲 Cards: VoiceCake rounded corners and shadows');
})();
