"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAuth } from "@/context/authContext";
import { Tool, FormData } from "./types";
import { useTools } from "./hooks/useTools";
import { useToolForm } from "./hooks/useToolForm";
import { Sidebar } from "./components/Sidebar";
import { ToolsList } from "./components/ToolsList";
import { ToolForm } from "./components/ToolForm";
import { navigation } from "./constants";
import BasicInfo from "./BasicInfo";
import InputSchema from "./InputSchema";
import WebhookConfig from "./WebhookConfig";
import { SchemaProperty } from "./types";
import Loader from "@/components/Loader";
import { ConfirmationModal } from "@/components/ConfirmationModal";

const CustomToolsContent = () => {
  const { token, user, isInitialized } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("CustomToolsPage - Mounted:", mounted);
    console.log("CustomToolsPage - Auth initialized:", isInitialized);
    console.log("CustomToolsPage - Token:", !!token);
    console.log("CustomToolsPage - User:", !!user);
  }, [mounted, isInitialized, token, user]);

  // Custom hooks
  const { tools, loading, error, setError: originalSetError, loadTools, saveTool, deleteTool } = useTools(token || '');
  const { 
    formData, 
    setFormData: originalSetFormData, 
    inputProperties, 
    setInputProperties: originalSetInputProperties, 
    resetForm, 
    addInputProperty, 
    updateInputProperty, 
    removeInputProperty, 
    buildSchema, 
    validateForm, 
    populateForm 
  } = useToolForm();


  // Wrapper for setFormData to prevent server-side rendering issues
  const setFormData = useCallback((updater: React.SetStateAction<FormData>) => {
    if (mounted) {
      originalSetFormData(updater);
    }
  }, [mounted, originalSetFormData]);

  // Wrapper for setInputProperties to prevent server-side rendering issues
  const setInputProperties = useCallback((updater: React.SetStateAction<any[]>) => {
    if (mounted) {
      originalSetInputProperties(updater);
    }
  }, [mounted, originalSetInputProperties]);

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

  // Wrapper for setEditingTool to prevent server-side rendering issues
  const setEditingToolSafe = useCallback((value: Tool | null) => {
    if (mounted) {
      setEditingTool(value);
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
  const populateFormSafe = useCallback((tool: Tool) => {
    if (mounted) {
      populateForm(tool);
    }
  }, [mounted, populateForm]);

  // Wrapper for addInputProperty to prevent server-side rendering issues
  const addInputPropertySafe = useCallback(() => {
    if (mounted) {
      addInputProperty();
    }
  }, [mounted, addInputProperty]);

  // Wrapper for updateInputProperty to prevent server-side rendering issues
  const updateInputPropertySafe = useCallback((index: number, field: keyof SchemaProperty, value: any) => {
    if (mounted) {
      updateInputProperty(index, field, value);
    }
  }, [mounted, updateInputProperty]);

  // Wrapper for removeInputProperty to prevent server-side rendering issues
  const removeInputPropertySafe = useCallback((index: number) => {
    if (mounted) {
      removeInputProperty(index);
    }
  }, [mounted, removeInputProperty]);

  // Wrapper for buildSchema to prevent server-side rendering issues
  const buildSchemaSafe = useCallback((properties: SchemaProperty[]) => {
    if (mounted) {
      return buildSchema(properties);
    }
    return { type: 'object' as const, properties: {}, required: [] };
  }, [mounted, buildSchema]);

  // Wrapper for validateForm to prevent server-side rendering issues
  const validateFormSafe = useCallback((): string | null => {
    if (mounted) {
      return validateForm();
    }
    return null;
  }, [mounted, validateForm]);

  // Wrapper for loadTools to prevent server-side rendering issues
  const loadToolsSafe = useCallback(() => {
    if (mounted) {
      loadTools();
    }
  }, [mounted, loadTools]);

  // Wrapper for saveTool to prevent server-side rendering issues
  const saveToolSafe = useCallback(async (toolData: FormData, editingTool: Tool | null) => {
    if (mounted) {
      return await saveTool(toolData, editingTool);
    }
    return false;
  }, [mounted, saveTool]);

  // Wrapper for deleteTool to prevent server-side rendering issues
  const deleteToolSafe = useCallback((toolId: string | number) => {
    if (mounted) {
      deleteTool(toolId);
    }
  }, [mounted, deleteTool]);

  // Wrapper for handleCreateTool to prevent server-side rendering issues
  const handleCreateToolSafe = useCallback(() => {
    if (mounted) {
      resetFormSafe();
      setShowFormSafe(true);
      setActiveTabSafe(1);
      setEditingToolSafe(null);
    }
  }, [mounted, resetFormSafe, setShowFormSafe, setActiveTabSafe, setEditingToolSafe]);

  // Wrapper for handleEditTool to prevent server-side rendering issues
  const handleEditToolSafe = useCallback((tool: Tool) => {
    if (mounted) {
      setEditingToolSafe(tool);
      setShowFormSafe(true);
      setActiveTabSafe(1);
      populateFormSafe(tool);
    }
  }, [mounted, setEditingToolSafe, setShowFormSafe, setActiveTabSafe, populateFormSafe]);

  // Handle URL parameter for editing specific tool
  useEffect(() => {
    const editToolId = searchParams.get('edit');
    if (editToolId && tools.length > 0 && mounted) {
      const toolToEdit = tools.find(tool => tool.id?.toString() === editToolId);
      if (toolToEdit) {
        console.log('Found tool to edit from URL:', toolToEdit.name);
        handleEditToolSafe(toolToEdit);
      }
    }
  }, [searchParams, tools, mounted, handleEditToolSafe]);

  // Wrapper for handleDeleteTool to prevent server-side rendering issues
  const handleDeleteToolSafe = useCallback((toolId: string | number) => {
    if (mounted) {
      const tool = tools.find(t => t.id === toolId);
      if (tool) {
        setToolToDelete(tool);
        setIsDeleteModalOpen(true);
      }
    }
  }, [mounted, tools]);

  // Handle delete confirmation
  const confirmDeleteTool = useCallback(async () => {
    if (!toolToDelete || !mounted) return;
    
    try {
      setIsDeleting(true);
      await deleteToolSafe(toolToDelete.id!);
      setIsDeleteModalOpen(false);
      setToolToDelete(null);
    } catch (error) {
      console.error("Error deleting tool:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [toolToDelete, mounted, deleteToolSafe]);

  // Handle delete cancellation
  const cancelDeleteTool = useCallback(() => {
    setIsDeleteModalOpen(false);
    setToolToDelete(null);
  }, []);

  // Wrapper for handleSaveTool to prevent server-side rendering issues
  const handleSaveToolSafe = useCallback(async () => {
    if (!mounted) return;

    const validationError = validateFormSafe();
    if (validationError) {
      setError(validationError);
      return;
    }

    const toolData = {
      ...formData,
      input_schema: buildSchemaSafe(inputProperties.filter(p => p.name.trim())),
      output_schema: {
        type: 'object' as const,
        properties: {
          result: {
            type: 'object',
            description: 'Response from the third-party service'
          }
        },
        required: ['result']
      }
    };

    const success = await saveToolSafe(toolData, editingTool);
    if (success) {
      setSuccessMessage(editingTool ? 'Tool updated successfully' : 'Tool created successfully');
      resetFormSafe();
      setShowFormSafe(false);
      setEditingToolSafe(null);
      setActiveTabSafe(1);
    }
  }, [mounted, validateFormSafe, formData, inputProperties, buildSchemaSafe, saveToolSafe, editingTool, setSuccessMessage, resetFormSafe, setShowFormSafe, setEditingToolSafe, setActiveTabSafe]);

  // Wrapper for handleResetForm to prevent server-side rendering issues
  const handleResetFormSafe = useCallback(() => {
    if (mounted) {
      resetFormSafe();
      setShowFormSafe(false);
      setEditingToolSafe(null);
      setActiveTabSafe(1);
      setError(null);
      setSuccessMessage(null);
    }
  }, [mounted, resetFormSafe, setShowFormSafe, setEditingToolSafe, setActiveTabSafe, setError, setSuccessMessage]);

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

  // Load tools when component mounts and auth is available
  useEffect(() => {
    if (mounted && token && user) {
      loadToolsSafe();
    }
  }, [mounted, token, user, loadToolsSafe]);

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
          <InputSchema 
            properties={inputProperties}
            addProperty={addInputPropertySafe}
            updateProperty={updateInputPropertySafe}
            removeProperty={removeInputPropertySafe}
          />
        );
      case 3:
        return (
          <WebhookConfig 
            webhookSecret={formData.webhook_secret}
            setWebhookSecret={(value: string) => setFormData(prev => ({ ...prev, webhook_secret: value }))}
          />
        );
      default:
        return <BasicInfo formData={formData} setFormData={setFormData} />;
    }
  };

  // Show loading state until mounted and auth is initialized
  if (!mounted || !isInitialized) {
    return (
      <Layout title="Custom Tools">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader text="Loading Custom Tools..." />
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state if not authenticated
  if (!token || !user) {
    return (
      <Layout title="Custom Tools">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-gray-600">Please sign in to access Custom Tools.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Custom Tools">
      <div className="flex items-start max-lg:block">
        {/* Sidebar Navigation */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTermSafe}
          onCreateTool={handleCreateToolSafe}
          showForm={showForm}
          editingTool={editingTool}
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
                {editingTool ? (
                  <span className="block truncate max-w-[400px]" title={`Edit ${editingTool.name}`}>
                    Edit Tool: {editingTool.name}
                  </span>
                ) : 'Custom Tools'}
              </h1>
              <p className="text-md">
                {editingTool ? 'Modify your tool configuration' : 'Create and manage custom tools for your AI agents.'}
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {!showForm ? (
              <ToolsList
                tools={tools}
                loading={loading}
                searchTerm={searchTerm}
                onCreateTool={handleCreateToolSafe}
                onEditTool={handleEditToolSafe}
                onDeleteTool={handleDeleteToolSafe}
              />
            ) : (
              <ToolForm
                activeTab={activeTab}
                onTabClick={handleTabClickSafe}
                onReset={handleResetFormSafe}
                onSave={handleSaveToolSafe}
                loading={loading}
                editingTool={editingTool}
                navigation={navigation}
                renderTabContent={renderTabContent}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteTool}
        onConfirm={confirmDeleteTool}
        title="Delete Tool"
        message={`Are you sure you want to delete "${toolToDelete?.name}"? This action cannot be undone and will permanently remove the tool and all its data.`}
        confirmText="Delete Tool"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </Layout>
  );
};

const CustomToolsPage = () => {
  return (
    <Suspense fallback={
      <Layout title="Custom Tools">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader text="Loading Custom Tools..." />
          </div>
        </div>
      </Layout>
    }>
      <CustomToolsContent />
    </Suspense>
  );
};

export default CustomToolsPage;