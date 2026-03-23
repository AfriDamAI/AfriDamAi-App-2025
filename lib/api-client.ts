import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse, Chat, Message, User, CreateUserProfileDto, UpdateUserProfileDto, UserProfile } from "@/lib/types";
import { getCountryIsoCode } from "@/lib/country-utils";

/**
 * 🛡️ AFRIDAM INFRASTRUCTURE SYNC
 * Version: 2026.01.26
 * Fix: Forced token sanitation to prevent double-quote JSON errors.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://afridam-backend-prod-107032494605.us-central1.run.app/api";
const aiURL = "https://afridam-ai2-api-131829695574.us-central1.run.app/api/v1";

// 🖼️ ASSET HIERARCHY: Synced with Google Cloud Storage / NestJS static uploads
export const STORAGE_BASE_URL = "https://afridam-backend-prod-107032494605.us-central1.run.app/";

/** 🖼️ HELPER: Generates a full URL for clinical assets stored on the backend **/
export const getImageUrl = (path?: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("data:")) return path; // Handle base64 previews
  // Ensure we don't double slash
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${STORAGE_BASE_URL}${cleanPath}`;
};

// 🧼 HELPER: Ensures the token is a clean string (No double quotes)
const sanitizeToken = (token: string | null): string | null => {
  if (!token) return null;
  // Remove any leading/trailing double quotes that cause NestJS 400 errors
  return token.replace(/^"|"$/g, '');
};

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});

/** 🛡️ RULE 3: REQUEST GATEKEEPER **/
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const rawToken = localStorage.getItem("token");
      const token = sanitizeToken(rawToken);
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** 🔐 SECURITY HANDSHAKE **/
export const setAuthToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    const cleanToken = sanitizeToken(token);
    
    if (cleanToken) {
      localStorage.setItem("token", cleanToken);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${cleanToken}`;
    } else {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }
};

/** 🛡️ RULE 3 & 4: RESPONSE INTERCEPTOR **/
apiClient.interceptors.response.use(
  (response) => {
    // NestJS 'resultData' unwrap logic
    if (response.data && response.data.resultData) {
      return { ...response, data: response.data.resultData };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/** 🔑 AUTH ENDPOINTS **/
export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/user/login", credentials);
  return response.data;
};

export const register = async (userData: CreateUserDto) => {
  const { country, ...rest } = userData as any;
  const payload = { ...rest, nationality: country || "Nigerian" };
  const response = await apiClient.post("/auth/user/register", payload);
  return response.data;
};

export const verifyRegister = async (email: string, code: string) => {
  const response = await apiClient.post("/auth/register/verify", { email, code });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await apiClient.post("/auth/reset-password", { token, newPassword });
  return response.data;
};

/** 👤 USER PROFILE HANDSHAKE **/
export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const getUserMe = async (): Promise<User> => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, updates: any) => {
  const response = await apiClient.put(`/users/${id}`, updates);
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createUserProfile = async (profileData: CreateUserProfileDto): Promise<UserProfile> => {
  const response = await apiClient.post("/profile", profileData);
  return response.data;
};

export const updateUserProfile = async (profileData: UpdateUserProfileDto): Promise<UserProfile> => {
  const response = await apiClient.put("/profile", profileData);
  return response.data;
};

export const skipOnboarding = async () => {
  const response = await apiClient.post("/profile/skip-onboarding");
  return response.data;
};

/** 💬 Multi-User Chat Endpoints **/
export const initiateChat = async (participant1Id: string, participant2Id: string): Promise<Chat> => {
  const response = await apiClient.post("/chats", { participant1Id, participant2Id });
  return response.data;
};

export const getCurrentUserChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get("/chats/me");
  return response.data;
};

export const getChatById = async (chatId: string): Promise<Chat> => {
  const response = await apiClient.get(`/chats/${chatId}`);
  return response.data;
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const response = await apiClient.get(`/chats/${chatId}/messages`);
  return response.data;
};

export const sendUserChatMessage = async (
  chatId: string,
  senderId: string,
  message: string = "",
  type: string = 'TEXT',
  attachmentUrl: string = "",
  mimeType: string = "",
  fileSize: number = 0,
  duration: number = 0
): Promise<Message> => {
  const response = await apiClient.post("/chats/messages", {
    chatId,
    senderId,
    message,
    type,
    attachmentUrl,
    mimeType,
    fileSize,
    duration
  });
  return response.data;
};
export const uploadFile = async (file: File): Promise<{ url: string; mimeType: string; size: number }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  const response = await apiClient.patch(`/chats/messages/${messageId}/read`);
  return response.data;
};

/** 👨‍⚕️ Specialists Endpoints **/
export const getAllSpecialists = async () => {
  const response = await apiClient.get("/specialists");
  return response.data;
};

export const getSpecialistById = async (id: string) => {
  const response = await apiClient.get(`/specialists/${id}`);
  return response.data;
};


