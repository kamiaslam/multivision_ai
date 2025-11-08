# VoiceCake Widget Environment Variables

The VoiceCake widget now supports environment variables for configuration, making it easy to deploy across different environments.

## Environment Variables

The widget uses the following environment variables:

- `NEXT_PUBLIC_API_BASE_URL` - The base URL for the API (default: production URL)
- `NEXT_PUBLIC_WS_BASE_URL` - The base URL for WebSocket connections (default: production WebSocket URL)
- `NEXT_PUBLIC_HUME_WS_ENDPOINT` - The Hume WebSocket endpoint (default: `/api/v1/hume/ws/inference`)
- `NODE_ENV` - The environment (development, production, etc.)

## Building the Widget

### Development Build
```bash
npm run build-widget
```

### Production Build
```bash
npm run build-widget:prod
```

### Custom Environment Variables
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1 \
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000 \
NODE_ENV=development \
npm run build-widget
```

## Usage

### 1. Build the Widget with Environment Variables
```bash
# For production
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api/v1 \
NEXT_PUBLIC_WS_BASE_URL=wss://your-api.com \
npm run build-widget:prod
```

### 2. Embed the Widget
```html
<script 
    src="/voicecake-widget.js"
    data-voicecake-agent-id="YOUR_AGENT_ID"
    data-voicecake-debug="true">
</script>
```

### 3. Override Environment Variables (Optional)
You can still override the environment variables by passing them as script attributes:

```html
<script 
    src="/voicecake-widget.js"
    data-voicecake-agent-id="YOUR_AGENT_ID"
    data-voicecake-api-url="https://custom-api.com/api/v1"
    data-voicecake-ws-url="wss://custom-api.com"
    data-voicecake-debug="true">
</script>
```

## Configuration Priority

The widget uses the following priority order for configuration:

1. **Script attributes** (highest priority)
   - `data-voicecake-api-url`
   - `data-voicecake-ws-url`

2. **Environment variables** (medium priority)
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_WS_BASE_URL`

3. **Default values** (lowest priority)
   - Production URLs

## Examples

### Local Development
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1 \
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000 \
NODE_ENV=development \
npm run build-widget
```

### Staging Environment
```bash
NEXT_PUBLIC_API_BASE_URL=https://staging-api.voicecake.com/api/v1 \
NEXT_PUBLIC_WS_BASE_URL=wss://staging-api.voicecake.com \
NODE_ENV=staging \
npm run build-widget
```

### Production Environment
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.voicecake.com/api/v1 \
NEXT_PUBLIC_WS_BASE_URL=wss://api.voicecake.com \
NODE_ENV=production \
npm run build-widget:prod
```

## Debugging

To see which environment variables are being used, enable debug mode:

```html
<script 
    src="/voicecake-widget.js"
    data-voicecake-agent-id="YOUR_AGENT_ID"
    data-voicecake-debug="true">
</script>
```

This will log the environment variables and configuration to the browser console.
