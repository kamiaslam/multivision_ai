// types.ts

// ---------------- Pricing ----------------
// Global pricing shape
export type Pricing = {
  conversaPerMin: number; // $/min
  empathPerMin: number; // $/min
  automationsPack: number; // $ per 10k automations
  premiumVoiceSurcharge: number; // $/min
};

// Per-account pricing override
export type AccountPricing = Pricing & { enabled: boolean };

// ---------------- Audit ----------------
export type AuditEvent = {
  at: string; // ISO time
  actor: string; // email or name
  scope: "global" | "account";
  account?: string; // when scope=account
  from: Partial<Pricing>;
  to: Partial<Pricing>;
  note?: string;
};

// ---------------- Permissions / Staff ----------------
export type Role = "owner" | "admin" | "subadmin" | "support";

export type PermissionKey =
  | "users_view"
  | "agents_view"
  | "billing_view"
  | "workflows_view"
  | "telephony_view"
  | "security_view"
  | "support_view"
  | "insights_view"
  | "pricing_edit"
  | "account_pricing_edit"
  | "agents_deploy"
  | "workflows_edit"
  | "numbers_manage"
  | "logs_view"
  | "logs_manage"
  | "refunds_manage"
  | "team_manage";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastActive: string; // ISO
  permissions: Record<PermissionKey, boolean>;
};

// ---------------- Dialog Props ----------------
import { Dispatch, SetStateAction } from "react";

export interface GlobalPricingDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  globalPricing: Pricing | null;
  setGlobalPricing: Dispatch<SetStateAction<Pricing | null>>;
  saving: boolean;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setConfirmContext: Dispatch<SetStateAction<ConfirmContext | null>>;
  setConfirmOpen: Dispatch<SetStateAction<boolean>>;
  API: any;
  currentUser: StaffMember;
}

export interface AccountPricingDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  accountPricing: AccountPricing | null;
  setAccountPricing: Dispatch<SetStateAction<AccountPricing | null>>;
  accountCompany: string | null;
  saving: boolean;
  setConfirmContext: Dispatch<SetStateAction<ConfirmContext | null>>;
  setConfirmOpen: Dispatch<SetStateAction<boolean>>;
  API: any;
}

export interface ConfirmImpactDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirmContext: ConfirmContext | null;
  setConfirmContext: Dispatch<SetStateAction<ConfirmContext | null>>;
  saving: boolean;
  setSaving: Dispatch<SetStateAction<boolean>>;
  API: any;
  setGlobalPricing: Dispatch<SetStateAction<Pricing | null>>;
  setAccountDialogOpen: Dispatch<SetStateAction<boolean>>;
  setAccountPricing: Dispatch<SetStateAction<AccountPricing | null>>;
  currentUser: StaffMember;
  setAudit: Dispatch<SetStateAction<AuditEvent[]>>;
}

export interface SimulateInvoiceDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  simCompany: string | null;
  API: any;
}

export interface NewInvoiceDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  users: { company: string }[];
  newInvItems: InvoiceItem[];
  setNewInvItems: Dispatch<SetStateAction<InvoiceItem[]>>;
  newInvClient: string;
  setNewInvClient: Dispatch<SetStateAction<string>>;
  newInvPeriod: string;
  setNewInvPeriod: Dispatch<SetStateAction<string>>;
  newInvCurrency: string;
  setNewInvCurrency: Dispatch<SetStateAction<string>>;
  invoices: Invoice[];
  setInvoices: Dispatch<SetStateAction<Invoice[]>>;
}

// ---------------- Invoice & Usage ----------------
export interface InvoiceItem {
  desc: string;
  qty: number;
  unit: number;
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: "due" | "paid";
  period: string;
}

export interface UsageInputs {
  minutesConversa: number;
  minutesEmpath: number;
  premiumMinutes: number;
  automations: number;
}

// ---------------- Confirm Context ----------------
export interface ConfirmContext {
  scope: "global" | "account";
  oldP: Pricing | AccountPricing;
  newP: Pricing | AccountPricing;
  company?: string;
}


export const PERMISSION_LIST: PermissionKey[] = [
  "users_view",
  "agents_view",
  "billing_view",
  "workflows_view",
  "telephony_view",
  "security_view",
  "support_view",
  "insights_view",
  "pricing_edit",
  "account_pricing_edit",
  "agents_deploy",
  "workflows_edit",
  "numbers_manage",
  "logs_view",
  "logs_manage",
  "refunds_manage",
  "team_manage",
];