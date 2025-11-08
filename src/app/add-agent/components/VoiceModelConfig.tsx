import { AgentType } from "@/types/agent";
import Select from "@/components/Select";
import SearchableSelect from "@/components/SearchableSelect";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { VoicePreview } from "./VoicePreview";
import { modelOptions } from "@/lib/modelConfig";
import { useState, useRef, useEffect } from "react";
import { humeAPI } from "@/services/api";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { voicePreviewAPI } from "@/services/api";

interface FormData {
  voice_provider: string;
  voice_category: string;
  voice_id: string;
  model_provider: string;
  model_resource: string;
  language?: string;
}

interface VoiceModelConfigProps {
  selectedAgentType: AgentType | null;
  formData: FormData;
  voiceLoading?: { [key: string]: boolean };
  voiceError?: { [key: string]: string | null };
  getVoicesByProvider: (provider: string) => any[];
  getCategoriesByProvider: (provider: string) => string[];
  getVoiceById: (id: string, provider: string) => any;
  onFormDataChange: (updates: Partial<FormData>) => void;
  refreshClonedVoices?: () => Promise<void>;
}

type VoiceOption = {
  id: string | number;
  name: string;
  isCloned?: boolean;
};

type VoiceSelectWithPreviewProps = {
  value: VoiceOption | null;
  onChange: (value: VoiceOption) => void;
  options: VoiceOption[];
  provider: string;
  placeholder?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
};

