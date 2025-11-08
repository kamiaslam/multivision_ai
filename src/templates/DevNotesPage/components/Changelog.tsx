"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";

interface ChangelogEntry {
  version: string;
  date: string;
  type: string;
  description: string;
  category: string;
}

interface ChangelogProps {
  entries: ChangelogEntry[];
}

const Changelog = ({ entries }: ChangelogProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-blue-500/10 text-blue-400";
      case "fix": return "bg-green-500/10 text-green-400";
      case "improvement": return "bg-purple-500/10 text-purple-400";
      case "security": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  return (
    <Card title="Changelog" className="p-6">
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="border-l-4 border-[var(--primary-01)] pl-4">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{entry.version}</span>
                <Badge className={getTypeColor(entry.type)}>
                  {entry.type}
                </Badge>
              </div>
              <span className="text-sm text-[var(--text-tertiary)]">{entry.date}</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">{entry.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Changelog;
