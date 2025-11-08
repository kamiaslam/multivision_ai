import React from "react";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";

interface AdminSidebarProps {
  activePage: string; // ✅ highlight currently active page
  setActivePage: (page: string) => void;
  visibleSidebar?: boolean;
  hideSidebar?: boolean;
  onCloseSidebar?: () => void;
}

export function AdminSidebar({ activePage, setActivePage, visibleSidebar, hideSidebar, onCloseSidebar }: AdminSidebarProps) {
  const adminNavigation = [
    {
      title: "Dashboard",
      id: "dashboard",
      icon: "dashboard",
    },
    {
      title: "Users & Accounts",
      id: "users",
      icon: "users",
    },
    {
      title: "Agents & Bots",
      id: "agents",
      icon: "chat",
    },
    {
      title: "Billing",
      id: "billing",
      icon: "wallet",
    },
    {
      title: "Telephony",
      id: "telephony",
      icon: "phone",
    },
    {
      title: "Support",
      id: "support",
      icon: "help",
    },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 flex flex-col w-85 p-5 bg-b-surface1 transition-transform duration-300 max-4xl:w-70 max-3xl:w-60 max-xl:w-74 max-md:p-3 z-40 ${
        hideSidebar 
          ? "hidden" 
          : visibleSidebar 
            ? "translate-x-0" 
            : "max-xl:-translate-x-full"
      }`}
    >
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex flex-col space-y-1">
        {adminNavigation.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`group relative flex items-center shrink-0 gap-3 h-12 px-3 text-button transition-colors hover:text-t-primary rounded-3xl ${
                isActive ? "text-t-primary bg-b-surface2" : "text-t-secondary"
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon
                name={item.icon}
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-t-primary" : "text-t-secondary group-hover:text-t-primary"
                }`}
              />
              <span className="font-medium">{item.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