const VoiceSelectWithPreview = ({
  value = null,
  onChange,
  options,
  provider,
  placeholder = "Select a voice",
  searchPlaceholder = "Search voices by name...",
  maxHeight = "200px",
}: VoiceSelectWithPreviewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewLoading, setPreviewLoading] = useState<{ [key: string]: boolean }>({});
  const [previewAudio, setPreviewAudio] = useState<{ [key: string]: string }>({});
  const [previewError, setPreviewError] = useState<{ [key: string]: string }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = searchTerm.trim()
    ? options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleOptionSelect = (option: VoiceOption) => {
    onChange(option);
    setSearchTerm("");
  };

  // Map provider names to API format
  const getApiProvider = (provider: string): string => {
    switch (provider) {
      case 'voicecake':
        return 'hume_ai';
      case 'cartesia':
        return 'cartesia';
      default:
        return 'hume_ai';
    }
  };

  const generatePreview = async (voiceId: string) => {
    if (!voiceId || !provider) return;

    setPreviewLoading(prev => ({ ...prev, [voiceId]: true }));
    setPreviewError(prev => ({ ...prev, [voiceId]: '' }));

    try {
      const apiProvider = getApiProvider(provider);
      const data = await voicePreviewAPI.generatePreview(apiProvider, voiceId);

      if (data.audio_data_url) {
        setPreviewAudio(prev => ({ ...prev, [voiceId]: data.audio_data_url }));
      } else {
        throw new Error('Failed to generate voice preview');
      }
    } catch (err) {
      console.error('Error generating voice preview:', err);
      setPreviewError(prev => ({ 
        ...prev, 
        [voiceId]: err instanceof Error ? err.message : 'Failed to generate preview' 
      }));
    } finally {
      setPreviewLoading(prev => ({ ...prev, [voiceId]: false }));
    }
  };

  const handlePlayPreview = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent option selection
    
    const audioUrl = previewAudio[voiceId];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handlePreviewClick = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent option selection
    
    if (!previewAudio[voiceId] && !previewLoading[voiceId]) {
      generatePreview(voiceId);
    }
  };

  // Clear search term when component unmounts or when selection changes
  useEffect(() => {
    return () => {
      setSearchTerm("");
    };
  }, [value]);

  return (
    <Listbox
      value={value}
      onChange={handleOptionSelect}
      as="div"
    >
      <ListboxButton className="group flex justify-between items-center w-full h-12 pl-4.5 pr-3 border border-s-stroke2 rounded-3xl text-body-2 text-t-primary fill-t-secondary transition-all data-[hover]:border-s-highlight data-[hover]:text-t-primary data-[open]:text-t-primary data-[open]:rounded-b-none data-[open]:border-s-subtle data-[open]:border-b-transparent">
        {value?.name ? (
          <div className="truncate">{value.name}</div>
        ) : (
          <div className="truncate text-t-secondary/50">
            {placeholder}
          </div>
        )}
        <Icon
          className="shrink-0 ml-2 fill-inherit transition-transform group-[[data-open]]:rotate-180"
          name="chevron"
        />
      </ListboxButton>
      <ListboxOptions
        className="z-100 [--anchor-gap:-2px] w-[var(--button-width)] px-2.25 pb-2.25 bg-b-surface2 border border-t-0 border-s-subtle shadow-depth rounded-b-[1.25rem] origin-top transition duration-200 ease-out outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        anchor="bottom"
        transition
      >
        <div className="sticky top-0 pt-2 pb-2 border-b border-s-subtle mb-2">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => {
                setTimeout(() => {
                  e.target.focus();
                }, 100);
              }}
              className="w-full pl-8 pr-3 py-2 text-sm bg-b-depth2 border border-s-stroke2 rounded-lg text-t-primary placeholder-t-secondary/50 focus:outline-none focus:border-s-highlight transition-colors"
            />
            <Icon
              name="search"
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 fill-t-secondary/50"
            />
          </div>
        </div>
        <div 
          className="overflow-y-auto"
          style={{ maxHeight }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <ListboxOption
                className="relative pl-2.25 py-2 pr-5.5 rounded-lg text-body-2 text-t-secondary cursor-pointer transition-colors after:absolute after:top-1/2 after:right-2.5 after:size-2 after:-translate-y-1/2 after:rounded-full after:bg-t-blue after:opacity-0 after:transition-opacity data-[focus]:text-t-primary data-[selected]:bg-shade-08/50 data-[selected]:text-t-primary data-[selected]:after:opacity-100 dark:data-[selected]:bg-shade-06/10"
                key={option.id}
                value={option}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{option.name}</span>
                    {option.isCloned && (
                      <span className="px-1.5 py-0.5 bg-primary-01/10 text-primary-01 text-xs rounded-full">
                        Cloned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {previewLoading[option.id] ? (
                      <Icon name="loader" className="text-blue-500 animate-spin" />
                    ) : previewError[option.id] ? (
                      <button
                        className="p-1 hover:bg-b-highlight rounded transition-colors"
                      >
                        <Icon name="warning_circle" className="w-4 h-4 text-red-500" />
                      </button>
                    ) : previewAudio[option.id] ? (
                      <button
                        onClick={(e) => handlePlayPreview(String(option.id), e)}
                        className="p-1 hover:bg-b-highlight rounded transition-colors"
                        title="Play preview"
                      >
                        <Icon name="play" className="w-4 h-4 text-green-500" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handlePreviewClick(String(option.id), e)}
                        className="p-1 hover:bg-b-highlight rounded transition-colors"
                        title="Generate preview"
                      >
                        <Icon name="download" className="w-4 h-4 text-t-secondary hover:text-t-primary" />
                      </button>
                    )}
                  </div>
                </div>
              </ListboxOption>
            ))
          ) : (
            <div className="px-2.25 py-4 text-center text-sm text-t-secondary/50">
              {searchTerm ? `No results found for "${searchTerm}"` : "No options available"}
            </div>
          )}
        </div>
        {filteredOptions.length > 0 && (
          <div className="px-2.25 pt-2 border-t border-s-subtle text-xs text-t-secondary/50 text-center">
            Showing {filteredOptions.length} of {options.length} options
          </div>
        )}
      </ListboxOptions>
    </Listbox>
  );
};

