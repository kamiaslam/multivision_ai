import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/authUtils';
import { phoneNumbersAPI } from '@/services/api';

// Types
export interface PhoneNumber {
  id: number;
  phone_number: string;
  label: string;
  is_active: boolean;
  import_type?: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
  agent?: {
    id: number;
    name: string;
    status: string;
    agent_type: string;
  };
}

export interface PhoneNumberImport {
  twilio_account_sid: string;
  twilio_auth_token: string;
  phone_number: string;
  label: string;
  import_type: string;
}

export interface PhoneNumberUpdate {
  label: string;
}

export interface PhoneNumberAssign {
  agent_id: number;
}

export interface PhoneNumberListResponse {
  phone_numbers: PhoneNumber[];
  total: number;
}

// Hook
export const usePhoneNumbers = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all phone numbers
  const getPhoneNumbers = useCallback(async (includeAgents: boolean = true): Promise<PhoneNumberListResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await phoneNumbersAPI.getPhoneNumbers(includeAgents);
      setPhoneNumbers(data.phone_numbers);
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single phone number
  const getPhoneNumber = useCallback(async (phoneId: number): Promise<PhoneNumber> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await phoneNumbersAPI.getPhoneNumber(phoneId);
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.log(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Import phone number
  const importPhoneNumber = useCallback(async (importData: PhoneNumberImport): Promise<PhoneNumber> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await phoneNumbersAPI.importPhoneNumber(importData);
      
      // Add the new phone number to the list
      setPhoneNumbers(prev => [...prev, data]);
      
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update phone number
  const updatePhoneNumber = useCallback(async (phoneId: number, updateData: PhoneNumberUpdate): Promise<PhoneNumber> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await phoneNumbersAPI.updatePhoneNumber(phoneId, updateData);
      
      // Update the phone number in the list
      setPhoneNumbers(prev => 
        prev.map(phone => 
          phone.id === phoneId ? data : phone
        )
      );
      
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign phone number to agent
  const assignPhoneNumber = useCallback(async (phoneId: number, agentId: number): Promise<PhoneNumber> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await phoneNumbersAPI.assignPhoneNumber(phoneId, agentId);
      
      // Update the phone number in the list
      setPhoneNumbers(prev => 
        prev.map(phone => 
          phone.id === phoneId ? data : phone
        )
      );
      
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Unassign phone number from agent
  const unassignPhoneNumber = useCallback(async (phoneId: number): Promise<PhoneNumber> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await phoneNumbersAPI.unassignPhoneNumber(phoneId);
      
      // Update the phone number in the list
      setPhoneNumbers(prev => 
        prev.map(phone => 
          phone.id === phoneId ? data : phone
        )
      );
      
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete phone number
  const deletePhoneNumber = useCallback(async (phoneId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await phoneNumbersAPI.deletePhoneNumber(phoneId);
      
      // Remove the phone number from the list
      setPhoneNumbers(prev => prev.filter(phone => phone.id !== phoneId));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh phone numbers
  const refreshPhoneNumbers = useCallback(async (includeAgents: boolean = true) => {
    return await getPhoneNumbers(includeAgents);
  }, [getPhoneNumbers]);

  return {
    // State
    phoneNumbers,
    loading,
    error,
    
    // Actions
    getPhoneNumbers,
    getPhoneNumber,
    importPhoneNumber,
    updatePhoneNumber,
    assignPhoneNumber,
    unassignPhoneNumber,
    deletePhoneNumber,
    refreshPhoneNumbers,
    clearError,
  };
};

export default usePhoneNumbers;
