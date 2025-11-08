"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Switch from "@/components/Switch";
import PricingOverrideModal from "@/components/PricingOverrideModal";
import SimulateInvoiceModal from "@/components/SimulateInvoiceModal";
import { users, type User } from "@/lib/data";

const statusOptions = [
    { id: 1, name: "All Status" },
    { id: 2, name: "Active" },
    { id: 3, name: "Trial" },
    { id: 4, name: "Inactive" },
];

const planOptions = [
    { id: 1, name: "All Plans" },
    { id: 2, name: "Starter" },
    { id: 3, name: "Pro" },
    { id: 4, name: "Business" },
    { id: 5, name: "Enterprise" },
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
    const [planFilter, setPlanFilter] = useState(planOptions[0]);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [pricingData, setPricingData] = useState({
        enableOverride: false,
        conversa: 0.12,
        empath: 0.13,
        automationsPack: 10,
        premiumVoiceSurcharge: 0.015
    });
    const [usageData, setUsageData] = useState({
        conversaMinutes: 1200,
        empathMinutes: 800,
        premiumVoiceMinutes: 150,
        automationsCount: 18000
    });
    const [autoRenewStates, setAutoRenewStates] = useState<{ [key: string]: boolean }>({});

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter.name === "All Status" || user.status === statusFilter.name.toLowerCase();
            const matchesPlan = planFilter.name === "All Plans" || user.plan === planFilter.name;
            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [searchTerm, statusFilter, planFilter]);

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: "bg-gray-900 text-white border border-gray-900",
            trial: "bg-gray-100 text-gray-900 border border-gray-200",
            inactive: "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30",
        };
        return statusClasses[status as keyof typeof statusClasses] || "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    };

    const getPlanBadge = (plan: string) => {
        const planClasses = {
            Starter: "bg-primary-01/20 text-primary-01 border border-primary-01/30",
            Pro: "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30",
            Business: "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30",
            Enterprise: "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30",
        };
        return planClasses[plan as keyof typeof planClasses] || "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    };

    const handleOverrideClick = (companyName: string) => {
        setSelectedCompany(companyName);
        setIsPricingModalOpen(true);
    };

    const handleSimulateClick = (companyName: string) => {
        setSelectedCompany(companyName);
        setIsSimulateModalOpen(true);
    };

    const handleAutoRenewToggle = (companyName: string, currentState: boolean) => {
        setAutoRenewStates(prev => ({
            ...prev,
            [companyName]: !currentState
        }));
    };

    const getAutoRenewState = (companyName: string, defaultState: boolean) => {
        return autoRenewStates[companyName] !== undefined ? autoRenewStates[companyName] : defaultState;
    };

    return (
        <Layout title="Users & Accounts">
            <div className="space-y-6">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ marginBottom: '0' }}>
                    <Card className="p-6" title="Total Users">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Users</p>
                                <p className="text-2xl font-bold text-t-primary">{users.length}</p>
                            </div>
                            <Icon name="profile" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Active Users">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Active Users</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {users.filter(u => u.status === "active").length}
                                </p>
                            </div>
                            <Icon name="check" className="w-8 h-8 fill-primary-02" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Total MRR">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total MRR</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    ${users.reduce((sum, user) => sum + user.mrr, 0).toLocaleString()}
                                </p>
                            </div>
                            <Icon name="wallet" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Total Seats">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Seats</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {users.reduce((sum, user) => sum + user.seats, 0)}
                                </p>
                            </div>
                            <Icon name="profile" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="p-6" title="Users & Accounts">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Search
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search company"
                                isGray
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select
                                value={planFilter}
                                onChange={setPlanFilter}
                                options={planOptions}
                                placeholder="Plan"
                            />
                            <div className="flex gap-2">
                                <Button className="flex-1 sm:flex-none">
                                    <Icon name="plus" className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">New Client</span>
                                    <span className="sm:hidden">New</span>
                                </Button>
                                <Button isStroke className="flex-1 sm:flex-none">
                                    <Icon name="download" className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Export PDF</span>
                                    <span className="sm:hidden">Export</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block lg:hidden space-y-4">
                        {filteredUsers.map((user, index) => {
                            const autoRenewState = getAutoRenewState(user.company, user.autoRenew);
                            
                            return (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                    {/* Company Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-01 to-[#8B5CF6] rounded-lg flex items-center justify-center text-t-light font-semibold">
                                                {user.company.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-t-primary">{user.company}</p>
                                                <p className="text-sm text-t-secondary">${user.mrr} MRR</p>
                                            </div>
                                        </div>
                                        <Badge className={`px-2 py-1 text-xs font-medium ${getStatusBadge(user.status)}`}>
                                            {user.status}
                                        </Badge>
                                    </div>

                                    {/* Plan and Seats */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-t-secondary">Plan</p>
                                            <Badge className={`px-2 py-1 text-xs font-medium ${getPlanBadge(user.plan)}`}>
                                                {user.plan}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-t-secondary">Seats</p>
                                            <p className="text-t-primary font-medium">{user.seats}</p>
                                        </div>
                                    </div>

                                    {/* Auto-renew and Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-t-secondary">Auto-renew</span>
                                            <Switch
                                                checked={autoRenewState}
                                                onChange={() => handleAutoRenewToggle(user.company, autoRenewState)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                isStroke 
                                                className="text-xs px-2 py-1 h-6"
                                                onClick={() => handleOverrideClick(user.company)}
                                            >
                                                <Icon name="edit" className="w-3 h-3" />
                                            </Button>
                                            <Button 
                                                isStroke 
                                                className="text-xs px-2 py-1 h-6"
                                                onClick={() => handleSimulateClick(user.company)}
                                            >
                                                <Icon name="calculator" className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto">
                            <Table
                                cellsThead={
                                    <>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Company</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Plan</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Seats</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Auto-renew</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Pricing</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">MRR</th>
                                    </>
                                }
                            >
                                {filteredUsers.map((user, index) => {
                                    const autoRenewState = getAutoRenewState(user.company, user.autoRenew);
                                    
                                    return (
                                        <TableRow key={index}>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-01 to-[#8B5CF6] rounded-lg flex items-center justify-center text-t-light font-semibold">
                                                        {user.company.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-t-primary">{user.company}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={`px-2 py-1 text-xs font-medium ${getPlanBadge(user.plan)}`}>
                                                    {user.plan}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-t-primary">{user.seats}</td>
                                            <td className="py-4 px-4">
                                                <Badge className={`px-2 py-1 text-xs font-medium ${getStatusBadge(user.status)}`}>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center">
                                                    <Switch
                                                        checked={autoRenewState}
                                                        onChange={() => handleAutoRenewToggle(user.company, autoRenewState)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <Button 
                                                        isStroke 
                                                        className="text-xs px-2 py-1 h-6"
                                                        onClick={() => handleOverrideClick(user.company)}
                                                    >
                                                        <Icon name="edit" className="w-3 h-3 mr-1" />
                                                        Override
                                                    </Button>
                                                    <Button 
                                                        isStroke 
                                                        className="text-xs px-2 py-1 h-6"
                                                        onClick={() => handleSimulateClick(user.company)}
                                                    >
                                                        <Icon name="calculator" className="w-3 h-3 mr-1" />
                                                        Simulate
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-t-primary">${user.mrr}</td>
                                        </TableRow>
                                    );
                                })}
                            </Table>
                        </div>
                    </div>
                    
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-t-secondary">No users found matching your criteria.</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Pricing Override Modal */}
            <PricingOverrideModal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
                companyName={selectedCompany}
                pricing={pricingData}
                onPricingChange={setPricingData}
            />

            {/* Simulate Invoice Modal */}
            <SimulateInvoiceModal
                isOpen={isSimulateModalOpen}
                onClose={() => setIsSimulateModalOpen(false)}
                companyName={selectedCompany}
                usage={usageData}
                onUsageChange={setUsageData}
                pricing={pricingData}
            />
        </Layout>
    );
};

export default UsersPage;