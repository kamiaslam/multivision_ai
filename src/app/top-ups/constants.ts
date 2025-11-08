import { NavigationItem } from './types';

export interface WalletData {
  id: number;
  currency: string;
  free_minutes_limit: number;
  free_minutes_used: number;
  updated_at: string;
  user_id: number;
  premium_voice_surcharge_cents: number;
  balance_cents: number;
  free_automations_limit: number;
  free_automations_used: number;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: WalletData;
  timestamp: string;
  request_id: string;
}

export const navigation: NavigationItem[] = [
  {
    title: "Wallet",
    icon: "wallet",
    description: "Select amount and payment method",
    to: "wallet",
    tabId: 1,
  },
  {
    title: "Premium Voices",
    icon: "sounds",
    description: "Enter payment information",
    to: "premium-voices",
    tabId: 2,
  },
  // {
  //   title: "Voice Clone",
  //   icon: "volume_1",
  //   description: "Select amount and payment method",
  //   to: "/voice-clone",
  //   tabId: 3,
  // },
];
