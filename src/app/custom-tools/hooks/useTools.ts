import { useState, useCallback } from 'react';
import { Tool, FormData, SchemaProperty } from '../types';
import api from '@/services/api';
import { toast } from 'sonner';

export const useTools = (token: string) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTools = useCallback(async () => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/tools/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle standardized backend response format
      let toolsData = [];
      if (response.data && typeof response.data === 'object') {
        if (response.data.success === true && Array.isArray(response.data.data)) {
          // Standardized response format
          toolsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Legacy format - direct array
          toolsData = response.data;
        } else if (response.data.tools && Array.isArray(response.data.tools)) {
          // Legacy nested structure
          toolsData = response.data.tools;
        } else {
          console.warn('Unexpected tools API response format:', response.data);
          toolsData = [];
        }
      }

      setTools(toolsData);
      setError(null);
    } catch (error) {
      setError('Failed to load tools');
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const saveTool = useCallback(async (toolData: FormData, editingTool: Tool | null) => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingTool?.id) {
        // Update existing tool
        await api.put(`/tools/${editingTool.id}`, toolData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Tool updated successfully');
      } else {
        // Create new tool
        await api.post('/tools/', toolData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Tool created successfully');
      }

      await loadTools();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save tool';
      setError(errorMessage);
      console.error('Error saving tool:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, loadTools]);

  const deleteTool = useCallback(async (toolId: string | number) => {
    // Prevent API calls during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/tools/${toolId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTools(tools.filter(tool => tool.id !== toolId));
      toast.success('Tool deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete tool';
      setError(errorMessage);
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    } finally {
      setLoading(false);
    }
  }, [tools, token]);

  return {
    tools,
    loading,
    error,
    setError,
    loadTools,
    saveTool,
    deleteTool
  };
};
