import { AgentType } from "@/types/agent";
import { ToolSelector } from "@/components/ui/tool-selector";

interface ToolsSelectionProps {
  selectedAgentType: AgentType | null;
  toolIds: string[];
  onToolIdsChange: (toolIds: string[]) => void;
}

export const ToolsSelection = ({
  selectedAgentType,
  toolIds,
  onToolIdsChange
}: ToolsSelectionProps) => {
  if (!selectedAgentType) {
    return (
      <div className="text-center py-8 text-t-secondary">
        Please select an agent type first to configure tools.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ToolSelector
        value={toolIds}
        onValueChange={onToolIdsChange}
        placeholder="Select tools for this agent..."
      />
      <p className="text-xs text-t-secondary">
        💡 Tip: Select tools that your agent can use to perform specific tasks. Tools will be available to the agent during conversations.
      </p>
    </div>
  );
};
