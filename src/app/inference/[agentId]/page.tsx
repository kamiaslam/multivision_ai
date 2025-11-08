"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import Icon from "@/components/Icon";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useHumeInference, { INFERENCE_STATES } from "@/hooks/useHumeInference";
import { toast } from "sonner";

const Inference = () => {
  const params = useParams();
  const agentId = params?.agentId as string;
  
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const [backgroundVolume, setBackgroundVolume] = useState(0.3);
  const [isBackgroundAudioPlaying, setIsBackgroundAudioPlaying] = useState(false);
  const [selectedAudioFile, setSelectedAudioFile] = useState('background-chatter.mp3');
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

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
    saveTranscription,
    clearTranscription,
    transcriptionUpdateTrigger
  } = useHumeInference({
    agentId: agentId
  });

  const handleStartInference = async () => {
    if (!agentId) {
      toast.error("Missing Agent ID", {
        description: "Please provide a valid agent ID to start inference",
        duration: 4000
      });
      return;
    }
    
    // Test toast to verify toast system is working
    console.log('🧪 Testing toast system...');
    toast.info("Starting Voice AI", {
      description: "Connecting to inference session...",
      duration: 3000
    });
    
    try {
      await startInference(agentId);
    } catch (error: any) {
      console.error('Error in handleStartInference:', error);
      // The error should already be handled by the hook and shown via toast
      // But we can add additional handling here if needed
    }
  };

  const handleStopInference = () => {
    stopInference();
  };

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

  const handleSaveTranscription = () => {
    saveTranscription();
    toast.success("Transcription saved");
  };

  const handleClearTranscription = () => {
    clearTranscription();
    toast.success("Transcription cleared");
  };

  const initializeBackgroundAudio = () => {
    if (!backgroundAudioRef.current) {
      const audioPath = `/${selectedAudioFile}`;
      console.log('Initializing audio with path:', audioPath);
      backgroundAudioRef.current = new Audio(audioPath);
      backgroundAudioRef.current.loop = true;
      backgroundAudioRef.current.volume = backgroundVolume;

      backgroundAudioRef.current.addEventListener('play', () => {
        setIsBackgroundAudioPlaying(true);
        console.log('Audio playing');
      });

      backgroundAudioRef.current.addEventListener('pause', () => {
        setIsBackgroundAudioPlaying(false);
        console.log('Audio paused');
      });

      backgroundAudioRef.current.addEventListener('ended', () => {
        setIsBackgroundAudioPlaying(false);
        console.log('Audio ended');
      });

      backgroundAudioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error details:', backgroundAudioRef.current?.error);
        toast.error('Failed to load audio file. Check file path or format.');
      });
    }
  };

  const toggleBackgroundAudio = () => {
    if (!backgroundAudioRef.current) {
      initializeBackgroundAudio();
    }

    if (backgroundAudioRef.current) {
      if (isBackgroundAudioPlaying) {
        backgroundAudioRef.current.pause();
        setIsBackgroundAudioPlaying(false);
        toast.success("Background audio stopped");
      } else {
        backgroundAudioRef.current.play()
          .then(() => {
            setIsBackgroundAudioPlaying(true);
            toast.success("Background audio started");
          })
          .catch(error => {
            console.error('Error playing background audio:', error);
            toast.error(`Failed to play audio: ${error.message}`);
          });
      }
    } else {
      toast.error('Audio element not initialized');
    }
  };

  const handleBackgroundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setBackgroundVolume(newVolume);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newVolume;
    }
  };

  const changeAudioFile = (newAudioFile: string) => {
    setSelectedAudioFile(newAudioFile);
    if (isBackgroundAudioPlaying && backgroundAudioRef.current) {
      // Pause and reset current audio
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current = null;

      // Initialize new audio
      initializeBackgroundAudio();
      
      // Wait for the new audio to be ready before playing
      if (backgroundAudioRef.current) {
        const playWhenReady = () => {
          backgroundAudioRef.current?.play()
            .then(() => {
              setIsBackgroundAudioPlaying(true);
              toast.success("Background audio changed");
            })
            .catch(error => {
              console.error('Error playing new background audio:', error);
              toast.error(`Failed to play new audio: ${error.message}`);
            });
        };

        // Check if audio is ready to play
        const audioElement = backgroundAudioRef.current as HTMLAudioElement;
        if (audioElement && audioElement.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          playWhenReady();
        } else if (audioElement) {
          audioElement.addEventListener('canplay', playWhenReady, { once: true });
        }
      } else {
        toast.error('Audio element not initialized');
      }
    }
  };

  // Consolidated useEffect for auto-playing audio
  useEffect(() => {
    if (inferenceState === "ACTIVE" && isAmbientSoundOn && !isBackgroundAudioPlaying) {
      const timer = setTimeout(() => {
        if (!backgroundAudioRef.current) {
          initializeBackgroundAudio();
        }
        if (backgroundAudioRef.current) {
          console.log('Attempting to auto-play audio:', selectedAudioFile);
          backgroundAudioRef.current.play()
            .then(() => {
              console.log('Auto-play successful');
              setIsBackgroundAudioPlaying(true);
            })
            .catch(error => {
              console.error('Auto-play error:', error);
              toast.error('Autoplay blocked. Please start audio manually.');
            });
        } else {
          console.error('Audio element not initialized');
          toast.error('Audio element not ready');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inferenceState, isAmbientSoundOn, isBackgroundAudioPlaying, selectedAudioFile]);

  // Stop audio when inference stops
  useEffect(() => {
    if (inferenceState === "IDLE" && isBackgroundAudioPlaying) {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
        setIsBackgroundAudioPlaying(false);
      }
    }
  }, [inferenceState, isBackgroundAudioPlaying]);

  // Cleanup background audio on unmount
  useEffect(() => {
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    };
  }, []);

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
        return "radio";
      case "ERROR":
        return "volume_x";
      default:
        return "square";
    }
  };

  const isActive = inferenceState === "ACTIVE";
  const isConnecting = inferenceState === "CONNECTING";

  return (
    <ProtectedRoute>
      <Layout title="Voice AI Inference">
        <div className="space-y-3">
          {/* Header with stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 mb-0">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${getStateColor(inferenceState)}`}>
                  <Icon name={getStateIcon(inferenceState)} className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sub-title-1">Connection Status</div>
                  </div>
                  <div className="text-2xl font-bold text-t-primary">
                    {inferenceState}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6 mb-0">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${isMicOn ? 'bg-primary-02' : 'bg-[#FF6A55]'}`}>
                  <Icon name={isMicOn ? "microphone" : "microphone_off"} className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sub-title-1">Microphone</div>
                  </div>
                  <div className="text-2xl font-bold text-t-primary">
                    {isMicOn ? 'On' : 'Off'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {isMicOn ? 'Ready for input' : 'No input detected'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6 mb-0">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${isUserSpeaking ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <Icon name="user" className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sub-title-1">User Activity</div>
                  </div>
                  <div className="text-2xl font-bold text-t-primary">
                    {isUserSpeaking ? 'Speaking' : 'Silent'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {isUserSpeaking ? 'Voice detected' : 'No voice input'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6 mb-0">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${isBackgroundAudioPlaying ? 'bg-primary-02' : 'bg-gray-300'}`}>
                  <Icon name="music" className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sub-title-1">Background Audio</div>
                  </div>
                  <div className="text-2xl font-bold text-t-primary">
                    {isBackgroundAudioPlaying ? 'On' : 'Off'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {Math.round(backgroundVolume * 100)}% volume
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Controls */}
          <Card className="p-6" title="Voice AI Controls">
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
                    onClick={toggleBackgroundAudio}
                    isBlack={isBackgroundAudioPlaying}
                    isStroke={!isBackgroundAudioPlaying}
                    className="flex-1 sm:flex-none"
                  >
                    <Icon name="music" className="w-4 h-4 mr-2" />
                    {isBackgroundAudioPlaying ? 'Ambient On' : 'Ambient Off'}
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
          </Card>

          {/* Background Audio Controls */}
          <Card className="p-6" title="Background Audio Settings">
            <div className="space-y-6">
              {/* Audio Control Section */}
              <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#6366F1] rounded"></div>
                  <span className="font-medium text-t-primary">Audio Control</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={toggleBackgroundAudio}
                    isBlack={isBackgroundAudioPlaying}
                    isStroke={!isBackgroundAudioPlaying}
                    disabled={!isActive}
                    className="text-sm"
                  >
                    <Icon 
                      name={isBackgroundAudioPlaying ? "volume_1" : "volume_x"} 
                      className="w-4 h-4 mr-2" 
                    />
                    {isBackgroundAudioPlaying ? 'Stop Audio' : 'Start Audio'}
                  </Button>
                </div>
              </div>

              {/* Auto-play Setting */}
              <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#8B5CF6] rounded"></div>
                  <span className="font-medium text-t-primary">Auto-play Setting</span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isAmbientSoundOn}
                    onChange={(checked) => setIsAmbientSoundOn(checked)}
                    label="Auto-play when inference starts"
                  />
                </div>
              </div>
              
              {/* Audio File Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-t-primary">Background Audio File</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    isBlack={selectedAudioFile === 'background-chatter.mp3'}
                    isStroke={selectedAudioFile !== 'background-chatter.mp3'}
                    onClick={() => changeAudioFile('background-chatter.mp3')}
                    disabled={!(isAmbientSoundOn || isBackgroundAudioPlaying)}
                    className="justify-center"
                  >
                    <Icon name="music" className="w-4 h-4 mr-2" />
                    Chatter 1
                  </Button>
                  <Button
                    isBlack={selectedAudioFile === 'background-chatter-2.mp3'}
                    isStroke={selectedAudioFile !== 'background-chatter-2.mp3'}
                    onClick={() => changeAudioFile('background-chatter-2.mp3')}
                    disabled={!(isAmbientSoundOn || isBackgroundAudioPlaying)}
                    className="justify-center"
                  >
                    <Icon name="music" className="w-4 h-4 mr-2" />
                    Chatter 2
                  </Button>
                </div>
              </div>
              
              {/* Volume Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-t-primary">Volume Control</span>
                  <span className="text-sm text-t-secondary">
                    {Math.round(backgroundVolume * 100)}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    value={backgroundVolume * 100}
                    onChange={handleBackgroundVolumeChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full h-2 bg-b-depth2 rounded-lg appearance-none cursor-pointer slider"
                    disabled={!(isAmbientSoundOn || isBackgroundAudioPlaying)}
                  />
                  <style jsx>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #6366F1;
                      cursor: pointer;
                      border: 2px solid #fff;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .slider::-moz-range-thumb {
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #6366F1;
                      cursor: pointer;
                      border: 2px solid #fff;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                  `}</style>
                </div>
              </div>
              
              {isAmbientSoundOn && (
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Background audio will play automatically when inference starts
                  </div>
                </div>
              )}
            </div>
          </Card>

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
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveTranscription}
                      disabled={!hasMeaningfulTranscription() || isTranscribing}
                      isStroke
                    >
                      <Icon name="download" className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleClearTranscription}
                      disabled={!hasMeaningfulTranscription() || isTranscribing}
                      isStroke
                      className="text-red-500 hover:text-red-600"
                    >
                      <Icon name="trash-2" className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
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
                <div className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg border border-s-subtle">
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
                <div className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg border border-s-subtle">
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
                <div className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg border border-s-subtle">
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

            <Card className="p-6" title="Audio Settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#6366F1] rounded"></div>
                    <span className="font-medium text-t-primary">Background Audio</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-t-primary">
                      {isBackgroundAudioPlaying ? 'Playing' : 'Stopped'}
                    </div>
                    <div className="text-xs text-t-secondary">
                      {Math.round(backgroundVolume * 100)}% volume
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#8B5CF6] rounded"></div>
                    <span className="font-medium text-t-primary">Auto-play</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-t-primary">
                      {isAmbientSoundOn ? 'Enabled' : 'Disabled'}
                    </div>
                    <div className="text-xs text-t-secondary">
                      {isAmbientSoundOn ? 'Will start automatically' : 'Manual control only'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Inference;
