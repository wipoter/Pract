export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  refreshCount: number;
  expiryDate: Date;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: RefreshToken;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface RegisterResponse {
  status: number;
  message: string;
}

export interface Status {
  status: Boolean;
}

export interface Friend{
  id: number;
  name: string;
  surname: string;
  birth: Date;
  remains: number;
}

export interface Profile{
  id: number;
  login: string;
  birth: Date;
  isPublic: Boolean;

}