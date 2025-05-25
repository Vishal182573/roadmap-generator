"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Session {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in cookies on mount
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      setSession({
        user: JSON.parse(userData),
        token
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth?type=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      const newSession = {
        user: data.data.user,
        token: data.data.token,
      };
      
      // Store in cookies with 7 days expiry
      Cookies.set('token', data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7 });
      setSession(newSession);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return {
    data: context.session,
    status: context.loading ? 'loading' : context.session ? 'authenticated' : 'unauthenticated'
  };
}

export function getServerSession() {
  // This is a server-side function to verify JWT token
  // You'll need to implement this based on your JWT verification logic
  return async (req: Request) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;

    try {
      // Verify JWT token here
      // Return session object if valid
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return {
        user: data.user
      };
    } catch (error) {
      return null;
    }
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 