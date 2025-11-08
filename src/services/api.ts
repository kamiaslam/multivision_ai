import axios from "axios";
import config from "../lib/config";
import { VoiceCloneCreate, VoiceCloneResponse } from "../types/voice";
import { 
  MRRData, 
  PAYGData, 
  UsageByBotType, 
  UsageByCountry, 
  UsersOverview,
  CustomPricingCreate,
  CustomPricingUpdate,
  CustomPricingResponse,
  EffectivePricingResponse
} from "./admin";
import { toast } from "sonner";
import {
  handleRefreshTokenExpiration,
  isRefreshTokenExpired,
  isRateLimitError,
  getErrorMessage,
  safeLogError,
  ErrorCode,
} from "../utils/authUtils";

// Utility function to handle standardized backend responses
const handleApiResponse = (response: any, fallback?: any) => {
  if (response.data && typeof response.data === 'object') {
    if (response.data.success === true && response.data.data !== undefined) {
      return response.data.data;
    }
    if (!response.data.success && response.data.message) {
      // Create a custom error that preserves the original response structure
      const error = new Error(response.data.message);
      (error as any).response = { data: response.data };
      throw error;
    }
  }
  return fallback !== undefined ? fallback : response.data;
};

const api = axios.create({
  // baseURL: "/api-proxy",
  baseURL: config.api.baseURL,
});

const simApi = axios.create({
  // baseURL: "/api-proxy",
  baseURL: config.api.simBaseURL,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
   
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => { 
    return Promise.reject(error);
  }
);

// Response interceptor for automatic token refresh and rate limiting
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle rate limiting (429 status code)
    if (isRateLimitError(error)) {
      const responseData = error.response?.data;
      
      // Use standardized error message if available
      if (responseData?.success === false && responseData?.message) {
        toast.error(responseData.message, {
          duration: 5000,
          position: "top-right"
        });
      } else {
        // Fallback to generic rate limit message
        const retryAfter = responseData?.retry_after || error.response?.headers['retry-after'] || 60;
        toast.error(
          `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`,
          {
            duration: 5000,
            position: "top-right"
          }
        );
      }
      
      return Promise.reject(error);
    }
    
    // If error is 401 and we haven't tried to refresh yet
    // Skip token refresh for authentication requests to allow proper error handling
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        const response = await authAPI.refreshToken(refreshToken);
        
        const { access_token, refresh_token } = response.success ? response.data : response;
        
        // Update tokens in localStorage
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Process queued requests
        processQueue(null, access_token);
        
        return api(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed - check if it's due to expired refresh token
        const refreshTokenExpired = isRefreshTokenExpired(refreshError);
        
        // Safe logging without exposing sensitive data
        safeLogError(refreshError, 'Token Refresh Failed');
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Handle refresh token expiration
        if (refreshTokenExpired) {
          handleRefreshTokenExpiration();
        } else {
          // For other authentication errors, show user-friendly message
          const errorMessage = getErrorMessage(refreshError);
          toast.error(errorMessage, {
            duration: 5000,
            position: "top-right"
          });
          
          // Clear tokens and redirect
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        
          setTimeout(() => {
        window.location.href = "/auth/signin";
          }, 1000);
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
); 

// Agent API functions
export const agentAPI = {
  createAgent: async (agentData: {
    name: string;
    voice_provider: string;
    voice_id: string;
    description: string;
    custom_instructions: string;
    model_provider: string;
    model_resource: string;
    agent_type: string;
    tool_ids?: string[];
  }) => {
    const response = await api.post('/agents/', agentData);
    return handleApiResponse(response);
  },
  
  getAgents: async () => {
    const response = await api.get('/agents/');
    return handleApiResponse(response, []);
  },
  
  getAgent: async (id: string) => {
    const response = await api.get(`/agents/${id}`);
    return handleApiResponse(response);
  },
  
  updateAgent: async (id: string, agentData: {
    name: string;
    voice_provider: string;
    voice_id: string;
    description: string;
    custom_instructions: string;
    model_provider: string;
    model_resource: string;
    agent_type: string;
    tool_ids?: string[];
  }) => {
    const response = await api.put(`/agents/${id}`, agentData);
    return handleApiResponse(response);
  },
  
  deleteAgent: async (id: string) => {
    const response = await api.delete(`/agents/${id}`);
    return handleApiResponse(response);
  }
};

// Tools API functions
export const toolsAPI = {
  getTools: async () => {
    const response = await api.get('/tools/');
    return handleApiResponse(response, []);
  }
};

// Auth API functions
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // Return full response for auth endpoints to access success/message
  },
  
  signup: async (email: string, username: string, password: string, full_name?: string) => {
    const response = await api.post('/auth/register', { email, username, password, full_name });
    return response.data; // Return full response for auth endpoints to access success/message
  },
  
  simsignup: async (email: string, password: string, name?: string) => {
    const response = await simApi.post("/auth/sign-up/email", {
      email,
      password,
      name,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return handleApiResponse(response);
  },
  
  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout', { refresh_token: refreshToken });
    return handleApiResponse(response);
  },
  
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return handleApiResponse(response);
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { 
      token, 
      new_password: newPassword 
    });
    return handleApiResponse(response);
  }
};


