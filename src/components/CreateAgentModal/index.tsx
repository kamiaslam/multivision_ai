import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import Checkbox from "@/components/Checkbox";
import { agentAPI } from "@/services/api";
import { toast } from "sonner";
import { modelOptions, groupedModels } from "@/lib/modelConfig";
import { allVoices, getVoicesByProvider, getCategoriesByProvider, fetchHumeVoices, getVoicesByProviderAsync } from "@/lib/voiceConfig";
import { SelectOption } from "@/types/select";
import { AgentType } from "@/types/agent";
import { ToolSelector } from "@/components/ui/tool-selector";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: any) => void;
  editAgent?: any; // Agent data for editing
  onUpdate?: (agentData: any) => void; // Callback for updates
}

export function CreateAgentModal({ isOpen, onClose, onSubmit, editAgent, onUpdate }: CreateAgentModalProps) {
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    voice_provider: "",
    voice_category: "",
    voice_id: "",
    model_provider: "",
    model_resource: "",
    instructions: "",
    tool_ids: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editAgent && isOpen) {
      setIsEditMode(true);
      setSelectedAgentType(editAgent.agent_type || editAgent.type || null);
      setFormData({
        name: editAgent.name || "",
        description: editAgent.description || "",
        voice_provider: editAgent.voice_provider === "hume" ? "voicecake" : editAgent.voice_provider || "", // Map hume back to voicecake for form
        voice_category: "", // Will be set based on voice_id lookup
        voice_id: editAgent.voice_id || "",
        model_provider: editAgent.model_provider || "",
        model_resource: editAgent.model_resource || "",
        instructions: editAgent.custom_instructions || "",
        tool_ids: editAgent.tool_ids || []
      });
      
      // Set voice category based on voice_id lookup
      if (editAgent.voice_provider && editAgent.voice_id) {
        const mappedProvider = editAgent.voice_provider === "hume" ? "voicecake" : editAgent.voice_provider;
        const allVoicesForProvider = getVoicesByProvider(mappedProvider);
        // Try to find by ID first (existing agents), then by name (new agents)
        const foundVoice = allVoicesForProvider.find(voice => voice.id === editAgent.voice_id) ||
                          allVoicesForProvider.find(voice => voice.name === editAgent.voice_id);
        if (foundVoice?.category) {
          setFormData(prev => ({ ...prev, voice_category: foundVoice.category || "" }));
        }
      }
    } else {
      setIsEditMode(false);
    }
  }, [editAgent, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    setIsLoading(true);

    try {
      // Prepare the payload according to the API specification
      console.log('Form data before payload creation:', formData);
      
      // Convert voice_id to voice name if it's still a UUID
      let voiceIdToSend = formData.voice_id;
      if (formData.voice_provider === "voicecake" && formData.voice_id) {
        const allVoicecakeVoices = getVoicesByProvider("voicecake");
        const foundVoice = allVoicecakeVoices.find(voice => voice.id === formData.voice_id);
        if (foundVoice) {
          voiceIdToSend = foundVoice.name;
        }
      }
      
      const agentPayload = {
        name: formData.name,
        voice_provider: formData.voice_provider === "voicecake" ? "hume" : formData.voice_provider, // Map voicecake to hume
        voice_id: voiceIdToSend, // Voice name instead of UUID
        description: formData.description,
        custom_instructions: formData.instructions,
        model_provider: formData.model_provider,
        model_resource: formData.model_resource,
        agent_type: selectedAgentType === 'SPEECH' ? 'SPEECH' : 'TEXT',
        tool_ids: formData.tool_ids
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} agent with payload:`, agentPayload);

      let response;
      if (isEditMode && editAgent) {
        // Update existing agent
        response = await agentAPI.updateAgent(editAgent.id.toString(), agentPayload);
        console.log("Agent updated successfully:", response);
        toast.success("Agent updated successfully!");
        
        // Call the onUpdate callback with the updated agent data
        if (onUpdate) {
          onUpdate(response);
        }
      } else {
        // Create new agent
        response = await agentAPI.createAgent(agentPayload);
        console.log("Agent created successfully:", response);
        toast.success("Agent created successfully!");
        
        // Call the onSubmit callback with the created agent data
        onSubmit(response);
      }
      
      // Close the modal
      onClose();
      
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} agent:`, error);
      
      // Extract error message from different possible sources
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} agent`;
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

  const handleClose = () => {
    // Reset form data when closing
    setSelectedAgentType(null);
    setIsEditMode(false);
    setFormData({
      name: "",
      description: "",
      voice_provider: "",
      voice_category: "",
      voice_id: "",
      model_provider: "",
      model_resource: "",
      instructions: "",
      tool_ids: [] as string[]
    });
    onClose();
  };

  // Reset form when modal is opened for create mode
  useEffect(() => {
    if (isOpen && !editAgent) {
      setSelectedAgentType(null);
      setIsEditMode(false);
      setFormData({
        name: "",
        description: "",
        voice_provider: "",
        voice_category: "",
        voice_id: "",
        model_provider: "",
        model_resource: "",
        instructions: "",
        tool_ids: [] as string[]
      });
    }
  }, [isOpen, editAgent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-s-stroke2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-t-primary">
              {isEditMode ? 'Edit Agent' : 'Create New Agent'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-b-surface2 rounded-lg transition-colors"
            >
              <Icon name="close" className="w-5 h-5 text-t-secondary" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Type Selection */}
            {!selectedAgentType ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-center">Choose Agent Type</h3>
                  <p className="text-t-secondary text-center">Select the type of agent you want to create</p>
                  {isEditMode && (
                    <p className="text-xs text-t-secondary text-center mt-1">
                      Agent type cannot be changed in edit mode
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`cursor-pointer transition-all hover:shadow-md border-2 rounded-3xl p-6 text-center ${
                      selectedAgentType === 'SPEECH' ? 'border-primary-01' : 'border-s-stroke2'
                    } ${isEditMode ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-01/50'}`}
                    onClick={() => !isEditMode && setSelectedAgentType('SPEECH')}
                  >
                    <Icon name="microphone" className="w-12 h-12 mx-auto mb-4 text-primary-01" />
                    <h4 className="font-semibold text-lg mb-2">Speech to Speech</h4>
                    <p className="text-t-secondary text-sm">
                      Full voice conversation with AI. User speaks, AI responds with voice.
                    </p>
                  </div>
                  
                  <div 
                    className={`cursor-pointer transition-all hover:shadow-md border-2 rounded-3xl p-6 text-center ${
                      selectedAgentType === 'TEXT' ? 'border-primary-01' : 'border-s-stroke2'
                    } ${isEditMode ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-01/50'}`}
                    onClick={() => !isEditMode && setSelectedAgentType('TEXT')}
                  >
                    <Icon name="chat" className="w-12 h-12 mx-auto mb-4 text-primary-01" />
                    <h4 className="font-semibold text-lg mb-2">Text to Speech</h4>
                    <p className="text-t-secondary text-sm">
                      Text input, AI responds with voice. Perfect for chatbots with voice output.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Compact Agent Type Display */}
                <div className="flex items-center justify-between p-4 bg-primary-01/5 border border-primary-01/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {selectedAgentType === 'SPEECH' ? (
                      <Icon name="microphone" className="w-6 h-6 text-primary-01" />
                    ) : (
                      <Icon name="chat" className="w-6 h-6 text-primary-01" />
                    )}
                    <div>
                      <span className="font-semibold text-primary-01">
                        {selectedAgentType === 'SPEECH' ? 'Speech to Speech' : 'Text to Speech'} Agent
                      </span>
                      <p className="text-xs text-t-secondary">
                        {selectedAgentType === 'SPEECH' 
                          ? 'Full voice conversation with AI' 
                          : 'Text input, AI responds with voice'
                        }
                      </p>
                    </div>
                  </div>
                  {!isEditMode && (
                    <Button 
                      type="button" 
                      isStroke 
                      onClick={() => setSelectedAgentType(null)}
                      className="h-8 px-3 text-sm"
                    >
                      Change Type
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Basic Info */}
            {selectedAgentType && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  
                  <Field
                    label="Agent Name"
                    placeholder="e.g., Customer Support AI"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  
                  <Field
                    label="Description"
                    placeholder="Describe what this agent does and how it helps users..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    textarea
                    classInput="h-24"
                    maxLength={1500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-t-secondary">
                      {formData.description.length}/1,500 characters
                    </span>
                    {formData.description.length > 1400 && (
                      <span className="text-xs text-orange-500">
                        {1500 - formData.description.length} characters remaining
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Voice Settings - Always shown */}
            {selectedAgentType && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Voice & Personality</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TTS Provider</label>
                    <Select 
                      value={(() => {
                        const providerOptions = [
                          { id: 1, name: "voicecake" },
                          { id: 2, name: "cartesia" },
                        ];
                        return providerOptions.find(option => option.name === formData.voice_provider) || null;
                      })()}
                      onChange={(value) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          voice_provider: value.name,
                          voice_category: "", // Reset voice_category when provider changes
                          voice_id: "" // Reset voice_id when provider changes
                        }));
                      }}
                      options={[
                        { id: 1, name: "voicecake" },
                        { id: 2, name: "cartesia" },
                      ]}
                      placeholder="Select a TTS provider"
                    />
                  </div>

                  {/* Voice Selection - Only for Speech-To-Speech */}
                  {formData.voice_provider && (
                    <div className="space-y-4">
                      {/* Voice Category Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Voice Category</label>
                        <Select
                          value={(() => {
                            const categories = getCategoriesByProvider(formData.voice_provider);
                            const selectedCategory = categories.find(cat => cat === formData.voice_category);
                            return selectedCategory ? { id: categories.indexOf(selectedCategory) + 1, name: selectedCategory } : null;
                          })()}
                          onChange={(value) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              voice_category: value.name,
                              voice_id: "" // Reset voice when category changes
                            }));
                          }}
                          options={getCategoriesByProvider(formData.voice_provider).map((category, index) => ({
                            id: index + 1,
                            name: category
                          }))}
                          placeholder="Select voice category"
                        />
                      </div>

                      {/* Voice Selection based on Category */}
                      {formData.voice_category && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Voice</label>
                          <Select
                            value={(() => {
                              const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                .filter(voice => voice.category === formData.voice_category);
                              // Try to find by ID first (existing agents), then by name (new agents)
                              const selectedVoice = voicesInCategory.find(voice => voice.id === formData.voice_id) ||
                                                   voicesInCategory.find(voice => voice.name === formData.voice_id);
                              return selectedVoice ? { id: voicesInCategory.indexOf(selectedVoice) + 1, name: selectedVoice.name } : null;
                            })()}
                            onChange={(value) => {
                              const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                .filter(voice => voice.category === formData.voice_category);
                              const selectedVoice = voicesInCategory[value.id - 1];
                              setFormData(prev => ({ 
                                ...prev, 
                                voice_id: selectedVoice.name // Store voice name instead of ID
                              }));
                            }}
                            options={getVoicesByProvider(formData.voice_provider)
                              .filter(voice => voice.category === formData.voice_category)
                              .map((voice, index) => ({
                                id: index + 1,
                                name: voice.name
                              }))}
                            placeholder="Select a voice"
                          />
                        </div>
                      )}

                      {/* Voice Info Display */}
                      {formData.voice_id && (
                        <div className="text-xs text-t-secondary bg-b-surface2 p-2 rounded-lg">
                          <div className="font-medium">Selected Voice: {(() => {
                            const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                              .filter(voice => voice.category === formData.voice_category);
                            // Try to find by ID first (existing agents), then by name (new agents)
                            const selectedVoice = voicesInCategory.find(voice => voice.id === formData.voice_id) ||
                                                 voicesInCategory.find(voice => voice.name === formData.voice_id);
                            return selectedVoice?.name || formData.voice_id;
                          })()}</div>
                          <div className="text-xs opacity-75">
                            {(() => {
                              const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                .filter(voice => voice.category === formData.voice_category);
                              // Try to find by ID first (existing agents), then by name (new agents)
                              const selectedVoice = voicesInCategory.find(voice => voice.id === formData.voice_id) ||
                                                   voicesInCategory.find(voice => voice.name === formData.voice_id);
                              return selectedVoice?.description || "No description available";
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Model - Only for Speech-To-Speech */}
                {selectedAgentType === 'SPEECH' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Model</label>
                    <Select 
                      value={(() => {
                        const providerOptions = [
                          { id: 1, name: "VOICECAKE" },
                          { id: 2, name: "OPEN_AI" },
                          { id: 3, name: "ANTHROPIC" },
                          { id: 4, name: "GOOGLE" },
                          { id: 5, name: "GROQ" },
                          { id: 6, name: "SAMBANOVA" },
                          { id: 7, name: "CEREBRAS" },
                          { id: 8, name: "AMAZON_BEDROCK" },
                          { id: 9, name: "FIREWORKS" }
                        ];
                        return providerOptions.find(option => option.name === formData.model_provider) || null;
                      })()}
                      onChange={(value) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          model_provider: value.name,
                          model_resource: "" // Reset model when provider changes
                        }));
                      }}
                      options={[
                        { id: 1, name: "VOICECAKE" },
                        { id: 2, name: "OPEN_AI" },
                        { id: 3, name: "ANTHROPIC" },
                        { id: 4, name: "GOOGLE" },
                        { id: 5, name: "GROQ" },
                        { id: 6, name: "SAMBANOVA" },
                        { id: 7, name: "CEREBRAS" },
                        { id: 8, name: "AMAZON_BEDROCK" },
                        { id: 9, name: "FIREWORKS" }
                      ]}
                      placeholder="Select AI Model Provider"
                    />
                    
                    {/* Provider Description */}
                    {formData.model_provider && (
                      <div className="text-xs text-t-secondary bg-b-surface2 p-2 rounded-lg">
                        {(() => {
                          const modelCount = modelOptions.filter(model => model.provider === formData.model_provider).length;
                          const providerName = formData.model_provider.replace('_', ' ');
                          return `${providerName}: ${modelCount} model${modelCount !== 1 ? 's' : ''} available`;
                        })()}
                      </div>
                    )}

                    {/* Model Selection based on Provider */}
                    {formData.model_provider && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Model</label>
                        <Select 
                          value={(() => {
                            const modelsForProvider = modelOptions.filter(model => model.provider === formData.model_provider);
                            const selectedModel = modelsForProvider.find(model => model.simpleName === formData.model_resource);
                            return selectedModel ? { id: modelsForProvider.indexOf(selectedModel) + 1, name: selectedModel.simpleName } : null;
                          })()}
                          onChange={(value) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              model_resource: value.name 
                            }));
                          }}
                          options={(() => {
                            const modelsForProvider = modelOptions.filter(model => model.provider === formData.model_provider);
                            return modelsForProvider.map((model, index) => ({
                              id: index + 1,
                              name: model.simpleName
                            }));
                          })()}
                          placeholder="Select a model"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Instructions - Always shown when agent type is selected */}
            {selectedAgentType && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Instructions</h3>
                <Field
                  label={
                    selectedAgentType === 'SPEECH' ? 'Custom Instructions' : 'Agent Instructions'
                  }
                  placeholder={
                    selectedAgentType === 'SPEECH' 
                      ? `You are a helpful AI assistant. Provide detailed instructions for how you should behave, respond, and interact with users.

Examples:
• Your personality and communication style
• Specific topics you're knowledgeable about
• How to handle different types of questions
• Any specific behaviors or responses to avoid
• Context about your role or purpose

Be as detailed as possible to ensure consistent and helpful responses.`
                      : `Provide detailed instructions for how the agent should respond to text inputs.

Examples:
• Response style and tone
• Specific topics or domains of expertise
• How to handle different types of requests
• Any limitations or guidelines
• Context about the agent's purpose

Be specific to ensure the agent provides helpful and consistent responses.`
                  }
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  textarea
                  classInput="min-h-[200px]"
                  required={selectedAgentType === 'TEXT'}
                />
                <p className="text-xs text-t-secondary">
                  💡 Tip: The more detailed your instructions, the better the agent will perform. Include personality traits, response style, and specific guidelines.
                </p>
              </div>
            )}

            {/* Tools Selection - Always shown when agent type is selected */}
            {selectedAgentType && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tools & Capabilities</h3>
                <ToolSelector
                  value={formData.tool_ids}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tool_ids: value }))}
                  placeholder="Select tools for this agent..."
                />
                <p className="text-xs text-t-secondary">
                  💡 Tip: Select tools that your agent can use to perform specific tasks. Tools will be available to the agent during conversations.
                </p>
              </div>
            )}

            {/* Actions - Only show when agent type is selected */}
            {selectedAgentType && (
              <div className="flex gap-3 pt-4 border-t border-s-stroke2">
                <Button 
                  type="button" 
                  isStroke 
                  onClick={handleClose} 
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                      {isEditMode ? 'Updating Agent...' : 'Creating Agent...'}
                    </>
                  ) : (
                    <>
                      <Icon name="plus" className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Update Agent' : 'Create Agent'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
}

