"use client";

import { useState } from "react";
import Button from "@/components/Button";

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

interface Props {
    workflows: Workflow[];
    workspaceId?: string;
    onWorkflowCreate: (name: string, description?: string) => Promise<Workflow | undefined>;
}

export const SimAIWorkflows = ({ workflows, workspaceId, onWorkflowCreate }: Props) => {
    const [newWorkflowName, setNewWorkflowName] = useState('');
    const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const createWorkflow = async () => {
        if (!newWorkflowName.trim()) return;
        
        setIsCreating(true);
        try {
            const workflow = await onWorkflowCreate(newWorkflowName, newWorkflowDescription);
            if (workflow) {
                setNewWorkflowName('');
                setNewWorkflowDescription('');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const toggleWorkflowStatus = async (workflowId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:3001/api/workflows/${workflowId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            
            if (response.ok) {
                // The parent component will handle the state update
                window.location.reload();
            }
        } catch (err) {
            console.error('Error updating workflow:', err);
        }
    };

    const deleteWorkflow = async (workflowId: string) => {
        if (!confirm('Are you sure you want to delete this workflow?')) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/workflows/${workflowId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            
            if (response.ok) {
                window.location.reload();
            }
        } catch (err) {
            console.error('Error deleting workflow:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getWorkflowIcon = (name: string) => {
        const icons = ['⚡', '🔄', '📊', '🤖', '🔗', '📧', '💬', '📝'];
        const index = name.length % icons.length;
        return icons[index];
    };

    return (
        <div className="space-y-6">
            {/* Workflow List */}
            <div>
                <h3 className="text-lg font-semibold text-shade-01 dark:text-white mb-3">
                    Workflows
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflows.map((workflow) => (
                        <div
                            key={workflow.id}
                            className="p-4 rounded-lg border border-shade-07 dark:border-shade-03"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getWorkflowIcon(workflow.name)}</span>
                                    <h4 className="font-medium text-shade-01 dark:text-white">
                                        {workflow.name}
                                    </h4>
                                </div>
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: workflow.color }}
                                />
                            </div>
                            {workflow.description && (
                                <p className="text-sm text-shade-03 dark:text-shade-05 mb-3">
                                    {workflow.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    workflow.isActive
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                    {workflow.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-shade-04">
                                    {formatDate(workflow.createdAt)}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => toggleWorkflowStatus(workflow.id, workflow.isActive)}
                                    className="text-xs px-2 py-1"
                                >
                                    {workflow.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                    onClick={() => window.open(`http://localhost:3001/workspace/${workspaceId}/w/${workflow.id}`, '_blank')}
                                    className="text-xs px-2 py-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => deleteWorkflow(workflow.id)}
                                    className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create New Workflow */}
            <div className="p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                <h4 className="font-medium text-shade-01 dark:text-white mb-3">
                    Create New Workflow
                </h4>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        placeholder="Workflow name"
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04"
                    />
                    <textarea
                        value={newWorkflowDescription}
                        onChange={(e) => setNewWorkflowDescription(e.target.value)}
                        placeholder="Workflow description (optional)"
                        rows={3}
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04 resize-none"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={createWorkflow}
                            disabled={!newWorkflowName.trim() || isCreating}
                            className="bg-primary text-white hover:bg-primary/90"
                        >
                            {isCreating ? 'Creating...' : 'Create Workflow'}
                        </Button>
                        <Button
                            onClick={() => window.open(`http://localhost:3001/workspace/${workspaceId}/w`, '_blank')}
                            className="text-sm"
                        >
                            Open Workflow Builder
                        </Button>
                    </div>
                </div>
            </div>

            {/* Workflow Templates */}
            <div className="p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                <h4 className="font-medium text-shade-01 dark:text-white mb-3">
                    Quick Templates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { name: 'Customer Support Bot', description: 'Automated customer service workflow', icon: '💬' },
                        { name: 'Data Processing', description: 'Automated data analysis and reporting', icon: '📊' },
                        { name: 'Email Automation', description: 'Email marketing and follow-up automation', icon: '📧' },
                        { name: 'Webhook Handler', description: 'Process incoming webhook data', icon: '🔗' }
                    ].map((template, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setNewWorkflowName(template.name);
                                setNewWorkflowDescription(template.description);
                            }}
                            className="p-3 border border-shade-07 dark:border-shade-03 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{template.icon}</span>
                                <div>
                                    <h5 className="font-medium text-shade-01 dark:text-white text-sm">
                                        {template.name}
                                    </h5>
                                    <p className="text-xs text-shade-03 dark:text-shade-05">
                                        {template.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{workflows.length}</div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Total Workflows</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {workflows.filter(w => w.isActive).length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Active Workflows</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {workflows.filter(w => !w.isActive).length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Inactive Workflows</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {workflows.length > 0 ? Math.round((workflows.filter(w => w.isActive).length / workflows.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Active Rate</div>
                </div>
            </div>
        </div>
    );
};

