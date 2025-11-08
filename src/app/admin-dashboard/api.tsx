import { AccountPricing, AuditEvent, Pricing } from "./type";

/*****************************************
 * MOCK API LAYER + TYPES
 *****************************************/
const mockDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const nowIso = () => new Date().toISOString();

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

export const API = {
  async getGlobalPricing(): Promise<Pricing> {
    await mockDelay(200);
    return { ...GLOBAL_PRICING };
  },
  async updateGlobalPricing(
    p: Pricing,
    actor: string,
    note?: string
  ): Promise<Pricing> {
    await mockDelay(400);
    const from = { ...GLOBAL_PRICING };
    GLOBAL_PRICING = { ...p };
    AUDIT_LOG.unshift({
      at: nowIso(),
      actor,
      scope: "global",
      from,
      to: p,
      note,
    });
    return { ...GLOBAL_PRICING };
  },
  async getAccountPricing(company: string): Promise<AccountPricing> {
    await mockDelay(180);
    return ACCOUNT_PRICING[company] || { ...GLOBAL_PRICING, enabled: false };
  },
  async upsertAccountPricing(
    company: string,
    override: AccountPricing,
    actor: string,
    note?: string
  ): Promise<AccountPricing> {
    await mockDelay(400);
    const from = ACCOUNT_PRICING[company] || {
      ...GLOBAL_PRICING,
      enabled: false,
    };
    ACCOUNT_PRICING[company] = { ...override };
    AUDIT_LOG.unshift({
      at: nowIso(),
      actor,
      scope: "account",
      account: company,
      from,
      to: override,
      note,
    });
    return ACCOUNT_PRICING[company];
  },
  async getAudit(): Promise<AuditEvent[]> {
    await mockDelay(120);
    return [...AUDIT_LOG];
  },
};
