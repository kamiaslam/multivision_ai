"use client";

import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Field from "@/components/Field";
import { agentAPI, documentsAPI } from "@/services/api";
import { toast } from "sonner";

type AgentOption = { id: number; name: string };

type StringSelectOption = { id: string; name: string };

type DocumentItem = {
  id: string;
  title: string;
  status: string;
  visibility?: string;
  created_at?: string;
};

const statusColor = (status: string) => {
  switch (status) {
    case "uploaded":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "processing":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "indexed":
      return "bg-green-100 text-green-700 border-green-200";
    case "indexed_partial":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "error":
      return "bg-red-100 text-red-700 border-red-200";
    case "deleted":
      return "bg-gray-200 text-gray-500 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function DocumentsPage() {
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentOption | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<StringSelectOption | null>({ id: "private", name: "private" });
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<StringSelectOption | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<StringSelectOption | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const list = await agentAPI.getAgents();
        const options: AgentOption[] = (Array.isArray(list) ? list : list?.data || []).map((a: any) => ({ id: Number(a.id), name: a.name }));
        setAgents(options);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load agents");
      }
    };
    loadAgents();
  }, []);

  const canUpload = useMemo(() => {
    return !!file && title.trim().length > 0 && !!selectedAgent?.id;
  }, [file, title, selectedAgent]);

  const loadDocuments = async () => {
    if (!selectedAgent?.id) {
      setDocuments([]);
      return;
    }
    setDocsLoading(true);
    try {
      const res = await documentsAPI.listDocuments({
        page,
        page_size: pageSize,
        status: statusFilter?.id,
        visibility: visibilityFilter?.id,
        agent_id: selectedAgent.id,
      });
      
      // Ensure we always have an array, handle different response structures
      let items: DocumentItem[] = [];
      
      if (Array.isArray(res)) {
        items = res;
      } else if (res?.data && Array.isArray(res.data)) {
        items = res.data;
      } else if (res?.data?.items && Array.isArray(res.data.items)) {
        items = res.data.items;
      } else if (res?.items && Array.isArray(res.items)) {
        items = res.items;
      }
      
      setDocuments(items);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load documents");
      setDocuments([]); // Ensure documents is always an array
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgent?.id, page, pageSize, statusFilter?.id, visibilityFilter?.id]);

  const handleUpload = async () => {
    if (!canUpload || !file || !selectedAgent) return;
    setLoading(true);
    try {
      const res = await documentsAPI.uploadDocument({
        file,
        title: title.trim(),
        visibility: visibility?.id,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        agent_id: selectedAgent.id,
      });

      const success = res?.success !== false;
      if (success) {
        toast.success("Document uploaded");
        setFile(null);
        setTitle("");
        setTags("");
        await loadDocuments();
      } else {
        toast.error(res?.message || "Upload failed");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await documentsAPI.deleteDocument(docId);
      toast.success("Document deleted");
      await loadDocuments();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to delete document");
    }
  };

  return (
    <Layout title="Documents">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-t-primary">Documents</h1>
            <p className="text-sm text-t-secondary mt-1">Upload and manage documents for your agents</p>
          </div>
        </div>

        {/* Upload Form */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-t-primary">Upload Document</h2>
            <p className="text-sm text-t-secondary mt-1">Select an agent and upload a document to get started</p>
          </div>
          
          <div className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-t-secondary mb-2 block">Agent</label>
                <Select
                  value={selectedAgent}
                  onChange={setSelectedAgent as any}
                  options={agents}
                  className="w-full"
                  placeholder="Select an option"
                />
              </div>
              <div>
                <label className="text-xs text-t-secondary mb-2 block">Title</label>
                <Field
                  placeholder="Document title"
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-t-secondary mb-2 block">Visibility</label>
                <Select
                  value={visibility as any}
                  onChange={setVisibility as any}
                  options={[{ id: "private", name: "private" }, { id: "org", name: "org" }, { id: "public", name: "public" }] as any}
                  className="w-full"
                  placeholder="Select an option"
                />
              </div>
              <div>
                <label className="text-xs text-t-secondary mb-2 block">Tags</label>
                <Field
                  placeholder="Comma-separated tags"
                  value={tags}
                  onChange={(e: any) => setTags(e.target.value)}
                />
              </div>
            </div>
            
            {/* File Upload Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs text-t-secondary mb-2 block">File</label>
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-t-primary cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-01 file:text-white hover:file:bg-primary-02"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleUpload} 
                  disabled={!canUpload || loading}
                  className="w-full px-6 py-2 h-12"
                >
                  {loading ? (
                    <>
                      <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Icon name="upload" className="w-4 h-4 mr-2" /> Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents List */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-t-primary">Documents</h2>
            <p className="text-sm text-t-secondary mt-1">Manage and filter your uploaded documents</p>
          </div>
          
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-xs text-t-secondary mb-2 block">Status</label>
                <Select
                  value={statusFilter as any}
                  onChange={setStatusFilter as any}
                  options={["uploaded","processing","indexed","indexed_partial","error","deleted"].map(s => ({ id: s, name: s })) as any}
                  className="w-full"
                  placeholder="Select an option"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-t-secondary mb-2 block">Visibility</label>
                <Select
                  value={visibilityFilter as any}
                  onChange={setVisibilityFilter as any}
                  options={["private","org","public"].map(v => ({ id: v, name: v })) as any}
                  className="w-full"
                  placeholder="Select an option"
                />
              </div>
            </div>
          </div>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="text-caption text-t-tertiary/80 border-b border-s-subtle">
                  <div className="grid grid-cols-5 gap-4 py-3 px-4">
                    <div className="font-small text-t-secondary">Title</div>
                    <div className="font-small text-t-secondary">Status</div>
                    <div className="font-small text-t-secondary">Visibility</div>
                    <div className="font-small text-t-secondary">Created</div>
                    <div className="font-small text-t-secondary">Actions</div>
                  </div>
                </div>
                <div>
                  {docsLoading ? (
                    <div className="p-4 text-sm text-t-secondary">Loading...</div>
                  ) : !Array.isArray(documents) || documents.length === 0 ? (
                    <div className="p-4 text-sm text-t-secondary">No documents found.</div>
                  ) : (
                    documents.map((doc) => (
                      <div key={doc.id} className="grid grid-cols-5 gap-4 py-3 px-4 border-b border-s-subtle text-body-2 hover:bg-gray-50/50">
                        <div className="truncate font-medium text-t-primary">{doc.title || doc.id}</div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded border ${statusColor(doc.status)}`}>{doc.status}</span>
                        </div>
                        <div className="text-sm text-t-secondary capitalize">{doc.visibility || "private"}</div>
                        <div className="text-sm text-t-secondary">{doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}</div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-red-500 flex items-center justify-center transition-colors"
                            title="Delete Document"
                          >
                            <Icon name="trash" className="w-4 h-4 fill-t-secondary" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {docsLoading ? (
              <div className="p-4 text-sm text-t-secondary">Loading...</div>
            ) : !Array.isArray(documents) || documents.length === 0 ? (
              <div className="p-4 text-sm text-t-secondary">No documents found.</div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white border border-s-subtle rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-t-primary truncate">{doc.title || doc.id}</h3>
                        <p className="text-sm text-t-secondary mt-1">
                          {doc.created_at ? new Date(doc.created_at).toLocaleString() : 'No date'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className={`px-2 py-1 text-xs rounded border ${statusColor(doc.status)}`}>{doc.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-t-secondary">
                        <span className="capitalize">{doc.visibility || "private"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          isStroke 
                          className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" 
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Icon name="trash" className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-t-secondary">Page {page}</div>
            <div className="flex gap-2">
              <Button isStroke disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <Button isStroke onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}


