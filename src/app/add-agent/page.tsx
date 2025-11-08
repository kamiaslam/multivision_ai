"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Element, scroller } from "react-scroll";
import { useRouter, useSearchParams } from "next/navigation";

// Extend Window interface to include scrollSpy
declare global {
    interface Window {
        scrollSpy?: {
            destroy: () => void;
            update: () => void;
        };
    }
}

import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { Link } from "react-scroll";
import CallTranscriptPanel from "@/components/CallTranscriptPanel";
import { CreateAgentModal } from "@/components/CreateAgentModal";
import { agentAPI } from "@/services/api";
import { toast } from "sonner";
import { SelectOption } from "@/types/select";
import { AgentType } from "@/types/agent";
import { useAgentEdit } from "@/context/agentEditContext";
import { useVoices } from "@/contexts/VoiceContext";
import { formatPhoneNumber, isValidPhoneNumber, normalizePhoneNumber, isValidUSUKPhoneNumber } from "@/utils/phoneNumber";

// Import modular components
import {
  AgentTypeSelector,
  PerformanceMetrics,
  VoiceModelConfig,
  AssistantDetails,
  SystemPrompt,
  ToolsSelection,
  Assignments,
  ShareSection,
  SidebarNavigation
} from "./components";

const ElementWithOffset = ({
    className,
    name,
    children,
}: {
    className?: string;
    name: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="relative">
            <Element
                className={`absolute -top-21 left-0 right-0 ${className || ""}`}
                name={name}
            ></Element>
            {children}
        </div>
    );
};


const CreateAssistantPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { editingAgent, isEditMode, clearEditState } = useAgentEdit();
    const { getVoicesByProvider, getCategoriesByProvider, getVoiceById, isLoading: voiceLoading, error: voiceError, refreshClonedVoices } = useVoices();
    
    // Ref to track if component is mounted
    const isMountedRef = useRef(true);
    // Ref to track scroll spy state
    const scrollSpyEnabledRef = useRef(true);
    
    // Call Transcript Panel
    const [isCallPanelOpen, setIsCallPanelOpen] = useState(false);

    // Create Agent Modal
    const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);

    // System Prompt expandable state
    const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(false);

    // Agent Type Selection
    const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(null);

    // Edit mode state is now managed by context

    // Form Data (matching CreateAgentModal structure)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        voice_provider: "",
        voice_category: "",
        voice_id: "",
        model_provider: "",
        model_resource: "",
        language: "",
        instructions: "",
        tool_ids: [] as string[]
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [createdAgentId, setCreatedAgentId] = useState<number | null>(null);

    // Performance Metrics (keeping existing)
    const [costRange, setCostRange] = useState([0, 50]);
    const [latencyRange, setLatencyRange] = useState([0, 100]);

    // Legacy fields (keeping for existing design compatibility)
    const [language, setLanguage] = useState("English");
    const [turnTaking, setTurnTaking] = useState("auto");
    const [emotionsSensitivity, setEmotionsSensitivity] = useState("0.5");

    // Training Data
    // Removed training data upload from agent creation per new spec


    // Handle mode parameter to force create mode
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'create') {
            // Clear edit state when explicitly creating a new agent
            console.log('Mode=create detected, clearing edit state');
            clearEditState();
        }
    }, [searchParams, clearEditState]);

    // Initialize scroll spy safely
    useEffect(() => {
        // Clean up any existing scroll spy instances first
        try {
            if (typeof window !== 'undefined' && window.scrollSpy) {
                window.scrollSpy.destroy();
                delete window.scrollSpy;
            }
        } catch (error) {
            console.warn('Scroll spy cleanup on mount warning:', error);
        }

        // Add a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            try {
                // Reset scroll spy state
                scrollSpyEnabledRef.current = true;
                isMountedRef.current = true;
                console.log('Scroll spy initialization completed');
            } catch (error) {
                console.warn('Scroll spy initialization warning:', error);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Add global error handler for scroll spy
    useEffect(() => {
        const handleScrollSpyError = (event: ErrorEvent) => {
            if (event.message && event.message.includes('spyCallbacks')) {
                console.warn('Scroll spy error caught and handled:', event.message);
                event.preventDefault();
                return false;
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('error', handleScrollSpyError);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('error', handleScrollSpyError);
            }
        };
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            scrollSpyEnabledRef.current = false;
            
            // Comprehensive scroll spy cleanup
            try {
                if (typeof window !== 'undefined') {
                    // Disable scroll spy completely
                    if (window.scrollSpy) {
                        try {
                        window.scrollSpy.destroy();
                        } catch (e) {
                            // Ignore errors during cleanup
                        }
                        delete window.scrollSpy;
                    }
                    
                    // Remove any scroll event listeners
                    const scrollHandler = () => {};
                    window.removeEventListener('scroll', scrollHandler);
                    window.removeEventListener('scroll', scrollHandler, true);
                }
            } catch (error) {
                console.warn('Scroll spy cleanup warning:', error);
            }
        };
    }, []);

    // Auto-set voice provider for STS agents
    useEffect(() => {
        if (selectedAgentType === 'SPEECH' && formData.voice_provider !== 'voicecake') {
            setFormData(prev => ({ 
                ...prev, 
                voice_provider: 'voicecake',
                voice_category: "", // Reset when changing provider
                voice_id: "" // Reset when changing provider
            }));
        }
    }, [selectedAgentType]);

    // Initialize edit mode from context
    useEffect(() => {
        console.log('Context state:', { isEditMode, editingAgent: editingAgent?.name });
        if (isEditMode && editingAgent) {
            console.log('Setting up edit mode for agent:', editingAgent.name);
            // Set agent type
            setSelectedAgentType(editingAgent.agent_type || editingAgent.type || null);
            
            // Set form data
            const agentLanguage = (editingAgent as any).language || "";
            setFormData({
                name: editingAgent.name || "",
                description: editingAgent.description || "",
                voice_provider: editingAgent.voice_provider === "hume" ? "voicecake" : editingAgent.voice_provider || "", // Map hume back to voicecake for form
                voice_category: agentLanguage, // Set to language for SPEECH agents (will be updated for TEXT agents)
                voice_id: editingAgent.voice_id || "",
                model_provider: editingAgent.model_provider || "",
                model_resource: (editingAgent as any).model_resource || "",
                language: agentLanguage,
                instructions: editingAgent.custom_instructions || "",
                tool_ids: editingAgent.tool_ids || []
            });
            
            // Set phone number from agent data
            setPhoneNumber(editingAgent.inbound_phone_number || "");
            
            
            // Convert voice name from backend to UUID for form (for all agents)
            if (editingAgent.voice_provider && editingAgent.voice_id) {
                const mappedProvider = editingAgent.voice_provider === "hume" ? "voicecake" : editingAgent.voice_provider;
                const allVoicesForProvider = getVoicesByProvider(mappedProvider);
                
                // Backend stores voice name, so find by name and get UUID
                const foundVoice = allVoicesForProvider.find(voice => voice.name === editingAgent.voice_id);
                
                if (foundVoice) {
                    console.log('✅ Converting voice name to UUID for form:', { 
                        backendVoiceName: editingAgent.voice_id, 
                        voiceUUID: foundVoice.id,
                        category: foundVoice.category,
                        language: foundVoice.language
                    });
                    
                    // Update form with UUID and category
                    const agentType = editingAgent.agent_type || editingAgent.type;
                    setFormData(prev => ({ 
                        ...prev, 
                        voice_category: agentType === 'TEXT' ? (foundVoice.category || "") : prev.voice_category,
                        voice_id: foundVoice.id // Use UUID for form
                    }));
                } else {
                    console.log('⚠️ Voice not found by name:', editingAgent.voice_id);
                }
            }
        } else {
            console.log('Setting up create mode');
            // Reset form when not in edit mode (create mode)
            setSelectedAgentType(null);
            setFormData({
                name: "",
                description: "",
                voice_provider: "",
                voice_category: "",
                voice_id: "",
                model_provider: "",
                model_resource: "",
                language: "",
                instructions: "",
                tool_ids: []
            });
            setPhoneNumber("");
        }
    }, [isEditMode, editingAgent]);

    // Debug: Log form data changes (commented out to prevent potential issues)
    // useEffect(() => {
    //     console.log('Form data updated:', formData);
    // }, [formData]);

    // Phone number state
    const [phoneNumber, setPhoneNumber] = useState("");


    // Base navigation items
    const baseNavigation = [
        {
            title: "Agent Type",
            icon: "robot",
            description: "Select agent type",
            to: "agent-type",
        },
        {
            title: "Performance",
            icon: "chart",
            description: "Cost and latency metrics",
            to: "performance",
        },
        {
            title: "Model",
            icon: "model",
            description: "AI model configuration",
            to: "model",
        },
        {
            title: "Details",
            icon: "details",
            description: "Assistant details and settings",
            to: "details",
        },
        {
            title: "System Prompt",
            icon: "message",
            description: "Define assistant behavior",
            to: "system-prompt",
        },
        {
            title: "Tools",
            icon: "tools",
            description: "Select agent tools",
            to: "tools",
        },
        {
            title: "Assignments",
            icon: "link",
            description: "Phone numbers and automations",
            to: "assignments",
        },

    ];

    // Add Share section only when agent is created or editing
    const navigation = (isSuccess || isEditMode) 
        ? [
            ...baseNavigation,
        {
            title: "Share",
            icon: "share",
            description: "Share assistant with others",
            to: "share",
        },
        ]
        : baseNavigation;


    const handleCreateAgent = (agentData: any) => {
        console.log("Agent created:", agentData);
        // Handle the created agent data here
        // You can redirect to the agents page or show a success message
    };

    // Form data change handlers
    const handleFormDataChange = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handlePhoneNumberBlur = (value: string) => {
        if (value && isValidUSUKPhoneNumber(value)) {
            setPhoneNumber(formatPhoneNumber(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isLoading || isSuccess) {
            console.log('Form submission blocked - already processing or completed');
            return;
        }
        
        if (!selectedAgentType) {
            toast.error("Please select an agent type");
            return;
        }

        // Validate required fields
        if (!formData.name.trim()) {
            toast.error("Agent name is required");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required");
            return;
        }

        if (selectedAgentType === 'SPEECH') {
            if (!formData.voice_provider) {
                toast.error("Voice provider is required for Speech-to-Speech agents");
                return;
            }
            if (!formData.voice_id) {
                toast.error("Voice is required for Speech-to-Speech agents");
                return;
            }
            if (!formData.model_provider) {
                toast.error("AI model provider is required for Speech-to-Speech agents");
                return;
            }
            if (!formData.model_resource) {
                toast.error("AI model is required for Speech-to-Speech agents");
                return;
            }
        } else if (selectedAgentType === 'TEXT') {
            if (!formData.voice_provider) {
                toast.error("Voice provider is required for Text-to-Speech agents");
                return;
            }
            if (!formData.voice_id) {
                toast.error("Voice is required for Text-to-Speech agents");
                return;
            }
            if (!formData.instructions.trim()) {
                toast.error("Instructions are required for Text-to-Speech agents");
                return;
            }
        }

        // Additional validation for voice data
        if (selectedAgentType === 'TEXT' && (!formData.voice_provider || !formData.voice_id)) {
            toast.error("Please select both voice provider and voice");
            console.error('Voice validation failed:', { voice_provider: formData.voice_provider, voice_id: formData.voice_id });
            return;
        }

        setIsLoading(true);

        try {
            // Convert voice UUID to voice name for backend
            let voiceId = formData.voice_id;
            
            // For VoiceCake/Hume voices, convert UUID to name
            if (selectedAgentType === 'SPEECH' && formData.voice_id) {
                const allVoices = getVoicesByProvider("voicecake");
                const foundVoice = allVoices.find(voice => voice.id === formData.voice_id);
                if (foundVoice) {
                    voiceId = foundVoice.name; // Use name for backend
                    console.log('✅ Converting voice UUID to name for backend:', { 
                        uuid: formData.voice_id, 
                        name: foundVoice.name 
                    });
                } else {
                    console.log('⚠️ Voice not found by UUID:', formData.voice_id);
                }
            }
            
            // For TEXT agents with Hamsa provider, also convert to name
            if (selectedAgentType === 'TEXT' && formData.voice_provider === "hamsa" && formData.voice_id) {
                const selectedVoice = getVoiceById(formData.voice_id, "hamsa");
                if (selectedVoice) {
                    voiceId = selectedVoice.name; // Use speaker name for Hamsa
                }
            }
            
            console.log('Saving agent with voice name:', {
                voiceName: voiceId,
                provider: formData.voice_provider
            });

            // Prepare the payload according to the API specification
            const agentPayload = {
                name: formData.name,
                voice_provider: formData.voice_provider === "voicecake" ? "hume" : formData.voice_provider, // Map voicecake to hume
                voice_id: voiceId, // Pass voice name
                description: formData.description,
                custom_instructions: formData.instructions,
                model_provider: formData.model_provider,
                model_resource: formData.model_resource,
                language: formData.language || undefined, // Include language for voice filtering
                agent_type: selectedAgentType === 'SPEECH' ? 'SPEECH' : 'TEXT',
                tool_ids: formData.tool_ids,
                inbound_phone_number: phoneNumber ? normalizePhoneNumber(phoneNumber) : undefined
            };

            // Debug: Log the form data and payload
            console.log('Form Data:', formData);
            console.log('Agent Payload:', agentPayload);

            let response;
            if (isEditMode && editingAgent) {
                // Update existing agent
                console.log('Updating agent with payload:', agentPayload);
                response = await agentAPI.updateAgent(editingAgent.id.toString(), agentPayload);
                console.log("Agent updated successfully:", response);
                toast.success(`Agent "${formData.name}" updated successfully!`, {
                    description: "Your agent has been updated and is ready to use.",
                    duration: 5000,
                });
            } else {
                // Create new agent
                console.log('Creating agent with payload:', agentPayload);
                response = await agentAPI.createAgent(agentPayload);
                console.log("Agent created successfully:", response);
                toast.success(`Agent "${formData.name}" created successfully!`, {
                    description: "Your new agent is ready to use. Redirecting to agents page...",
                    duration: 5000,
                });
            }
            
            // Set success state (preserve edit mode for success display)
            setIsSuccess(true);
            setCreatedAgentId(response.data?.id || response.data?.data?.id || editingAgent?.id || null);
            
            // Reset form but don't clear edit state yet (needed for success display)
            // clearEditState(); // Moved to after navigation
            setFormData({
                name: "",
                description: "",
                voice_provider: "",
                voice_category: "",
                voice_id: "",
                model_provider: "",
                model_resource: "",
                language: "",
                instructions: "",
                tool_ids: []
            });
            setPhoneNumber("");
            
            // Navigate back to agents page after a short delay
            setTimeout(() => {
                try {
                    clearEditState(); // Clear edit state before navigation
                    router.push('/agents');
                } catch (navError) {
                    console.error("Navigation error:", navError);
                }
            }, 2000);
            
        } catch (error: any) {
            console.error("Error in agent operation:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            
            // Extract error message from different possible sources
            let errorMessage = isEditMode ? "Failed to update agent" : "Failed to create agent";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Share functions
    const handleShare = (platform: string) => {
        if (!createdAgentId && !editingAgent?.id) {
            toast.error("No agent available to share");
            return;
        }

        const agentId = createdAgentId || editingAgent?.id;
        const shareUrl = `${window.location.origin}/share/${agentId}`;
        const shareText = `Try out ${formData.name || editingAgent?.name} - an AI voice agent: ${formData.description || editingAgent?.description}`;

        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        
        let shareLink = "";
        
        switch (platform) {
            case "link":
                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success("Link copied to clipboard!");
                }).catch(() => {
                    // Fallback for browsers that don't support clipboard API
                    const textArea = document.createElement("textarea");
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    toast.success("Link copied to clipboard!");
                });
                return;
            case "whatsapp":
                shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case "email":
                shareLink = `mailto:?subject=Check out this AI agent: ${formData.name || editingAgent?.name}&body=${encodedText}%0A%0A${encodedUrl}`;
                break;
            case "facebook":
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case "twitter":
                shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case "instagram":
                // Instagram doesn't support direct sharing, so copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success("Link copied to clipboard! You can paste it in your Instagram story or post.");
                }).catch(() => {
                    const textArea = document.createElement("textarea");
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    toast.success("Link copied to clipboard! You can paste it in your Instagram story or post.");
                });
                return;
            default:
                return;
        }
        
        if (shareLink) {
            window.open(shareLink, "_blank", "width=600,height=400");
        }
    };

    return (
        <Layout title="Create Assistant">
            <div className="flex items-start max-lg:block">
                {/* Sidebar Menu */}
                <SidebarNavigation
                    navigation={navigation}
                    isMountedRef={isMountedRef}
                    scrollSpyEnabledRef={scrollSpyEnabledRef}
                />

                {/* Main Content Area */}
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-h6 font-bold">
                            {isEditMode ? `Edit Agent: ${editingAgent?.name || 'Unknown'}` : 'Create New Agent'}
                        </h1>
                    </div>

                    {/* Success Banner */}
                    {isSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Icon name="check-circle" className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-800">
                                        {isEditMode ? 'Agent Updated Successfully!' : 'Agent Created Successfully!'}
                                    </p>
                                    <p className="text-sm text-green-600">
                                        {isEditMode 
                                            ? 'Your agent has been updated and is ready to use.' 
                                            : `Agent ID: ${createdAgentId || 'N/A'}. Your new agent is ready to use. Redirecting to agents page...`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Agent Type Selection */}
                    <ElementWithOffset name="agent-type">
                        <Card title="Agent Type" className="p-6">
                            <AgentTypeSelector
                                selectedAgentType={selectedAgentType}
                                isEditMode={isEditMode}
                                onAgentTypeSelect={setSelectedAgentType}
                                onAgentTypeChange={() => setSelectedAgentType(null)}
                            />
                        </Card>
                    </ElementWithOffset>

                    {/* Performance Metrics */}
                    <ElementWithOffset name="performance">
                        <Card title="Performance Metrics" className="p-6">
                            <PerformanceMetrics onTestAssistant={() => setIsCallPanelOpen(true)} />
                        </Card>
                    </ElementWithOffset>

                    {/* Model Configuration */}
                    <ElementWithOffset name="model">
                        <Card title="Voice & Model Configuration" className="p-6">
                            <VoiceModelConfig
                                selectedAgentType={selectedAgentType}
                                formData={formData}
                                voiceLoading={voiceLoading}
                                voiceError={voiceError}
                                getVoicesByProvider={getVoicesByProvider}
                                getCategoriesByProvider={getCategoriesByProvider}
                                getVoiceById={getVoiceById}
                                onFormDataChange={handleFormDataChange}
                                refreshClonedVoices={refreshClonedVoices}
                            />
                        </Card>
                    </ElementWithOffset>

                    {/* Details */}
                    <ElementWithOffset name="details">
                        <Card title="Assistant Details" className="p-6">
                            <AssistantDetails
                                selectedAgentType={selectedAgentType}
                                formData={formData}
                                language={language}
                                turnTaking={turnTaking}
                                onFormDataChange={handleFormDataChange}
                                onLanguageChange={setLanguage}
                                onTurnTakingChange={setTurnTaking}
                            />
                        </Card>
                    </ElementWithOffset>

                    {/* System Prompt */}
                    <ElementWithOffset name="system-prompt">
                        <Card title="Instructions" className="p-6">
                            <SystemPrompt
                                selectedAgentType={selectedAgentType}
                                instructions={formData.instructions}
                                isExpanded={isSystemPromptExpanded}
                                onInstructionsChange={(instructions) => handleFormDataChange({ instructions })}
                                onToggleExpanded={() => setIsSystemPromptExpanded(!isSystemPromptExpanded)}
                            />
                        </Card>
                    </ElementWithOffset>

                    {/* Tools Selection */}
                    <ElementWithOffset name="tools">
                        <Card title="Tools & Capabilities" className="p-6">
                            <ToolsSelection
                                selectedAgentType={selectedAgentType}
                                toolIds={formData.tool_ids}
                                onToolIdsChange={(toolIds) => handleFormDataChange({ tool_ids: toolIds })}
                            />
                        </Card>
                    </ElementWithOffset>

                    {/* Assignments */}
                    <ElementWithOffset name="assignments">
                        <Assignments
                            phoneNumber={phoneNumber}
                            onPhoneNumberChange={setPhoneNumber}
                            onPhoneNumberBlur={handlePhoneNumberBlur}
                        />
                    </ElementWithOffset>



                    {/* Share - Only show when agent is created or editing */}
                    {(isSuccess || isEditMode) && (
                    <ElementWithOffset name="share">
                        <Card title="Share" className="p-6">
                            <ShareSection
                                agentName={formData.name || editingAgent?.name || ""}
                                agentDescription={formData.description || editingAgent?.description || ""}
                                agentId={createdAgentId || editingAgent?.id || null}
                                onShare={handleShare}
                            />
                        </Card>
                    </ElementWithOffset>
                    )}

                    {/* Footer Buttons */}
                    <form onSubmit={handleSubmit}>
                    <div className="flex justify-end gap-3 pt-6">
                            <Button 
                                type="button" 
                                isStroke
                                onClick={() => {
                                    try {
                                        // Disable scroll spy immediately to prevent errors
                                        scrollSpyEnabledRef.current = false;
                                        isMountedRef.current = false;
                                        
                                        // Clear edit state if in edit mode
                                        if (isEditMode) {
                                            clearEditState();
                                        }
                                        
                                        // Comprehensive scroll spy cleanup
                                        try {
                                            if (typeof window !== 'undefined') {
                                                if (window.scrollSpy) {
                                                    try {
                                                window.scrollSpy.destroy();
                                                    } catch (e) {
                                                        // Ignore errors during cleanup
                                                    }
                                                    delete window.scrollSpy;
                                                }
                                            }
                                        } catch (cleanupError) {
                                            console.warn('Scroll spy cleanup error:', cleanupError);
                                        }
                                        
                                        // Immediate navigation without delay
                                        router.push('/agents');
                                    } catch (error) {
                                        console.warn('Cancel button error:', error);
                                        // Fallback: direct navigation
                                        router.push('/agents');
                                    }
                                }}
                            >
                            Cancel
                        </Button>
                            <Button 
                                type="submit"
                                disabled={isLoading || !selectedAgentType || isSuccess}
                                className="flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Icon name="loader" className="w-4 h-4 animate-spin" />
                                        {isEditMode ? 'Updating Agent...' : 'Creating Agent...'}
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <Icon name="check-circle" className="w-4 h-4 text-green-500" />
                                        {isEditMode ? 'Agent Updated!' : 'Agent Created!'}
                                    </>
                                ) : (
                                    <>
                            <Icon name="save" className="w-4 h-4" />
                                        {isEditMode ? 'Update Agent' : 'Create Agent'}
                                    </>
                                )}
                        </Button>
                    </div>
                    </form>
                </div>
            </div>

            {/* Call Transcript Panel */}
            <CallTranscriptPanel 
                isOpen={isCallPanelOpen}
                onClose={() => setIsCallPanelOpen(false)}
                agentData={isEditMode ? editingAgent : null}
            />

            {/* Create Agent Modal */}
            <CreateAgentModal
                isOpen={isCreateAgentModalOpen}
                onClose={() => setIsCreateAgentModalOpen(false)}
                onSubmit={handleCreateAgent}
            />
        </Layout>
    );
};

const CreateAssistantPage = () => {
    return (
        <Suspense fallback={
            <Layout title="Create Assistant">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Loading...</p>
                    </div>
                </div>
            </Layout>
        }>
            <CreateAssistantPageContent />
        </Suspense>
    );
};

export default CreateAssistantPage;
