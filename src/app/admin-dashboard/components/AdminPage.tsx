"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { adminService } from "@/services/admin";
import { toast } from "sonner";

// Types for admin page data
interface AdminPageData {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  lastUpdated: string;
}

interface AdminPageProps<T extends AdminPageData> {
  title: string;
  data: T[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onExport: () => void;
  onCreate?: () => void;
  createButtonText?: string;
  columns: Array<{
    key: keyof T | string;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
  actions?: Array<{
    label: string;
    onClick: (item: T) => void;
    variant?: "success" | "warning" | "secondary" | "danger";
  }>;
}

const AdminPage = <T extends AdminPageData>({
  title,
  data,
  loading,
  error,
  onRefresh,
  onExport,
  onCreate,
  createButtonText = "Create New",
  columns,
  actions = []
}: AdminPageProps<T>) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-t-secondary">Loading {title.toLowerCase()}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-t-error">Failed to load {title.toLowerCase()}: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
        <h1 className="text-h4 text-t-primary font-heading">{title}</h1>
        <div className="flex gap-3 max-md:w-full max-md:justify-between">
          {onCreate && (
            <Button onClick={onCreate} className="max-md:flex-1">
              {createButtonText}
            </Button>
          )}
          <Button isStroke onClick={onExport} className="max-md:flex-1">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4">
        {data.map((item, index) => (
          <div key={`${item.id}-${index}`} className="card p-4 space-y-3">
            {/* Primary Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-t-primary">
                  {item.name || (item as any).company || `Item ${item.id}`}
                </h3>
                <p className="text-sm text-t-secondary">
                  {item.status && (
                    <Badge variant={item.status === "active" ? "success" : "secondary"}>
                      {item.status}
                    </Badge>
                  )}
                </p>
              </div>
              {actions.length > 0 && (
                <div className="flex gap-2">
                  {actions.map((action, actionIndex) => (
                    <Button
                      key={`${item.id}-${index}-mobile-action-${actionIndex}`}
                      isGray
                      onClick={() => action.onClick(item)}
                      className="text-xs px-2 py-1"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-s-stroke">
              {columns.slice(0, 4).map((column, colIndex) => {
                const value = item[column.key as keyof T];
                if (column.key === 'status' || column.key === 'name' || column.key === 'company') return null;
                
                return (
                  <div key={`${item.id}-${index}-mobile-${String(column.key)}-${colIndex}`}>
                    <p className="text-sm text-t-secondary">{column.label}</p>
                    <p className="text-t-primary font-medium">
                      {column.render 
                        ? column.render(value, item)
                        : String(value || "")
                      }
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block">
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-s-stroke">
                  {columns.map((column) => (
                    <th 
                      key={String(column.key)} 
                      className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium"
                    >
                      {column.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="border-b border-s-stroke">
                    {columns.map((column, colIndex) => (
                      <td key={`${item.id}-${index}-${String(column.key)}-${colIndex}`} className="py-3 px-4 text-body-2 text-t-primary">
                        {column.render 
                          ? column.render(item[column.key as keyof T], item)
                          : String(item[column.key as keyof T] || "")
                        }
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td key={`${item.id}-${index}-actions`} className="py-3 px-4">
                        <div className="flex gap-2">
                          {actions.map((action, actionIndex) => (
                            <Button
                              key={`${item.id}-${index}-action-${actionIndex}`}
                              isGray
                              onClick={() => action.onClick(item)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;