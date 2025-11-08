"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

const SimAIOverview = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLaunchSimAI = () => {
        setIsLoading(true);
        // Open Sim AI in a new window/tab
        window.open('/sim-ai/workspace', '_blank');
        setIsLoading(false);
    };

    return (
        <Card
            title="Sim AI Workspace"
            headContent={
                <Button
                    onClick={handleLaunchSimAI}
                    disabled={isLoading}
                    className="bg-primary text-white hover:bg-primary/90"
                >
                    {isLoading ? "Launching..." : "Launch Sim AI"}
                </Button>
            }
        >
            <div className="p-5 max-lg:p-3">
                <p className="text-shade-03 dark:text-shade-05 mb-6">
                    Advanced AI-powered workspace for creating and managing intelligent agents
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-shade-08 dark:bg-shade-02 p-4 rounded-lg">
                        <h3 className="font-semibold text-shade-01 dark:text-white mb-2">
                            AI Agents
                        </h3>
                        <p className="text-sm text-shade-03 dark:text-shade-05">
                            Create and manage intelligent AI agents for various tasks
                        </p>
                    </div>
                    <div className="bg-shade-08 dark:bg-shade-02 p-4 rounded-lg">
                        <h3 className="font-semibold text-shade-01 dark:text-white mb-2">
                            Workflows
                        </h3>
                        <p className="text-sm text-shade-03 dark:text-shade-05">
                            Design complex workflows and automation processes
                        </p>
                    </div>
                    <div className="bg-shade-08 dark:bg-shade-02 p-4 rounded-lg">
                        <h3 className="font-semibold text-shade-01 dark:text-white mb-2">
                            Integrations
                        </h3>
                        <p className="text-sm text-shade-03 dark:text-shade-05">
                            Connect with various tools and services seamlessly
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SimAIOverview;
