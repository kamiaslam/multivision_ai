"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { fmtMoney, type Invoice } from "@/lib/data";
import { type SelectOption } from "@/types/select";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";
import millify from "millify";
import { NumericFormat } from "react-number-format";

// Mock data using existing chart patterns
const revenueData = [
    { name: "Jan", mrr: 5200, payg: 1800 },
    { name: "Feb", mrr: 6400, payg: 2200 },
    { name: "Mar", mrr: 7100, payg: 2600 },
    { name: "Apr", mrr: 7600, payg: 2800 },
];

const countryUsage = [
    { name: "GB", calls: 2120, minutes: 3800, revenue: 9200 },
    { name: "US", calls: 1580, minutes: 3400, revenue: 8400 },
    { name: "BE", calls: 420, minutes: 760, revenue: 1800 },
    { name: "AE", calls: 260, minutes: 610, revenue: 1550 },
    { name: "PK", calls: 300, minutes: 540, revenue: 1300 },
];

const INITIAL_INVOICES = [
    { id: "INV-1042", client: "Acme Health", amount: 1249, status: "paid", period: "Apr 2025" },
    { id: "INV-1043", client: "Delta Realty", amount: 89, status: "due", period: "Apr 2025" },
    { id: "INV-1044", client: "ZenCare Homes", amount: 9860, status: "paid", period: "Apr 2025" },
];

const audit = [
    {
        at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actor: "kam@voicecake.io",
        scope: "global" as const,
        from: { conversaPerMin: 0.11, empathPerMin: 0.12 },
        to: { conversaPerMin: 0.12, empathPerMin: 0.13 }
    },
    {
        at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        actor: "admin@zencare",
        scope: "account" as const,
        account: "ZenCare Homes",
        from: { empathPerMin: 0.13 },
        to: { empathPerMin: 0.11 }
    }
];

const BillingPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [billingData, setBillingData] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [newInvOpen, setNewInvOpen] = useState(false);
    const [globalDialogOpen, setGlobalDialogOpen] = useState(false);
    const [simModalOpen, setSimModalOpen] = useState(false);

    useEffect(() => {
        // Simulate API call
        const loadBillingData = async () => {
            setLoading(true);
            // Add some delay to simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setBillingData(INITIAL_INVOICES);
            setLoading(false);
        };

        loadBillingData();
    }, []);

    const exportCurrentPagePDF = () => {
        // PDF export functionality placeholder
        console.log('Exporting PDF...');
    };

    const hasPerm = (perm: string) => true; // Mock permission check

    const statusOptions: (SelectOption & { value: string })[] = [
        { id: 1, name: "All Status", value: "all" },
        { id: 2, name: "Paid", value: "paid" },
        { id: 3, name: "Due", value: "due" },
        { id: 4, name: "Overdue", value: "overdue" },
        { id: 5, name: "Draft", value: "draft" }
    ];

    const filteredInvoices = billingData.filter(invoice => {
        const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
            case "due": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
            case "overdue": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
            case "draft": return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
            default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
        }
    };

    const totalRevenue = billingData
        .filter(invoice => invoice.status === "paid")
        .reduce((sum, invoice) => sum + invoice.amount, 0);

    const pendingAmount = billingData
        .filter(invoice => invoice.status === "due")
        .reduce((sum, invoice) => sum + invoice.amount, 0);

    const overdueAmount = billingData
        .filter(invoice => invoice.status === "overdue")
        .reduce((sum, invoice) => sum + invoice.amount, 0);

    // Custom tooltip component following HomePage pattern
    const CustomTooltip = ({ payload, label }: { payload: any[], label: string }) => {
        if (payload && payload.length) {
            return (
                <div className="chart-tooltip">
                    <div className="mb-0.5 text-[0.6875rem] leading-[1rem] opacity-80">
                        {label}
                    </div>
                    {payload.map((entry, index) => (
                        <div key={index} className="text-caption">
                            <NumericFormat
                                value={entry.value}
                                thousandSeparator=","
                                decimalScale={2}
                                fixedDecimalScale
                                displayType="text"
                                prefix="$"
                            />
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Layout title="Billing & Financials">
            <div className="space-y-3">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-t-primary"></h1>
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={() => setNewInvOpen(true)}>
                            <Icon name="plus" className="w-4 h-4 mr-2" />Create Invoice
                        </Button>
                        {hasPerm("pricing_edit") && (
                            <>
                                <Button onClick={() => setGlobalDialogOpen(true)}>
                                    <Icon name="edit" className="w-4 h-4 mr-2" />Edit Global Pricing
                                </Button>
                                <Button isStroke onClick={() => setSimModalOpen(true)}>
                                    <Icon name="calculator" className="w-4 h-4 mr-2" />Simulate Invoice
                                </Button>
                            </>
                        )}
                        <Button isStroke onClick={exportCurrentPagePDF}>
                            <Icon name="download" className="w-4 h-4 mr-2" />Export PDF
                        </Button>
                        <Button isStroke>
                            <Icon name="filter" className="w-4 h-4 mr-2" />Filters
                        </Button>
                    </div>
                </div>

                {/* Revenue Chart and Invoices */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <Card title="Revenue" className="lg:col-span-2 p-6">
                        <div className="pt-3 px-3 pb-1">
                            <div className="h-79 max-xl:h-63.5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={730}
                                        height={250}
                                        data={revenueData}
                                        margin={{ top: 8, right: 7, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorGreen"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--primary-02)"
                                                    stopOpacity={0.15}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--primary-02)"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="colorBlue"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--primary-01)"
                                                    stopOpacity={0.15}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--primary-01)"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: "12px",
                                                fill: "var(--text-tertiary)",
                                                fillOpacity: 0.8,
                                            }}
                                            padding={{ left: 10 }}
                                            height={40}
                                            dy={20}
                                        />
                                        <YAxis
                                            tickFormatter={(value) => millify(value, { lowercase: true })}
                                            type="number"
                                            width={36}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: "12px",
                                                fill: "var(--text-tertiary)",
                                                fillOpacity: 0.8,
                                            }}
                                        />
                                        <CartesianGrid
                                            strokeDasharray="5 7"
                                            vertical={false}
                                            stroke="var(--stroke-stroke2)"
                                        />
                                        <Tooltip
                                            content={<CustomTooltip payload={[]} label="" />}
                                            cursor={{ stroke: "var(--stroke-stroke2)" }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="mrr"
                                            stroke="var(--primary-02)"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorGreen)"
                                            activeDot={{
                                                r: 5,
                                                fill: "var(--backgrounds-surface2)",
                                                stroke: "var(--primary-02)",
                                                strokeWidth: 3,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="payg"
                                            stroke="var(--primary-01)"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorBlue)"
                                            activeDot={{
                                                r: 5,
                                                fill: "var(--backgrounds-surface2)",
                                                stroke: "var(--primary-01)",
                                                strokeWidth: 3,
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                    
                    <Card title="Recent Invoices" className="p-6">
                        <div className="space-y-3">
                            {INITIAL_INVOICES.map(inv => (
                                <div key={inv.id} className="flex justify-between items-center p-3 bg-b-depth2 border border-s-stroke rounded-lg">
                                    <div>
                                        <div className="font-medium text-sm text-t-primary">{inv.id}</div>
                                        <div className="text-xs text-t-secondary">{inv.client}</div>
                                        <div className="text-xs text-t-tertiary">{inv.period}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-t-primary">{fmtMoney(inv.amount)}</div>
                                        <Badge className={getStatusColor(inv.status)}>
                                            {inv.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Revenue by Country */}
                <Card title="Revenue by Country" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-t-tertiary">last 30 days</span>
                    </div>
                    <div className="pt-3 px-3 pb-1">
                        <div className="h-79 max-xl:h-63.5">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={countryUsage}>
                                    <CartesianGrid strokeDasharray="5 7" vertical={false} stroke="var(--stroke-stroke2)" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="var(--text-tertiary)"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: "12px",
                                            fill: "var(--text-tertiary)",
                                            fillOpacity: 0.8,
                                        }}
                                    />
                                    <YAxis 
                                        stroke="var(--text-tertiary)"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: "12px",
                                            fill: "var(--text-tertiary)",
                                            fillOpacity: 0.8,
                                        }}
                                    />
                                    <Tooltip 
                                        content={<CustomTooltip payload={[]} label="" />}
                                        cursor={{ fill: "var(--stroke-stroke2)", fillOpacity: 0.1 }}
                                    />
                                    <Bar dataKey="revenue" fill="var(--primary-02)" name="Revenue ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Pricing Change History */}
                <Card title="Pricing Change History" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-t-tertiary">{audit.length} events</span>
                    </div>
                    
                    {/* Mobile Card Layout */}
                    <div className="block lg:hidden space-y-4">
                        {audit.map((e, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-t-primary">{e.actor}</p>
                                        <p className="text-sm text-t-secondary">{new Date(e.at).toLocaleString()}</p>
                                    </div>
                                    <Badge className={e.scope === "global" ? "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30" : "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30"}>
                                        {e.scope}
                                    </Badge>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-t-secondary">Account</p>
                                        <p className="text-t-primary">{e.account || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-t-secondary">Changes</p>
                                        <div className="text-xs text-t-primary">
                                            {Object.keys(e.to).map(k => {
                                                const before = e.from[k as keyof typeof e.from];
                                                const after = e.to[k as keyof typeof e.to];
                                                if (before === after) return null;
                                                return (
                                                    <div key={k} className="mt-1">
                                                        <span className="uppercase">{k}</span>: {fmtMoney(Number(before))} → {fmtMoney(Number(after))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto">
                            <Table
                                cellsThead={
                                    <>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">When</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Actor</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Scope</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Account</th>
                                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Change</th>
                                    </>
                                }
                            >
                                {audit.map((e, i) => (
                                    <TableRow key={i}>
                                        <td className="py-4 px-4 text-t-primary">{new Date(e.at).toLocaleString()}</td>
                                        <td className="py-4 px-4 text-t-primary">{e.actor}</td>
                                        <td className="py-4 px-4">
                                            <Badge className={e.scope === "global" ? "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30" : "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30"}>
                                                {e.scope}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4 text-t-primary">{e.account || "-"}</td>
                                        <td className="py-4 px-4 text-xs text-t-primary">
                                            {Object.keys(e.to).map(k => {
                                                const before = e.from[k as keyof typeof e.from];
                                                const after = e.to[k as keyof typeof e.to];
                                                if (before === after) return null;
                                                return (
                                                    <div key={k}>
                                                        <span className="uppercase">{k}</span>: {fmtMoney(Number(before))} → {fmtMoney(Number(after))}
                                                    </div>
                                                );
                                            })}
                                        </td>
                                    </TableRow>
                                ))}
                            </Table>
                        </div>
                    </div>
                </Card>

                {/* Detailed Invoices Table */}
                <Card title="All Invoices" className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Search
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64"
                                isGray
                            />
                            <Select
                                value={statusOptions.find(opt => opt.value === statusFilter) || null}
                                onChange={(option) => setStatusFilter((option as SelectOption & { value: string })?.value || "all")}
                                options={statusOptions}
                                className="w-full sm:w-40"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <Loader text="Loading invoices..." />
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card Layout */}
                            <div className="block lg:hidden space-y-4">
                                {filteredInvoices.map((invoice) => (
                                    <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-t-primary">{invoice.id}</p>
                                                <p className="text-sm text-t-secondary">{invoice.client}</p>
                                            </div>
                                            <Badge className={getStatusColor(invoice.status)}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </Badge>
                                        </div>

                                        {/* Details */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-t-secondary">Period</p>
                                                <p className="text-t-primary">{invoice.period}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-t-secondary">Amount</p>
                                                <p className="font-medium text-t-primary">{fmtMoney(invoice.amount)}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <Button isStroke className="flex-1">
                                                View
                                            </Button>
                                            {invoice.status === "draft" && (
                                                <Button className="flex-1">
                                                    Send
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <Table
                                        cellsThead={
                                            <>
                                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Invoice ID</th>
                                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Client</th>
                                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Period</th>
                                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Amount</th>
                                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
                                            </>
                                        }
                                    >
                                        {filteredInvoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <td className="py-4 px-4 font-medium text-t-primary">{invoice.id}</td>
                                                <td className="py-4 px-4 text-t-primary">{invoice.client}</td>
                                                <td className="py-4 px-4 text-t-primary">{invoice.period}</td>
                                                <td className="py-4 px-4 font-medium text-t-primary">{fmtMoney(invoice.amount)}</td>
                                                <td className="py-4 px-4">
                                                    <Badge className={getStatusColor(invoice.status)}>
                                                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <Button isStroke>
                                                            View
                                                        </Button>
                                                        {invoice.status === "draft" && (
                                                            <Button>
                                                                Send
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </TableRow>
                                        ))}
                                    </Table>
                                </div>
                            </div>
                        </>
                    )}

                    {filteredInvoices.length === 0 && !loading && (
                        <div className="text-center py-8 text-t-tertiary">
                            No invoices found matching your criteria.
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default BillingPage;