// User API functions
export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data; // Return the full response to access data.data
  },
  
  updateUser: async (userData: {
    full_name?: string;
    phone?: string;
    company?: string;
    avatar_url?: string;
  }) => {
    const response = await api.put('/users/me', userData);
    return response.data; // Return the full response to access data.data
  }
};

// LiveKit API functions
export const liveKitAPI = {
  createSession: async (agentId: string, participantName?: string) => {
    const response = await api.post('/livekit/session/start', {
      agent_id: agentId,
      participant_name: participantName || `User_${Date.now()}`
    });
    return handleApiResponse(response);
  }
};

// Call Logs API functions
export const callLogsAPI = {
  // Updated to support pagination per docs in test_redme.md
  getCallLogs: async (params?: {
    page?: number;
    page_size?: number;
    agent_id?: string | number;
    status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', String(params.page));
    if (params?.page_size !== undefined) searchParams.append('page_size', String(params.page_size));
    if (params?.agent_id !== undefined && params?.agent_id !== null) searchParams.append('agent_id', String(params.agent_id));
    if (params?.status) searchParams.append('status', params.status);
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);

    const qs = searchParams.toString();
    const response = await api.get(`/sessions/call-logs${qs ? `?${qs}` : ''}`);
    return response.data; // Return full response to access success/message/data/meta structure
  },
  
  getCallLog: async (sessionId: string) => {
    const response = await api.get(`/sessions/call-logs/${sessionId}`);
    return handleApiResponse(response);
  },
  
  downloadRecording: async (sessionId: string) => {
    const response = await api.get(`/sessions/call-logs/${sessionId}/download`);
    return response.data; // Return full response to access the download_url and other data
  },
};

