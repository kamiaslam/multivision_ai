"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/authContext";
import { VoiceClone, FormData } from "./types";
import { useVoiceClones } from "./hooks/useVoiceClones";
import { useVoiceCloneForm } from "./hooks/useVoiceCloneForm";
import { Sidebar } from "./components/Sidebar";
import { VoiceClonesList } from "./components/VoiceClonesList";
import { VoiceCloneForm } from "./components/VoiceCloneForm";
import { navigation } from "./constants";
import BasicInfo from "./BasicInfo";
import AudioUpload from "./AudioUpload";
import Loader from "@/components/Loader";

const VoiceClonePageContent = () => {
  const { token, user, isInitialized } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVoiceClone, setEditingVoiceClone] = useState<VoiceClone | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("VoiceClonePage - Mounted:", mounted);
    console.log("VoiceClonePage - Auth initialized:", isInitialized);
    console.log("VoiceClonePage - Token:", !!token);
    console.log("VoiceClonePage - User:", !!user);
  }, [mounted, isInitialized, token, user]);

  // Custom hooks
  const { voiceClones, loading, error, setError: originalSetError, loadVoiceClones, getVoiceClone, saveVoiceClone, deleteVoiceClone } = useVoiceClones(token || '');
  const { 
    formData, 
    setFormData: originalSetFormData, 
    resetForm, 
    populateForm, 
    validateForm 
  } = useVoiceCloneForm();

  // Wrapper for setFormData to prevent server-side rendering issues
  const setFormData = useCallback((updater: React.SetStateAction<FormData>) => {
    if (mounted) {
      originalSetFormData(updater);
    }
  }, [mounted, originalSetFormData]);

  // Wrapper for setError to prevent server-side rendering issues
  const setError = useCallback((error: string | null) => {
    if (mounted) {
      originalSetError(error);
    }
  }, [mounted, originalSetError]);

  // Wrapper for setSuccess to prevent server-side rendering issues
  const setSuccessMessage = useCallback((success: string | null) => {
    if (mounted) {
      setSuccess(success);
    }
  }, [mounted]);

  // Wrapper for setSearchTerm to prevent server-side rendering issues
  const setSearchTermSafe = useCallback((value: string) => {
    if (mounted) {
      setSearchTerm(value);
    }
  }, [mounted]);

  // Wrapper for setShowForm to prevent server-side rendering issues
  const setShowFormSafe = useCallback((value: boolean) => {
    if (mounted) {
      setShowForm(value);
    }
  }, [mounted]);


  // Wrapper for setEditingVoiceClone to prevent server-side rendering issues
  const setEditingVoiceCloneSafe = useCallback((value: VoiceClone | null) => {
    if (mounted) {
      setEditingVoiceClone(value);
    }
  }, [mounted]);

  // Wrapper for setActiveTab to prevent server-side rendering issues
  const setActiveTabSafe = useCallback((value: number) => {
    if (mounted) {
      setActiveTab(value);
    }
  }, [mounted]);

  // Wrapper for resetForm to prevent server-side rendering issues
  const resetFormSafe = useCallback(() => {
    if (mounted) {
      resetForm();
    }
  }, [mounted, resetForm]);

  // Wrapper for populateForm to prevent server-side rendering issues
  const populateFormSafe = useCallback((voiceClone: VoiceClone) => {
    if (mounted) {
      populateForm(voiceClone);
    }
  }, [mounted, populateForm]);

  // Wrapper for validateForm to prevent server-side rendering issues
  const validateFormSafe = useCallback(async (): Promise<string | null> => {
    if (mounted) {
      return await validateForm();
    }
    return null;
  }, [mounted, validateForm]);

  // Wrapper for loadVoiceClones to prevent server-side rendering issues
  const loadVoiceClonesSafe = useCallback(() => {
    if (mounted) {
      loadVoiceClones();
    }
  }, [mounted, loadVoiceClones]);

  // Wrapper for getVoiceClone to prevent server-side rendering issues
  const getVoiceCloneSafe = useCallback(async (id: string | number) => {
    if (mounted) {
      return await getVoiceClone(id);
    }
    return null;
  }, [mounted, getVoiceClone]);

  // Wrapper for saveVoiceClone to prevent server-side rendering issues
  const saveVoiceCloneSafe = useCallback(async (voiceCloneData: FormData, editingVoiceClone: VoiceClone | null) => {
    if (mounted) {
      return await saveVoiceClone(voiceCloneData, editingVoiceClone);
    }
    return false;
  }, [mounted, saveVoiceClone]);

  // Wrapper for deleteVoiceClone to prevent server-side rendering issues
  const deleteVoiceCloneSafe = useCallback(async (providerId: string | number) => {
    if (mounted) {
      return await deleteVoiceClone(providerId);
    }
  }, [mounted, deleteVoiceClone]);

  // Wrapper for handleCreateVoiceClone to prevent server-side rendering issues
  const handleCreateVoiceCloneSafe = useCallback(() => {
    if (mounted) {
      resetFormSafe();
      setShowFormSafe(true);
      setActiveTabSafe(1);
      setEditingVoiceCloneSafe(null);
    }
  }, [mounted, resetFormSafe, setShowFormSafe, setActiveTabSafe, setEditingVoiceCloneSafe]);

  // Wrapper for handleEditVoiceClone to prevent server-side rendering issues
  const handleEditVoiceCloneSafe = useCallback(async (voiceClone: VoiceClone) => {
    if (mounted) {
      try {
        // Fetch the latest voice clone data from the API
        const freshVoiceClone = await getVoiceCloneSafe(voiceClone.id!);
        if (freshVoiceClone) {
          setEditingVoiceCloneSafe(freshVoiceClone);
          setShowFormSafe(true);
          setActiveTabSafe(1);
          populateFormSafe(freshVoiceClone);
        } else {
          // Fallback to the existing voice clone data if API call fails
          setEditingVoiceCloneSafe(voiceClone);
          setShowFormSafe(true);
          setActiveTabSafe(1);
          populateFormSafe(voiceClone);
        }
      } catch (error) {
        console.error('Error fetching voice clone data:', error);
        // Fallback to the existing voice clone data
        setEditingVoiceCloneSafe(voiceClone);
        setShowFormSafe(true);
        setActiveTabSafe(1);
        populateFormSafe(voiceClone);
      }
    }
  }, [mounted, setEditingVoiceCloneSafe, setShowFormSafe, setActiveTabSafe, populateFormSafe, getVoiceCloneSafe]);

  // Handle URL parameter for editing specific voice clone
  useEffect(() => {
    const editVoiceCloneId = searchParams.get('edit');
    if (editVoiceCloneId && mounted) {
      // Try to find in existing voice clones first
      const existingVoiceClone = voiceClones.find(voiceClone => voiceClone.id?.toString() === editVoiceCloneId);
      if (existingVoiceClone) {
        console.log('Found voice clone to edit from URL:', existingVoiceClone.name);
        handleEditVoiceCloneSafe(existingVoiceClone);
      } else if (voiceClones.length > 0) {
        // If not found in existing list, try to fetch from API
        console.log('Voice clone not found in list, fetching from API:', editVoiceCloneId);
        getVoiceCloneSafe(editVoiceCloneId).then(freshVoiceClone => {
          if (freshVoiceClone) {
            handleEditVoiceCloneSafe(freshVoiceClone);
          }
        });
      }
    }
  }, [searchParams, voiceClones, mounted, handleEditVoiceCloneSafe, getVoiceCloneSafe]);

  // Wrapper for handleDeleteVoiceClone to prevent server-side rendering issues
  const handleDeleteVoiceCloneSafe = useCallback((voiceCloneId: string | number) => {
    if (mounted) {
      deleteVoiceCloneSafe(voiceCloneId);
    }
  }, [mounted, deleteVoiceCloneSafe]);

  // Wrapper for handleSaveVoiceClone to prevent server-side rendering issues
  const handleSaveVoiceCloneSafe = useCallback(async () => {
    if (!mounted) return;

    console.log('Form submission started...');
    const validationError = await validateFormSafe();
    console.log('Validation error:', validationError);
    
    if (validationError) {
      console.log('Validation failed, setting error and returning early');
      setError(validationError);
      return;
    }

    console.log('Validation passed, proceeding with save...');
    const success = await saveVoiceCloneSafe(formData, editingVoiceClone);
    if (success) {
      setSuccessMessage(editingVoiceClone ? 'Voice clone updated successfully' : 'Voice clone created successfully');
      resetFormSafe();
      setShowFormSafe(false);
      setEditingVoiceCloneSafe(null);
      setActiveTabSafe(1);
    }
  }, [mounted, validateFormSafe, formData, saveVoiceCloneSafe, editingVoiceClone, setSuccessMessage, resetFormSafe, setShowFormSafe, setEditingVoiceCloneSafe, setActiveTabSafe, setError]);

  // Wrapper for handleResetForm to prevent server-side rendering issues
  const handleResetFormSafe = useCallback(() => {
    if (mounted) {
      resetFormSafe();
      setShowFormSafe(false);
      setEditingVoiceCloneSafe(null);
      setActiveTabSafe(1);
      setError(null);
      setSuccessMessage(null);
    }
  }, [mounted, resetFormSafe, setShowFormSafe, setEditingVoiceCloneSafe, setActiveTabSafe, setError, setSuccessMessage]);

  // Wrapper for handleTabClick to prevent server-side rendering issues
  const handleTabClickSafe = useCallback((tabId: number) => {
    if (mounted) {
      setActiveTabSafe(tabId);
    }
  }, [mounted, setActiveTabSafe]);

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load voice clones when component mounts and auth is available
  useEffect(() => {
    if (mounted && token && user) {
      loadVoiceClonesSafe();
    }
  }, [mounted, token, user, loadVoiceClonesSafe]);

  const renderTabContent = () => {
    if (!showForm) {
      return (
        <BasicInfo 
          formData={formData}
          setFormData={setFormData}
        />
      );
    }

    switch (activeTab) {
      case 1:
        return (
          <BasicInfo 
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <AudioUpload 
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return <BasicInfo formData={formData} setFormData={setFormData} />;
    }
  };

  // Show loading state until mounted and auth is initialized
  if (!mounted || !isInitialized) {
    return (
      <Layout title="Voice Cloning">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader text="Loading Voice Cloning..." />
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state if not authenticated
  if (!token || !user) {
    return (
      <Layout title="Voice Cloning">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-gray-600">Please sign in to access Voice Cloning.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Voice Cloning">
      <div className="flex items-start max-lg:block">
        {/* Sidebar Navigation */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTermSafe}
          onCreateVoiceClone={handleCreateVoiceCloneSafe}
          showForm={showForm}
          editingVoiceClone={editingVoiceClone}
          activeTab={activeTab}
          onTabClick={handleTabClickSafe}
          navigation={navigation}
        />

        {/* Main Content Area */}
        <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-t-primary">
                {editingVoiceClone ? `Edit ${editingVoiceClone.name}` : 'Voice Cloning'}
              </h1>
              <p className="text-md">
                {editingVoiceClone ? 'Modify your voice clone configuration' : 'Create and manage custom AI voices from audio samples.'}
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && !editingVoiceClone && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {!showForm ? (
              <VoiceClonesList
                voiceClones={voiceClones}
                loading={loading}
                searchTerm={searchTerm}
                onCreateVoiceClone={handleCreateVoiceCloneSafe}
                onEditVoiceClone={handleEditVoiceCloneSafe}
                onDeleteVoiceClone={handleDeleteVoiceCloneSafe}
              />
            ) : (
              <VoiceCloneForm
                activeTab={activeTab}
                onTabClick={handleTabClickSafe}
                onReset={handleResetFormSafe}
                onSave={handleSaveVoiceCloneSafe}
                loading={loading}
                editingVoiceClone={editingVoiceClone}
                navigation={navigation}
                renderTabContent={renderTabContent}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const VoiceClonePage = () => {
  return (
    <Suspense fallback={
      <Layout title="Voice Clone">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader text="Loading Voice Clone..." />
          </div>
        </div>
      </Layout>
    }>
      <VoiceClonePageContent />
    </Suspense>
  );
};

export default VoiceClonePage;
