// Admin services for dashboard - now with real API integration

import { 
  mockUsers, 
  mockAgents, 
  mockBillingData, 
  mockTelephonyData, 
  mockSupportData, 
  mockDashboardMetrics 
} from "@/mocks/admin-dashboard";
import { dashboardAPI } from "./api";

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface MRRData {
  total_revenue: number;
  mrr_by_month: Array<{
    month: string; // "2024-01" format
    mrr: number;
  }>;
  period: string;
}

export interface PAYGData {
  total_revenue: number;
  revenue_by_month: Array<{
    month: string; // "2024-01" format
    revenue: number;
  }>;
  period: string;
}

export interface UsageByBotType {
  conversa: {
    bot_type: string;
    monthly_data: Array<{
      month: string; // "2024-01" format
      total_sessions: number;
      total_duration_minutes: number;
    }>;
    total_sessions: number;
    total_duration_minutes: number;
  };
  empath: {
    bot_type: string;
    monthly_data: Array<{
      month: string; // "2024-01" format
      total_sessions: number;
      total_duration_minutes: number;
    }>;
    total_sessions: number;
    total_duration_minutes: number;
  };
  period: string;
}

export interface UsageByCountry {
  monthly: Array<{
    month: string; // "2024-01" format
    countries: Record<string, {
      total_sessions: number;
      total_duration_minutes: number;
    }>;
  }>;
  overall: Record<string, {
    total_sessions: number;
    total_duration_minutes: number;
  }>;
  total_countries: number;
  period: string;
}

export interface UsersOverview {
  users: Array<{
    user_id: number;
    name: string;
    subscription: {
      subscription_id: number | null;
      plan_name: string | null;
      bot_type: string | null;
      is_active: boolean;
      auto_renew: boolean;
      total_price: number;
      starts_at: string | null;
      expires_at: string | null;
      concurrent_sessions_limit: number;
      tts_minutes_left: number;
      sts_minutes_left: number;
      automations_left: number;
    };
  }>;
}

export interface EffectivePricingData {
  bot_type: string;
  tts_price_per_minute_cents: number;
  stt_price_per_minute_cents: number;
  automation_price_cents: number;
  premium_voice_surcharge_cents: number;
  pricing_type: string; // 'custom' or 'global'
  pricing_id?: number;
  is_active: boolean;
}

export interface EffectivePricingResponse {
  user_id: number;
  user_name: string;
  bot_type: string;
  effective_pricing: EffectivePricingData;
}

export interface CustomPricingCreate {
  user_id: number;
  bot_type: string;
  tts_price_per_minute_cents: number;
  stt_price_per_minute_cents: number;
  automation_price_cents: number;
  premium_voice_surcharge_cents: number;
  is_active: boolean;
}

export interface CustomPricingUpdate {
  tts_price_per_minute_cents?: number;
  stt_price_per_minute_cents?: number;
  automation_price_cents?: number;
  premium_voice_surcharge_cents?: number;
  is_active?: boolean;
}

export interface CustomPricingResponse {
  id: number;
  user_id: number;
  bot_type: string;
  tts_price_per_minute_cents: number;
  stt_price_per_minute_cents: number;
  automation_price_cents: number;
  premium_voice_surcharge_cents: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}



// Simulate API delay for mock services
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to convert YYYY-MM to month abbreviation
const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
};

// Helper function to get last N months
const getLastNMonths = (months: number): string[] => {
  const result = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    result.push(`${year}-${month}`);
  }
  
  return result;
};

// Helper function to transform API data to dashboard format
const transformRevenueData = (mrrData: MRRData, paygData: PAYGData, monthsBack: number = 12) => {
  const lastNMonths = getLastNMonths(monthsBack);
  
  // Create maps for quick lookup
  const mrrMap = new Map(mrrData.mrr_by_month.map(item => [item.month, item.mrr]));
  const paygMap = new Map(paygData.revenue_by_month.map(item => [item.month, item.revenue]));
  
  // Transform to dashboard format
  const revenueData = lastNMonths.map(month => ({
    month: formatMonth(month),
    mrr: mrrMap.get(month) || 0,
    payg: paygMap.get(month) || 0
  }));
  
  return revenueData;
};

