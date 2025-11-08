import { useState, useCallback } from 'react';
import { TopUp, FormData } from '../types';
import { topUpAPI } from '@/services/api';
import { toast } from 'sonner';

export const useTopUps = (token: string) => {
  const [topUps, setTopUps] = useState<TopUp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTopUps = useCallback(async () => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    try {
      setLoading(true);
      const response = await topUpAPI.getTopUps();
      
      // Convert API response to TopUp format
      const convertedTopUps = response.map(apiResponse => ({
        id: apiResponse.id.toString(),
        amount: apiResponse.amount,
        status: apiResponse.status,
        payment_method: apiResponse.payment_method,
        transaction_id: apiResponse.transaction_id,
        created_at: apiResponse.created_at,
        completed_at: apiResponse.completed_at,
        is_active: true,
        total_uses: 0,
        success_rate: 100,
        last_used: null
      }));

      setTopUps(convertedTopUps);
      setError(null);
    } catch (error) {
      setError('Failed to load top ups');
      console.error('Error loading top ups:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const saveTopUp = useCallback(async (topUpData: FormData, editingTopUp: TopUp | null) => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingTopUp?.id) {
        // Update existing top up
        await topUpAPI.updateTopUp(editingTopUp.id, topUpData);
        toast.success('Top up updated successfully');
      } else {
        // Create new top up
        await topUpAPI.createTopUp(topUpData);
        toast.success('Top up created successfully');
      }

      await loadTopUps();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save top up';
      setError(errorMessage);
      console.error('Error saving top up:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, loadTopUps]);

  const deleteTopUp = useCallback(async (topUpId: string | number) => {
    try {
      setLoading(true);
      await topUpAPI.deleteTopUp(topUpId);
      
      // Remove from local state after successful API call
      setTopUps(topUps.filter(topUp => topUp.id !== topUpId));
      toast.success('Top up deleted successfully');
    } catch (error) {
      console.error('Error deleting top up:', error);
      toast.error('Failed to delete top up');
      throw error; // Re-throw so the component can handle it
    } finally {
      setLoading(false);
    }
  }, [topUps]);

  return {
    topUps,
    loading,
    error,
    setError,
    loadTopUps,
    saveTopUp,
    deleteTopUp
  };
};
