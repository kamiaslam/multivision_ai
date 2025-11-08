"use client";
import React, { useState, useEffect } from "react";
import BillingPage from "./pages/billing/page";
import { AdminSidebar } from "./components/side-bar/AdminSidebar";
import { CommonDialogsProvider } from "./components/dialogs/commonDialogsContext";
import dynamic from "next/dynamic";
import { AdminHeader } from "./components/header/AdminHeader";
import { useSearchParams, useRouter } from "next/navigation";
import ThemeButton from "@/components/ThemeButton";

const Dashboard = dynamic(
  () => import("./pages/dashboard/page"),
  { ssr: false }
);
const UsersPage = dynamic(() => import("./pages/users/page"), { ssr: false });
const AgentsPage = dynamic(() => import("./pages/agents/page"), { ssr: false });
const TelephonyPage = dynamic(() => import("./pages/telephony/page"), { ssr: false });
const SupportPage = dynamic(() => import("./pages/support/page"), { ssr: false });

export default function AdminLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [activePage, setActivePage] = useState(tabParam || "dashboard");
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  // Update active page if URL param changes
  useEffect(() => {
    if (tabParam && tabParam !== activePage) {
      setActivePage(tabParam);
    }
  }, [tabParam]);

  // Update URL when sidebar changes
  const handleSetActivePage = (page: string) => {
    setActivePage(page);
    router.replace(`?tab=${page}`); // Update query param without full reload
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UsersPage />;
      case "agents":
        return <AgentsPage />;
      case "billing":
        return <BillingPage />;
      case "telephony":
        return <TelephonyPage />;
      case "support":
        return <SupportPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CommonDialogsProvider activePage={activePage} setActivePage={handleSetActivePage}>
      <div className="flex h-screen bg-b-surface1 font-body antialiased">
        <AdminSidebar 
          activePage={activePage} 
          setActivePage={handleSetActivePage}
          visibleSidebar={visibleSidebar}
          onCloseSidebar={() => setVisibleSidebar(false)}
        />
        <div
          className={`fixed inset-0 z-30 bg-shade-07/70 transition-all duration-300 dark:bg-shade-04/90 ${
            visibleSidebar
              ? "visible opacity-100"
              : "invisible opacity-0"
          }`}
          onClick={() => setVisibleSidebar(false)}
        ></div>
        <div className="flex-1 flex flex-col pl-85 max-4xl:pl-70 max-3xl:pl-60 max-xl:pl-0">
          <AdminHeader 
            activePage={activePage} 
            onToggleSidebar={() => setVisibleSidebar(!visibleSidebar)}
          />
          <main className="flex-1 bg-b-surface1 pt-22 pb-5 max-md:pt-18 overflow-x-auto">
            <div className="center-with-sidebar p-6 max-md:p-4">
              {renderPage()}
            </div>
          </main>
        </div>
        <div className="fixed bottom-6 left-6 z-50">
          <ThemeButton />
        </div>
      </div>
    </CommonDialogsProvider>
  );
}
