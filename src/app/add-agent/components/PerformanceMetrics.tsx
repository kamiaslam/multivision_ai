import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface PerformanceMetricsProps {
  onTestAssistant: () => void;
}

export const PerformanceMetrics = ({ onTestAssistant }: PerformanceMetricsProps) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-4">
            <div className="text-sm text-t-secondary">Cost: 0.09 / min (est.)</div>
            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-t-secondary">Latency: 0.09 / min (est.)</div>
            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
      <Button 
        className="ml-4"
        onClick={onTestAssistant}
      >
        <Icon name="play" className="w-4 h-4 mr-2" />
        Test Assistant
      </Button>
    </div>
  );
};
