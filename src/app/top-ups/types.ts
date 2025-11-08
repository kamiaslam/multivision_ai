export interface TopUp {
  id?: string | number;
  amount: number; // in cents
  status: "pending" | "completed" | "failed";
  payment_method: string;
  transaction_id?: string;
  created_at?: string;
  completed_at?: string;
  is_active: boolean;
  total_uses?: number;
  success_rate?: number;
  last_used?: string | null;
}

export interface FormData {
  amount: number;
  payment_method: string;
  description?: string;
}

export interface NavigationItem {
  title: string;
  icon: string;
  description: string;
  to: string;
  tabId: number;
}