// Agent Stats API functions
export const agentStatsAPI = {
  getAgentStats: async (agentId: string, days: number = 30) => {
    const response = await api.get(`/sessions/agent/${agentId}/stats?days=${days}`);
    return response.data; // Return full response to access success/message/data structure
  },
  
  exportCallLogs: async (filters?: {
    agent_name?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.agent_name) params.append('agent_name', filters.agent_name);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    
    const response = await api.get(`/sessions/call-logs/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
// Hamsa API functions
export const hamsaAPI = {
  getVoices: async (): Promise<any[]> => {
    const response = await api.get('/hamsa/voices');
    return handleApiResponse(response);
  }
};

// Hume API functions
export const humeAPI = {
  getModels: async (): Promise<any[]> => {
    const response = await api.get('/hume/getHumeModels');
    return handleApiResponse(response);
  },
  getLanguages: async (): Promise<string[]> => {
    const response = await api.get('/hume/languages');
    const data = handleApiResponse(response);
    return data.languages || [];
  },
  getVoicesByLanguage: async (language: string): Promise<any[]> => {
    const response = await api.get(`/hume/voices?language=${encodeURIComponent(language)}`);
    const data = handleApiResponse(response);
    return data.voices || [];
  }
};
// Voice Clone API functions
export const voiceCloneAPI = {
  getVoiceClones: async (): Promise<VoiceCloneResponse[]> => {
    const response = await api.get('/voice-clones/');
    return handleApiResponse(response, []);
  },
  
  getVoiceClone: async (id: string | number): Promise<VoiceCloneResponse> => {
    const response = await api.get(`/voice-clones/${id}`);
    return handleApiResponse(response);
  },
  
  createVoiceCloneWithAudio: async (data: VoiceCloneCreate, audioFile: File): Promise<VoiceCloneResponse> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('language', data.language);
    formData.append('audio_file', audioFile);
    
    const response = await api.post('/voice-clones/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return handleApiResponse(response);
  },
  
  updateVoiceClone: async (id: string | number, data: any): Promise<VoiceCloneResponse> => {
    const response = await api.put(`/voice-clones/${id}`, data);
    return handleApiResponse(response);
  },
  
  deleteVoiceClone: async (providerId: string | number): Promise<void> => {
    await api.delete(`/voice-clones/${providerId}`);
  },
};

// Voice Preview API functions
export const voicePreviewAPI = {
  getAvailableVoices: async (provider?: string): Promise<any> => {
    const params = provider ? { provider } : {};
    const response = await api.get('/voice-preview/voices', { params });
    return handleApiResponse(response);
  },
  
  generatePreview: async (provider: string, voiceId: string): Promise<any> => {
    const response = await api.get(`/voice-preview/preview`, {
      params: { provider, voice_id: voiceId }
    });
    return handleApiResponse(response);
  },
};

// Top Up API functions
export const topUpAPI = {
  getTopUps: async (): Promise<any[]> => {
    const response = await api.get('/top-ups/');
    return handleApiResponse(response, []);
  },
  
  createTopUp: async (data: any): Promise<any> => {
    const response = await api.post('/top-ups/', data);
    return handleApiResponse(response);
  },
  
  updateTopUp: async (id: string | number, data: any): Promise<any> => {
    const response = await api.put(`/top-ups/${id}/`, data);
    return handleApiResponse(response);
  },
  
  deleteTopUp: async (id: string | number): Promise<void> => {
    await api.delete(`/top-ups/${id}/`);
  },
};

// Documents API functions
export const documentsAPI = {
  uploadDocument: async (params: {
    file: File;
    title?: string;
    visibility?: string;
    tags?: string[];
    vector_store_id?: string;
    agent_id?: number | string;
  }) => {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.title) formData.append('title', params.title);
    if (params.visibility) formData.append('visibility', params.visibility);
    if (params.vector_store_id) formData.append('vector_store_id', params.vector_store_id);
    if (params.tags && params.tags.length) {
      // Send tags as JSON string to preserve array semantics
      formData.append('tags', JSON.stringify(params.tags));
    }
    if (params.agent_id !== undefined && params.agent_id !== null) {
      formData.append('agent_id', String(params.agent_id));
    }

    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getIngestionStatus: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/status`);
    return response.data;
  },

  listDocuments: async (filters?: {
    page?: number;
    page_size?: number;
    status?: string;
    visibility?: string;
    agent_id?: number | string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.page !== undefined) params.append('page', String(filters.page));
    if (filters?.page_size !== undefined) params.append('page_size', String(filters.page_size));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.visibility) params.append('visibility', filters.visibility);
    if (filters?.agent_id !== undefined && filters?.agent_id !== null) params.append('agent_id', String(filters.agent_id));
    const response = await api.get(`/documents/?${params.toString()}`);
    return response.data;
  },

  getDocument: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  },

  deleteDocument: async (documentId: string) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },

  // Optional helper for vector stores selection
  listVectorStores: async () => {
    const response = await api.get('/vector-stores/');
    return response.data;
  }
};

