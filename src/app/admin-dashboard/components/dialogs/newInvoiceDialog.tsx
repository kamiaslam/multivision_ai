"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmtMoney, users } from "../../utils/utils";
import { useCommonDialogs } from "./commonDialogsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NewInvoiceDialogComponent: React.FC = () => {
  const {
    newInvOpen,
    setNewInvOpen,
    newInvClient,
    setNewInvClient,
    newInvPeriod,
    setNewInvPeriod,
    newInvCurrency,
    setNewInvCurrency,
    newInvItems,
    setNewInvItems,
    invoices,
    setInvoices,
  } = useCommonDialogs();

  const total = newInvItems.reduce(
    (s, i) => s + (Number(i.qty) || 0) * (Number(i.unit) || 0),
    0
  );
  return (
    <Dialog open={newInvOpen} onOpenChange={setNewInvOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Raise a manual invoice for a client.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <Label>Client</Label>
            <Select value={newInvClient} onValueChange={setNewInvClient}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.company} value={u.company}>
                    {u.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Period</Label>
            <Input
              value={newInvPeriod}
              onChange={(e) => setNewInvPeriod(e.target.value)}
              placeholder="Aug 2025"
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Select value={newInvCurrency} onValueChange={setNewInvCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3">
          <Label>Line items</Label>
          <div className="space-y-2 mt-2">
            {newInvItems.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <Input
                  className="col-span-6"
                  placeholder="Description"
                  value={it.desc}
                  onChange={(e) => {
                    const arr = [...newInvItems];
                    arr[idx] = { ...it, desc: e.target.value };
                    setNewInvItems(arr);
                  }}
                />
                <Input
                  className="col-span-2"
                  type="number"
                  placeholder="Qty"
                  value={it.qty}
                  onChange={(e) => {
                    const arr = [...newInvItems];
                    arr[idx] = { ...it, qty: Number(e.target.value) };
                    setNewInvItems(arr);
                  }}
                />
                <Input
                  className="col-span-2"
                  type="number"
                  step="0.01"
                  placeholder="Unit"
                  value={it.unit}
                  onChange={(e) => {
                    const arr = [...newInvItems];
                    arr[idx] = { ...it, unit: Number(e.target.value) };
                    setNewInvItems(arr);
                  }}
                />
                <div className="col-span-2 text-right">
                  {fmtMoney((Number(it.qty) || 0) * (Number(it.unit) || 0))}
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setNewInvItems([
                    ...newInvItems,
                    { desc: "", qty: 1, unit: 0 },
                  ])
                }
              >
                + Add line
              </Button>
              <div className="text-right font-semibold">
                Total {fmtMoney(total)}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setNewInvOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const id = `INV-${Math.floor(1000 + Math.random() * 8999)}`;
              setInvoices([
                {
                  id,
                  client: newInvClient,
                  amount: Number(total.toFixed(2)),
                  status: "due",
                  period: newInvPeriod,
                },
                ...invoices,
              ]);
              setNewInvOpen(false);
            }}
          >
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
