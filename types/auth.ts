export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface JWTPayload {
  userId: string;
  email: string;
  expiresAt: number;
}
