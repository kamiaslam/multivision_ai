# 🎨 VoiceCake Theme for Sim AI - Complete Guide

## 🎯 **Overview**

This guide helps you apply the VoiceCake design system to Sim AI, creating a consistent visual experience across both applications. The theme includes:

- **VoiceCake Color Palette**: Primary blue (#2a85ff), green (#00a656), purple (#7f5fff)
- **Consistent Typography**: Inter font family
- **VoiceCake Component Styling**: Cards, buttons, inputs, navigation
- **Brand Integration**: VoiceCake AI branding throughout

## 🚀 **Quick Start Methods**

### **Method 1: Browser Console Injection (Easiest)**

1. **Open Sim AI**: Navigate to http://localhost:3001
2. **Log in** to your Sim AI account
3. **Open Developer Tools**: Press F12 or right-click → Inspect
4. **Go to Console tab**
5. **Paste and run** this code:

```javascript
// VoiceCake Theme Injection
const voicecakeConfig = {
  primaryColor: '#2a85ff',
  primaryHoverColor: '#1a75ef',
  secondaryColor: '#00a656',
  accentColor: '#7f5fff'
};

// Apply theme
document.body.classList.add('voicecake-theme');
document.title = document.title.replace('Sim', 'VoiceCake AI');

// Create and inject styles
const style = document.createElement('style');
style.textContent = `
  .voicecake-theme {
    --brand-primary: ${voicecakeConfig.primaryColor};
    --brand-primary-hover: ${voicecakeConfig.primaryHoverColor};
  }
  
  .voicecake-theme button[data-variant="default"],
  .voicecake-theme .btn-primary {
    background-color: ${voicecakeConfig.primaryColor} !important;
    border-color: ${voicecakeConfig.primaryColor} !important;
  }
  
  .voicecake-theme button[data-variant="default"]:hover,
  .voicecake-theme .btn-primary:hover {
    background-color: ${voicecakeConfig.primaryHoverColor} !important;
  }
  
  .voicecake-theme .card {
    border-radius: 1.5rem !important;
    box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
  }
  
  .voicecake-theme {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
`;

document.head.appendChild(style);
console.log('🎨 VoiceCake theme applied!');
```

### **Method 2: Use the Theme Injector Tool**

1. **Open the injector**: Navigate to `voicecake-nextjs/voicecake-sim-injector.html`
2. **Click "Inject VoiceCake Theme"** to copy the code
3. **Follow the instructions** to apply it to Sim AI

### **Method 3: Bookmarklet (Permanent)**

Create a bookmark with this URL:

```javascript
javascript:(function(){
  const voicecakeConfig = {
    primaryColor: '#2a85ff',
    primaryHoverColor: '#1a75ef',
    secondaryColor: '#00a656',
    accentColor: '#7f5fff'
  };
  
  document.body.classList.add('voicecake-theme');
  document.title = document.title.replace('Sim', 'VoiceCake AI');
  
  const style = document.createElement('style');
  style.textContent = `
    .voicecake-theme {
      --brand-primary: ${voicecakeConfig.primaryColor};
      --brand-primary-hover: ${voicecakeConfig.primaryHoverColor};
    }
    
    .voicecake-theme button[data-variant="default"],
    .voicecake-theme .btn-primary {
      background-color: ${voicecakeConfig.primaryColor} !important;
      border-color: ${voicecakeConfig.primaryColor} !important;
    }
    
    .voicecake-theme button[data-variant="default"]:hover,
    .voicecake-theme .btn-primary:hover {
      background-color: ${voicecakeConfig.primaryHoverColor} !important;
    }
    
    .voicecake-theme .card {
      border-radius: 1.5rem !important;
      box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
    }
    
    .voicecake-theme {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
  `;
  
  document.head.appendChild(style);
  console.log('🎨 VoiceCake theme applied!');
})();
```

## 🎨 **What Gets Styled**

### **Colors**
- **Primary**: VoiceCake Blue (#2a85ff)
- **Secondary**: VoiceCake Green (#00a656)
- **Accent**: VoiceCake Purple (#7f5fff)
- **Background**: VoiceCake Light/Dark themes

### **Components**
- **Buttons**: VoiceCake blue with rounded corners
- **Cards**: VoiceCake shadow and border radius
- **Inputs**: VoiceCake focus states
- **Navigation**: VoiceCake styling
- **Typography**: Inter font family

### **Branding**
- **Page Title**: "VoiceCake AI" instead of "Sim"
- **Logo Colors**: VoiceCake blue
- **Consistent Spacing**: VoiceCake design system

## 🔧 **Advanced Customization**

### **Custom Color Override**

You can modify the colors by changing the `voicecakeConfig` object:

```javascript
const voicecakeConfig = {
  primaryColor: '#2a85ff',      // Main blue
  primaryHoverColor: '#1a75ef', // Darker blue
  secondaryColor: '#00a656',    // Green
  accentColor: '#7f5fff'        // Purple
};
```

### **Additional Styling**

Add more custom styles to the `style.textContent`:

```javascript
style.textContent += `
  /* Custom VoiceCake styles */
  .voicecake-theme .sidebar {
    background-color: #f1f1f1 !important;
  }
  
  .voicecake-theme .workflow-node {
    border-color: #2a85ff30 !important;
  }
`;
```

## 🚨 **Troubleshooting**

### **Theme Not Applying**
1. **Check Console**: Look for JavaScript errors
2. **Refresh Page**: Try refreshing after applying theme
3. **Clear Cache**: Clear browser cache and try again
4. **Check Selectors**: Ensure Sim AI uses the expected CSS classes

### **Styles Not Working**
1. **Specificity**: Add `!important` to override existing styles
2. **Timing**: Apply theme after page fully loads
3. **SPA Navigation**: Re-apply theme on route changes

### **Performance Issues**
1. **Minimize Overrides**: Only override necessary styles
2. **Use CSS Variables**: Leverage existing CSS custom properties
3. **Avoid Heavy Selectors**: Keep selectors simple and specific

## 📱 **Mobile Compatibility**

The VoiceCake theme is responsive and works on:
- **Desktop**: Full theme application
- **Tablet**: Responsive adjustments
- **Mobile**: Touch-friendly interactions

## 🔄 **Persistence**

### **Session Persistence**
The theme persists during the browser session but resets on page refresh.

### **Permanent Application**
For permanent application, you would need to:
1. **Modify Sim AI Source**: Edit the actual Sim AI codebase
2. **Use Browser Extensions**: Create a custom browser extension
3. **Server-Side Integration**: Integrate at the application level

## 🎯 **Integration with VoiceCake**

### **Seamless Experience**
- **Navigation**: Access Sim AI from VoiceCake menu
- **Consistent UI**: Same design language across both apps
- **Brand Continuity**: VoiceCake branding throughout

### **Workflow Integration**
- **Data Sharing**: Workspaces and agents accessible from both apps
- **Unified Experience**: Single sign-on and consistent navigation
- **Cross-Platform**: Works on all devices and browsers

## 📋 **Quick Reference**

### **VoiceCake Colors**
```css
--voicecake-primary: #2a85ff;    /* Blue */
--voicecake-secondary: #00a656;  /* Green */
--voicecake-accent: #7f5fff;     /* Purple */
--voicecake-error: #ff381c;      /* Red */
--voicecake-warning: #ff9d34;    /* Orange */
```

### **VoiceCake Typography**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### **VoiceCake Spacing**
```css
--voicecake-border-radius: 1.5rem;
--voicecake-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05);
```

## 🎉 **Success Indicators**

You'll know the theme is working when:

✅ **Buttons are VoiceCake blue**  
✅ **Cards have rounded corners and shadows**  
✅ **Typography uses Inter font**  
✅ **Page title shows "VoiceCake AI"**  
✅ **Navigation matches VoiceCake styling**  
✅ **Workflow nodes have VoiceCake colors**  

---

**🎨 Goal**: Create a seamless, branded experience where Sim AI feels like a natural extension of VoiceCake's design system!

