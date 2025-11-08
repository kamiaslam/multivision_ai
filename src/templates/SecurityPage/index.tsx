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
import { SelectOption } from "@/types/select";

type SecurityEvent = {
  time: string;
  actor: string;
  action: string;
  risk: "low" | "med" | "high";
};

// Simple security events data matching Data.tsx format
const securityEvents: SecurityEvent[] = [
  { time: "12:41", actor: "admin@zencare", action: "API key created", risk: "low" },
  { time: "11:22", actor: "dev@nimbus", action: "Rate limit exceeded", risk: "med" },
  { time: "09:03", actor: "system", action: "Login from new device", risk: "high" },
  { time: "08:15", actor: "user@acme", action: "Password changed", risk: "low" },
  { time: "07:30", actor: "api@delta", action: "Multiple failed logins", risk: "high" },
  { time: "06:45", actor: "admin@nimbus", action: "User permissions modified", risk: "med" },
];

const SecurityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<SelectOption>({ id: 1, name: "All Risk Levels" });
  const [eventsData, setEventsData] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadSecurityEvents = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setEventsData(securityEvents);
      setLoading(false);
    };

    loadSecurityEvents();
  }, []);

  const riskOptions: SelectOption[] = [
    { id: 1, name: "All Risk Levels" },
    { id: 2, name: "High" },
    { id: 3, name: "Medium" },
    { id: 4, name: "Low" }
  ];

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter.name === "All Risk Levels" || event.risk === riskFilter.name.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
      case "med": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      case "low": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const highRiskEvents = eventsData.filter(e => e.risk === "high").length;
  const medRiskEvents = eventsData.filter(e => e.risk === "med").length;
  const lowRiskEvents = eventsData.filter(e => e.risk === "low").length;
  const totalEvents = eventsData.length;

  return (
    <Layout title="Security">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="High Risk Events" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{highRiskEvents}</div>
            <div className="text-xs text-gray-500">require attention</div>
          </Card>
          <Card title="Medium Risk Events" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{medRiskEvents}</div>
            <div className="text-xs text-gray-500">need monitoring</div>
          </Card>
          <Card title="Low Risk Events" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{lowRiskEvents}</div>
            <div className="text-xs text-gray-500">informational</div>
          </Card>
          <Card title="Total Events" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{totalEvents}</div>
            <div className="text-xs text-gray-500">all security events</div>
          </Card>
        </div>

        {/* Security Events Table */}
        <Card title="Security Events" className="p-6">
          <div className="mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                  isGray
                />
                <Select
                  value={riskOptions.find(option => option.id === riskFilter.id) || null}
                  onChange={(value) => setRiskFilter(value || { id: 1, name: "All Risk Levels" })}
                  options={riskOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  <Icon name="download" className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading security events...</div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block lg:hidden space-y-4">
                {filteredEvents.map((event, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-t-primary">{event.actor}</p>
                        <p className="text-sm text-t-secondary">{event.time}</p>
                      </div>
                      <Badge className={getRiskColor(event.risk)}>
                        {event.risk === "med" ? "Medium" : event.risk.charAt(0).toUpperCase() + event.risk.slice(1)}
                      </Badge>
                    </div>

                    {/* Action */}
                    <div>
                      <p className="text-sm text-t-secondary">Action</p>
                      <p className="text-t-primary">{event.action}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button isStroke className="flex-1">
                        View
                      </Button>
                      <Button isStroke className="flex-1">
                        Investigate
                      </Button>
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
                        <th className="text-left">Time</th>
                        <th className="text-left">Actor</th>
                        <th className="text-left">Action</th>
                        <th className="text-left">Risk Level</th>
                        <th className="text-right">Actions</th>
                      </>
                    }
                  >
                    {filteredEvents.map((event, index) => (
                      <TableRow key={index}>
                        <td className="text-sm font-mono">{event.time}</td>
                        <td className="font-medium">{event.actor}</td>
                        <td className="text-gray-600">{event.action}</td>
                        <td>
                          <Badge className={getRiskColor(event.risk)}>
                            {event.risk === "med" ? "Medium" : event.risk.charAt(0).toUpperCase() + event.risk.slice(1)}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button isStroke>
                              View
                            </Button>
                            <Button isStroke>
                              Investigate
                            </Button>
                          </div>
                        </td>
                      </TableRow>
                    ))}
                  </Table>
                </div>
              </div>
            </>
          )}

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No security events found matching your criteria.
            </div>
          )}
        </Card>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Threat Detection" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Malware Blocked</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phishing Attempts</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brute Force Attacks</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DDoS Attempts</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </Card>

          <Card title="Access Control" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Failed Logins</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Successful Logins</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Password Resets</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">2FA Enabled</span>
                <span className="font-medium">89%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityPage;