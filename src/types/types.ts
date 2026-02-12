import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";


/* --------------------------------
          FirebaseService.ts
-------------------------------- */
type Role = 'user' | 'admin'

export interface UserData {
    role?: Role;
    uid: string;
    email: string;
    phone?: string;
    address?: string;
    photoURL?: string;
    displayName: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}




/* --------------------------------
           AuthContext.ts
-------------------------------- */
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
}



/* --------------------------------
            HandleErros.ts
-------------------------------- */
// Tipos comunes de errores que manejaremos
export type ErrorSource = 'auth' | 'firestore' | 'network' | 'validation' | 'stripe' | 'unknown';

export interface AppError extends Error {
    code?: string;
    source?: ErrorSource;
    userMessage?: string;
}