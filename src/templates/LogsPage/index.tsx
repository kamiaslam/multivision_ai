"use client";

import { useState } from "react";
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
import { SelectOption } from "@/types/select";

// Mock data types
type LogItem = {
  id: string;
  time: string; // ISO
  tenant: string;
  client: string;
  severity: "error" | "warn" | "info" | "debug";
  source: string;
  code: string;
  message: string;
  correlationId: string;
  requestId?: string;
  httpStatus?: number;
  meta?: Record<string, any>;
  stack?: string;
};

// Mock logs data
const LOGS: LogItem[] = [
  {
    id: "lg_1007",
    time: new Date(Date.now()-5*60e3).toISOString(),
    tenant: "t_zencare",
    client: "ZenCare Homes",
    severity: "error",
    source: "Workflow",
    code: "WEBHOOK_429",
    message: "CRM upsert lead rate limited",
    correlationId: "corr-2c9f-7a11",
    requestId: "run_98765:node_4",
    httpStatus: 429,
    meta: {
      endpoint: "https://api.hubspot.com/crm/v3/objects/contacts",
      retryCount: 2,
      xvcSignature: "sha256=ab83e...",
      xvcTimestamp: Math.floor(Date.now()/1000),
      idempotencyKey: "idmp-0a2b-ff34",
      workflowId: "wf_12345",
      stepId: "node_4"
    },
    stack: `Error: 429 Too Many Requests\n    at HTTP.post (...)`,
  },
  {
    id: "lg_1008",
    time: new Date(Date.now()-17*60e3).toISOString(),
    tenant: "t_acme",
    client: "Acme Health",
    severity: "warn",
    source: "Agent",
    code: "VOICE_QUALITY",
    message: "Audio quality degraded during call",
    correlationId: "corr-8f3a-1b22",
    requestId: "call_54321",
    meta: {
      callId: "call_54321",
      duration: 180,
      qualityScore: 0.65
    }
  },
  {
    id: "lg_1009",
    time: new Date(Date.now()-45*60e3).toISOString(),
    tenant: "t_delta",
    client: "Delta Realty",
    severity: "info",
    source: "Telephony",
    code: "CALL_COMPLETED",
    message: "Call completed successfully",
    correlationId: "corr-9d4e-5c77",
    requestId: "call_11111",
    meta: {
      callId: "call_11111",
      duration: 240,
      outcome: "success"
    }
  }
];

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<SelectOption>({ id: 1, name: "All Levels" });
  const [serviceFilter, setServiceFilter] = useState<SelectOption>({ id: 1, name: "All Services" });
  const [logsData, setLogsData] = useState<LogItem[]>(LOGS);
  const [loading, setLoading] = useState(false);

  const levelOptions: SelectOption[] = [
    { id: 1, name: "All Levels" },
    { id: 2, name: "Error" },
    { id: 3, name: "Warning" },
    { id: 4, name: "Info" },
    { id: 5, name: "Debug" }
  ];

  const serviceOptions: SelectOption[] = [
    { id: 1, name: "All Services" },
    { id: 2, name: "API" },
    { id: 3, name: "Authentication" },
    { id: 4, name: "Billing" },
    { id: 5, name: "Workflow" },
    { id: 6, name: "Telephony" }
  ];

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.correlationId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Level filtering logic
    const matchesLevel = levelFilter.id === 1 || // "All Levels"
                        (levelFilter.name === "Error" && log.severity === "error") ||
                        (levelFilter.name === "Warning" && log.severity === "warn") ||
                        (levelFilter.name === "Info" && log.severity === "info") ||
                        (levelFilter.name === "Debug" && log.severity === "debug");
    
    // Service filtering logic
    const matchesService = serviceFilter.id === 1 || // "All Services"
                          log.source === serviceFilter.name;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
      case "warn": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      case "info": return "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30";
      case "debug": return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case "API": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      case "Authentication": return "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30";
      case "Billing": return "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30";
      case "Workflow": return "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30";
      case "Telephony": return "bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const errorCount = logsData.filter(log => log.severity === "error").length;
  const warningCount = logsData.filter(log => log.severity === "warn").length;
  const todayLogs = logsData.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.time).toDateString() === today;
  }).length;

  return (
    <Layout title="Error Logs">
                  <div className="space-y-3">
        {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card title="Total Logs" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{logsData.length}</div>
            <div className="text-xs text-gray-500">all time</div>
          </Card>
          <Card title="Errors" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{errorCount}</div>
            <div className="text-xs text-gray-500">require attention</div>
          </Card>
          <Card title="Warnings" className="p-6"> 
            <div className="text-2xl font-bold text-t-primary">{warningCount}</div>
            <div className="text-xs text-gray-500">potential issues</div>
          </Card>
          <Card title="Today's Logs" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{todayLogs}</div>
            <div className="text-xs text-gray-500">in last 24 hours</div>
          </Card>
        </div>

        {/* Logs Table */}
        <Card title="System Logs" className="p-6">
          <div className="mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                  isGray
                />
                <Select
                  value={levelFilter}
                  onChange={setLevelFilter}
                  options={levelOptions}
                  className="w-full sm:w-40"
                />
                <Select
                  value={serviceFilter}
                  onChange={setServiceFilter}
                  options={serviceOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  <Icon name="download" className="w-4 h-4 mr-2" />
                  Export Logs
              </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader text="Loading logs..." />
            </div>
          ) : (
            <Table
              cellsThead={
                <>
                  <th className="text-left">Timestamp</th>
                  <th className="text-left">Severity</th>
                  <th className="text-left">Services</th>
                  <th className="text-left">Code</th>
                  <th className="text-left">Message</th>
                  <th className="text-left">Client</th>
                  <th className="text-left">Actions</th>
                </>
              }
            >
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <td className="text-sm font-mono">
                    {new Date(log.time).toLocaleString()}
                  </td>
                  <td>
                    <Badge className={getLevelColor(log.severity)}>
                      {log.severity.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <Badge className={getServiceColor(log.source)}>
                      {log.source}
                    </Badge>
                  </td>
                  <td className="font-mono text-sm">{log.code}</td>
                  <td className="text-gray-600 max-w-md truncate">{log.message}</td>
                  <td className="text-sm">{log.client}</td>
                  <td>
                    <Button>
                      View Details
                    </Button>
                  </td>
                </TableRow>
              ))}
            </Table>
          )}

          {filteredLogs.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No logs found matching your criteria.
            </div>
          )}
        </Card>

        {/* Log Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card title="Log Levels Distribution" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Error</span>
                <span className="font-medium text-red-600">{errorCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warning</span>
                <span className="font-medium text-yellow-600">{warningCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Info</span>
                <span className="font-medium text-blue-600">
                  {logsData.filter(log => log.severity === "info").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debug</span>
                <span className="font-medium text-gray-600">
                  {logsData.filter(log => log.severity === "debug").length}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Service Activity" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">API</span>
                <span className="font-medium">
                  {logsData.filter(log => log.source === "API").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authentication</span>
                <span className="font-medium">
                  {logsData.filter(log => log.source === "Authentication").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-medium">
                  {logsData.filter(log => log.source === "Billing").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Workflow</span>
                <span className="font-medium">
                  {logsData.filter(log => log.source === "Workflow").length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LogsPage;