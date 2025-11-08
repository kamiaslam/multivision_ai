"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Badge from "@/components/Badge";
import { usePhoneNumbers, PhoneNumber } from "@/hooks/usePhoneNumbers";
import DeleteModal from "@/components/DeleteModal";
import DropdownMenu from "@/components/DropdownMenu";
import ImportPhoneNumberModal from "@/components/ImportPhoneNumberModal";

const PhoneNumbersPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [phoneToDelete, setPhoneToDelete] = useState<PhoneNumber | null>(null);
    
    const {
        phoneNumbers,
        loading,
        error,
        getPhoneNumbers,
        refreshPhoneNumbers,
        clearError,
        deletePhoneNumber,
        importPhoneNumber
    } = usePhoneNumbers();

    // Load phone numbers on component mount
    useEffect(() => {
        getPhoneNumbers();
    }, [getPhoneNumbers]);

    // Filter phone numbers based on search term
    const filteredPhoneNumbers = phoneNumbers.filter(phone => 
        phone.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.agent?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImportClick = () => {
        setIsImportModalOpen(true);
    };

    const handleImport = async (data: {
        twilio_account_sid: string;
        twilio_auth_token: string;
        phone_number: string;
        label: string;
        import_type: string;
    }) => {
        try {
            await importPhoneNumber(data);
            setIsImportModalOpen(false);
            // Refresh the list
            await refreshPhoneNumbers();
        } catch (error) {
            console.error('Import failed:', error);
            throw error; // Re-throw to let the modal handle the error
        }
    };

    const handlePhoneNumberClick = (phone: PhoneNumber) => {
        router.push(`/phone-numbers/${phone.id}`);
    };

    const handleDeleteClick = (phone: PhoneNumber) => {
        setPhoneToDelete(phone);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!phoneToDelete) return;
        
        try {
            await deletePhoneNumber(phoneToDelete.id);
            setIsDeleteModalOpen(false);
            setPhoneToDelete(null);
        } catch (error) {
            console.error('Failed to delete phone number:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setPhoneToDelete(null);
    };

    return (
        <Layout title="Phone Numbers">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-t-primary mb-1">
                            Phone Numbers
                        </h1>
                        <p className="text-sm text-t-secondary">
                            Manage your imported Twilio phone numbers and assign them to agents.
                        </p>
                    </div>
                    <Button onClick={handleImportClick}>
                        <Icon name="plus" className="w-4 h-4 mr-2" />
                        Import Phone Number
                    </Button>
                </div>

                {/* Search and Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <Search
                            className="w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search phone numbers..."
                        isGray
                    />
                        {phoneNumbers.length > 0 && (
                            <div className="text-sm text-t-secondary">
                                {filteredPhoneNumbers.length} of {phoneNumbers.length} phone numbers
                                </div>
                        )}
                    </div>
                    <Button 
                        isStroke 
                        onClick={() => refreshPhoneNumbers()}
                        disabled={loading}
                    >
                        <Icon name="refresh" className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    </div>

                {/* Error Display */}
                {error && (
                    <Card className="p-4 border-red-200 bg-red-50">
                        <div className="flex items-center gap-2">
                            <Icon name="warning" className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-red-700">{error}</span>
                            <Button 
                                isStroke 
                                onClick={clearError}
                                className="ml-auto"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Phone Numbers List */}
                {loading ? (
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                                                <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                                                <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : filteredPhoneNumbers.length === 0 ? (
                    <Card className="p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-b-surface1 flex items-center justify-center">
                                <Icon name="phone" className="w-8 h-8 text-t-secondary" />
                            </div>
                            <h3 className="text-lg font-medium text-t-primary mb-2">
                                {phoneNumbers.length === 0 ? 'No phone numbers yet' : 'No matching phone numbers'}
                            </h3>
                            <p className="text-sm text-t-secondary mb-6 max-w-md mx-auto">
                                {phoneNumbers.length === 0 
                                    ? 'Import your first phone number from Twilio to get started with voice AI calls.'
                                    : 'Try adjusting your search terms to find the phone number you\'re looking for.'
                                }
                            </p>
                            {phoneNumbers.length === 0 && (
                                <Button onClick={handleImportClick}>
                                    <Icon name="plus" className="w-4 h-4 mr-2" />
                                    Import Phone Number
                            </Button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredPhoneNumbers.map((phone) => (
                            <div 
                                key={phone.id} 
                                className="cursor-pointer"
                                onClick={() => handlePhoneNumberClick(phone)}
                            >
                                <Card className="p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-01/10 flex items-center justify-center">
                                            <Icon name="phone" className="w-6 h-6 text-primary-01" />
                                        </div>
                                    <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-medium text-t-primary">
                                                    {phone.phone_number}
                                                </h3>
                                                <Badge 
                                                    variant={phone.is_active ? "success" : "secondary"}
                                                >
                                                    {phone.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                                {phone.agent ? (
                                                    <Badge variant="default">
                                                        Agent Assigned
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Unassigned
                                                    </Badge>
                                                )}
                                    </div>
                                            <p className="text-sm text-t-secondary">
                                                {phone.label || 'No label assigned'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <button className="w-8 h-8 p-1 border rounded-full border-s-stroke2 hover:bg-b-surface1 hover:text-primary-01 flex items-center justify-center transition-colors">
                                                <Icon name="edit" className="w-4 h-4" />
                                            </button>
                                            <DropdownMenu
                                                items={[
                                                    {
                                                        icon: "trash",
                                                        label: "Delete",
                                                        onClick: () => handleDeleteClick(phone),
                                                        className: "text-red-500 hover:text-red-700"
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </Card>
                            </div>
                        ))}
                                </div>
                )}

                {/* Import Modal */}
                <ImportPhoneNumberModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleImport}
                    loading={loading}
                />

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    itemName={phoneToDelete?.phone_number || ""}
                    itemType="phone number"
                    agentName={phoneToDelete?.agent?.name}
                />
            </div>
        </Layout>
    );
};

export default PhoneNumbersPage;
