"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";

const SimAIWorkspacePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading the Sim AI application
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <Layout title="Sim AI Workspace" hideSidebar>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-shade-03 dark:text-shade-05">Initializing Sim AI Workspace...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title="Sim AI Workspace" hideSidebar>
                <div className="flex items-center justify-center min-h-screen">
                    <Card title="Error" className="p-8 text-center">
                        <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Sim AI</h2>
                        <p className="text-shade-03 dark:text-shade-05 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Sim AI Workspace" hideSidebar>
            <div className="min-h-screen bg-shade-08 dark:bg-shade-01">
                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-shade-01 dark:text-white mb-2">
                            Sim AI Workspace
                        </h1>
                        <p className="text-shade-03 dark:text-shade-05">
                            Welcome to your AI-powered workspace
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card title="Quick Actions" className="p-6">
                            <div className="space-y-3">
                                <Button className="w-full justify-start" icon="plus">
                                    Create New Agent
                                </Button>
                                <Button className="w-full justify-start" icon="play">
                                    Start Workflow
                                </Button>
                                <Button className="w-full justify-start" icon="chart">
                                    View Analytics
                                </Button>
                                <Button className="w-full justify-start" icon="settings">
                                    Configure Tools
                                </Button>
                            </div>
                        </Card>

                        <Card title="Recent Activity" className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                    <div>
                                        <p className="font-medium text-shade-01 dark:text-white">Agent Created</p>
                                        <p className="text-sm text-shade-03 dark:text-shade-05">Customer Support Bot</p>
                                    </div>
                                    <span className="text-xs text-shade-04">2h ago</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                    <div>
                                        <p className="font-medium text-shade-01 dark:text-white">Workflow Executed</p>
                                        <p className="text-sm text-shade-03 dark:text-shade-05">Data Processing</p>
                                    </div>
                                    <span className="text-xs text-shade-04">5h ago</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                    <div>
                                        <p className="font-medium text-shade-01 dark:text-white">Tool Integrated</p>
                                        <p className="text-sm text-shade-03 dark:text-shade-05">Slack Connector</p>
                                    </div>
                                    <span className="text-xs text-shade-04">1d ago</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card title="Workspace Overview" className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                <div className="text-2xl font-bold text-primary">12</div>
                                <div className="text-sm text-shade-03 dark:text-shade-05">Active Agents</div>
                            </div>
                            <div className="text-center p-4 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                <div className="text-2xl font-bold text-primary">8</div>
                                <div className="text-sm text-shade-03 dark:text-shade-05">Workflows</div>
                            </div>
                            <div className="text-center p-4 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                <div className="text-2xl font-bold text-primary">156</div>
                                <div className="text-sm text-shade-03 dark:text-shade-05">Executions Today</div>
                            </div>
                            <div className="text-center p-4 bg-shade-07 dark:bg-shade-02 rounded-lg">
                                <div className="text-2xl font-bold text-primary">98%</div>
                                <div className="text-sm text-shade-03 dark:text-shade-05">Success Rate</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default SimAIWorkspacePage;
