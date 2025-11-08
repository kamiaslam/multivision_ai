"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import Card from "@/components/Card";
import Percentage from "@/components/Percentage";
import { motion } from "framer-motion";
import { hasPerm } from "../../utils/utils";
import {
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

const agents = [
  { name: "Receptionist UK", type: "Conversa", client: "Acme Health", latency: 480, csat: 4.6, calls: 812 },
  { name: "Wellness Check", type: "Empath", client: "ZenCare Homes", latency: 540, csat: 4.8, calls: 1093 },
  { name: "Sales SDR-1", type: "Conversa", client: "Nimbus Retail", latency: 410, csat: 4.2, calls: 640 },
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [visibleSearch, setVisibleSearch] = useState(false);

  // Mock data for stats
  const totalAgents = 24;
  const activeAgents = 18;
  const avgSessions = 156;
  const totalSessions = 3744;

  return (
    <div id="page-agents" className="space-y-3">
        {/* Header with stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  {totalAgents}
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
                  {activeAgents}
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
                  {avgSessions}
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
                  {totalSessions.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Percentage value={15.3} />
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "list"
                ? "bg-b-surface2 text-t-primary"
                : "text-t-secondary hover:text-t-primary"
            }`}
            onClick={() => setActiveTab("list")}
          >
            List
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "performance"
                ? "bg-b-surface2 text-t-primary"
                : "text-t-secondary hover:text-t-primary"
            }`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
        </div>

        {/* List Tab Content */}
        {activeTab === "list" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Mobile Card Layout */}
            <div className="block lg:hidden space-y-4">
              {agents.map((agent) => (
                <div key={agent.name} className="card p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-t-primary">{agent.name}</h3>
                      <p className="text-sm text-t-secondary">{agent.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-t-secondary">Client</p>
                      <p className="text-t-primary font-medium">{agent.client}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-s-stroke">
                    <div>
                      <p className="text-sm text-t-secondary">Latency</p>
                      <p className="text-t-primary font-medium">{agent.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-t-secondary">CSAT</p>
                      <p className="text-t-primary font-medium">{agent.csat}</p>
                    </div>
                    <div>
                      <p className="text-sm text-t-secondary">Calls</p>
                      <p className="text-t-primary font-medium">{agent.calls}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden lg:block">
              <div className="card p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-s-stroke">
                        <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Agent</th>
                        <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Type</th>
                        <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Client</th>
                        <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Latency, ms</th>
                        <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">CSAT</th>
                        <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Calls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent) => (
                        <tr key={agent.name} className="border-b border-s-stroke">
                          <td className="py-3 px-4 text-body-2 text-t-primary font-medium">{agent.name}</td>
                          <td className="py-3 px-4 text-body-2 text-t-primary">{agent.type}</td>
                          <td className="py-3 px-4 text-body-2 text-t-primary">{agent.client}</td>
                          <td className="py-3 px-4 text-body-2 text-t-primary">{agent.latency}</td>
                          <td className="py-3 px-4 text-body-2 text-t-primary">{agent.csat}</td>
                          <td className="py-3 px-4 text-body-2 text-t-primary">{agent.calls}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Tab Content */}
        {activeTab === "performance" && (
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="card p-6 max-md:p-4">
                <h3 className="text-h6 text-t-primary mb-4 font-heading">Latency Distribution</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={agents.map((a) => ({
                      name: a.name,
                      latency: a.latency,
                    }))}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-border)" />
                    <XAxis
                      dataKey="name"
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
                    <Bar
                      dataKey="latency"
                      fill="var(--chart-purple)"
                      radius={8}
                      activeBar={{ fill: "var(--chart-purple)", fillOpacity: 1 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="card p-6 max-md:p-4">
                <h3 className="text-h6 text-t-primary mb-4 font-heading">CSAT by Agent</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={agents.map((a) => ({ name: a.name, csat: a.csat }))}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-border)" />
                    <XAxis
                      dataKey="name"
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
                    <Bar
                      dataKey="csat"
                      fill="var(--chart-green)"
                      radius={8}
                      activeBar={{ fill: "var(--chart-green)", fillOpacity: 1 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  );
}