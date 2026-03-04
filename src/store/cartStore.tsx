// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartStore } from '../types/types';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { client } from '@/studio/client';
import { getCartFromFirebase, syncCart } from '@/lib/firebaseService';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      loadCart: async (uid: string) => {
        try {
          const fbItems = await getCartFromFirebase(uid)
          if (fbItems.length > 0) {
            const query = `
              *[_type == "product" && _id in $ids] {
                _id,
                title,
                price,
                "thumbnail": thumbnail.asset->url
              }
            `
            const details = await client.fetch(query, {ids: fbItems.map(i => i.productId)})

            const mergedItems = fbItems.map(fb => {
              const detail = details.find((d:any) => d._id == fb.productId)
              return { ...detail, quantity: fb.quantity }
            })
            set({ items: mergedItems })
            toast.info('Carrito cargado desde tu cuenta');
          }
        } catch (err) {
          console.error('Error cargando cart:', err);
        }
      },
      addItem: (item) => {
        const existing = get().items.some(i => i._id === item._id);
        if (existing) {
          set({
            items: get().items.map(i =>
              i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
        toast.success('Producto agregado al carrito');
      },
      removeItem: (_id) => set({ items: get().items.filter(i => i._id !== _id) }),
      updateQuantity: (_id, quantity) => 
        set({
          items: get().items.map(i => (i._id === _id ? { ...i, quantity } : i)),
      }),        
      clearCart: () => set({ items: [] }),
      getDebouncedSync: (uid: string) => useDebouncedCallback(
        async (currentItems: CartItem[]) => {
            if (!uid) return
            
            try {
              set({ isSyncing: true })
              await syncCart(uid, currentItems);
              set({ isSyncing: false });
            } catch(err) {
              console.error('Sync falló:', err);
              toast.error('No se pudo sincronizar el carrito');
              set({ isSyncing: false });
            }
          }, 5000, { maxWait: 15000 }
        ),
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);