"use client";

import { useState, useEffect } from "react";
import Field from "@/components/Field";
import Switch from "@/components/Switch";

interface BasicInfoProps {
    formData: {
        name: string;
        description: string;
        webhook_url: string;
        timeout: number | null;
        max_retries: number;
        is_active: boolean;
        is_public: boolean;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const BasicInfo = ({ formData, setFormData }: BasicInfoProps) => {
    const updateFormData = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="space-y-3">
            {/* Tool Name */}
            <Field
                label="Tool Name*"
                placeholder="BookingTool"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                tooltip="Alphanumeric characters and underscores only"
            />

            {/* Description */}
            <Field
                label="Description*"
                placeholder="Books appointments for customers with validation and confirmation"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                textarea
            />

            {/* Webhook URL */}
            <Field
                label="Webhook URL*"
                placeholder="https://your-api.com/booking-webhook"
                value={formData.webhook_url}
                onChange={(e) => updateFormData('webhook_url', e.target.value)}
            />

            {/* Timeout */}
            <Field
                label="Timeout (seconds)*"
                placeholder="Enter timeout in seconds (10-300)"
                value={formData.timeout?.toString() || ''}
                onChange={(e) => updateFormData('timeout', e.target.value ? parseInt(e.target.value) : null)}
                tooltip="Must be between 10 and 300 seconds"
            />

            {/* Max Retries */}
            <Field
                label="Max Retries*"
                placeholder="3"
                value={formData.max_retries.toString()}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                        updateFormData('max_retries', 0);
                    } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                            updateFormData('max_retries', numValue);
                        }
                    }
                }}
            />

            {/* Toggle Switches */}
            <div className="flex gap-8">
                <div className="flex items-center gap-3">
                    <span className="text-button text-t-primary">Active</span>
                    <Switch
                        checked={formData.is_active}
                        onChange={(checked) => updateFormData('is_active', checked)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-button text-t-primary">Public</span>
                    <Switch
                        checked={formData.is_public}
                        onChange={(checked) => updateFormData('is_public', checked)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
