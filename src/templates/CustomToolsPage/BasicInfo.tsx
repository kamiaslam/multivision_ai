"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Switch from "@/components/Switch";

const BasicInfo = () => {
    const [toolName, setToolName] = useState("BookingTool");
    const [description, setDescription] = useState("Books appointments for customers with validation and confirmation");
    const [webhookUrl, setWebhookUrl] = useState("https://your-api.com/booking-webhook");
    const [timeout, setTimeout] = useState("");
    const [maxRetries, setMaxRetries] = useState("3");
    const [isActive, setIsActive] = useState(true);
    const [isPublic, setIsPublic] = useState(false);

    return (
        <div className="space-y-6">
            {/* Tool Name */}
            <Field
                label="Tool Name*"
                placeholder="BookingTool"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                tooltip="Alphanumeric characters and underscores only"
            />

            {/* Description */}
            <Field
                label="Description*"
                placeholder="Books appointments for customers with validation and confirmation"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                textarea
            />

            {/* Webhook URL */}
            <Field
                label="Webhook URL*"
                placeholder="https://your-api.com/booking-webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
            />

            {/* Timeout */}
            <Field
                label="Timeout (seconds)*"
                placeholder="Enter timeout in seconds (10-300)"
                value={timeout}
                onChange={(e) => setTimeout(e.target.value)}
                tooltip="Must be between 10 and 300 seconds"
            />

            {/* Max Retries */}
            <Field
                label="Max Retries*"
                placeholder="3"
                value={maxRetries}
                onChange={(e) => setMaxRetries(e.target.value)}
            />

            {/* Toggle Switches */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-button text-t-primary">Active</span>
                    </div>
                    <Switch
                        checked={isActive}
                        onChange={setIsActive}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-button text-t-primary">Public</span>
                    </div>
                    <Switch
                        checked={isPublic}
                        onChange={setIsPublic}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
