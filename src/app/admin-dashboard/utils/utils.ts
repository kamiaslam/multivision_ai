import {
  Role,
  PERMISSION_LIST,
  PermissionKey,
  Pricing,
  StaffMember,
} from "../type";

export type UsageInputs = {
  minutesConversa: number;
  minutesEmpath: number;
  premiumMinutes: number;
  automations: number;
};

// calculate invoice based on pricing and usage
export function calcInvoice(p: Pricing, u: UsageInputs) {
  const conversa = u.minutesConversa * p.conversaPerMin;
  const empath = u.minutesEmpath * p.empathPerMin;
  const premium = u.premiumMinutes * p.premiumVoiceSurcharge;
  const packs = Math.ceil(Math.max(u.automations, 0) / 10000);
  const automations = packs * p.automationsPack;
  const total = Number((conversa + empath + premium + automations).toFixed(2));

  return { conversa, empath, premium, automations, total };
}

// format number as money string
export function fmtMoney(n: number | undefined | null) {
  if (n === undefined || n === null || isNaN(n)) {
    return "$0.00";
  }
  return `$${n.toFixed(2)}`;
}

export function presetFor(role: Role): Record<PermissionKey, boolean> {
  const all = Object.fromEntries(
    PERMISSION_LIST.map((k) => [k, false])
  ) as Record<PermissionKey, boolean>;
  if (role === "owner") PERMISSION_LIST.forEach((k) => (all[k] = true));
  if (role === "admin")
    Object.assign(all, {
      users_view: true,
      agents_view: true,
      billing_view: true,
      workflows_view: true,
      telephony_view: true,
      security_view: true,
      support_view: true,
      insights_view: true,
      pricing_edit: true,
      account_pricing_edit: true,
      agents_deploy: true,
      workflows_edit: true,
      numbers_manage: true,
      logs_view: true,
      logs_manage: true,
      refunds_manage: true,
      team_manage: true,
    });
  if (role === "subadmin")
    Object.assign(all, {
      users_view: true,
      agents_view: true,
      billing_view: true,
      workflows_view: true,
      telephony_view: true,
      security_view: true,
      support_view: true,
      insights_view: true,
      account_pricing_edit: true,
      agents_deploy: true,
      workflows_edit: true,
      numbers_manage: true,
      logs_view: true,
    });
  if (role === "support")
    Object.assign(all, {
      users_view: true,
      agents_view: true,
      support_view: true,
      telephony_view: true,
      logs_view: true,
      insights_view: true,
    });
  return all;
}

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

export const users = [
  {
    company: "Acme Health",
    plan: "Pro",
    seats: 12,
    status: "active",
    mrr: 899,
    autoRenew: true,
  },
  {
    company: "Delta Realty",
    plan: "Starter",
    seats: 5,
    status: "trial",
    mrr: 129,
    autoRenew: false,
  },
  {
    company: "Nimbus Retail",
    plan: "Business",
    seats: 24,
    status: "active",
    mrr: 1899,
    autoRenew: true,
  },
  {
    company: "ZenCare Homes",
    plan: "Enterprise",
    seats: 64,
    status: "active",
    mrr: 7499,
    autoRenew: true,
  },
];


export const PAGE_DEFS: { key: string; title: string; domId: string }[] = [
  { key: "dashboard", title: "Dashboard", domId: "page-dashboard" },
  { key: "users", title: "Users & Accounts", domId: "page-users" },
  { key: "agents", title: "Agents & Bots", domId: "page-agents" },
  { key: "billing", title: "Billing & Financials", domId: "page-billing" },
  { key: "telephony", title: "Telephony & Infrastructure", domId: "page-telephony" },
  { key: "support", title: "Support & Ticketing", domId: "page-support" },
];

export const sleep = (ms: number) => new Promise(r=>setTimeout(r, ms));