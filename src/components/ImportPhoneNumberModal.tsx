import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Icon from './Icon';
import Field from './Field';
import Select from './Select';

interface ImportPhoneNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: {
        twilio_account_sid: string;
        twilio_auth_token: string;
        phone_number: string;
        label: string;
        import_type: string;
    }) => Promise<void>;
    loading?: boolean;
}

const ImportPhoneNumberModal: React.FC<ImportPhoneNumberModalProps> = ({
    isOpen,
    onClose,
    onImport,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        twilio_account_sid: '',
        twilio_auth_token: '',
        phone_number: '',
        label: '',
        import_type: 'inbound'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.twilio_account_sid.trim()) {
            newErrors.twilio_account_sid = 'Twilio Account SID is required';
        }

        if (!formData.twilio_auth_token.trim()) {
            newErrors.twilio_auth_token = 'Twilio Auth Token is required';
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        }

        if (!formData.label.trim()) {
            newErrors.label = 'Label is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onImport(formData);
            // Reset form on success
            setFormData({
                twilio_account_sid: '',
                twilio_auth_token: '',
                phone_number: '',
                label: '',
                import_type: 'inbound'
            });
            setErrors({});
        } catch (error) {
            console.error('Import failed:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            twilio_account_sid: '',
            twilio_auth_token: '',
            phone_number: '',
            label: '',
            import_type: 'inbound'
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg mx-4">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary-01/10 flex items-center justify-center">
                            <Icon name="phone" className="w-5 h-5 text-primary-01" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-t-primary">
                                Import Phone Number
                            </h3>
                            <p className="text-sm text-t-secondary">
                                Import a phone number from your Twilio account
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Field
                                label="Twilio Account SID"
                                placeholder="Enter your Twilio Account SID"
                                value={formData.twilio_account_sid}
                                onChange={(e) => handleInputChange('twilio_account_sid', e.target.value)}
                                required
                            />
                            {errors.twilio_account_sid && (
                                <p className="text-red-500 text-sm mt-1">{errors.twilio_account_sid}</p>
                            )}
                        </div>

                        <div>
                            <Field
                                label="Twilio Auth Token"
                                type="password"
                                placeholder="Enter your Twilio Auth Token"
                                value={formData.twilio_auth_token}
                                onChange={(e) => handleInputChange('twilio_auth_token', e.target.value)}
                                required
                            />
                            {errors.twilio_auth_token && (
                                <p className="text-red-500 text-sm mt-1">{errors.twilio_auth_token}</p>
                            )}
                        </div>

                        <div>
                            <Field
                                label="Phone Number"
                                placeholder="Enter the phone number to import (e.g., +1234567890)"
                                value={formData.phone_number}
                                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                required
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                            )}
                        </div>

                        <div>
                            <Field
                                label="Phone Number Label"
                                placeholder="Enter a name for this phone number"
                                value={formData.label}
                                onChange={(e) => handleInputChange('label', e.target.value)}
                                required
                            />
                            {errors.label && (
                                <p className="text-red-500 text-sm mt-1">{errors.label}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-t-primary mb-2">
                                Import Type
                            </label>
                            <Select
                                value={
                                    formData.import_type === 'inbound' 
                                        ? { id: 1, name: 'Inbound (Receive Calls)', code: 'inbound' }
                                        : { id: 2, name: 'Outbound (Make Calls)', code: 'outbound' }
                                }
                                onChange={(option) => handleInputChange('import_type', option.code || 'inbound')}
                                options={[
                                    { id: 1, name: 'Inbound (Receive Calls)', code: 'inbound' },
                                    { id: 2, name: 'Outbound (Make Calls)', code: 'outbound' }
                                ]}
                                placeholder="Select import type"
                            />
                            <p className="text-xs text-t-secondary mt-1">
                                Choose whether this number will be used for receiving calls (inbound) or making calls (outbound)
                            </p>
                        </div>

                        <div className="bg-b-surface1 border border-b-surface1/20 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Icon name="info" className="w-4 h-4 text-t-primary mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-t-primary font-bold mb-1">
                                        How to find your Twilio credentials
                                    </p>
                                    <p className="text-t-primary">
                                        You can find your Account SID and Auth Token in your Twilio Console dashboard. 
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button 
                                type="button"
                                isStroke 
                                onClick={handleClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="plus" className="w-4 h-4 mr-2" />
                                        Import
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default ImportPhoneNumberModal;
