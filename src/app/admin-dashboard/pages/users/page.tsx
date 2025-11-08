"use client";
import React, { useMemo, useState, useEffect } from "react";
import Badge from "@/components/Badge";
import Select from "@/components/Select";
import { Plus, Search, Pencil, Calculator, FileDown } from "lucide-react";
import { adminService } from "@/services/admin";
import { useCommonDialogs } from "../../components/dialogs/commonDialogsContext";
import { PricingOverrideDialog, ReviewImpactDialog, SimulatePricingDialog } from "../../components/dialogs/userPricingDialogs";
import { hasPerm } from "../../utils/utils";
import { toast } from "sonner";
import AdminPage from "../../components/AdminPage";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import Switch from "@/components/Switch";

// Types for user data
interface User {
  id: number;
  name: string; // Required by AdminPageData
  company: string;
  plan: string;
  seats: number;
  status: string;
  autoRenew: boolean;
  mrr: number;
  createdAt: string;
  lastUpdated: string; // Required by AdminPageData
  lastLogin: string;
  country: string;
  industry: string;
  subscriptionId?: number; // Add subscription ID for API calls
  botType: string | null; // Add bot type from backend
}



export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Auto-renew confirmation modal state
  const [isAutoRenewModalOpen, setIsAutoRenewModalOpen] = useState(false);
  const [subscriptionToToggle, setSubscriptionToToggle] = useState<{ subscriptionId: number; user: User } | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  
  // Pricing override dialog state
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBotType, setSelectedBotType] = useState<string | null>(null);
  const [pricingData, setPricingData] = useState<{
    conversa: any | null;
    empath: any | null;
  } | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Review Impact dialog state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewPricing, setReviewPricing] = useState<any>(null);
  const [globalPricing, setGlobalPricing] = useState<{
    conversa: any | null;
    empath: any | null;
  } | null>(null);
  
  // Simulate Pricing dialog state
  const [isSimulateDialogOpen, setIsSimulateDialogOpen] = useState(false);
  
  const {
    searchTerm,
  } = useCommonDialogs();

  // Fetch users from mock service
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersData = await adminService.getUsers();
        setUsers(usersData);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        u.company.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const handleExport = async () => {
    try {
      const result = await adminService.exportData("users", "csv");
      toast.success(result.message);
    } catch (err: any) {
      toast.error("Failed to export users data");
    }
  };

  const handleCreateUser = async () => {
    try {
      const result = await adminService.createUser({
        company: "New Company",
        plan: "Starter",
        seats: 5
      });
      toast.success(result.message);
      // Refresh users list
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      toast.error("Failed to create user");
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      const result = await adminService.updateUser(user.id, user);
      toast.success(result.message);
    } catch (err: any) {
      toast.error("Failed to update user");
    }
  };

  // Auto-renew toggle handlers
  const handleAutoRenewToggle = (user: User) => {
    if (!user.subscriptionId) {
      toast.error("No active subscription found for this user");
      return;
    }
    
    setSubscriptionToToggle({ subscriptionId: user.subscriptionId, user });
    setIsAutoRenewModalOpen(true);
  };

  const confirmAutoRenewToggle = async () => {
    if (!subscriptionToToggle) return;

    try {
      setIsToggling(true);
      const newAutoRenew = !subscriptionToToggle.user.autoRenew;
      
      await adminService.toggleAutoRenew(subscriptionToToggle.subscriptionId, newAutoRenew);
      
      // Refetch users data from API to get the latest state
      const usersData = await adminService.getUsers();
      setUsers(usersData);
      
      toast.success(
        `Auto-renewal ${newAutoRenew ? 'enabled' : 'disabled'}`
      );
      
      setIsAutoRenewModalOpen(false);
      setSubscriptionToToggle(null);
    } catch (err: any) {
      console.error("Error toggling auto-renew:", err);
      toast.error("Failed to update auto-renewal setting");
    } finally {
      setIsToggling(false);
    }
  };

  const cancelAutoRenewToggle = () => {
    setIsAutoRenewModalOpen(false);
    setSubscriptionToToggle(null);
  };

  const columns = [
    { key: "company", label: "Company" },
    { key: "plan", label: "Plan" },
    { key: "seats", label: "Seats" },
    { 
      key: "status", 
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "secondary"}>
          {value}
        </Badge>
      )
    },
    { 
      key: "autoRenew", 
      label: "Auto-renew",
      render: (value: boolean, item: User) => (
        <Switch
          checked={value}
          onChange={() => handleAutoRenewToggle(item)}
        />
      )
    },
    { key: "mrr", label: "MRR", render: (value: number) => `$${value}` }
  ];

  const handlePricingSave = async (pricing: any) => {
    if (!selectedUser || !selectedBotType || !pricingData) return;
    
    try {
      setIsSaving(true);
      const currentPricing = pricingData[selectedBotType as keyof typeof pricingData];
      const wasOriginallyCustom = currentPricing?.pricing_type === "custom";
      
      if (pricing.enabled) {
        if (wasOriginallyCustom) {
          // Update existing custom pricing
          await adminService.updateCustomPricing(selectedUser.id, selectedBotType, {
            tts_price_per_minute_cents: Math.round(pricing.ttsPricePerMin * 100),
            stt_price_per_minute_cents: Math.round(pricing.sttPricePerMin * 100),
            automation_price_cents: Math.round(pricing.automationsPack * 100),
            premium_voice_surcharge_cents: Math.round(pricing.premiumVoiceSurcharge * 100),
            is_active: true
          });
          toast.success("Custom pricing updated successfully");
        } else {
          // Create new custom pricing
          await adminService.createCustomPricing({
            user_id: selectedUser.id,
            bot_type: selectedBotType,
            tts_price_per_minute_cents: Math.round(pricing.ttsPricePerMin * 100),
            stt_price_per_minute_cents: Math.round(pricing.sttPricePerMin * 100),
            automation_price_cents: Math.round(pricing.automationsPack * 100),
            premium_voice_surcharge_cents: Math.round(pricing.premiumVoiceSurcharge * 100),
            is_active: true
          });
          toast.success("Custom pricing created successfully");
        }
      } else if (wasOriginallyCustom) {
        await adminService.deleteCustomPricing(selectedUser.id, selectedBotType);
        toast.success("Custom pricing disabled, user now uses global pricing");
      }
      
      const usersData = await adminService.getUsers();
      setUsers(usersData);
      
      setIsPricingDialogOpen(false);
      setIsReviewDialogOpen(false);
    } catch (error) {
      console.error("Error saving pricing:", error);
      toast.error("Failed to save pricing");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePricingOverride = async (item: User) => {
    if (!item.botType) {
      toast.error("Bot type not found for this user");
      return;
    }
    
    setSelectedUser(item);
    setSelectedBotType(item.botType);
    setIsPricingDialogOpen(true);
    
    // Load pricing data for both bot types and global pricing
    try {
      setIsLoadingPricing(true);
      const [conversaPricing, empathPricing, globalPricingData] = await Promise.all([
        adminService.getEffectivePricing(item.id, 'conversa'),
        adminService.getEffectivePricing(item.id, 'empath'),
        adminService.getGlobalPricing()
      ]);
      
      setPricingData({
        conversa: conversaPricing,
        empath: empathPricing
      });


      setGlobalPricing({
        conversa: globalPricingData.find((p: any) => p.bot_type === 'conversa') || null,
        empath: globalPricingData.find((p: any) => p.bot_type === 'empath') || null
      });
    } catch (error) {
      console.error("Error loading pricing data:", error);
      toast.error("Failed to load pricing data");
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const handleSimulatePricing = async (item: User) => {
    if (!item.botType) {
      toast.error("Bot type not found for this user");
      return;
    }
    
    setSelectedUser(item);
    setSelectedBotType(item.botType);
    setIsSimulateDialogOpen(true);
    
    // Load pricing data for both bot types and global pricing
    try {
      setIsLoadingPricing(true);
      const [conversaPricing, empathPricing, globalPricingData] = await Promise.all([
        adminService.getEffectivePricing(item.id, 'conversa'),
        adminService.getEffectivePricing(item.id, 'empath'),
        adminService.getGlobalPricing()
      ]);
      
      setPricingData({
        conversa: conversaPricing,
        empath: empathPricing
      });

      // Extract global pricing for each bot type
      const globalPricingList = globalPricingData.data || [];
      setGlobalPricing({
        conversa: globalPricingList.find((p: any) => p.bot_type === 'conversa') || null,
        empath: globalPricingList.find((p: any) => p.bot_type === 'empath') || null
      });
    } catch (error) {
      console.error("Error loading pricing data:", error);
      toast.error("Failed to load pricing data");
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const actions =  [
    {
      label: "Override",
      onClick: handlePricingOverride
    },
    {
      label: "Simulate",
      onClick: handleSimulatePricing
    }
  ];

  return (
    <div id="page-users">
      <AdminPage
        title="Users & Accounts"
        data={filteredUsers}
        loading={loading}
        error={error}
        onRefresh={() => window.location.reload()}
        onExport={handleExport}
        onCreate={handleCreateUser}
        createButtonText="New Client"
        columns={columns}
        actions={actions}
      />
      
      <ConfirmationModal
        isOpen={isAutoRenewModalOpen}
        onClose={cancelAutoRenewToggle}
        onConfirm={confirmAutoRenewToggle}
        title={`${subscriptionToToggle?.user.autoRenew ? 'Disable' : 'Enable'} Auto-Renewal`}
        message={`Are you sure you want to ${subscriptionToToggle?.user.autoRenew ? 'disable' : 'enable'} auto-renewal for ${subscriptionToToggle?.user.company}? This will ${subscriptionToToggle?.user.autoRenew ? 'prevent' : 'allow'} automatic subscription renewal.`}
        confirmText={subscriptionToToggle?.user.autoRenew ? 'Disable Auto-Renewal' : 'Enable Auto-Renewal'}
        cancelText="Cancel"
        type="warning"
        isLoading={isToggling}
        isIrreversible={false}
        loadingText="Updating..."
      />
      
      <PricingOverrideDialog
        isOpen={isPricingDialogOpen}
        onClose={() => {
          setIsPricingDialogOpen(false);
          setSelectedUser(null);
          setSelectedBotType(null);
          setPricingData(null);
        }}
        user={selectedUser}
        botType={selectedBotType}
        pricingData={pricingData}
        isLoading={isLoadingPricing}
        onBotTypeChange={(newBotType) => setSelectedBotType(newBotType)}
        onReviewImpact={(pricing) => {
          setReviewPricing(pricing);
          setIsReviewDialogOpen(true);
        }}
        isSaving={isSaving}
      />
      
      {/* Review Impact Dialog */}
      <ReviewImpactDialog
        isOpen={isReviewDialogOpen}
        onClose={() => {
          setIsReviewDialogOpen(false);
          setReviewPricing(null);
        }}
        user={selectedUser}
        botType={selectedBotType}
        pricingData={pricingData}
        reviewPricing={reviewPricing}
        globalPricing={globalPricing}
        onConfirm={handlePricingSave}
        isSaving={isSaving}
      />
      
      {/* Simulate Pricing Dialog */}
      <SimulatePricingDialog
        isOpen={isSimulateDialogOpen}
        onClose={() => {
          setIsSimulateDialogOpen(false);
          setSelectedUser(null);
          setSelectedBotType(null);
          setPricingData(null);
          setGlobalPricing(null);
        }}
        user={selectedUser}
        botType={selectedBotType}
        pricingData={pricingData}
        globalPricing={globalPricing}
        isLoading={isLoadingPricing}
      />
    </div>
  );
}
