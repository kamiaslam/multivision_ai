"use client";

import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Checkbox from "@/components/Checkbox";
import Switch from "@/components/Switch";
import Modal from "@/components/Modal";
import { callLogsAPI, agentAPI } from "@/services/api";
import { toast } from "sonner";
import { SelectOption } from "@/types/select";

// Call log data type
type CallLog = {
  session_id: string;
  agent_name: string;
  status: string;
  created_at: string;
  last_accessed: string;
  call_sid: string | null;
  from_number: string | null;
  to_number: string | null;
  participant_name: string;
  participant_identity: string;
  agent_instructions: string;
  recording_url: string | null;
  recording_signed_url: string | null;
  recording_expires_at: string | null;
};

// Agent data type
type Agent = {
  id: number;
  name: string;
  description?: string;
  status?: string;
  agent_type?: string;
  avatar_url?: string | null;
  voice_provider?: string;
  voice_id?: string;
  custom_instructions?: string;
  tool_ids?: string[];
  inbound_phone_number?: string | null;
  total_sessions?: number;
  last_used?: string | null;
  created_at?: string;
};

type PageMeta = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

type CallLogsResponse = {
  success: boolean;
  message: string;
  data: {
    items: CallLog[];
    meta: PageMeta;
  };
  request_id?: string;
  timestamp?: string;
};

const CallLogsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [assistantFilter, setAssistantFilter] = useState({ id: 0, name: "All Assistants" });
    const [statusFilter, setStatusFilter] = useState({ id: 0, name: "All Status" });
    const [dateRangeFilter, setDateRangeFilter] = useState<SelectOption>({ id: 0, name: "All Time" });
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [useDateTimeMode, setUseDateTimeMode] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isTranscriptionModalOpen, setIsTranscriptionModalOpen] = useState(false);
    const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
    const [callLogsData, setCallLogsData] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [downloadingSessionId, setDownloadingSessionId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);

    // Load agents from database
    useEffect(() => {
        const loadAgents = async () => {
            setAgentsLoading(true);
            try {
                const response = await agentAPI.getAgents();
                console.log('Agents API response:', response); // Debug log
                
                // Check if response is directly an array (agents)
                if (Array.isArray(response)) {
                    setAgents(response);
                    console.log('Agents loaded successfully:', response.length, 'agents');
                }
                // Check if response has the wrapped structure
                else if (response.success && response.data && Array.isArray(response.data)) {
                    setAgents(response.data);
                    console.log('Agents loaded successfully:', response.data.length, 'agents');
                }
                // Check if response.data is directly the array
                else if (response.data && Array.isArray(response.data)) {
                    setAgents(response.data);
                    console.log('Agents loaded successfully:', response.data.length, 'agents');
                }
                else {
                    console.error('Failed to load agents - invalid response structure:', response);
                    toast.error('Failed to load agents - invalid response');
                }
            } catch (error) {
                console.error('Error loading agents:', error);
                toast.error('Failed to load agents');
            } finally {
                setAgentsLoading(false);
            }
        };

        loadAgents();
    }, []);

    const loadCallLogs = async (page: number = 1) => {
        setLoading(true);
        try {
            const data: CallLogsResponse = await callLogsAPI.getCallLogs({
                page,
                page_size: pageSize,
                agent_id: assistantFilter.id !== 0 ? assistantFilter.id : undefined,
                status: statusFilter.id !== 0 ? statusFilter.name : undefined,
                date_from: dateFrom ? formatDateForAPI(dateFrom, useDateTimeMode) : undefined,
                date_to: dateTo ? formatDateForAPI(dateTo, useDateTimeMode) : undefined,
            });

            if (data.success) {
                setCallLogsData(data.data.items);
                setPageMeta(data.data.meta);
                setCurrentPage(data.data.meta.page);
            } else {
                toast.error(data.message || 'Failed to load call logs');
            }
        } catch (error: any) {
            console.error('Error loading call logs:', error);
            toast.error(error.response?.data?.message || 'Failed to load call logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCallLogs(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reload when filters change
    useEffect(() => {
        loadCallLogs(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assistantFilter, statusFilter, dateFrom, dateTo]);

    const refreshCallLogs = async () => {
        await loadCallLogs(currentPage);
        toast.success('Call logs refreshed successfully');
    };

    // Date formatting helpers
    const formatDateForAPI = (date: string, useDateTime: boolean) => {
        if (!date) return "";
        if (useDateTime) {
            // Convert to ISO format for datetime mode
            const dateObj = new Date(date);
            return dateObj.toISOString().slice(0, 19); // Remove milliseconds and timezone
        } else {
            // Return date-only format (YYYY-MM-DD)
            return date.slice(0, 10);
        }
    };

    const clearDateFilters = () => {
        setDateFrom("");
        setDateTo("");
        setUseDateTimeMode(false);
    };

    const setQuickDateRange = (days: number) => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - days);
        
        setDateFrom(from.toISOString().slice(0, 10)); // YYYY-MM-DD format
        setDateTo(to.toISOString().slice(0, 10));
        setUseDateTimeMode(false);
    };

    const handleDateRangeChange = (selectedRange: SelectOption) => {
        setDateRangeFilter(selectedRange);
        
        if (selectedRange.id === 0) {
            // All Time - clear date filters
            setDateFrom("");
            setDateTo("");
            setUseDateTimeMode(false);
        } else if (selectedRange.id === 1) {
            // Last 7 days
            setQuickDateRange(7);
        } else if (selectedRange.id === 2) {
            // Last 30 days
            setQuickDateRange(30);
        } else if (selectedRange.id === 3) {
            // Last 90 days
            setQuickDateRange(90);
        } else if (selectedRange.id === 4) {
            // Custom - don't auto-set dates, let user choose
            setDateFrom("");
            setDateTo("");
            setUseDateTimeMode(false);
        }
    };

    const filteredCallLogs = useMemo(() => {
        return callLogsData.filter(log => {
            const matchesSearch = 
                (log.session_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.participant_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.agent_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (!!log.from_number && log.from_number.includes(searchTerm)) ||
                (!!log.to_number && log.to_number.includes(searchTerm));
            
            const matchesAssistant = assistantFilter.id === 0 || log.agent_name === assistantFilter.name;
            const matchesStatus = statusFilter.id === 0 || log.status === statusFilter.name;
            
            return matchesSearch && matchesAssistant && matchesStatus;
        });
    }, [searchTerm, assistantFilter, statusFilter, callLogsData]);


    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: "bg-primary-02/20 text-primary-02 border border-primary-02/30",
            completed: "bg-green-500/20 text-green-500 border border-green-500/30",
            expired: "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30"
        };
        return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    };

    const getStatusBgColor = (status: string) => {
        const statusColors = {
            active: "bg-primary-02",
            completed: "bg-green-500",
            expired: "bg-[#FFB020]"
        };
        return statusColors[status as keyof typeof statusColors] || "bg-gray-400";
    };

    const getAgentInitial = (name?: string | null) => {
        if (typeof name !== 'string' || name.length === 0) return '?';
        return name.charAt(0);
    };

    const formatStatusLabel = (status?: string | null) => {
        if (typeof status !== 'string' || status.length === 0) return '-';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit', hour12: true});
    };

    const getDuration = (createdAt: string, lastAccessed: string) => {
        const start = new Date(createdAt);
        const end = new Date(lastAccessed);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        return `${diffMins}m ${diffSecs}s`;
    };

    // Helper functions for recording signed URL
    const isRecordingAccessible = (log: CallLog) => {
        if (!log.recording_signed_url || !log.recording_expires_at) return false;
        const expirationTime = new Date(log.recording_expires_at);
        const now = new Date();
        return now < expirationTime;
    };

    const getExpirationStatus = (log: CallLog) => {
        if (!log.recording_expires_at) return null;
        
        const expirationTime = new Date(log.recording_expires_at);
        const now = new Date();
        const diffMs = expirationTime.getTime() - now.getTime();
        
        if (diffMs <= 0) {
            return { expired: true, message: "Expired - refresh page to get new link" };
        }
        
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 0) {
            return { expired: false, message: `Expires in ${diffHours}h ${diffMins}m` };
        } else if (diffMins > 0) {
            return { expired: false, message: `Expires in ${diffMins}m` };
        } else {
            const diffSecs = Math.floor(diffMs / 1000);
            return { expired: false, message: `Expires in ${diffSecs}s` };
        }
    };

    // Download recording function
    const downloadRecording = async (sessionId: string) => {
        try {
            setDownloadingSessionId(sessionId);
            const response = await callLogsAPI.downloadRecording(sessionId);
            
            // Check if response has the expected structure based on user's example
            if (response.success && response.data && response.data.download_url) {
                const { download_url, filename } = response.data;
                
                // Create a temporary link and click it
                const link = document.createElement('a');
                link.href = download_url;
                link.download = filename || `recording_${sessionId}.ogg`;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success('Recording download started');
            } else if (response.data && response.data.download_url) {
                // Fallback for different response structure
                const { download_url, filename } = response.data;
                
                const link = document.createElement('a');
                link.href = download_url;
                link.download = filename || `recording_${sessionId}.ogg`;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success('Recording download started');
            } else {
                console.error('Invalid response structure:', response);
                toast.error('Download URL not available');
            }
        } catch (error: any) {
            console.error('Error downloading recording:', error);
            toast.error(error.response?.data?.message || 'Failed to download recording');
        } finally {
            setDownloadingSessionId(null);
        }
    };

    const handleViewTranscription = (callLog: CallLog) => {
        setSelectedCallLog(callLog);
        setIsTranscriptionModalOpen(true);
    };

    // Skeleton loader component
    const SkeletonTableRow = () => (
        <TableRow>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            </td>
        </TableRow>
    );

    return (
        <Layout title="Call Logs">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-t-primary">Call Logs</h1>
                        <p className="text-sm text-t-secondary mt-1">
                            Monitor and analyze all call activities and performance metrics
                        </p>
                        <p className="text-xs text-t-tertiary mt-1">
                            <Icon name="info" className="w-3 h-3 inline mr-1" />
                            Recording links expire periodically. Use the refresh button to get new secure links.
                        </p>
                    </div>
                </div>

                {/* Call Logs Table */}
                <Card title="Call Logs" className="p-6 flex flex-col lg:h-[calc(100vh-200px)]">
                    <div className="mb-6 flex-shrink-0">
                        <div className="flex flex-col gap-4">
                            {/* Main Filters Row */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    <Search
                                        placeholder="Search calls..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full lg:w-64"
                                        isGray
                                    />
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Select
                                            value={assistantFilter}
                                            onChange={setAssistantFilter}
                                            options={[
                                                { id: 0, name: "All Assistants" },
                                                ...agents.map(agent => ({
                                                    id: agent.id,
                                                    name: agent.name
                                                }))
                                            ]}
                                            className="w-full sm:w-40"
                                        />
                                        <Select
                                            value={statusFilter}
                                            onChange={setStatusFilter}
                                            options={[
                                                { id: 0, name: "All Status" },
                                                { id: 1, name: "active" },
                                                { id: 2, name: "completed" },
                                                { id: 3, name: "expired" }
                                            ]}
                                            className="w-full sm:w-40"
                                        />
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                    <Button className="w-full sm:w-auto" onClick={refreshCallLogs}>
                                        <Icon name="refresh" className="w-4 h-4 mr-2" />
                                        Refresh
                                    </Button>
                                    <Button className="w-full sm:w-auto">
                                        <Icon name="download" className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Advanced Filters Toggle */}
                            <div className="flex items-start justify-start lg:justify-start gap-3">
                                <span className="text-sm text-t-secondary">Advanced Filters</span>
                                <Switch
                                    checked={showAdvancedFilters}
                                    onChange={setShowAdvancedFilters}
                                />
                            </div>
                        </div>
                        
                        {/* Date Filtering Section - Only show when Advanced Filters is enabled */}
                        {showAdvancedFilters && (
                            <div className="mt-4 p-4 bg-b-surface2 rounded-lg border border-s-subtle">
                                <div className="flex items-center gap-2 pb-3">
                                    <Icon name="calendar" className="w-4 h-4 text-t-secondary" />
                                    <h1 className="text-md font-bold text-t-primary">Date Range Filter</h1>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Date Range Dropdown */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-t-secondary">Quick Range:</label>
                                        <Select
                                            value={dateRangeFilter}
                                            onChange={handleDateRangeChange}
                                            options={[
                                                { id: 0, name: "All Time" },
                                                { id: 1, name: "Last 7 days" },
                                                { id: 2, name: "Last 30 days" },
                                                { id: 3, name: "Last 90 days" },
                                                { id: 4, name: "Custom Range" }
                                            ]}
                                            className="w-full sm:w-auto sm:min-w-[150px]"
                                        />
                                    </div>
                                    
                                    {/* Custom Date Inputs - Only show when Custom Range is selected */}
                                    {dateRangeFilter.id === 4 && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm text-t-secondary">From:</label>
                                                    <input
                                                        type={useDateTimeMode ? "datetime-local" : "date"}
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                        className="h-12 px-4.5 border border-s-stroke2 rounded-full text-body-2 text-t-primary outline-none transition-colors hover:border-s-highlight focus:border-s-highlight placeholder:text-t-secondary/50 w-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm text-t-secondary">To:</label>
                                                    <input
                                                        type={useDateTimeMode ? "datetime-local" : "date"}
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                        className="h-12 px-4.5 border border-s-stroke2 rounded-full text-body-2 text-t-primary outline-none transition-colors hover:border-s-highlight focus:border-s-highlight placeholder:text-t-secondary/50 w-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-center sm:justify-start">
                                                <Checkbox
                                                    checked={useDateTimeMode}
                                                    onChange={setUseDateTimeMode}
                                                    label="Use exact time"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Date Filter Info */}
                                <div className="mt-4 text-caption text-t-tertiary">
                                    <Icon name="info" className="w-3 h-3 inline mr-1" />
                                    {useDateTimeMode ? 
                                        "Exact timestamps: Use precise date and time filtering" :
                                        "Date-only: Includes entire days (00:00:00 to 23:59:59)"
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Scrollable Table Container */}
                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                        {loading ? (
                            <>
                                {/* Desktop Table Skeleton */}
                                <div className="hidden lg:block flex-1 min-h-0 flex flex-col">
                                    <div className="overflow-x-auto">
                                        <div className="min-w-full">
                                            {/* Table Header Skeleton */}
                                            <div className="text-caption text-t-tertiary/80 border-b border-s-subtle flex-shrink-0">
                                                <div className="grid grid-cols-7 gap-4 py-3 px-4">
                                                    <div className="font-medium text-t-secondary">Session ID</div>
                                                    <div className="font-medium text-t-secondary">Agent</div>
                                                    <div className="font-medium text-t-secondary">Participant</div>
                                                    <div className="font-medium text-t-secondary">Phone Numbers</div>
                                                    <div className="font-medium text-t-secondary">Duration</div>
                                                    <div className="font-medium text-t-secondary">Status</div>
                                                    <div className="font-medium text-t-secondary">Created</div>
                                                </div>
                                            </div>
                                            
                                            {/* Table Body Skeleton */}
                                            <div className="flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                                    <div key={i} className="grid grid-cols-7 gap-4 py-2 px-4 border-b border-s-subtle">
                                                        {/* Session ID */}
                                                        <div className="flex items-center">
                                                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                                        </div>
                                                        {/* Agent */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                        </div>
                                                        {/* Participant */}
                                                        <div className="flex items-center">
                                                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                        </div>
                                                        {/* Phone Numbers */}
                                                        <div className="flex items-center">
                                                            <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                                                        </div>
                                                        {/* Duration */}
                                                        <div className="flex items-center">
                                                            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                                                        </div>
                                                        {/* Status */}
                                                        <div className="flex items-center">
                                                            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                                        </div>
                                                        {/* Created */}
                                                        <div className="flex items-center">
                                                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                            {/* Mobile Cards Skeleton */}
                            <div className="lg:hidden space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="border border-s-subtle rounded-lg p-4">
                                        <div className="animate-pulse">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                </div>
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                <div className="h-4 bg-gray-200 rounded w-28"></div>
                                                <div className="flex gap-2">
                                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                            ) : (
                            <>
                                {/* Desktop Table Layout */}
                                <div className="hidden lg:block">
                                    <div className="">
                                        <div className="min-w-full">
                                            {/* Table Header */}
                                            <div className="text-caption text-t-tertiary/80 border-b border-s-subtle">
                                                <div className="grid grid-cols-8 gap-4 py-3 px-4">
                                                    <div className="font-small text-t-secondary">Session ID</div>
                                                    <div className="font-medium text-t-secondary">Agent</div>
                                                    <div className="font-medium text-t-secondary">Participant</div>
                                                    <div className="font-medium text-t-secondary">Phone Numbers</div>
                                                    <div className="font-medium text-t-secondary">Duration</div>
                                                    <div className="font-medium text-t-secondary">Status</div>
                                                    <div className="font-medium text-t-secondary">Recording</div>
                                                    <div className="font-medium text-t-secondary">Created</div>
                                                </div>
                                            </div>
                                            
                                            {/* Table Body with Fixed Height and Scrolling */}
                                            <div className="">
                                                {filteredCallLogs.map((log) => (
                                                    <div key={log.session_id} className="grid grid-cols-8 gap-4 py-2 px-4 border-b border-s-subtle text-body-2 hover:bg-b-surface2 transition-colors">
                                                        {/* Session ID */}
                                                        <div className="flex items-center min-w-0">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium text-t-primary truncate" title={log.session_id}>
                                                                    {log.session_id.substring(0, 8)}...
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* Agent */}
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                                <Icon name="robot" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium text-t-primary truncate" title={log.agent_name}>{log.agent_name || 'Unknown'}</p>
                                                            </div>
                                                        </div>
                                                        {/* Participant */}
                                                        <div className="flex items-center">
                                                            <div className="text-t-primary max-w-xs truncate">
                                                                {log.participant_name}
                                                            </div>
                                                        </div>
                                                        {/* Phone Numbers */}
                                                        <div className="flex items-center">
                                                            <div className="text-t-primary max-w-xs truncate">
                                                                {log.from_number && log.to_number ? (
                                                                    <div className="text-xs text-t-secondary">
                                                                        <div className="truncate">From: {log.from_number}</div>
                                                                        <div className="truncate">To: {log.to_number}</div>
                                                                    </div>
                                                                ) : log.from_number ? (
                                                                    <div className="text-xs text-t-secondary">From: {log.from_number}</div>
                                                                ) : log.to_number ? (
                                                                    <div className="text-xs text-t-secondary">To: {log.to_number}</div>
                                                                ) : (
                                                                    <div className="text-gray-400">No numbers</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Duration */}
                                                        <div className="flex items-center">
                                                            <div className="text-t-primary">
                                                                {getDuration(log.created_at, log.last_accessed)}
                                                            </div>
                                                        </div>
                                                        {/* Status */}
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${getStatusBgColor(log.status)}`}></div>
                                                            <span className="text-sm capitalize">{formatStatusLabel(log.status)}</span>
                                                        </div>
                                                        {/* Recording */}
                                                        <div className="flex items-center gap-2">
                                                            {log.recording_signed_url || log.recording_url ? (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleViewTranscription(log)}
                                                                        className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                                        title="View Transcription"
                                                                    >
                                                                        <Icon name="eye" className="w-4 h-4 fill-t-secondary" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => {
                                                                            if (isRecordingAccessible(log) && log.recording_signed_url) {
                                                                                window.open(log.recording_signed_url, '_blank');
                                                                            }
                                                                        }}
                                                                        disabled={!isRecordingAccessible(log)}
                                                                        className={`w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors ${
                                                                            !isRecordingAccessible(log) ? 'opacity-50 cursor-not-allowed' : ''
                                                                        }`}
                                                                        title="Play Recording"
                                                                    >
                                                                        <Icon name="play" className="w-4 h-4 fill-t-secondary" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => downloadRecording(log.session_id)}
                                                                        disabled={downloadingSessionId === log.session_id}
                                                                        className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                                        title="Download Recording"
                                                                    >
                                                                        {downloadingSessionId === log.session_id ? (
                                                                            <Icon name="loader" className="w-4 h-4 fill-t-secondary animate-spin" />
                                                                        ) : (
                                                                            <Icon name="download" className="w-4 h-4 fill-t-secondary" />
                                                                        )}
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">No recording</span>
                                                            )}
                                                        </div>
                                                        {/* Created */}
                                                        <div className="flex items-center">
                                                            <div className="text-t-primary">
                                                                {formatDate(log.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-3">
                                {filteredCallLogs.map((log) => (
                                    <div key={log.session_id} className="border border-s-subtle rounded-lg p-4 bg-b-surface1">
                                        {/* Header with Session ID and Status */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-t-primary text-sm">
                                                    {log.session_id.substring(0, 8)}...
                                                </span>
                                            </div>
                                            <Badge className={`px-2 py-1 text-xs font-medium ${getStatusBadge(log.status || '')}`}>
                                                {formatStatusLabel(log.status)}
                                            </Badge>
                                        </div>
                                        
                                        {/* Agent Info */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-01 to-[#8B5CF6] rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                                                {getAgentInitial(log.agent_name)}
                                            </div>
                                            <span className="text-t-primary font-medium">{log.agent_name || 'Unknown'}</span>
                                        </div>
                                        
                                        {/* Participant */}
                                        <div className="mb-3">
                                            <div className="text-xs text-t-secondary mb-1">Participant</div>
                                            <div className="text-t-primary font-medium truncate" title={log.participant_name}>{log.participant_name}</div>
                                        </div>
                                        
                                        {/* Phone Numbers */}
                                        <div className="mb-3">
                                            <div className="text-xs text-t-secondary mb-1">Phone Numbers</div>
                                            <div className="text-xs text-t-secondary">
                                                {log.from_number && <div>From: {log.from_number}</div>}
                                                {log.to_number && <div>To: {log.to_number}</div>}
                                                {!log.from_number && !log.to_number && <div className="text-gray-400">No numbers</div>}
                                            </div>
                                        </div>
                                        
                                        {/* Recording */}
                                        <div className="mb-3">
                                            <div className="text-xs text-t-secondary mb-1">Recording</div>
                                            {log.recording_signed_url || log.recording_url ? (
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            className="px-2 py-1.5 text-xs bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-500/20 rounded-md flex items-center gap-1"
                                                            onClick={() => handleViewTranscription(log)}
                                                            title="View Transcription"
                                                        >
                                                            <Icon name="eye" className="w-3 h-3" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            className={`px-2 py-1.5 text-xs rounded-md flex items-center gap-1 ${
                                                                isRecordingAccessible(log)
                                                                    ? 'bg-primary-01/10 text-primary-01 hover:bg-primary-01/20 border border-primary-01/20'
                                                                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                                            }`}
                                                            onClick={() => {
                                                                if (isRecordingAccessible(log) && log.recording_signed_url) {
                                                                    window.open(log.recording_signed_url, '_blank');
                                                                }
                                                            }}
                                                            disabled={!isRecordingAccessible(log)}
                                                            title="Play Recording"
                                                        >
                                                            <Icon name="play" className="w-3 h-3" />
                                                            Play
                                                        </Button>
                                                        <Button
                                                            className="px-2 py-1.5 text-xs bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20 rounded-md flex items-center gap-1"
                                                            onClick={() => downloadRecording(log.session_id)}
                                                            disabled={downloadingSessionId === log.session_id}
                                                            title={downloadingSessionId === log.session_id ? 'Downloading...' : 'Download Recording'}
                                                        >
                                                            {downloadingSessionId === log.session_id ? (
                                                                <Icon name="loader" className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <Icon name="download" className="w-3 h-3" />
                                                            )}
                                                            {downloadingSessionId === log.session_id ? 'Downloading...' : 'Download'}
                                                        </Button>
                                                    </div>
                                                    {(() => {
                                                        const expirationStatus = getExpirationStatus(log);
                                                        return expirationStatus && (
                                                            <div className={`text-xs ${expirationStatus.expired ? 'text-red-500' : 'text-gray-500'}`}>
                                                                <Icon name="clock" className="w-3 h-3 inline mr-1" />
                                                                {expirationStatus.message}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">No recording available</span>
                                            )}
                                        </div>
                                        
                                        {/* Bottom row with Duration and Date */}
                                        <div className="flex justify-between items-center pt-3 border-t border-s-subtle">
                                            <div className="text-xs text-t-secondary">
                                                {getDuration(log.created_at, log.last_accessed)}
                                            </div>
                                            <div className="text-xs text-t-tertiary">
                                                {formatDate(log.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                        )}
                        
                        {filteredCallLogs.length === 0 && !loading && (
                            <div className="text-center py-8">
                                <Icon name="search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-t-secondary">No call logs found matching your criteria.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {pageMeta && !loading && (
                            <div className="flex items-center justify-between py-3 px-6 border-t border-s-subtle">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-t-secondary">
                                        Page <span className="font-semibold text-t-primary">{pageMeta.page}</span> of <span className="font-semibold">{pageMeta.total_pages}</span>
                                    </span>
                                    <span className="text-xs text-t-tertiary">
                                        ({pageMeta.total.toLocaleString()} total items)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        className="px-4 py-2 text-sm" 
                                        onClick={() => loadCallLogs(currentPage - 1)} 
                                        disabled={currentPage <= 1}
                                    >
                                        <Icon name="arrow" className="w-4 h-4 mr-2 rotate-180" />
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1 px-3 py-2 bg-b-surface2 rounded-md border border-s-subtle">
                                        <span className="text-sm font-semibold text-t-primary min-w-[24px] text-center">
                                            {currentPage}
                                        </span>
                                        <span className="text-xs text-t-tertiary">of</span>
                                        <span className="text-sm font-medium text-t-secondary">
                                            {pageMeta.total_pages}
                                        </span>
                                    </div>
                                    <Button 
                                        className="px-4 py-2 text-sm" 
                                        onClick={() => loadCallLogs(currentPage + 1)} 
                                        disabled={pageMeta.page >= pageMeta.total_pages}
                                    >
                                        Next
                                        <Icon name="arrow" className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            
            {/* Transcription Modal */}
            <Modal 
                open={isTranscriptionModalOpen} 
                onClose={() => setIsTranscriptionModalOpen(false)} 
                isSlidePanel
            >
                {/* Header */}
                <div className="flex items-center justify-between h-20 pl-10 pr-20 pt-5 pb-3 text-h5 max-md:h-18 max-md:pt-3 max-md:pl-9">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-h5 font-semibold">Call Transcription</h2>
                        {selectedCallLog && (
                            <p className="text-sm text-t-secondary truncate">
                                {selectedCallLog.session_id.substring(0, 8)}... • {selectedCallLog.agent_name}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="h-[calc(100svh-5rem)] px-4 pb-4 overflow-y-auto max-md:h-[calc(100svh-4.5rem)] max-md:px-3">
                    {selectedCallLog && (
                        <div className="space-y-6">
                            {/* Call Details */}
                            <Card className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                                            <Icon name="robot" className="w-5 h-5 fill-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-t-primary">{selectedCallLog.agent_name}</h3>
                                            <p className="text-sm text-t-secondary">AI Agent</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-s-subtle">
                                        <div>
                                            <p className="text-xs text-t-secondary mb-1">Session ID</p>
                                            <p className="text-sm font-mono text-t-primary">{selectedCallLog.session_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-t-secondary mb-1">Duration</p>
                                            <p className="text-sm text-t-primary">{getDuration(selectedCallLog.created_at, selectedCallLog.last_accessed)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-t-secondary mb-1">Participant</p>
                                            <p className="text-sm text-t-primary">{selectedCallLog.participant_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-t-secondary mb-1">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${getStatusBgColor(selectedCallLog.status)}`}></div>
                                                <span className="text-sm capitalize">{formatStatusLabel(selectedCallLog.status)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Recording Player */}
                            {(selectedCallLog.recording_signed_url || selectedCallLog.recording_url) && (
                                <Card className="p-4">
                                    <h3 className="text-lg font-medium text-t-primary mb-4">Recording</h3>
                                    <div className="space-y-4">
                                        {/* Audio Player */}
                                        {isRecordingAccessible(selectedCallLog) && selectedCallLog.recording_signed_url ? (
                                            <div className="space-y-3">
                                                <audio 
                                                    controls 
                                                    className="w-full h-12 rounded-lg"
                                                    preload="metadata"
                                                >
                                                    <source src={selectedCallLog.recording_signed_url} type="audio/ogg" />
                                                    <source src={selectedCallLog.recording_signed_url} type="audio/mpeg" />
                                                    <source src={selectedCallLog.recording_signed_url} type="audio/wav" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-primary-01/10 rounded-lg flex items-center justify-center">
                                                            <Icon name="play" className="w-4 h-4 fill-primary-01" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-t-primary">Call Recording</p>
                                                            <p className="text-xs text-t-secondary">Use controls above to play</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => downloadRecording(selectedCallLog.session_id)}
                                                        disabled={downloadingSessionId === selectedCallLog.session_id}
                                                        className="w-10 h-10 border rounded-full border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                        title="Download Recording"
                                                    >
                                                        {downloadingSessionId === selectedCallLog.session_id ? (
                                                            <Icon name="loader" className="w-4 h-4 fill-t-secondary animate-spin" />
                                                        ) : (
                                                            <Icon name="download" className="w-4 h-4 fill-t-secondary" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <Icon name="play" className="w-4 h-4 fill-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-600">Recording Unavailable</p>
                                                    <p className="text-xs text-gray-500">Recording has expired or is not accessible</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Expiration Status */}
                                        {(() => {
                                            const expirationStatus = getExpirationStatus(selectedCallLog);
                                            return expirationStatus && (
                                                <div className={`text-xs ${expirationStatus.expired ? 'text-red-500' : 'text-gray-500'}`}>
                                                    <Icon name="clock" className="w-3 h-3 inline mr-1" />
                                                    {expirationStatus.message}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </Card>
                            )}

                            {/* Transcription */}
                            <Card className="p-4">
                                <h3 className="text-lg font-medium text-t-primary mb-4">Conversation Transcription</h3>
                                <div className="space-y-4">
                                    {/* Placeholder transcription - replace with actual API call */}
                                    <div className="bg-b-surface2 rounded-lg p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                    <Icon name="robot" className="w-4 h-4 fill-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-t-primary mb-1">Agent</p>
                                                    <p className="text-sm text-t-secondary">
                                                        Hello! I'm your AI assistant. How can I help you today?
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-xs font-semibold flex-shrink-0">
                                                    U
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-t-primary mb-1">User</p>
                                                    <p className="text-sm text-t-secondary">
                                                        I need help with my account settings.
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                    <Icon name="robot" className="w-4 h-4 fill-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-t-primary mb-1">Agent</p>
                                                    <p className="text-sm text-t-secondary">
                                                        I'd be happy to help you with your account settings. What specific aspect would you like to change?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Note about transcription */}
                                    {/* <div className="text-xs text-t-tertiary bg-b-surface2 rounded-lg p-3">
                                        <Icon name="info" className="w-3 h-3 inline mr-1" />
                                        This is a sample transcription. In a real implementation, this would be fetched from your API.
                                    </div> */}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </Modal>
        </Layout>
    );
};

export default CallLogsPage;
