"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Spinner from "@/components/Spinner";

interface SimAIEmbedProps {
    height?: string;
    route?: string;
}

const SimAIEmbed = ({ 
    height = "calc(100vh - 200px)",
    route = "/voicecake" // Default to VoiceCake integration route
}: SimAIEmbedProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // SIM AI URL - in production, this would be configured
    const SIM_AI_URL = process.env.NEXT_PUBLIC_SIM_AI_URL || "http://localhost:3000";
    
    // Build embed URL with VoiceCake user context
    // In a real implementation, you'd get user data from your auth system
    const userParams = new URLSearchParams({
        email: 'user@voicecake.io', // Replace with actual user data
        name: 'VoiceCake User',     // Replace with actual user data
        userId: 'vc-user-123'      // Replace with actual user ID
    });
    
    const embedUrl = `${SIM_AI_URL}${route}?${userParams.toString()}`;

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // Handle iframe load
        const handleLoad = () => {
            setIsLoading(false);
            
            // Send theme information to SIM AI
            iframe.contentWindow?.postMessage(
                {
                    type: "voicecake-theme",
                    theme: theme,
                    origin: "voicecake"
                },
                SIM_AI_URL
            );
        };

        // Handle iframe errors
        const handleError = () => {
            setError("Failed to load SIM AI. Please ensure the service is running.");
            setIsLoading(false);
        };

        iframe.addEventListener("load", handleLoad);
        iframe.addEventListener("error", handleError);

        // Listen for messages from SIM AI
        const handleMessage = (event: MessageEvent) => {
            // Verify origin
            if (event.origin !== SIM_AI_URL) return;

            // Handle different message types
            switch (event.data.type) {
                case "sim-ai-ready":
                    console.log("SIM AI is ready");
                    // Send user context if needed
                    iframe.contentWindow?.postMessage(
                        {
                            type: "voicecake-user",
                            user: {
                                // Add user data here
                                platform: "voicecake",
                            }
                        },
                        SIM_AI_URL
                    );
                    break;
                case "sim-ai-navigate":
                    // Handle navigation requests from SIM AI
                    if (event.data.path) {
                        window.location.href = event.data.path;
                    }
                    break;
                case "sim-ai-notification":
                    // Handle notifications from SIM AI
                    console.log("Notification from SIM AI:", event.data.message);
                    break;
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            iframe.removeEventListener("load", handleLoad);
            iframe.removeEventListener("error", handleError);
            window.removeEventListener("message", handleMessage);
        };
    }, [theme, SIM_AI_URL]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-shade-02 rounded-lg">
                <div className="text-xl text-shade-08 mb-4">⚠️ Connection Error</div>
                <div className="text-shade-06 text-center mb-6">{error}</div>
                <button 
                    onClick={() => {
                        setError(null);
                        setIsLoading(true);
                        iframeRef.current?.contentWindow?.location.reload();
                    }}
                    className="px-4 py-2 bg-primary-01 text-shade-01 rounded-lg hover:bg-primary-02 transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="relative w-full" style={{ height }}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-shade-02 rounded-lg z-10">
                    <div className="flex flex-col items-center">
                        <Spinner />
                        <div className="mt-4 text-shade-06">Loading SIM AI...</div>
                    </div>
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                className="w-full h-full border-0 rounded-lg"
                style={{
                    backgroundColor: "var(--backgrounds-body)",
                    display: isLoading ? "none" : "block"
                }}
                allow="clipboard-write; clipboard-read"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                title="SIM AI Integration"
            />
        </div>
    );
};

export default SimAIEmbed;