export const VoiceModelConfig = ({
  selectedAgentType,
  formData,
  voiceLoading,
  voiceError,
  getVoicesByProvider,
  getCategoriesByProvider,
  getVoiceById,
  onFormDataChange,
  refreshClonedVoices
}: VoiceModelConfigProps) => {
  // State for dynamic Hume models
  const [humeModels, setHumeModels] = useState<any[]>([]);
  const [humeProviders, setHumeProviders] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  
  // State for languages and language-filtered voices
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [languageFilteredVoices, setLanguageFilteredVoices] = useState<any[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);

  // Fetch Hume models on mount
  useEffect(() => {
    const fetchHumeModels = async () => {
      setIsLoadingModels(true);
      setModelsError(null);
      try {
        const models = await humeAPI.getModels();
        console.log('Fetched Hume models:', models);
        setHumeModels(models);
        
        // Extract unique providers
        const uniqueProviders = [...new Set(models.map((m: any) => m.model_provider))];
        setHumeProviders(uniqueProviders);
        console.log('Unique providers:', uniqueProviders);
      } catch (error: any) {
        console.error('Error fetching Hume models:', error);
        setModelsError(error.message || 'Failed to fetch models');
      } finally {
        setIsLoadingModels(false);
      }
    };

    if (selectedAgentType === 'SPEECH') {
      fetchHumeModels();
    }
  }, [selectedAgentType]);

  // Fetch languages on component mount for Speech-to-Speech
  useEffect(() => {
    if (selectedAgentType === 'SPEECH') {
      const fetchLanguages = async () => {
        setIsLoadingLanguages(true);
        try {
          const languages = await humeAPI.getLanguages();
          setAvailableLanguages(languages);
          
          // Auto-select first language if not already selected (only in create mode)
          if (languages.length > 0 && !formData.voice_category && !formData.voice_id) {
            console.log('Auto-selecting first language:', languages[0]);
            onFormDataChange({
              voice_category: languages[0],
              language: languages[0],
              voice_id: "" // Clear voice selection when language changes
            });
          } else if (formData.voice_id) {
            console.log('Edit mode detected - keeping existing language and voice:', {
              language: formData.voice_category,
              voiceId: formData.voice_id
            });
          }
        } catch (error) {
          console.error('Error fetching languages:', error);
        } finally {
          setIsLoadingLanguages(false);
        }
      };

      fetchLanguages();
    }
  }, [selectedAgentType]);

  // Fetch voices when language is selected
  useEffect(() => {
    if (selectedAgentType === 'SPEECH' && formData.voice_category) {
      const fetchVoicesByLanguage = async () => {
        setIsLoadingVoices(true);
        try {
          const voices = await humeAPI.getVoicesByLanguage(formData.voice_category);
          setLanguageFilteredVoices(voices);
        } catch (error) {
          console.error('Error fetching voices for language:', error);
          setLanguageFilteredVoices([]);
        } finally {
          setIsLoadingVoices(false);
        }
      };

      fetchVoicesByLanguage();
    } else {
      setLanguageFilteredVoices([]);
    }
  }, [selectedAgentType, formData.voice_category]);

  if (!selectedAgentType) {
    return (
      <div className="text-center py-8 text-t-secondary">
        Please select an agent type first to configure voice and model settings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voice Provider Selection - Only show for TEXT agents */}
      {selectedAgentType === 'TEXT' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">TTS Provider</label>
          <Select
            value={(() => {
              const providerOptions = [
                { id: 1, name: "empth", code: "voicecake" },
                { id: 2, name: "conversa", code: "cartesia" },
                { id: 3, name: "hamsa", code: "hamsa" }
              ];
              return providerOptions.find(option => option.code === formData.voice_provider) || null;
            })()}
            onChange={(value) => {
              onFormDataChange({
                voice_provider: value.code || value.name,
                voice_category: "",
                voice_id: ""
              });
            }}
            options={[
              { id: 1, name: "empth", code: "voicecake" },
              { id: 2, name: "conversa", code: "cartesia" },
              { id: 3, name: "hamsa", code: "hamsa" }
            ]}
            placeholder="Select a TTS provider"
          />
        </div>
      )}

      {/* Auto-set voice provider for SPEECH agents */}
      {selectedAgentType === 'SPEECH' && (
        <div className="p-4 bg-primary-01/5 border border-primary-01/20 rounded-3xl">
          <div className="flex items-center gap-3">
            <Icon name="microphone" className="w-5 h-5 text-primary-01" />
            <div>
              <span className="font-semibold text-primary-01">Hume EVI Speech-to-Speech</span>
              <p className="text-xs text-t-secondary">Using Hume's advanced voice AI for natural conversations</p>
            </div>
          </div>
        </div>
      )}

          {/* Voice Selection */}
          {(formData.voice_provider || selectedAgentType === 'SPEECH') && (
            <div className="space-y-4">
              {/* Hamsa Loading/Error State */}
              {formData.voice_provider === 'hamsa' && voiceLoading?.hamsa && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Loading Hamsa voices...
                </div>
              )}
              {formData.voice_provider === 'hamsa' && voiceError?.hamsa && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  Error loading Hamsa voices: {voiceError.hamsa}
                </div>
              )}
              
              {/* Cloned Voices Loading/Error State */}
              {voiceLoading?.cloned && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Loading cloned voices...
                </div>
              )}
              {voiceError?.cloned && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  Error loading cloned voices: {voiceError.cloned}
                </div>
              )}
              
              {/* Refresh Cloned Voices Button */}
              {/* {refreshClonedVoices && (
                <div className="flex justify-end">
                  <Button
                    onClick={refreshClonedVoices}
                    isStroke
                    className="text-sm"
                    disabled={voiceLoading?.cloned}
                  >
                    <Icon name="refresh" className="w-4 h-4 mr-2" />
                    Refresh Cloned Voices
                  </Button>
                </div>
              )} */}
          
          {/* Language Selection for SPEECH, Category for TEXT */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {selectedAgentType === 'SPEECH' ? 'Language' : 'Voice Category'}
            </label>
            <Select
              value={(() => {
                if (selectedAgentType === 'SPEECH') {
                  // For SPEECH: use language from availableLanguages
                  const selectedIndex = availableLanguages.findIndex(lang => lang === formData.voice_category);
                  return selectedIndex >= 0 
                    ? { id: selectedIndex + 1, name: availableLanguages[selectedIndex] } 
                    : null;
                } else {
                  // For TEXT: use category
                  const categories = getCategoriesByProvider(formData.voice_provider);
                  const selectedCategory = categories.find(cat => cat === formData.voice_category);
                  return selectedCategory ? { id: categories.indexOf(selectedCategory) + 1, name: selectedCategory } : null;
                }
              })()}
              onChange={(value) => {
                onFormDataChange({
                  voice_category: value.name,
                  language: selectedAgentType === 'SPEECH' ? value.name : undefined,
                  voice_id: ""
                });
              }}
              options={
                selectedAgentType === 'SPEECH'
                  ? availableLanguages.map((lang, index) => ({
                      id: index + 1,
                      name: lang
                    }))
                  : getCategoriesByProvider(formData.voice_provider).map((category, index) => ({
                      id: index + 1,
                      name: category
                    }))
              }
              placeholder={
                selectedAgentType === 'SPEECH'
                  ? (isLoadingLanguages ? "Loading languages..." : "Select a language")
                  : (voiceLoading?.hamsa && formData.voice_provider === 'hamsa' ? "Loading Hamsa voices..." : "Select voice category")
              }
            />
          </div>

          {/* Voice Selection - Merged List */}
          {formData.voice_category && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Voice</label>
                {(() => {
                  // For SPEECH, check if any languageFilteredVoices are cloned
                  // For TEXT, use getVoicesByProvider
                  const allVoices = selectedAgentType === 'SPEECH' 
                    ? languageFilteredVoices 
                    : getVoicesByProvider(formData.voice_provider);
                  const clonedVoices = allVoices.filter((voice: any) => voice.isCloned);
                  
                  if (clonedVoices.length > 0) {
                    return (
                      <span className="px-2 py-1 bg-primary-01/10 text-primary-01 text-xs rounded-full">
                        {clonedVoices.length} cloned
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <VoiceSelectWithPreview
                value={(() => {
                  const allVoices = selectedAgentType === 'SPEECH' 
                    ? languageFilteredVoices 
                    : getVoicesByProvider(formData.voice_provider);
                  const selectedVoice = allVoices.find((voice: any) => voice.id === formData.voice_id);
                  return selectedVoice ? { id: selectedVoice.id, name: selectedVoice.name } : null;
                })()}
                onChange={(value) => {
                  onFormDataChange({
                    voice_id: String(value.id)
                  });
                }}
                options={(() => {
                  // For SPEECH: use languageFilteredVoices from API
                  // For TEXT: use getVoicesByProvider (category-based)
                  const allVoices = selectedAgentType === 'SPEECH' 
                    ? languageFilteredVoices 
                    : getVoicesByProvider(formData.voice_provider);
                  
                  // Merge voices: show language/category voices + all cloned voices
                  let categoryVoices, clonedVoices;
                  
                  if (selectedAgentType === 'SPEECH') {
                    // For SPEECH: API already filtered by language, show all
                    categoryVoices = allVoices.filter((voice: any) => !voice.isCloned);
                    clonedVoices = allVoices.filter((voice: any) => voice.isCloned);
                  } else {
                    // For TEXT: filter by category
                    categoryVoices = allVoices.filter((voice: any) => 
                      voice.category === formData.voice_category && !voice.isCloned
                    );
                    clonedVoices = allVoices.filter((voice: any) => voice.isCloned);
                  }
                  
                  // Combine and sort: cloned voices first, then category/language voices
                  const mergedVoices = [...clonedVoices, ...categoryVoices];
                  
                  console.log('VoiceModelConfig - Agent Type:', selectedAgentType);
                  console.log('VoiceModelConfig - All Voices:', allVoices.length);
                  console.log('VoiceModelConfig - Category/Language voices:', categoryVoices.length);
                  console.log('VoiceModelConfig - Cloned voices:', clonedVoices.length);
                  console.log('VoiceModelConfig - Merged voices:', mergedVoices.length);
                  
                  return mergedVoices.map(voice => ({
                    id: voice.id,
                    name: voice.name,
                    isCloned: voice.isCloned
                  }));
                })()}
                provider={selectedAgentType === 'SPEECH' ? 'voicecake' : formData.voice_provider}
                placeholder={
                  selectedAgentType === 'SPEECH' && isLoadingVoices 
                    ? "Loading voices..." 
                    : "Select a voice"
                }
                searchPlaceholder="Search voices..."
                maxHeight="200px"
              />
            </div>
          )}

          {/* Voice Info Display */}
          {formData.voice_id && (
            <div className="text-xs text-t-secondary bg-b-surface2 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">Selected Voice: {(() => {
                  const provider = selectedAgentType === 'SPEECH' ? 'voicecake' : formData.voice_provider;
                  const allVoices = getVoicesByProvider(provider);
                  const selectedVoice = allVoices.find(voice => voice.id === formData.voice_id);
                  return selectedVoice?.name || formData.voice_id;
                })()}</span>
                {(() => {
                  const provider = selectedAgentType === 'SPEECH' ? 'voicecake' : formData.voice_provider;
                  const allVoices = getVoicesByProvider(provider);
                  const selectedVoice = allVoices.find(voice => voice.id === formData.voice_id);
                  return selectedVoice?.isCloned ? (
                    <span className="px-2 py-1 bg-primary-01/10 text-primary-01 text-xs rounded-full">
                      Cloned
                    </span>
                  ) : null;
                })()}
              </div>
              <div className="text-xs opacity-75">
                {(() => {
                  const provider = selectedAgentType === 'SPEECH' ? 'voicecake' : formData.voice_provider;
                  const allVoices = getVoicesByProvider(provider);
                  const selectedVoice = allVoices.find(voice => voice.id === formData.voice_id);
                  return selectedVoice?.description || "No description available";
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Model - Only for Speech-To-Speech */}
      {selectedAgentType === 'SPEECH' && (
        <div className="space-y-4">
          {/* Error state only */}
          {modelsError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              Error loading models: {modelsError}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Model Provider</label>
            <Select
              value={(() => {
                const providerOptions = humeProviders.map((provider, index) => ({
                  id: index + 1,
                  name: provider
                }));
                return providerOptions.find(option => option.name === formData.model_provider) || null;
              })()}
              onChange={(value) => {
                onFormDataChange({
                  model_provider: value.name,
                  model_resource: ""
                });
              }}
              options={humeProviders.map((provider, index) => ({
                id: index + 1,
                name: provider
              }))}
              placeholder="Select AI Model Provider"
            />
          </div>

          {/* Model Selection based on Provider */}
          {formData.model_provider && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select
                value={(() => {
                  // Filter models by selected provider from Hume API data
                  const modelsForProvider = humeModels.filter(
                    model => model.model_provider === formData.model_provider
                  );
                  
                  // Get unique model_resource values
                  const uniqueModels = Array.from(
                    new Set(modelsForProvider.map(m => m.model_resource))
                  );
                  
                  const selectedIndex = uniqueModels.findIndex(
                    model => model === formData.model_resource
                  );
                  
                  return selectedIndex >= 0 
                    ? { id: selectedIndex + 1, name: uniqueModels[selectedIndex] } 
                    : null;
                })()}
                onChange={(value) => {
                  onFormDataChange({
                    model_resource: value.name
                  });
                }}
                options={(() => {
                  // Filter models by selected provider
                  const modelsForProvider = humeModels.filter(
                    model => model.model_provider === formData.model_provider
                  );
                  
                  // Get unique model_resource values
                  const uniqueModels = Array.from(
                    new Set(modelsForProvider.map(m => m.model_resource))
                  );
                  
                  console.log('Models for provider', formData.model_provider, ':', uniqueModels);
                  
                  return uniqueModels.map((model, index) => ({
                    id: index + 1,
                    name: model
                  }));
                })()}
                placeholder="Select a model"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
