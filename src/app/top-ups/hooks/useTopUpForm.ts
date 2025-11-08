import { useState, useCallback } from 'react';
import { FormData } from '../types';

export const useTopUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    amount: 500, // Default 500 cents ($5.00)
    payment_method: 'stripe',
    description: ''
  });

  const resetForm = useCallback(() => {
    setFormData({
      amount: 500,
      payment_method: 'stripe',
      description: ''
    });
  }, []);

  const populateForm = useCallback((topUp: any) => {
    setFormData({
      amount: topUp.amount || 500,
      payment_method: topUp.payment_method || 'stripe',
      description: topUp.description || ''
    });
  }, []);

  const validateForm = useCallback((): string | null => {
    if (!formData.amount || formData.amount <= 0) {
      return 'Amount must be greater than 0';
    }
    if (formData.amount < 100) {
      return 'Minimum top up amount is $1.00 (100 cents)';
    }
    if (!formData.payment_method) {
      return 'Payment method is required';
    }
    return null;
  }, [formData]);

  return {
    formData,
    setFormData,
    resetForm,
    populateForm,
    validateForm
  };
};