// Phone Numbers API functions
export const phoneNumbersAPI = {
  getPhoneNumbers: async (includeAgents: boolean = true): Promise<any> => {
    const response = await api.get('/phone-numbers/', {
      params: { include_agents: includeAgents }
    });
    return handleApiResponse(response);
  },
  
  getPhoneNumber: async (id: number): Promise<any> => {
    const response = await api.get(`/phone-numbers/${id}`);
    return handleApiResponse(response);
  },
  
  importPhoneNumber: async (data: {
    twilio_account_sid: string;
    twilio_auth_token: string;
    phone_number: string;
    label: string;
    import_type: string;
  }): Promise<any> => {
    const response = await api.post('/phone-numbers/import', data);
    return handleApiResponse(response);
  },
  
  updatePhoneNumber: async (id: number, data: { label: string }): Promise<any> => {
    const response = await api.put(`/phone-numbers/${id}`, data);
    return handleApiResponse(response);
  },
  
  assignPhoneNumber: async (id: number, agentId: number): Promise<any> => {
    const response = await api.put(`/phone-numbers/${id}/assign`, { agent_id: agentId });
    return handleApiResponse(response);
  },
  
  unassignPhoneNumber: async (id: number): Promise<any> => {
    const response = await api.put(`/phone-numbers/${id}/unassign`);
    return handleApiResponse(response);
  },
  
  deletePhoneNumber: async (id: number): Promise<void> => {
    await api.delete(`/phone-numbers/${id}`);
  },
};

export const dashboardAPI = {
  getMRRData: async (monthsBack: number = 12): Promise<MRRData> => {
    const response = await api.get(`/admin/statistics/revenue/mrr?months_back=${monthsBack}`);
    return handleApiResponse(response);
  },
  
  getPAYGData: async (monthsBack: number = 12): Promise<PAYGData> => {
    const response = await api.get(`/admin/statistics/revenue/pay-as-you-go?months_back=${monthsBack}`);
    return handleApiResponse(response);
  },

  getUsageByBotType: async (monthsBack: number = 12): Promise<UsageByBotType> => {
    const response = await api.get(`/admin/statistics/usage/by-bot-type?months_back=${monthsBack}`);
    return handleApiResponse(response);
  },

  getUsageByCountry: async (monthsBack: number = 12): Promise<UsageByCountry> => {
    const response = await api.get(`/admin/statistics/usage/by-country?months_back=${monthsBack}`);
    return handleApiResponse(response);
  },

  getUsersOverview: async (): Promise<UsersOverview> => {
    const response = await api.get('/admin/users-overview');
    return handleApiResponse(response);
  },

  toggleAutoRenew: async (subId: number, autoRenew: boolean): Promise<any> => {
    const response = await api.post(`/finance/admin/auto-renew?sub_id=${subId}&auto_renew=${autoRenew}`);
    return handleApiResponse(response);
  },

  createCustomPricing: async (pricingData: CustomPricingCreate): Promise<CustomPricingResponse> => {
    const response = await api.post('/pricing/custom', pricingData);
    return handleApiResponse(response);
  },

  updateCustomPricing: async (userId: number, botType: string, pricingData: CustomPricingUpdate): Promise<CustomPricingResponse> => {
    const response = await api.put(`/pricing/custom/user/${userId}/${botType}`, pricingData);
    return handleApiResponse(response);
  },

  getEffectivePricing: async (userId: number, botType: string): Promise<EffectivePricingResponse> => {
    const response = await api.get(`/pricing/effective/${userId}?bot_type=${botType}`);
    return handleApiResponse(response);
  },

  deleteCustomPricing: async (userId: number, botType: string): Promise<any> => {
    const response = await api.delete(`/pricing/custom/user/${userId}/${botType}`);
    return handleApiResponse(response);
  },

  getGlobalPricing: async (): Promise<any> => {
    const response = await api.get('/pricing/global');
    return handleApiResponse(response);
  },

  updateGlobalPricing: async (botType: string, pricingData: any): Promise<any> => {
    const response = await api.put(`/pricing/global/${botType}`, pricingData);
    return handleApiResponse(response);
  },

  // Traffic statistics endpoints
  getDailyTraffic: async (daysBack: number = 30): Promise<any> => {
    const response = await api.get(`/admin/statistics/traffic/daily?days_back=${daysBack}`);
    return handleApiResponse(response);
  },

  getTrafficByAgent: async (monthsBack: number = 12): Promise<any> => {
    const response = await api.get(`/admin/statistics/traffic/by-agent?months_back=${monthsBack}`);
    return handleApiResponse(response);
  },
};

export default api; 
