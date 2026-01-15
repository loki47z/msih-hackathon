import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: { name: string; email: string; password: string; role: 'customer' | 'business'; businessName?: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isBusiness: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedUser = localStorage.getItem("mw_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.name) {
          const users = JSON.parse(localStorage.getItem("mw_users") || "[]");
          const userExists = users.find((u: any) => u.id === parsedUser.id && u.email === parsedUser.email);
          if (userExists) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("mw_user");
          }
        }
      } catch (e) {
        localStorage.removeItem("mw_user");
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mw_user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (err) {
            console.error("Failed to parse user data from storage event");
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const users = JSON.parse(localStorage.getItem("mw_users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("mw_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (data: { name: string; email: string; password: string; role: 'customer' | 'business'; businessName?: string }) => {
    if (typeof window === 'undefined') return;
    
    const users = JSON.parse(localStorage.getItem("mw_users") || "[]");
    const newUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      businessName: data.businessName || null,
    };
    
    users.push(newUser);
    localStorage.setItem("mw_users", JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem("mw_user", JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("mw_user");
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isBusiness: user?.role === 'business',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
