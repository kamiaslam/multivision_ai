import { useState, useCallback } from 'react';
import { VoiceClone, FormData } from '../types';
import { VoiceCloneLanguage } from '@/types/voice';
import { voiceCloneAPI } from '@/services/api';
import { toast } from 'sonner';

export const useVoiceClones = (token: string) => {
  const [voiceClones, setVoiceClones] = useState<VoiceClone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVoiceClones = useCallback(async () => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    try {
      setLoading(true);
      const response = await voiceCloneAPI.getVoiceClones();
      
      // Convert API response to VoiceClone format
      const convertedClones = response.map(apiResponse => ({
        id: apiResponse.id.toString(),
        name: apiResponse.name,
        description: apiResponse.description || "",
        language: apiResponse.language || "en", // Use actual language from API response
        status: "ready" as const,
        created_at: apiResponse.created_at,
        provider_voice_id: apiResponse.provider_voice_id,
        is_active: true,
        total_uses: 0,
        success_rate: 100,
        last_used: null
      }));

      setVoiceClones(convertedClones);
      setError(null);
    } catch (error) {
      setError('Failed to load voice clones');
      console.error('Error loading voice clones:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const saveVoiceClone = useCallback(async (voiceCloneData: FormData, editingVoiceClone: VoiceClone | null) => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingVoiceClone?.id) {
        // Update existing voice clone - only send basic fields due to backend limitation
        const updateData = {
          name: voiceCloneData.name,
          description: voiceCloneData.description,
          language: voiceCloneData.language
        };
        await voiceCloneAPI.updateVoiceClone(editingVoiceClone.id, updateData);
        toast.success('Voice clone updated successfully');
      } else {
        // Create new voice clone
        if (!voiceCloneData.audio_file) {
          throw new Error('Audio file is required');
        }
        await voiceCloneAPI.createVoiceCloneWithAudio({
          name: voiceCloneData.name,
          description: voiceCloneData.description,
          language: voiceCloneData.language as VoiceCloneLanguage
        }, voiceCloneData.audio_file);
        toast.success('Voice clone created successfully');
      }

      await loadVoiceClones();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save voice clone';
      setError(errorMessage);
      console.error('Error saving voice clone:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, loadVoiceClones]);

  const getVoiceClone = useCallback(async (id: string | number): Promise<VoiceClone | null> => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      setLoading(true);
      const response = await voiceCloneAPI.getVoiceClone(id);
      
      // Convert API response to VoiceClone format
      const voiceClone: VoiceClone = {
        id: response.id.toString(),
        name: response.name,
        description: response.description || "",
        language: response.language || "en",
        status: "ready" as const,
        created_at: response.created_at,
        provider_voice_id: response.provider_voice_id,
        is_active: true,
        total_uses: 0,
        success_rate: 100,
        last_used: null
      };

      setError(null);
      return voiceClone;
    } catch (error) {
      setError('Failed to load voice clone');
      console.error('Error loading voice clone:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVoiceClone = useCallback(async (providerId: string | number) => {
    try {
      setLoading(true);
      await voiceCloneAPI.deleteVoiceClone(providerId);
      
      // Remove from local state after successful API call
      setVoiceClones(voiceClones.filter(voiceClone => 
        voiceClone.provider_voice_id !== providerId && voiceClone.id !== providerId
      ));
      toast.success('Voice clone deleted successfully');
    } catch (error) {
      console.error('Error deleting voice clone:', error);
      toast.error('Failed to delete voice clone');
      throw error; // Re-throw so the component can handle it
    } finally {
      setLoading(false);
    }
  }, [voiceClones]);

  return {
    voiceClones,
    loading,
    error,
    setError,
    loadVoiceClones,
    getVoiceClone,
    saveVoiceClone,
    deleteVoiceClone
  };
};
