"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Switch from "@/components/Switch";

// User interface
interface User {
  id: number;
  company: string;
  name: string;
  lastUpdated: string;
  plan: string;
  seats: number;
  status: string;
  autoRenew: boolean;
  mrr: number;
  createdAt: string;
  lastLogin: string;
  country: string;
  industry: string;
  subscriptionId?: number;
  botType: string | null;
}

// Pricing Override Dialog Component
interface PricingOverrideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  botType: string | null;
  pricingData: {
    conversa: any | null;
    empath: any | null;
  } | null;
  isLoading: boolean;
  onReviewImpact: (pricing: any) => void;
  isSaving: boolean;
  onBotTypeChange: (newBotType: string) => void;
}

export const PricingOverrideDialog: React.FC<PricingOverrideDialogProps> = ({
  isOpen,
  onClose,
  user,
  botType,
  pricingData,
  isLoading,
  onReviewImpact,
  isSaving,
  onBotTypeChange
}) => {
  const [selectedBotType, setSelectedBotType] = useState<string | null>(null);
  const [isOverrideEnabled, setIsOverrideEnabled] = useState(false);
  const [pricing, setPricing] = useState({
    ttsPricePerMin: 0,
    sttPricePerMin: 0,
    automationsPack: 0,
    premiumVoiceSurcharge: 0
  });
  const [pricingInput, setPricingInput] = useState({
    ttsPricePerMin: "",
    sttPricePerMin: "",
    automationsPack: "",
    premiumVoiceSurcharge: ""
  });

  // Ensure non-negative values and round to two decimals to avoid floating point artifacts
  const clampToTwoDecimalsNonNegative = (value: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    const nonNegative = Math.max(0, value);
    return Math.round(nonNegative * 100) / 100;
  };
  const allowTwoDecimalsRegex = /^\d*(\.\d{0,2})?$/;
  const normalizeTwoDecimalsString = (s: string) => {
    const n = parseFloat(s);
    if (Number.isNaN(n)) return "0.00";
    return (Math.round(Math.max(0, n) * 100) / 100).toFixed(2);
  };

  useEffect(() => {
    if (isOpen && user && botType && pricingData && pricingData[botType as keyof typeof pricingData]) {
      setSelectedBotType(botType);
      const currentPricing = pricingData[botType as keyof typeof pricingData];
      setIsOverrideEnabled(currentPricing.pricing_type === "custom");
      setPricing({
        ttsPricePerMin: currentPricing.tts_price_per_minute_cents / 100,
        sttPricePerMin: currentPricing.stt_price_per_minute_cents / 100,
        automationsPack: currentPricing.automation_price_cents / 100,
        premiumVoiceSurcharge: currentPricing.premium_voice_surcharge_cents / 100
      });
      setPricingInput({
        ttsPricePerMin: String((currentPricing.tts_price_per_minute_cents || 0) / 100),
        sttPricePerMin: String((currentPricing.stt_price_per_minute_cents || 0) / 100),
        automationsPack: String((currentPricing.automation_price_cents || 0) / 100),
        premiumVoiceSurcharge: String((currentPricing.premium_voice_surcharge_cents || 0) / 100)
      });
    }
  }, [isOpen, user, botType, pricingData]);

  // Sync numeric state when string input changes (for arrow key support)
  useEffect(() => {
    const parseAndSet = (value: string) => {
      const num = parseFloat(value);
      return Number.isNaN(num) ? 0 : Math.max(0, num);
    };
    
    setPricing({
      ttsPricePerMin: parseAndSet(pricingInput.ttsPricePerMin),
      sttPricePerMin: parseAndSet(pricingInput.sttPricePerMin),
      automationsPack: parseAndSet(pricingInput.automationsPack),
      premiumVoiceSurcharge: parseAndSet(pricingInput.premiumVoiceSurcharge)
    });
  }, [pricingInput]);

  const handleBotTypeChange = (newBotType: string) => {
    if (!pricingData || !pricingData[newBotType as keyof typeof pricingData]) return;
    
    setSelectedBotType(newBotType);
    onBotTypeChange(newBotType);
    
    const currentPricing = pricingData[newBotType as keyof typeof pricingData];
    setIsOverrideEnabled(currentPricing.pricing_type === "custom");
    setPricing({
      ttsPricePerMin: currentPricing.tts_price_per_minute_cents / 100,
      sttPricePerMin: currentPricing.stt_price_per_minute_cents / 100,
      automationsPack: currentPricing.automation_price_cents / 100,
      premiumVoiceSurcharge: currentPricing.premium_voice_surcharge_cents / 100
    });
    setPricingInput({
      ttsPricePerMin: String((currentPricing.tts_price_per_minute_cents || 0) / 100),
      sttPricePerMin: String((currentPricing.stt_price_per_minute_cents || 0) / 100),
      automationsPack: String((currentPricing.automation_price_cents || 0) / 100),
      premiumVoiceSurcharge: String((currentPricing.premium_voice_surcharge_cents || 0) / 100)
    });
  };

  const handleReviewImpact = () => {
    onReviewImpact({
      enabled: isOverrideEnabled,
      ...pricing
    });
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl min-h-fit">
        <DialogHeader>
          <DialogTitle>Pricing Override - {user.company}</DialogTitle>
          <DialogDescription>
            Configure custom pricing for this account. If disabled, the account will inherit global pricing.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 ">
            <div className="text-sm text-gray-500">Loading pricing data...</div>
          </div>
        ) : (
          <div className="space-y-6 ">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bot Type</Label>
              <RadioGroup value={selectedBotType || ""} onValueChange={handleBotTypeChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conversa" id="conversa" />
                  <Label htmlFor="conversa" className="flex-1">
                    Conversa {pricingData?.conversa?.pricing_type === "custom" ? "(Custom)" : "(Global)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="empath" id="empath" />
                  <Label htmlFor="empath" className="flex-1">
                    Empath {pricingData?.empath?.pricing_type === "custom" ? "(Custom)" : "(Global)"}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Enable Override Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Override</Label>
                <p className="text-xs text-gray-500">
                  If disabled, this account inherits global pricing.
                </p>
              </div>
              <Switch
                checked={isOverrideEnabled}
                onChange={setIsOverrideEnabled}
              />
            </div>

            {/* Pricing Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>TTS, $/min</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  inputMode="decimal"
                  pattern="^\\d+(\\.\\d{0,2})?$"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                  }}
                  value={pricingInput.ttsPricePerMin}
                  disabled={!isOverrideEnabled}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || allowTwoDecimalsRegex.test(v)) {
                      setPricingInput((pi) => ({ ...pi, ttsPricePerMin: v }));
                    }
                  }}
                  onBlur={() => {
                    const normalized = normalizeTwoDecimalsString(pricingInput.ttsPricePerMin);
                    setPricingInput((pi) => ({ ...pi, ttsPricePerMin: normalized }));
                    setPricing((p) => ({ ...p, ttsPricePerMin: parseFloat(normalized) }));
                  }}
                />
              </div>
              <div>
                <Label>STT, $/min</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  inputMode="decimal"
                  pattern="^\\d+(\\.\\d{0,2})?$"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                  }}
                  value={pricingInput.sttPricePerMin}
                  disabled={!isOverrideEnabled}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || allowTwoDecimalsRegex.test(v)) {
                      setPricingInput((pi) => ({ ...pi, sttPricePerMin: v }));
                    }
                  }}
                  onBlur={() => {
                    const normalized = normalizeTwoDecimalsString(pricingInput.sttPricePerMin);
                    setPricingInput((pi) => ({ ...pi, sttPricePerMin: normalized }));
                    setPricing((p) => ({ ...p, sttPricePerMin: parseFloat(normalized) }));
                  }}
                />
              </div>
                  <div>
                    <Label>Per automations</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      inputMode="decimal"
                      pattern="^\\d+(\\.\\d{0,2})?$"
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                      }}
                      value={pricingInput.automationsPack}
                      disabled={!isOverrideEnabled}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || allowTwoDecimalsRegex.test(v)) {
                          setPricingInput((pi) => ({ ...pi, automationsPack: v }));
                        }
                      }}
                      onBlur={() => {
                        const normalized = normalizeTwoDecimalsString(pricingInput.automationsPack);
                        setPricingInput((pi) => ({ ...pi, automationsPack: normalized }));
                        setPricing((p) => ({ ...p, automationsPack: parseFloat(normalized) }));
                      }}
                    />
                  </div>
              <div>
                <Label>Premium voice surcharge, $/min</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  inputMode="decimal"
                  pattern="^\\d+(\\.\\d{0,2})?$"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                  }}
                  value={pricingInput.premiumVoiceSurcharge}
                  disabled={!isOverrideEnabled}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || allowTwoDecimalsRegex.test(v)) {
                      setPricingInput((pi) => ({ ...pi, premiumVoiceSurcharge: v }));
                    }
                  }}
                  onBlur={() => {
                    const normalized = normalizeTwoDecimalsString(pricingInput.premiumVoiceSurcharge);
                    setPricingInput((pi) => ({ ...pi, premiumVoiceSurcharge: normalized }));
                    setPricing((p) => ({ ...p, premiumVoiceSurcharge: parseFloat(normalized) }));
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </Button>
          <Button
            onClick={handleReviewImpact}
            disabled={isSaving || isLoading}
          >
            Review Impact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Review Impact Dialog Component
interface ReviewImpactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  botType: string | null;
  pricingData: {
    conversa: any | null;
    empath: any | null;
  } | null;
  reviewPricing: any;
  globalPricing: {
    conversa: any | null;
    empath: any | null;
  } | null;
  onConfirm: (pricing: any) => void;
  isSaving: boolean;
}

export const ReviewImpactDialog: React.FC<ReviewImpactDialogProps> = ({
  isOpen,
  onClose,
  user,
  botType,
  pricingData,
  reviewPricing,
  globalPricing,
  onConfirm,
  isSaving
}) => {
  if (!user || !botType || !pricingData || !reviewPricing) return null;

  const currentPricing = pricingData[botType as keyof typeof pricingData];
  const wasOriginallyCustom = currentPricing?.pricing_type === "custom";
  const isGlobalPricing = !reviewPricing.enabled;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl min-h-fit">
        <DialogHeader>
          <DialogTitle>Review Impact - {user.company}</DialogTitle>
          <DialogDescription>
            {isGlobalPricing 
              ? "This account will inherit global pricing."
              : "Review the pricing changes before applying them."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 ">
          {/* Bot Type Display */}
          <div className="text-sm">
            <span className="font-medium">Bot Type:</span> {botType.charAt(0).toUpperCase() + botType.slice(1)}
          </div>

          {isGlobalPricing ? (
            /* Global Pricing Display */
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pricing (Global)</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">(Platform-wide rates)</span>
              </div>
              {globalPricing && globalPricing[botType as keyof typeof globalPricing] ? (
                <div className="max-w-xs">
                  <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>TTS:</span>
                      <span className="font-medium">
                        ${(globalPricing[botType as keyof typeof globalPricing].tts_price_per_minute_cents / 100).toFixed(2)}/min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>STT:</span>
                      <span className="font-medium">
                        ${(globalPricing[botType as keyof typeof globalPricing].stt_price_per_minute_cents / 100).toFixed(2)}/min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per automations:</span>
                      <span className="font-medium">
                        ${(globalPricing[botType as keyof typeof globalPricing].automation_price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium:</span>
                      <span className="font-medium">
                        ${(globalPricing[botType as keyof typeof globalPricing].premium_voice_surcharge_cents / 100).toFixed(2)}/min
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    This account will use the platform-wide pricing rates instead of custom pricing.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Custom Pricing Comparison */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Pricing */}
              <div>
                <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Current Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>TTS:</span>
                    <span>${(currentPricing.tts_price_per_minute_cents / 100).toFixed(2)}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT:</span>
                    <span>${(currentPricing.stt_price_per_minute_cents / 100).toFixed(2)}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per automations:</span>
                    <span>${(currentPricing.automation_price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium:</span>
                    <span>${(currentPricing.premium_voice_surcharge_cents / 100).toFixed(2)}/min</span>
                  </div>
                </div>
              </div>

              {/* New Pricing */}
              <div>
                <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">New Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>TTS:</span>
                    <span className="font-medium">${reviewPricing.ttsPricePerMin.toFixed(2)}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT:</span>
                    <span className="font-medium">${reviewPricing.sttPricePerMin.toFixed(2)}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per automations:</span>
                    <span className="font-medium">${reviewPricing.automationsPack.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium:</span>
                    <span className="font-medium">${reviewPricing.premiumVoiceSurcharge.toFixed(2)}/min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(reviewPricing)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Confirm Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Simulate Pricing Dialog Component
interface SimulatePricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  botType: string | null;
  pricingData: {
    conversa: any | null;
    empath: any | null;
  } | null;
  globalPricing: {
    conversa: any | null;
    empath: any | null;
  } | null;
  isLoading: boolean;
}

// Global Pricing Dialog Component
interface GlobalPricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  globalPricing: {
    conversa: any | null;
    empath: any | null;
  } | null;
  isLoading: boolean;
  onReviewImpact: (pricing: any) => void;
  isSaving: boolean;
}

export const GlobalPricingDialog: React.FC<GlobalPricingDialogProps> = ({
  isOpen,
  onClose,
  globalPricing,
  isLoading,
  onReviewImpact,
  isSaving
}) => {
  const [selectedBotType, setSelectedBotType] = useState<string>('conversa');
  const [pricing, setPricing] = useState({
    ttsPricePerMin: 0,
    sttPricePerMin: 0,
    automationPrice: 0,
    premiumVoiceSurcharge: 0
  });
  const [pricingInput, setPricingInput] = useState({
    ttsPricePerMin: "",
    sttPricePerMin: "",
    automationPrice: "",
    premiumVoiceSurcharge: ""
  });

  const clampToTwoDecimalsNonNegative = (value: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    const nonNegative = Math.max(0, value);
    return Math.round(nonNegative * 100) / 100;
  };
  const allowTwoDecimalsRegex = /^\d*(\.\d{0,2})?$/;
  const normalizeTwoDecimalsString = (s: string) => {
    const n = parseFloat(s);
    if (Number.isNaN(n)) return "0.00";
    return (Math.round(Math.max(0, n) * 100) / 100).toFixed(2);
  };

  useEffect(() => {
    if (isOpen && globalPricing) {
      // Set default to conversa and load its pricing
      setSelectedBotType('conversa');
      if (globalPricing.conversa) {
        setPricing({
          ttsPricePerMin: (globalPricing.conversa.tts_price_per_minute_cents || 0) / 100,
          sttPricePerMin: (globalPricing.conversa.stt_price_per_minute_cents || 0) / 100,
          automationPrice: (globalPricing.conversa.automation_price_cents || 0) / 100,
          premiumVoiceSurcharge: (globalPricing.conversa.premium_voice_surcharge_cents || 0) / 100
        });
        setPricingInput({
          ttsPricePerMin: String((globalPricing.conversa.tts_price_per_minute_cents || 0) / 100),
          sttPricePerMin: String((globalPricing.conversa.stt_price_per_minute_cents || 0) / 100),
          automationPrice: String((globalPricing.conversa.automation_price_cents || 0) / 100),
          premiumVoiceSurcharge: String((globalPricing.conversa.premium_voice_surcharge_cents || 0) / 100)
        });
      }
    }
  }, [isOpen, globalPricing]);

  // Sync numeric state when string input changes (for arrow key support)
  useEffect(() => {
    const parseAndSet = (value: string) => {
      const num = parseFloat(value);
      return Number.isNaN(num) ? 0 : Math.max(0, num);
    };
    
    setPricing({
      ttsPricePerMin: parseAndSet(pricingInput.ttsPricePerMin),
      sttPricePerMin: parseAndSet(pricingInput.sttPricePerMin),
      automationPrice: parseAndSet(pricingInput.automationPrice),
      premiumVoiceSurcharge: parseAndSet(pricingInput.premiumVoiceSurcharge)
    });
  }, [pricingInput]);

  const handleBotTypeChange = (newBotType: string) => {
    setSelectedBotType(newBotType);
    
    // Load pricing for the selected bot type
    if (globalPricing) {
      const currentPricing = globalPricing[newBotType as keyof typeof globalPricing];
      if (currentPricing) {
        setPricing({
          ttsPricePerMin: (currentPricing.tts_price_per_minute_cents || 0) / 100,
          sttPricePerMin: (currentPricing.stt_price_per_minute_cents || 0) / 100,
          automationPrice: (currentPricing.automation_price_cents || 0) / 100,
          premiumVoiceSurcharge: (currentPricing.premium_voice_surcharge_cents || 0) / 100
        });
        setPricingInput({
          ttsPricePerMin: String((currentPricing.tts_price_per_minute_cents || 0) / 100),
          sttPricePerMin: String((currentPricing.stt_price_per_minute_cents || 0) / 100),
          automationPrice: String((currentPricing.automation_price_cents || 0) / 100),
          premiumVoiceSurcharge: String((currentPricing.premium_voice_surcharge_cents || 0) / 100)
        });
      }
    }
  };

  const handlePricingChange = (field: string, value: number) => {
    setPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReviewImpact = () => {
    const pricingData = {
      botType: selectedBotType,
      tts_price_per_minute_cents: Math.round(pricing.ttsPricePerMin * 100),
      stt_price_per_minute_cents: Math.round(pricing.sttPricePerMin * 100),
      automation_price_cents: Math.round(pricing.automationPrice * 100),
      premium_voice_surcharge_cents: Math.round(pricing.premiumVoiceSurcharge * 100)
    };
    onReviewImpact(pricingData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl min-h-fit">
        <DialogHeader>
          <DialogTitle>Edit Global Pricing</DialogTitle>
          <DialogDescription>
            Update platform-wide pricing rates for all users.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading pricing data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bot Type</Label>
              <RadioGroup value={selectedBotType} onValueChange={handleBotTypeChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conversa" id="global-conversa" />
                  <Label htmlFor="global-conversa" className="flex-1">
                    Conversa
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="empath" id="global-empath" />
                  <Label htmlFor="global-empath" className="flex-1">
                    Empath
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Pricing Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>TTS Price per Minute ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={pricingInput.ttsPricePerMin}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setPricingInput((pi) => ({ ...pi, ttsPricePerMin: v }));
                      }
                    }}
                    placeholder="0.000"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(pricingInput.ttsPricePerMin);
                      setPricingInput((pi) => ({ ...pi, ttsPricePerMin: normalized }));
                      handlePricingChange('ttsPricePerMin', parseFloat(normalized));
                    }}
                  />
                </div>
                <div>
                  <Label>STT Price per Minute ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={pricingInput.sttPricePerMin}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setPricingInput((pi) => ({ ...pi, sttPricePerMin: v }));
                      }
                    }}
                    placeholder="0.000"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(pricingInput.sttPricePerMin);
                      setPricingInput((pi) => ({ ...pi, sttPricePerMin: normalized }));
                      handlePricingChange('sttPricePerMin', parseFloat(normalized));
                    }}
                  />
                </div>
                <div>
                  <Label>Automation Price per Unit ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={pricingInput.automationPrice}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setPricingInput((pi) => ({ ...pi, automationPrice: v }));
                      }
                    }}
                    placeholder="0.00"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(pricingInput.automationPrice);
                      setPricingInput((pi) => ({ ...pi, automationPrice: normalized }));
                      handlePricingChange('automationPrice', parseFloat(normalized));
                    }}
                  />
                </div>
                <div>
                  <Label>Premium Voice Surcharge per Minute ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={pricingInput.premiumVoiceSurcharge}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setPricingInput((pi) => ({ ...pi, premiumVoiceSurcharge: v }));
                      }
                    }}
                    placeholder="0.000"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(pricingInput.premiumVoiceSurcharge);
                      setPricingInput((pi) => ({ ...pi, premiumVoiceSurcharge: normalized }));
                      handlePricingChange('premiumVoiceSurcharge', parseFloat(normalized));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </Button>
          <Button 
            onClick={handleReviewImpact} 
            disabled={isSaving}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isSaving ? "Saving..." : "Review Impact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Global Review Impact Dialog Component
