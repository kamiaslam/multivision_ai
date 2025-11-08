"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";

interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
  status: string;
  lastUpdated: string;
}

interface ApiDocumentationProps {
  agentEndpoints: ApiEndpoint[];
  voiceEndpoints: ApiEndpoint[];
  toolsEndpoints: ApiEndpoint[];
  sessionsEndpoints: ApiEndpoint[];
  livekitEndpoints: ApiEndpoint[];
}

const ApiDocumentation = ({ agentEndpoints, voiceEndpoints, toolsEndpoints, sessionsEndpoints, livekitEndpoints }: ApiDocumentationProps) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    agents: false,
    voice: false,
    tools: false,
    sessions: false,
    livekit: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable": return "bg-green-500/10 text-green-400";
      case "beta": return "bg-yellow-500/10 text-yellow-400";
      case "alpha": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  const renderEndpoint = (endpoint: ApiEndpoint, index: number) => (
    <div key={index} className="border border-s-subtle rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <div className="flex items-center gap-3">
          <Badge className={`${endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : endpoint.method === 'POST' ? 'bg-green-500/10 text-green-400' : endpoint.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'} font-mono`}>
            {endpoint.method}
          </Badge>
          <code className="font-mono text-sm bg-[var(--backgrounds-surface2)] px-2 py-1 rounded">
            {endpoint.endpoint}
          </code>
        </div>
        <Badge className={getStatusColor(endpoint.status)}>
          {endpoint.status}
        </Badge>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-2">{endpoint.description}</p>
      <div className="text-xs text-[var(--text-tertiary)]">Last updated: {endpoint.lastUpdated}</div>
    </div>
  );

  return (
    <Card title="API Documentation" className="p-6">
      <div className="space-y-6">
        {/* Agents API Section */}
        <div className="border border-s-subtle rounded-lg">
          <button
            onClick={() => toggleSection('agents')}
            className="w-full flex items-center justify-between p-4 hover:bg-b-surface1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="robot" className="w-5 h-5 text-t-primary" />
              <h3 className="text-lg font-semibold text-t-primary">Agents API</h3>
              <Badge className="bg-blue-500/10 text-blue-400">
                {agentEndpoints.length} endpoints
              </Badge>
            </div>
            <Icon 
              name="chevron-down" 
              className={`w-5 h-5 text-t-secondary transition-transform ${expandedSections.agents ? 'rotate-180' : ''}`} 
            />
          </button>
          {expandedSections.agents && (
            <div className="px-4 pb-4 space-y-4">
              <div className="mb-4 p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                <p className="text-sm text-[var(--text-secondary)]">
                  AI voice agent management. Create, configure, and manage intelligent voice agents with different personalities and capabilities.
                </p>
              </div>
              {agentEndpoints.map(renderEndpoint)}
            </div>
          )}
        </div>

        {/* Voice API Section */}
        <div className="border border-s-subtle rounded-lg">
          <button
            onClick={() => toggleSection('voice')}
            className="w-full flex items-center justify-between p-4 hover:bg-b-surface1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="phone" className="w-5 h-5 text-t-primary" />
              <h3 className="text-lg font-semibold text-t-primary">Voice API</h3>
              <Badge className="bg-green-500/10 text-green-400">
                {voiceEndpoints.length} endpoints
              </Badge>
            </div>
            <Icon 
              name="chevron-down" 
              className={`w-5 h-5 text-t-secondary transition-transform ${expandedSections.voice ? 'rotate-180' : ''}`} 
            />
          </button>
          {expandedSections.voice && (
            <div className="px-4 pb-4 space-y-4">
              <div className="mb-4 p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                <p className="text-sm text-[var(--text-secondary)]">
                  Voice-related services including text-to-speech, voice cloning, and audio processing capabilities.
                </p>
              </div>
              {voiceEndpoints.map(renderEndpoint)}
            </div>
          )}
        </div>

        {/* Tools API Section */}
        <div className="border border-s-subtle rounded-lg">
          <button
            onClick={() => toggleSection('tools')}
            className="w-full flex items-center justify-between p-4 hover:bg-b-surface1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="tools" className="w-5 h-5 text-t-primary" />
              <h3 className="text-lg font-semibold text-t-primary">Tools API</h3>
              <Badge className="bg-purple-500/10 text-purple-400">
                {toolsEndpoints.length} endpoints
              </Badge>
            </div>
            <Icon 
              name="chevron-down" 
              className={`w-5 h-5 text-t-secondary transition-transform ${expandedSections.tools ? 'rotate-180' : ''}`} 
            />
          </button>
          {expandedSections.tools && (
            <div className="px-4 pb-4 space-y-4">
              <div className="mb-4 p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                <p className="text-sm text-[var(--text-secondary)]">
                  Custom tool management and execution. Create and manage custom tools that agents can use during conversations.
                </p>
              </div>
              {toolsEndpoints.map(renderEndpoint)}
            </div>
          )}
        </div>

        {/* Sessions API Section */}
        <div className="border border-s-subtle rounded-lg">
          <button
            onClick={() => toggleSection('sessions')}
            className="w-full flex items-center justify-between p-4 hover:bg-b-surface1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="chat" className="w-5 h-5 text-t-primary" />
              <h3 className="text-lg font-semibold text-t-primary">Sessions API</h3>
              <Badge className="bg-orange-500/10 text-orange-400">
                {sessionsEndpoints.length} endpoints
              </Badge>
            </div>
            <Icon 
              name="chevron-down" 
              className={`w-5 h-5 text-t-secondary transition-transform ${expandedSections.sessions ? 'rotate-180' : ''}`} 
            />
          </button>
          {expandedSections.sessions && (
            <div className="px-4 pb-4 space-y-4">
              <div className="mb-4 p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                <p className="text-sm text-[var(--text-secondary)]">
                  Agent session management. Start, manage, and monitor active conversation sessions with AI agents.
                </p>
              </div>
              {sessionsEndpoints.map(renderEndpoint)}
            </div>
          )}
        </div>

        {/* LiveKit API Section */}
        <div className="border border-s-subtle rounded-lg">
          <button
            onClick={() => toggleSection('livekit')}
            className="w-full flex items-center justify-between p-4 hover:bg-b-surface1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="video" className="w-5 h-5 text-t-primary" />
              <h3 className="text-lg font-semibold text-t-primary">LiveKit API</h3>
              <Badge className="bg-cyan-500/10 text-cyan-400">
                {livekitEndpoints.length} endpoints
              </Badge>
            </div>
            <Icon 
              name="chevron-down" 
              className={`w-5 h-5 text-t-secondary transition-transform ${expandedSections.livekit ? 'rotate-180' : ''}`} 
            />
          </button>
          {expandedSections.livekit && (
            <div className="px-4 pb-4 space-y-4">
              <div className="mb-4 p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                <p className="text-sm text-[var(--text-secondary)]">
                  Real-time communication services for voice calls, video conferencing, and live interactions.
                </p>
              </div>
              {livekitEndpoints.map(renderEndpoint)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApiDocumentation;
