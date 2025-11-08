import { ApiEndpoint, IntegrationGuide, TroubleshootingItem, ChangelogEntry } from './types';

export const agentEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    endpoint: "/api/v1/agents",
    description: "Get all agents for the authenticated user.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "api/v1/agents/{agent_id}",
    description: "Get a specific agent by ID.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "DELETE",
    endpoint: "api/v1/agents/{agent_id}",
    description: "Delete a specific agent by ID.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "api/v1/agents/{agent_id}/tools",
    description: "Get tools associated with a specific agent.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "api/v1/agents/{agent_id}/stats",
    description: "Get statistics for a specific agent.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "api/v1/agents/phone-number/check/{phone_number}",
    description: "Check if a phone number is available for assignment to an agent.",
    status: "stable",
    lastUpdated: "2025-09-12"
  }
];

export const voiceEndpoints: ApiEndpoint[] = [
  {
    method: "POST",
    endpoint: "/api/v1/voice/call",
    description: "Make an outbound call using Twilio.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/voice/call/{call_sid}",
    description: "Get the status of a call.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "DELETE",
    endpoint: "/api/v1/voice/call/{call_sid}",
    description: "Hang up a call.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/voice/phone-numbers",
    description: "Get list of phone numbers in the Twilio account.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "POST",
    endpoint: "/api/v1/voice/phone-numbers/{phone_number_sid}/webhook",
    description: "Update the webhook URL for a phone number.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/voice/stats",
    description: "Get statistics for all active calls.",
    status: "stable",
    lastUpdated: "2025-09-12"
  }
];

export const toolsEndpoints: ApiEndpoint[] = [
  {
    method: "POST",
    endpoint: "/api/v1/tools/",
    description: "Create a new user-defined tool.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/tools/",
    description: "Get all tools for the authenticated user.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/tools/{tool_id}",
    description: "Get a specific tool by ID.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "PUT",
    endpoint: "/api/v1/tools/{tool_id}",
    description: "Update an existing tool.",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "DELETE",
    endpoint: "/api/v1/tools/{tool_id}",
    description: "Delete Tool",
    status: "stable",
    lastUpdated: "2025-09-12"
  }
];

export const sessionsEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    endpoint: "/api/v1/sessions/stats",
    description: "Get User Session Stats",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/sessions/agent/{agent_id}/stats",
    description: "Get Agent Session Stats",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/sessions/active",
    description: "Get Active Sessions",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/sessions/call-logs",
    description: "Get User Call Logs",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "POST",
    endpoint: "/api/v1/sessions/{session_id}/end",
    description: "End Session",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/sessions/{session_id}",
    description: "Get Session Details",
    status: "stable",
    lastUpdated: "2025-09-12"
  }
];

export const livekitEndpoints: ApiEndpoint[] = [
  {
    method: "POST",
    endpoint: "/api/v1/livekit/session/start",
    description: "Start Session",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "POST",
    endpoint: "/api/v1/livekit/session/start/public",
    description: "Start Public Session",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/livekit/session/{session_id}/status",
    description: "Get Session Status",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "DELETE",
    endpoint: "/api/v1/livekit/session/{session_id}",
    description: "Stop Session",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "POST",
    endpoint: "/api/v1/livekit/session/end",
    description: "End Session",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/livekit/sessions",
    description: "List Sessions",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "POST",
    endpoint: "/api/v1/livekit/session/{session_id}/message",
    description: "Send Message",
    status: "stable",
    lastUpdated: "2025-09-12"
  },
  {
    method: "GET",
    endpoint: "/api/v1/livekit/debug/plugins",
    description: "Debug Plugins",
    status: "stable",
    lastUpdated: "2025-09-12"
  }
];

export const integrationGuides: IntegrationGuide[] = [
  {
    title: "React Integration",
    description: "How to integrate our dashboard components into React applications",
    difficulty: "beginner",
    estimatedTime: "15 min",
    category: "integration"
  },
  {
    title: "Webhook Setup",
    description: "Configure webhooks for real-time event notifications",
    difficulty: "intermediate",
    estimatedTime: "30 min",
    category: "integration"
  },
  {
    title: "Authentication Flow",
    description: "Implement OAuth 2.0 and JWT token authentication",
    difficulty: "advanced",
    estimatedTime: "45 min",
    category: "integration"
  },
  {
    title: "Custom Agent Development",
    description: "Build and deploy custom AI agents using our SDK",
    difficulty: "advanced",
    estimatedTime: "2 hours",
    category: "integration"
  }
];

export const troubleshootingItems: TroubleshootingItem[] = [
  {
    issue: "API Rate Limiting",
    solution: "Implement exponential backoff and respect rate limit headers",
    category: "troubleshooting",
    severity: "medium"
  },
  {
    issue: "Webhook Delivery Failures",
    solution: "Check endpoint availability and implement retry logic",
    category: "troubleshooting",
    severity: "high"
  },
  {
    issue: "Agent Response Timeouts",
    solution: "Increase timeout values and optimize agent configurations",
    category: "troubleshooting",
    severity: "medium"
  },
  {
    issue: "Dashboard Loading Issues",
    solution: "Clear browser cache and check network connectivity",
    category: "troubleshooting",
    severity: "low"
  }
];

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "v2.1.0",
    date: "2024-01-22",
    type: "feature",
    description: "Added new workflow automation capabilities",
    category: "changelog"
  },
  {
    version: "v2.0.5",
    date: "2024-01-20",
    type: "fix",
    description: "Fixed agent response timeout issues",
    category: "changelog"
  },
  {
    version: "v2.0.4",
    date: "2024-01-18",
    type: "improvement",
    description: "Enhanced dashboard performance and loading times",
    category: "changelog"
  },
  {
    version: "v2.0.3",
    date: "2024-01-15",
    type: "security",
    description: "Updated authentication security protocols",
    category: "changelog"
  }
];
