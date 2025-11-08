"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download } from "lucide-react";
import { adminService } from "@/services/admin";
import { toast } from "sonner";

// Types for dashboard data
interface DashboardMetrics {
  totalUsers: number;
  totalAgents: number;
  totalRevenue: number;
  totalCalls: number;
  revenueData: Array<{ month: string; mrr: number; payg: number }>;
  usageSplit: Array<{ name: string; value: number }>;
  churnData: Array<{ month: string; churn: number }>;
  countryUsage: Array<{
    country: string;
    calls: number;
    minutes: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: number;
    event: string;
    client: string;
    when: string;
    status: string;
  }>;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getDashboardMetrics();
        setMetrics(data);
      } catch (err: any) {
        console.error("Error fetching dashboard metrics:", err);
        setError(err.message || "Failed to fetch dashboard metrics");
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleExport = async () => {
    try {
      const result = await adminService.exportData("dashboard", "csv");
      toast.success(result.message);
    } catch (err: any) {
      toast.error("Failed to export dashboard data");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-t-secondary">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-t-error">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div id="page-dashboard" className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card p-6 max-md:p-4">
            <h3 className="text-h6 text-t-primary mb-4 font-heading">MRR vs PAYG</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={metrics.revenueData || []}>
                  <defs>
                    <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-green)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-green)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="payg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-purple)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-purple)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--stroke-border)" }}
                    tickLine={{ stroke: "var(--stroke-border)" }}
                  />
                  <YAxis 
                    hide 
                    tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--stroke-border)" }}
                    tickLine={{ stroke: "var(--stroke-border)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--backgrounds-surface1)", 
                      border: "1px solid var(--stroke-border)",
                      color: "var(--text-primary)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="var(--chart-green)"
                    fillOpacity={1}
                    fill="url(#mrr)"
                  />
                  <Area
                    type="monotone"
                    dataKey="payg"
                    stroke="var(--chart-purple)"
                    fillOpacity={1}
                    fill="url(#payg)"
                  />
                  <Legend 
                    wrapperStyle={{ color: "var(--text-primary)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card p-6 max-md:p-4">
            <h3 className="text-h6 text-t-primary mb-4 font-heading">Usage Split</h3>
              <div className="flex items-center justify-center">
                <PieChart width={220} height={220}>
                  <Pie
                    data={metrics.usageSplit || []}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={{ 
                      fill: "var(--text-primary)", 
                      fontSize: 12,
                      fontWeight: 500
                    }}
                    labelLine={false}
                  >
                    {(metrics.usageSplit || []).map((_, i) => (
                      <Cell key={i} fill={i % 2 ? "var(--chart-purple)" : "var(--chart-green)"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--backgrounds-surface1)", 
                      border: "1px solid var(--stroke-border)",
                      color: "var(--text-primary)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                    }}
                    labelStyle={{
                      color: "var(--text-primary)",
                      fontWeight: 600
                    }}
                    formatter={(value, name) => [
                      `${value}%`, 
                      name
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ color: "var(--text-primary)" }}
                  />
                </PieChart>
              </div>
          </div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card p-6 max-md:p-4">
            <h3 className="text-h6 text-t-primary mb-4 font-heading">Churn Predictor</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={metrics.churnData || []}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--stroke-border)" }}
                    tickLine={{ stroke: "var(--stroke-border)" }}
                  />
                  <YAxis 
                    tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--stroke-border)" }}
                    tickLine={{ stroke: "var(--stroke-border)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--backgrounds-surface1)", 
                      border: "1px solid var(--stroke-border)",
                      color: "var(--text-primary)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="churn"
                    stroke="var(--chart-yellow)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
          </div>
        </motion.div> */}
      </div>

      {/* Usage by Country */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card p-6 max-md:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h6 text-t-primary font-heading">Usage by Country</h3>
            <div className="text-caption-1 text-t-secondary max-md:hidden">
              {metrics.countryUsage?.length || 0} countries active
            </div>
          </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart 
                  data={metrics.countryUsage || []}
                  barCategoryGap={4}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-border)" />
                  <XAxis 
                    dataKey="country" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                    height={32}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--stroke-border)" }}
                    tickLine={{ stroke: "var(--stroke-border)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--backgrounds-surface1)", 
                      border: "1px solid var(--stroke-border)",
                      color: "var(--text-primary)"
                    }}
                    cursor={{ fill: "var(--stroke-border)", fillOpacity: 0.1 }}
                  />
                  <Legend 
                    wrapperStyle={{ color: "var(--text-primary)" }}
                  />
                  <Bar 
                    dataKey="calls" 
                    fill="var(--chart-purple)" 
                    name="Calls"
                    radius={8}
                    activeBar={{ fill: "var(--chart-purple)", fillOpacity: 1 }}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="var(--chart-green)" 
                    name="Minutes"
                    radius={8}
                    activeBar={{ fill: "var(--chart-green)", fillOpacity: 1 }}
                  />
                </BarChart>
              </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card p-6 max-md:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h6 text-t-primary font-heading">Recent Activity</h3>
            <Button isGray onClick={handleExport} className="max-md:hidden">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Mobile Card Layout */}
          <div className="block lg:hidden space-y-3">
            {(metrics.recentActivity || []).map((activity) => (
              <div key={activity.id} className="border border-s-stroke rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-t-primary">{activity.event}</h4>
                  <Badge variant={activity.status === "success" ? "success" : activity.status === "warning" ? "warning" : "secondary"}>
                    {activity.status}
                  </Badge>
                </div>
                <div className="text-sm text-t-secondary">
                  <p><span className="font-medium">Client:</span> {activity.client}</p>
                  <p><span className="font-medium">When:</span> {activity.when}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-s-stroke">
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Event</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">When</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics.recentActivity || []).map((activity) => (
                    <tr key={activity.id} className="border-b border-s-stroke">
                      <td className="py-3 px-4 text-body-2 text-t-primary">{activity.event}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{activity.client}</td>
                      <td className="py-3 px-4 text-body-2 text-t-secondary">{activity.when}</td>
                      <td className="py-3 px-4">
                        <Badge variant={activity.status === "success" ? "success" : activity.status === "warning" ? "warning" : "secondary"}>
                          {activity.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
