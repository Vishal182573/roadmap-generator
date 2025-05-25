import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    return {
      user: verified.payload
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
} 