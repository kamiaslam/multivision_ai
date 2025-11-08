"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function InferencePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to agents page if no specific agent is selected
    router.push('/agents');
  }, [router]);

  return (
    <ProtectedRoute>
      <Layout title="Voice AI Inference">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-01 to-primary-02 rounded-full flex items-center justify-center mx-auto">
                <Icon name="microphone" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-t-primary mb-2">Voice AI Inference</h2>
                <p className="text-t-secondary">
                  Please select an agent to start voice inference.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/agents')}
                className="w-full"
              >
                <Icon name="arrow_right" className="w-4 h-4 mr-2" />
                Go to Agents
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