// Helper function to transform usage data to dashboard format
const transformUsageSplitData = (usageData: UsageByBotType) => {
  const totalSessions = usageData.conversa.total_sessions + usageData.empath.total_sessions;
  
  if (totalSessions === 0) {
    return [
      { name: "Conversa", value: 0 },
      { name: "Empath", value: 0 }
    ];
  }
  
  const conversaPercentage = Math.round((usageData.conversa.total_sessions / totalSessions) * 100);
  const empathPercentage = 100 - conversaPercentage;
  
  return [
    { name: "Conversa", value: conversaPercentage },
    { name: "Empath", value: empathPercentage }
  ];
};

// Helper function to transform country usage data to dashboard format
const transformCountryUsageData = (countryData: UsageByCountry) => {
  // Convert overall country data to dashboard format
  const countryUsage = Object.entries(countryData.overall)
    .map(([country, stats]) => ({
      country,
      calls: stats.total_sessions,
      minutes: Math.round(stats.total_duration_minutes),
      revenue: Math.round(stats.total_duration_minutes * 0.1) // Estimate revenue based on minutes
    }))
    .sort((a, b) => b.calls - a.calls) // Sort by calls descending
    .slice(0, 10); // Top 10 countries
  
  return countryUsage;
};

// Helper function to transform users data to dashboard format
const transformUsersData = (usersData: UsersOverview) => {
  return usersData.users.map(user => ({
    id: user.user_id,
    name: user.name || "Unknown User", // Required by AdminPageData
    company: user.name || "Unknown Company", // Using name as company for now
    plan: user.subscription.plan_name || "No Plan",
    seats: user.subscription.concurrent_sessions_limit || 0,
    status: user.subscription.is_active ? "active" : "inactive",
    autoRenew: user.subscription.auto_renew,
    mrr: user.subscription.total_price || 0,
    createdAt: user.subscription.starts_at ? new Date(user.subscription.starts_at).toISOString().split('T')[0] : "N/A",
    lastUpdated: user.subscription.starts_at ? new Date(user.subscription.starts_at).toISOString().split('T')[0] : "N/A", // Required by AdminPageData
    lastLogin: "N/A", // Not available in API response
    country: "Unknown", // Not available in API response
    industry: "Unknown", // Not available in API response
    subscriptionId: user.subscription.subscription_id || undefined,
    botType: user.subscription.bot_type
  }));
};

