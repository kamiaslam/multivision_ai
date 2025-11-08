import { NavigationItem } from './types';

export const navigation: NavigationItem[] = [
  {
    title: "Basic Info",
    icon: "info",
    description: "Voice name, description, and language",
    to: "basic-info",
    tabId: 1,
  },
  {
    title: "Audio Upload",
    icon: "microphone",
    description: "Upload or record audio sample",
    to: "audio-upload",
    tabId: 2,
  },
];
