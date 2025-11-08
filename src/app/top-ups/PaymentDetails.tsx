import { useState, useEffect } from "react";
import Field from "@/components/Field";
import Button from "@/components/Button";
import { FormData } from "./types";
import { WalletData } from "@/context/financeContext";
import { useFinance } from "@/context/financeContext";
import { toast } from "sonner";

interface PaymentDetailsProps {
  formData: FormData;
  setFormData: (updater: React.SetStateAction<FormData>) => void;
  walletInfo: WalletData | null;
  walletLoading: boolean;
  onWalletUpdate: () => void;
}

const PaymentDetails = ({ formData, setFormData, walletInfo, walletLoading, onWalletUpdate }: PaymentDetailsProps) => {
  const { purchasePremiumVoice } = useFinance();
  const [loading, setLoading] = useState<"pv" | null>(null);

  const handlePremiumVoice = async () => {
    setLoading("pv");
    try {
      await purchasePremiumVoice();
      toast.success("Premium voice surcharge enabled.");
      onWalletUpdate();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to purchase premium voice";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-t-primary mb-4">Premium Voices</h3>
        <p className="text-sm text-t-secondary mb-6">
          Enable premium voices and manage voice surcharge settings for enhanced voice quality.
        </p>
      </div>

      <div className="space-y-6">
        {/* Premium Voice Card */}
        <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-t-primary">Premium Voices</h4>
              <p className="text-sm text-t-secondary">Enable premium voices ($0.01–$0.02/min)</p>
            </div>
            <Button 
              className="btn-theme-gradient" 
              onClick={handlePremiumVoice} 
              disabled={loading === "pv"}
            >
              {loading === "pv" ? "Processing..." : "Enable"}
            </Button>
          </div>
        </div>


        {/* Current Settings Display */}
        {walletInfo && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Current Settings</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Premium Voice Surcharge:</span>
                <span className="font-semibold">{walletInfo.premium_voice_surcharge_cents || 0} cents/min</span>
              </div>
              <div className="flex justify-between">
                <span>Premium Voice Enabled:</span>
                <span className="font-semibold">{walletInfo.premium_voice_surcharge_cents > 0 ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Information Notice */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">Premium Voice Information</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Premium voices offer enhanced quality and naturalness</li>
            <li>• Surcharge applies per minute of voice generation</li>
            <li>• You can adjust the surcharge amount anytime</li>
            <li>• Changes take effect immediately for new voice generations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
