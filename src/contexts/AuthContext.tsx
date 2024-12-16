import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  accountType: "buyer" | "agent";
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, accountType: "buyer" | "agent") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement real authentication logic here
      setUser({
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        accountType: "buyer",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        country: "USA"
      });
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Livimmo !",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, accountType: "buyer" | "agent") => {
    try {
      // TODO: Implement real signup logic here
      // Simulation d'une inscription réussie
      setUser({
        id: '1',
        email,
        firstName,
        lastName,
        accountType,
      });
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur Livimmo !",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};