interface GlobalReviewImpactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  botType: string | null;
  oldPricing: any | null;
  newPricing: any | null;
  onConfirm: () => void;
  isSaving: boolean;
}

export const GlobalReviewImpactDialog: React.FC<GlobalReviewImpactDialogProps> = ({
  isOpen,
  onClose,
  botType,
  oldPricing,
  newPricing,
  onConfirm,
  isSaving
}) => {
  if (!isOpen || !botType || !oldPricing || !newPricing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl min-h-fit">
        <DialogHeader>
          <DialogTitle>Review Impact - Global Pricing ({botType})</DialogTitle>
          <DialogDescription>
            Review the changes to global pricing before applying them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Current Global Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>TTS Price per Minute:</span>
                    <span>${(oldPricing.tts_price_per_minute_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT Price per Minute:</span>
                    <span>${(oldPricing.stt_price_per_minute_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Automation Price per Unit:</span>
                    <span>${(oldPricing.automation_price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Voice Surcharge:</span>
                    <span>${(oldPricing.premium_voice_surcharge_cents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">New Global Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>TTS Price per Minute:</span>
                    <span>${(newPricing.tts_price_per_minute_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT Price per Minute:</span>
                    <span>${(newPricing.stt_price_per_minute_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Automation Price per Unit:</span>
                    <span>${(newPricing.automation_price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Voice Surcharge:</span>
                    <span>${(newPricing.premium_voice_surcharge_cents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium">Impact on All Users</p>
                <p>This change will affect all users using {botType} pricing. Users with custom pricing will not be affected.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isSaving}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isSaving ? "Saving..." : "Confirm Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SimulatePricingDialog: React.FC<SimulatePricingDialogProps> = ({
  isOpen,
  onClose,
  user,
  botType,
  pricingData,
  globalPricing,
  isLoading
}) => {
  const [selectedBotType, setSelectedBotType] = useState<string | null>(null);
  const [usageInputs, setUsageInputs] = useState({
    minutesTTS: 0,
    minutesSTT: 0,
    premiumMinutes: 0,
    automations: 0
  });
  const [usageInputStr, setUsageInputStr] = useState({
    minutesTTS: "",
    minutesSTT: "",
    premiumMinutes: "",
    automations: ""
  });

  const clampToTwoDecimalsNonNegative = (value: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    const nonNegative = Math.max(0, value);
    return Math.round(nonNegative * 100) / 100;
  };

  useEffect(() => {
    if (isOpen && user && botType) {
      setSelectedBotType(botType);
    }
  }, [isOpen, user, botType]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedBotType(null);
      setUsageInputs({
        minutesTTS: 0,
        minutesSTT: 0,
        premiumMinutes: 0,
        automations: 0
      });
    }
  }, [isOpen]);

  const handleBotTypeChange = (newBotType: string) => {
    setSelectedBotType(newBotType);
  };

  const handleUsageChange = (field: string, value: number) => {
    setUsageInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const allowTwoDecimalsRegex = /^\d*(\.\d{0,2})?$/;
  const normalizeTwoDecimalsString = (s: string) => {
    const n = parseFloat(s);
    if (Number.isNaN(n)) return "0.00";
    return (Math.round(Math.max(0, n) * 100) / 100).toFixed(2);
  };

  // Sync numeric state when string input changes (for arrow key support)
  useEffect(() => {
    const parseAndSet = (value: string) => {
      const num = parseFloat(value);
      return Number.isNaN(num) ? 0 : Math.max(0, num);
    };
    
    setUsageInputs({
      minutesTTS: parseAndSet(usageInputStr.minutesTTS),
      minutesSTT: parseAndSet(usageInputStr.minutesSTT),
      premiumMinutes: parseAndSet(usageInputStr.premiumMinutes),
      automations: Math.max(0, Math.round(parseFloat(usageInputStr.automations) || 0))
    });
  }, [usageInputStr]);

  const calculateInvoice = (pricing: any, usage: any) => {
    const tts = usage.minutesTTS * (pricing.tts_price_per_minute_cents / 100);
    const stt = usage.minutesSTT * (pricing.stt_price_per_minute_cents / 100);
    const premium = usage.premiumMinutes * (pricing.premium_voice_surcharge_cents / 100);
    const automations = usage.automations * (pricing.automation_price_cents / 100);
    const total = Number((tts + stt + premium + automations).toFixed(2));

    return { tts, stt, premium, automations, total };
  };

  if (!user || !selectedBotType) return null;

  const currentPricing = pricingData?.[selectedBotType as keyof typeof pricingData];
  const isCustomPricing = currentPricing?.pricing_type === "custom";
  const globalPricingForBot = globalPricing?.[selectedBotType as keyof typeof globalPricing];
  const effectivePricing = isCustomPricing ? currentPricing : globalPricingForBot;

  const pricingForCalculation = effectivePricing || currentPricing || globalPricingForBot;
  const invoice = pricingForCalculation ? calculateInvoice(pricingForCalculation, usageInputs) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl min-h-fit">
        <DialogHeader>
          <DialogTitle>Simulate Pricing - {user.company}</DialogTitle>
          <DialogDescription>
            Simulate invoice costs based on usage inputs for this account.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 ">
            <div className="text-sm text-gray-500">Loading pricing data...</div>
          </div>
        ) : (
          <div className="space-y-6 ">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bot Type</Label>
              <RadioGroup value={selectedBotType || ""} onValueChange={handleBotTypeChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conversa" id="sim-conversa" />
                  <Label htmlFor="sim-conversa" className="flex-1">
                    Conversa {pricingData?.conversa?.pricing_type === "custom" ? "(Custom)" : "(Global)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="empath" id="sim-empath" />
                  <Label htmlFor="sim-empath" className="flex-1">
                    Empath {pricingData?.empath?.pricing_type === "custom" ? "(Custom)" : "(Global)"}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Usage Inputs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>TTS Minutes</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={usageInputStr.minutesTTS}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setUsageInputStr((us) => ({ ...us, minutesTTS: v }));
                      }
                    }}
                    placeholder="0"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(usageInputStr.minutesTTS);
                      setUsageInputStr((us) => ({ ...us, minutesTTS: normalized }));
                      handleUsageChange('minutesTTS', parseFloat(normalized));
                    }}
                  />
                </div>
                <div>
                  <Label>STT Minutes</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={usageInputStr.minutesSTT}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setUsageInputStr((us) => ({ ...us, minutesSTT: v }));
                      }
                    }}
                    placeholder="0"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(usageInputStr.minutesSTT);
                      setUsageInputStr((us) => ({ ...us, minutesSTT: normalized }));
                      handleUsageChange('minutesSTT', parseFloat(normalized));
                    }}
                  />
                </div>
                <div>
                  <Label>Premium Minutes</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    inputMode="decimal"
                    pattern="^\\d+(\\.\\d{0,2})?$"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={usageInputStr.premiumMinutes}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || allowTwoDecimalsRegex.test(v)) {
                        setUsageInputStr((us) => ({ ...us, premiumMinutes: v }));
                      }
                    }}
                    placeholder="0"
                    onBlur={() => {
                      const normalized = normalizeTwoDecimalsString(usageInputStr.premiumMinutes);
                      setUsageInputStr((us) => ({ ...us, premiumMinutes: normalized }));
                      handleUsageChange('premiumMinutes', parseFloat(normalized));
                    }}
                  />
                </div>
                <div>
                  <Label>Automations</Label>
                  <Input
                    type="number"
                    step="1"
                    min={0}
                    inputMode="numeric"
                    pattern="^\\d+$"
                    onKeyDown={(e) => {
                      if (["e", "E", ".", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    value={usageInputStr.automations}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || /^\d*$/.test(v)) {
                        setUsageInputStr((us) => ({ ...us, automations: v }));
                      }
                    }}
                    placeholder="0"
                    onBlur={() => {
                      const normalized = String(Math.max(0, Math.round(Number(usageInputStr.automations) || 0)));
                      setUsageInputStr((us) => ({ ...us, automations: normalized }));
                      handleUsageChange('automations', Number(normalized));
                    }}
                  />
                </div>
              </div>
            </div>

            {(effectivePricing || currentPricing || globalPricingForBot) ? (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Invoice Breakdown</h4>
                {invoice ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          TTS ({usageInputs.minutesTTS} min) 
                          <span className="text-gray-500 ml-1">
                            ${((pricingForCalculation?.tts_price_per_minute_cents || 0) / 100).toFixed(2)}/min
                          </span>
                        </span>
                        <span>${invoice.tts.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          STT ({usageInputs.minutesSTT} min)
                          <span className="text-gray-500 ml-1">
                            ${((pricingForCalculation?.stt_price_per_minute_cents || 0) / 100).toFixed(2)}/min
                          </span>
                        </span>
                        <span>${invoice.stt.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Premium ({usageInputs.premiumMinutes} min)
                          <span className="text-gray-500 ml-1">
                            ${((pricingForCalculation?.premium_voice_surcharge_cents || 0) / 100).toFixed(2)}/min
                          </span>
                        </span>
                        <span>${invoice.premium.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Automations ({usageInputs.automations} auto)
                          <span className="text-gray-500 ml-1">
                            ${((pricingForCalculation?.automation_price_cents || 0) / 100).toFixed(2)}/auto
                          </span>
                        </span>
                        <span>${invoice.automations.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total:</span>
                        <span>${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Enter usage values above to see invoice breakdown
                    </p>
                  </div>
                )}
                
                <div key={`pricing-type-${selectedBotType}`} className="text-xs text-gray-500 dark:text-gray-400">
                  Using {currentPricing?.pricing_type === "custom" ? 'custom' : 'global'} pricing for {selectedBotType}
                  {currentPricing && (
                    <span className="ml-2 text-gray-400">
                      (Type: {currentPricing.pricing_type})
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  No pricing data available for {selectedBotType}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
