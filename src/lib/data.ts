/*****************************************
 * MOCK API LAYER + TYPES
 *****************************************/
const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Global pricing shape
export type Pricing = {
  conversaPerMin: number; // $/min
  empathPerMin: number; // $/min
  automationsPack: number; // $ per 10k automations
  premiumVoiceSurcharge: number; // $/min
};

// Per-account pricing override
export type AccountPricing = Pricing & { enabled: boolean };

export type AuditEvent = {
  at: string; // ISO time
  actor: string; // email or name
  scope: "global" | "account";
  account?: string; // when scope=account
  from: Partial<Pricing>;
  to: Partial<Pricing>;
  note?: string;
};

// Permissions
export type Role = "owner" | "admin" | "subadmin" | "support";
export type PermissionKey =
  | "users_view" | "agents_view" | "billing_view" | "workflows_view" | "telephony_view" | "security_view" | "support_view" | "insights_view"
  | "pricing_edit" | "account_pricing_edit" | "agents_deploy" | "workflows_edit" | "numbers_manage"
  | "logs_view" | "logs_manage" | "refunds_manage" | "team_manage";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastActive: string; // ISO
  permissions: Record<PermissionKey, boolean>;
};

export type LogItem = {
  id: string;
  time: string; // ISO
  tenant: string;
  client: string;
  severity: "error" | "warn" | "info";
  source: "Agent" | "Workflow" | "Telephony" | "Billing" | "API";
  code: string;
  message: string;
  correlationId: string;
  requestId?: string;
  httpStatus?: number;
  meta?: Record<string, any>;
  stack?: string;
};

export type User = {
  company: string;
  plan: string;
  seats: number;
  status: string;
  mrr: number;
  autoRenew: boolean;
};

export type Agent = {
  name: string;
  type: string;
  client: string;
  latency: number;
  csat: number;
  calls: number;
};

export type Invoice = {
  id: string;
  client: string;
  amount: number;
  status: string;
  period: string;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  client: string;
  trigger: string;
  status: string;
  executions: number;
  successRate: number;
  lastRun: string;
};

export type PhoneNumber = {
  number: string;
  client: string;
  mappedTo: string;
  inbound: number;
  outbound: number;
  health: string;
};

export type SecurityEvent = {
  time: string;
  actor: string;
  action: string;
  risk: "low" | "med" | "high";
};

export type Ticket = {
  id: string;
  client: string;
  subject: string;
  priority: string;
  sla: string;
  status: string;
};

export type UsageInputs = {
  minutesConversa: number;
  minutesEmpath: number;
  automations: number;
  premiumMinutes: number;
};

export type RevenueData = {
  month: string;
  mrr: number;
  payg: number;
};

export type UsageSplit = {
  name: string;
  value: number;
};

export type ChurnData = {
  month: string;
  churn: number;
};

export type CountryUsage = {
  country: string;
  code: string;
  calls: number;
  minutes: number;
  revenue: number;
};

// In-memory mock DB
let GLOBAL_PRICING: Pricing = {
  conversaPerMin: 0.12,
  empathPerMin: 0.13,
  automationsPack: 10,
  premiumVoiceSurcharge: 0.015,
};

const ACCOUNT_PRICING: Record<string, AccountPricing> = {
  "ZenCare Homes": { ...GLOBAL_PRICING, empathPerMin: 0.11, enabled: true },
};

const AUDIT_LOG: AuditEvent[] = [];

// Role presets
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

// Mock staff
let STAFF: StaffMember[] = [
  { id: "u1", name: "Kam Aslam", email: "kam@voicecake.io", role: "owner", active: true, lastActive: new Date().toISOString(), permissions: presetFor("owner") },
  { id: "u2", name: "Aisha Khan", email: "aisha@voicecake.io", role: "admin", active: true, lastActive: new Date(Date.now()-3600e3).toISOString(), permissions: presetFor("admin") },
  { id: "u3", name: "Tom Green", email: "tom@voicecake.io", role: "support", active: true, lastActive: new Date(Date.now()-86400e3*2).toISOString(), permissions: presetFor("support") },
];

// Simulated logs
let LOGS: LogItem[] = [
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
    stack: `Error: 429 Too Many Requests
    at HTTP.post (...)`,
  },
  {
    id: "lg_1008",
    time: new Date(Date.now()-17*60e3).toISOString(),
    tenant: "t_acme",
    client: "Acme Health",
    severity: "warn",
    source: "Telephony",
    code: "SIP_QUALITY_DROP",
    message: "MOS score dipped below 3.2 for +44 20 7123 9876",
    correlationId: "corr-a1b2-c3d4",
    meta: { number: "+44 20 7123 9876", callId: "call_abc" },
  },
  {
    id: "lg_1009",
    time: new Date(Date.now()-30*60e3).toISOString(),
    tenant: "t_nimbus",
    client: "Nimbus Retail",
    severity: "error",
    source: "Agent",
    code: "LLM_TIMEOUT",
    message: "Conversa planning tool timed out at 15s",
    correlationId: "corr-9f21-zz77",
    meta: { agent: "Sales SDR-1", latencyMs: 15023 },
    stack: "TimeoutError: operation exceeded 15000ms"
  },
  {
    id: "lg_1010",
    time: new Date(Date.now()-55*60e3).toISOString(),
    tenant: "t_delta",
    client: "Delta Realty",
    severity: "error",
    source: "API",
    code: "AUTH_HMAC_INVALID",
    message: "Invalid X-VC-Signature on inbound webhook",
    correlationId: "corr-5f5e-1212",
    httpStatus: 401,
    meta: { header: "X-VC-Signature", expected: "sha256=...", received: "sha256=bad..." }
  }
];

