import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { NavigationItem } from "../types";
import BasicInfo from "../BasicInfo";
import AudioUpload from "../AudioUpload";
import { FormData } from "../types";

interface VoiceCloneFormProps {
  activeTab: number;
  onTabClick: (tabId: number) => void;
  onReset: () => void;
  onSave: () => void;
  loading: boolean;
  editingVoiceClone: any;
  navigation: NavigationItem[];
  renderTabContent: () => React.ReactNode;
}

export const VoiceCloneForm = ({
  activeTab,
  onTabClick,
  onReset,
  onSave,
  loading,
  editingVoiceClone,
  navigation,
  renderTabContent
}: VoiceCloneFormProps) => {
  return (
    <div className="card p-6">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-t-primary">
          {editingVoiceClone ? `Edit ${editingVoiceClone.name}` : 'Create Voice Clone'}
        </h2>
        <p className="text-sm text-t-secondary">
          {editingVoiceClone ? 'Modify your voice clone configuration' : 'Create a new custom voice clone from audio samples.'}
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
        
        {/* Show Next button on Basic Info tab (tab 1) */}
        {activeTab === 1 ? (
          <Button
            onClick={() => onTabClick(2)}
            disabled={loading}
            className="gap-2"
          >
            <Icon name="arrow_right" className="w-4 h-4" />
            Next
          </Button>
        ) : (
          /* Show Save/Update button on final tab (tab 2) */
          <Button
            onClick={onSave}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Icon name="loader" className="w-4 h-4 animate-spin" />
                {editingVoiceClone ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Icon name="check" className="w-4 h-4" />
                {editingVoiceClone ? 'Update Voice Clone' : 'Create Voice Clone'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
