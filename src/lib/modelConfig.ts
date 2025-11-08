// Model configuration for the application
// This file centralizes all AI model options for better maintainability

export interface ModelOption {
  provider: string;
  simpleName: string;
  displayName: string;
}

// AI Model options
export const modelOptions: ModelOption[] = [
  { provider: "VOICECAKE", simpleName: "voicecake STS", displayName: "VoiceCake STS" },
  { provider: "OPEN_AI", simpleName: "gpt-5", displayName: "GPT 5" },
  { provider: "OPEN_AI", simpleName: "gpt-5-mini", displayName: "GPT 5 Mini" },
  { provider: "OPEN_AI", simpleName: "gpt-5-nano", displayName: "GPT 5 Nano" },
  { provider: "ANTHROPIC", simpleName: "claude-sonnet-4-20250514", displayName: "Claude Sonnet 4" },
  { provider: "OPEN_AI", simpleName: "gpt-4.1", displayName: "GPT 4.1" },
  { provider: "GOOGLE", simpleName: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash" },
  { provider: "GROQ", simpleName: "kimi-k2-instruct", displayName: "Kimi K2" },
  { provider: "SAMBANOVA", simpleName: "Llama-4-Maverick-17B-128E-Instruct", displayName: "Llama 4 Maverick (17Bx128E)" },
  { provider: "CEREBRAS", simpleName: "qwen-3-235b-a22b-thinking-2507", displayName: "Qwen3 235B Thinking" },
  { provider: "CEREBRAS", simpleName: "qwen-3-235b-a22b-instruct-2507", displayName: "Qwen3 235B Instruct" },
  { provider: "ANTHROPIC", simpleName: "claude-3-7-sonnet-latest", displayName: "Claude 3.7 Sonnet" },
  { provider: "ANTHROPIC", simpleName: "claude-3-5-sonnet-latest", displayName: "Claude 3.5 Sonnet (latest)" },
  { provider: "AMAZON_BEDROCK", simpleName: "claude-3-5-sonnet-20240620-v1", displayName: "Claude 3.5 Sonnet (Amazon Bedrock)" },
  { provider: "OPEN_AI", simpleName: "gpt-4o", displayName: "GPT 4o" },
  { provider: "SAMBANOVA", simpleName: "Qwen3-32B", displayName: "Qwen3 32B" },
  { provider: "SAMBANOVA", simpleName: "DeepSeek-R1-Distill-Llama-70B", displayName: "DeepSeek R1-Distill (Llama 3.3 70B Instruct)" },
  { provider: "CEREBRAS", simpleName: "gpt-oss-120b", displayName: "Cerebras OpenAI GPT OSS" },
  { provider: "ANTHROPIC", simpleName: "claude-3-5-haiku-latest", displayName: "Claude 3.5 Haiku (latest)" },
  { provider: "ANTHROPIC", simpleName: "claude-3-5-sonnet-20240620", displayName: "Claude 3.5 Sonnet (20240620)" },
  { provider: "ANTHROPIC", simpleName: "claude-3-haiku-20240307", displayName: "Claude 3 Haiku (20240307)" },
  { provider: "AMAZON_BEDROCK", simpleName: "claude-3-5-haiku-20241022-v1", displayName: "Claude 3.5 Haiku (Amazon Bedrock Latency Optimized)" },
  { provider: "AMAZON_BEDROCK", simpleName: "claude-3-haiku-20240307-v1", displayName: "Claude 3 Haiku (Amazon Bedrock)" },
  { provider: "GOOGLE", simpleName: "gemini-2.0-flash", displayName: "Gemini 2.0 Flash" },
  { provider: "OPEN_AI", simpleName: "gpt-4-turbo", displayName: "GPT 4 Turbo" },
  { provider: "OPEN_AI", simpleName: "gpt-4o-mini", displayName: "GPT 4o Mini" },
  { provider: "GROQ", simpleName: "llama3-8b-8192", displayName: "Llama 3 8B (8192)" },
  { provider: "GROQ", simpleName: "llama3-70b-8192", displayName: "Llama 3 70B (8192)" },
  { provider: "GROQ", simpleName: "llama-3.3-70b-versatile", displayName: "Llama 3.3 70B (versatile)" },
  { provider: "GROQ", simpleName: "llama-3.1-8b-instant", displayName: "Llama 3.1 8B (instant)" },
  { provider: "FIREWORKS", simpleName: "mixtral-8x7b-instruct", displayName: "Mixtral 8x7B" },
  { provider: "FIREWORKS", simpleName: "llama-v3p1-405b-instruct", displayName: "Llama V3.1 405B" },
  { provider: "FIREWORKS", simpleName: "llama-v3p1-70b-instruct", displayName: "Llama V3.1 70B" },
  { provider: "FIREWORKS", simpleName: "llama-v3p1-8b-instruct", displayName: "Llama V3.1 8B" }
];

// Group models by provider for better organization
export const groupedModels = modelOptions.reduce((acc, model) => {
  if (!acc[model.provider]) {
    acc[model.provider] = [];
  }
  acc[model.provider].push(model);
  return acc;
}, {} as Record<string, ModelOption[]>);

// Helper functions
export const getModelsByProvider = (provider: string): ModelOption[] => {
  return modelOptions.filter(model => model.provider === provider);
};

export const getModelBySimpleName = (simpleName: string): ModelOption | undefined => {
  return modelOptions.find(model => model.simpleName === simpleName);
};

export const getModelByDisplayName = (displayName: string): ModelOption | undefined => {
  return modelOptions.find(model => model.displayName === displayName);
};
