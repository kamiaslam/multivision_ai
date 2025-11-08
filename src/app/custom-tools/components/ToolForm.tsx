import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import BasicInfo from "../BasicInfo";
import InputSchema from "../InputSchema";
import WebhookConfig from "../WebhookConfig";
import { NavigationItem } from "../types";

interface ToolFormProps {
  activeTab: number;
  onTabClick: (tabId: number) => void;
  onReset: () => void;
  onSave: () => void;
  loading: boolean;
  editingTool: any;
  navigation: NavigationItem[];
  renderTabContent: () => React.ReactNode;
}

export const ToolForm = ({
  activeTab,
  onTabClick,
  onReset,
  onSave,
  loading,
  editingTool,
  navigation,
  renderTabContent
}: ToolFormProps) => {
  return (
    <Card className="p-6">
      {/* Tab Navigation (Mobile/Tablet) */}
      <div className="flex gap-1 mb-8 lg:hidden">
        {navigation.map((item) => (
          <button
            key={item.tabId}
            className={`flex items-center h-12 px-5.5 rounded-full border text-button transition-colors hover:text-t-primary ${
              activeTab === item.tabId
                ? "border-s-subtle text-white bg-black dark:bg-white dark:text-black"
                : "border-transparent text-t-secondary"
            }`}
            onClick={() => onTabClick(item.tabId)}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-3">
        {renderTabContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-s-subtle">
        <Button isStroke onClick={onReset}>
          Cancel
        </Button>
        {activeTab < 3 ? (
          <Button 
            onClick={() => onTabClick(activeTab + 1)}
            className="flex items-center gap-2"
          >
            Next
            <Icon name="arrow_right" className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            className="flex items-center gap-2"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="spinner" className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon name="check" className="w-4 h-4" />
                {editingTool ? 'Update Tool' : 'Create Tool'}
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};
