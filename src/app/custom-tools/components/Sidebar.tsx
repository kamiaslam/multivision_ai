import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import { NavigationItem } from "../types";

interface SidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateTool: () => void;
  showForm: boolean;
  editingTool: any;
  activeTab: number;
  onTabClick: (tabId: number) => void;
  navigation: NavigationItem[];
}

export const Sidebar = ({
  searchTerm,
  onSearchChange,
  onCreateTool,
  showForm,
  editingTool,
  activeTab,
  onTabClick,
  navigation
}: SidebarProps) => {
  return (
    <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-h6 text-t-primary mb-2">Custom Tools</h2>
        <p className="text-sm text-t-secondary">Create and manage custom tools for your AI agents.</p>
      </div>

      {/* Create Tool Button */}
      <Button 
        className={`w-full mb-4 transition-all duration-200 ${
          showForm ? 'shadow-lg hover:shadow-xl scale-105' : ''
        }`}
        onClick={onCreateTool}
      >
        <Icon name="plus" className="w-4 h-4 mr-2" />
        {showForm ? 'Create New Tool' : 'Create Tool'}
      </Button>

      {/* Search */}
      {/* <Search
        className="mb-3"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={showForm ? "Search existing tools..." : "Search tools..."}
        isGray
      /> */}

      {/* Navigation Menu - Show when creating or editing a tool */}
      {showForm && (
        <div className="flex flex-col gap-1">
          {navigation.map((item, index) => (
            <button
              key={index}
              className={`group relative flex items-center h-18 px-3 cursor-pointer text-left transition-all duration-200 ${
                activeTab === item.tabId 
                  ? "[&_.box-hover]:!visible [&_.box-hover]:!opacity-100" 
                  : "hover:bg-b-surface2/50 rounded-[20px]"
              }`}
              onClick={() => onTabClick(item.tabId)}
            >
              <div className="box-hover"></div>
              <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                <Icon
                  className={`fill-t-secondary transition-colors duration-200 ${
                    activeTab === item.tabId ? "fill-t-primary" : ""
                  }`}
                  name={item.icon}
                />
              </div>
              <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                <div className={`text-button transition-colors duration-200 ${
                  activeTab === item.tabId ? "text-t-primary" : ""
                }`}>{item.title}</div>
                <div className="mt-1 truncate text-caption text-t-secondary">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
