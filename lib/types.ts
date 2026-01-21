/**
 * 🛡️ AFRIDAM CLINICAL AUTH TYPES (Rule 7 Sync)
 * Version: 2026.1.6 (Unwrapped Interceptor Sync)
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
  // 🛡️ Rule 7 Sync: Matches User model in schema.prisma
  sex: string; 
  phoneNo: string;
  password: string;
  nationality?: string;
}

/**
 * 🚀 THE FIX: UNWRAPPED AUTH RESPONSE
 * Rule 7: Matches the data shape AFTER the api-client interceptor 
 * strips the NestJS 'resultData' wrapper.
 */
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    sex: string;
    phoneNo: string;
    role?: string;
  };
}

/** 🛡️ RE-ENFORCED: Profile Update Type **/
export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  nationality?: string;
  // Rule 7: These match the Profile model in Prisma linked via AnalyzerService
  ageRange?: number;
  skinToneLevel?: string; // Synced with 'Fitzpatrick Level' in AnalyzerService
  primaryConcern?: string;
  knownSkinAllergies?: string[];
  previousTreatments?: string[];
}