/** 🔬 AI SCAN MODULE **/
// export async function uploadImage(file: File | string): Promise<any> {
//   const formData = new FormData();
//   if (typeof file === 'string') {
//     try {
//       const parts = file.split(',');
//       const byteString = atob(parts[1]);
//       const mimeString = parts[0].split(':')[1].split(';')[0];
//       const ab = new ArrayBuffer(byteString.length);
//       const ia = new Uint8Array(ab);
//       for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
//       const blob = new Blob([ab], { type: mimeString });
//       formData.append("file", blob, "scan_capture.jpg");
//     } catch (e) { console.error("Image Processing Error:", e); }
//   } else {
//     formData.append("file", file);
//   }
//   // Default AI context
//   formData.append("more_info", JSON.stringify({
//     region: "West Africa",
//     country: "Nigeria",
//     known_skintone_type: "not_specified",
//     gender: "female", 
//     age: 25,
//     known_allergies: [], 
//     user_activeness_on_app: "moderate" 
//   }));
  
//   const response = await axios.post(`${aiURL}/skin-diagnosis`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// }

export const analyzeIngredients = async (ingredients: string, more_info: any) => {
  const response = await apiClient.post("/v2/ingredients-analysis", { query: ingredients, more_info });
  return response.data;
};

export const sendAnalyzerChatMessage = async (message: string, more_info: any) => {
  const response = await apiClient.post("/v2/chatbot", { query: message, more_info });
  return response.data;
};

/** 💳 PAYMENTS & MARKETPLACE **/
export const initializePayment = async (data: any) => {
  const response = await apiClient.post("/transaction/initiate", data);
  return response.data;
};

export const verifyPayment = async (transactionId: string) => {
  const response = await apiClient.post(`/transaction/${transactionId}/verify`);
  return response.data;
};

export const getProducts = async () => {
  // get products from the backend
  const response = await apiClient.get("/products");
  return response.data;
};

export const getScanHistory = async (userId: string) => {
  const response = await apiClient.get(`/v2/result/${userId}`); 
  return response.data;
};

export const getSingleScanResult = async (resultId: string) => {
  // 🛡️ API SYNC: Using GET /v2/{id} — restricted endpoint with subscription guard
  const response = await apiClient.get(`/v2/${resultId}`);
  return response.data;
};

export const deleteScanResult = async (resultId: string) => {
    // 🛡️ API CHANGE: Endpoint updated to match user request (DELETE /api/v2/:id)
    const response = await apiClient.delete(`/v2/${resultId}`); 
    return response.data;
};

/** 🔬 AI SKIN DIAGNOSIS WITH USER CONTEXT **/
export const analyzeSkinWithUserData = async (imgSource: string, userContext: any) => {
  const formData = new FormData();
  
  // Convert base64 to blob
  const parts = imgSource.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: mimeString });
  
  formData.append("file", blob, "scan_capture.jpg");
  // Create a default user context for AI analysis based on successful Postman request
  const defaultUserContext = {
    region: userContext.region || "West Africa",
    country: getCountryIsoCode(userContext.country || "NG"),
    known_skintone_type: userContext.skinType || "string",
    skin_type_last_time_checked: userContext.updatedAt || "9999-01-01T10:38:38.511Z",
    known_skin_condition: userContext.primaryConcern || "none",
    skin_condition_last_time_checked: userContext.updatedAt || "9999-01-01T19:25:48.468Z",
    gender: (userContext.sex || "female").toLowerCase(),
    age: userContext.ageRange || 25,
    known_body_lotion: userContext.bodyLotion || "string",
    known_body_lotion_brand: userContext.bodyLotionBrand || "string",
    known_allergies: userContext.knownSkinAllergies || [],
    known_last_skin_treatment: userContext.lastSkinTreatment || "9999-01-01T21:11:39.461Z",
    known_last_consultation_with_afridermatologists: userContext.lastConsultation || "9999-01-01T12:14:05.225Z",
    user_activeness_on_app: "very_high",
  };
  formData.append("more_info", JSON.stringify(defaultUserContext));
  
  const response = await apiClient.post("/v2/skin-diagnosis", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

/** 📅 APPOINTMENTS MODULE **/

export const getAppointmentById = async (id: string): Promise<any> => {
  const response = await apiClient.get(`/appointments/${id}`);
  return response.data;
};

export const joinAppointmentSession = async (id: string): Promise<{ meetLink: string }> => {
  const response = await apiClient.get(`/appointments/${id}/join`);
  return response.data;
};

export const checkAppointmentEligibility = async () => {
  const response = await apiClient.get("/appointments/eligibility");
  return response.data;
};

export const createAppointment = async (data: {
  subscriptionId?: string;
  specialty: "DERMATOLOGIST" | "CONSULTANT";
  scheduledAt: string;
  notes?: string;
}) => {
  const response = await apiClient.post("/appointments", data);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await apiClient.get("/appointments");
  return response.data;
};

export const getActiveAppointmentWith = async (otherUserId: string): Promise<any> => {
  const response = await apiClient.get(`/appointments/active-with/${otherUserId}`);
  return response.data;
};

export const createMeetForAppointment = async (otherUserId: string): Promise<{ meetLink: string; appointmentId: string }> => {
  const response = await apiClient.post('/appointments/create-meet', { otherUserId });
  return response.data;
};

export const getAppointmentPricing = async () => {
  const response = await apiClient.get("/appointments/pricing");
  return response.data;
};

export const getUserSubscriptions = async () => {
  const response = await apiClient.get("/subscriptions");
  return response.data;
};

export default apiClient;

