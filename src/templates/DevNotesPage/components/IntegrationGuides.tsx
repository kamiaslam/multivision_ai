"use client";

import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface IntegrationGuide {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  category: string;
}

interface IntegrationGuidesProps {
  guides: IntegrationGuide[];
}

const IntegrationGuides = ({ guides }: IntegrationGuidesProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-400";
      case "intermediate": return "bg-yellow-500/10 text-yellow-400";
      case "advanced": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  return (
    <Card title="Integration Guides" className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide, index) => (
          <div key={index} className="border border-s-subtle rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{guide.title}</h3>
              <Badge className={getDifficultyColor(guide.difficulty)}>
                {guide.difficulty}
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-3">{guide.description}</p>
            <div className="flex justify-between items-center text-xs text-[var(--text-tertiary)]">
              <span>Est. time: {guide.estimatedTime}</span>
              <Button>
                View Guide
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default IntegrationGuides;
