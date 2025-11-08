"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import BasicInfo from "./BasicInfo";
import InputSchema from "./InputSchema";
import WebhookConfig from "./WebhookConfig";

const tabs = [
    { id: 1, name: "Basic Info" },
    { id: 2, name: "Input Schema" },
    { id: 3, name: "Webhook Config" },
];

const CustomToolsPage = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const renderTabContent = () => {
        switch (activeTab.id) {
            case 1:
                return <BasicInfo />;
            case 2:
                return <InputSchema />;
            case 3:
                return <WebhookConfig />;
            default:
                return <BasicInfo />;
        }
    };

    return (
        <Layout title="Custom Tools">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-t-primary">Custom Tools</h1>
                        <p className="text-gray-600">Create and manage custom tools for your AI agents.</p>
                    </div>
                    <Button className="flex items-center gap-2">
                        <Icon name="plus" className="w-4 h-4" />
                        Create Tool
                    </Button>
                </div>

                {/* Main Content */}
                <Card title="Create New Tool" className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Icon name="product" className="w-5 h-5 text-t-primary" />
                        <h2 className="text-h5 text-t-primary">Create New Tool</h2>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`flex items-center h-12 px-5.5 rounded-full border text-button transition-colors hover:text-t-primary ${
                                    activeTab.id === tab.id
                                        ? "border-s-stroke2 text-t-primary bg-b-surface2"
                                        : "border-transparent text-t-secondary"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="pt-3">
                        {renderTabContent()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-s-subtle">
                        <Button isStroke>
                            Cancel
                        </Button>
                        {activeTab.id < 3 ? (
                            <Button 
                                onClick={() => {
                                    const nextTab = tabs.find(tab => tab.id === activeTab.id + 1);
                                    if (nextTab) setActiveTab(nextTab);
                                }}
                                className="flex items-center gap-2"
                            >
                                Next
                                <Icon name="arrow_right" className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button className="flex items-center gap-2">
                                <Icon name="plus" className="w-4 h-4" />
                                Create Tool
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default CustomToolsPage;
