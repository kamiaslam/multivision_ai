"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Percentage from "@/components/Percentage";
import { SelectOption } from "@/types/select";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import millify from "millify";

// Mock data from Data.tsx
const revenueData = [
  { month: "Jan", mrr: 5200, payg: 1800, revenue: 7000 },
  { month: "Feb", mrr: 6400, payg: 2200, revenue: 8600 },
  { month: "Mar", mrr: 7100, payg: 2600, revenue: 9700 },
  { month: "Apr", mrr: 7600, payg: 2800, revenue: 10400 },
];

const usageSplit = [
  { name: "Conversa", value: 62, category: "Conversa", percentage: 62 },
  { name: "Empath", value: 38, category: "Empath", percentage: 38 }
];

const churnData = [
  { month: "Jan", churn: 5, churnRate: 0.08 },
  { month: "Feb", churn: 4, churnRate: 0.06 },
  { month: "Mar", churn: 6, churnRate: 0.09 },
  { month: "Apr", churn: 3, churnRate: 0.04 }
];

const countryUsage = [
  { country: "United Kingdom", code: "GB", calls: 2120, minutes: 3800, revenue: 9200, flag: "🇬🇧", users: 1200 },
  { country: "United States", code: "US", calls: 1580, minutes: 3400, revenue: 8400, flag: "🇺🇸", users: 800 },
  { country: "Belgium", code: "BE", calls: 420, minutes: 760, revenue: 1800, flag: "🇧🇪", users: 200 },
  { country: "United Arab Emirates", code: "AE", calls: 260, minutes: 610, revenue: 1550, flag: "🇦🇪", users: 100 },
  { country: "Pakistan", code: "PK", calls: 300, minutes: 540, revenue: 1300, flag: "🇵🇰", users: 150 },
];

const users = [
  { company: "Acme Health", plan: "Pro", seats: 12, status: "active", mrr: 899, autoRenew: true },
  { company: "Delta Realty", plan: "Starter", seats: 5, status: "trial", mrr: 129, autoRenew: false },
  { company: "Nimbus Retail", plan: "Business", seats: 24, status: "active", mrr: 1899, autoRenew: true },
  { company: "ZenCare Homes", plan: "Enterprise", seats: 64, status: "active", mrr: 7499, autoRenew: true },
];

const agents = [
  { name: "Receptionist UK", type: "Conversa", client: "Acme Health", latency: 480, csat: 4.6, calls: 812, status: "active" },
  { name: "Wellness Check", type: "Empath", client: "ZenCare Homes", latency: 540, csat: 4.8, calls: 1093, status: "active" },
  { name: "Sales SDR-1", type: "Conversa", client: "Nimbus Retail", latency: 410, csat: 4.2, calls: 640, status: "active" },
];

const workflows = [
  { name: "Lead Capture → HubSpot", client: "Nimbus Retail", runs: 1432, fails: 6, lastRun: "10m ago" },
  { name: "Missed Call → SMS", client: "Acme Health", runs: 932, fails: 0, lastRun: "2m ago" },
  { name: "Care Alert → Webhook", client: "ZenCare Homes", runs: 2204, fails: 3, lastRun: "1h ago" },
];

const numbers = [
  { number: "+44 20 7123 9876", client: "Acme Health", mappedTo: "Receptionist UK", inbound: 812, outbound: 102, health: "ok" },
  { number: "+1 415 555 0199", client: "Nimbus Retail", mappedTo: "Sales SDR-1", inbound: 211, outbound: 540, health: "ok" },
  { number: "+44 161 555 0102", client: "ZenCare Homes", mappedTo: "Wellness Check", inbound: 1203, outbound: 36, health: "warning" },
];

const securityEvents = [
  { time: "12:41", actor: "admin@zencare", action: "API key created", risk: "low" },
  { time: "11:22", actor: "dev@nimbus", action: "Rate limit exceeded", risk: "med" },
  { time: "09:03", actor: "system", action: "Login from new device", risk: "high" },
];

