"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Element } from "react-scroll";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import Badge from "@/components/Badge";
import { Link } from "react-scroll";
import { usePhoneNumbers, PhoneNumber } from "@/hooks/usePhoneNumbers";
import { agentAPI } from "@/services/api";
import DeleteModal from "../../../components/DeleteModal";
import DropdownMenu from "../../../components/DropdownMenu";

const ElementWithOffset = ({
    className,
    name,
    children,
}: {
    className?: string;
    name: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="relative">
            <Element
                className={`absolute -top-21 left-0 right-0 ${className || ""}`}
                name={name}
            ></Element>
            {children}
        </div>
    );
};

const PhoneNumberDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const phoneId = parseInt(params.id as string);
    
    const [phoneNumberData, setPhoneNumberData] = useState({
        label: "",
        smsEnabled: true,
        inboundWorkflow: { id: 1, name: "Default Workflow" },
        fallbackDestination: "",
        outboundType: "one-number",
        outboundNumber: "",
        outboundAssistant: { id: 1, name: "UXPENDIT-Male" },
        outboundWorkflow: { id: 1, name: "Default Workflow" }
    });
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [phoneToDelete, setPhoneToDelete] = useState<PhoneNumber | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [agents, setAgents] = useState<Array<{ id: number; name: string; status: string; agent_type: string }>>([]);
    const [inboundAssistant, setInboundAssistant] = useState<{ id: number; name: string } | null>(null);
    const [agentsLoading, setAgentsLoading] = useState(false);
    const [isManualAssignment, setIsManualAssignment] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    
    const {
        phoneNumbers,
        loading,
        error,
        getPhoneNumbers,
        updatePhoneNumber,
        deletePhoneNumber,
        assignPhoneNumber,
        unassignPhoneNumber
    } = usePhoneNumbers();

    // Find the current phone number
    const currentPhoneNumber = phoneNumbers.find(phone => phone.id === phoneId);

    // Load phone numbers and agents on component mount
    useEffect(() => {
        getPhoneNumbers();
        fetchAgents();
    }, [getPhoneNumbers]);

    // Fetch agents from API
    const fetchAgents = async () => {
        setAgentsLoading(true);
        try {
            const agentsData = await agentAPI.getAgents();
            setAgents(agentsData);
        } catch (error) {
            console.error('Failed to fetch agents:', error);
        } finally {
            setAgentsLoading(false);
        }
    };

    // Update phone number data when current phone number changes
    useEffect(() => {
        if (currentPhoneNumber) {
            setPhoneNumberData({
                label: currentPhoneNumber.label || "",
                smsEnabled: currentPhoneNumber.is_active,
                inboundWorkflow: { id: 1, name: "Default Workflow" },
                fallbackDestination: "",
                outboundType: "one-number",
                outboundNumber: "",
                outboundAssistant: { id: 1, name: "UXPENDIT-Male" },
                outboundWorkflow: { id: 1, name: "Default Workflow" }
            });
            
            // Only set the inbound assistant if we're not in the middle of a manual assignment
            if (!isManualAssignment) {
                if (currentPhoneNumber.agent) {
                    setInboundAssistant({ 
                        id: currentPhoneNumber.agent.id, 
                        name: currentPhoneNumber.agent.name 
                    });
                } else {
                    setInboundAssistant(null);
                }
            }
            
            // Reset unsaved changes when phone number changes
            setHasUnsavedChanges(false);
        }
    }, [currentPhoneNumber]);

    // Watch for changes in form data and check for unsaved changes
    useEffect(() => {
        if (!justSaved) {
            checkForUnsavedChanges();
        }
    }, [phoneNumberData.label, inboundAssistant, currentPhoneNumber]);

    // Add keyboard shortcut for saving (Ctrl+S)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                if (hasUnsavedChanges && !isSaving) {
                    handleSave();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, isSaving]);

    // Create navigation based on import_type
    const navigation = [
        {
            title: "Phone Number Details",
            icon: "phone",
            description: "Basic phone number information",
            to: "phone-details",
        },
        // Show Inbound Settings only for inbound or undefined import_type (backward compatibility)
        ...((!currentPhoneNumber?.import_type || currentPhoneNumber?.import_type === 'inbound') ? [{
            title: "Inbound Settings",
            icon: "inbound",
            description: "Configure incoming call settings",
            to: "inbound-settings",
        }] : []),
        // Show Outbound Settings only for outbound import_type
        ...(currentPhoneNumber?.import_type === 'outbound' ? [{
            title: "Outbound Settings",
            icon: "outbound",
            description: "Configure outgoing call settings",
            to: "outbound-settings",
        }] : []),
    ];

    const handleBackToList = () => {
        router.push('/phone-numbers');
    };

    const handleLabelChange = (value: string) => {
        setPhoneNumberData(prev => ({ ...prev, label: value }));
    };

    const handleAgentChange = (value: any) => {
        setInboundAssistant(value);
    };

    const checkForUnsavedChanges = () => {
        if (!currentPhoneNumber) return;
        
        const labelChanged = phoneNumberData.label !== (currentPhoneNumber.label || '');
        const currentAgentId = currentPhoneNumber.agent?.id || null;
        const selectedAgentId = inboundAssistant?.id || null;
        const agentChanged = selectedAgentId !== currentAgentId;
        
        setHasUnsavedChanges(labelChanged || agentChanged);
    };

    const handleSave = async () => {
        if (!currentPhoneNumber) return;
        
        // Validate label
        if (!phoneNumberData.label.trim()) {
            setSaveMessage({ type: 'error', message: 'Label is required' });
            return;
        }
        
        setIsSaving(true);
        setSaveMessage(null);
        setIsManualAssignment(true);
        
        try {
            const operations = [];
            
            // 1. Label update (if changed)
            if (phoneNumberData.label !== currentPhoneNumber.label) {
                operations.push(
                    updatePhoneNumber(currentPhoneNumber.id, {
                        label: phoneNumberData.label.trim()
                    })
                );
            }
            
            // 2. Agent assignment (if changed)
            const currentAgent = currentPhoneNumber.agent;
            const selectedAgent = inboundAssistant;
            
            
            if (currentAgent && !selectedAgent) {
                // Unassign
                operations.push(unassignPhoneNumber(currentPhoneNumber.id));
            } else if (selectedAgent && (!currentAgent || currentAgent.id !== selectedAgent.id)) {
                // Assign
                operations.push(assignPhoneNumber(currentPhoneNumber.id, selectedAgent.id));
            }
            
            // If no operations needed, just return
            if (operations.length === 0) {
                setHasUnsavedChanges(false);
                setSaveMessage({ type: 'info', message: 'No changes to save' });
                return;
            }
            
            // Execute all operations in parallel
            const results = await Promise.allSettled(operations);
            
            // Analyze results
            const successful = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');
            
            if (failed.length === 0) {
                // All operations succeeded
                setHasUnsavedChanges(false);
                setJustSaved(true);
                setSaveMessage({ type: 'success', message: 'Phone number updated successfully!' });
                
                // Update inboundAssistant state to reflect the new assignment
                // This ensures the dropdown shows the correct selected agent
                if (selectedAgent) {
                    // If we assigned an agent, update the state to show the selected agent
                    setInboundAssistant(selectedAgent);
                } else if (!currentAgent) {
                    // If we unassigned (no current agent and no selected agent), clear the selection
                    setInboundAssistant(null);
                }
                // If there was a current agent and we selected a different one, 
                // the selectedAgent should already be set correctly above
                
                // Clear the flags after a short delay
                setTimeout(() => {
                    setIsManualAssignment(false);
                    setJustSaved(false);
                }, 200);
            } else if (successful.length > 0) {
                // Partial success
                const successCount = successful.length;
                const failCount = failed.length;
                setSaveMessage({ 
                    type: 'warning', 
                    message: `${successCount} update(s) succeeded, ${failCount} failed. Please try again.` 
                });
            } else {
                // All operations failed
                const errorMessages = failed.map(r => r.reason?.message || 'Unknown error');
                setSaveMessage({ 
                    type: 'error', 
                    message: `Failed to update phone number: ${errorMessages.join('; ')}` 
                });
            }
            
            // Clear message after 5 seconds
            setTimeout(() => setSaveMessage(null), 5000);
            
        } catch (error) {
            console.error('Failed to save phone number:', error);
            setSaveMessage({ 
                type: 'error', 
                message: `Unexpected error: ${error instanceof Error ? error.message : 'Failed to update phone number'}` 
            });
            setIsManualAssignment(false);
            setJustSaved(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = () => {
        if (currentPhoneNumber) {
            setPhoneToDelete(currentPhoneNumber);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!phoneToDelete) return;
        
        try {
            await deletePhoneNumber(phoneToDelete.id);
            setIsDeleteModalOpen(false);
            setPhoneToDelete(null);
            router.push('/phone-numbers');
        } catch (error) {
            console.error('Failed to delete phone number:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setPhoneToDelete(null);
    };

    const handleMakeCall = () => {
        console.log("Making call...");
    };

    const handleScheduleCall = () => {
        console.log("Scheduling call...");
    };

    if (loading) {
        return (
            <Layout title="Phone Numbers">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-01"></div>
                        <span className="text-t-secondary">Loading phone number...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!currentPhoneNumber) {
        return (
            <Layout title="Phone Numbers">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-t-primary mb-2">
                            Phone Number Not Found
                        </h3>
                        <p className="text-sm text-t-secondary mb-4">
                            The phone number you're looking for doesn't exist.
                        </p>
                        <Button onClick={handleBackToList}>
                            Back to Phone Numbers
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Phone Numbers">
            <div className="flex items-start max-lg:block">
                {/* Custom Left Sidebar */}
                <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden p-6">
                    {/* Back Button */}
                    <Button 
                        isStroke 
                        onClick={handleBackToList}
                        className="w-full mb-6"
                    >
                        <Icon name="arrow-left" className="w-4 h-4 mr-2" />
                        Back to List
                    </Button>

                    {/* Navigation Menu */}
                    <div className="flex flex-col gap-1">
                        {navigation.map((item, index) => (
                            <Link
                                className="group relative flex items-center h-18 px-3 cursor-pointer"
                                activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
                                key={index}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                isDynamic={true}
                                spy={true}
                                offset={-5.5}
                            >
                                <div className="box-hover"></div>
                                <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                                    <Icon
                                        className="fill-t-secondary"
                                        name={item.icon}
                                    />
                                </div>
                                <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                                    <div className="text-button">{item.title}</div>
                                    <div className="mt-1 truncate text-caption text-t-secondary">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Phone Numbers List */}
                    <div className="mt-6 space-y-2">
                        {phoneNumbers.map((phone) => (
                            <div
                                key={phone.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    currentPhoneNumber.id === phone.id
                                        ? 'bg-primary-01/10 border border-primary-01/20'
                                        : 'hover:bg-b-surface1'
                                }`}
                                onClick={() => router.push(`/phone-numbers/${phone.id}`)}
                            >
                                <div className="text-sm font-medium text-t-primary">
                                    {phone.phone_number}
                                </div>
                                <div className="text-xs text-t-secondary">
                                    {phone.label || 'No label'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold text-t-primary">
                                        {currentPhoneNumber.phone_number}
                                    </h1>
                                    {hasUnsavedChanges && (
                                        <Icon name="alert_triangle" className="w-5 h-5 text-orange-500" />
                                    )}
                                </div>
                                <p className="text-sm text-t-secondary">
                                    {currentPhoneNumber.label || 'No label assigned'}
                                </p>
                            </div>
                            <Badge 
                                variant={currentPhoneNumber.is_active ? "success" : "secondary"}
                            >
                                {currentPhoneNumber.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-t-secondary">
                                <span>ID: {currentPhoneNumber.id}</span>
                                <button className="w-8 h-8 p-1 border rounded-full border-gray-300 hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors">
                                    <Icon name="copy" className="w-4 h-4" />
                                </button>
                            </div>
                            <DropdownMenu
                                items={[
                                    {
                                        icon: "trash",
                                        label: "Delete",
                                        onClick: handleDeleteClick,
                                        className: "text-red-500 hover:text-red-700"
                                    }
                                ]}
                            />
                            <Button 
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges}
                                className={`transition-all duration-200 ${
                                    hasUnsavedChanges 
                                        ? 'opacity-100 cursor-pointer' 
                                        : 'opacity-50 cursor-not-allowed'
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="save" className="w-4 h-4 mr-2" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Save Message */}
                    {saveMessage && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                            saveMessage.type === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : saveMessage.type === 'error'
                                ? 'bg-red-50 border border-red-200 text-red-800'
                                : saveMessage.type === 'warning'
                                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                                : 'bg-blue-50 border border-blue-200 text-blue-800'
                        }`}>
                            <Icon 
                                name={
                                    saveMessage.type === 'success' ? 'check' 
                                    : saveMessage.type === 'error' ? 'warning'
                                    : saveMessage.type === 'warning' ? 'alert-triangle'
                                    : 'info'
                                } 
                                className="w-4 h-4" 
                            />
                            <span className="text-sm">{saveMessage.message}</span>
                            <button 
                                onClick={() => setSaveMessage(null)}
                                className="ml-auto text-current hover:opacity-70"
                            >
                                <Icon name="close" className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Phone Number Details Section */}
                    <ElementWithOffset name="phone-details">
                        <Card title="Phone Number Details" className="p-6">
                            <p className="text-sm text-t-secondary mb-4">
                                Give your phone number a descriptive name to help identify it in your list.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <Field
                                        label="Phone Number Label"
                                        placeholder="Enter a name for this phone number..."
                                        value={phoneNumberData.label}
                                        onChange={(e) => handleLabelChange(e.target.value)}
                                    />
                                </div>

                                {/* Import Type Indicator */}
                                <div className="flex items-center justify-between p-3 bg-b-surface1 border border-s-stroke2 rounded-lg">
                                    <div>
                                        <label className="text-button text-t-primary">Phone Number Type</label>
                                        <p className="text-caption text-t-secondary mt-1">
                                            {currentPhoneNumber?.import_type === 'outbound' 
                                                ? 'Configured for making outbound calls'
                                                : 'Configured for receiving inbound calls'
                                            }
                                        </p>
                                    </div>
                                    <Badge 
                                        variant={currentPhoneNumber?.import_type === 'outbound' ? 'warning' : 'success'}
                                        className="capitalize"
                                    >
                                        {currentPhoneNumber?.import_type || 'inbound'}
                                    </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-button text-t-primary">SMS Enabled</label>
                                        <p className="text-caption text-t-secondary mt-1">Enable or disable SMS messaging for this Twilio phone number</p>
                                    </div>
                                    <Switch
                                        checked={phoneNumberData.smsEnabled}
                                        onChange={(checked) => setPhoneNumberData({...phoneNumberData, smsEnabled: checked})}
                                    />
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Inbound Settings Section - Only show for inbound or undefined import_type */}
                    {(!currentPhoneNumber?.import_type || currentPhoneNumber?.import_type === 'inbound') && (
                    <ElementWithOffset name="inbound-settings">
                        <Card title="Inbound Settings" className="p-6">
                            <p className="text-sm text-t-secondary mb-4">
                                You can assign an assistant to the phone number so that whenever someone calls this phone number, the assistant will automatically be assigned to the call.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-button text-t-primary mb-4">
                                        Inbound Phone Number
                                    </label>
                                    <div className="flex items-center gap-2 px-4.5 py-3.5 bg-b-surface1 border border-s-stroke2 rounded-full">
                                        <span className="text-t-primary">{currentPhoneNumber.phone_number}</span>
                                        <Icon name="check" className="w-4 h-4 text-primary-02" />
                                    </div>
                                </div>
                                
                                <div>
                                    <Select
                                        label="Assistant"
                                        value={inboundAssistant}
                                        onChange={handleAgentChange}
                                        placeholder={agentsLoading ? "Loading assistants..." : "Select an assistant..."}
                                        options={agents.map(agent => ({
                                            id: agent.id,
                                            name: agent.name
                                        }))}
                                    />
                                    {agentsLoading && (
                                        <p className="text-xs text-t-secondary mt-1 flex items-center gap-1">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-t-secondary"></div>
                                            Loading assistants...
                                        </p>
                                    )}
                                </div>
                                
                                <Select
                                    label="Workflow"
                                    value={phoneNumberData.inboundWorkflow}
                                    onChange={(value) => setPhoneNumberData({...phoneNumberData, inboundWorkflow: value})}
                                    placeholder="Select Workflow..."
                                    options={[
                                        { id: 1, name: "Default Workflow" },
                                        { id: 2, name: "Support Workflow" }
                                    ]}
                                />
                                
                                <div>
                                    <label className="block text-button text-t-primary mb-4">
                                        Fallback Destination
                                    </label>
                                    <p className="text-sm text-t-secondary mb-2">
                                        Set a fallback destination for inbound calls when the assistant or squad is not available.
                                    </p>
                                    <div className="flex">
                                        <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-s-stroke2 rounded-l-full bg-b-surface1">
                                            <span className="text-sm">🇺🇸</span>
                                            <span className="text-sm text-t-secondary">+1</span>
                                        </div>
                                        <Field
                                            type="tel"
                                            className="flex-1"
                                            placeholder="Enter a phone number"
                                            value={phoneNumberData.fallbackDestination}
                                            onChange={(e) => setPhoneNumberData({...phoneNumberData, fallbackDestination: e.target.value})}
                                            classInput="rounded-l-none border-l-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>
                    )}

                    {/* Outbound Settings Section - Only show for outbound import_type */}
                    {currentPhoneNumber?.import_type === 'outbound' && (
                    <ElementWithOffset name="outbound-settings">
                        <Card title="Outbound Settings" className="p-6">
                            <p className="text-sm text-t-secondary mb-4">
                                You can assign an outbound phone number, set up a fallback and set up a squad to be called if the assistant is not available.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-button text-t-primary mb-4">
                                        Call Type
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="outboundType"
                                                value="one-number"
                                                checked={phoneNumberData.outboundType === "one-number"}
                                                onChange={(e) => setPhoneNumberData({...phoneNumberData, outboundType: e.target.value})}
                                                className="text-primary-01 focus:ring-primary-01"
                                            />
                                            <span className="text-sm text-t-primary">Call One Number</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="outboundType"
                                                value="many-numbers"
                                                checked={phoneNumberData.outboundType === "many-numbers"}
                                                onChange={(e) => setPhoneNumberData({...phoneNumberData, outboundType: e.target.value})}
                                                className="text-primary-01 focus:ring-primary-01"
                                            />
                                            <span className="text-sm text-t-primary">Call Many Numbers (Upload CSV)</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-button text-t-primary mb-4">
                                        Outbound Phone Number
                                    </label>
                                    <div className="flex">
                                        <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-s-stroke2 rounded-l-full bg-b-surface1">
                                            <span className="text-sm">🇺🇸</span>
                                            <span className="text-sm text-t-secondary">+1</span>
                                        </div>
                                        <Field
                                            type="tel"
                                            placeholder="Enter a phone number"
                                            value={phoneNumberData.outboundNumber}
                                            className="flex-1"
                                            onChange={(e) => setPhoneNumberData({...phoneNumberData, outboundNumber: e.target.value})}
                                            classInput="rounded-l-none border-l-0"
                                        />
                                    </div>
                                </div>
                                
                                <Select
                                    label="Assistant"
                                    value={phoneNumberData.outboundAssistant}
                                    onChange={(value) => setPhoneNumberData({...phoneNumberData, outboundAssistant: value})}
                                    placeholder="Select Assistant..."
                                    options={[
                                        { id: 1, name: "UXPENDIT-Male" },
                                        { id: 2, name: "UXPENDIT-Female" }
                                    ]}
                                />
                                
                                <div>
                                    <label className="block text-button text-t-primary mb-4">
                                        Workflow
                                    </label>
                                    <p className="text-sm text-t-secondary mb-2">
                                        Route to the specified workflow.
                                    </p>
                                    <Select
                                        value={phoneNumberData.outboundWorkflow}
                                        onChange={(value) => setPhoneNumberData({...phoneNumberData, outboundWorkflow: value})}
                                        placeholder="Select Workflow..."
                                        options={[
                                            { id: 1, name: "Default Workflow" },
                                            { id: 2, name: "Support Workflow" }
                                        ]}
                                    />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button onClick={handleMakeCall}>
                                        <Icon name="phone" className="w-4 h-4 mr-2" />
                                        Make a Call
                                    </Button>
                                    <Button isStroke onClick={handleScheduleCall}>
                                        <Icon name="calendar" className="w-4 h-4 mr-2" />
                                        Schedule Call
                                        <Icon name="chevron-down" className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                itemName={currentPhoneNumber.phone_number}
                itemType="phone number"
                agentName={currentPhoneNumber.agent?.name}
            />
        </Layout>
    );
};

export default PhoneNumberDetailPage;
