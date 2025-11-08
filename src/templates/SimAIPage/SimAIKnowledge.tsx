"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";

interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    type: 'document' | 'web' | 'database' | 'api';
    documentCount: number;
    status: 'active' | 'processing' | 'error';
    createdAt: string;
    updatedAt: string;
}

interface Props {
    workspaceId?: string;
}

export const SimAIKnowledge = ({ workspaceId }: Props) => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newKnowledgeName, setNewKnowledgeName] = useState('');
    const [newKnowledgeDescription, setNewKnowledgeDescription] = useState('');
    const [newKnowledgeType, setNewKnowledgeType] = useState<'document' | 'web' | 'database' | 'api'>('document');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (workspaceId) {
            loadKnowledgeBases();
        }
    }, [workspaceId]);

    const loadKnowledgeBases = async () => {
        if (!workspaceId) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Try to load knowledge bases from Sim AI API
            const response = await fetch(`http://localhost:3001/api/knowledge?workspaceId=${workspaceId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setKnowledgeBases(data.knowledgeBases || []);
            } else {
                // Mock data for demo
                setKnowledgeBases([
                    {
                        id: 'kb-1',
                        name: 'Company Documentation',
                        description: 'Internal company policies and procedures',
                        type: 'document',
                        documentCount: 45,
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'kb-2',
                        name: 'Product Knowledge Base',
                        description: 'Product specifications and user guides',
                        type: 'document',
                        documentCount: 23,
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'kb-3',
                        name: 'Web Scraping Data',
                        description: 'Data collected from various websites',
                        type: 'web',
                        documentCount: 156,
                        status: 'processing',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'kb-4',
                        name: 'Customer Database',
                        description: 'Customer information and interactions',
                        type: 'database',
                        documentCount: 1200,
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ]);
            }
        } catch (err) {
            setError('Failed to load knowledge bases');
            console.error('Error loading knowledge bases:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createKnowledgeBase = async () => {
        if (!newKnowledgeName.trim() || !workspaceId) return;
        
        setIsCreating(true);
        try {
            const knowledgeData = {
                name: newKnowledgeName,
                description: newKnowledgeDescription,
                type: newKnowledgeType,
                workspaceId
            };
            
            const response = await fetch('http://localhost:3001/api/knowledge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(knowledgeData),
            });
            
            if (response.ok) {
                const data = await response.json();
                setKnowledgeBases(prev => [...prev, data.knowledgeBase]);
                setNewKnowledgeName('');
                setNewKnowledgeDescription('');
                setNewKnowledgeType('document');
            } else {
                // Mock creation for demo
                const newKnowledge: KnowledgeBase = {
                    id: `kb-${Date.now()}`,
                    name: newKnowledgeName,
                    description: newKnowledgeDescription,
                    type: newKnowledgeType,
                    documentCount: 0,
                    status: 'processing',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setKnowledgeBases(prev => [...prev, newKnowledge]);
                setNewKnowledgeName('');
                setNewKnowledgeDescription('');
                setNewKnowledgeType('document');
            }
        } catch (err) {
            console.error('Error creating knowledge base:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const deleteKnowledgeBase = async (knowledgeId: string) => {
        if (!confirm('Are you sure you want to delete this knowledge base?')) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/knowledge/${knowledgeId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            
            if (response.ok) {
                setKnowledgeBases(prev => prev.filter(kb => kb.id !== knowledgeId));
            }
        } catch (err) {
            console.error('Error deleting knowledge base:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getKnowledgeTypeIcon = (type: string) => {
        switch (type) {
            case 'document': return '📄';
            case 'web': return '🌐';
            case 'database': return '🗄️';
            case 'api': return '🔌';
            default: return '📚';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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
                <Button onClick={loadKnowledgeBases}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Knowledge Base List */}
            <div>
                <h3 className="text-lg font-semibold text-shade-01 dark:text-white mb-3">
                    Knowledge Bases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {knowledgeBases.map((knowledge) => (
                        <div
                            key={knowledge.id}
                            className="p-4 rounded-lg border border-shade-07 dark:border-shade-03"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getKnowledgeTypeIcon(knowledge.type)}</span>
                                    <h4 className="font-medium text-shade-01 dark:text-white">
                                        {knowledge.name}
                                    </h4>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(knowledge.status)}`}>
                                    {knowledge.status}
                                </span>
                            </div>
                            {knowledge.description && (
                                <p className="text-sm text-shade-03 dark:text-shade-05 mb-3">
                                    {knowledge.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-shade-03 dark:text-shade-05">
                                    {knowledge.documentCount} documents
                                </span>
                                <span className="text-xs text-shade-04">
                                    {formatDate(knowledge.createdAt)}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => window.open(`http://localhost:3001/workspace/${workspaceId}/knowledge/${knowledge.id}`, '_blank')}
                                    className="text-xs px-2 py-1"
                                >
                                    Manage
                                </Button>
                                <Button
                                    onClick={() => window.open(`http://localhost:3001/workspace/${workspaceId}/knowledge/${knowledge.id}/upload`, '_blank')}
                                    className="text-xs px-2 py-1"
                                >
                                    Upload
                                </Button>
                                <Button
                                    onClick={() => deleteKnowledgeBase(knowledge.id)}
                                    className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create New Knowledge Base */}
            <div className="p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                <h4 className="font-medium text-shade-01 dark:text-white mb-3">
                    Create New Knowledge Base
                </h4>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={newKnowledgeName}
                        onChange={(e) => setNewKnowledgeName(e.target.value)}
                        placeholder="Knowledge base name"
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04"
                    />
                    <textarea
                        value={newKnowledgeDescription}
                        onChange={(e) => setNewKnowledgeDescription(e.target.value)}
                        placeholder="Knowledge base description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white placeholder:text-shade-04 resize-none"
                    />
                    <select
                        value={newKnowledgeType}
                        onChange={(e) => setNewKnowledgeType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-shade-07 dark:border-shade-03 rounded-lg bg-shade-08 dark:bg-shade-02 text-shade-01 dark:text-white"
                    >
                        <option value="document">Document Upload</option>
                        <option value="web">Web Scraping</option>
                        <option value="database">Database Connection</option>
                        <option value="api">API Integration</option>
                    </select>
                    <Button
                        onClick={createKnowledgeBase}
                        disabled={!newKnowledgeName.trim() || isCreating}
                        className="bg-primary text-white hover:bg-primary/90"
                    >
                        {isCreating ? 'Creating...' : 'Create Knowledge Base'}
                    </Button>
                </div>
            </div>

            {/* Knowledge Base Types */}
            <div className="p-4 border border-shade-07 dark:border-shade-03 rounded-lg">
                <h4 className="font-medium text-shade-01 dark:text-white mb-3">
                    Knowledge Base Types
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { type: 'document', name: 'Document Upload', description: 'Upload PDFs, Word docs, and text files', icon: '📄' },
                        { type: 'web', name: 'Web Scraping', description: 'Extract data from websites and web pages', icon: '🌐' },
                        { type: 'database', name: 'Database Connection', description: 'Connect to SQL and NoSQL databases', icon: '🗄️' },
                        { type: 'api', name: 'API Integration', description: 'Integrate with external APIs and services', icon: '🔌' }
                    ].map((kbType) => (
                        <div
                            key={kbType.type}
                            className="p-3 border border-shade-07 dark:border-shade-03 rounded-lg"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{kbType.icon}</span>
                                <h5 className="font-medium text-shade-01 dark:text-white">
                                    {kbType.name}
                                </h5>
                            </div>
                            <p className="text-sm text-shade-03 dark:text-shade-05">
                                {kbType.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{knowledgeBases.length}</div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Knowledge Bases</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {knowledgeBases.reduce((total, kb) => total + kb.documentCount, 0)}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Total Documents</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {knowledgeBases.filter(kb => kb.status === 'active').length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Active Bases</div>
                </div>
                <div className="p-4 bg-shade-08 dark:bg-shade-02 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                        {knowledgeBases.filter(kb => kb.status === 'processing').length}
                    </div>
                    <div className="text-sm text-shade-03 dark:text-shade-05">Processing</div>
                </div>
            </div>
        </div>
    );
};

