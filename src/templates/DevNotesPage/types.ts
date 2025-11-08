export interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
  status: string;
  lastUpdated: string;
}

export interface IntegrationGuide {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  category: string;
}

export interface TroubleshootingItem {
  issue: string;
  solution: string;
  category: string;
  severity: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  type: string;
  description: string;
  category: string;
}
