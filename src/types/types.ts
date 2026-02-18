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
          CartStore.ts
-------------------------------- */
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
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