# VoiceCake Widget

An embeddable voice AI chat widget that can be easily integrated into any website with just a single script tag.

## Features

- 🎤 **Real-time Voice Conversation**: Speech-to-Speech and Text-to-Speech AI agents
- 📝 **Live Transcription**: Real-time conversation transcription
- 🎨 **Customizable**: Multiple themes and positioning options
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔧 **Easy Integration**: Single script tag installation
- 🚀 **No Dependencies**: Self-contained with no external libraries required
- 🔒 **Secure**: HTTPS required for microphone access
- ⚡ **Fast Loading**: Optimized for quick initialization

## Quick Start

Add the VoiceCake widget to your website with just one script tag:

```html
<script src="https://your-domain.com/voicecake-widget.js" 
        data-agent-id="96" 
        data-position="bottom-right" 
        data-theme="light"></script>
```

## Configuration Options

### Required Attributes

- `data-agent-id`: The unique identifier for your AI agent (e.g., "96")

### Optional Attributes

- `data-position`: Widget position on the page
  - `bottom-right` (default)
  - `bottom-left`
  - `top-right`
  - `top-left`

- `data-theme`: Visual theme
  - `light` (default)
  - `dark`

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website with Voice AI</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This page has a VoiceCake AI assistant!</p>
    
    <!-- VoiceCake Widget -->
    <script src="https://your-domain.com/voicecake-widget.js" 
            data-agent-id="96" 
            data-position="bottom-right" 
            data-theme="light"></script>
</body>
</html>
```

## Advanced Usage

### Accessing the Widget Instance

You can access the widget instance for advanced control:

```javascript
// Get widget status
const status = window.voicecakeWidget.getStatus();
console.log('Widget status:', status);

// Destroy the widget
window.voicecakeWidget.destroy();
```

### Creating Multiple Widgets

You can have multiple widgets on the same page:

```javascript
// Create additional widget instances
const widget2 = new window.VoiceCakeWidget({
    agentId: '97',
    position: 'bottom-left',
    theme: 'dark'
});
```

### Using the Loader Script

For better performance, you can use the loader script which loads the widget asynchronously:

```html
<script src="https://your-domain.com/voicecake-widget-loader.js" 
        data-agent-id="96" 
        data-position="bottom-right" 
        data-theme="light"></script>
```

## File Structure

```
public/
├── voicecake-widget.js          # Main widget script
├── voicecake-widget-loader.js   # Async loader script
├── voicecake-widget.html        # Standalone HTML demo
├── demo-widget.html             # Interactive demo page
└── README-widget.md             # This documentation
```

## Requirements

- Modern web browser with WebRTC support
- HTTPS connection (required for microphone access)
- Valid VoiceCake agent ID
- Microphone permissions from user

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## API Reference

### Widget Constructor

```javascript
new VoiceCakeWidget(options)
```

**Options:**
- `agentId` (string, required): The agent ID
- `position` (string, optional): Widget position
- `theme` (string, optional): Widget theme

### Widget Methods

#### `getStatus()`
Returns the current widget status.

**Returns:** Object with properties:
- `isConnected`: Boolean - Whether connected to the agent
- `isOpen`: Boolean - Whether the widget panel is open
- `isLoading`: Boolean - Whether the widget is loading
- `agent`: Object - Agent information

#### `destroy()`
Removes the widget from the page and cleans up resources.

## Troubleshooting

### Widget not appearing?
- Check that the script URL is correct
- Verify the agent ID is valid
- Check browser console for errors

### Microphone not working?
- Ensure HTTPS is enabled
- Check browser permissions
- Try refreshing the page

### Connection issues?
- Check your internet connection
- Verify the agent is active
- Check browser console for WebSocket errors

## Development

### Local Testing

1. Serve the files from a local HTTP server (required for microphone access)
2. Update the `CONFIG` object in `voicecake-widget.js` with your local API URLs
3. Test with a valid agent ID

### Building for Production

1. Update the `CONFIG` object with production API URLs
2. Minify the JavaScript files
3. Upload to your CDN or web server
4. Update the script URLs in your integration examples

## Security Considerations

- The widget requires HTTPS for microphone access
- All API calls are made to the configured VoiceCake endpoints
- No sensitive data is stored locally
- Microphone permissions are requested only when needed

## Performance

- Widget loads asynchronously to avoid blocking page load
- CSS is injected dynamically to avoid conflicts
- Audio processing is optimized for real-time performance
- Memory usage is minimized with proper cleanup

## Support

For technical support or questions about the VoiceCake widget, please contact the VoiceCake team or refer to the main VoiceCake documentation.

## License

This widget is part of the VoiceCake platform. Please refer to your VoiceCake license agreement for usage terms.
