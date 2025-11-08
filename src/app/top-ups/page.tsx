"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAuth } from "@/context/authContext";
import { useFinance } from "@/context/financeContext";
import { FormData } from "./types";
import { WalletData, FreeAllowanceInfo } from "@/context/financeContext";
import { Sidebar } from "./components/Sidebar";
import { navigation } from "./constants";
import TopUpAmount from "./TopUpAmount";
import PaymentDetails from "./PaymentDetails";
import Loader from "@/components/Loader";

const TopUpsPage = () => {
  const { token, user, isInitialized } = useAuth();
  const { getWallet } = useFinance();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletData | null>(null);
  const [freeAllowance, setFreeAllowance] = useState<FreeAllowanceInfo | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  // Wrapper for setActiveTab to prevent server-side rendering issues
  const setActiveTabSafe = useCallback((value: number) => {
    if (mounted) {
      // Check if this is the Voice Clone tab (tabId: 3)
      const voiceCloneTab = navigation.find(item => item.tabId === value);
      if (voiceCloneTab && voiceCloneTab.to === "/voice-clone") {
        router.push("/voice-clone");
        return;
      }
      setActiveTab(value);
    }
  }, [mounted, router]);

  // Fetch wallet data once
  const fetchWalletData = useCallback(async () => {
    if (!mounted || !token || !user) return;
    
    try {
      setWalletLoading(true);
      const { wallet, free_allowance } = await getWallet();
      setWalletInfo(wallet);
      setFreeAllowance(free_allowance);
      console.log("TopUpsPage: walletInfo", wallet, free_allowance);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setWalletLoading(false);
    }
  }, [mounted, token, user, getWallet]);

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch wallet data when component mounts and auth is available
  useEffect(() => {
    if (mounted && token && user) {
      fetchWalletData();
    }
  }, [mounted, token, user, fetchWalletData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <TopUpAmount 
            formData={{ amount: 0, payment_method: '', description: '' }}
            setFormData={() => {}}
            walletInfo={walletInfo}
            freeAllowance={freeAllowance}
            walletLoading={walletLoading}
            onWalletUpdate={fetchWalletData}
          />
        );
      case 2:
        return (
          <PaymentDetails 
            formData={{ amount: 0, payment_method: '', description: '' }}
            setFormData={() => {}}
            walletInfo={walletInfo}
            walletLoading={walletLoading}
            onWalletUpdate={fetchWalletData}
          />
        );
      default:
        return (
          <TopUpAmount 
            formData={{ amount: 0, payment_method: '', description: '' }}
            setFormData={() => {}}
            walletInfo={walletInfo}
            freeAllowance={freeAllowance}
            walletLoading={walletLoading}
            onWalletUpdate={fetchWalletData}
          />
        );
    }
  };

  // Show loading state until mounted and auth is initialized
  if (!mounted || !isInitialized) {
    return (
      <Layout title="Top Ups">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader text="Loading Top Ups..." />
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state if not authenticated
  if (!token || !user) {
    return (
      <Layout title="Top Ups">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-gray-600">Please sign in to access Top Ups.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Wallet & Premium Voices">
      <div className="flex items-start max-lg:block">
        {/* Sidebar Navigation */}
        <Sidebar
          searchTerm=""
          onSearchChange={() => {}}
          onCreateTopUp={() => {}}
          showForm={true}
          editingTopUp={null}
          activeTab={activeTab}
          onTabClick={setActiveTabSafe}
          navigation={navigation}
        />

        {/* Main Content Area */}
        <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-t-primary">Wallet & Premium Voices</h1>
              <p className="text-md">Manage your wallet balance and premium voice settings.</p>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="block lg:hidden">
            <div className="flex gap-2 mb-4">
              {navigation.map((item) => (
                <Button
                  key={item.tabId}
                  isWhite={activeTab !== item.tabId}
                  isBlack={activeTab === item.tabId}
                  onClick={() => setActiveTabSafe(item.tabId)}
                  className="flex-1 gap-2"
                >
                  <Icon name={item.icon} className="w-4 h-4" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="card p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TopUpsPage;
