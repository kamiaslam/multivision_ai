"use client";

import { useState } from "react";
import Button from "@/components/Button";

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

interface Props {
    workspaces: Workspace[];
    workflows: Workflow[];
    selectedWorkspace: Workspace | null;
    onWorkspaceSelect: (workspace: Workspace) => void;
    onCreateWorkspace: (name: string) => Promise<Workspace | undefined>;
    onCreateWorkflow: (name: string, description?: string) => Promise<Workflow | undefined>;
}

export const SimAIWorkspaceManager = ({
    workspaces,
    workflows,
    selectedWorkspace,
    onWorkspaceSelect,
    onCreateWorkspace,
    onCreateWorkflow
}: Props) => {
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [newWorkflowName, setNewWorkflowName] = useState('');
    const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) return;
        
        setIsCreatingWorkspace(true);
        try {
            const workspace = await onCreateWorkspace(newWorkspaceName);
            if (workspace) {
                setNewWorkspaceName('');
            }
        } finally {
            setIsCreatingWorkspace(false);
        }
    };

    const handleCreateWorkflow = async () => {
        if (!newWorkflowName.trim() || !selectedWorkspace) return;
        
        setIsCreatingWorkflow(true);
        try {
            const workflow = await onCreateWorkflow(newWorkflowName, newWorkflowDescription);
            if (workflow) {
                setNewWorkflowName('');
                setNewWorkflowDescription('');
            }
        } finally {
            setIsCreatingWorkflow(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Workspace Selection */}
            <div>
                <h3 className="text-lg font-semibold text-shade-01 dark:text-white mb-3">
                    Workspaces
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => onWorkspaceSelect(workspace)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedWorkspace?.id === workspace.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-shade-07 dark:border-shade-03 hover:border-primary/50'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-shade-01 dark:text-white">
                                    {workspace.name}
                                </h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    workspace.role === 'owner' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                    {workspace.role}
                                </span>
                            </div>
                            <p className="text-sm text-shade-03 dark:text-shade-05">
                                Created {formatDate(workspace.createdAt)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Create New Workspace */}
                <div className="mt-4 p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                    <h4 className="font-medium text-shade-01 dark:text-white mb-2">
                        Create New Workspace
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="Workspace name"
                            className="flex-1 px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04"
                        />
                        <Button
                            onClick={handleCreateWorkspace}
                            disabled={!newWorkspaceName.trim() || isCreatingWorkspace}
                            className="bg-primary text-white hover:bg-primary/90"
                        >
                            {isCreatingWorkspace ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Workflows */}
            {selectedWorkspace && (
                <div>
                    <h3 className="text-lg font-semibold text-shade-01 dark:text-white mb-3">
                        Workflows in {selectedWorkspace.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workflows.map((workflow) => (
                            <div
                                key={workflow.id}
                                className="p-4 rounded-lg border border-shade-07 dark:border-shade-03"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-shade-01 dark:text-white">
                                        {workflow.name}
                                    </h4>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: workflow.color }}
                                    />
                                </div>
                                {workflow.description && (
                                    <p className="text-sm text-shade-03 dark:text-shade-05 mb-2">
                                        {workflow.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
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
                            </div>
                        ))}
                    </div>

                    {/* Create New Workflow */}
                    <div className="mt-4 p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                        <h4 className="font-medium text-shade-01 dark:text-white mb-2">
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
                                rows={2}
                                className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04 resize-none"
                            />
                            <Button
                                onClick={handleCreateWorkflow}
                                disabled={!newWorkflowName.trim() || isCreatingWorkflow}
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                {isCreatingWorkflow ? 'Creating...' : 'Create Workflow'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{workspaces.length}</div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Workspaces</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{workflows.length}</div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Workflows</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {workflows.filter(w => w.isActive).length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Active Workflows</div>
                </div>
            </div>
        </div>
    );
};

