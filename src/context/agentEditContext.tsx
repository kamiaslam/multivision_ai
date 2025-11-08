"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent } from '@/types/agent';

interface AgentEditContextType {
  editingAgent: Agent | null;
  setEditingAgent: (agent: Agent | null) => void;
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
  clearEditState: () => void;
}

const AgentEditContext = createContext<AgentEditContextType | undefined>(undefined);

export const useAgentEdit = () => {
  const context = useContext(AgentEditContext);
  if (!context) {
    throw new Error('useAgentEdit must be used within AgentEditProvider');
  }
  return context;
};

interface AgentEditProviderProps {
  children: ReactNode;
}

export const AgentEditProvider: React.FC<AgentEditProviderProps> = ({ children }) => {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const clearEditState = () => {
    setEditingAgent(null);
    setIsEditMode(false);
  };

  const value = {
    editingAgent,
    setEditingAgent,
    isEditMode,
    setIsEditMode,
    clearEditState,
  };

  return (
    <AgentEditContext.Provider value={value}>
      {children}
    </AgentEditContext.Provider>
  );
};
