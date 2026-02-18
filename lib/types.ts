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
  // 🛡️ Rule 6 Sync: Matches User model in schema.prisma
  sex: string; 
  phoneNo: string;
  password: string;
  nationality?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: string;
  phoneNo: string;
  role: string;
  onboardingCompleted: boolean;
  subscriptionTier?: string;
  profile?: {
    nationality?: string;
    age?: number;
    skinType?: string;
    skinCondition?: string;
    bodyLotion?: string;
    bodyLotionBrand?: string;
    allergies?: string[];
    lastSkinTreatment?: string;
    lastConsultation?: string;
    [key: string]: any;
  };
}

/**
 * 🚀 THE SYNERGY FIX: WRAPPED AUTH RESPONSE
 * Synced with the 2026 NestJS 'resultData' Envelope.
 */
export interface AuthResponse {
  message: string;
  statusCode: number;
  resultData: {
    accessToken: string;
    refreshToken: string;
    isActive: boolean;
    displayName:string;
    role: string;
    user: User;
  };
}

export interface Chat {
  id: string;
  participant1Id: string;
  participant2Id: string;
  // Add other chat properties as they become known from the backend
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: Message; // Optional, might be populated for chat list previews
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  timestamp: string; // Assuming ISO string date
  read?: boolean; // Optional, for read status
}

/** 🛡️ RE-ENFORCED: Profile Update Type **/
export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  nationality?: string;
  // Rule 6: These match the Profile model in Prisma linked via AnalyzerService
  ageRange?: number;
  skinToneLevel?: string; // Synced with 'Fitzpatrick Level' in AnalyzerService
  primaryConcern?: string;
  knownSkinAllergies?: string[];
  previousTreatments?: string[];
}

// 🛡️ CART & ORDER TYPES
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