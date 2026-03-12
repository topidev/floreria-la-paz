// src/store/favoritesStore.ts
import { create } from 'zustand';
import { addToFavorite, removeFavorite, getUserFavorites } from '@/lib/firebaseService'; // tus funciones
import { FavoriteState } from '@/types/types';
import { toast } from 'sonner';


export const useFavoritesStore = create<FavoriteState>()(
  (set, get) => ({
    favoriteIds: new Set(),
    isLoading: false,
    error: null,

    async loadFavorites(uid) {
      if (!uid) return;
      set({ isLoading: true, error: null });
      try {
        const ids = await getUserFavorites(uid);
        set({ favoriteIds: new Set(ids), isLoading: false });
      } catch (err) {
        set({ error: 'No se pudieron cargar favoritos', isLoading: false });
      }
    },

    async toggleFavorite(productId: string, uid: string) {
      if (!uid) return;

      const currentlyFavorite = get().favoriteIds.has(productId);
      const previusIds = new Set(get().favoriteIds)
      const optimisticSet = new Set(previusIds);

      // Optimistic update
      if (currentlyFavorite) {
        optimisticSet.delete(productId);
      } else {
        optimisticSet.add(productId);
      }

      // Actualiza el corazón
      set({ favoriteIds: optimisticSet }); 

      try {
        if (currentlyFavorite) {
          await removeFavorite(productId, uid);
        } else {
          await addToFavorite(productId, uid);
        }
        toast.success(currentlyFavorite ? 'Eliminado de Favoritos' : 'Añadido a Favoritos')
      } catch (err) {
        console.error('Error en favorito:', err);
        // Rollback -> si no se pudo actualizar
        set({ favoriteIds: previusIds });
        // toast.error("No se pudo actualizar favorito")
      }
    },
  })
);