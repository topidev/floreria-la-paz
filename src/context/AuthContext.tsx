// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { User, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createOrUpdateUser } from '../lib/firebaseService';
import { AuthContextType } from '../types/types';
import { handleError } from '../lib/handleError';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);


      if (user) {
        toast.success('¡Bienvenido!');
        router.push('/')
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result)

      await createOrUpdateUser({
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Usuario',
        photoURL: result.user.photoURL || undefined,
      })

    } catch (error) {
      handleError(error, 'Error al iniciar sesión con Google.', 'auth')
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      handleError(error, 'No pudimos iniciar sesión.', 'auth')
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const fbUser = result.user

      // Actualiza displayName en Firebase Auth
      await updateProfile(fbUser, { displayName })

      // Guarda en Firestore
      await createOrUpdateUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        photoURL: undefined,
      })

    } catch (error) {
      handleError(error, 'Error al crear la cuenta', 'auth')
    }
  }


  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      handleError(error, "No pudimos cerrar sesión", 'auth');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};