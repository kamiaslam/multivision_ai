"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown } from "lucide-react";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useCommonDialogs } from "../../components/dialogs/commonDialogsContext";

const tickets = [
  {
    id: "T-001",
    client: "Client A",
    subject: "Login Issue",
    priority: "high",
    sla: "4h",
    status: "Open",
  },
  {
    id: "T-002",
    client: "Client B",
    subject: "Payment Failure",
    priority: "med",
    sla: "8h",
    status: "In Progress",
  },
  {
    id: "T-003",
    client: "Client C",
    subject: "Feature Request",
    priority: "low",
    sla: "24h",
    status: "Closed",
  },
];

const SupportPage = () => {
  const { exportCurrentPagePDF } = useCommonDialogs();
  return (
    <div id="page-support" className="p-6">
      <PageHeader
        title="Support & Ticketing"
        cta={
          <Button variant="secondary" onClick={exportCurrentPagePDF}>
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        }
      />

      <div className="card p-6 mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-s-stroke">
                <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">ID</th>
                <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Client</th>
                <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Priority</th>
                <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">SLA</th>
                <th className="text-left py-3 px-4 text-caption-1 text-t-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-s-stroke">
                  <td className="py-3 px-4 text-body-2 text-t-primary font-medium">{t.id}</td>
                  <td className="py-3 px-4 text-body-2 text-t-primary">{t.client}</td>
                  <td className="py-3 px-4 text-body-2 text-t-primary">{t.subject}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        t.priority === "high"
                          ? "destructive"
                          : t.priority === "med"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-body-2 text-t-primary">{t.sla}</td>
                  <td className="py-3 px-4 text-body-2 text-t-primary">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
