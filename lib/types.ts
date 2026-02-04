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
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      sex: string;
      phoneNo: string;
    };
  };
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