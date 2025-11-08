"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Loader from "@/components/Loader";
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
} from "recharts";
import millify from "millify";

// Mock data types
type RevenueData = {
  month: string;
  mrr: number;
  payg: number;
  revenue: number;
};

type UsageSplit = {
  name: string;
  value: number;
  category: string;
  percentage: number;
};

type ChurnData = {
  month: string;
  churn: number;
  churnRate: number;
};

type CountryUsage = {
  country: string;
  code: string;
  calls: number;
  minutes: number;
  revenue: number;
  flag?: string;
  users?: number;
};

// Mock data
const revenueData: RevenueData[] = [
  { month: "Jan", mrr: 5200, payg: 1800, revenue: 7000 },
  { month: "Feb", mrr: 6400, payg: 2200, revenue: 8600 },
  { month: "Mar", mrr: 7100, payg: 2600, revenue: 9700 },
  { month: "Apr", mrr: 7600, payg: 2800, revenue: 10400 },
];

const usageSplit: UsageSplit[] = [
  { name: "Conversa", value: 6, category: "Conversa", percentage: 62 },
  { name: "Empath", value: 38, category: "Empath", percentage: 38 }
];

const churnData: ChurnData[] = [
  { month: "Jan", churn: 5, churnRate: 0.08 },
  { month: "Feb", churn: 4, churnRate: 0.06 },
  { month: "Mar", churn: 6, churnRate: 0.09 },
  { month: "Apr", churn: 3, churnRate: 0.04 }
];

const countryUsage: CountryUsage[] = [
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

const invoices = [
  { id: "INV-1042", client: "Acme Health", amount: 1249, status: "paid", period: "Apr 2025" },
  { id: "INV-1043", client: "Delta Realty", amount: 89, status: "due", period: "Apr 2025" },
  { id: "INV-1044", client: "ZenCare Homes", amount: 9860, status: "paid", period: "Apr 2025" },
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

const InsightsPage = () => {
  const [timeRange, setTimeRange] = useState<SelectOption>({ id: 2, name: "Last 30 days" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadInsights = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };

    loadInsights();
  }, [timeRange]);

  const timeRangeOptions: SelectOption[] = [
    { id: 1, name: "Last 7 days" },
    { id: 2, name: "Last 30 days" },
    { id: 3, name: "Last 3 months" },
    { id: 4, name: "Last year" }
  ];

  // Calculate key metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "active").length;
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === "paid").length;
  const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers * 100) : 0;
  const agentUtilization = totalAgents > 0 ? (activeAgents / totalAgents * 100) : 0;
  const paymentSuccess = totalInvoices > 0 ? (paidInvoices / totalInvoices * 100) : 0;

  return (
    <Layout title="Insights">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Strategic Insights</h1>
            <p className="text-gray-600">Voice Cake analytics and business intelligence dashboard</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
            />
            <Button isStroke>
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card title="Total Revenue" className="p-6">
            <div className="text-2xl font-bold text-t-primary">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-green-600">+12.5% vs last period</div>
          </Card>
          <Card title="Conversion Rate" className="p-6">    
            <div className="text-2xl font-bold text-t-primary">{conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-blue-600">+2.3% vs last period</div>
          </Card>
          <Card title="Agent Utilization" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{agentUtilization.toFixed(1)}%</div>
            <div className="text-xs text-purple-600">+5.1% vs last period</div>
          </Card>
          <Card title="Payment Success" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{paymentSuccess.toFixed(1)}%</div>
            <div className="text-xs text-orange-600">+1.8% vs last period</div>
          </Card>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card title="Revenue Trends" className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <Loader text="Loading chart..." />
              </div>
            ) : (
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
            )}
          </Card>

          <Card title="Usage Distribution" className="p-8">
            <div className="h-56">
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

        {/* Churn Analysis & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card title="Churn Analysis" className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnData} margin={{ top: 8, right: 7, left: 0, bottom: 0 }}>
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
                    tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                    type="number"
                    width={36}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
                  />
                  <CartesianGrid strokeDasharray="5 7" vertical={false} stroke="var(--stroke-stroke2)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--stroke-stroke2)" }} />
                  <Bar
                    dataKey="churnRate"
                    fill="var(--primary-02)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Churn Rate</span>
                <span className="font-medium">
                  {(churnData.reduce((sum, item) => sum + item.churnRate, 0) / churnData.length).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>

          <Card title="Geographic Distribution" className="p-6">
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
        </div>

        {/* Business Intelligence Summary */}
        <Card title="Business Intelligence Summary" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Growth Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Growth Rate</span>
                  <span className="font-medium text-green-600">+8.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Acquisition Cost</span>
                  <span className="font-medium">$45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Lifetime Value</span>
                  <span className="font-medium">$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-medium">3.2 months</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Operational Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Uptime</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Response Time</span>
                  <span className="font-medium">145ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-medium text-red-600">0.02%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Support Resolution</span>
                  <span className="font-medium">18.5h</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Financial Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Margin</span>
                  <span className="font-medium text-green-600">78.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Margin</span>
                  <span className="font-medium">23.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Flow</span>
                  <span className="font-medium text-green-600">Positive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Burn Rate</span>
                  <span className="font-medium">$125K/month</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card title="Agent Performance" className="p-6">
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

          <Card title="Revenue by Client" className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={users} margin={{ top: 8, right: 7, left: 0, bottom: 40 }}>
                  <XAxis
                    dataKey="company"
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
                    tickLine={false}
                    tick={{ fontSize: "12px", fill: "var(--text-tertiary)", fillOpacity: 0.8 }}
                  />
                  <CartesianGrid strokeDasharray="5 7" vertical={false} stroke="var(--stroke-stroke2)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--stroke-stroke2)" }} />
                  <Bar
                    dataKey="mrr"
                    fill="var(--primary-01)"
                    radius={[4, 4, 0, 0]}
                    name="Monthly Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default InsightsPage;