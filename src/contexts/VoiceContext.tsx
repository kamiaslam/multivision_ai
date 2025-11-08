import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { VoiceOption } from '@/lib/voiceConfig';
import { hamsaAPI, voiceCloneAPI } from '@/services/api';
import { useAuth } from '@/context/authContext';

interface VoiceContextType {
  voices: {
    hume: VoiceOption[];
    cartesia: VoiceOption[];
    hamsa: VoiceOption[];
    elevenlabs: VoiceOption[];
    openai: VoiceOption[];
    cloned: VoiceOption[];
  };
  isLoading: {
    hume: boolean;
    hamsa: boolean;
    cloned: boolean;
  };
  error: {
    hume: string | null;
    hamsa: string | null;
    cloned: string | null;
  };
  refreshHumeVoices: () => Promise<void>;
  refreshHamsaVoices: () => Promise<void>;
  refreshClonedVoices: () => Promise<void>;
  getVoiceById: (id: string, provider?: string) => VoiceOption | undefined;
  getVoicesByProvider: (provider: string) => VoiceOption[];
  getCategoriesByProvider: (provider: string) => string[];
  findHamsaVoiceByName: (name: string) => VoiceOption | undefined;
  findHamsaVoiceById: (id: string) => VoiceOption | undefined;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

interface VoiceProviderProps {
  children: ReactNode;
}

export function VoiceProvider({ children }: VoiceProviderProps) {
  const { isAuthenticated, token } = useAuth();
  const [voices, setVoices] = useState<VoiceContextType['voices']>({
    hume: [],
    cartesia: [],
    hamsa: [],
    elevenlabs: [],
    openai: [],
    cloned: []
  });

  const [isLoading, setIsLoading] = useState({
    hume: false,
    hamsa: false,
    cloned: false
  });

  const [error, setError] = useState({
    hume: null as string | null,
    hamsa: null as string | null,
    cloned: null as string | null
  });

  // Load voices (dynamic Hume + static others)
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const { fetchHumeVoices, cartesiaVoices } = await import('@/lib/voiceConfig');
        
        // Load dynamic Hume voices from API
        const dynamicHumeVoices = await fetchHumeVoices(token || undefined);
        
        setVoices(prev => ({
          ...prev,
          hume: dynamicHumeVoices,
          cartesia: cartesiaVoices,
          // Add placeholder voices for other providers
          elevenlabs: [],
          openai: []
        }));
      } catch (error) {
        console.error('Error loading voices:', error);
        // Fallback to static voices if dynamic loading fails
        const { humeVoices, cartesiaVoices } = await import('@/lib/voiceConfig');
        setVoices(prev => ({
          ...prev,
          hume: humeVoices.slice(0, 10), // Use first 10 static voices as fallback
          cartesia: cartesiaVoices,
          elevenlabs: [],
          openai: []
        }));
      }
    };

    loadVoices();
  }, [token]);

  // Fetch Hume voices
  const refreshHumeVoices = async () => {
    setIsLoading(prev => ({ ...prev, hume: true }));
    setError(prev => ({ ...prev, hume: null }));

    try {
      const { fetchHumeVoices } = await import('@/lib/voiceConfig');
      const dynamicHumeVoices = await fetchHumeVoices(token || undefined);
      
      setVoices(prev => ({
        ...prev,
        hume: dynamicHumeVoices
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch Hume voices';
      setError(prev => ({ ...prev, hume: errorMessage }));
      console.error('Error fetching Hume voices:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, hume: false }));
    }
  };

  // Fetch Hamsa voices
  const refreshHamsaVoices = async () => {
    setIsLoading(prev => ({ ...prev, hamsa: true }));
    setError(prev => ({ ...prev, hamsa: null }));

    try {
      const hamsaVoicesData = await hamsaAPI.getVoices();
      const transformedVoices: VoiceOption[] = hamsaVoicesData.map((voice: any) => ({
        id: voice.id,
        name: voice.name,
        provider: 'hamsa',
        category: voice.category || 'Hamsa',
        description: voice.description,
        language: voice.language
      }));

      setVoices(prev => ({
        ...prev,
        hamsa: transformedVoices
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch Hamsa voices';
      setError(prev => ({ ...prev, hamsa: errorMessage }));
      console.error('Error fetching Hamsa voices:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, hamsa: false }));
    }
  };

  // Fetch cloned voices
  const refreshClonedVoices = async () => {
    // Only fetch cloned voices if user is authenticated
    if (!isAuthenticated || !token) {
      console.log('Skipping cloned voices fetch - user not authenticated');
      return;
    }

    setIsLoading(prev => ({ ...prev, cloned: true }));
    setError(prev => ({ ...prev, cloned: null }));

    try {
      const clonedVoicesData = await voiceCloneAPI.getVoiceClones();
      console.log('Raw cloned voices data:', clonedVoicesData);
      
      const transformedVoices: VoiceOption[] = clonedVoicesData.map((voice: any) => ({
        id: voice.provider_voice_id,
        name: voice.name,
        provider: voice.provider,
        category: 'Cloned Voices',
        description: voice.description,
        language: voice.language,
        isCloned: true,
        isPublic: voice.is_public,
        isFreeClone: voice.is_free_clone,
        createdAt: voice.created_at,
        updatedAt: voice.updated_at
      }));

      console.log('Transformed cloned voices:', transformedVoices);

      setVoices(prev => ({
        ...prev,
        cloned: transformedVoices
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch cloned voices';
      setError(prev => ({ ...prev, cloned: errorMessage }));
      console.error('Error fetching cloned voices:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, cloned: false }));
    }
  };

  // Load Hamsa voices on mount
  useEffect(() => {
    refreshHamsaVoices();
    refreshClonedVoices();
  }, []);

  // Load cloned voices when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshClonedVoices();
    }
  }, [isAuthenticated, token]);

  // Helper functions
  const getVoiceById = (id: string, provider?: string): VoiceOption | undefined => {
    if (provider) {
      return voices[provider as keyof typeof voices]?.find(voice => voice.id === id);
    }
    
    // Search all providers
    for (const providerVoices of Object.values(voices)) {
      const voice = providerVoices.find(v => v.id === id);
      if (voice) return voice;
    }
    return undefined;
  };

  const getVoicesByProvider = (provider: string): VoiceOption[] => {
    if (provider === 'voicecake') {
      return voices.hume; // VoiceCake uses Hume voices
    }
    
    // For providers that support cloned voices, merge with cloned voices
    const baseVoices = voices[provider as keyof typeof voices] || [];
    const clonedVoicesForProvider = voices.cloned.filter(voice => voice.provider === provider);
    
    return [...baseVoices, ...clonedVoicesForProvider];
  };

  const getCategoriesByProvider = (provider: string): string[] => {
    const providerVoices = getVoicesByProvider(provider);
    const categories = providerVoices
      .map(voice => voice.category)
      .filter((category): category is string => category !== undefined);
    return [...new Set(categories)];
  };

  const findHamsaVoiceByName = (name: string): VoiceOption | undefined => {
    return voices.hamsa.find(voice => voice.name === name);
  };

  const findHamsaVoiceById = (id: string): VoiceOption | undefined => {
    return voices.hamsa.find(voice => voice.id === id);
  };

  const contextValue: VoiceContextType = {
    voices,
    isLoading,
    error,
    refreshHumeVoices,
    refreshHamsaVoices,
    refreshClonedVoices,
    getVoiceById,
    getVoicesByProvider,
    getCategoriesByProvider,
    findHamsaVoiceByName,
    findHamsaVoiceById
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoices(): VoiceContextType {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoices must be used within a VoiceProvider');
  }
  return context;
}
