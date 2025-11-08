export interface SchemaProperty {
  id?: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  format?: string;
  enum?: string[];
}

export interface Tool {
  id?: string | number;
  name: string;
  description: string;
  input_schema?: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  output_schema?: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  webhook_url?: string;
  webhook_secret?: string;
  timeout?: number | null;
  max_retries?: number;
  is_active: boolean;
  is_public: boolean;
  total_calls?: number;
  successful_calls?: number;
  success_rate?: number;
  is_healthy?: boolean;
  last_used?: string | null;
  created_at?: string;
}

export interface FormData {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  output_schema: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  webhook_url: string;
  webhook_secret: string;
  timeout: number | null;
  max_retries: number;
  is_active: boolean;
  is_public: boolean;
}

export interface NavigationItem {
  title: string;
  icon: string;
  description: string;
  to: string;
  tabId: number;
}
