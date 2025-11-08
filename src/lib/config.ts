// Environment Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: (() => {
      const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const defaultUrl =
        "https://voicecakedevelop-hrfygverfwe8g4bj.canadacentral-01.azurewebsites.net/api/v1";
      // const defaultUrl =
      //   "https://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net/api/v1";
      const finalUrl = envUrl || defaultUrl;

      // Force HTTPS if the URL contains the Azure domain
      if (
        finalUrl.includes(
          "voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net"
        ) &&
        finalUrl.startsWith("http://")
      ) {
        return finalUrl.replace("http://", "https://");
      }

      return finalUrl;
    })(),
    simBaseURL: (() => {
      const envUrl = process.env.NEXT_PUBLIC_SIM_API_BASE_URL;
      const defaultUrl = "http://localhost:3000";
      const finalUrl = (envUrl || defaultUrl) + "/api";
      return finalUrl;
    })(),
  },
  simUi: {
    baseURL: (() => {
      const envUrl = process.env.NEXT_PUBLIC_SIM_API_BASE_URL;
      const defaultUrl = "http://localhost:3000";
      const finalUrl = envUrl || defaultUrl;
      return finalUrl;
    })(),
  },
  // WebSocket Configuration
  websocket: {
    baseURL: (() => {
      const envUrl = process.env.NEXT_PUBLIC_WS_BASE_URL;
      const defaultUrl =
        "wss://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net";
      const finalUrl = envUrl || defaultUrl;

      // Force WSS if the URL contains the Azure domain
      if (
        finalUrl.includes(
          "voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net"
        ) &&
        finalUrl.startsWith("ws://")
      ) {
        return finalUrl.replace("ws://", "wss://");
      }

      return finalUrl;
    })(),
    humeEndpoint:
      process.env.NEXT_PUBLIC_HUME_WS_ENDPOINT || "/api/v1/hume/ws/inference",
    // Updated to use LiveKit endpoints for TEXT-TO-SPEECH
    livekitTextEndpoint: "/api/v1/livekit/ws/voice",
    // Keep legacy endpoint for backwards compatibility
    deepgramTextEndpoint: "/api/v1/deepgram/ws/voice",
  },

  // Debug logging
  debug: () => {
    console.log("Environment Variables:");
    console.log(
      "NEXT_PUBLIC_API_BASE_URL:",
      process.env.NEXT_PUBLIC_API_BASE_URL
    );
    console.log(
      "NEXT_PUBLIC_WS_BASE_URL:",
      process.env.NEXT_PUBLIC_WS_BASE_URL
    );
    console.log(
      "NEXT_PUBLIC_HUME_WS_ENDPOINT:",
      process.env.NEXT_PUBLIC_HUME_WS_ENDPOINT
    );
    console.log("Final API Base URL:", config.api.baseURL);
    console.log("Final WS Base URL:", config.websocket.baseURL);
    console.log("Hume Endpoint:", config.websocket.humeEndpoint);
    console.log("LiveKit Text Endpoint:", config.websocket.livekitTextEndpoint);
    console.log(
      "Deepgram Text Endpoint (Legacy):",
      config.websocket.deepgramTextEndpoint
    );
  },

  // Environment
  env: process.env.NODE_ENV || "development",

  // Helper functions
  getHumeWebSocketUrl: (agentId: string, agentType?: string) => {
    // TEXT agents now use LiveKit sessions (HTTP POST), not WebSocket
    if (agentType === "TEXT") {
      console.warn(
        "⚠️ TEXT agents should use LiveKit session API, not WebSocket"
      );
      return null; // TEXT agents should not use WebSocket
    }

    const endpoint = config.websocket.humeEndpoint;
    let baseUrl = config.websocket.baseURL;

    // Remove trailing slash from base URL
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    // Check if base URL already contains /api/v1 and endpoint also starts with /api/v1
    // If so, remove /api/v1 from the endpoint to avoid duplication
    let cleanEndpoint = endpoint;
    if (baseUrl.includes("/api/v1") && endpoint.startsWith("/api/v1")) {
      cleanEndpoint = endpoint.replace("/api/v1", "");
    } else if (!endpoint.startsWith("/")) {
      cleanEndpoint = `/${endpoint}`;
    }

    return `${baseUrl}${cleanEndpoint}/${agentId}`;
  },

  // Debug helper to show endpoint routing
  getEndpointInfo: (agentType?: string) => {
    const isTextAgent = agentType === "TEXT";
    return {
      agentType: agentType || "SPEECH",
      endpoint: isTextAgent
        ? "LiveKit Session API"
        : config.websocket.humeEndpoint,
      service: isTextAgent
        ? "LiveKit Session (TEXT-TO-SPEECH)"
        : "Hume WebSocket (SPEECH-TO-SPEECH)",
      description: isTextAgent
        ? "Using LiveKit session API for text-based voice generation with HTTP POST"
        : "Using Hume WebSocket for real-time speech-to-speech conversation",
    };
  },

  isDevelopment: () => config.env === "development",
  isProduction: () => config.env === "production",
};

export default config;
