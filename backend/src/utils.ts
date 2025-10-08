import jwt, { SignOptions } from "jsonwebtoken";

export const randomString = (reqLength : number) => {
    const str = 'qwrtyuioplkjhgfdsazxcvbnm0123456789'
    const strLength = str.length;

    let randomStr = ''

    for(let i = 0; i < reqLength; i++) {
        const selected = str[Math.floor(Math.random() * strLength)]
        randomStr +=  selected
    }

    return randomStr;
}

// Helper to enforce required env vars
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

// ✅ Strict environment loading
const JWT_ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const JWT_REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");
const ACCESS_TOKEN_LIFETIME = requireEnv("ACCESS_TOKEN_LIFETIME");
const REFRESH_TOKEN_LIFETIME = requireEnv("REFRESH_TOKEN_LIFETIME");

// 🔐 Generic token signer
export function signToken(payload: object, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

// 🔑 Access token
export function createAccessToken(userId: string): string {
  return signToken({ userId }, JWT_ACCESS_SECRET, ACCESS_TOKEN_LIFETIME);
}

// ♻️ Refresh token
export function createRefreshToken(userId: string): string {
  return signToken({ userId }, JWT_REFRESH_SECRET, REFRESH_TOKEN_LIFETIME);
}
