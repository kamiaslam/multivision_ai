import React from 'react';
import Card from './Card';
import Button from './Button';
import Icon from './Icon';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: string;
    agentName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    agentName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Icon name="warning" className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-t-primary">
                                Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                            </h3>
                            <p className="text-sm text-t-secondary">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-sm text-t-primary mb-3">
                            Are you sure you want to delete <strong>{itemName}</strong>?
                        </p>
                        
                        {agentName && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                <div className="flex items-start gap-2">
                                    <Icon name="info" className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="text-yellow-800 font-medium mb-1">
                                            Agent Assignment
                                        </p>
                                        <p className="text-yellow-700">
                                            This {itemType} is currently assigned to <strong>{agentName}</strong>. 
                                            Deleting it will automatically unassign the agent from this {itemType}.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!agentName && 
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                            <Icon name="info" className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                            <p className="text-yellow-800 font-medium mb-1">
                            What happens next?
                                    </p>
                                    <p className="text-yellow-700">
                                    The {itemType} will be removed from your account
                                    </p>
                                </div>
                            </div>
                        </div>}
                    </div>
                    
                    <div className="flex gap-3">
                        <Button 
                            isStroke 
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Icon name="trash" className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DeleteModal;
