"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Icon from "@/components/Icon";

const WebhookConfig = () => {
    const [webhookSecret, setWebhookSecret] = useState("your_webhook_secret_key");

    return (
        <div className="space-y-6">
            {/* Webhook Secret */}
            <Field
                label="Webhook Secret"
                placeholder="your_webhook_secret_key"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                tooltip="Optional HMAC secret for webhook authentication"
            />

            {/* Third-Party Tool Integration */}
            <div className="p-4 border border-s-stroke2 rounded-3xl bg-b-surface2">
                <div className="flex items-center gap-2 mb-4">
                    <Icon name="link" className="w-5 h-5 text-t-primary" />
                    <h3 className="text-h6 text-t-primary">Third-Party Tool Integration</h3>
                </div>
                <ul className="space-y-2 text-body-2 text-t-secondary">
                    <li className="flex items-start gap-2">
                        <span className="text-t-primary mt-1">•</span>
                        <span>Your webhook will receive POST requests when this tool is invoked</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-t-primary mt-1">•</span>
                        <span>Request body will contain the tool inputs as JSON</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-t-primary mt-1">•</span>
                        <span>Your service can return any JSON response format</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-t-primary mt-1">•</span>
                        <span>No output schema definition needed - your service handles the response</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-t-primary mt-1">•</span>
                        <span>Webhook secret will be sent in the X-Webhook-Secret header for security</span>
                    </li>
                </ul>
            </div>

            {/* Example Request */}
            <div className="p-4 border border-s-stroke2 rounded-3xl bg-b-surface2">
                <h3 className="text-h6 text-t-primary mb-4">Example Request to Your Webhook</h3>
                <div className="bg-b-surface1 border border-s-stroke2 rounded-2xl p-4">
                    <pre className="text-sm text-t-primary font-mono whitespace-pre-wrap">
{`POST /your-webhook-url
Content-Type: application/json
X-Webhook-Secret: your_secret_key

{
  "customer_name": "John Doe",
  "service_type": "consultation",
  "preferred_date": "2024-01-15"
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default WebhookConfig;
