/**
 * 🛡️ AFRIDAM CLINICAL AUTH TYPES
 * Standardized Data Transfer Objects for Neural Node Synchronization.
 */

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  // 🛡️ RE-ENFORCED: Strict typing for clinical scan accuracy
  sex: "MALE" | "FEMALE" | "OTHER";
  phoneNo: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  isActive: boolean;
  displayName: string;
  // 🛡️ RE-ENFORCED: Distinguishes between Patients and Doctors
  role: "USER" | "SPECIALIST" | "ADMIN";
  /** * 🚀 OGA FIX: Unique identifier needed for 
   * deep-linking history and specialist chats.
   **/
  userId: string;
  profileImage?: string;
  subscriptionPlan?: "Free" | "Starter" | "Premium" | "Clinical";
}

/** 🛡️ RE-ENFORCED: Extra interface for Profile Updates **/
export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  bio?: string;
  skinType?: string;
  concerns?: string[];
}