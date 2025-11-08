// Mock data for admin dashboard components

export const mockUsers = [
    {
      id: 1,
      company: "Acme Health",
      plan: "Pro",
      seats: 25,
      status: "active",
      autoRenew: true,
      mrr: 2500,
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20",
      country: "US",
      industry: "Healthcare"
    },
    {
      id: 2,
      company: "Nimbus Retail",
      plan: "Business",
      seats: 50,
      status: "active",
      autoRenew: false,
      mrr: 5000,
      createdAt: "2024-01-10",
      lastLogin: "2024-01-19",
      country: "UK",
      industry: "Retail"
    },
    {
      id: 3,
      company: "ZenCare Homes",
      plan: "Starter",
      seats: 10,
      status: "inactive",
      autoRenew: true,
      mrr: 500,
      createdAt: "2024-01-05",
      lastLogin: "2024-01-18",
      country: "CA",
      industry: "Healthcare"
    },
    {
      id: 4,
      company: "TechFlow Solutions",
      plan: "Enterprise",
      seats: 100,
      status: "active",
      autoRenew: true,
      mrr: 10000,
      createdAt: "2024-01-01",
      lastLogin: "2024-01-20",
      country: "US",
      industry: "Technology"
    },
    {
      id: 5,
      company: "Global Finance Corp",
      plan: "Pro",
      seats: 75,
      status: "active",
      autoRenew: true,
      mrr: 7500,
      createdAt: "2023-12-20",
      lastLogin: "2024-01-19",
      country: "UK",
      industry: "Finance"
    }
  ];
  
  export const mockAgents = [
    {
      id: 1,
      name: "Receptionist UK",
      type: "Conversa",
      client: "Acme Health",
      latency: 480,
      csat: 4.6,
      calls: 812,
      status: "active",
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20"
    },
    {
      id: 2,
      name: "Wellness Check",
      type: "Empath",
      client: "ZenCare Homes",
      latency: 540,
      csat: 4.8,
      calls: 1093,
      status: "active",
      createdAt: "2024-01-10",
      lastUsed: "2024-01-19"
    },
    {
      id: 3,
      name: "Sales SDR-1",
      type: "Conversa",
      client: "Nimbus Retail",
      latency: 410,
      csat: 4.2,
      calls: 640,
      status: "active",
      createdAt: "2024-01-05",
      lastUsed: "2024-01-18"
    },
    {
      id: 4,
      name: "Customer Support Bot",
      type: "Empath",
      client: "TechFlow Solutions",
      latency: 380,
      csat: 4.9,
      calls: 1200,
      status: "active",
      createdAt: "2024-01-01",
      lastUsed: "2024-01-20"
    },
    {
      id: 5,
      name: "Lead Qualification",
      type: "Conversa",
      client: "Global Finance Corp",
      latency: 450,
      csat: 4.4,
      calls: 890,
      status: "inactive",
      createdAt: "2023-12-20",
      lastUsed: "2024-01-15"
    }
  ];
  
  export const mockBillingData = {
    totalRevenue: 25000,
    monthlyRecurringRevenue: 20000,
    payAsYouGoRevenue: 5000,
    activeSubscriptions: 45,
    churnRate: 2.5,
    averageRevenuePerUser: 555.56,
    invoices: [
      {
        id: 1,
        company: "Acme Health",
        amount: 2500,
        status: "paid",
        dueDate: "2024-01-15",
        paidDate: "2024-01-14"
      },
      {
        id: 2,
        company: "Nimbus Retail",
        amount: 5000,
        status: "paid",
        dueDate: "2024-01-15",
        paidDate: "2024-01-13"
      },
      {
        id: 3,
        company: "ZenCare Homes",
        amount: 500,
        status: "pending",
        dueDate: "2024-01-15",
        paidDate: null
      }
    ],
    countryUsage: [
      {
        country: "United Kingdom",
        code: "GB",
        calls: 2120,
        minutes: 3800,
        revenue: 9200
      },
      {
        country: "United States",
        code: "US",
        calls: 1580,
        minutes: 3400,
        revenue: 8400
      },
      {
        country: "Belgium",
        code: "BE",
        calls: 420,
        minutes: 760,
        revenue: 1800
      },
      {
        country: "United Arab Emirates",
        code: "AE",
        calls: 260,
        minutes: 610,
        revenue: 1550
      },
      {
        country: "Pakistan",
        code: "PK",
        calls: 300,
        minutes: 540,
        revenue: 1300
      }
    ]
  };
  
  export const mockTelephonyData = {
    totalCalls: 12500,
    totalMinutes: 25000,
    averageCallDuration: 2.0,
    callSuccessRate: 94.5,
    activeNumbers: 12,
    countries: [
      { name: "United Kingdom", calls: 4500, minutes: 9000 },
      { name: "United States", calls: 3200, minutes: 6400 },
      { name: "Canada", calls: 1800, minutes: 3600 },
      { name: "Australia", calls: 1200, minutes: 2400 },
      { name: "Germany", calls: 800, minutes: 1600 },
      { name: "France", calls: 600, minutes: 1200 },
      { name: "Others", calls: 400, minutes: 800 }
    ],
    phoneNumbers: [
      {
        id: 1,
        number: "+44 20 7946 0958",
        country: "UK",
        status: "active",
        calls: 1200,
        minutes: 2400
      },
      {
        id: 2,
        number: "+1 555 123 4567",
        country: "US",
        status: "active",
        calls: 800,
        minutes: 1600
      },
      {
        id: 3,
        number: "+1 416 555 0123",
        country: "CA",
        status: "active",
        calls: 600,
        minutes: 1200
      }
    ]
  };
  
  export const mockSupportData = {
    totalTickets: 156,
    openTickets: 23,
    resolvedTickets: 133,
    averageResolutionTime: "2.5 hours",
    customerSatisfaction: 4.7,
    tickets: [
      {
        id: 1,
        subject: "Unable to access dashboard",
        company: "Acme Health",
        status: "open",
        priority: "high",
        createdAt: "2024-01-20",
        assignedTo: "Support Team"
      },
      {
        id: 2,
        subject: "Billing question",
        company: "Nimbus Retail",
        status: "resolved",
        priority: "medium",
        createdAt: "2024-01-19",
        assignedTo: "Billing Team"
      },
      {
        id: 3,
        subject: "Agent configuration help",
        company: "ZenCare Homes",
        status: "open",
        priority: "low",
        createdAt: "2024-01-18",
        assignedTo: "Technical Team"
      }
    ]
  };
  
  export const mockDashboardMetrics = {
    totalUsers: 45,
    totalAgents: 12,
    totalRevenue: 25000,
    totalCalls: 12500,
    revenueData: [
      { month: "Jan", mrr: 5200, payg: 1800 },
      { month: "Feb", mrr: 6400, payg: 2200 },
      { month: "Mar", mrr: 7100, payg: 2600 },
      { month: "Apr", mrr: 7600, payg: 2800 }
    ],
    usageSplit: [
      { name: "Conversa", value: 62 },
      { name: "Empath", value: 38 }
    ],
    churnData: [
      { month: "Jan", churn: 5 },
      { month: "Feb", churn: 4 },
      { month: "Mar", churn: 6 },
      { month: "Apr", churn: 3 }
    ],
    countryUsage: [
      {
        country: "United Kingdom",
        code: "GB",
        calls: 2120,
        minutes: 3800,
        revenue: 9200
      },
      {
        country: "United States",
        code: "US",
        calls: 1580,
        minutes: 3400,
        revenue: 8400
      },
      {
        country: "Belgium",
        code: "BE",
        calls: 420,
        minutes: 760,
        revenue: 1800
      },
      {
        country: "United Arab Emirates",
        code: "AE",
        calls: 260,
        minutes: 610,
        revenue: 1550
      },
      {
        country: "Pakistan",
        code: "PK",
        calls: 300,
        minutes: 540,
        revenue: 1300
      }
    ],
    recentActivity: [
      {
        id: 1,
        event: "Invoice paid",
        client: "Acme Health",
        when: "5m ago",
        status: "success"
      },
      {
        id: 2,
        event: "New agent created",
        client: "Nimbus Retail",
        when: "18m ago",
        status: "info"
      },
      {
        id: 3,
        event: "User signed up",
        client: "TechFlow Solutions",
        when: "1h ago",
        status: "success"
      },
      {
        id: 4,
        event: "Support ticket created",
        client: "ZenCare Homes",
        when: "2h ago",
        status: "warning"
      }
    ]
  };