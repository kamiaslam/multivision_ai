"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import SimAIOverview from "./SimAIOverview";
import SimAIWorkspace from "./SimAIWorkspace";
import SimAIEmbed from "./SimAIEmbed";
import Tabs from "@/components/Tabs";

const SimAIPage = () => {
    const tabs = [
        { id: 1, name: "SIM AI Studio" },
        { id: 2, name: "Overview" },
        { id: 3, name: "Workspace Manager" },
    ];
    
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <Layout title="Sim AI - Powered by VoiceCake">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-shade-09">
                            SIM AI Integration
                        </h2>
                        <p className="text-shade-06 mt-1">
                            Access powerful AI agents and workflow automation directly from VoiceCake
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-01/10 rounded-lg">
                        <span className="text-xs text-primary-04">VC-Agent Active</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                
                <Tabs
                    items={tabs}
                    value={activeTab}
                    setValue={setActiveTab}
                />
            </div>
            
            <div className="space-y-6">
                {activeTab.id === 1 && (
                    <div className="bg-shade-02 rounded-lg p-1">
                        <SimAIEmbed height="calc(100vh - 300px)" />
                    </div>
                )}
                {activeTab.id === 2 && <SimAIOverview />}
                {activeTab.id === 3 && <SimAIWorkspace />}
            </div>
        </Layout>
    );
};

export default SimAIPage;
