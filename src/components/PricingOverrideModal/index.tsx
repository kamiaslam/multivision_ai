import React from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Switch from '@/components/Switch';

interface PricingOverrideModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName: string;
    pricing: {
        enableOverride: boolean;
        conversa: number;
        empath: number;
        automationsPack: number;
        premiumVoiceSurcharge: number;
    };
    onPricingChange: (pricing: any) => void;
}

const PricingOverrideModal: React.FC<PricingOverrideModalProps> = ({ 
    isOpen, 
    onClose, 
    companyName, 
    pricing, 
    onPricingChange 
}) => {
    const handleInputChange = (field: string, value: string | boolean) => {
        onPricingChange({
            ...pricing,
            [field]: typeof value === 'boolean' ? value : parseFloat(value) || 0
        });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-t-primary">Account Pricing Override</h2>
                </div>
                
                <div className="text-sm text-t-secondary mb-6">{companyName}</div>
                
                {/* Enable Override Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-t-primary">Enable override</label>
                        <Switch
                            checked={pricing.enableOverride}
                            onChange={(checked) => handleInputChange('enableOverride', checked)}
                        />
                    </div>
                    <p className="text-xs text-t-secondary">If disabled, this account inherits global pricing.</p>
                </div>
                
                {/* Pricing Input Fields */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Conversa, $/min</label>
                        <input
                            type="number"
                            step="0.01"
                            value={pricing.conversa}
                            onChange={(e) => handleInputChange('conversa', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                            disabled={!pricing.enableOverride}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Empath, $/min</label>
                        <input
                            type="number"
                            step="0.01"
                            value={pricing.empath}
                            onChange={(e) => handleInputChange('empath', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                            disabled={!pricing.enableOverride}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Automations pack (10k)</label>
                        <input
                            type="number"
                            step="1"
                            value={pricing.automationsPack}
                            onChange={(e) => handleInputChange('automationsPack', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                            disabled={!pricing.enableOverride}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Premium voice surcharge, $/min</label>
                        <input
                            type="number"
                            step="0.001"
                            value={pricing.premiumVoiceSurcharge}
                            onChange={(e) => handleInputChange('premiumVoiceSurcharge', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                            disabled={!pricing.enableOverride}
                        />
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button isStroke onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>
                        Review Impact
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PricingOverrideModal;
