import { useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Badge from "@/components/Badge";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { VoiceClone } from "../types";

// Helper function to convert language codes to full language names
const getLanguageName = (languageCode: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'ru': 'Russian'
  };
  
  return languageMap[languageCode] || languageCode.toUpperCase();
};

// Helper functions for styling
const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'ready':
      return 'bg-green-500';
    case 'processing':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready':
      return 'bg-green-500 text-green-800';
    case 'processing':
      return 'bg-yellow-500 text-yellow-800';
    case 'failed':
      return 'bg-red-500 text-red-800';
    default:
      return 'bg-gray-500 text-gray-800';
  }
};

interface VoiceClonesListProps {
  voiceClones: VoiceClone[];
  loading: boolean;
  searchTerm: string;
  onCreateVoiceClone: () => void;
  onEditVoiceClone: (voiceClone: VoiceClone) => void;
  onDeleteVoiceClone: (voiceCloneId: string | number) => void;
}

export const VoiceClonesList = ({
  voiceClones,
  loading,
  searchTerm,
  onCreateVoiceClone,
  onEditVoiceClone,
  onDeleteVoiceClone
}: VoiceClonesListProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [voiceCloneToDelete, setVoiceCloneToDelete] = useState<VoiceClone | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredVoiceClones = voiceClones.filter(voiceClone =>
    voiceClone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voiceClone.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (voiceClone: VoiceClone) => {
    setVoiceCloneToDelete(voiceClone);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!voiceCloneToDelete) return;
    
    setIsDeleting(true);
    try {
      // Use provider_voice_id for deletion API
      const providerId = voiceCloneToDelete.provider_voice_id || voiceCloneToDelete.id;
      await onDeleteVoiceClone(providerId!);
      setShowDeleteModal(false);
      setVoiceCloneToDelete(null);
    } catch (error) {
      console.error('Error deleting voice clone:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVoiceCloneToDelete(null);
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="space-y-4">
          {/* Mobile Card Loading Skeleton */}
          <div className="block lg:hidden space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Loading Skeleton */}
          <div className="hidden lg:block">
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
                {/* Voice Name & Language */}
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
                
                {/* Success Rate */}
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
      </div>
    );
  }

  if (voiceClones.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <Icon name="volume_1" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Voice Clones Created Yet</h3>
          <p className="text-gray-500 mb-6">Create your first custom voice clone to get started</p>
          <Button onClick={onCreateVoiceClone}>
            <Icon name="plus" className="w-4 h-4 mr-2" />
            Create Your First Voice Clone
          </Button>
        </div>
      </div>
    );
  }

  if (filteredVoiceClones.length === 0 && searchTerm) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <Icon name="search" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
          <p className="text-gray-500 mb-6">No voice clones match your search for "{searchTerm}"</p>
          <Button onClick={onCreateVoiceClone}>
            <Icon name="plus" className="w-4 h-4 mr-2" />
            Create New Voice Clone
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Voice Clones Overview */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xl font-semibold text-t-primary">Your Voice Clones</h3>
          {/* Mobile Create Button */}
          <div className="block lg:hidden">
            <Button onClick={onCreateVoiceClone} className="gap-2">
              <Icon name="plus" className="w-4 h-4" />
              Create Voice Clone
            </Button>
          </div>
        </div>
        
        {/* Mobile Card Layout */}
        <div className="block lg:hidden space-y-4">
          {filteredVoiceClones.map((voiceClone) => (
            <div key={voiceClone.id} className="border bg-b-surface1 border-gray-200 rounded-lg p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 min-w-[25px] min-h-[25px] max-w-[25px] max-h-[25px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                    <Icon name="volume_1" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                  </div>
                  <div>
                    <p className="font-medium text-t-primary">{voiceClone.name}</p>
                    <p className="text-sm text-t-secondary">{getLanguageName(voiceClone.language || 'en')}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(voiceClone.status)}>
                  {voiceClone.status}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-t-secondary">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusBgColor(voiceClone.status)}`}></div>
                    <span className="text-sm font-medium capitalize">{voiceClone.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-t-secondary">Success Rate</p>
                  <p className="font-medium text-t-primary">
                    {voiceClone.success_rate || 0}%
                  </p>
                </div>
              </div>

              {/* Usage and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="text-sm text-t-secondary">Total Uses</p>
                  <p className="font-medium text-t-primary">
                    {voiceClone.total_uses || 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    isStroke 
                    className="h-1"
                    onClick={() => onEditVoiceClone(voiceClone)}
                  >
                    <Icon name="edit" className="w-4 h-4" />
                  </Button>
                  <Button 
                    isStroke 
                    className="h-1"
                    onClick={() => handleDeleteClick(voiceClone)}
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="text-caption text-t-tertiary/80 border-b border-s-subtle">
              <tr className="border-b border-s-stroke">
                <th className="text-left py-3 px-4 font-medium text-t-secondary w-70">Voice Name</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Success Rate</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoiceClones.map((voiceClone) => (
                <tr key={voiceClone.id} className="border-b border-s-subtle hover:bg-b-surface2 transition-colors">
                  <td className="py-4 px-4 w-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                        <Icon name="volume_1" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                      </div>
                      <div>
                        <p className="font-medium text-t-primary">{voiceClone.name}</p>
                        <p className="text-sm text-t-secondary">{getLanguageName(voiceClone.language || 'en')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusBgColor(voiceClone.status)}`} />
                      <span className="text-sm capitalize">
                        {voiceClone.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-t-primary">{voiceClone.success_rate || 0}%</span>
                      <span className="text-sm text-t-secondary">({voiceClone.total_uses || 0} uses)</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button 
                        isStroke 
                        className="h-1"
                        onClick={() => onEditVoiceClone(voiceClone)}
                      >
                        <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                      </Button>
                      <Button 
                        isStroke 
                        className="p-2 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(voiceClone)}
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
      {voiceClones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">
                  {searchTerm ? 'Filtered Voices' : 'Total Voices'}
                </p>
                <p className="text-2xl font-bold text-t-primary">{filteredVoiceClones.length}</p>
              </div>
              <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                <Icon name="volume_1" className="inline-flex size-6 fill-t-secondary transition-colors duration-200 fill-t-primary" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Ready Voices</p>
                <p className="text-2xl font-bold text-primary-02">
                  {filteredVoiceClones.filter(v => v.status === 'ready').length}
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
                <p className="text-sm font-medium text-t-secondary">Avg Success Rate</p>
                <p className="text-2xl font-bold text-t-primary">
                  {filteredVoiceClones.length > 0 ? Math.round(filteredVoiceClones.reduce((sum, v) => sum + (v.success_rate || 0), 0) / filteredVoiceClones.length) : 0}%
                </p>
              </div>
              <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                <Icon name="chart" className="inline-flex size-6 fill-t-secondary transition-colors duration-200 fill-t-primary" />
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
        title="Delete Voice Clone"
        message={`Are you sure you want to delete "${voiceCloneToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
