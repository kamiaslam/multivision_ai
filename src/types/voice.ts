export interface VoiceClone {
  id: string;
  name: string;
  description: string;
  status: "ready" | "processing" | "failed";
  audioSample: string;
  createdAt: string;
  trainingProgress: number;
  quality: string;
  duration: string;
  provider_voice_id?: string;
}

export interface VoiceCloneResponse {
  id: number;
  name: string;
  description?: string;
  language?: string;
  created_at: string;
  provider_voice_id: string;
}

export interface VoiceCloneCreate {
  name: string;
  description?: string;
  language: VoiceCloneLanguage;
}

export enum VoiceCloneLanguage {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
  ITALIAN = "it",
  PORTUGUESE = "pt",
  CHINESE = "zh",
  JAPANESE = "ja",
  KOREAN = "ko",
  ARABIC = "ar",
  HINDI = "hi",
  RUSSIAN = "ru"
}

export interface WalletInfo {
  balance_cents: number;
}

export interface VoiceCloneEligibility {
  eligible: boolean;
  eligible_type: "free" | "paid" | null;
}