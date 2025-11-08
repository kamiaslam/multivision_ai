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
import { workflows, type Workflow } from "@/lib/data";

const WorkflowsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(1);
  const [workflowData, setWorkflowData] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadWorkflows = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkflowData(workflows);
      setLoading(false);
    };

    loadWorkflows();
  }, []);

  const statusOptions = [
    { id: 1, name: "All Status" },
    { id: 2, name: "Active" },
    { id: 3, name: "Paused" },
    { id: 4, name: "Draft" },
    { id: 5, name: "Error" },
  ];

  const statusFilterMap = {
    1: "all",
    2: "active", 
    3: "paused",
    4: "draft",
    5: "error"
  };

  const currentStatusFilter = statusFilterMap[statusFilter as keyof typeof statusFilterMap] || "all";
  
  const filteredWorkflows = workflowData.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = currentStatusFilter === "all" || workflow.status === currentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      case "paused": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      case "draft": return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
      case "error": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case "webhook": return "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30";
      case "schedule": return "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30";
      case "manual": return "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30";
      case "event": return "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const activeWorkflows = workflowData.filter(w => w.status === 'active').length;
  const totalExecutions = workflowData.reduce((sum, w) => sum + w.executions, 0);
  const avgSuccessRate = workflowData.length > 0 
    ? workflowData.reduce((sum, w) => sum + w.successRate, 0) / workflowData.length 
    : 0;

  return (
    <Layout title="Workflows">
      <div className="space-y-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card title="Total Workflows" className="p-6 mb-0">
            <div className="text-2xl font-bold text-t-primary">{workflowData.length}</div>
            <div className="text-xs text-t-tertiary">all workflows</div>
          </Card>
          <Card title="Active Workflows" className="p-6 mb-0">
            <div className="text-2xl font-bold text-t-primary">{activeWorkflows}</div>
            <div className="text-xs text-t-tertiary">of {workflowData.length} total</div>
          </Card>
          <Card title="Total Executions" className="p-6 mb-0">
            <div className="text-2xl font-bold text-t-primary">{totalExecutions.toLocaleString()}</div>
            <div className="text-xs text-t-tertiary">across all workflows</div>
          </Card>
          <Card title="Avg Success Rate" className="p-6 mb-0">
            <div className="text-sm text-t-secondary mb-1">Avg Success Rate</div>
            <div className="text-2xl font-bold text-white">{avgSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-t-tertiary">last 30 days</div>
          </Card>
        </div>

        {/* Workflows Table */}
        <Card title="Workflows" className="p-6">
          <div className="mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                  isGray
                />
                <Select
                  value={statusOptions.find(option => option.id === statusFilter) || null}
                  onChange={(option) => setStatusFilter(option.id)}
                  options={statusOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-t-tertiary">Loading workflows...</div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block lg:hidden space-y-4">
                {filteredWorkflows.map((workflow) => (
                  <div key={workflow.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-t-primary">{workflow.name}</h3>
                        <p className="text-sm text-t-secondary mt-1">{workflow.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getTriggerColor(workflow.trigger)}>
                          {workflow.trigger.charAt(0).toUpperCase() + workflow.trigger.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-t-secondary">Executions</p>
                        <p className="font-medium text-t-primary">{workflow.executions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-t-secondary">Success Rate</p>
                        <p className={`font-medium ${
                          workflow.successRate >= 95 ? 'text-primary-02' :
                          workflow.successRate >= 80 ? 'text-[#FFB020]' : 'text-[#FF6A55]'
                        }`}>
                          {workflow.successRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Last Run */}
                    <div>
                      <p className="text-sm text-t-secondary">Last Run</p>
                      <p className="text-t-primary">{new Date(workflow.lastRun).toLocaleString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button isStroke className="flex-1">
                        <Icon name="edit" className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {workflow.status === "active" ? (
                        <Button isStroke className="flex-1">
                          <Icon name="pause" className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button className="flex-1">
                          <Icon name="play" className="w-4 h-4 mr-2" />
                          Start
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
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Trigger</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Executions</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Success Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Last Run</th>
                        <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
                      </>
                    }
                  >
                    {filteredWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <td className="py-4 px-4 font-medium text-t-primary">{workflow.name}</td>
                        <td className="py-4 px-4 text-t-secondary max-w-xs truncate">{workflow.description}</td>
                        <td className="py-4 px-4">
                          <Badge className={getTriggerColor(workflow.trigger)}>
                            {workflow.trigger.charAt(0).toUpperCase() + workflow.trigger.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(workflow.status)}>
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 font-medium text-t-primary">{workflow.executions.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${
                            workflow.successRate >= 95 ? 'text-primary-02' :
                            workflow.successRate >= 80 ? 'text-[#FFB020]' : 'text-[#FF6A55]'
                          }`}>
                            {workflow.successRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-t-secondary">
                          {new Date(workflow.lastRun).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                           <div className="flex gap-2">
                             <Button isStroke>
                               <Icon name="edit" className="w-4 h-4 mr-2" />
                               Edit
                             </Button>
                             {workflow.status === "active" ? (
                               <Button isStroke>
                                 <Icon name="pause" className="w-4 h-4 mr-2" />
                                 Pause
                               </Button>
                             ) : (
                               <Button>
                                 <Icon name="play" className="w-4 h-4 mr-2" />
                                 Start
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

          {filteredWorkflows.length === 0 && !loading && (
            <div className="text-center py-8 text-t-tertiary">
              No workflows found matching your criteria.
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default WorkflowsPage;