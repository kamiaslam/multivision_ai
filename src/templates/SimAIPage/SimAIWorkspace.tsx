"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { SimAIWorkspaceManager } from "./SimAIWorkspaceManager";
import { SimAIAgents } from "./SimAIAgents";
import { SimAIWorkflows } from "./SimAIWorkflows";
import { SimAIKnowledge } from "./SimAIKnowledge";

interface Workspace {
    id: string;
    name: string;
    role: string;
    permissions: string;
    createdAt: string;
    updatedAt: string;
}

interface Workflow {
    id: string;
    name: string;
    description: string;
    color: string;
    workspaceId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const SimAIWorkspace = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'workflows' | 'knowledge'>('overview');
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadWorkspaces();
    }, []);

    const loadWorkspaces = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Try to connect to Sim AI API
            const response = await fetch('http://localhost:3001/api/workspaces', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Sim AI is not running or not accessible');
            }
            
            const data = await response.json();
            setWorkspaces(data.workspaces || []);
            
            if (data.workspaces && data.workspaces.length > 0) {
                setSelectedWorkspace(data.workspaces[0]);
                await loadWorkflows(data.workspaces[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect to Sim AI');
            console.error('Error loading workspaces:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadWorkflows = async (workspaceId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/workflows?workspaceId=${workspaceId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setWorkflows(data.workflows || []);
            }
        } catch (err) {
            console.error('Error loading workflows:', err);
        }
    };

    const createWorkspace = async (name: string) => {
        try {
            const response = await fetch('http://localhost:3001/api/workspaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name }),
            });
            
            if (response.ok) {
                const data = await response.json();
                setWorkspaces(prev => [...prev, data.workspace]);
                setSelectedWorkspace(data.workspace);
                return data.workspace;
            }
        } catch (err) {
            console.error('Error creating workspace:', err);
        }
    };

    const createWorkflow = async (name: string, description: string = '') => {
        if (!selectedWorkspace) return;
        
        try {
            const response = await fetch('http://localhost:3001/api/workflows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    description,
                    workspaceId: selectedWorkspace.id,
                    color: '#3972F6'
                }),
            });
            
            if (response.ok) {
                const data = await response.json();
                setWorkflows(prev => [...prev, data.workflow]);
                return data.workflow;
            }
        } catch (err) {
            console.error('Error creating workflow:', err);
        }
    };

    if (isLoading) {
        return (
            <Card title="Sim AI Workspace" className="h-96 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-shade-08 dark:bg-shade-02">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-shade-03 dark:text-shade-05">Connecting to Sim AI...</p>
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Sim AI Workspace" className="h-96 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-shade-08 dark:bg-shade-02">
                                            <div className="text-center p-6">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-semibold text-shade-01 dark:text-white mb-2">
                                Sim AI Not Running
                            </h3>
                            <p className="text-shade-03 dark:text-shade-05 mb-4">
                                To use Sim AI, you need to start the Sim AI application first.
                            </p>
                            <div className="text-sm text-shade-04 mb-4">
                                <p className="font-medium mb-2">Steps to start Sim AI:</p>
                                <ol className="text-left space-y-1">
                                    <li>1. Start Docker Desktop on your Mac</li>
                                    <li>2. Wait for Docker to be fully running</li>
                                    <li>3. Run: <code className="bg-shade-07 dark:bg-shade-03 px-2 py-1 rounded text-xs">./start-sim-ai.sh</code></li>
                                </ol>
                                <p className="mt-2 text-xs text-shade-04">
                                    <strong>Note:</strong> If you're experiencing network issues, try using a VPN or check your internet connection.
                                </p>
                            </div>
                        <div className="space-y-3">
                            <Button
                                onClick={() => window.open('http://localhost:3001', '_blank')}
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                Open Sim AI
                            </Button>
                            <Button
                                onClick={loadWorkspaces}
                                className="text-sm"
                            >
                                Retry Connection
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Workspace Header */}
            <Card title="Sim AI Workspace">
                <div className="p-5 max-lg:p-3">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-shade-01 dark:text-white">
                                {selectedWorkspace?.name || 'No Workspace Selected'}
                            </h2>
                            <p className="text-sm text-shade-03 dark:text-shade-05">
                                {selectedWorkspace ? `Role: ${selectedWorkspace.role}` : 'Select a workspace to get started'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => window.open('http://localhost:3001', '_blank')}
                                className="text-sm"
                            >
                                Open Full Sim AI
                            </Button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-shade-07 dark:border-shade-03 mb-4">
                        {[
                            { id: 'overview', label: 'Overview', icon: '📊' },
                            { id: 'agents', label: 'AI Agents', icon: '🤖' },
                            { id: 'workflows', label: 'Workflows', icon: '⚡' },
                            { id: 'knowledge', label: 'Knowledge', icon: '📚' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-shade-03 dark:text-shade-05 hover:text-shade-01 dark:hover:text-white'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-64">
                        {activeTab === 'overview' && (
                            <SimAIWorkspaceManager
                                workspaces={workspaces}
                                workflows={workflows}
                                selectedWorkspace={selectedWorkspace}
                                onWorkspaceSelect={setSelectedWorkspace}
                                onCreateWorkspace={createWorkspace}
                                onCreateWorkflow={createWorkflow}
                            />
                        )}
                        {activeTab === 'agents' && (
                            <SimAIAgents workspaceId={selectedWorkspace?.id} />
                        )}
                        {activeTab === 'workflows' && (
                            <SimAIWorkflows
                                workflows={workflows}
                                workspaceId={selectedWorkspace?.id}
                                onWorkflowCreate={createWorkflow}
                            />
                        )}
                        {activeTab === 'knowledge' && (
                            <SimAIKnowledge workspaceId={selectedWorkspace?.id} />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SimAIWorkspace;
