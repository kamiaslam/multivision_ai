import { AgentType } from "@/types/agent";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

interface AgentTypeSelectorProps {
  selectedAgentType: AgentType | null;
  isEditMode: boolean;
  onAgentTypeSelect: (type: AgentType) => void;
  onAgentTypeChange: () => void;
}

export const AgentTypeSelector = ({
  selectedAgentType,
  isEditMode,
  onAgentTypeSelect,
  onAgentTypeChange
}: AgentTypeSelectorProps) => {
  if (!selectedAgentType) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-center">Choose Agent Type</h3>
          <p className="text-t-secondary text-center">Select the type of agent you want to create</p>
          {isEditMode && (
            <p className="text-xs text-t-secondary text-center mt-1">
              Agent type cannot be changed in edit mode
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`cursor-pointer transition-all hover:shadow-md border-2 rounded-3xl p-6 text-center hover:border-primary-01/50 ${
              isEditMode ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !isEditMode && onAgentTypeSelect('SPEECH')}
          >
            <Icon name="microphone" className="w-12 h-12 mx-auto mb-4 text-primary-01" />
            <h4 className="font-semibold text-lg mb-2">Speech to Speech</h4>
            <p className="text-t-secondary text-sm">
              Full voice conversation with AI. User speaks, AI responds with voice.
            </p>
          </div>
          
          <div 
            className={`cursor-pointer transition-all hover:shadow-md border-2 rounded-3xl p-6 text-center hover:border-primary-01/50 ${
              isEditMode ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !isEditMode && onAgentTypeSelect('TEXT')}
          >
            <Icon name="chat" className="w-12 h-12 mx-auto mb-4 text-primary-01" />
            <h4 className="font-semibold text-lg mb-2">Text to Speech</h4>
            <p className="text-t-secondary text-sm">
              Text input, AI responds with voice. Perfect for chatbots with voice output.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-primary-01/5 border border-primary-01/20 rounded-3xl">
      <div className="flex items-center gap-3">
        {selectedAgentType === 'SPEECH' ? (
          <Icon name="microphone" className="w-6 h-6 text-primary-01" />
        ) : (
          <Icon name="chat" className="w-6 h-6 text-primary-01" />
        )}
        <div>
          <span className="font-semibold text-primary-01">
            {selectedAgentType === 'SPEECH' ? 'Speech to Speech' : 'Text to Speech'} Agent
          </span>
          <p className="text-xs text-t-secondary">
            {selectedAgentType === 'SPEECH' 
              ? 'Full voice conversation with AI' 
              : 'Text input, AI responds with voice'
            }
          </p>
        </div>
      </div>
      {!isEditMode && (
        <Button 
          type="button" 
          isStroke 
          onClick={onAgentTypeChange}
          className="h-8 px-3 text-sm"
        >
          Change Type
        </Button>
      )}
    </div>
  );
};
