import { useState, useEffect, useMemo } from "react";
import Card from "@/components/Card";
import Percentage from "@/components/Percentage";
import Tabs from "@/components/Tabs";
import Loader from "@/components/Loader";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import { agentsService } from "@/services/agent";
import { Agent } from "@/types/agent";
import { toast } from "sonner";

const durations = [
    { id: 1, name: "Last 2 weeks" },
    { id: 2, name: "Last month" },
    { id: 3, name: "Last year" },
];

const categories = [
    { id: 1, name: "Name" },
    { id: 2, name: "Status" },
    { id: 3, name: "Type" },
];

// Helper functions for styling
const getStatusBgColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-500';
        case 'inactive':
            return 'bg-gray-500';
        case 'pending':
            return 'bg-yellow-500';
        default:
            return 'bg-gray-500';
    }
};

const getTypeDisplayName = (type: string) => {
    switch (type) {
        case 'TEXT':
            return 'Text';
        case 'VOICE':
            return 'Voice';
        case 'MULTIMODAL':
            return 'Multimodal';
        default:
            return type || 'Empath';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'TEXT':
            return 'bg-blue-500 text-blue-800';
        case 'VOICE':
            return 'bg-green-500 text-green-800';
        case 'MULTIMODAL':
            return 'bg-purple-500 text-purple-800';
        default:
            return 'bg-gray-500 text-gray-800';
    }
};

const ProductActivity = ({}) => {
    const [duration, setDuration] = useState(durations[1]); // Default to "Last month"
    const [category, setCategory] = useState(categories[0]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Filter agents based on selected duration
    const filteredAgents = useMemo(() => {
        if (!agents.length) return [];
        
        const now = new Date();
        let cutoffDate: Date;
        
        switch (duration.id) {
            case 1: // Last 2 weeks
                cutoffDate = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
                break;
            case 2: // Last month
                cutoffDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                break;
            case 3: // Last year
                cutoffDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
                break;
            default:
                cutoffDate = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
        }
        
        return agents.filter(agent => {
            // Filter by last_used date if available, otherwise by created_at
            const dateToCheck = agent.last_used ? new Date(agent.last_used) : new Date(agent.created_at);
            return dateToCheck >= cutoffDate;
        });
    }, [agents, duration]);

    return (
        <Card
            className="p-6 mb-0 h-[521px] flex flex-col"
            title={`Your Agents (${filteredAgents.length})`}
            selectValue={duration}
            selectOnChange={setDuration}
            selectOptions={durations}
        >
            {/* <Tabs
                className="hidden px-3 max-md:flex mb-4 lg:block"
                classButton="flex-1"
                items={categories}
                value={category}
                setValue={setCategory}
            /> */}
            
            {loading ? (
                <>
                    {/* Mobile Card Loading Skeleton */}
                    <div className="block lg:hidden space-y-4">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                    </div>
                                    <div>
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div>
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                    </div>
                                    <div>
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-14 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-18"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table Loading Skeleton */}
                    <div className="hidden lg:flex flex-1 flex-col">
                        {/* Fixed Header */}
                        <div className="flex items-center gap-3 h-10 text-caption text-t-tertiary/80 border-b border-s-subtle">
                            <div className="flex-1 font-medium">Agent</div>
                            <div className="flex-1 font-medium">Status</div>
                            <div className="flex-1 font-medium">Type</div>
                            <div className="flex-1 font-medium">Sessions</div>
                        </div>
                        
                        {/* Skeleton Loading Rows */}
                        <div className="h-90 overflow-hidden">
                            {[...Array(9)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 h-12 border-b border-s-subtle"
                                >
                                    <div className="flex items-center flex-1 px-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 px-2">
                                        <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 px-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 px-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500">
                    <div className="text-center">
                        <p className="text-base">Error loading agents</p>
                        <p className="text-xs">{error}</p>
                    </div>
                </div>
            ) : filteredAgents.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-t-tertiary">
                    <div className="text-center">
                        <p className="text-base">No agents found for {duration.name.toLowerCase()}</p>
                        <p className="text-xs">Try selecting a different time period</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Mobile Card Layout */}
                    <div className="block lg:hidden space-y-4">
                        {filteredAgents.map((agent) => (
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

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-t-secondary">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getStatusBgColor(agent.status)}`}></div>
                                            <span className="text-sm font-medium capitalize">{agent.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-t-secondary">Sessions</p>
                                        <p className="font-medium text-t-primary">
                                            {agent.total_sessions || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Last Used */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div>
                                        <p className="text-sm text-t-secondary">Last Used</p>
                                        <p className="font-medium text-t-primary">
                                            {agent.last_used ? new Date(agent.last_used).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-t-secondary">Created</p>
                                        <p className="font-medium text-t-primary">
                                            {new Date(agent.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden lg:flex flex-1 flex-col">
                        {/* Fixed Header */}
                        <div className="flex items-center gap-3 h-10 text-caption text-t-tertiary/80 border-b border-s-subtle">
                            <div className="flex-1 font-medium">Agent</div>
                            <div className="flex-1 font-medium">Status</div>
                            <div className="flex-1 font-medium">Type</div>
                            <div className="flex-1 font-medium">Sessions</div>
                        </div>
                        
                        {/* Scrollable Table Body with Fixed Height */}
                        <div className="h-90 overflow-y-auto">
                            {filteredAgents.map((agent) => (
                                <div
                                    className="flex items-center gap-3 h-12 border-b border-s-subtle text-body-2 hover:bg-b-surface2 transition-colors"
                                    key={agent.id}
                                >
                                    <div className="flex items-center flex-1 px-2 min-w-0">
                                        <span className="truncate" title={agent.name}>{agent.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 px-2">
                                        <span className={`px-2 py-0.5 rounded text-xs ${
                                            agent.status === 'active' ? 'bg-green-100 text-green-800' :
                                            agent.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {agent.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 px-2">
                                        {getTypeDisplayName(agent.agent_type || 'TEXT')}
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 px-2">
                                        {agent.total_sessions || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
};

export default ProductActivity;
