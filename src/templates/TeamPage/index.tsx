"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { SelectOption } from "@/types/select";

// Mock data types
type Role = "owner" | "admin" | "subadmin" | "support";
type PermissionKey =
  | "users_view" | "agents_view" | "billing_view" | "workflows_view" | "telephony_view" | "security_view" | "support_view" | "insights_view"
  | "pricing_edit" | "account_pricing_edit" | "agents_deploy" | "workflows_edit" | "numbers_manage"
  | "logs_view" | "logs_manage" | "refunds_manage" | "team_manage";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastActive: string; // ISO
  permissions: Record<PermissionKey, boolean>;
};

// Permission presets
const PERMISSION_LIST: PermissionKey[] = [
  "users_view","agents_view","billing_view","workflows_view","telephony_view","security_view","support_view","insights_view",
  "pricing_edit","account_pricing_edit","agents_deploy","workflows_edit","numbers_manage",
  "logs_view","logs_manage","refunds_manage","team_manage",
];

function presetFor(role: Role): Record<PermissionKey, boolean> {
  const all = Object.fromEntries(PERMISSION_LIST.map(k=>[k,false])) as Record<PermissionKey, boolean>;
  if(role === "owner") PERMISSION_LIST.forEach(k=>all[k]=true);
  if(role === "admin") Object.assign(all, {
    users_view:true, agents_view:true, billing_view:true, workflows_view:true, telephony_view:true, security_view:true, support_view:true, insights_view:true,
    pricing_edit:true, account_pricing_edit:true, agents_deploy:true, workflows_edit:true, numbers_manage:true,
    logs_view:true, logs_manage:true, refunds_manage:true, team_manage:true,
  });
  if(role === "subadmin") Object.assign(all, {
    users_view:true, agents_view:true, billing_view:true, workflows_view:true, telephony_view:true, security_view:true, support_view:true, insights_view:true,
    account_pricing_edit:true, agents_deploy:true, workflows_edit:true, numbers_manage:true,
    logs_view:true,
  });
  if(role === "support") Object.assign(all, {
    users_view:true, agents_view:true, support_view:true, telephony_view:true, logs_view:true, insights_view:true,
  });
  return all;
}

// Mock staff data
const STAFF: StaffMember[] = [
  { id: "u1", name: "Kam Aslam", email: "kam@voicecake.io", role: "owner", active: true, lastActive: new Date().toISOString(), permissions: presetFor("owner") },
  { id: "u2", name: "Aisha Khan", email: "aisha@voicecake.io", role: "admin", active: true, lastActive: new Date(Date.now()-3600e3).toISOString(), permissions: presetFor("admin") },
  { id: "u3", name: "Tom Green", email: "tom@voicecake.io", role: "support", active: true, lastActive: new Date(Date.now()-86400e3*2).toISOString(), permissions: presetFor("support") },
];