const nowIso = () => new Date().toISOString();

// API Functions
export const API = {
  async getGlobalPricing(): Promise<Pricing> { await mockDelay(200); return { ...GLOBAL_PRICING }; },
  async updateGlobalPricing(p: Pricing, actor: string, note?: string): Promise<Pricing> {
    await mockDelay(400);
    const from = { ...GLOBAL_PRICING };
    GLOBAL_PRICING = { ...p };
    AUDIT_LOG.unshift({ at: nowIso(), actor, scope: "global", from, to: p, note });
    return { ...GLOBAL_PRICING };
  },
  async getAccountPricing(company: string): Promise<AccountPricing> { await mockDelay(180); return ACCOUNT_PRICING[company] || { ...GLOBAL_PRICING, enabled: false }; },
  async upsertAccountPricing(company: string, override: AccountPricing, actor: string, note?: string): Promise<AccountPricing> {
    await mockDelay(400);
    const from = ACCOUNT_PRICING[company] || { ...GLOBAL_PRICING, enabled: false };
    ACCOUNT_PRICING[company] = { ...override };
    AUDIT_LOG.unshift({ at: nowIso(), actor, scope: "account", account: company, from, to: override, note });
    return ACCOUNT_PRICING[company];
  },
  async getAudit(): Promise<AuditEvent[]> { await mockDelay(120); return [...AUDIT_LOG]; },
  async listStaff(): Promise<StaffMember[]> { await mockDelay(150); return STAFF.map(s=>({ ...s })); },
  async upsertStaff(member: StaffMember): Promise<StaffMember> {
    await mockDelay(250);
    const idx = STAFF.findIndex(s=>s.id===member.id);
    if(idx>=0) STAFF[idx] = { ...member }; else STAFF.unshift({ ...member });
    return { ...member };
  },
  async createStaff(name: string, email: string, role: Role): Promise<StaffMember> {
    await mockDelay(250);
    const m: StaffMember = { id: `u${Date.now()}`, name, email, role, active: true, lastActive: nowIso(), permissions: presetFor(role) };
    STAFF.unshift(m);
    return { ...m };
  },
  async listLogs(): Promise<LogItem[]> { await mockDelay(220); return LOGS.slice().sort((a,b)=>+new Date(b.time)-+new Date(a.time)); },
  async deleteLog(id: string): Promise<void> { await mockDelay(120); LOGS = LOGS.filter(l=>l.id!==id); },
};

/*****************************************
 * DASHBOARD DATA (MOCK)
 *****************************************/
export const revenueData: RevenueData[] = [
  { month: "Jan", mrr: 5200, payg: 1800 },
  { month: "Feb", mrr: 6400, payg: 2200 },
  { month: "Mar", mrr: 7100, payg: 2600 },
  { month: "Apr", mrr: 7600, payg: 2800 },
];

export const usageSplit: UsageSplit[] = [
  { name: "Conversa", value: 62 },
  { name: "Empath", value: 38 }
];

export const churnData: ChurnData[] = [
  { month: "Jan", churn: 5 },
  { month: "Feb", churn: 4 },
  { month: "Mar", churn: 6 },
  { month: "Apr", churn: 3 }
];

// Geo usage mock, totals by country
export const countryUsage: CountryUsage[] = [
  { country: "United Kingdom", code: "GB", calls: 2120, minutes: 3800, revenue: 9200 },
  { country: "United States", code: "US", calls: 1580, minutes: 3400, revenue: 8400 },
  { country: "Belgium", code: "BE", calls: 420, minutes: 760, revenue: 1800 },
  { country: "United Arab Emirates", code: "AE", calls: 260, minutes: 610, revenue: 1550 },
  { country: "Pakistan", code: "PK", calls: 300, minutes: 540, revenue: 1300 },
];

export const users: User[] = [
  { company: "Acme Health", plan: "Pro", seats: 12, status: "active", mrr: 899, autoRenew: true },
  { company: "Delta Realty", plan: "Starter", seats: 5, status: "trial", mrr: 129, autoRenew: false },
  { company: "Nimbus Retail", plan: "Business", seats: 24, status: "active", mrr: 1899, autoRenew: true },
  { company: "ZenCare Homes", plan: "Enterprise", seats: 64, status: "active", mrr: 7499, autoRenew: true },
];

