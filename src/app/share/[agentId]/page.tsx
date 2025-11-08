"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeButton from "@/components/ThemeButton";
import useHumeInference, { INFERENCE_STATES } from "@/hooks/useHumeInference";
import { toast } from "sonner";
import { Agent } from "@/types/agent";
import { publicAgentAPI } from "@/services/publicApi";
import Loader from "@/components/Loader";

const Share = () => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.agentId as string;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get agent type display info
  const getAgentTypeInfo = () => {
    if (!agent) return { label: 'Unknown', icon: 'microphone', variant: 'secondary' as const };
    const agentType = agent.agent_type || agent.type || 'SPEECH';
    if (agentType === 'TEXT') {
      return {
        label: 'Text-To-Speech',
        icon: 'message-square',
        variant: 'secondary' as const
      };
    } else {
      return {
        label: 'Speech-To-Speech',
        icon: 'microphone',
        variant: 'default' as const
      };
    }
  };

  const {
    inferenceState,
    isLoading,
    isMicOn,
    isConnected,
    isUserSpeaking,
    startInference,
    stopInference,
    toggleMic,
    transcription,
    isTranscribing,
  } = useHumeInference({
    agentId: agentId,
    agentData: agent // Pass the agent data we already fetched
  });

  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      if (!agentId) {
        setError("Agent ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching agent with ID:", agentId);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const agentDataPromise = publicAgentAPI.getAgent(agentId);
        const agentData = await Promise.race([agentDataPromise, timeoutPromise]);
        
        console.log("Agent data received:", agentData);
        setAgent(agentData);
      } catch (err: any) {
        console.error("Error fetching agent:", err);
        console.error("Error details:", err.response?.data || err.message);
        
        let errorMessage = "Failed to fetch agent details";
        if (err.message === 'Request timeout') {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.response?.status === 404) {
          errorMessage = "Agent not found or not publicly accessible.";
        } else if (err.response?.status === 401) {
          errorMessage = "Agent requires authentication.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        toast.error("Failed to load agent");
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  const handleStartInference = () => {
    if (!agentId) {
      toast.error("Agent ID is required");
      return;
    }
    startInference(agentId);
  };

  const handleStopInference = () => {
    stopInference();
  };

  const getStateColor = (state: keyof typeof INFERENCE_STATES) => {
    switch (state) {
      case "IDLE":
        return "bg-gray-500";
      case "CONNECTING":
        return "bg-blue-500";
      case "ACTIVE":
        return "bg-primary-02";
      case "ERROR":
        return "bg-[#FF6A55]";
      default:
        return "bg-gray-500";
    }
  };

  const getStateIcon = (state: keyof typeof INFERENCE_STATES) => {
    switch (state) {
      case "IDLE":
        return "square";
      case "CONNECTING":
        return "loader";
      case "ACTIVE":
        return "radio_wave";
      case "ERROR":
        return "volume_x";
      default:
        return "square";
    }
  };

  const isActive = inferenceState === "ACTIVE";
  const isConnecting = inferenceState === "CONNECTING";

  const cleanTranscriptionText = (text: string): string => {
    return text
      .replace(/\s*\[partial due to error\]\s*/gi, '')
      .replace(/\s*\[interrupted\]\s*/gi, '')
      .replace(/\s*\[AI Response\]\s*/gi, '')
      .trim();
  };

  const hasMeaningfulTranscription = (): boolean => {
    return transcription.some(entry => cleanTranscriptionText(entry.text).length > 0 && entry.isFinal === true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-b-surface1">
        {/* Custom Top Navigation */}
        <div className="sticky top-0 left-0 right-0 z-50 bg-b-surface1">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-semibold text-t-primary">Voice AI Chat</h1>
                <p className="text-sm text-t-secondary">Public Agent Access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeButton className="flex-row w-22" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-6 pb-6">
          <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex items-center space-x-2">
                <Loader text="Loading agent..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-b-surface1">
        {/* Custom Top Navigation */}
        <div className="sticky top-0 left-0 right-0 z-50 bg-b-surface1">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-semibold text-t-primary">Voice AI Chat</h1>
                <p className="text-sm text-t-secondary">Public Agent Access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeButton className="flex-row w-22" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-6 pb-6">
          <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="text-center space-y-4">
              <Card className="p-6 max-w-md mx-auto">
                <div className="text-center">
                  <Icon name="alert-circle" className="h-12 w-12 text-[#FF6A55] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-t-primary mb-2">Error</h3>
                  <p className="text-t-secondary">
                    {error || "Agent not found"}
                  </p>
                </div>
              </Card>
              <div className="flex gap-2 justify-center">
                <Button 
                  isStroke
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <Icon name="loader" className="w-4 h-4" />
                  Retry
                </Button>
                <Button 
                  isStroke
                  onClick={() => router.push('/')}
                  className="gap-2"
                >
                  <Icon name="arrow-left" className="w-4 h-4" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-b-surface1">
      {/* Custom Top Navigation */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-b-surface1">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-semibold text-t-primary">Voice AI Chat</h1>
              <p className="text-sm text-t-secondary">Public Agent Access</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeButton className="flex-row w-22"/>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-10 px-6 pb-6">
        <div className="space-y-3">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 mb-0" title="Connection Status">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Status</p>
                <p className="text-2xl font-bold text-t-primary">
                  {inferenceState}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full ${getStateColor(inferenceState)} flex items-center justify-center`}>
                <Icon name={getStateIcon(inferenceState)} className="w-4 h-4 text-black" />
              </div>
            </div>
          </Card>
          <Card className="p-6 mb-0" title="Microphone">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Microphone</p>
                <p className="text-2xl font-bold text-t-primary">
                  {isMicOn ? 'On' : 'Off'}
                </p>
              </div>
              <Icon 
                name={isMicOn ? "microphone" : "microphone_off"} 
                className={`w-8 h-8 ${isMicOn ? 'fill-primary-02' : 'fill-[#FF6A55]'}`} 
              />
            </div>
          </Card>
          <Card className="p-6 mb-0" title="User Activity">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">User</p>
                <p className="text-2xl font-bold text-t-primary">
                  {isUserSpeaking ? 'Speaking' : 'Silent'}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full ${isUserSpeaking ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center`}>
                <Icon name="user" className="w-4 h-4 text-black" />
              </div>
            </div>
          </Card>
          <Card className="p-6 mb-0" title="Agent Info">
            <div className="flex items-center justify-between min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-t-secondary">Agent</p>
                <p className="text-2xl font-bold text-t-primary truncate" title={agent?.name || 'Loading...'}>
                  {agent?.name || 'Loading...'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-02 flex items-center justify-center">
                <Icon name="robot" className="w-4 h-4 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Agent Details and Controls */}
        {agent && (
          <Card className="p-6" title="Agent Details">
            <div className="space-y-6">
              {/* Agent Information */}
              <div className="space-y-4">
                <div className="flex items-start justify-between min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 min-w-0">
                      <Icon name="robot" className="h-5 w-5 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-t-primary truncate" title={agent.name}>{agent.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const typeInfo = getAgentTypeInfo();
                        return (
                          <Badge variant={typeInfo.variant} className="text-xs flex items-center gap-1">
                            <Icon name={typeInfo.icon} className="w-3 h-3" />
                            {typeInfo.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <p className="text-t-secondary">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="users" className="w-4 h-4 text-t-secondary" />
                    <span className="text-t-primary">{agent.total_sessions} sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="clock" className="w-4 h-4 text-t-secondary" />
                    <span className="text-t-primary">{agent.last_used ? new Date(agent.last_used).toLocaleDateString() : 'Never used'}</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="capitalize text-t-primary">{agent.status}</span>
                  </div> */}
                </div>
                {agent.tools && agent.tools.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.tools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Voice AI Controls */}
              <div className="border-t border-s-stroke pt-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                  {!isActive ? (
                    <Button
                      onClick={handleStartInference}
                      disabled={!agentId || isLoading || isConnecting}
                      isStroke
                      className="w-full sm:w-auto"
                    >
                      {isConnecting ? (
                        <>
                          <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Icon name="play" className="w-4 h-4 mr-2" />
                          Start Inference
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={toggleMic}
                        isBlack={isMicOn}
                        isStroke={!isMicOn}
                        className="flex-1 sm:flex-none"
                      >
                        <Icon name={isMicOn ? "microphone" : "microphone_off"} className="w-4 h-4 mr-2" />
                        {isMicOn ? 'Mute' : 'Unmute'}
                      </Button>
                      <Button
                        onClick={handleStopInference}
                        isStroke
                        className="flex-1 sm:flex-none text-red-500 hover:text-red-600"
                      >
                        <Icon name="stop" className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  )}
                </div>
                
                {isActive && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-t-secondary">
                      <div className="w-2 h-2 bg-primary-02 rounded-full animate-pulse" />
                      Voice inference is active. Speak naturally to interact with the AI.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced Transcription Display */}
        {(isActive || hasMeaningfulTranscription()) && (
          <Card className="p-6" title="Conversation History">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center">
                    <Icon name="message" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-t-primary">Live Transcription</h3>
                    <p className="text-sm text-t-secondary">Real-time conversation history</p>
                  </div>
                </div>
              </div>
              
              {isTranscribing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-02 to-primary-01 rounded-full flex items-center justify-center mx-auto">
                      <Icon name="loader" className="w-8 h-8 animate-spin text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-t-primary">LiveKit Transcribing...</p>
                      <p className="text-sm text-t-secondary">Processing your conversation in real-time</p>
                    </div>
                  </div>
                </div>
              ) : hasMeaningfulTranscription() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-t-secondary">
                    <span>Showing {transcription.filter(entry => cleanTranscriptionText(entry.text).length > 0 && entry.isFinal === true).length} messages</span>
                    <span>LiveKit powered</span>
                  </div>
                  
                  <div className="overflow-y-auto max-h-80 space-y-3">
                    {transcription
                      .filter(entry => cleanTranscriptionText(entry.text).length > 0 && entry.isFinal === true)
                      .map((entry, index) => {
                        const cleanText = cleanTranscriptionText(entry.text);
                        if (!cleanText) return null;
                        
                        const isUser = entry.speaker === 'user';
                        
                        return (
                          <div key={entry.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {!isUser && (
                              <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon name="robot" className="w-4 h-4 text-white" />
                              </div>
                            )}
                            
                            <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
                              <div className={`rounded-2xl px-4 py-3 ${
                                isUser 
                                  ? 'bg-gradient-to-r from-primary-02 to-primary-01 text-white' 
                                  : 'bg-b-depth2 border border-s-stroke'
                              }`}>
                                <p className={`text-sm ${isUser ? 'text-white' : 'text-t-primary'}`}>
                                  {cleanText}
                                </p>
                              </div>
                              
                              <div className={`flex items-center gap-3 mt-2 text-xs ${
                                isUser ? 'justify-end text-t-secondary' : 'text-t-secondary'
                              }`}>
                                {entry.confidence && (
                                  <span className="flex items-center gap-1">
                                    <Icon name="check-circle" className="w-3 h-3" />
                                    {(entry.confidence * 100).toFixed(1)}%
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Icon name="clock" className="w-3 h-3" />
                                  {entry.timestamp.toLocaleTimeString()}
                                </span>
                                {entry.duration && (
                                  <span className="flex items-center gap-1">
                                    <Icon name="timer" className="w-3 h-3" />
                                    {entry.duration.toFixed(1)}s
                                  </span>
                                )}
                                {entry.source && (
                                  <span className="flex items-center gap-1">
                                    <Icon name="radio" className="w-3 h-3" />
                                    {entry.source.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {isUser && (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon name="profile" className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  {isActive ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="mic" className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-t-primary">Start Speaking</p>
                        <p className="text-sm text-t-secondary">
                          Begin your conversation to see LiveKit transcription here
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="message-square" className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-t-primary">No Conversation History</p>
                        <p className="text-sm text-t-secondary">
                          Start inference to begin recording your conversation
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Performance Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card className="p-6" title="Inference Performance">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg border border-s-stroke">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary-02 rounded-full"></div>
                  <span className="font-medium text-t-primary">Connection Status</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-t-primary">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                  <div className="text-xs text-t-secondary">
                    {inferenceState}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg border border-s-stroke">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isMicOn ? 'bg-primary-02' : 'bg-[#FF6A55]'}`}></div>
                  <span className="font-medium text-t-primary">Microphone</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-t-primary">
                    {isMicOn ? 'Active' : 'Muted'}
                  </div>
                  <div className="text-xs text-t-secondary">
                    {isMicOn ? 'Ready for input' : 'No input detected'}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg border border-s-stroke">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isUserSpeaking ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium text-t-primary">User Activity</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-t-primary">
                    {isUserSpeaking ? 'Speaking' : 'Silent'}
                  </div>
                  <div className="text-xs text-t-secondary">
                    {isUserSpeaking ? 'Voice detected' : 'No voice input'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6" title="Agent Information">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#6366F1] rounded"></div>
                  <span className="font-medium text-t-primary">Agent Type</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-t-primary">
                    {agent ? (agent.agent_type || agent.type || 'SPEECH') : 'Loading...'}
                  </div>
                  <div className="text-xs text-t-secondary">
                    {agent ? getAgentTypeInfo().label : 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#8B5CF6] rounded"></div>
                  <span className="font-medium text-t-primary">Status</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-t-primary">
                    {agent ? agent.status : 'Loading...'}
                  </div>
                  <div className="text-xs text-t-secondary">
                    {agent ? `${agent.total_sessions} sessions` : 'No data'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
