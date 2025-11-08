"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, FileDown, Plus, Pencil, Calculator, Filter, History } from "lucide-react";
import { PageHeader } from "../../components/page-header/PageHeader";
import { fmtMoney, hasPerm } from "../../utils/utils";
import {
  Button
} from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  Legend,
  Line,
} from "recharts";
import { useCommonDialogs } from "../../components/dialogs/commonDialogsContext";
import { Pricing } from "../../type";
import { SimulatePricingDialog, GlobalPricingDialog, GlobalReviewImpactDialog } from "../../components/dialogs/userPricingDialogs";
import { adminService } from "../../../../services/admin";
import { toast } from "sonner";

const billingData = [
  {
    client: "Acme Health",
    plan: "Pro",
    seats: 12,
    mrr: 899,
    lastInvoice: "2025-09-01",
    status: "paid",
  },
  {
    client: "Delta Realty",
    plan: "Starter",
    seats: 5,
    mrr: 129,
    lastInvoice: "2025-08-30",
    status: "unpaid",
  },
];

const countryUsage = [
  { country: "United Kingdom", code: "GB", calls: 2120, minutes: 3800, revenue: 9200 },
  { country: "United States", code: "US", calls: 1580, minutes: 3400, revenue: 8400 },
  { country: "Belgium", code: "BE", calls: 420, minutes: 760, revenue: 1800 },
  { country: "United Arab Emirates", code: "AE", calls: 260, minutes: 610, revenue: 1550 },
  { country: "Pakistan", code: "PK", calls: 300, minutes: 540, revenue: 1300 },
];


