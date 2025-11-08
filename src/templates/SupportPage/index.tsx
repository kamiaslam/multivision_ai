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


// Local ticket data structure and mock data
type Ticket = {
  id: string;
  subject: string;
  customer: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdAt: string;
  responseTime: number;
};

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Login issues with mobile app",
    customer: "John Smith",
    priority: "high",
    status: "open",
    assignedTo: "Sarah Wilson",
    createdAt: "2024-01-22T10:30:00Z",
    responseTime: 2.5
  },
  {
    id: "TKT-002",
    subject: "Billing discrepancy in invoice",
    customer: "Emily Davis",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Mike Johnson",
    createdAt: "2024-01-21T14:15:00Z",
    responseTime: 1.8
  },
  {
    id: "TKT-003",
    subject: "Feature request: Dark mode",
    customer: "Alex Chen",
    priority: "low",
    status: "resolved",
    assignedTo: "Lisa Brown",
    createdAt: "2024-01-20T09:45:00Z",
    responseTime: 4.2
  },
  {
    id: "TKT-004",
    subject: "Critical system outage",
    customer: "Robert Taylor",
    priority: "critical",
    status: "resolved",
    assignedTo: "David Lee",
    createdAt: "2024-01-19T16:20:00Z",
    responseTime: 0.5
  },
  {
    id: "TKT-005",
    subject: "Password reset not working",
    customer: "Maria Garcia",
    priority: "medium",
    status: "closed",
    assignedTo: "Sarah Wilson",
    createdAt: "2024-01-18T11:10:00Z",
    responseTime: 3.1
  }
];

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState(0);
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTickets = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTicketsData(tickets);
      setLoading(false);
    };

    loadTickets();
  }, []);

  const statusOptions = [
    { id: 0, name: "All Status" },
    { id: 1, name: "Open" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Resolved" },
    { id: 4, name: "Closed" }
  ];

  const priorityOptions = [
    { id: 0, name: "All Priorities" },
    { id: 1, name: "Critical" },
    { id: 2, name: "High" },
    { id: 3, name: "Medium" },
    { id: 4, name: "Low" }
  ];

  const getStatusValue = (id: number) => {
    const statusMap = ["all", "open", "in_progress", "resolved", "closed"];
    return statusMap[id] || "all";
  };

  const getPriorityValue = (id: number) => {
    const priorityMap = ["all", "critical", "high", "medium", "low"];
    return priorityMap[id] || "all";
  };

  const filteredTickets = ticketsData.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusValue = getStatusValue(statusFilter);
    const priorityValue = getPriorityValue(priorityFilter);
    const matchesStatus = statusValue === "all" || ticket.status === statusValue;
    const matchesPriority = priorityValue === "all" || ticket.priority === priorityValue;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30";
      case "in_progress": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      case "resolved": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      case "closed": return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
      case "high": return "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30";
      case "medium": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      case "low": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const openTickets = ticketsData.filter(t => t.status === "open").length;
  const inProgressTickets = ticketsData.filter(t => t.status === "in_progress").length;
  const resolvedTickets = ticketsData.filter(t => t.status === "resolved").length;
  const avgResponseTime = ticketsData.length > 0 
    ? ticketsData.reduce((sum, t) => sum + t.responseTime, 0) / ticketsData.length 
    : 0;

  return (
    <Layout title="Support">
                  <div className="space-y-3">
        {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card title="Open Tickets" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{openTickets}</div>
            <div className="text-xs text-gray-500">need attention</div>
          </Card>
          <Card title="In Progress" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{inProgressTickets}</div>
            <div className="text-xs text-gray-500">being worked on</div>
          </Card>
          <Card title="Resolved Tickets" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{resolvedTickets}</div>
            <div className="text-xs text-gray-500">this month</div>
          </Card>
          <Card title="Avg Response" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{avgResponseTime.toFixed(1)}h</div>
            <div className="text-xs text-gray-500">response time</div>
          </Card>
        </div>

        {/* Support Tickets Table */}
        <Card title="Support Tickets" className="p-6">
          <div className="mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                  isGray
                />
                <Select
                  value={statusOptions.find(option => option.id === statusFilter) || null}
                  onChange={(value) => setStatusFilter(value?.id || 0)}
                  options={statusOptions}
                  className="w-full sm:w-40"
                />
                <Select
                  value={priorityOptions.find(option => option.id === priorityFilter) || null}
                  onChange={(value) => setPriorityFilter(value?.id || 0)}
                  options={priorityOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading tickets...</div>
          ) : (
            <Table
              cellsThead={
                <>
                  <th className="text-left">Ticket ID</th>
                  <th className="text-left">Subject</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Priority</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Assigned To</th>
                  <th className="text-left">Created</th>
                  <th className="text-left">Actions</th>
                </>
              }
            >
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <td className="font-mono font-medium">{ticket.id}</td>
                  <td className="font-medium max-w-xs truncate">{ticket.subject}</td>
                  <td className="text-gray-600">{ticket.customer}</td>
                  <td>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </td>
                  <td className="text-gray-600">{ticket.assignedTo}</td>
                  <td className="text-gray-600">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button>
                        View
                      </Button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </Table>
          )}

          {filteredTickets.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No tickets found matching your criteria.
            </div>
          )}
        </Card>

        {/* Support Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card title="Resolution Metrics" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">First Response Time</span>
                <span className="font-medium">2.3h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution Time</span>
                <span className="font-medium">18.5h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-medium">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium">94.2%</span>
              </div>
            </div>
          </Card>

          <Card title="Ticket Categories" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Technical Issues</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Questions</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feature Requests</span>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Issues</span>
                <span className="font-medium">9%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;