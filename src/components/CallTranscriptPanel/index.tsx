import React, { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import useHumeInference, { INFERENCE_STATES } from "@/hooks/useHumeInference";
import { toast } from "sonner";

interface CallTranscriptPanelProps {
    isOpen: boolean;
    onClose: () => void;
    agentData?: any; // Agent data for testing
}

const CallTranscriptPanel: React.FC<CallTranscriptPanelProps> = ({ isOpen, onClose, agentData }) => {
    const [callDuration, setCallDuration] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    // Inference functionality
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
        agentId: agentData?.id?.toString(),
        agentData: agentData
    });

    // Timer effect - runs when inference is active
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && inferenceState === "ACTIVE") {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, inferenceState]);

    // Reset timer when panel closes
    useEffect(() => {
        if (!isOpen) {
            setCallDuration(0);
        }
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const cleanTranscriptionText = (text: string): string => {
        return text
            .replace(/\s*\[partial due to error\]\s*/gi, '')
            .replace(/\s*\[interrupted\]\s*/gi, '')
            .replace(/\s*\[AI Response\]\s*/gi, '')
            .trim();
    };

    const handleStartInference = () => {
        if (!agentData?.id) {
            toast.error("Agent data is required for testing");
            return;
        }
        startInference(agentData.id.toString());
    };

    const handleStopInference = () => {
        stopInference();
        onClose();
    };

    const handleToggleMic = () => {
        toggleMic();
    };

    const handleSaveTranscription = () => {
        saveTranscription();
        toast.success("Transcription saved");
    };

    const handleClearTranscription = () => {
        clearTranscription();
        toast.success("Transcription cleared");
    };

    const hasMeaningfulTranscription = (): boolean => {
        return transcription.some(entry => cleanTranscriptionText(entry.text).length > 0 && entry.isFinal === true);
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
        <Modal open={isOpen} onClose={onClose} isSlidePanel>
            {/* Header */}
            <div className="flex items-center justify-between h-20 pl-10 pr-20 pt-5 pb-3 text-h5 max-md:h-18 max-md:pt-3 max-md:pl-9">
                <div>
                    <h2 className="text-h5 font-semibold">Test Agent</h2>
                    {agentData && (
                        <p className="text-sm text-t-secondary">{agentData.name}</p>
                    )}
                </div>
            </div>
            
            {/* Content Area */}
            <div className="h-[calc(100svh-5rem)] px-4 pb-4 overflow-y-auto max-md:h-[calc(100svh-4.5rem)] max-md:px-3">
                <div className="space-y-3">
                    {/* Header with stats - Single column for narrow width */}
                    <div className="space-y-3">
                        <Card className="p-3" title="Connection Status">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-t-secondary">Status</p>
                                    <p className="text-sm font-bold text-t-primary">
                                        {inferenceState}
                                    </p>
                                </div>
                                <div className={`w-5 h-5 rounded-full ${getStateColor(inferenceState)} flex items-center justify-center`}>
                                    <Icon name={getStateIcon(inferenceState)} className="w-2 h-2 text-white" />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-3" title="Microphone">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-t-secondary">Microphone</p>
                                    <p className="text-sm font-bold text-t-primary">
                                        {isMicOn ? 'On' : 'Off'}
                                    </p>
                                </div>
                                <Icon 
                                    name={isMicOn ? "microphone" : "microphone_off"} 
                                    className={`w-5 h-5 ${isMicOn ? 'fill-primary-02' : 'fill-[#FF6A55]'}`} 
                                />
                            </div>
                        </Card>
                        <Card className="p-3" title="User Activity">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-t-secondary">User</p>
                                    <p className="text-sm font-bold text-t-primary">
                                        {isUserSpeaking ? 'Speaking' : 'Silent'}
                                    </p>
                                </div>
                                <div className={`w-5 h-5 rounded-full ${isUserSpeaking ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center`}>
                                    <Icon name="user" className="w-2 h-2 text-white" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Controls */}
                    <Card className="p-3" title="Voice AI Controls">
                        <div className="flex flex-col gap-3 items-center justify-center mb-3">
                            {!isActive ? (
                                <Button
                                    onClick={handleStartInference}
                                    disabled={!agentData?.id || isLoading || isConnecting}
                                    isBlack
                                    className="w-full text-sm py-2"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Icon name="loader" className="w-3 h-3 mr-2 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="play" className="w-3 h-3 mr-2" />
                                            Start Test Call
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <div className="flex gap-2 w-full">
                                    <Button
                                        onClick={handleToggleMic}
                                        isBlack={isMicOn}
                                        isStroke={!isMicOn}
                                        className="flex-1 text-sm py-2"
                                    >
                                        <Icon name={isMicOn ? "microphone" : "microphone_off"} className="w-3 h-3 mr-1" />
                                        {isMicOn ? 'Mute' : 'Unmute'}
                                    </Button>
                                    <Button
                                        onClick={handleStopInference}
                                        isStroke
                                        className="flex-1 text-sm py-2 text-red-500 hover:text-red-600"
                                    >
                                        <Icon name="stop" className="w-3 h-3 mr-1" />
                                        Stop
                                    </Button>
                                </div>
                            )}
                        </div>
                        
                        {isActive && (
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 text-xs text-t-secondary">
                                    <div className="w-1.5 h-1.5 bg-primary-02 rounded-full animate-pulse" />
                                    Voice inference is active. Speak naturally.
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Enhanced Transcription Display */}
                    {(isActive || hasMeaningfulTranscription()) && (
                        <Card className="p-3" title="Conversation History">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center">
                                            <Icon name="message" className="w-2 h-2 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-t-primary">Live Transcription</h3>
                                            <p className="text-xs text-t-secondary">Real-time conversation</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            onClick={handleSaveTranscription}
                                            disabled={!hasMeaningfulTranscription() || isTranscribing}
                                            isStroke
                                            className="text-xs px-2 py-1"
                                        >
                                            <Icon name="download" className="w-2 h-2 mr-1" />
                                            Save
                                        </Button>
                                        <Button
                                            onClick={handleClearTranscription}
                                            disabled={!hasMeaningfulTranscription() || isTranscribing}
                                            isStroke
                                            className="text-xs px-2 py-1 text-red-500 hover:text-red-600"
                                        >
                                            <Icon name="trash-2" className="w-2 h-2 mr-1" />
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                                
                                {isTranscribing ? (
                                    <div className="flex items-center justify-center py-6">
                                        <div className="text-center space-y-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-02 to-primary-01 rounded-full flex items-center justify-center mx-auto">
                                                <Icon name="loader" className="w-5 h-5 animate-spin text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-t-primary">Transcribing...</p>
                                                <p className="text-xs text-t-secondary">Processing conversation</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : hasMeaningfulTranscription() ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs text-t-secondary">
                                            <span>{transcription.filter(entry => cleanTranscriptionText(entry.text).length > 0 && entry.isFinal === true).length} messages</span>
                                            <span>LiveKit</span>
                                        </div>
                                        
                                        <div className="overflow-y-auto max-h-48 space-y-2">
                                            {transcription
                                                .filter(entry => cleanTranscriptionText(entry.text).length > 0 && entry.isFinal === true)
                                                .map((entry, index) => {
                                                    const cleanText = cleanTranscriptionText(entry.text);
                                                    if (!cleanText) return null;
                                                    
                                                    const isUser = entry.speaker === 'user';
                                                    
                                                    return (
                                                        <div key={entry.id} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                            {!isUser && (
                                                                <div className="w-5 h-5 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <Icon name="robot" className="w-2 h-2 text-white" />
                                                                </div>
                                                            )}
                                                            
                                                            <div className={`max-w-[85%] ${isUser ? 'order-first' : ''}`}>
                                                                <div className={`rounded-xl px-2 py-1.5 ${
                                                                    isUser 
                                                                        ? 'bg-gradient-to-r from-primary-02 to-primary-01 text-white' 
                                                                        : 'bg-b-depth2 border border-s-stroke'
                                                                }`}>
                                                                    <p className={`text-xs ${isUser ? 'text-white' : 'text-t-primary'}`}>
                                                                        {cleanText}
                                                                    </p>
                                                                </div>
                                                                
                                                                <div className={`flex items-center gap-1 mt-1 text-xs ${
                                                                    isUser ? 'justify-end text-t-secondary' : 'text-t-secondary'
                                                                }`}>
                                                                    {entry.confidence && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Icon name="check-circle" className="w-1.5 h-1.5" />
                                                                            {(entry.confidence * 100).toFixed(0)}%
                                                                        </span>
                                                                    )}
                                                                    <span className="flex items-center gap-1">
                                                                        <Icon name="clock" className="w-1.5 h-1.5" />
                                                                        {entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {isUser && (
                                                                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <Icon name="profile" className="w-2 h-2 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        {isActive ? (
                                            <div className="space-y-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                                                    <Icon name="mic" className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-t-primary">Start Speaking</p>
                                                    <p className="text-xs text-t-secondary">
                                                        Begin conversation to see transcription
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto">
                                                    <Icon name="message-square" className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-t-primary">No History</p>
                                                    <p className="text-xs text-t-secondary">
                                                        Start inference to begin recording
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Performance Monitoring - Single column for narrow width */}
                    <div className="space-y-2">
                        <Card className="p-3" title="Performance">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-b-depth2 rounded-lg border border-s-stroke">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary-02 rounded-full"></div>
                                        <span className="text-xs font-medium text-t-primary">Connection</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-medium text-t-primary">
                                            {isConnected ? 'Connected' : 'Disconnected'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-b-depth2 rounded-lg border border-s-stroke">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isMicOn ? 'bg-primary-02' : 'bg-[#FF6A55]'}`}></div>
                                        <span className="text-xs font-medium text-t-primary">Microphone</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-medium text-t-primary">
                                            {isMicOn ? 'Active' : 'Muted'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-b-depth2 rounded-lg border border-s-stroke">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isUserSpeaking ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-xs font-medium text-t-primary">User Activity</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-medium text-t-primary">
                                            {isUserSpeaking ? 'Speaking' : 'Silent'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-b-depth2 rounded-lg border border-s-stroke">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary-02 rounded-full"></div>
                                        <span className="text-xs font-medium text-t-primary">Call Time</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-medium text-t-primary">
                                            {formatTime(callDuration)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CallTranscriptPanel;
