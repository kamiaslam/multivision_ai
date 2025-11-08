"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Select from "@/components/Select";
import { FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useCommonDialogs } from "../../components/dialogs/commonDialogsContext";
import { adminService } from "../../../../services/admin";
import { toast } from "sonner";

const numbers = [
  {
    number: "1001",
    client: "Client A",
    mappedTo: "Agent 1",
    inbound: 120,
    outbound: 95,
    health: "ok",
  },
  {
    number: "1002",
    client: "Client B",
    mappedTo: "Agent 2",
    inbound: 80,
    outbound: 110,
    health: "warning",
  },
];

const TelephonyPage = () => {
  const { exportCurrentPagePDF } = useCommonDialogs();
  
  // State for traffic data
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [daysBack, setDaysBack] = useState(7); // Default to 7 days
  const [tableData, setTableData] = useState<any[]>([]);
  const [monthsBack, setMonthsBack] = useState(1);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  // Function to format date from YYYY-MM-DD to "Thu Apr 27" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Fetch traffic data
  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setIsLoadingTraffic(true);
        const response = await adminService.getDailyTraffic(daysBack);
        const dailyTraffic = response?.daily_traffic || [];
        
        // Format the dates for the chart and convert to camelCase
        const formattedTrafficData = dailyTraffic.map((day: any) => ({
          ...day,
          date: formatDate(day.date),
          inboundSessions: day.inbound_sessions,
          outboundSessions: day.outbound_sessions
        }));
        
        setTrafficData(formattedTrafficData);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
        toast.error("Failed to load traffic data");
        setTrafficData([]);
      } finally {
        setIsLoadingTraffic(false);
      }
    };

    fetchTrafficData();
  }, [daysBack]);

  // Fetch table data when component mounts or monthsBack changes
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setIsLoadingTable(true);
        const response = await adminService.getTrafficByAgent(monthsBack);
        const agentData = response?.traffic_by_agent || [];
        
        setTableData(agentData.map((agent: any) => ({
          number: agent.agent_phone_number || 'N/A',
          client: agent.owner_name || 'Unknown',
          mappedTo: agent.agent_name || 'Unknown',
          inbound: agent.inbound_sessions || 0,
          outbound: agent.outbound_sessions || 0,
        })));
      } catch (error) {
        console.error("Error fetching table data:", error);
        toast.error("Failed to load agent data");
        setTableData([]);
      } finally {
        setIsLoadingTable(false);
      }
    };

    fetchTableData();
  }, [monthsBack]);

  return (
    <div id="page-telephony" className="p-6">
      <PageHeader
        title="Telephony & Infrastructure"
        cta={
          <Button variant="outline" onClick={exportCurrentPagePDF}>
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-h6 text-t-primary font-heading">Call Traffic</h4>
            <Select
              value={{ id: daysBack, name: daysBack === 1 ? "Last 24 hours" : `Last ${daysBack} days` }}
              onChange={(value) => setDaysBack(value.id)}
              options={[
                { id: 1, name: "Last 24 hours" },
                { id: 7, name: "Last 7 days" },
                { id: 30, name: "Last 30 days" },
                { id: 90, name: "Last 90 days" },
              ]}
            />
          </div>
          {isLoadingTraffic ? (
            <div className="flex items-center justify-center h-[220px]">
              <div className="text-sm text-gray-500">Loading traffic data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={trafficData}
                barCategoryGap={4}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-border)" />
                <XAxis 
                  dataKey="date" 
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
                  dataKey="inboundSessions" 
                  name="Inbound Sessions"
                  fill="var(--chart-green)"
                  radius={8}
                  minPointSize={2}
                  activeBar={{ fill: "var(--chart-green)", fillOpacity: 1 }}
                />
                <Bar 
                  dataKey="outboundSessions" 
                  name="Outbound Sessions"
                  fill="var(--chart-purple)"
                  radius={8}
                  minPointSize={2}
                  activeBar={{ fill: "var(--chart-purple)", fillOpacity: 1 }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-h6 text-t-primary font-heading">Agent Performance</h4>
            <Select
              value={{ id: monthsBack, name: `Last ${monthsBack} month${monthsBack > 1 ? 's' : ''}` }}
              onChange={(value) => setMonthsBack(value.id)}
              options={[
                { id: 1, name: "Last 1 month" },
                { id: 3, name: "Last 3 months" },
                { id: 6, name: "Last 6 months" },
                { id: 12, name: "Last 12 months" },
              ]}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-s-stroke">
                  <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Number</th>
                  <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Agent</th>
                  <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Inbound</th>
                  <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Outbound</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingTable ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-sm text-gray-500">
                      Loading agent data...
                    </td>
                  </tr>
                ) : tableData.length > 0 ? (
                  tableData.map((n, index) => (
                    <tr key={`${n.number}-${index}`} className="border-b border-s-stroke">
                      <td className="py-3 px-4 text-body-2 text-t-primary font-medium">{n.number}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{n.client}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{n.mappedTo}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{n.inbound}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{n.outbound}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-sm text-gray-500">
                      No agent data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelephonyPage;