export const agents: Agent[] = [
  { name: "Receptionist UK", type: "Conversa", client: "Acme Health", latency: 480, csat: 4.6, calls: 812 },
  { name: "Wellness Check", type: "Empath", client: "ZenCare Homes", latency: 540, csat: 4.8, calls: 1093 },
  { name: "Sales SDR-1", type: "Conversa", client: "Nimbus Retail", latency: 410, csat: 4.2, calls: 640 },
];

export const invoices: Invoice[] = [
  { id: "INV-1042", client: "Acme Health", amount: 1249, status: "paid", period: "Apr 2025" },
  { id: "INV-1043", client: "Delta Realty", amount: 89, status: "due", period: "Apr 2025" },
  { id: "INV-1044", client: "ZenCare Homes", amount: 9860, status: "paid", period: "Apr 2025" },
];

export const workflows: Workflow[] = [
  { 
    id: "wf_001", 
    name: "Lead Capture → HubSpot", 
    description: "Automatically capture leads from calls and sync to HubSpot CRM",
    client: "Nimbus Retail", 
    trigger: "webhook", 
    status: "active", 
    executions: 1432, 
    successRate: 99.6, 
    lastRun: "2024-04-15T10:30:00Z" 
  },
  { 
    id: "wf_002", 
    name: "Missed Call → SMS", 
    description: "Send SMS follow-up for missed calls with callback link",
    client: "Acme Health", 
    trigger: "event", 
    status: "active", 
    executions: 932, 
    successRate: 100.0, 
    lastRun: "2024-04-15T12:28:00Z" 
  },
  { 
    id: "wf_003", 
    name: "Care Alert → Webhook", 
    description: "Send urgent care alerts to external monitoring system",
    client: "ZenCare Homes", 
    trigger: "manual", 
    status: "active", 
    executions: 2204, 
    successRate: 99.9, 
    lastRun: "2024-04-15T12:29:00Z" 
  },
  { 
    id: "wf_004", 
    name: "Appointment Reminder", 
    description: "Send automated appointment reminders 24h before scheduled time",
    client: "Acme Health", 
    trigger: "schedule", 
    status: "paused", 
    executions: 567, 
    successRate: 98.2, 
    lastRun: "2024-04-14T09:15:00Z" 
  },
  { 
    id: "wf_005", 
    name: "Order Confirmation", 
    description: "Send order confirmation and tracking details to customers",
    client: "Nimbus Retail", 
    trigger: "webhook", 
    status: "draft", 
    executions: 0, 
    successRate: 0, 
    lastRun: "2024-04-10T14:22:00Z" 
  }
];

export const phoneNumbers: PhoneNumber[] = [
  { number: "+44 20 7123 9876", client: "Acme Health", mappedTo: "Receptionist UK", inbound: 812, outbound: 102, health: "ok" },
  { number: "+1 415 555 0199", client: "Nimbus Retail", mappedTo: "Sales SDR-1", inbound: 211, outbound: 540, health: "ok" },
  { number: "+44 161 555 0102", client: "ZenCare Homes", mappedTo: "Wellness Check", inbound: 1203, outbound: 36, health: "warning" },
];

export const securityEvents: SecurityEvent[] = [
  { time: "12:41", actor: "admin@zencare", action: "API key created", risk: "low" },
  { time: "11:22", actor: "dev@nimbus", action: "Rate limit exceeded", risk: "med" },
  { time: "09:03", actor: "system", action: "Login from new device", risk: "high" },
];

export const tickets: Ticket[] = [
  { id: "#4921", client: "Delta Realty", subject: "Workflow failed", priority: "high", sla: "3h", status: "open" },
  { id: "#4922", client: "Acme Health", subject: "Change plan", priority: "low", sla: "24h", status: "pending" },
  { id: "#4923", client: "ZenCare Homes", subject: "Latency spike", priority: "med", sla: "8h", status: "open" },
];

// Current user with RBAC
export const currentUser: StaffMember = {
  id: "u1",
  name: "Kam Aslam",
  email: "kam@voicecake.io",
  role: "owner",
  active: true,
  lastActive: new Date().toISOString(),
  permissions: presetFor("owner"),
};

export const hasPerm = (perm: PermissionKey) => !!currentUser.permissions[perm];

/*****************************************
 * UTILITY FUNCTIONS
 *****************************************/
export const DEFAULT_USAGE: UsageInputs = {
  minutesConversa: 1200,
  minutesEmpath: 800,
  automations: 18000,
  premiumMinutes: 150
};

export function calcInvoice(p: Pricing, u: UsageInputs) {
  const conversa = u.minutesConversa * p.conversaPerMin;
  const empath = u.minutesEmpath * p.empathPerMin;
  const premium = u.premiumMinutes * p.premiumVoiceSurcharge;
  const packs = Math.ceil(Math.max(u.automations, 0) / 10000);
  const automations = packs * p.automationsPack;
  const total = Number((conversa + empath + premium + automations).toFixed(2));
  return { conversa, empath, premium, automations, total };
}

export function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

// Export permission utilities
export { presetFor, PERMISSION_LIST };