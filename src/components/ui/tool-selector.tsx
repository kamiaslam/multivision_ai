import { useState, useEffect } from "react";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { toolsAPI } from "@/services/api";
import { toast } from "sonner";
import { Tool } from "@/types/tool";

interface ToolSelectorProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
}

export function ToolSelector({ value, onValueChange, placeholder }: ToolSelectorProps) {
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch tools from API
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const tools = await toolsAPI.getTools();
        setAvailableTools(tools);
      } catch (err: any) {
        console.error("Error fetching tools:", err);
        setError(err.message || "Failed to fetch tools");
        toast.error("Failed to load tools");
        // Fallback to empty array on error
        setAvailableTools([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleToolToggle = (toolId: string) => {
    const newValue = value.includes(toolId)
      ? value.filter(id => id !== toolId)
      : [...value, toolId];
    onValueChange(newValue);
  };

  const selectedTools = availableTools.filter(tool => {
    const toolId = tool.id || tool.name;
    return value.includes(toolId);
  });
  // Show limited tools initially, expand to show all when needed
  const displayTools = isExpanded ? availableTools : availableTools.slice(0, 3);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Available Tools</span>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 border border-s-stroke2 rounded-2xl">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mt-1"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Available Tools</span>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-center gap-2">
            <Icon name="alert_triangle" className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">Failed to load tools</span>
          </div>
          <p className="text-xs text-red-600 mt-1">{error}</p>
          <Button
            isStroke
            onClick={() => window.location.reload()}
            className="mt-2 text-xs h-8 px-3"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (availableTools.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Available Tools</span>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
          <Icon name="tools" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No tools available</p>
          <p className="text-xs text-gray-500 mt-1">Contact your administrator to add tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Available Tools</span>
        {availableTools.length > 3 && (
          <Button
            isStroke
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-8 px-3"
          >
            {isExpanded ? "Show Less" : `Show All (${availableTools.length})`}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {displayTools.map((tool) => {
          const toolId = tool.id || tool.name; // Fallback to name if id is not available
          return (
            <div key={toolId} className="flex items-start space-x-3 p-3 border border-s-stroke2 rounded-2xl hover:border-s-highlight transition-colors">
              <Checkbox
                checked={value.includes(toolId)}
                onChange={() => handleToolToggle(toolId)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-t-primary truncate" title={tool.name}>{tool.name}</div>
                <div className="text-xs text-t-secondary mt-1 line-clamp-2">{tool.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {value.length > 0 && (
        <div className="text-xs text-t-secondary">
          {value.length} tool{value.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
