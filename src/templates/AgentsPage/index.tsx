"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Percentage from "@/components/Percentage";
import { agentsService } from "@/services/agent";
import { agentStatsAPI } from "@/services/api";
import { Agent, AgentStats, AgentStatsResponse } from "@/types/agent";
import { toast } from "sonner";
import { CreateAgentModal } from "@/components/CreateAgentModal";
import { ShareAgentModal } from "@/components/ShareAgentModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useAgentEdit } from "@/context/agentEditContext";

const typeOptions = [
    { id: 1, name: "All Types" },
    { id: 2, name: "STS" },
    { id: 3, name: "TTS" },
];

const AgentsPage = () => {
    const router = useRouter();
    const { setEditingAgent, setIsEditMode, clearEditState } = useAgentEdit();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState({ id: 1, name: "All" });
    const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Agent performance stats
    const [agentStats, setAgentStats] = useState<AgentStats[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    // Note: We don't clear edit state on mount to preserve edit context when navigating back from add-agent page

    // Fetch agents from API
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                setError(null);
                const agentsData = await agentsService.getAgents();
                setAgents(agentsData);
            } catch (err: any) {
                console.error("Error fetching agents:", err);
                setError(err.message || "Failed to fetch agents");
                toast.error("Failed to load agents");
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    // Fetch agent performance stats
    const fetchAgentStats = async () => {
        setStatsLoading(true);
        
        if (agents.length === 0) {
            setAgentStats([]);
            setStatsLoading(false);
            return;
        }
        
        try {
            const statsPromises = agents.slice(0, 5).map(async (agent) => {
                try {
                    const response: AgentStatsResponse = await agentStatsAPI.getAgentStats(agent.id.toString(), 30);
                    if (response.success) {
                        return response.data;
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching stats for agent ${agent.id}:`, error);
                    return null;
                }
            });
            
            const statsResults = await Promise.all(statsPromises);
            const validStats = statsResults.filter(stat => stat !== null) as AgentStats[];
            setAgentStats(validStats);
        } catch (error) {
            console.error('Error fetching agent stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    // Fetch stats when agents are loaded
    useEffect(() => {
        if (agents.length > 0) {
            fetchAgentStats();
        } else {
            // No agents available, set stats loading to false immediately
            setStatsLoading(false);
            setAgentStats([]);
        }
    }, [agents]);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = typeFilter.id === 1 || 
                (typeFilter.id === 2 && agent.agent_type === "SPEECH") ||
                (typeFilter.id === 3 && agent.agent_type === "TEXT");
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter, agents]);

    const getTypeColor = (type: string) => {
        return type === "SPEECH" 
            ? "bg-[#6366F1]/20 text-[#6366F1]" 
            : "bg-[#8B5CF6]/20 text-[#8B5CF6]";
    };

    const getTypeDisplayName = (type: string) => {
        if (type === "SPEECH") return "STS";
        if (type === "TEXT") return "TTS";
        return type;
    };

    const getVoiceProviderDisplayName = (provider: string) => {
        // if (provider === "hume") return "empath";
        return provider;
    };

    const handleDeleteAgent = (agent: Agent) => {
        setAgentToDelete(agent);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteAgent = async () => {
        if (!agentToDelete) return;
        
        try {
            setIsDeleting(true);
            await agentsService.deleteAgent(agentToDelete.id);
            setAgents(agents.filter(agent => agent.id !== agentToDelete.id));
            toast.success("Agent deleted successfully");
            setIsDeleteModalOpen(false);
            setAgentToDelete(null);
        } catch (error: any) {
            console.error("Error deleting agent:", error);
            toast.error("Failed to delete agent");
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDeleteAgent = () => {
        setIsDeleteModalOpen(false);
        setAgentToDelete(null);
    };

    const handleShareAgent = (agentId: number) => {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            setSelectedAgent(agent);
            setIsShareModalOpen(true);
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'active') return "text-primary-02";
        if (status === 'training') return "text-[#FFB020]";
        return "text-[#FF6A55]";
    };

    const getStatusBgColor = (status: string) => {
        if (status === 'active') return "bg-primary-02";
        if (status === 'training') return "bg-[#FFB020]";
        return "bg-[#FF6A55]";
    };

    // Calculate stats from real agent data
    const totalAgents = agents.length;
    const activeAgents = agents.filter(agent => agent.status === 'active').length;
    const avgSessions = agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + agent.total_sessions, 0) / agents.length) : 0;
    const totalSessions = agents.reduce((sum, agent) => sum + agent.total_sessions, 0);

    const handleCreateAgent = (agentData: any) => {
        console.log("Agent created - Raw data:", agentData);
        console.log("Agent created - Data type:", typeof agentData);
        console.log("Agent created - Data keys:", agentData ? Object.keys(agentData) : "No data");
        
        // Check if agentData has the expected structure
        if (!agentData || typeof agentData !== 'object') {
            console.error("Invalid agent data received:", agentData);
            toast.error("Invalid agent data received");
            return;
        }
        
        // Ensure the agent has required properties for display
        const newAgent = {
            id: agentData.id || Date.now(), // Fallback ID if not provided
            name: agentData.name || "Unnamed Agent",
            description: agentData.description || "",
            agent_type: agentData.agent_type || agentData.type || "SPEECH", // Handle both field names
            status: agentData.status || "active",
            total_sessions: agentData.total_sessions || 0,
            voice_provider: agentData.voice_provider || "",
            voice_id: agentData.voice_id || "",
            model_provider: agentData.model_provider || "",
            model_resource: agentData.model_resource || "",
            custom_instructions: agentData.custom_instructions || "",
            created_at: agentData.created_at || new Date().toISOString(),
            updated_at: agentData.updated_at || new Date().toISOString(),
            last_used: agentData.last_used || null,
            tool_ids: agentData.tool_ids || []
        };
        
        console.log("Formatted agent data:", newAgent);
        
        // Add the new agent to the list
        setAgents(prev => [...prev, newAgent]);
        toast.success("Agent created successfully!");
        
        // Close the modal
        setIsCreateAgentModalOpen(false);
    };

    const handleEditAgent = (agent: Agent) => {
        // Set agent data in context and navigate to add-agent page
        setEditingAgent(agent);
        setIsEditMode(true);
        router.push('/add-agent');
    };

    const handleUpdateAgent = (updatedAgentData: any) => {
        console.log("Agent updated:", updatedAgentData);
        
        // Update the agent in the list
        setAgents(prev => prev.map(agent => 
            agent.id === updatedAgentData.id ? updatedAgentData : agent
        ));
        
        toast.success("Agent updated successfully!");
        setIsCreateAgentModalOpen(false);
    };

    const handleCloseEditModal = () => {
        setIsCreateAgentModalOpen(false);
    };

    return (
        <Layout title="Agents & Bots">
            <div className="space-y-3">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-lg:overflow-hidden">
                    <Card className="p-6 mb-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-16 h-16 bg-primary-02 rounded-full">
                                <Icon name="robot" className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-sub-title-1">Total Agents</div>
                                </div>
                                <div className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : totalAgents}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Percentage value={8.2} />
                                    <span className="text-xs text-gray-500">vs last period</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 mb-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
                                <Icon name="check-circle" className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-sub-title-1">Active Agents</div>
                                </div>
                                <div className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : activeAgents}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Percentage value={12.5} />
                                    <span className="text-xs text-gray-500">vs last period</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 mb-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
                                <Icon name="chart" className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-sub-title-1">Avg Sessions</div>
                                </div>
                                <div className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : avgSessions}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Percentage value={-2.1} />
                                    <span className="text-xs text-gray-500">vs last period</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 mb-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full">
                                <Icon name="session" className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-sub-title-1">Total Sessions</div>
                                </div>
                                <div className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : totalSessions.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Percentage value={15.3} />
                                    <span className="text-xs text-gray-500">vs last period</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="p-6" title="Agents & Bots">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Search
                                placeholder="Search agents or descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                isGray
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select
                                options={typeOptions}
                                value={typeFilter}
                                onChange={setTypeFilter}
                                className="min-w-[150px]"
                            />
                            <Button onClick={() => {
                                clearEditState();
                                router.push('/add-agent?mode=create');
                            }}>
                                <Icon name="plus" className="w-4 h-4 mr-2" />
                                Add Agent
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <>
                            {/* Skeleton Loading for Mobile Cards */}
                            <div className="block lg:hidden space-y-4">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        {/* Header Skeleton */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                        </div>

                                        {/* Description Skeleton */}
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                        </div>

                                        {/* Metrics Skeleton */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            </div>
                                        </div>

                                        {/* Voice Provider and Last Used Skeleton */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            </div>
                                        </div>

                                        {/* Actions Skeleton */}
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <div className="flex-1 h-8  bg-gray-200 rounded animate-pulse"></div>
                                            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skeleton Loading for Desktop Table */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        {/* Table Header */}
                                        <div className="text-caption text-t-tertiary/80 border-b border-s-subtle">
                                            <div className="grid grid-cols-8 gap-4 py-3 px-4">
                                                <div className="font-medium text-t-secondary">Agent Name</div>
                                                <div className="font-medium text-t-secondary">Type</div>
                                                <div className="font-medium text-t-secondary">Description</div>
                                                <div className="font-medium text-t-secondary">Status</div>
                                                <div className="font-medium text-t-secondary">Sessions</div>
                                                <div className="font-medium text-t-secondary">Voice Provider</div>
                                                <div className="font-medium text-t-secondary">Last Used</div>
                                                <div className="font-medium text-t-secondary">Actions</div>
                                            </div>
                                        </div>
                                        
                                        {/* Table Body Skeleton */}
                                        <div className="h-80 overflow-y-auto">
                                            {[...Array(6)].map((_, index) => (
                                                <div key={index} className="grid grid-cols-8 gap-4 py-2 px-4 border-b border-s-subtle">
                                                    {/* Agent Name */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                                    </div>
                                                    {/* Type */}
                                                    <div className="flex items-center">
                                                        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                                    </div>
                                                    {/* Description */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                    </div>
                                                    {/* Status */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                                    </div>
                                                    {/* Sessions */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                                                    </div>
                                                    {/* Voice Provider */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                                    </div>
                                                    {/* Last Used */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-3xl bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-8 h-8 rounded-3xl bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-8 h-8 rounded-3xl bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-2">Error loading agents</p>
                            <p className="text-sm text-t-secondary">{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card Layout */}
                            <div className="block lg:hidden space-y-4">
                                {filteredAgents.map((agent, index) => (
                                    <div key={agent.id} className="border bg-b-surface1 border-gray-200 rounded-lg p-4 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between min-w-0">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-10 h-10 min-w-[25px] min-h-[25px] max-w-[25px] max-h-[25px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    <Icon name="robot" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-t-primary truncate" title={agent.name}>{agent.name}</p>
                                                    <p className="text-sm text-t-secondary">{getTypeDisplayName(agent.agent_type || 'TEXT')}</p>
                                                </div>
                                            </div>
                                            <Badge className={`${getTypeColor(agent.agent_type || 'TEXT')} flex-shrink-0`}>
                                                {getTypeDisplayName(agent.agent_type || 'TEXT')}
                                            </Badge>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <p className="text-sm text-t-secondary">Description</p>
                                            <p className="text-sm text-t-primary">
                                                {agent.description || 'No description available'}
                                            </p>
                                        </div>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-t-secondary">Status</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${getStatusBgColor(agent.status)}`}></div>
                                                    <span className="text-sm font-medium capitalize">{agent.status}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-t-secondary">Sessions</p>
                                                <p className="font-medium text-t-primary">
                                                    {agent.total_sessions}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Voice Provider and Last Used */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div>
                                                <p className="text-sm text-t-secondary">Voice Provider</p>
                                                <p className="font-medium text-t-primary">
                                                    {getVoiceProviderDisplayName(agent.voice_provider || 'N/A')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-t-secondary">Last Used</p>
                                                <p className="font-medium text-t-primary">
                                                    {agent.last_used ? new Date(agent.last_used).toLocaleDateString() : 'Never'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <Button 
                                                isStroke 
                                                className="flex-1"
                                                onClick={() => handleEditAgent(agent)}
                                            >
                                                <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                                                Edit
                                            </Button>
                                            <Button 
                                                isStroke 
                                                className="flex-1"
                                                onClick={() => router.push(`/inference/${agent.id}`)}
                                            >
                                                <Icon name="play" className="w-4 h-4 fill-t-secondary" />
                                                Test
                                            </Button>
                                            <Menu as="div" className="relative flex items-center justify-center">
                                                <MenuButton>
                                                    <Icon name="dots" className="w-6 h-6 fill-t-secondary" />
                                                </MenuButton>
                                                <MenuItems className="absolute right-0 top-15 z-20 min-w-32 p-2 rounded-[1.25rem] bg-b-surface2 border border-s-subtle outline-none shadow-dropdown origin-top transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
                                                    <MenuItem as="div">
                                                        <button
                                                            onClick={() => handleShareAgent(agent.id)}
                                                            className="flex items-center w-full px-3 py-2 text-sm text-t-secondary hover:text-t-primary hover:bg-b-highlight rounded-lg transition-colors"
                                                        >
                                                            <Icon name="share" className="w-4 h-4 mr-2" />
                                                            Share
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem as="div">
                                                        <button
                                                            onClick={() => handleDeleteAgent(agent)}
                                                            className="flex items-center w-full px-3 py-2 text-sm text-t-secondary hover:text-t-primary hover:bg-b-highlight rounded-lg transition-colors text-red-500 hover:text-red-600"
                                                        >
                                                            <Icon name="trash" className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </button>
                                                    </MenuItem>
                                                </MenuItems>
                                            </Menu>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden lg:block">
                                <div className="">
                                    <div className="min-w-full">
                                        {/* Table Header */}
                                        <div className="text-caption text-t-tertiary/80 border-b border-s-subtle">
                                            <div className="grid grid-cols-8 gap-4 py-3 px-4">
                                                <div className="font-small text-t-secondary">Agent Name</div>
                                                <div className="font-medium text-t-secondary">Type</div>
                                                <div className="font-medium text-t-secondary">Description</div>
                                                <div className="font-medium text-t-secondary">Status</div>
                                                <div className="font-medium text-t-secondary">Sessions</div>
                                                <div className="font-medium text-t-secondary">Voice Provider</div>
                                                <div className="font-medium text-t-secondary">Last Used</div>
                                                <div className="font-medium text-t-secondary">Actions</div>
                                                <div className="font-medium text-t-secondary"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Table Body with Fixed Height and Scrolling */}
                                        <div className="">
                                            {filteredAgents.map((agent) => (
                                                <div key={agent.id} className="grid grid-cols-8 gap-4 py-2 px-4 border-b border-s-subtle text-body-2 hover:bg-b-surface2 transition-colors">
                                                    {/* Agent Name */}
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                            <Icon name="robot" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-t-primary truncate" title={agent.name}>{agent.name}</p>
                                                        </div>
                                                    </div>
                                                    {/* Type */}
                                                    <div className="flex items-center">
                                                        <Badge className={getTypeColor(agent.agent_type || 'TEXT')}>
                                                            {getTypeDisplayName(agent.agent_type || 'TEXT')}
                                                        </Badge>
                                                    </div>
                                                    {/* Description */}
                                                    <div className="flex items-center">
                                                        <div className="text-t-primary max-w-xs truncate">
                                                            {agent.description || 'No description available'}
                                                        </div>
                                                    </div>
                                                    {/* Status */}
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusBgColor(agent.status)}`}></div>
                                                        <span className="text-sm capitalize">{agent.status}</span>
                                                    </div>
                                                    {/* Sessions */}
                                                    <div className="flex items-center">
                                                        <div className="font-medium text-t-primary">
                                                            {agent.total_sessions}
                                                        </div>
                                                    </div>
                                                    {/* Voice Provider */}
                                                    <div className="flex items-center">
                                                        <div className="text-t-primary">
                                                            {getVoiceProviderDisplayName(agent.voice_provider || 'N/A')}
                                                        </div>
                                                    </div>
                                                    {/* Last Used */}
                                                    <div className="flex items-center">
                                                        <div className="text-t-primary">
                                                            {agent.last_used ? new Date(agent.last_used).toLocaleDateString() : 'Never'}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                          onClick={() => handleEditAgent(agent)}
                                                          className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                        >
                                                             <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                                                         </button>
                                                        <button 
                                                          onClick={() => router.push(`/inference/${agent.id}`)}
                                                          className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                        >
                                                            <Icon name="play" className="w-4 h-4 fill-t-secondary" />
                                                        </button>
                                                        <Menu as="div" className="relative">
                                                            <MenuButton className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors">
                                                                <Icon name="dots" className="w-4 h-4 fill-t-secondary" />
                                                            </MenuButton>
                                                            <MenuItems className="absolute right-0 z-[999999] min-w-32 p-2 rounded-[1.25rem] bg-b-surface2 border border-s-subtle outline-none shadow-dropdown origin-top transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
                                                                <MenuItem as="div">
                                                                    <button
                                                                        onClick={() => handleShareAgent(agent.id)}
                                                                        className="flex items-center w-full px-3 py-2 text-sm text-t-secondary hover:text-t-primary hover:bg-b-highlight rounded-lg transition-colors"
                                                                    >
                                                                        <Icon name="share" className="w-4 h-4 mr-2" />
                                                                        Share
                                                                    </button>
                                                                </MenuItem>
                                                                <MenuItem as="div">
                                                                    <button
                                                                        onClick={() => handleDeleteAgent(agent)}
                                                                        className="flex items-center w-full px-3 py-2 text-sm text-t-secondary hover:text-t-primary hover:bg-b-highlight rounded-lg transition-colors text-red-500 hover:text-red-600"
                                                                    >
                                                                        <Icon name="trash" className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </button>
                                                                </MenuItem>
                                                            </MenuItems>
                                                        </Menu>
                                                    </div>
                                                    {/* Empty column for spacing */}
                                                    <div className="flex items-center">
                                                        <div></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {filteredAgents.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-t-secondary">No agents found.</p>
                                </div>
                            )}
                        </>
                    )}
                </Card>

                {/* Performance Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Card className="p-6" title="Agent Performance">
                        {statsLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : agentStats.length > 0 ? (
                            <div className="space-y-4">
                                {agentStats.map((stat) => {
                                    const agent = agents.find(a => a.id === stat.agent_id);
                                    return (
                                        <div key={stat.agent_id} className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg min-w-0">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${agent?.status === 'active' ? 'bg-primary-02' : agent?.status === 'training' ? 'bg-[#FFB020]' : 'bg-[#FF6A55]'}`}></div>
                                                <span className="font-medium text-t-primary truncate" title={stat.agent_name}>{stat.agent_name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-t-primary">{stat.total_sessions} sessions</div>
                                                <div className="text-xs text-t-secondary">
                                                    {stat.avg_duration_minutes.toFixed(1)}m avg
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-t-secondary">No Data Yet</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6" title="Agent Types Distribution">
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(() => {
                                    // Generate dynamic agent type stats
                                    const agentTypeStats = [
                                        {
                                            type: "SPEECH",
                                            name: "STS",
                                            color: "bg-[#6366F1]",
                                            agents: agents.filter(a => a.agent_type === "SPEECH")
                                        },
                                        {
                                            type: "TEXT", 
                                            name: "TTS",
                                            color: "bg-[#8B5CF6]",
                                            agents: agents.filter(a => a.agent_type === "TEXT")
                                        }
                                    ];

                                    return agentTypeStats.map((typeStat) => {
                                        return (
                                            <div key={typeStat.type} className="flex items-center justify-between p-4 bg-b-depth2 border border-s-subtle rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 ${typeStat.color} rounded`}></div>
                                                    <span className="font-medium text-t-primary">{typeStat.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-t-primary">
                                                        {typeStat.agents.length} agents
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            <CreateAgentModal 
                    isOpen={isCreateAgentModalOpen} 
                    onClose={handleCloseEditModal}
                    onSubmit={handleCreateAgent}
                />
            <ShareAgentModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)}
                agent={selectedAgent}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDeleteAgent}
                onConfirm={confirmDeleteAgent}
                title="Delete Agent"
                message={`Are you sure you want to delete "${agentToDelete?.name}"? This action cannot be undone and will permanently remove the agent and all its data.`}
                confirmText="Delete Agent"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
            />
        </Layout>
    );
};

export default AgentsPage;