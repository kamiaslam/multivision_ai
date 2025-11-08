import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { NavigationItem } from "../types";

interface TopUpFormProps {
  activeTab: number;
  onTabClick: (tabId: number) => void;
  onReset: () => void;
  onSave: () => void;
  loading: boolean;
  editingTopUp: any;
  navigation: NavigationItem[];
  renderTabContent: () => React.ReactNode;
}

export const TopUpForm = ({
  activeTab,
  onTabClick,
  onReset,
  onSave,
  loading,
  editingTopUp,
  navigation,
  renderTabContent
}: TopUpFormProps) => {
  return (
    <div className="card p-6">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-t-primary">
          {editingTopUp ? `Edit Configuration` : 'Configure Settings'}
        </h2>
        <p className="text-sm text-t-secondary">
          {editingTopUp ? 'Modify your wallet and premium voice settings' : 'Configure your wallet and premium voice settings.'}
        </p>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] mb-6">
        {renderTabContent()}
      </div>

      {/* Action Buttons at Bottom */}
      <div className="flex gap-2 justify-end pt-4 border-t border-s-subtle">
        <Button
          isStroke
          onClick={onReset}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={activeTab === 1 && !editingTopUp ? () => onTabClick(2) : onSave}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Icon name="loader" className="w-4 h-4 animate-spin" />
              {editingTopUp ? 'Updating...' : 'Processing...'}
            </>
          ) : (
            <>
              <Icon name={activeTab === 1 && !editingTopUp ? "arrow_right" : "check"} className="w-4 h-4" />
              {activeTab === 1 && !editingTopUp ? 'Next' : (editingTopUp ? 'Update Configuration' : 'Save Configuration')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
