import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { documentsAPI } from "@/services/api";
import { toast } from "sonner";

interface TrainingDataProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
}

type UploadStatus = "queued" | "uploading" | "processing" | "completed" | "failed";

type UploadItem = {
  file: File;
  tempId: string;
  documentId?: string;
  status: UploadStatus;
  progress?: number;
  currentStep?: string;
  errorMessage?: string;
};

export const TrainingData = ({ selectedFile, onFileChange }: TrainingDataProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Record<string, UploadItem>>({});
  const pollingRefs = useRef<Record<string, NodeJS.Timeout | number>>({});
  // Vector store support removed for agent creation/update flow

  const activeUploads = useMemo(() => Object.values(uploads), [uploads]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles(prev => [...prev, ...files]);
    // Update the parent component with the first file for backward compatibility
    onFileChange(files[0]);

    // Start uploads immediately
    for (const file of files) {
      queueAndUploadFile(file);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev[index];
      const newFiles = prev.filter((_, i) => i !== index);
      // Cancel polling if any
      const uploadEntry = Object.values(uploads).find(u => u.file === fileToRemove);
      if (uploadEntry?.tempId && pollingRefs.current[uploadEntry.tempId]) {
        clearTimeout(pollingRefs.current[uploadEntry.tempId] as number);
        delete pollingRefs.current[uploadEntry.tempId];
      }
      // Update parent component with first remaining file or null
      onFileChange(newFiles.length > 0 ? newFiles[0] : null);
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const queueAndUploadFile = async (file: File) => {
    const tempId = `${file.name}-${file.size}-${Date.now()}`;
    setUploads(prev => ({
      ...prev,
      [tempId]: { file, tempId, status: "uploading" }
    }));

    try {
      const res = await documentsAPI.uploadDocument({
        file,
        title: file.name,
      });
      const data = res?.data || res; // support either shape
      const documentId = String(data?.doc_id ?? data?.document_id ?? data?.id);
      if (!documentId) {
        throw new Error("Upload response missing document id");
      }
      setUploads(prev => ({
        ...prev,
        [tempId]: { ...prev[tempId], documentId, status: "processing" }
      }));
      pollIngestionStatus(tempId, documentId);
    } catch (err: any) {
      setUploads(prev => ({
        ...prev,
        [tempId]: { ...prev[tempId], status: "failed", errorMessage: err?.message || "Upload failed" }
      }));
      toast.error(err?.response?.data?.message || err?.message || "Failed to upload document");
    }
  };

  const pollIngestionStatus = async (tempId: string, documentId: string) => {
    const tick = async () => {
      try {
        const res = await documentsAPI.getIngestionStatus(documentId);
        const data = res?.data || res;
        const status: string = data?.status || "processing";
        const progress: number | undefined = data?.progress;
        const currentStep: string | undefined = data?.current_step;

        setUploads(prev => ({
          ...prev,
          [tempId]: {
            ...prev[tempId],
            status: status === "completed" ? "completed" : status === "failed" ? "failed" : "processing",
            progress,
            currentStep,
            errorMessage: data?.error_message,
          }
        }));

        if (status === "completed" || status === "failed") {
          delete pollingRefs.current[tempId];
          if (status === "completed") {
            toast.success("Document ingested successfully");
          } else if (data?.error_message) {
            toast.error(data.error_message);
          }
          return;
        }

        pollingRefs.current[tempId] = setTimeout(tick, 1500) as unknown as number;
      } catch (err: any) {
        setUploads(prev => ({
          ...prev,
          [tempId]: { ...prev[tempId], status: "failed", errorMessage: err?.message || "Status polling failed" }
        }));
        delete pollingRefs.current[tempId];
      }
    };
    pollingRefs.current[tempId] = setTimeout(tick, 1200) as unknown as number;
  };

  useEffect(() => {
    return () => {
      // Cleanup timers
      Object.values(pollingRefs.current).forEach((t) => clearTimeout(t as number));
      pollingRefs.current = {};
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-s-stroke2 rounded-3xl p-6 text-center hover:border-primary-01/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.json,.xlsx,.xls"
        />
        <div className="flex flex-col items-center gap-3">
          <Icon name="upload" className="w-8 h-8 text-t-secondary" />
          <div>
            <Button 
              className="mb-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Icon name="plus" className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <div className="text-sm text-t-secondary">
              or drag and drop files here
            </div>
          </div>
          <div className="text-xs text-t-tertiary">
            Supported formats: PDF, DOC, DOCX, TXT, CSV, JSON, XLSX, XLS
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-t-primary">Selected Files ({selectedFiles.length})</h4>
            <Button
              isStroke
              onClick={() => {
                setSelectedFiles([]);
                onFileChange(null);
              }}
              className="text-sm"
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-b-surface2 rounded-lg border border-s-subtle">
                <div className="flex items-center gap-3">
                  <Icon name="file" className="w-5 h-5 text-t-secondary" />
                  <div>
                    <div className="text-sm font-medium text-t-primary">{file.name}</div>
                    <div className="text-xs text-t-secondary">{formatFileSize(file.size)}</div>
                    {/* Upload status */}
                    {(() => {
                      const item = activeUploads.find(u => u.file === file);
                      if (!item) return null;
                      return (
                        <div className="mt-1 text-xs">
                          {item.status === "uploading" && (
                            <span className="text-blue-600">Uploading...</span>
                          )}
                          {item.status === "processing" && (
                            <span className="text-amber-600">Processing{typeof item.progress === 'number' ? ` — ${Math.round(item.progress)}%` : ''}{item.currentStep ? ` — ${item.currentStep}` : ''}</span>
                          )}
                          {item.status === "completed" && (
                            <span className="text-green-600">Completed</span>
                          )}
                          {item.status === "failed" && (
                            <span className="text-red-600">Failed{item.errorMessage ? ` — ${item.errorMessage}` : ''}</span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <Button
                  isStroke
                  onClick={() => removeFile(index)}
                  className="p-2"
                >
                  <Icon name="trash" className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
