# VoiceCake Widget

A standalone voice AI assistant widget that can be embedded on any website. This widget provides real-time voice conversation capabilities powered by VoiceCake's AI agents.

## Features

- 🎤 **Real-time Voice Conversation**: Talk naturally with AI assistants
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, animated interface with smooth transitions
- ⏱️ **Live Timer**: Track conversation duration
- 📝 **Live Transcription**: See real-time conversation history
- 🔇 **Mute Controls**: Toggle microphone on/off
- 🎵 **Audio Visualizer**: Visual feedback during conversations
- ⚡ **Lightweight**: Fast loading and minimal resource usage
- 🔧 **Easy Integration**: Simple script tag installation

## Quick Start

### 1. Upload Files

Upload these files to your website's public directory:

- `voicecake-widget.html` - Widget HTML structure
- `voicecake-widget.css` - Widget styling
- `voicecake-widget.js` - Widget functionality
- `voicecake-widget-loader.js` - Widget loader script

### 2. Add Script Tag

#### For Public Access (SPEECH Agents)
```html
<script 
    src="https://your-domain.com/voicecake-widget-loader.js"
    data-agent-id="YOUR_AGENT_ID"
    data-api-url="https://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net/api/v1"
    data-ws-url="wss://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net"
    data-debug="false"
    data-position="bottom-left"
    data-theme="default">
</script>
```

#### For Authenticated Access (TEXT Agents - Recommended)
```html
<script 
    src="https://your-domain.com/voicecake-widget-loader.js"
    data-agent-id="YOUR_AGENT_ID"
    data-auth-token="YOUR_AUTH_TOKEN"
    data-api-url="https://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net/api/v1"
    data-ws-url="wss://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net"
    data-debug="false"
    data-position="bottom-left"
    data-theme="default">
</script>
```

### 3. Replace Agent ID

Replace `YOUR_AGENT_ID` with your actual VoiceCake agent ID.

## Configuration Options

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `data-agent-id` | ✅ Yes | - | Your VoiceCake agent ID |
| `data-auth-token` | ❌ No | - | Authentication token (required for TEXT agents) |
| `data-api-url` | ❌ No | VoiceCake API URL | API base URL |
| `data-ws-url` | ❌ No | VoiceCake WS URL | WebSocket base URL |
| `data-debug` | ❌ No | `false` | Enable debug logging |
| `data-position` | ❌ No | `bottom-left` | Widget position |
| `data-theme` | ❌ No | `default` | Widget theme |

## Widget States

The widget has several states that users will experience:

1. **Initial State**: Welcome screen with "Start Chat" button
2. **Connecting State**: Loading spinner while establishing connection
3. **Active State**: Live conversation with timer, controls, and transcription
4. **Error State**: Error message with retry option

## Browser Requirements

- Modern browsers with WebRTC support
- Microphone access permissions
- WebSocket support
- Audio Context API support

## API Integration

The widget connects to VoiceCake's API endpoints:

- **WebSocket**: Real-time voice streaming
- **REST API**: Agent information and session management
- **Audio Processing**: High-quality audio encoding/decoding

## Customization

### Styling

You can customize the widget appearance by modifying the CSS variables in `voicecake-widget.css`:

```css
:root {
    --voicecake-primary: #667eea;
    --voicecake-secondary: #764ba2;
    --voicecake-text: #333;
    --voicecake-background: #fff;
}
```

### Positioning

Change the widget position by modifying the CSS:

```css
.voicecake-widget-button {
    bottom: 20px;
    left: 20px; /* Change to 'right: 20px' for bottom-right */
}
```

## Troubleshooting

### Common Issues

1. **Widget not appearing**: Check that all files are uploaded and accessible
2. **Connection failed**: Verify agent ID and API URLs are correct
3. **No microphone access**: Ensure browser permissions are granted
4. **Audio not playing**: Check browser audio settings and permissions

### Debug Mode

Enable debug mode to see detailed logs:

```html
<script data-debug="true" ...>
```

### Browser Console

Check the browser console for error messages and debug information.

## Security Considerations

- The widget only connects to VoiceCake's official API endpoints
- No user data is stored locally (except conversation history during session)
- Microphone access is only used during active conversations
- All communications are encrypted via WSS (WebSocket Secure)

## Support

For technical support or questions:

1. Check the browser console for error messages
2. Verify your agent ID and API configuration
3. Test with debug mode enabled
4. Contact VoiceCake support for API-related issues

## Example Implementation

See `widget-example.html` for a complete example of how to implement the widget on a website.

## Version History

- **v1.0.0**: Initial release with core voice conversation features
