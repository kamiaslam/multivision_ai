"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/authContext";
import { FinanceProvider } from "@/context/financeContext";
import { AgentEditProvider } from "@/context/agentEditContext";
import { VoiceProvider } from "@/contexts/VoiceContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider disableTransitionOnChange>
            <AuthProvider>
                <FinanceProvider>
                    <AgentEditProvider>
                        <VoiceProvider>
                            {children}
                        </VoiceProvider>
                    </AgentEditProvider>
                </FinanceProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Providers;
