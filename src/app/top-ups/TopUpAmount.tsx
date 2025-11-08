import { useState, useEffect } from "react";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { FormData } from "./types";
import { FreeAllowanceInfo, WalletData } from "@/context/financeContext";
import { useFinance } from "@/context/financeContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TopUpAmountProps {
  formData: FormData;
  setFormData: (updater: React.SetStateAction<FormData>) => void;
  walletInfo: WalletData | null;
  freeAllowance: FreeAllowanceInfo | null;
  walletLoading: boolean;
  onWalletUpdate: () => void;
}

const amountOptions = [
  { id: 500, name: "$5.00 (500 cents)" },
  { id: 1000, name: "$10.00 (1000 cents)" },
  { id: 2500, name: "$25.00 (2500 cents)" },
  { id: 5000, name: "$50.00 (5000 cents)" },
  { id: 10000, name: "$100.00 (10000 cents)" },
  { id: 25000, name: "$250.00 (25000 cents)" },
  { id: 50000, name: "$500.00 (50000 cents)" },
];

const TopUpAmount = ({ formData, setFormData, walletInfo, freeAllowance, walletLoading, onWalletUpdate }: TopUpAmountProps) => {
  const { setPremiumSurcharge } = useFinance();
  const [topupAmount, setTopupAmount] = useState<number>(500); // cents
  const [surcharge, setSurcharge] = useState<number>(0);
  const [surchargeError, setSurchargeError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Update surcharge when wallet info changes
  useEffect(() => {
    if (walletInfo) {
      setSurcharge(walletInfo.premium_voice_surcharge_cents || 0);
    }
  }, [walletInfo]);

  const handleTopup = async () => {
    setLoading(true);
    try {
      // await topupWallet(topupAmount);
      toast.success("Wallet topped up");
      onWalletUpdate();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Top-up failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetSurcharge = async () => {
    if (surcharge < 0 || surcharge > 5) {
      setSurchargeError("Surcharge must be between 0 and 5 cents per minute");
      return;
    }
    
    setSurchargeError("");
    try {
      await setPremiumSurcharge(surcharge);
      toast.success("Premium surcharge updated");
      onWalletUpdate();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update surcharge";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-t-primary mb-4">Wallet</h3>
        <p className="text-sm text-t-secondary mb-6">
          Manage your wallet balance and add funds to your account.
        </p>
      </div>

      <div className="space-y-6">
        {/* Wallet Balance Display */}
        <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-t-primary">Current Balance</h4>
            <div className="text-sm text-t-secondary">
              Balance: {walletInfo !== null ? `$${(walletInfo.balance_cents/100).toFixed(2)}` : "—"}
            </div>
          </div>
        </div>
        
        {/* Free Allowances Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-t-secondary">Free Allowances</h3>
          
          {/* Minutes Allowance */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Minutes</span>
              <span className="text-xs text-t-secondary">
                {freeAllowance !== null ? `${Math.max(0, (freeAllowance.free_minutes_limit || 0) - (freeAllowance.free_minutes_used || 0))} remaining` : "—"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {freeAllowance !== null ? `${freeAllowance.free_minutes_used || 0}/${freeAllowance.free_minutes_limit || 0}` : "—"}
              </div>
              {freeAllowance !== null && (freeAllowance.free_minutes_limit || 0) > 0 && (freeAllowance.free_minutes_used || 0) >= (freeAllowance.free_minutes_limit || 0) && (
                <div className="text-xs text-red-500 font-medium">All used</div>
              )}
            </div>
          </div>
          
          {/* Automations Allowance */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Automations</span>
              <span className="text-xs text-t-secondary">
                {freeAllowance !== null ? `${Math.max(0, (freeAllowance.free_automations_limit || 0) - (freeAllowance.free_automations_used || 0))} remaining` : "—"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {freeAllowance !== null ? `${freeAllowance.free_automations_used || 0}/${freeAllowance.free_automations_limit || 0}` : "—"}
              </div>
              {freeAllowance !== null && (freeAllowance.free_automations_limit || 0) > 0 && (freeAllowance.free_automations_used || 0) >= (freeAllowance.free_automations_limit || 0) && (
                <div className="text-xs text-red-500 font-medium">All used</div>
              )}
            </div>
          </div>
          
          {/* No Allowances Message */}
          {freeAllowance !== null && 
           (freeAllowance.free_minutes_limit || 0) === 0 && 
           (freeAllowance.free_automations_limit || 0) === 0 && (
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-t-secondary">No free allowances available</div>
            </div>
          )}
        </div>
        
        {/* Top Up Section -- MOVED IT TO SEPARATE WALLET PAGE FOR NOW*/}
        {/* <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-t-primary">Add Funds</h4>
              <p className="text-sm text-t-secondary">Add money to your wallet balance</p>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Field
                  label="Amount (cents)"
                  type="number"
                  value={topupAmount.toString()}
                  onChange={(e) => setTopupAmount(parseInt(e.target.value||'0'))}
                  placeholder="Enter amount in cents"
                />
              </div>
              <Button className="w-30" onClick={handleTopup} disabled={loading}>
                {loading ? "Processing..." : "Top Up"}
              </Button>
            </div>
          </div>
        </div> */}

        <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
          <div className="space-y-4 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-t-primary">Add Funds</h4>
              <p className="text-sm text-t-secondary">Add money to your wallet balance</p>
            </div>
            <div className="items-end">
              <Button onClick={() => router.push('/wallet')} disabled={loading}>
                 Go to Wallet Top up
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-t-primary">Add Funds</h4>
              <p className="text-sm text-t-secondary">Add money to your wallet balance</p>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Field
                  label="Amount (cents)"
                  type="number"
                  value={topupAmount.toString()}
                  onChange={(e) => setTopupAmount(parseInt(e.target.value||'0'))}
                  placeholder="Enter amount in cents"
                />
              </div>
              <Button className="w-30" onClick={handleTopup} disabled={loading}>
                {loading ? "Processing..." : "Top Up"}
              </Button>
            </div>
          </div>
        </div> */}

        {/* Premium Surcharge Settings */}
        <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-t-primary">Premium Surcharge Settings</h4>
              <p className="text-sm text-t-secondary">Configure the premium voice surcharge per minute</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Field
                    label="Premium Surcharge (cents/min premium surcharge)"
                    type="number"
                    min={0}
                    max={5}
                    value={surcharge.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value || '0');
                      setSurcharge(value);
                      if (surchargeError) {
                        setSurchargeError("");
                      }
                    }}
                    placeholder="Enter surcharge in cents/min"
                  />
                </div>
                <Button className="w-30" onClick={handleSetSurcharge}>Set</Button>
              </div>
              {surchargeError && (
                <div className="text-red-500 text-sm">{surchargeError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpAmount;
