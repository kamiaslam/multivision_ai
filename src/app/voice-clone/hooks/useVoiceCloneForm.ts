import { useState, useCallback } from 'react';
import { FormData } from '../types';

// Utility function to get audio duration from File (for uploaded files only)
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      // Check if duration is valid (not Infinity or NaN)
      if (isFinite(audio.duration) && audio.duration > 0) {
        resolve(audio.duration);
      } else {
        console.log('Invalid duration detected for uploaded file:', audio.duration);
        reject(new Error('Invalid audio duration'));
      }
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio file'));
    });
    
    // Set a timeout to handle cases where loadedmetadata doesn't fire
    setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Timeout loading audio metadata'));
    }, 3000);
    
    audio.src = url;
  });
};


export const useVoiceCloneForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    language: 'en',
    audio_file: null
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      language: 'en',
      audio_file: null
    });
  }, []);

  const populateForm = useCallback((voiceClone: any) => {
    setFormData({
      name: voiceClone.name || '',
      description: voiceClone.description || '',
      language: voiceClone.language || 'en',
      audio_file: null // Don't populate file
    });
  }, []);

  const validateForm = useCallback(async (): Promise<string | null> => {
    if (!formData.name.trim()) {
      return 'Voice name is required';
    }
    if (!formData.audio_file) {
      return 'Audio file is required';
    }
    
    // Check if this is recorded audio (has special properties)
    const file = formData.audio_file as any;
    const isRecorded = file.isRecorded === true;
    const recordedDuration = file.recordedDuration;
    
    console.log('Validation - File type:', isRecorded ? 'recorded' : 'uploaded');
    
    if (isRecorded && recordedDuration !== undefined) {
      // For recorded audio, use the stored recording duration
      console.log('Validation - Using recorded duration:', recordedDuration);
      
      if (recordedDuration < 10) {
        console.log('Validation - Recorded duration too short');
        const minutes = Math.floor(recordedDuration / 60);
        const seconds = Math.floor(recordedDuration % 60);
        const formattedDuration = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
        
        alert(`Audio must be at least 10 seconds long.\n\nCurrent duration: ${formattedDuration}\nRequired: 10:00 or longer\n\nPlease record a longer audio sample.`);
        return `Audio duration too short (${formattedDuration}). Minimum required: 10 seconds.`;
      }
      console.log('Validation - Recorded duration is valid');
    } else {
      // For uploaded audio, try to get duration from metadata
      try {
        const duration = await getAudioDuration(formData.audio_file);
        console.log('Validation - Uploaded audio duration:', duration);
        
        if (duration < 10) {
          console.log('Validation - Uploaded duration too short');
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const formattedDuration = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
          
          alert(`Audio must be at least 10 seconds long.\n\nCurrent duration: ${formattedDuration}\nRequired: 10:00 or longer\n\nPlease upload a longer audio sample.`);
          return `Audio duration too short (${formattedDuration}). Minimum required: 10 seconds.`;
        }
        console.log('Validation - Uploaded duration is valid');
      } catch (error) {
        console.log('Validation - Error getting uploaded audio duration:', error);
        alert('Unable to validate uploaded audio file duration.\n\nPlease ensure:\n• The file is a valid audio format (WAV, MP3, M4A)\n• The file is not corrupted\n• The file contains actual audio content\n\nTry recording a new sample or uploading a different file.');
        return 'Unable to validate uploaded audio file duration. Please check the file format and try again.';
      }
    }
    
    return null;
  }, [formData]);

  return {
    formData,
    setFormData,
    resetForm,
    populateForm,
    validateForm
  };
};
