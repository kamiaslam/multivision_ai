"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SimulateInvoiceDialogComponent } from "./simulateInvoiceDialog";
import { NewInvoiceDialogComponent } from "./newInvoiceDialog";
import { AccountPricing, AuditEvent, Pricing, UsageInputs } from "../../type";
import { API } from "../../api";
import { PAGE_DEFS, sleep } from "../../utils/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const INITIAL_INVOICES = [
  {
    id: "INV-1042",
    client: "Acme Health",
    amount: 1249,
    status: "paid",
    period: "Apr 2025",
  },
  {
    id: "INV-1043",
    client: "Delta Realty",
    amount: 89,
    status: "due",
    period: "Apr 2025",
  },
  {
    id: "INV-1044",
    client: "ZenCare Homes",
    amount: 9860,
    status: "paid",
    period: "Apr 2025",
  },
];

type CommonDialogsContextType = {
  globalPricing: Pricing | null;
  setGlobalPricing: React.Dispatch<React.SetStateAction<Pricing | null>>;
  globalDialogOpen: boolean;
  setGlobalDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  accountPricing: AccountPricing | null;
  setAccountPricing: React.Dispatch<
    React.SetStateAction<AccountPricing | null>
  >;
  accountCompany: string | null;
  setAccountCompany: React.Dispatch<React.SetStateAction<string | null>>;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  accountDialogOpen: boolean;
  setAccountDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  simModalOpen: boolean;
  setSimModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  simCompany: string | null;
  setSimCompany: React.Dispatch<React.SetStateAction<string | null>>;

  simUsage: UsageInputs;
  setSimUsage: React.Dispatch<React.SetStateAction<UsageInputs>>;

  confirmOpen: boolean;
  setConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmContext: any;
  setConfirmContext: React.Dispatch<React.SetStateAction<any>>;

  newInvOpen: boolean;
  setNewInvOpen: React.Dispatch<React.SetStateAction<boolean>>;

  newInvClient: string;
  setNewInvClient: React.Dispatch<React.SetStateAction<string>>;

  newInvPeriod: string;
  setNewInvPeriod: React.Dispatch<React.SetStateAction<string>>;

  newInvCurrency: string;
  setNewInvCurrency: React.Dispatch<React.SetStateAction<string>>;

  newInvItems: { desc: string; qty: number; unit: number }[];
  setNewInvItems: React.Dispatch<
    React.SetStateAction<{ desc: string; qty: number; unit: number }[]>
  >;
  invoices: {
    id: string;
    client: string;
    amount: number;
    status: string;
    period: string;
  }[];
  setInvoices: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        client: string;
        amount: number;
        status: string;
        period: string;
      }[]
    >
  >;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  exportCurrentPagePDF: () => Promise<void>;
  exportAllPagesPDFs: () => Promise<void>;
  audit: AuditEvent[];
  setAudit: React.Dispatch<React.SetStateAction<AuditEvent[]>>;
};

type CommonDialogsProviderProps = {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
};

const CommonDialogsContext = createContext<
  CommonDialogsContextType | undefined
>(undefined);

export const useCommonDialogs = () => {
  const ctx = useContext(CommonDialogsContext);
  if (!ctx)
    throw new Error(
      "useCommonDialogs must be used within CommonDialogsProvider"
    );
  return ctx;
};