export default function BillingPage() {
  const {
    setNewInvOpen,
    invoices,
    searchTerm,
    exportCurrentPagePDF,
    audit,
  } = useCommonDialogs();

  const [isSimulateDialogOpen, setIsSimulateDialogOpen] = useState(false);
  const [selectedBotType, setSelectedBotType] = useState<string | null>(null);
  const [globalPricing, setGlobalPricing] = useState<{
    conversa: any | null;
    empath: any | null;
  } | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isGlobalPricingDialogOpen, setIsGlobalPricingDialogOpen] = useState(false);
  const [isSavingGlobalPricing, setIsSavingGlobalPricing] = useState(false);
  const [isGlobalReviewDialogOpen, setIsGlobalReviewDialogOpen] = useState(false);
  const [reviewPricing, setReviewPricing] = useState<any>(null);
  
  const [revenueData, setRevenueData] = useState<any>(null);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setIsLoadingRevenue(true);
        const revenueResponse = await adminService.getRevenueData(12);
        setRevenueData(revenueResponse);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        toast.error("Failed to load revenue data");
      } finally {
        setIsLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, []);

  const handleSimulatePricing = async () => {
    const defaultBotType = 'conversa';
    setSelectedBotType(defaultBotType);
    setIsSimulateDialogOpen(true);
    
    try {
      setIsLoadingPricing(true);
      const globalPricingData = await adminService.getGlobalPricing();
      const globalPricingList = globalPricingData || [];
      
      const extractedPricing = {
        conversa: globalPricingList.find((p: any) => p.bot_type === 'conversa') || null,
        empath: globalPricingList.find((p: any) => p.bot_type === 'empath') || null
      };
      
      setGlobalPricing(extractedPricing);
    } catch (error) {
      console.error("Error loading global pricing data:", error);
      toast.error("Failed to load global pricing data");
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const handleGlobalPricingOpen = async () => {
    setIsGlobalPricingDialogOpen(true);
    
    try {
      setIsLoadingPricing(true);
      const globalPricingData = await adminService.getGlobalPricing();
      const globalPricingList = globalPricingData || [];
      
      const extractedPricing = {
        conversa: globalPricingList.find((p: any) => p.bot_type === 'conversa') || null,
        empath: globalPricingList.find((p: any) => p.bot_type === 'empath') || null
      };
      
      setGlobalPricing(extractedPricing);
    } catch (error) {
      console.error("Error loading global pricing data:", error);
      toast.error("Failed to load global pricing data");
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const handleGlobalPricingReviewImpact = (pricingData: any) => {
    setReviewPricing(pricingData);
    setIsGlobalReviewDialogOpen(true);
  };

  const handleGlobalPricingSave = async () => {
    if (!reviewPricing) return;
    
    try {
      setIsSavingGlobalPricing(true);
      
      // Save the selected bot type
      await adminService.updateGlobalPricing(reviewPricing.botType, reviewPricing);
      toast.success(`Global pricing for ${reviewPricing.botType} updated successfully`);
      
      // Refresh global pricing data
      const updatedGlobalPricingData = await adminService.getGlobalPricing();
      const globalPricingList = updatedGlobalPricingData || [];
      setGlobalPricing({
        conversa: globalPricingList.find((p: any) => p.bot_type === 'conversa') || null,
        empath: globalPricingList.find((p: any) => p.bot_type === 'empath') || null
      });
      
      setIsGlobalPricingDialogOpen(false);
      setIsGlobalReviewDialogOpen(false);
      setReviewPricing(null);
    } catch (error) {
      console.error("Error updating global pricing:", error);
      toast.error("Failed to update global pricing");
    } finally {
      setIsSavingGlobalPricing(false);
    }
  };

  const filteredData = useMemo(
    () =>
      billingData.filter((b) =>
        b.client.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <div id="page-billing" className="p-6">
      <PageHeader
        title="Billing & Financials"
        cta={
          <div className="flex gap-2">
            <Button onClick={() => setNewInvOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
            {hasPerm("pricing_edit") && (
              <>
                <Button onClick={handleGlobalPricingOpen}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Global Pricing
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSimulatePricing}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Simulate Invoice
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={exportCurrentPagePDF}>
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h4 className="text-h6 text-t-primary mb-4 font-heading">Revenue</h4>
          {isLoadingRevenue ? (
            <div className="flex items-center justify-center h-[220px]">
              <div className="text-sm text-gray-500">Loading revenue data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-border)" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--stroke-border)" }}
                  tickLine={{ stroke: "var(--stroke-border)" }}
                />
                <YAxis 
                  tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--stroke-border)" }}
                  tickLine={{ stroke: "var(--stroke-border)" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--backgrounds-surface1)", 
                    border: "1px solid var(--stroke-border)",
                    color: "var(--text-primary)"
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: "var(--text-primary)" }}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--chart-green)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="payg"
                  stroke="var(--chart-purple)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-h6 text-t-primary font-heading">Invoices</h4>
              <div className="text-xs text-t-secondary flex items-center gap-1">
                <History className="w-3 h-3" /> audit
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-s-stroke">
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Period</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-s-stroke">
                      <td className="py-3 px-4 text-body-2 text-t-primary font-medium">{inv.id}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{inv.client}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{inv.period}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">${inv.amount}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            inv.status === "paid"
                              ? "default"
                              : inv.status === "due"
                                ? "secondary"
                                : "secondary"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {/* Revenue by Country */}
      <div className="mt-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-h6 text-t-primary font-heading">Revenue by Country</h4>
            <span className="text-xs text-t-secondary">last 30 days</span>
          </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart 
                data={countryUsage}
                barCategoryGap={4}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-border)" />
                <XAxis 
                  dataKey="code" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                  height={32}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--stroke-border)" }}
                  tickLine={{ stroke: "var(--stroke-border)" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--backgrounds-surface1)", 
                    border: "1px solid var(--stroke-border)",
                    color: "var(--text-primary)"
                  }}
                  cursor={{ fill: "var(--stroke-border)", fillOpacity: 0.1 }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--chart-green)" 
                  name="Revenue ($)"
                  radius={8}
                  activeBar={{ fill: "var(--chart-green)", fillOpacity: 1 }}
                />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Audit log table */}
      <div className="mt-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-h6 text-t-primary font-heading">Pricing Change History</h4>
              <span className="text-xs text-t-secondary">
                {audit.length} events
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-s-stroke">
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">When</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Actor</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Scope</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Account</th>
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((e, i) => (
                    <tr key={i} className="border-b border-s-stroke">
                      <td className="py-3 px-4 text-body-2 text-t-primary">{new Date(e.at).toLocaleString()}</td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{e.actor}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={e.scope === "global" ? "default" : "secondary"}
                        >
                          {e.scope}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-body-2 text-t-primary">{e.account || "-"}</td>
                      <td className="py-3 px-4 text-xs text-t-primary">
                      {Object.keys(e.to).map((k) => {
                        const key = k as keyof Pricing;
                        // @ts-ignore
                        const before = e.from[key];
                        // @ts-ignore
                        const after = e.to[key];
                        if (before === after) return null;
                        return (
                          <div key={k}>
                            <span className="uppercase">{k}</span>:{" "}
                            {fmtMoney(Number(before) || 0)} →{" "}
                            {fmtMoney(Number(after) || 0)}
                          </div>
                        );
                      })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
      
      <SimulatePricingDialog
        isOpen={isSimulateDialogOpen}
        onClose={() => {
          setIsSimulateDialogOpen(false);
          setSelectedBotType(null);
          setGlobalPricing(null);
        }}
        user={{ company: "Global Simulation", id: 0, name: "Global", email: "", lastUpdated: "", botType: selectedBotType } as any}
        botType={selectedBotType}
        pricingData={null}
        globalPricing={globalPricing}
        isLoading={isLoadingPricing}
      />
      
      <GlobalPricingDialog
        isOpen={isGlobalPricingDialogOpen}
        onClose={() => setIsGlobalPricingDialogOpen(false)}
        globalPricing={globalPricing}
        isLoading={isLoadingPricing}
        onReviewImpact={handleGlobalPricingReviewImpact}
        isSaving={isSavingGlobalPricing}
      />
      
      <GlobalReviewImpactDialog
        isOpen={isGlobalReviewDialogOpen}
        onClose={() => {
          setIsGlobalReviewDialogOpen(false);
          setReviewPricing(null);
        }}
        botType={reviewPricing?.botType}
        oldPricing={reviewPricing?.botType ? globalPricing?.[reviewPricing.botType as keyof typeof globalPricing] : null}
        newPricing={reviewPricing}
        onConfirm={handleGlobalPricingSave}
        isSaving={isSavingGlobalPricing}
      />
    </div>
  );
}
