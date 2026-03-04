// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore } from '../types/types';
import { toast } from 'sonner';
import { client } from '@/studio/client';
import { getCartFromFirebase } from '@/lib/firebaseService';

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
                slug,
                "thumbnail": coalesce(
                  images[isMain == true][0],
                  images[0]
                ){
                  alt,
                  asset-> {
                    url,
                    metadata {
                      lqip
                    }
                  }
                }
              }
            `
            const details = await client.fetch(query, { ids: fbItems.map(i => i.productId) })

            console.log('Detalles de la consulta: ', details)

            const mergedItems = fbItems.map(fb => {
              const detail = details.find((d: any) => d._id == fb.productId)
              return { ...detail, quantity: fb.quantity }
            })

            console.log('Combinación de carritos', mergedItems)
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
      // getDebouncedSync: (uid: string) => useDebouncedCallback(
      //   async (currentItems: CartItem[]) => {
      //     if (!uid) return

      //     try {
      //       set({ isSyncing: true })
      //       await syncCart(uid, currentItems);
      //       set({ isSyncing: false });
      //     } catch (err) {
      //       console.error('Sync falló:', err);
      //       toast.error('No se pudo sincronizar el carrito');
      //       set({ isSyncing: false });
      //     }
      //   }, 5000, { maxWait: 15000 }
      // ),
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);