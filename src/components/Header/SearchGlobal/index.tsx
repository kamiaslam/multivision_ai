import { useState, useRef, useEffect, useMemo } from "react";
import { useClickAway } from "react-use";
import { useRouter } from "next/navigation";
import Search from "@/components/Search";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import { agentsService } from "@/services/agent";
import { useTools } from "@/app/custom-tools/hooks/useTools";
import { useAuth } from "@/context/authContext";
import { useAgentEdit } from "@/context/agentEditContext";
import { Agent } from "@/types/agent";
import { Tool } from "@/app/custom-tools/types";

// Agent search result component
const AgentResult = ({ agent, onClose }: { agent: Agent; onClose?: () => void }) => {
    const router = useRouter();
    const { setEditingAgent, setIsEditMode } = useAgentEdit();

    const handleClick = () => {
        // Set up edit mode and navigate to add-agent page
        setEditingAgent(agent);
        setIsEditMode(true);
        router.push('/add-agent');
        onClose?.();
    };

    return (
        <div className="group relative flex items-center p-3 cursor-pointer" onClick={handleClick}>
            <div className="box-hover"></div>
            <div className="relative z-2 shrink-0">
                <div className="size-16 rounded-xl bg-b-surface1 flex items-center justify-center">
                    {agent.avatar_url ? (
                        <Image
                            className="size-16 rounded-xl opacity-100"
                            src={agent.avatar_url}
                            width={64}
                            height={64}
                            alt={agent.name}
                        />
                    ) : (
                        <Icon name="profile" className="w-8 h-8 text-t-secondary" />
                    )}
                </div>
            </div>
            <div className="relative z-2 grow max-w-56.5 px-5 line-clamp-2 text-sub-title-1 max-2xl:px-3 max-lg:pl-5">
                <div className="font-medium">{agent.name}</div>
                <div className="text-caption text-t-secondary mt-1 line-clamp-1">
                    {agent.description}
                </div>
            </div>
            <div className="relative z-2 flex flex-col items-end shrink-0 ml-auto text-right">
                <div className="text-caption text-t-secondary mb-1">
                    {agent.total_sessions} sessions
                </div>
                <div
                    className={`inline-flex items-center h-6 px-1.5 rounded-lg border text-caption leading-none capitalize ${
                        agent.status === 'active' ? "label-green" : 
                        agent.status === 'training' ? "label-yellow" : "label-red"
                    }`}
                >
                    {agent.status}
                </div>
            </div>
        </div>
    );
};

// Tool search result component
const ToolResult = ({ tool, onClose }: { tool: Tool; onClose?: () => void }) => {
    const router = useRouter();

    const handleClick = () => {
        // Navigate to custom tools page with edit parameter
        router.push(`/custom-tools?edit=${tool.id}`);
        onClose?.();
    };

    return (
        <div className="group relative flex items-center p-3 cursor-pointer" onClick={handleClick}>
            <div className="box-hover"></div>
            <div className="relative z-2 shrink-0">
                <div className="size-16 rounded-xl bg-b-surface1 flex items-center justify-center">
                    <Icon name="tool" className="w-8 h-8 text-t-secondary" />
                </div>
            </div>
            <div className="relative z-2 grow max-w-56.5 px-5 line-clamp-2 text-sub-title-1 max-2xl:px-3 max-lg:pl-5">
                <div className="font-medium">{tool.name}</div>
                <div className="text-caption text-t-secondary mt-1 line-clamp-1">
                    {tool.description}
                </div>
            </div>
            <div className="relative z-2 flex flex-col items-end shrink-0 ml-auto text-right">
                <div className="text-caption text-t-secondary mb-1">
                    {tool.total_calls || 0} calls
                </div>
                <div
                    className={`inline-flex items-center h-6 px-1.5 rounded-lg border text-caption leading-none capitalize ${
                        tool.is_active ? "label-green" : "label-red"
                    }`}
                >
                    {tool.is_active ? "Active" : "Inactive"}
                </div>
            </div>
        </div>
    );
};

type SearchGlobalProps = {
    className?: string;
    onClose?: () => void;
    visible?: boolean;
};

