"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";

interface SimAIProduct {
  id: string;
  name: string;
  description: string;
  type: "workflow" | "agent" | "knowledge" | "tool";
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
  runs?: number;
  successRate?: number;
}

const SimAIProductsPage = () => {
  const [products, setProducts] = useState<SimAIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "workflows" | "agents" | "knowledge" | "tools">("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from Sim AI API
      const response = await fetch("http://localhost:3001/api/products", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        // Fallback to mock data
        setProducts(mockProducts);
      }
    } catch (err) {
      console.log("Sim AI not available, using mock data");
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (type: SimAIProduct["type"]) => {
    try {
      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: `New ${type}`,
          type,
          description: `A new ${type} product`,
        }),
      });

      if (response.ok) {
        await loadProducts();
      }
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const toggleProductStatus = async (productId: string, newStatus: "active" | "inactive") => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await loadProducts();
      }
    } catch (err) {
      console.error("Failed to update product status:", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await loadProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const filteredProducts = products.filter(product => {
    if (activeTab === "all") return true;
    return product.type === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600";
      case "inactive": return "text-red-600";
      case "draft": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "workflow": return "promote";
      case "agent": return "product-think";
      case "knowledge": return "grid";
      case "tool": return "product";
      default: return "product";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
                <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sim AI Products</h1>
          <p className="text-gray-600">Manage your Sim AI workflows, agents, knowledge bases, and tools</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => createProduct("workflow")}
            icon="plus"
            className="flex items-center gap-2"
          >
            New Workflow
          </Button>
          <Button
            onClick={() => createProduct("agent")}
            icon="plus"
            className="flex items-center gap-2"
          >
            New Agent
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <Icon name="alert-circle" className="text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Connection Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {[
          { id: "all", label: "All Products", count: products.length },
          { id: "workflows", label: "Workflows", count: products.filter(p => p.type === "workflow").length },
          { id: "agents", label: "Agents", count: products.filter(p => p.type === "agent").length },
          { id: "knowledge", label: "Knowledge", count: products.filter(p => p.type === "knowledge").length },
          { id: "tools", label: "Tools", count: products.filter(p => p.type === "tool").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Icon name={getTypeIcon(product.type)} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.type}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(product.status)} bg-gray-100`}>
                {product.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

            {/* Stats */}
            {(product.runs !== undefined || product.successRate !== undefined) && (
              <div className="flex gap-4 mb-4 text-sm">
                {product.runs !== undefined && (
                  <div>
                    <span className="text-gray-500">Runs:</span>
                    <span className="font-medium ml-1">{product.runs.toLocaleString()}</span>
                  </div>
                )}
                {product.successRate !== undefined && (
                  <div>
                    <span className="text-gray-500">Success:</span>
                    <span className="font-medium ml-1">{product.successRate}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                isGray
                onClick={() => toggleProductStatus(product.id, product.status === "active" ? "inactive" : "active")}
                className="h-8 px-3 text-sm"
              >
                {product.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button
                isStroke
                onClick={() => deleteProduct(product.id)}
                className="h-8 px-3 text-sm text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                Delete
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div>Created: {new Date(product.createdAt).toLocaleDateString()}</div>
              <div>Updated: {new Date(product.updatedAt).toLocaleDateString()}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon name="product" className="text-gray-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-600">Create your first Sim AI product to get started</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => createProduct("workflow")} icon="plus">
                New Workflow
              </Button>
              <Button onClick={() => createProduct("agent")} icon="plus">
                New Agent
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Mock data for when Sim AI is not available
const mockProducts: SimAIProduct[] = [
  {
    id: "1",
    name: "Customer Support Workflow",
    description: "Automated customer support workflow with ticket routing and response generation",
    type: "workflow",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    runs: 1250,
    successRate: 94.2,
  },
  {
    id: "2",
    name: "Sales Assistant Agent",
    description: "AI agent for handling sales inquiries and lead qualification",
    type: "agent",
    status: "active",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    runs: 890,
    successRate: 87.5,
  },
  {
    id: "3",
    name: "Product Knowledge Base",
    description: "Comprehensive knowledge base for product information and FAQs",
    type: "knowledge",
    status: "active",
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-15T13:20:00Z",
  },
  {
    id: "4",
    name: "Data Analysis Tool",
    description: "Tool for analyzing customer data and generating insights",
    type: "tool",
    status: "draft",
    createdAt: "2024-01-12T15:00:00Z",
    updatedAt: "2024-01-12T15:00:00Z",
  },
  {
    id: "5",
    name: "Email Marketing Workflow",
    description: "Automated email marketing workflow with segmentation and personalization",
    type: "workflow",
    status: "inactive",
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-16T10:15:00Z",
    runs: 450,
    successRate: 91.8,
  },
  {
    id: "6",
    name: "Technical Support Agent",
    description: "Specialized agent for technical support and troubleshooting",
    type: "agent",
    status: "active",
    createdAt: "2024-01-03T08:00:00Z",
    updatedAt: "2024-01-19T17:30:00Z",
    runs: 2100,
    successRate: 89.3,
  },
];

export default SimAIProductsPage;
