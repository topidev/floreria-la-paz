import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";


/* --------------------------------
          Producto Mapeado
-------------------------------- */

export interface SanityImage {
  alt?: string;
  asset: {
    url: string;
    metadata?: {
      lqip?: string;
    };
  };
}


export interface BaseProduct {
  _id: string;
  title: string;
  price: number;
  thumbnail: SanityImage;
  isAvailable?: boolean;
  stock?: number;
  slug: string;
  categories?: Array<{ title: string; slug: string }>;
  tags?: string[];
  occasions?: string[];
}

export interface Product extends BaseProduct {
  isOnSale?: boolean;
  salePrice?: number;
  images?: SanityImage;
}

export interface CartItem extends BaseProduct {
  quantity: number;
}


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

export interface CartStore {
  items: CartItem[];
  isSyncing: boolean;
  loadCart: (uid: string) => void;
  addItem: (item: CartItem, uid?: string) => void;
  removeItem: (id: string, uid?: string) => void;
  updateQuantity: (id: string, quantity: number, uid?: string) => void;
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
  price: string
  events: string
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
