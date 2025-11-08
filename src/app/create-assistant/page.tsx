"use client";

import { useState } from "react";
import { Element } from "react-scroll";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Badge from "@/components/Badge";
import Range from "@/components/Range";
import Search from "@/components/Search";
import { Link } from "react-scroll";
import CallTranscriptPanel from "@/components/CallTranscriptPanel";

const ElementWithOffset = ({
    className,
    name,
    children,
}: {
    className?: string;
    name: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="relative">
            <Element
                className={`absolute -top-21 left-0 right-0 ${className || ""}`}
                name={name}
            ></Element>
            {children}
        </div>
    );
};

const CreateAssistantPage = () => {
    // Call Transcript Panel
    const [isCallPanelOpen, setIsCallPanelOpen] = useState(false);

    // System Prompt expandable state
    const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(false);

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    // Share Options
    const shareOptions = [
        { name: "Assistant Link", icon: "link" },
        { name: "WhatsApp", icon: "whatsapp" },
        { name: "Email", icon: "mail" },
        { name: "Facebook", icon: "facebook" },
        { name: "Twitter", icon: "twitter" },
        { name: "Instagram", icon: "instagram" }
    ];

    const navigation = [
        {
            title: "Performance",
            icon: "chart",
            description: "Cost and latency metrics",
            to: "performance",
        },
        {
            title: "Model",
            icon: "settings",
            description: "AI model configuration",
            to: "model",
        },
        {
            title: "Details",
            icon: "user",
            description: "Assistant details and settings",
            to: "details",
        },
        {
            title: "System Prompt",
            icon: "message",
            description: "Define assistant behavior",
            to: "system-prompt",
        },
        {
            title: "Assignments",
            icon: "link",
            description: "Phone numbers and automations",
            to: "assignments",
        },
        {
            title: "Training Data",
            icon: "data_set",
            description: "Upload training files",
            to: "training-data",
        },
        {
            title: "Share",
            icon: "share",
            description: "Share assistant with others",
            to: "share",
        },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <Layout title="Create Assistant">
            <div className="flex items-start max-lg:block">
                {/* Sidebar Menu */}
                <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden p-6">
                    <Search
                        className="mb-3"
                        value=""
                        onChange={(e) => {}}
                        placeholder="Search sections"
                        isGray
                    />
                    <div className="flex flex-col gap-1">
                        {navigation.map((item, index) => (
                            <Link
                                className="group relative flex items-center h-18 px-3 cursor-pointer"
                                activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
                                key={index}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                isDynamic={true}
                                spy={true}
                                offset={-5.5}
                            >
                                <div className="box-hover"></div>
                                <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                                    <Icon
                                        className="fill-t-secondary"
                                        name={item.icon}
                                    />
                                </div>
                                <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                                    <div className="text-button">{item.title}</div>
                                    <div className="mt-1 truncate text-caption text-t-secondary">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    {/* Performance Metrics */}
                    <ElementWithOffset name="performance">
                        <Card title="Performance Metrics" className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-4">
                                            <div className="text-sm text-t-secondary">Cost: -0.09 / min (est.)</div>
                                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-sm text-t-secondary">Latency: -0.09 / min (est.)</div>
                                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    className="ml-4"
                                    onClick={() => setIsCallPanelOpen(true)}
                                >
                                    <Icon name="play" className="w-4 h-4 mr-2" />
                                    Test Assistant
                                </Button>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Model Configuration */}
                    <ElementWithOffset name="model">
                        <Card title="Model Configuration" className="p-6">
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
                    </ElementWithOffset>

                    {/* Details */}
                    <ElementWithOffset name="details">
                        <Card title="Assistant Details" className="p-6">
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
                    </ElementWithOffset>

                    {/* System Prompt */}
                    <ElementWithOffset name="system-prompt">
                        <Card title="System Prompt" className="p-6">
                            <div className="space-y-3">
                                <Field
                                    placeholder="Describe Assistant Role Boundaries tone"
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    textarea
                                    classInput={isSystemPromptExpanded ? "h-72" : "h-24"}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => setIsSystemPromptExpanded(!isSystemPromptExpanded)}
                                        className="text-sm"
                                        isStroke
                                    >
                                        <Icon 
                                            name={isSystemPromptExpanded ? "chevron-up" : "chevron-down"} 
                                            className="w-4 h-4 mr-2" 
                                        />
                                        {isSystemPromptExpanded ? "Show less" : "Show more"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Assignments */}
                    <ElementWithOffset name="assignments">
                        <div className="space-y-3">
                            <Card title="Assign Phone Numbers" className="p-6">
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

                            <Card title="Assign Automations" className="p-6">
                                <div className="space-y-3">
                                    {automations.map((automation, index) => (
                                        <div key={index} className="p-3 bg-b-surface2 rounded-2xl">
                                            <span className="text-t-primary">{automation}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </ElementWithOffset>

                    {/* Training Data */}
                    <ElementWithOffset name="training-data">
                        <Card title="Training Data" className="p-6">
                            <div className="border-2 border-dashed border-s-stroke2 rounded-3xl p-6 text-center">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Button className="mb-4">
                                        Choose File
                                    </Button>
                                    <div className="text-t-secondary">
                                        {selectedFile ? selectedFile.name : "No File Chosen"}
                                    </div>
                                </label>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Share */}
                    <ElementWithOffset name="share">
                        <Card title="Share" className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {shareOptions.map((option, index) => (
                                    <Button
                                        key={index}
                                        className="flex flex-col items-center gap-2 p-4 h-auto"
                                        isStroke
                                    >
                                        <Icon name={option.icon} className="w-6 h-6" />
                                        <span className="text-sm">{option.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-6">
                        <Button isStroke>
                            Cancel
                        </Button>
                        <Button className="flex items-center gap-2">
                            <Icon name="save" className="w-4 h-4" />
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>

            {/* Call Transcript Panel */}
            <CallTranscriptPanel 
                isOpen={isCallPanelOpen}
                onClose={() => setIsCallPanelOpen(false)}
            />
        </Layout>
    );
};

export default CreateAssistantPage;
