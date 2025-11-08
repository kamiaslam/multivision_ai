"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import Loader from "@/components/Loader";
import { TabsOption } from "@/types/tabs";
import { useFinance } from "@/context/financeContext";
import { toast } from "sonner";

interface ApiKey {
  id: number;
  scope: string;
  preview?: string;
  is_active: boolean;
  created_at?: string;
}

interface ApiKeysProps {
  selectedScope: string;
  setSelectedScope: (scope: string) => void;
}

const ApiKeys = ({ selectedScope, setSelectedScope }: ApiKeysProps) => {
  const { listApiKeys, rotateApiKey, revokeApiKey } = useFinance();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Tab options for API Keys
  const scopeTabs: TabsOption[] = [
    { id: 1, name: "Conversa" },
    { id: 2, name: "Empath" },
    { id: 3, name: "Wallet" }
  ];

  const [selectedTab, setSelectedTab] = useState<TabsOption>(scopeTabs[0]);

  // Handle tab change and update scope
  const handleTabChange = (tab: TabsOption) => {
    setSelectedTab(tab);
    const scopeMap: { [key: number]: string } = {
      1: "conversa",
      2: "empath", 
      3: "wallet"
    };
    setSelectedScope(scopeMap[tab.id]);
  };

  // API Keys management functions
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const items = await listApiKeys(selectedScope);
        setKeys(items.filter((k: any) => k.scope === selectedScope && k.id !== undefined) as ApiKey[]);
      } catch {
        setKeys([]);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [selectedScope, listApiKeys]);

  const handleRotate = async () => {
    setLoading(true);
    try {
      const data = await rotateApiKey(selectedScope);
      setKeys(prev => [{ id: data.id!, scope: data.scope!, preview: data.api_key_raw || undefined, is_active: true }, ...prev]);
      if (data.api_key_raw) toast.success("New API key generated. Copy and store it securely.");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to rotate API key");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setLoading(true);
    try {
      if (!keys[0]?.id) return;
      await revokeApiKey(keys[0].id as number);
      setKeys(prev => prev.map((k, i) => (i === 0 ? { ...k, is_active: false } : k)));
      toast.success("API key revoked");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to revoke API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="API Keys" className="p-6">
      <div className="space-y-6 border-l-4 border-[var(--primary-01)] pl-4">
        {/* Header with description */}
        <div className="space-y-2">
          <p className="text-[var(--text-secondary)] text-sm">
            Manage your API keys for different service integrations. Each key provides access to specific functionality.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <Icon name="info" className="w-4 h-4" />
            <span>Keys are masked after creation. Generate a new one to view the raw value once.</span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div>
          <Tabs
            items={scopeTabs}
            value={selectedTab}
            setValue={handleTabChange}
            className="mb-0"
          />
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Current Scope Info */}
          <div className="flex items-center justify-between p-4 bg-b-surface2 rounded-lg border border-s-subtle">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-02"></div>
              <div>
                <div className="font-medium text-t-primary">{selectedTab.name} API Keys</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {selectedScope === 'conversa' && 'Conversational AI and chat functionality'}
                  {selectedScope === 'empath' && 'Emotion analysis and sentiment detection'}
                  {selectedScope === 'wallet' && 'Payment processing and billing operations'}
                </div>
              </div>
            </div>
            <Badge className="bg-primary-02/10 text-primary-02">
              {keys.filter(k => k.is_active).length} Active
            </Badge>
          </div>

          {fetching ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleRotate} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  Generate New Key
                </Button>
                <Button 
                  isStroke 
                  onClick={handleRevoke} 
                  disabled={loading || keys.length === 0}
                  className="flex items-center gap-2"
                >
                  <Icon name="trash" className="w-4 h-4" />
                  Revoke Latest
                </Button>
              </div>
              
              {/* New Key Display */}
              {keys.length > 0 && keys[0]?.preview && keys[0].preview.length > 12 ? (
                <div className="space-y-3 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5 text-green-400" />
                    <div className="text-sm font-medium text-green-400">New API Key Generated</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-[var(--text-secondary)]">Copy this key now - it won't be shown again</div>
                    <div className="flex items-center gap-2 p-3 bg-b-surface1 border border-s-subtle rounded-lg">
                      <code className="font-mono text-sm flex-1">{keys[0].preview as string}</code>
                      <Button 
                        isWhite 
                        className="px-3 py-1 text-xs"
                        onClick={() => navigator.clipboard.writeText(keys[0].preview!)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Keys List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-t-primary">Your Keys</h3>
                  <div className="text-sm text-[var(--text-tertiary)]">
                    {keys.length} total
                  </div>
                </div>
                
                {keys.length > 0 ? (
                  <div className="space-y-2">
                    {keys.map((k, index) => (
                      <div key={String(k.id)} className="flex items-center justify-between p-4 border border-s-subtle rounded-lg bg-b-surface1">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${k.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div>
                            <div className="font-mono text-sm">{k.preview || "************"}</div>
                            <div className="text-xs text-[var(--text-tertiary)] flex items-center gap-2">
                              <span>Scope: {k.scope}</span>
                              <span>•</span>
                              <span className={k.is_active ? 'text-green-400' : 'text-red-400'}>
                                {k.is_active ? "Active" : "Revoked"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-[var(--text-tertiary)]">
                            {k.created_at ? new Date(k.created_at).toLocaleDateString() : "Unknown"}
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)]">
                            {k.created_at ? new Date(k.created_at).toLocaleTimeString() : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--text-secondary)]">
                    <Icon name="key" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <div className="text-sm">No API keys found for {selectedTab.name}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">
                      Generate your first key to get started
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApiKeys;
