import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";


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
  _id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail: {
    alt: string,
    asset: {
      metadata: {
        lqip: string,
      },
      url: string,
    }
  };
}

export interface CartStore {
  items: CartItem[];
  isSyncing: boolean;
  loadCart: (uid: string) => void;
  addItem: (item: CartItem, uid?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // getDebouncedSync: (uid: string) => DebouncedState<(currentItems: CartItem[]) => Promise<void> | undefined>;
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


/* --------------------------------
       useProductsFilters.ts
-------------------------------- */

export type Filters = {
  search: string
  category: string
  offer: boolean
}


/* --------------------------------
       favoritesStore.ts
-------------------------------- */
export interface FavoriteState {
  favoriteIds: Set<string>;           // Set para no repetidos
  isLoading: boolean;
  error: string | null;

  // Acciones
  loadFavorites: (uid: string) => Promise<void>;
  toggleFavorite: (productId: string, uid: string) => Promise<void>;
}



/* --------------------------------
       account.ts Navbar
-------------------------------- */
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarNavProps {
  items: NavItem[];
  userName?: string | null
}



/* --------------------------------
       favorites.ts acccount
-------------------------------- */
export interface FavoriteProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  isOnSale: boolean;
  salePrice: number;
  slug: string;
  thumbnail: {
    alt: string,
    asset: {
      metadata: {
        lqip: string,
      },
      url: string,
    }
  };
}