// Helper function to check permissions
function hasPerm(member: StaffMember, permission: string): boolean {
  return member.permissions[permission as PermissionKey] || false;
}

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<SelectOption>({ id: 1, name: "All Roles" });
  const [statusFilter, setStatusFilter] = useState<SelectOption>({ id: 1, name: "All Status" });
  const [staffData, setStaffData] = useState<StaffMember[]>(STAFF);
  const [loading, setLoading] = useState(false);

  const roleOptions: SelectOption[] = [
    { id: 1, name: "All Roles" },
    { id: 2, name: "Owner" },
    { id: 3, name: "Admin" },
    { id: 4, name: "Subadmin" },
    { id: 5, name: "Support" }
  ];

  const statusOptions: SelectOption[] = [
    { id: 1, name: "All Status" },
    { id: 2, name: "Active" },
    { id: 3, name: "Inactive" }
  ];

  const filteredStaff = staffData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter.name === "All Roles" || member.role === roleFilter.name.toLowerCase();
    const matchesStatus = statusFilter.name === "All Status" || 
                         (statusFilter.name === "Active" && member.active) ||
                         (statusFilter.name === "Inactive" && !member.active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "owner": return "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30";
      case "admin": return "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30";
      case "subadmin": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      case "support": return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary-02/20 text-primary-02 border border-primary-02/30";
      case "inactive": return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
      case "pending": return "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30";
      default: return "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    }
  };

  const activeMembers = staffData.filter(m => m.active).length;
  const inactiveMembers = staffData.filter(m => !m.active).length;
  const adminCount = staffData.filter(m => m.role === "admin" || m.role === "owner").length;

  return (
    <Layout title="Team & Permissions">
                  <div className="space-y-3">
        {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card title="Total Members" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{staffData.length}</div>
            <div className="text-xs text-gray-500">team members</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-60 mb-1">Active Members</div>
            <div className="text-2xl font-bold text-t-primary">{activeMembers}</div>
            <div className="text-xs text-gray-500">currently active</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Inactive Members</div>
            <div className="text-2xl font-bold text-t-primary">{inactiveMembers}</div>
            <div className="text-xs text-gray-500">currently inactive</div>
          </Card>
          <Card title="Administrators" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{adminCount}</div>
            <div className="text-xs text-gray-500">with admin access</div>
          </Card>
        </div>

        {/* Team Members Table */}
        <Card title="Team Members" className="p-6">
          <div className="mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                  isGray
                />
                <Select
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={roleOptions}
                  className="w-full sm:w-40"
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  <Icon name="user-plus" className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading team members...</div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block lg:hidden space-y-4">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-t-primary">{member.name}</h3>
                        <p className="text-sm text-t-secondary">{member.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(member.active ? "active" : "inactive")}>
                          {member.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    {/* Last Active */}
                    <div>
                      <p className="text-sm text-t-secondary">Last Active</p>
                      <p className="text-t-primary">{new Date(member.lastActive).toLocaleDateString()}</p>
                    </div>

                    {/* Permissions */}
                    <div>
                      <p className="text-sm text-t-secondary mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(member.permissions)
                          .filter(([_, hasPermission]) => hasPermission)
                          .slice(0, 3)
                          .map(([perm, _]) => (
                            <Badge key={perm} className="bg-blue-50 text-blue-700 text-xs">
                              {perm.replace('_', ' ')}
                            </Badge>
                          ))}
                        {Object.entries(member.permissions).filter(([_, hasPermission]) => hasPermission).length > 3 && (
                          <Badge className="bg-gray-50 text-gray-700 text-xs">
                            +{Object.entries(member.permissions).filter(([_, hasPermission]) => hasPermission).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button className="flex-1">
                        Edit
                      </Button>
                      {member.active && member.role !== "admin" && (
                        <Button className="flex-1">
                          Deactivate
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
                        <th className="text-left">Name</th>
                        <th className="text-left">Email</th>
                        <th className="text-left">Role</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Last Active</th>
                        <th className="text-left">Permissions</th>
                        <th className="text-left">Actions</th>
                      </>
                    }
                  >
                    {filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <td className="font-medium">{member.name}</td>
                        <td className="text-gray-600">{member.email}</td>
                        <td>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <Badge className={getStatusColor(member.active ? "active" : "inactive")}>
                            {member.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="text-gray-600">
                          {new Date(member.lastActive).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(member.permissions)
                              .filter(([_, hasPermission]) => hasPermission)
                              .slice(0, 2)
                              .map(([perm, _]) => (
                                <Badge key={perm} className="bg-blue-50 text-blue-700 text-xs">
                                  {perm.replace('_', ' ')}
                                </Badge>
                              ))}
                            {Object.entries(member.permissions).filter(([_, hasPermission]) => hasPermission).length > 2 && (
                              <Badge className="bg-gray-50 text-gray-700 text-xs">
                                +{Object.entries(member.permissions).filter(([_, hasPermission]) => hasPermission).length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Button>
                              Edit
                            </Button>
                            {member.active && member.role !== "admin" && (
                              <Button>
                                Deactivate
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

          {filteredStaff.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No team members found matching your criteria.
            </div>
          )}
        </Card>

        {/* Permissions Overview */}
        <Card title="Permissions Overview" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">
                {staffData.filter(m => hasPerm(m, 'user_management')).length}
              </div>
              <div className="text-sm text-gray-600">User Management</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">
                {staffData.filter(m => hasPerm(m, 'billing_access')).length}
              </div>
              <div className="text-sm text-gray-600">Billing Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">
                {staffData.filter(m => hasPerm(m, 'system_config')).length}
              </div>
              <div className="text-sm text-gray-600">System Config</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-t-primary">
                {staffData.filter(m => hasPerm(m, 'audit_logs')).length}
              </div>
              <div className="text-sm text-gray-600">Audit Logs</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamPage;