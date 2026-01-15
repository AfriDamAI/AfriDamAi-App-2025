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
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  isActive: boolean;
  displayName: string;
  role: string;
}