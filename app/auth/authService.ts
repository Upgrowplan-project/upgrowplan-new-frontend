// app/auth/authService.ts
import axios from "axios";
import { API_BASE } from "./../apiConfig";



export interface JwtResponse {
  token: string;
  refreshToken: string;
  email: string;
}

async function handleRequest<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Ошибка запроса");
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<JwtResponse> {
  try {
    const res = await handleRequest<JwtResponse>(
      axios.post(`${API_BASE}/auth/login`, { email, password })
    );
    localStorage.setItem("token", res.token);
    localStorage.setItem("refreshToken", res.refreshToken);
    return res;
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    throw err;
  }
}

export async function registerByEmail(email: string, password: string): Promise<{ message: string }> {
  const payload = { email, password };
  try {
    const response = await handleRequest<{ message: string }>(
      axios.post(`${API_BASE}/auth/register`, payload)
    );
    return response;
  } catch (error: any) {
    console.error("Register error:", error?.response?.data || error.message);
    throw error;
  }
}



export async function registerByPhone(phone: string, password: string) {
  return handleRequest(
    axios.post(`${API_BASE}/auth/register-phone`, { phone, password })
  );
}


// --- методы для работы с профилем пользователя ---
export interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  avatarUrl?: string;
  balance?: number;
  tokens?: number;
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string;

  // расширенные поля
  userType?: "INDIVIDUAL" | "LEGAL"; // Физ / Юр лицо
  role?: "USER" | "ADMIN";           // статус
  phone?: string;                    // телефон
  country?: string;                  // страна

  // юридические данные
  companyName?: string;
  companyTaxId?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legalAddress?: string;
  bankName?: string;
  bik?: string;
  accountNumber?: string;
  correspondentAccount?: string;
}



export async function getUserProfile(): Promise<UserProfile> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен не найден");
  }
  console.log(API_BASE)
  console.log("Токен пользователя:", token);
  
  return handleRequest(
    axios.get(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}




export async function updateUserProfile(profile: Partial<UserProfile>) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен не найден");
  }

  console.log("📤 Отправляем профиль на сервер:", profile);

  try {
    const response = await axios.put(`${API_BASE}/users/me`, profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📥 Ответ от сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Ошибка при обновлении профиля:", error);
    throw error;
  }
}


// --- метод для загрузки аватара (эндпоинт пока условный, нужно добавить на бэке) ---
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  return handleRequest(
    axios.post(`${API_BASE}/users/me/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}

export const logout = async () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    await axios.post(
      `${API_BASE}/auth/logout`,
      { refreshToken },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Ошибка при выходе", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};


export interface OAuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

export async function oauthLogin(
  email: string,
  fullname: string,
  provider: string
): Promise<OAuthResponse> {
  return handleRequest(
    axios.post(`${API_BASE}/auth/oauth`, null, {
      params: { email, fullname, provider },
    })
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectType = "BUSINESS_PLAN" | "MARKET_RESEARCH" | "DEEP_RESEARCH" | "FINANCIAL_MODEL";
export type ProjectStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface Project {
  id: number;
  type: ProjectType;
  title: string;
  status: ProjectStatus;
  summary?: string;
  fileUrl?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  total: number;
  plans: number;
  research: number;
  deepResearch: number;
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProjects(): Promise<Project[]> {
  return handleRequest(
    axios.get(`${API_BASE}/projects`, { headers: authHeader() })
  );
}

export async function getProjectStats(): Promise<ProjectStats> {
  return handleRequest(
    axios.get(`${API_BASE}/projects/stats`, { headers: authHeader() })
  );
}

export async function createProject(
  title: string,
  type: ProjectType,
  externalId?: string,
  summary?: string
): Promise<Project> {
  return handleRequest(
    axios.post(`${API_BASE}/projects`, { title, type, externalId, summary }, { headers: authHeader() })
  );
}

export async function deleteProject(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/projects/${id}`, { headers: authHeader() });
}

// ─────────────────────────────────────────────────────────────────────────────

export const deleteAccount = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.delete(`${API_BASE}/auth/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
  } catch (err) {
    console.error("Ошибка при удалении аккаунта", err);
    throw err;
  }
};


