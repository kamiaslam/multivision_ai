import { AgentType } from "@/types/agent";
import Field from "@/components/Field";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface SystemPromptProps {
  selectedAgentType: AgentType | null;
  instructions: string;
  isExpanded: boolean;
  onInstructionsChange: (instructions: string) => void;
  onToggleExpanded: () => void;
}

export const SystemPrompt = ({
  selectedAgentType,
  instructions,
  isExpanded,
  onInstructionsChange,
  onToggleExpanded
}: SystemPromptProps) => {
  if (!selectedAgentType) {
    return (
      <div className="text-center py-8 text-t-secondary">
        Please select an agent type first to configure instructions.
      </div>
    );
  }

  const getPlaceholder = () => {
    if (selectedAgentType === 'SPEECH') {
      return `You are a helpful AI assistant. Provide detailed instructions for how you should behave, respond, and interact with users.

Examples:
• Your personality and communication style
• Specific topics you're knowledgeable about
• How to handle different types of questions
• Any specific behaviors or responses to avoid
• Context about your role or purpose

Be as detailed as possible to ensure consistent and helpful responses.`;
    } else {
      return `Provide detailed instructions for how the agent should respond to text inputs.

Examples:
• Response style and tone
• Specific topics or domains of expertise
• How to handle different types of requests
• Any limitations or guidelines
• Context about the agent's purpose

Be specific to ensure the agent provides helpful and consistent responses.`;
    }
  };

  return (
    <div className="space-y-4">
      <Field
        label={
          selectedAgentType === 'SPEECH' ? 'Custom Instructions' : 'Agent Instructions'
        }
        placeholder={getPlaceholder()}
        value={instructions}
        onChange={(e) => onInstructionsChange(e.target.value)}
        textarea
        classInput={isExpanded ? "h-72" : "h-24"}
        required={selectedAgentType === 'TEXT'}
      />
      <div className="flex items-center gap-4">
        <p className="text-xs text-t-secondary flex-1" style={{ width: '70%' }}>
          💡 Tip: The more detailed your instructions, the better the agent will perform. Include personality traits, response style, and specific guidelines.
        </p>
        <Button
          onClick={onToggleExpanded}
          className="text-sm text-nowrap"
          isStroke
          style={{ width: '20%' }}
        >
          <Icon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            className="w-4 h-4 mr-2" 
          />
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </div>
    </div>
  );
};
