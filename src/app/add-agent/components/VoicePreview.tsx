import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { voicePreviewAPI } from "@/services/api";

interface VoicePreviewProps {
  provider: string;
  voiceId: string;
  voiceName: string;
  isVisible: boolean;
}

interface VoicePreviewResponse {
  success: boolean;
  voice_id: string;
  text: string;
  audio_data_url: string;
  file_size_bytes: number;
  duration_ms: number | null;
}

export const VoicePreview = ({
  provider,
  voiceId,
  voiceName,
  isVisible
}: VoicePreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const generatePreview = async () => {
    if (!voiceId || !provider) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const apiProvider = getApiProvider(provider);
      const data = await voicePreviewAPI.generatePreview(apiProvider, voiceId);

      if (data.audio_data_url) {
        setAudioUrl(data.audio_data_url);
      } else {
        throw new Error('Failed to generate voice preview');
      }
    } catch (err) {
      console.error('Error generating voice preview:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setError('Failed to play audio');
        setIsPlaying(false);
      };
    }
  };

  // Auto-generate preview when voice is selected
  useEffect(() => {
    if (isVisible && voiceId && provider && !isLoading) {
      generatePreview();
    }
  }, [isVisible, voiceId, provider]);

  if (!isVisible || !voiceId) {
    return null;
  }

  return (
    <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-t-primary">Voice Preview</h4>
          <p className="text-sm text-t-secondary">
            Preview: <span className="font-medium">{voiceName}</span>
          </p>
        </div>
        {audioUrl && (
          <Button
            onClick={handlePlayPause}
            className="h-8 px-3 text-sm"
            isStroke
          >
            <Icon 
              name={isPlaying ? "pause" : "play"} 
              className="w-4 h-4 mr-2" 
            />
            {isPlaying ? "Pause" : "Play"}
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="alert-circle" className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {audioUrl && !error && (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Icon name="check-circle" className="w-4 h-4 text-green-500" />
          <div className="flex-1">
            <p className="text-sm text-green-700">
              Voice preview ready! Click play to hear the sample.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon name="loader" className="w-4 h-4 text-blue-500 animate-spin" />
          <p className="text-sm text-blue-700">
            Generating voice preview...
          </p>
        </div>
      )}
    </div>
  );
};