const tickets = [
  { id: "#4921", client: "Delta Realty", subject: "Workflow failed", priority: "high", sla: "3h", status: "open" },
  { id: "#4922", client: "Acme Health", subject: "Change plan", priority: "low", sla: "24h", status: "pending" },
  { id: "#4923", client: "ZenCare Homes", subject: "Latency spike", priority: "med", sla: "8h", status: "open" },
];

// Recent activity data
const recentActivities = [
  {
    id: 1,
    type: "invoice",
    title: "Invoice paid",
    subtitle: "Acme Health",
    time: "5m ago",
    status: "success",
    icon: "check-circle"
  },
  {
    id: 2,
    type: "agent",
    title: "New agent created",
    subtitle: "Nimbus Retail",
    time: "18m ago",
    status: "info",
    icon: "user-plus"
  },
  {
    id: 3,
    type: "workflow",
    title: "Workflow execution",
    subtitle: "ZenCare Homes",
    time: "1h ago",
    status: "warning",
    icon: "settings"
  },
  {
    id: 4,
    type: "security",
    title: "Security alert",
    subtitle: "System",
    time: "2h ago",
    status: "error",
    icon: "shield"
  }
];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const HomePage = () => {
  const [timeRange, setTimeRange] = useState<SelectOption>({ id: 2, name: "Last 30 days" });

  // Calculate key metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "active").length;
  const totalWorkflows = workflows.length;
  const totalExecutions = workflows.reduce((sum, w) => sum + w.runs, 0);
  const totalCalls = numbers.reduce((sum, n) => sum + n.inbound + n.outbound, 0);
  const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers * 100) : 0;
  const agentUtilization = totalAgents > 0 ? (activeAgents / totalAgents * 100) : 0;
  const workflowSuccessRate = totalExecutions > 0 ? ((totalExecutions - workflows.reduce((sum, w) => sum + w.fails, 0)) / totalExecutions * 100) : 0;

  const timeRangeOptions: SelectOption[] = [
    { id: 1, name: "Last 7 days" },
    { id: 2, name: "Last 30 days" },
    { id: 3, name: "Last 3 months" },
    { id: 4, name: "Last year" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50";
      case "info": return "text-blue-600 bg-blue-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "error": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return "check-circle";
      case "info": return "info";
      case "warning": return "alert-triangle";
      case "error": return "x-circle";
      default: return "circle";
    }
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold"></h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your voice communication platform</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
              className="w-40"
            />
            <Button>
              <Icon name="download" className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-lg:overflow-hidden">
          <Card className="p-6 mb-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-02 rounded-full">
                <Icon name="wallet" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sub-title-1">Total Revenue</div>
                  <div className="flex fill-[#1a1a1a] opacity-50 hover:opacity-100 transition-all duration-150 cursor-pointer hover:!fill-primary-01">
                    <Icon name="help-circle" className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-t-primary">${totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Percentage value={12.5} />
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6 mb-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-02 rounded-full">
                <Icon name="users" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sub-title-1">Active Users</div>
                  <div className="flex fill-[#1a1a1a] opacity-50 hover:opacity-100 transition-all duration-150 cursor-pointer hover:!fill-primary-01">
                    <Icon name="help-circle" className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-t-primary">{activeUsers}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Percentage value={2.3} />
                  <span className="text-xs text-gray-500">of {totalUsers} total</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6 mb-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-02 rounded-full">
                <Icon name="phone" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sub-title-1">Total Calls</div>
                  <div className="flex fill-[#1a1a1a] opacity-50 hover:opacity-100 transition-all duration-150 cursor-pointer hover:!fill-primary-01">
                    <Icon name="help-circle" className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-t-primary">{totalCalls.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Percentage value={8.7} />
                  <span className="text-xs text-gray-500">this month</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6 mb-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-02 rounded-full">
                <Icon name="check-circle" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sub-title-1">Workflow Success</div>
                  <div className="flex fill-[#1a1a1a] opacity-50 hover:opacity-100 transition-all duration-150 cursor-pointer hover:!fill-primary-01">
                    <Icon name="help-circle" className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-t-primary">{workflowSuccessRate.toFixed(1)}%</div>
                <div className="flex items-center gap-2 mt-1">
                  <Percentage value={1.2} />
                  <span className="text-xs text-gray-500">across all workflows</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 max-lg:overflow-hidden">
          <Card title="Revenue Trends" className="p-6 mb-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 8, right: 7, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-02)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary-02)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-01)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary-01)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
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
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
                  />
                  <CartesianGrid strokeDasharray="5 7" vertical={false} stroke="var(--stroke-stroke2)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--stroke-stroke2)" }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary-02)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{
                      r: 5,
                      fill: "var(--backgrounds-surface2)",
                      stroke: "var(--primary-02)",
                      strokeWidth: 3,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="var(--primary-01)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMRR)"
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
          </Card>

          <Card title="Usage Distribution" className="p-6 mb-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {usageSplit.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? "var(--primary-02)" : "var(--primary-01)"} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3 px-2">
              {usageSplit.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate">{item.name}</span>
                  <span className="font-medium text-right ml-2 flex-shrink-0">{item.value} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Geographic Distribution & Agent Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 max-lg:overflow-hidden">
          <Card title="Geographic Distribution" className="p-6 mb-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryUsage} margin={{ top: 8, right: 7, left: 0, bottom: 40 }}>
                  <XAxis
                    dataKey="code"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
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
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
                  />
                  <CartesianGrid strokeDasharray="5 7" vertical={false} stroke="var(--stroke-stroke2)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--stroke-stroke2)" }} />
                  <Bar
                    dataKey="users"
                    fill="var(--primary-01)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {countryUsage.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-gray-600">{item.country}</span>
                  </div>
                  <span className="font-medium">{(item.users || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Agent Performance" className="p-6 mb-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agents} margin={{ top: 8, right: 7, left: 0, bottom: 40 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: "10px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
                    padding={{ left: 10 }}
                    height={40}
                    dy={20}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    tickFormatter={(value) => millify(value, { lowercase: true })}
                    type="number"
                    width={36}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
                  />
                  <CartesianGrid strokeDasharray="5 7" vertical={false} stroke="var(--stroke-stroke2)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--stroke-stroke2)" }} />
                  <Bar
                    dataKey="calls"
                    fill="var(--primary-02)"
                    radius={[4, 4, 0, 0]}
                    name="Total Calls"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 max-lg:overflow-hidden">
          <Card title="Recent Activity" className="p-6 mb-0">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`flex items-center gap-3 p-3 rounded-lg ${getStatusColor(activity.status)}`}>
                  <Icon name={getStatusIcon(activity.status)} className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.subtitle} • {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="System Health" className="p-6 mb-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="text-sm font-medium text-green-600">145ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">System Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium text-red-600">0.02%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Workflows</span>
                <span className="text-sm font-medium text-blue-600">{workflows.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="mb-3 max-lg:overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button isStroke className="p-4 h-auto flex-col items-start">
              <Icon name="plus" className="w-5 h-5 text-blue-600 mb-2" />
              <div className="text-left">
                <div className="font-medium">Create Workflow</div>
                <div className="text-sm text-gray-500">Automate your processes</div>
              </div>
            </Button>
            <Button isStroke className="p-4 h-auto flex-col items-start">
              <Icon name="phone" className="w-5 h-5 text-green-600 mb-2" />
              <div className="text-left">
                <div className="font-medium">Add Phone Number</div>
                <div className="text-sm text-gray-500">Expand your telephony</div>
              </div>
            </Button>
            <Button isStroke className="p-4 h-auto flex-col items-start">
              <Icon name="user-plus" className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-left">
                <div className="font-medium">Invite Team Member</div>
                <div className="text-sm text-gray-500">Grow your team</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default HomePage;
