export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  email_verified_at: string | null;
  last_login: string | null;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
}
