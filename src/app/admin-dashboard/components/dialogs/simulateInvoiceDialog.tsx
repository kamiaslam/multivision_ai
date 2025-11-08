"use client";
import React, { useEffect, useState } from "react";
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
import { calcInvoice, fmtMoney, UsageInputs } from "../../utils/utils";
import { useCommonDialogs } from "./commonDialogsContext";
import { AccountPricing, Pricing } from "../../type";
import { API } from "../../api";

const SimulatedBreakdown = ({
  company,
  usage,
}: {
  company: string | null;
  usage: UsageInputs;
}) => {
  const [accPricing, setAccPricing] = useState<AccountPricing | null>(null);
  const [gPricing, setGPricing] = useState<Pricing | null>(null);

  useEffect(() => {
    API.getGlobalPricing().then(setGPricing);
    if (company) {
      API.getAccountPricing(company).then(setAccPricing);
    }
  }, [company]);

  if (!gPricing) return null;
  const effective = company && accPricing?.enabled ? accPricing! : gPricing;
  const bill = calcInvoice(effective, usage);

  return (
    <div className="mt-3 p-3 bg-b-surface2 rounded-xl text-sm text-t-primary">
      <div className="grid grid-cols-2 gap-2">
        <div>Conversa</div>
        <div className="text-right">{fmtMoney(bill.conversa)}</div>
        <div>Empath</div>
        <div className="text-right">{fmtMoney(bill.empath)}</div>
        <div>Premium voices</div>
        <div className="text-right">{fmtMoney(bill.premium)}</div>
        <div>Automations</div>
        <div className="text-right">{fmtMoney(bill.automations)}</div>
        <div className="font-semibold">Total</div>
        <div className="text-right font-semibold">{fmtMoney(bill.total)}</div>
      </div>
    </div>
  );
};

export const SimulateInvoiceDialogComponent: React.FC = () => {
  const {
    simModalOpen,
    setSimModalOpen,
    simUsage,
    setSimUsage,
    simCompany,
    accountPricing,
    globalPricing,
  } = useCommonDialogs();

  const pricing = accountPricing || globalPricing;
  const invoice = pricing ? calcInvoice(pricing, simUsage) : null;

  console.log(invoice);
  return (
    <Dialog open={simModalOpen} onOpenChange={setSimModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Simulate Invoice {simCompany ? `– ${simCompany}` : "(Global)"}
          </DialogTitle>
          <DialogDescription>
            Adjust usage inputs to preview cost under current or overridden
            rates.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Conversa minutes</Label>
            <Input
              type="number"
              value={simUsage.minutesConversa}
              onChange={(e) =>
                setSimUsage({
                  ...simUsage,
                  minutesConversa: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Empath minutes</Label>
            <Input
              type="number"
              value={simUsage.minutesEmpath}
              onChange={(e) =>
                setSimUsage({
                  ...simUsage,
                  minutesEmpath: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Premium voice minutes</Label>
            <Input
              type="number"
              value={simUsage.premiumMinutes}
              onChange={(e) =>
                setSimUsage({
                  ...simUsage,
                  premiumMinutes: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Automations count</Label>
            <Input
              type="number"
              value={simUsage.automations}
              onChange={(e) =>
                setSimUsage({
                  ...simUsage,
                  automations: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <SimulatedBreakdown company={simCompany} usage={simUsage} />
        <DialogFooter>
          <Button variant="secondary" onClick={() => setSimModalOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
