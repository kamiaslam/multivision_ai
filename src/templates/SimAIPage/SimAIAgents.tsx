"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";

interface Agent {
    id: string;
    name: string;
    description: string;
    type: string;
    status: 'active' | 'inactive' | 'error';
    createdAt: string;
    updatedAt: string;
}

interface Props {
    workspaceId?: string;
}

export const SimAIAgents = ({ workspaceId }: Props) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newAgentName, setNewAgentName] = useState('');
    const [newAgentDescription, setNewAgentDescription] = useState('');
    const [newAgentType, setNewAgentType] = useState('chat');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (workspaceId) {
            loadAgents();
        }
    }, [workspaceId]);

    const loadAgents = async () => {
        if (!workspaceId) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Try to load agents from Sim AI API
            const response = await fetch(`http://localhost:3001/api/agents?workspaceId=${workspaceId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setAgents(data.agents || []);
            } else {
                // If API doesn't exist yet, show mock data
                setAgents([
                    {
                        id: 'agent-1',
                        name: 'Customer Support Bot',
                        description: 'AI agent for handling customer inquiries',
                        type: 'chat',
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'agent-2',
                        name: 'Data Processor',
                        description: 'Agent for processing and analyzing data',
                        type: 'workflow',
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'agent-3',
                        name: 'Email Assistant',
                        description: 'AI agent for email management and responses',
                        type: 'email',
                        status: 'inactive',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ]);
            }
        } catch (err) {
            setError('Failed to load agents');
            console.error('Error loading agents:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createAgent = async () => {
        if (!newAgentName.trim() || !workspaceId) return;
        
        setIsCreating(true);
        try {
            const agentData = {
                name: newAgentName,
                description: newAgentDescription,
                type: newAgentType,
                workspaceId
            };
            
            const response = await fetch('http://localhost:3001/api/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(agentData),
            });
            
            if (response.ok) {
                const data = await response.json();
                setAgents(prev => [...prev, data.agent]);
                setNewAgentName('');
                setNewAgentDescription('');
                setNewAgentType('chat');
            } else {
                // Mock creation for demo
                const newAgent: Agent = {
                    id: `agent-${Date.now()}`,
                    name: newAgentName,
                    description: newAgentDescription,
                    type: newAgentType,
                    status: 'inactive',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setAgents(prev => [...prev, newAgent]);
                setNewAgentName('');
                setNewAgentDescription('');
                setNewAgentType('chat');
            }
        } catch (err) {
            console.error('Error creating agent:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        
        try {
            const response = await fetch(`http://localhost:3001/api/agents/${agentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (response.ok) {
                setAgents(prev => prev.map(agent => 
                    agent.id === agentId ? { ...agent, status: newStatus as any } : agent
                ));
            } else {
                // Mock update for demo
                setAgents(prev => prev.map(agent => 
                    agent.id === agentId ? { ...agent, status: newStatus as any } : agent
                ));
            }
        } catch (err) {
            console.error('Error updating agent:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getAgentTypeIcon = (type: string) => {
        switch (type) {
            case 'chat': return '💬';
            case 'workflow': return '⚡';
            case 'email': return '📧';
            case 'webhook': return '🔗';
            default: return '🤖';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={loadAgents}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Agent List */}
            <div>
                <h3 className="text-lg font-semibold text-shade-01 dark:text-white mb-3">
                    AI Agents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            className="p-4 rounded-lg border border-shade-07 dark:border-shade-03"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getAgentTypeIcon(agent.type)}</span>
                                    <h4 className="font-medium text-shade-01 dark:text-white">
                                        {agent.name}
                                    </h4>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(agent.status)}`}>
                                    {agent.status}
                                </span>
                            </div>
                            {agent.description && (
                                <p className="text-sm text-shade-03 dark:text-shade-05 mb-3">
                                    {agent.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-shade-04">
                                    {formatDate(agent.createdAt)}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => toggleAgentStatus(agent.id, agent.status)}
                                        className="text-xs px-2 py-1"
                                    >
                                        {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        onClick={() => window.open(`http://localhost:3001/workspace/${workspaceId}/agents/${agent.id}`, '_blank')}
                                        className="text-xs px-2 py-1"
                                    >
                                        Configure
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create New Agent */}
            <div className="p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                <h4 className="font-medium text-shade-01 dark:text-white mb-3">
                    Create New AI Agent
                </h4>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={newAgentName}
                        onChange={(e) => setNewAgentName(e.target.value)}
                        placeholder="Agent name"
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04"
                    />
                    <textarea
                        value={newAgentDescription}
                        onChange={(e) => setNewAgentDescription(e.target.value)}
                        placeholder="Agent description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04 resize-none"
                    />
                    <select
                        value={newAgentType}
                        onChange={(e) => setNewAgentType(e.target.value)}
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white"
                    >
                        <option value="chat">Chat Agent</option>
                        <option value="workflow">Workflow Agent</option>
                        <option value="email">Email Agent</option>
                        <option value="webhook">Webhook Agent</option>
                    </select>
                    <Button
                        onClick={createAgent}
                        disabled={!newAgentName.trim() || isCreating}
                        className="bg-primary text-white hover:bg-primary/90"
                    >
                        {isCreating ? 'Creating...' : 'Create Agent'}
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{agents.length}</div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Total Agents</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {agents.filter(a => a.status === 'active').length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Active Agents</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {agents.filter(a => a.status === 'error').length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Error Agents</div>
                </div>
            </div>
        </div>
    );
};

