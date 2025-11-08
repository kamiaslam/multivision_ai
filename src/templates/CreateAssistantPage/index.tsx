"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Badge from "@/components/Badge";
import Range from "@/components/Range";

const CreateAssistantPage = () => {
    // Performance Metrics
    const [costRange, setCostRange] = useState([0, 50]);
    const [latencyRange, setLatencyRange] = useState([0, 100]);

    // Model Configuration
    const [provider, setProvider] = useState({ id: 1, name: "Open AI" });
    const [firstMessageMode, setFirstMessageMode] = useState({ id: 1, name: "United Kingdom" });
    const [model, setModel] = useState({ id: 1, name: "Open AI" });
    const [firstMessage, setFirstMessage] = useState({ id: 1, name: "India (INR)" });

    // Details
    const [type, setType] = useState("Mathew Anderson");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("English");
    const [turnTaking, setTurnTaking] = useState("auto");
    const [name, setName] = useState("Maxima Studio");
    const [status, setStatus] = useState({ id: 1, name: "India (INR)" });
    const [emotionsSensitivity, setEmotionsSensitivity] = useState("0.5");

    // System Prompt
    const [systemPrompt, setSystemPrompt] = useState("");

    // Training Data
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Assign Numbers
    const phoneNumbers = [
        "+12025550123",
        "+12025550123", 
        "+12025550123"
    ];

    // Assign Automations
    const automations = [
        "Inbound → Empth → CRM",
        "Voice → Email",
        "Miscalled → Whatsapp"
    ];

    // Integrations
    const integrations = [
        { name: "Hubspot", icon: "link" },
        { name: "Google Sheet", icon: "link" },
        { name: "Whatsapp", icon: "link" },
        { name: "Salesforce", icon: "link" }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Layout title="Create Assistant">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-t-primary">Create Assistant</h1>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card title="Cost" className="p-6">
                        <div className="space-y-4">
                            <div className="text-sm text-t-secondary">-0.09 / min (est.)</div>
                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
                        </div>
                    </Card>
                    <Card title="Latency" className="p-6">
                        <div className="space-y-4">
                            <div className="text-sm text-t-secondary">-0.09 / min (est.)</div>
                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
                        </div>
                    </Card>
                </div>

                {/* Model Configuration */}
                <Card title="Model" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-4">
                            <Select
                                label="Provider"
                                value={provider}
                                onChange={setProvider}
                                options={[
                                    { id: 1, name: "Open AI" },
                                    { id: 2, name: "Anthropic" },
                                    { id: 3, name: "Google" }
                                ]}
                            />
                            <Select
                                label="First Message Mode"
                                value={firstMessageMode}
                                onChange={setFirstMessageMode}
                                options={[
                                    { id: 1, name: "United Kingdom" },
                                    { id: 2, name: "United States" },
                                    { id: 3, name: "Canada" }
                                ]}
                            />
                        </div>
                        <div className="space-y-4">
                            <Select
                                label="Model"
                                value={model}
                                onChange={setModel}
                                options={[
                                    { id: 1, name: "Open AI" },
                                    { id: 2, name: "GPT-4" },
                                    { id: 3, name: "Claude" }
                                ]}
                            />
                            <Select
                                label="First Message"
                                value={firstMessage}
                                onChange={setFirstMessage}
                                options={[
                                    { id: 1, name: "India (INR)" },
                                    { id: 2, name: "United States (USD)" },
                                    { id: 3, name: "Europe (EUR)" }
                                ]}
                            />
                        </div>
                    </div>
                </Card>

                {/* Details */}
                <Card title="Details" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-4">
                            <Field
                                label="Type"
                                placeholder="Mathew Anderson"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                            <Field
                                label="Description"
                                placeholder="What this assistant does"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                textarea
                            />
                            <Field
                                label="Language"
                                placeholder="English"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            />
                            <Field
                                label="Turn Taking"
                                placeholder="auto"
                                value={turnTaking}
                                onChange={(e) => setTurnTaking(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <Field
                                label="Name"
                                placeholder="Maxima Studio"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Select
                                label="Status"
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { id: 1, name: "India (INR)" },
                                    { id: 2, name: "Active" },
                                    { id: 3, name: "Inactive" }
                                ]}
                            />
                            <Field
                                label="Emotions Sensitivity"
                                placeholder="0.5"
                                value={emotionsSensitivity}
                                onChange={(e) => setEmotionsSensitivity(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* System Prompt */}
                <Card title="System Prompt" className="p-6">
                    <Field
                        placeholder="Describe Assistant Role Boundaries tone"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        textarea
                    />
                </Card>

                {/* Training Data */}
                <Card title="Training Data" className="p-6">
                    <div className="space-y-4">
                        {/* File Upload Area */}
                        <div className="border-2 border-dashed border-s-stroke2 rounded-3xl p-6 text-center hover:border-primary-01/50 transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.csv,.json,.xlsx,.xls"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-3">
                                    <Icon name="upload" className="w-8 h-8 text-t-secondary" />
                                    <div>
                                        <Button className="mb-2">
                                            <Icon name="plus" className="w-4 h-4 mr-2" />
                                            Choose Files
                                        </Button>
                                        <div className="text-sm text-t-secondary">
                                            or drag and drop files here
                                        </div>
                                    </div>
                                    <div className="text-xs text-t-tertiary">
                                        Supported formats: PDF, DOC, DOCX, TXT, CSV, JSON, XLSX, XLS
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Selected Files List */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-t-primary">Selected Files ({selectedFiles.length})</h4>
                                    <Button
                                        isStroke
                                        onClick={() => setSelectedFiles([])}
                                        className="text-sm"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                                            <div className="flex items-center gap-3">
                                                <Icon name="file" className="w-5 h-5 text-t-secondary" />
                                                <div>
                                                    <div className="text-sm font-medium text-t-primary">{file.name}</div>
                                                    <div className="text-xs text-t-secondary">{formatFileSize(file.size)}</div>
                                                </div>
                                            </div>
                                            <Button
                                                isStroke
                                                onClick={() => removeFile(index)}
                                                className="p-2"
                                            >
                                                <Icon name="trash" className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Assign Numbers */}
                <Card title="Assign Numbers" className="p-6">
                    <div className="space-y-3">
                        {phoneNumbers.map((number, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-b-surface2 rounded-2xl">
                                <span className="text-t-primary">{number}</span>
                                <Badge className="bg-primary-02/20 text-primary-02 border border-primary-02/30">
                                    Active
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Assign Automations */}
                <Card title="Assign Automations" className="p-6">
                    <div className="space-y-3">
                        {automations.map((automation, index) => (
                            <div key={index} className="p-3 bg-b-surface2 rounded-2xl">
                                <span className="text-t-primary">{automation}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Integrations */}
                <Card title="Integrations" className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {integrations.map((integration, index) => (
                            <Button
                                key={index}
                                className="flex flex-col items-center gap-2 p-4 h-auto"
                                isStroke
                            >
                                <Icon name={integration.icon} className="w-6 h-6" />
                                <span className="text-sm">{integration.name}</span>
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                    <Button isStroke>
                        Cancel
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Icon name="plus" className="w-4 h-4" />
                        Create Assistant
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default CreateAssistantPage;
