import { useState, useEffect } from "react";
import Select from "@/components/Select";
import { voiceCloneAPI } from "@/services/api";
import { VoiceCloneResponse } from "@/types/voice";
import { SelectOption } from "@/types/select";

interface VoiceSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  provider: string;
  placeholder?: string;
}

export function VoiceSelector({ value, onValueChange, provider, placeholder }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<VoiceCloneResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const voiceClones = await voiceCloneAPI.getVoiceClones();
        
        console.log("Fetched voice clones:", voiceClones);
        console.log("Provider filter:", provider);
        
        // Use all available voices (provider filtering not available in current data structure)
        const filteredVoices = voiceClones;
        
        console.log("Filtered voices:", filteredVoices);
        setVoices(filteredVoices);
      } catch (err: any) {
        console.error("Error fetching voice clones:", err);
        setError(err.message || "Failed to fetch voices");
        setVoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [provider]);

  const handleVoiceChange = (selectedOption: SelectOption) => {
    // Find the corresponding voice clone and get its provider_voice_id
    const selectedVoice = voices.find(voice => voice.id === selectedOption.id);
    if (selectedVoice) {
      onValueChange(selectedVoice.provider_voice_id);
    }
  };

  // Map VoiceCloneResponse to SelectOption for the Select component
  const voiceOptions: SelectOption[] = voices.map(voice => ({
    id: voice.id,
    name: voice.name
  }));

  const currentValue = voiceOptions.find(option => {
    const voice = voices.find(v => v.id === option.id);
    return voice && voice.provider_voice_id === value;
  }) || null;

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <div className="h-12 px-4.5 border border-s-stroke2 rounded-3xl flex items-center">
          <span className="text-t-secondary">Loading voices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <div className="h-12 px-4.5 border border-red-200 rounded-3xl flex items-center">
          <span className="text-red-500 text-sm">Error loading voices</span>
        </div>
      </div>
    );
  }

  if (voices.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <div className="h-12 px-4.5 border border-s-stroke2 rounded-3xl flex items-center">
          <span className="text-t-secondary text-sm">
            {provider ? `No voices available for ${provider}` : "No voices available"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        label="Voice"
        value={currentValue}
        onChange={handleVoiceChange}
        options={voiceOptions}
        placeholder={placeholder || "Select a voice"}
      />
    </div>
  );
}
