export interface VoiceClone {
  id?: string | number;
  name: string;
  description: string;
  language: string;
  audio_file?: File;
  status: "ready" | "processing" | "failed";
  audio_sample?: string;
  created_at?: string;
  training_progress?: number;
  quality?: string;
  duration?: string;
  provider_voice_id?: string;
  is_active: boolean;
  total_uses?: number;
  success_rate?: number;
  last_used?: string | null;
}

export interface FormData {
  name: string;
  description: string;
  language: string;
  audio_file: File | null;
}

export interface NavigationItem {
  title: string;
  icon: string;
  description: string;
  to: string;
  tabId: number;
}
