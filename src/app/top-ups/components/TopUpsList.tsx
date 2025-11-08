import { useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { TopUp } from "../types";

interface TopUpsListProps {
  topUps: TopUp[];
  loading: boolean;
  searchTerm: string;
  onCreateTopUp: () => void;
  onEditTopUp: (topUp: TopUp) => void;
  onDeleteTopUp: (topUpId: string | number) => void;
}

export const TopUpsList = ({
  topUps,
  loading,
  searchTerm,
  onCreateTopUp,
  onEditTopUp,
  onDeleteTopUp
}: TopUpsListProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topUpToDelete, setTopUpToDelete] = useState<TopUp | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTopUps = topUps.filter(topUp =>
    topUp.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topUp.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topUp.amount.toString().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (topUp: TopUp) => {
    setTopUpToDelete(topUp);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!topUpToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDeleteTopUp(topUpToDelete.id!);
      setShowDeleteModal(false);
      setTopUpToDelete(null);
    } catch (error) {
      console.error('Error deleting top up:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTopUpToDelete(null);
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="space-y-4">
          {/* Skeleton Table Header */}
          <div className="flex gap-4 pb-3 border-b border-s-subtle w-full">
            <div className="w-100 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-60 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-30 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-30 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Skeleton Table Rows */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-4 py-4 border-b border-s-subtle">
              {/* Amount & Payment Method */}
              <div className="w-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Status */}
              <div className="w-60 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Transaction ID */}
              <div className="w-30 space-y-1">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Actions */}
              <div className="w-30 flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topUps.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <Icon name="dollar" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Configurations Created Yet</h3>
          <p className="text-gray-500 mb-6">Configure your wallet and premium voice settings to get started</p>
          <Button onClick={onCreateTopUp}>
            <Icon name="plus" className="w-4 h-4 mr-2" />
            Configure Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Configurations Overview */}
      <div>
        <h3 className="text-xl font-semibold text-t-primary mb-4">Your Configurations</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-caption text-t-tertiary/80 border-b border-s-subtle">
              <tr className="border-b border-s-stroke">
                <th className="text-left py-3 px-4 font-medium text-t-secondary w-60">Type</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Details</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopUps.map((topUp) => (
                <tr key={topUp.id} className="border-b border-s-subtle hover:bg-b-surface2 transition-colors">
                  <td className="py-4 px-4 w-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                        <Icon name={topUp.payment_method === 'premium_voice' ? "volume-2" : "dollar"} className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                      </div>
                      <div>
                        <p className="font-medium text-t-primary">
                          {topUp.payment_method === 'premium_voice' ? 'Premium Voice' : 'Wallet Top Up'}
                        </p>
                        <p className="text-sm text-t-secondary">
                          {topUp.payment_method === 'premium_voice' ? 'Voice Enhancement' : formatAmount(topUp.amount)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        topUp.status === 'completed' ? 'bg-green-500' : 
                        topUp.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm capitalize">
                        {topUp.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-t-secondary">
                      {topUp.payment_method === 'premium_voice' ? 
                        `Surcharge: ${topUp.amount || 0} cents/min` : 
                        (topUp.transaction_id || 'N/A')
                      }
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button 
                        isStroke 
                        className="h-1"
                        onClick={() => onEditTopUp(topUp)}
                      >
                        <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                      </Button>
                      <Button 
                        isStroke 
                        className="p-2 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(topUp)}
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      {topUps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Total Configurations</p>
                <p className="text-2xl font-bold text-t-primary">{topUps.length}</p>
              </div>
              <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                <Icon name="settings" className="inline-flex size-6 fill-t-secondary transition-colors duration-200 fill-t-primary" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Active</p>
                <p className="text-2xl font-bold text-primary-02">
                  {topUps.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                <Icon name="check-circle" className="inline-flex size-6 fill-t-secondary transition-colors duration-200 fill-t-primary" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Premium Voices</p>
                <p className="text-2xl font-bold text-t-primary">
                  {topUps.filter(t => t.payment_method === 'premium_voice').length}
                </p>
              </div>
              <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                <Icon name="volume-2" className="inline-flex size-6 fill-t-secondary transition-colors duration-200 fill-t-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Configuration"
        message={`Are you sure you want to delete this ${topUpToDelete?.payment_method === 'premium_voice' ? 'premium voice' : 'wallet'} configuration? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