export const CommonDialogsProvider: React.FC<CommonDialogsProviderProps> = ({
  children,
  activePage,
  setActivePage,
}) => {
  const [globalPricing, setGlobalPricing] = useState<Pricing | null>(null);
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false);

  const [accountPricing, setAccountPricing] = useState<AccountPricing | null>(
    null
  );
  const [accountCompany, setAccountCompany] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);

  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simCompany, setSimCompany] = useState<string | null>(null);
  const [simUsage, setSimUsage] = useState<UsageInputs>({
    minutesConversa: 1200,
    minutesEmpath: 800,
    premiumMinutes: 150,
    automations: 18000,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState<any>(null);

  const [newInvOpen, setNewInvOpen] = useState(false);
  const [newInvClient, setNewInvClient] = useState("");
  const [newInvPeriod, setNewInvPeriod] = useState("");
  const [newInvCurrency, setNewInvCurrency] = useState("USD");
  const [newInvItems, setNewInvItems] = useState([
    { desc: "", qty: 1, unit: 0 },
  ]);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  const [searchTerm, setSearchTerm] = useState("");
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  useEffect(() => {
    API.getGlobalPricing().then(setGlobalPricing);
    API.getAudit().then(setAudit);
  }, []);

  async function exportCurrentPagePDF() {
    const def = PAGE_DEFS.find((d) => d.key === activePage);
    if (!def) return alert("Unknown page");
    const el = document.getElementById(def.domId);
    if (!el) return alert("Nothing to export on this view");
    await exportElementToPDF(el, `voicecake-admin-${def.key}.pdf`);
  }

  async function exportAllPagesPDFs() {
    for (const def of PAGE_DEFS) {
      setActivePage(def.key);
      await sleep(450);
      const el = document.getElementById(def.domId);
      if (el) {
        await exportElementToPDF(el, `voicecake-admin-${def.key}.pdf`);
      }
    }
    alert("All page PDFs saved");
  }

  function replaceOKLCHColors(element: HTMLElement) {
    const allElements = element.querySelectorAll<HTMLElement>("*");

    allElements.forEach((el) => {
      const styles = getComputedStyle(el);

      ["color", "backgroundColor", "borderColor"].forEach((prop) => {
        const value = styles.getPropertyValue(prop);
        if (value.includes("oklch")) {
          switch (prop) {
            case "backgroundColor":
              el.style.setProperty(prop, "#ffffff");
              break;
            case "color":
            case "borderColor":
              el.style.setProperty(prop, "#000000");
              break;
          }
        }
      });
    });
  }

  async function exportElementToPDF(element: HTMLElement, filename: string) {
    replaceOKLCHColors(element);
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * (imgWidth / canvas.width);

    let y = 0;
    let remaining = imgHeight;
    const imgCanvasHeight = canvas.height;
    const imgCanvasWidth = canvas.width;

    while (remaining > 0) {
      const srcY = (imgHeight - remaining) * (imgCanvasHeight / imgHeight);
      const sliceHeight = Math.min(pageHeight, remaining);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgCanvasWidth;
      sliceCanvas.height = sliceHeight * (imgCanvasHeight / imgHeight);
      const ctx = sliceCanvas.getContext("2d");
      if (ctx)
        ctx.drawImage(
          canvas,
          0,
          srcY,
          imgCanvasWidth,
          sliceCanvas.height,
          0,
          0,
          imgCanvasWidth,
          sliceCanvas.height
        );
      const sliceData = sliceCanvas.toDataURL("image/png");
      if (y > 0) pdf.addPage();
      pdf.addImage(sliceData, "PNG", 0, 0, imgWidth, sliceHeight);
      remaining -= sliceHeight;
      y += sliceHeight;
    }
    pdf.save(filename);
  }

  return (
    <CommonDialogsContext.Provider
      value={{
        globalPricing,
        setGlobalPricing,
        globalDialogOpen,
        setGlobalDialogOpen,
        accountPricing,
        setAccountPricing,
        accountCompany,
        setAccountCompany,
        saving,
        setSaving,
        accountDialogOpen,
        setAccountDialogOpen,
        simModalOpen,
        setSimModalOpen,
        simCompany,
        setSimCompany,
        simUsage,
        setSimUsage,
        confirmOpen,
        setConfirmOpen,
        confirmContext,
        setConfirmContext,
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
        searchTerm,
        setSearchTerm,
        exportCurrentPagePDF,
        exportAllPagesPDFs,
        audit,
        setAudit,
      }}
    >
      {children}

      {/* Render all modals here */}
      <SimulateInvoiceDialogComponent />
      <NewInvoiceDialogComponent />
    </CommonDialogsContext.Provider>
  );
};
