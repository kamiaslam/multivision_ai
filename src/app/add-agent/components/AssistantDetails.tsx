import { AgentType } from "@/types/agent";
import Field from "@/components/Field";

interface AssistantDetailsProps {
  selectedAgentType: AgentType | null;
  formData: {
    name: string;
    description: string;
  };
  language: string;
  turnTaking: string;
  onFormDataChange: (updates: { name?: string; description?: string }) => void;
  onLanguageChange: (language: string) => void;
  onTurnTakingChange: (turnTaking: string) => void;
}

export const AssistantDetails = ({
  selectedAgentType,
  formData,
  language,
  turnTaking,
  onFormDataChange,
  onLanguageChange,
  onTurnTakingChange
}: AssistantDetailsProps) => {
  if (!selectedAgentType) {
    return (
      <div className="text-center py-8 text-t-secondary">
        Please select an agent type first to configure details.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Field
        label="Agent Name"
        placeholder="e.g., Customer Support AI"
        value={formData.name}
        onChange={(e) => onFormDataChange({ name: e.target.value })}
        required
      />
      
      <Field
        label="Description"
        placeholder="Describe what this agent does and how it helps users..."
        value={formData.description}
        onChange={(e) => onFormDataChange({ description: e.target.value })}
        textarea
        classInput="h-24"
        maxLength={1500}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-t-secondary">
          {formData.description.length}/1,500 characters
        </span>
        {formData.description.length > 1400 && (
          <span className="text-xs text-orange-500">
            {1500 - formData.description.length} characters remaining
          </span>
        )}
      </div>

      {/* Legacy fields for existing design compatibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Language"
          placeholder="English"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        />
        <Field
          label="Turn Taking"
          placeholder="auto"
          value={turnTaking}
          onChange={(e) => onTurnTakingChange(e.target.value)}
        />
      </div>
    </div>
  );
};