export const adminService = {
  // Dashboard metrics - now with real revenue, usage, and country data
  async getDashboardMetrics(monthsBack: number = 12) {
    try {
      // Get real data from API
      const [mrrData, paygData, usageData, countryData] = await Promise.all([
        dashboardAPI.getMRRData(monthsBack),
        dashboardAPI.getPAYGData(monthsBack),
        dashboardAPI.getUsageByBotType(monthsBack),
        dashboardAPI.getUsageByCountry(monthsBack)
      ]);

      // Transform API data to dashboard format
      const revenueData = transformRevenueData(mrrData, paygData, monthsBack);
      const usageSplit = transformUsageSplitData(usageData);
      const countryUsage = transformCountryUsageData(countryData);

      // Return mock data with real data overridden
      return {
        ...mockDashboardMetrics,
        revenueData,
        usageSplit,
        countryUsage,
        totalRevenue: mrrData.total_revenue + paygData.total_revenue
      };
    } catch (error) {
      console.error('Error fetching data', error);
      throw error;
    }
  },

  async getMRRData(monthsBack: number = 12): Promise<MRRData> {
    try {
      return await dashboardAPI.getMRRData(monthsBack);
    } catch (error) {
      console.error('Error fetching MRR data:', error);
      throw error;
    } 
  },

  async getPAYGData(monthsBack: number = 12): Promise<PAYGData> {
    try {
      return await dashboardAPI.getPAYGData(monthsBack);
    } catch (error) {
      console.error('Error fetching PAYG data:', error);
      throw error;
    }
  },

  async getUsageByBotType(monthsBack: number = 12): Promise<UsageByBotType> {
    try {
      return await dashboardAPI.getUsageByBotType(monthsBack);
    } catch (error) {
      console.error('Error fetching usage by bot type data:', error);
      throw error;
    }
  },

  async getUsageByCountry(monthsBack: number = 12): Promise<UsageByCountry> {
    try {
      return await dashboardAPI.getUsageByCountry(monthsBack);
    } catch (error) {
      console.error('Error fetching usage by country data:', error);
      throw error;
    }
  },
  async getUsers() {
    try {
      const usersData = await dashboardAPI.getUsersOverview();
      return transformUsersData(usersData);
    } catch (error) {
      console.error('Error fetching real users data', error);
      throw error    
    }
  },

  async toggleAutoRenew(subId: number, autoRenew: boolean): Promise<any> {
    try {
      return await dashboardAPI.toggleAutoRenew(subId, autoRenew);
    } catch (error) {
      console.error('Error toggling auto-renew:', error);
      throw error;
    }
  },

  async createCustomPricing(pricingData: CustomPricingCreate): Promise<CustomPricingResponse> {
    try {
      return await dashboardAPI.createCustomPricing(pricingData);
    } catch (error) {
      console.error('Error creating custom pricing:', error);
      throw error;
    }
  },

  async updateCustomPricing(userId: number, botType: string, pricingData: CustomPricingUpdate): Promise<CustomPricingResponse> {
    try {
      return await dashboardAPI.updateCustomPricing(userId, botType, pricingData);
    } catch (error) {
      console.error('Error updating custom pricing:', error);
      throw error;
    }
  },

  async getEffectivePricing(userId: number, botType: string): Promise<EffectivePricingData> {
    try {
      const response = await dashboardAPI.getEffectivePricing(userId, botType);
      return response.effective_pricing;
    } catch (error) {
      console.error('Error getting effective pricing:', error);
      throw error;
    }
  },

  async deleteCustomPricing(userId: number, botType: string): Promise<any> {
    try {
      return await dashboardAPI.deleteCustomPricing(userId, botType);
    } catch (error) {
      console.error('Error deleting custom pricing:', error);
      throw error;
    }
  },

  async getGlobalPricing(): Promise<any> {
    try {
      return await dashboardAPI.getGlobalPricing();
    } catch (error) {
      console.error('Error getting global pricing:', error);
      throw error;
    }
  },

  async updateGlobalPricing(botType: string, pricingData: any): Promise<any> {
    try {
      return await dashboardAPI.updateGlobalPricing(botType, pricingData);
    } catch (error) {
      console.error('Error updating global pricing:', error);
      throw error;
    }
  },

  async getDailyTraffic(daysBack: number = 30): Promise<any> {
    try {
      return await dashboardAPI.getDailyTraffic(daysBack);
    } catch (error) {
      console.error('Error getting daily traffic:', error);
      throw error;
    }
  },

  async getTrafficByAgent(monthsBack: number = 12): Promise<any> {
    try {
      return await dashboardAPI.getTrafficByAgent(monthsBack);
    } catch (error) {
      console.error('Error getting traffic by agent:', error);
      throw error;
    }
  },

  async getRevenueData(monthsBack: number = 12): Promise<any> {
    try {
      // Fetch MRR and PAYG data separately to get monthly breakdown
      const [mrrData, paygData] = await Promise.all([
        dashboardAPI.getMRRData(monthsBack),
        dashboardAPI.getPAYGData(monthsBack)
      ]);
      
      // Transform to dashboard format
      return transformRevenueData(mrrData, paygData, monthsBack);
    } catch (error) {
      console.error('Error getting revenue data:', error);
      throw error;
    }
  },

  async getUserById(id: number) {
    await delay(200);
    return mockUsers.find(user => user.id === id);
  },

  async updateUser(id: number, data: any) {
    await delay(400);
    console.log(`Updating user ${id} with data:`, data);
    return { success: true, message: "User updated successfully" };
  },

  async deleteUser(id: number) {
    await delay(300);
    console.log(`Deleting user ${id}`);
    return { success: true, message: "User deleted successfully" };
  },

  async createUser(data: any) {
    await delay(500);
    console.log("Creating new user:", data);
    return { success: true, message: "User created successfully", id: Date.now() };
  },

  async getAccountPricing(company: string) {
    await delay(300);
    console.log(`Getting account pricing for ${company}`);
    return {
      enabled: true,
      conversa: 0.05,
      empath: 0.08
    };
  },

  // Agents management
  async getAgents() {
    await delay(300);
    return mockAgents;
  },

  async getAgentById(id: number) {
    await delay(200);
    return mockAgents.find(agent => agent.id === id);
  },

  async createAgent(data: any) {
    await delay(500);
    console.log("Creating new agent with data:", data);
    return { success: true, message: "Agent created successfully", id: Date.now() };
  },

  async updateAgent(id: number, data: any) {
    await delay(400);
    console.log(`Updating agent ${id} with data:`, data);
    return { success: true, message: "Agent updated successfully" };
  },

  async deleteAgent(id: number) {
    await delay(300);
    console.log(`Deleting agent ${id}`);
    return { success: true, message: "Agent deleted successfully" };
  },

  // Billing management
  async getBillingData() {
    await delay(400);
    return mockBillingData;
  },

  async getInvoices() {
    await delay(300);
    return mockBillingData.invoices;
  },

  async updatePricing(company: string, pricing: any) {
    await delay(500);
    console.log(`Updating pricing for ${company}:`, pricing);
    return { success: true, message: "Pricing updated successfully" };
  },

  async simulateInvoice(company: string, usage: any) {
    await delay(300);
    console.log(`Simulating invoice for ${company} with usage:`, usage);
    return {
      conversa: usage.conversa * 0.05,
      empath: usage.empath * 0.08,
      total: (usage.conversa * 0.05) + (usage.empath * 0.08)
    };
  },

  // Telephony management
  async getTelephonyData() {
    await delay(400);
    return mockTelephonyData;
  },

  async getPhoneNumbers() {
    await delay(300);
    return mockTelephonyData.phoneNumbers;
  },

  async addPhoneNumber(data: any) {
    await delay(500);
    console.log("Adding new phone number:", data);
    return { success: true, message: "Phone number added successfully", id: Date.now() };
  },

  async updatePhoneNumber(id: number, data: any) {
    await delay(400);
    console.log(`Updating phone number ${id}:`, data);
    return { success: true, message: "Phone number updated successfully" };
  },

  async deletePhoneNumber(id: number) {
    await delay(300);
    console.log(`Deleting phone number ${id}`);
    return { success: true, message: "Phone number deleted successfully" };
  },

  // Support management
  async getSupportData() {
    await delay(400);
    return mockSupportData;
  },

  async getTickets() {
    await delay(300);
    return mockSupportData.tickets;
  },

  async getTicketById(id: number) {
    await delay(200);
    return mockSupportData.tickets.find(ticket => ticket.id === id);
  },

  async updateTicket(id: number, data: any) {
    await delay(400);
    console.log(`Updating ticket ${id}:`, data);
    return { success: true, message: "Ticket updated successfully" };
  },

  async createTicket(data: any) {
    await delay(500);
    console.log("Creating new ticket:", data);
    return { success: true, message: "Ticket created successfully", id: Date.now() };
  },

  // Analytics and reports
  async getAnalytics(timeRange: string = "30d") {
    await delay(600);
    console.log(`Fetching analytics for time range: ${timeRange}`);
    return {
      timeRange,
      metrics: mockDashboardMetrics,
      generatedAt: new Date().toISOString()
    };
  },

  async exportData(type: string, format: string = "csv") {
    await delay(1000);
    console.log(`Exporting ${type} data in ${format} format`);
    return { 
      success: true, 
      message: `${type} data exported successfully`,
      downloadUrl: `/api/export/${type}.${format}`
    };
  }
};

export default adminService;
