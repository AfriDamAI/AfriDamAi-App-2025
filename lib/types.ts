/**
 * 🛡️ AFRIDAM CLINICAL AUTH TYPES (Rule 6 Synergy)
 * Version: 2026.1.9 (Full Schema Alignment)
 * Focus: High-Precision Type alignment for the Intelligence Hub.
 */

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  phoneNo: string;
  password: string;
  nationality?: string;
}

/**
 * 🚀 AUTH RESPONSE
 */
export interface AuthResponse {
  message: string;
  statusCode: number;
  resultData: {
    accessToken: string;
    refreshToken: string;
    isActive: boolean;
    displayName: string;
    role: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      sex: string;
      phoneNo: string;
      onboardingCompleted?: boolean;
      profile?: UserProfile | null;
    };
  };
}

/**
 * 🧬 USER PROFILE
 */
export interface UserProfile {
  id?: string;
  userId?: string;

  ageRange?: number;
  skinType?: string;
  skinToneLevel?: number;
  melaninTone?: string;
  primaryConcern?: string;
  environment?: string;

  avatarUrl?: string;
  allergies?: string;
  knownSkinAllergies?: string[];
  previousTreatments?: string[];

  nationality?: string;
  sex?: string;
  age?: number;
  skinCondition?: string;

  // skincare intelligence
  bodyLotion?: string;
  bodyLotionBrand?: string;
  lastSkinTreatment?: string;
  lastConsultation?: string;

  country?: string;
  region?: string;
  appActiveness?: string;
  subscriptionPlan?: string;

  prefs?: {
    clinical: boolean;
    glowCheck: boolean;
    careShop: boolean;
    quietMode: boolean;
  };

  onboardingSkipped?: boolean;
  onboardingCompleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * 👤 USER ENTITY
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: string;
  phoneNo: string;

  isActive: boolean;
  isSuspended: boolean;

  lastLoginAt?: string;
  onboardingCompleted: boolean;

  profile: UserProfile | null;

  nationality?: string;
}

/**
 * 💬 CHAT
 */
export interface Chat {
  id: string;
  participant1Id: string;
  participant2Id: string;
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: Message;
}

/**
 * 💬 MESSAGE
 */
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  message: string;

  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'MISSED_CALL' | 'SYSTEM';

  attachmentUrl?: string;
  mimeType?: string;
  fileSize?: number;
  duration?: number;

  timestamp: string;
  read?: boolean;
}

/**
 * 🔔 NOTIFICATION
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;

  icon?: React.ReactNode;
}

/**
 * 🧾 UPDATE PROFILE DTO
 */
export interface UpdateUserProfileDto {
  ageRange?: number;
  skinType?: string;
  skinToneLevel?: number;
  melaninTone?: string;
  primaryConcern?: string;
  environment?: string;
  avatarUrl?: string;
  allergies?: string;

  onboardingCompleted?: boolean;
  knownSkinAllergies?: string[];
  previousTreatments?: string[];
  onboardingSkipped?: boolean;

  bodyLotion?: string;
  bodyLotionBrand?: string;
  lastSkinTreatment?: string;
  lastConsultation?: string;
}

/**
 * 🧾 CREATE PROFILE DTO
 */
export interface CreateUserProfileDto {
  ageRange?: number;
  skinType?: string;
  skinToneLevel?: number;
  melaninTone?: string;
  primaryConcern?: string;
  environment?: string;
  avatarUrl?: string;
  allergies?: string;

  onboardingCompleted?: boolean;
  knownSkinAllergies?: string[];
  previousTreatments?: string[];
  onboardingSkipped?: boolean;

  bodyLotion?: string;
  bodyLotionBrand?: string;
  lastSkinTreatment?: string;
  lastConsultation?: string;
}

/**
 * 🧾 UPDATE USER DTO
 */
export interface UpdateUserDto
  extends Partial<Omit<CreateUserDto, 'password'>> {
  nationality?: string;
  ageRange?: number;
  skinType?: string;
  skinToneLevel?: number;
  melaninTone?: string;
  primaryConcern?: string;
  environment?: string;
  avatarUrl?: string;
  allergies?: string;
  onboardingCompleted?: boolean;
  knownSkinAllergies?: string[];
  previousTreatments?: string[];
}

/**
 * 🛒 CART
 */
export interface CartItem {
  id?: string;
  cartId?: string;
  productId: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

/**
 * 📦 ORDER
 */
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  status: string;
}