// lib/auth.ts
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(user: IUser) {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return { authorized: false, message: 'Authentication token required' };
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { authorized: false, message: 'Invalid or expired token' };
  }
  
  return { authorized: true, user: decoded };
}

export function requireRole(req: NextRequest, roles: string[]) {
  const authResult = requireAuth(req);
  
  if (!authResult.authorized) {
    return authResult;
  }
  
  const user = authResult.user as jwt.JwtPayload;
  if (!user || typeof user !== 'object' || !('role' in user) || !roles.includes(user.role as string)) {
    return { authorized: false, message: 'Unauthorized access' };
  }
  
  return authResult;
}