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

// Phone number data from Data.tsx
const numbers = [
  { number: "+442071239876", client: "Acme Health", mappedTo: "Receptionist UK", inbound: 812, outbound: 102, health: "ok" },
  { number: "+14155550199", client: "Nimbus Retail", mappedTo: "Sales SDR-1", inbound: 211, outbound: 540, health: "ok" },
  { number: "+441615550102", client: "ZenCare Homes", mappedTo: "Wellness Check", inbound: 1203, outbound: 36, health: "warning" },
];

type PhoneNumber = {
  number: string;
  client: string;
  mappedTo: string;
  inbound: number;
  outbound: number;
  health: string;
};

const TelephonyPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(1);
  const [typeFilter, setTypeFilter] = useState(1);
  const [numbersData, setNumbersData] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadNumbers = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNumbersData(numbers);
      setLoading(false);
    };

    loadNumbers();
  }, []);

  const statusOptions: SelectOption[] = [
    { id: 1, name: "All Status" },
    { id: 2, name: "Active" },
    { id: 3, name: "Inactive" },
    { id: 4, name: "Pending" }
  ];

  const typeOptions: SelectOption[] = [
    { id: 1, name: "All Types" },
    { id: 2, name: "Local" },
    { id: 3, name: "Toll-Free" },
    { id: 4, name: "Mobile" }
  ];

  const statusFilterMap: Record<number, string> = {
    1: "all",
    2: "active",
    3: "inactive",
    4: "pending"
  };

  const typeFilterMap: Record<number, string> = {
    1: "all",
    2: "local",
    3: "toll-free",
    4: "mobile"
  };

  const currentStatusFilter = statusFilterMap[statusFilter] || "all";
  const currentTypeFilter = typeFilterMap[typeFilter] || "all";

  const filteredNumbers = numbersData.filter(number => {
    const matchesSearch = number.number.includes(searchTerm) ||
                         number.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (number.mappedTo && number.mappedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = currentStatusFilter === "all" || number.health === currentStatusFilter;
    const matchesType = currentTypeFilter === "all";
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      case "warning": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      case "error": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "local": return "bg-blue-100 text-blue-800";
      case "toll-free": return "bg-purple-100 text-purple-800";
      case "mobile": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeNumbers = numbersData.filter(n => n.health === "ok").length;
  const totalMinutes = numbersData.reduce((sum, n) => sum + n.inbound + n.outbound, 0);
  const totalCost = totalMinutes * 0.05; // Estimated cost per minute

  return (
    <Layout title="Telephony">
      <div className="space-y-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card title="Active Numbers" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{activeNumbers}</div>
            <div className="text-xs text-gray-500">of {numbersData.length} total</div>
          </Card>
          <Card title="Monthly Minutes" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{totalMinutes.toLocaleString()}</div>
            <div className="text-xs text-gray-500">across all numbers</div>
          </Card>
          <Card title="Monthly Cost" className="p-6">
            <div className="text-2xl font-bold text-t-primary">${totalCost.toFixed(2)}</div>
            <div className="text-xs text-gray-500">total telephony cost</div>
          </Card>
        </div>

        {/* Phone Numbers Table */}
        <Card title="Phone Numbers" className="p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                  isGray
                />
                <Select
                  value={statusOptions.find(opt => opt.id === statusFilter) || statusOptions[0]}
                  onChange={(option) => setStatusFilter(option.id)}
                  options={statusOptions}
                  className="w-full sm:w-40"
                />
                <Select
                  value={typeOptions.find(opt => opt.id === typeFilter) || typeOptions[0]}
                  onChange={(option) => setTypeFilter(option.id)}
                  options={typeOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  Add Number
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-t-tertiary">Loading phone numbers...</div>
          ) : (
            <Table 
              cellsThead={
                <>
                  <th className="text-left py-3 px-4 font-medium text-t-secondary">Number</th>
                  <th className="text-left py-3 px-4 font-medium text-t-secondary">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-t-secondary">Agent</th>
                  <th className="text-right py-3 px-4 font-medium text-t-secondary">Inbound</th>
                  <th className="text-right py-3 px-4 font-medium text-t-secondary">Outbound</th>
                  <th className="text-left py-3 px-4 font-medium text-t-secondary">Health</th>
                  <th className="text-right py-3 px-4 font-medium text-t-secondary">Actions</th>
                </>
              }
            >
              {filteredNumbers.map((number) => (
                <TableRow key={number.number}>
                  <td className="py-4 px-4 font-medium text-t-primary">{number.number}</td>
                  <td className="py-4 px-4 text-t-secondary">{number.client}</td>
                  <td className="py-4 px-4 text-t-secondary">{number.mappedTo}</td>
                  <td className="py-4 px-4 font-medium text-t-primary text-right">{number.inbound.toLocaleString()}</td>
                  <td className="py-4 px-4 font-medium text-t-primary text-right">{number.outbound.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(number.health)}>
                      {number.health.charAt(0).toUpperCase() + number.health.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button isStroke>
                        Configure
                      </Button>
                      <Button
                        isStroke={number.health === "ok"}
                        onClick={() => {
                          setNumbersData(prev => prev.map(n => 
                            n.number === number.number 
                              ? { ...n, health: n.health === "ok" ? "warning" : "ok" }
                              : n
                          ));
                        }}
                      >
                        {number.health === "ok" ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </Table>
          )}

          {filteredNumbers.length === 0 && !loading && (
            <div className="text-center py-8 text-t-tertiary">
              No phone numbers found matching your criteria.
            </div>
          )}
        </Card>

        {/* Call Analytics */}
        <Card title="Call Analytics" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">1,234</div>
              <div className="text-sm text-gray-600">Total Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">4.2m</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">$0.05</div>
              <div className="text-sm text-gray-600">Avg Cost/Min</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TelephonyPage;