const SearchGlobal = ({ className, onClose, visible }: SearchGlobalProps) => {
    const [search, setSearch] = useState("");
    const [agents, setAgents] = useState<Agent[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const { tools: toolsData, loadTools } = useTools(token || "");

    const ref = useRef(null);
    useClickAway(ref, () => {
        setSearch("");
        onClose?.();
    });

    // Fetch agents and tools on component mount
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            
            setLoading(true);
            try {
                // Fetch agents
                const agentsData = await agentsService.getAgents();
                setAgents(agentsData);
                
                // Fetch tools
                await loadTools();
            } catch (error) {
                console.error("Error fetching search data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, loadTools]);

    // Update tools when toolsData changes
    useEffect(() => {
        setTools(toolsData);
    }, [toolsData]);

    // Filter agents and tools based on search query
    const filteredResults = useMemo(() => {
        if (!search.trim()) return { agents: [], tools: [] };

        const searchLower = search.toLowerCase();
        
        const filteredAgents = agents.filter(agent => 
            agent.name.toLowerCase().includes(searchLower) ||
            agent.description.toLowerCase().includes(searchLower)
        );

        const filteredTools = tools.filter(tool => 
            tool.name.toLowerCase().includes(searchLower) ||
            tool.description.toLowerCase().includes(searchLower)
        );

        return { agents: filteredAgents, tools: filteredTools };
    }, [search, agents, tools]);

    // Show results only when there's a search query and we have data
    const visibleResult = search.trim() !== "" && (filteredResults.agents.length > 0 || filteredResults.tools.length > 0 || loading);

    return (
        <>
            <div
                className={`relative max-lg:fixed max-lg:inset-5 max-lg:bottom-auto max-lg:z-100 max-md:inset-3 max-md:bottom-auto ${
                    visible
                        ? "max-lg:visible max-lg:opacity-100"
                        : "max-lg:transition-all max-lg:invisible max-lg:opacity-0"
                } ${className || ""}`}
                ref={ref}
            >
                <Search
                    className={`relative z-10 w-79 rounded-3xl overflow-hidden transition-shadow max-[1179px]:w-72 max-lg:w-full ${
                        visibleResult ? "z-100 shadow-depth" : ""
                    }`}
                    classInput="max-lg:pr-12"
                    classButton={`${
                        visible ? "max-lg:visible max-lg:opacity-100" : ""
                    }`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search agents and tools..."
                    onClear={onClose}
                />
                <div
                    className={`absolute top-[calc(100%+0.625rem)] left-0 z-100 w-106.5 p-3 rounded-4xl bg-b-surface2 border-1 border-s-subtle shadow-dropdown transition-all max-[1179px]:w-99.5 max-lg:right-0 max-lg:w-auto ${
                        visibleResult
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                    }`}
                >
                    {loading ? (
                        <div className="p-6 text-center text-t-secondary">
                            <Icon name="loader" className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading...
                        </div>
                    ) : (
                        <>
                            {filteredResults.agents.length > 0 && (
                                <div className="mb-3">
                                    <div className="p-3 text-body-2 text-t-secondary">
                                        Agents ({filteredResults.agents.length})
                                    </div>
                                    <div className="">
                                        {filteredResults.agents.slice(0, 3).map((agent) => (
                                            <AgentResult agent={agent} onClose={onClose} key={agent.id} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {filteredResults.tools.length > 0 && (
                                <div className="mb-3">
                                    <div className="p-3 text-body-2 text-t-secondary">
                                        Tools ({filteredResults.tools.length})
                                    </div>
                                    <div className="">
                                        {filteredResults.tools.slice(0, 3).map((tool) => (
                                            <ToolResult tool={tool} onClose={onClose} key={tool.id} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {filteredResults.agents.length === 0 && filteredResults.tools.length === 0 && search.trim() && (
                                <div className="p-6 text-center text-t-secondary">
                                    <Icon name="search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <div className="text-body-2">No agents or tools found</div>
                                    <div className="text-caption mt-1">Try a different search term</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div
                className={`fixed inset-0 z-50 bg-b-surface1/70 transition-all max-lg:hidden ${
                    visibleResult
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                } ${
                    visible
                        ? " max-lg:!block max-lg:visible max-lg:opacity-100"
                        : " max-lg:!block max-lg:invisible max-lg:opacity-0"
                }`}
                onClick={onClose}
            ></div>
        </>
    );
};

export default SearchGlobal;
