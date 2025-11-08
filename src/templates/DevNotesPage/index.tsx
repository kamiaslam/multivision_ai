"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { SelectOption } from "@/types/select";

// Import modular components
import QuickStats from "./components/QuickStats";
import ApiDocumentation from "./components/ApiDocumentation";
import IntegrationGuides from "./components/IntegrationGuides";
import Troubleshooting from "./components/Troubleshooting";
import Changelog from "./components/Changelog";
import CodeExamples from "./components/CodeExamples";
import ApiKeys from "./components/ApiKeys";

// Import data
import { 
  agentEndpoints, 
  voiceEndpoints, 
  toolsEndpoints, 
  sessionsEndpoints,
  livekitEndpoints,
  integrationGuides, 
  troubleshootingItems, 
  changelogEntries 
} from "./data";

const DevNotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<SelectOption>({ id: 1, name: "All Categories" });
  const [selectedScope, setSelectedScope] = useState("conversa");


  const categories: SelectOption[] = [
    { id: 1, name: "All Categories" },
    { id: 2, name: "API Documentation" },
    { id: 3, name: "Integration Guides" },
    { id: 4, name: "Troubleshooting" },
    { id: 5, name: "Changelog" },
    { id: 6, name: "Code Examples" },
    { id: 7, name: "API Keys" }
  ];

  return (
    <Layout title="Developer Notes">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold"></h1>
            <p className="text-[var(--text-secondary)]">Technical documentation and development resources</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
            />
            <Button>
              Download SDK
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats
          totalEndpoints={agentEndpoints.length + voiceEndpoints.length + toolsEndpoints.length + sessionsEndpoints.length + livekitEndpoints.length}
          integrationGuidesCount={integrationGuides.length}
          troubleshootingItemsCount={troubleshootingItems.length}
          latestVersion="v2.1.0"
        />

        {/* API Documentation */}
        {(selectedCategory.id === 1 || selectedCategory.id === 2) && (
          <ApiDocumentation
            agentEndpoints={agentEndpoints}
            voiceEndpoints={voiceEndpoints}
            toolsEndpoints={toolsEndpoints}
            sessionsEndpoints={sessionsEndpoints}
            livekitEndpoints={livekitEndpoints}
          />
        )}

        {/* Integration Guides */}
        {(selectedCategory.id === 1 || selectedCategory.id === 3) && (
          <IntegrationGuides guides={integrationGuides} />
        )}

        {/* Troubleshooting */}
        {(selectedCategory.id === 1 || selectedCategory.id === 4) && (
          <Troubleshooting items={troubleshootingItems} />
        )}

        {/* Changelog */}
        {(selectedCategory.id === 1 || selectedCategory.id === 5) && (
          <Changelog entries={changelogEntries} />
        )}

        {/* Code Examples */}
        {selectedCategory.id === 6 && <CodeExamples />}

        {/* API Keys */}
        {(selectedCategory.id === 1 || selectedCategory.id === 7) && (
          <ApiKeys
            selectedScope={selectedScope}
            setSelectedScope={setSelectedScope}
          />
        )}
      </div>
    </Layout>
  );
};

export default DevNotesPage;