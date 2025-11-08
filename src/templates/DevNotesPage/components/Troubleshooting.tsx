"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";

interface TroubleshootingItem {
  issue: string;
  solution: string;
  category: string;
  severity: string;
}

interface TroubleshootingProps {
  items: TroubleshootingItem[];
}

const Troubleshooting = ({ items }: TroubleshootingProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-500/10 text-green-400";
      case "medium": return "bg-yellow-500/10 text-yellow-400";
      case "high": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  return (
    <Card title="Troubleshooting" className="p-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border border-s-subtle rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{item.issue}</h3>
              <Badge className={getSeverityColor(item.severity)}>
                {item.severity}
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">{item.solution}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Troubleshooting;
