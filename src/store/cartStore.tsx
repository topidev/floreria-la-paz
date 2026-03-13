// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartStore } from '../types/types';
import { toast } from 'sonner';
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

            const mergedItems = fbItems.map(fb => {
              const detail = details.find((d: any) => d._id == fb.productId)
              return { ...detail, quantity: fb.quantity }
            })

            console.log('Combinación de carritos', mergedItems)
            set({ items: mergedItems })
            // toast.info('Carrito cargado desde tu cuenta');
          }
        } catch (err) {
          console.error('Error cargando cart:', err);
        }
      },
      addItem: async (item: CartItem, uid?: string) => {
        const currentItems = get().items
        let updatedItems: CartItem[]

        const existing = get().items.some(i => i._id === item._id);
        if (existing) {
          updatedItems = currentItems.map(i =>
            i._id === item._id ? {
              ...i, quantity: i.quantity + item.quantity
            } : i
          )
        } else {
          updatedItems = [...currentItems, { ...item, quantity: item.quantity || 1 }]
        }
        set({ items: updatedItems })

        if (!uid) {
          toast.success('Producto agregado al carrito');
        }

        if (uid) {
          try {
            set({ isSyncing: true })
            await syncCart(uid, updatedItems)
            toast.success('Producto agregado y sincronizado');
          } catch (err) {
            console.error('Sync inmediato falló en addItem', err);
            toast.error('Producto agregado localmente, sincronización pendiente...');
          } finally {
            set({ isSyncing: false });
          }
        }
      },
      removeItem: async (id: string, uid?: string) => {
        const updatedItems = get().items.filter(i => i._id !== id);
        set({ items: updatedItems });

        if (uid) {
          try {
            set({ isSyncing: true });
            await syncCart(uid, updatedItems);
            toast.success('Producto eliminado y sincronizado');
          } catch (err) {
            console.error('Sync remove falló', err);
            toast.error('Eliminado localmente, sincronizando en segundo plano...');
          } finally {
            set({ isSyncing: false });
          }
        } else {
          toast.success('Producto eliminado');
        }
      },

      updateQuantity: async (id: string, quantity: number, uid?: string) => {
        const updatedItems = get().items.map(i =>
          i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        );
        set({ items: updatedItems });

        console.log('Actualizando cantidad')
        console.log(uid)
        if (uid) {
          console.log('Si hay usuario')
          try {
            set({ isSyncing: true });
            await syncCart(uid, updatedItems);
            console.log('Cantidad Actualizada')
          } catch (err) {
            console.error('Sync update falló', err);
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      clearAndSync: async (uid: string) => {
        set({ items: [] });
        if (uid) await syncCart(uid, []);
      },
      clearCart: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'cart-storage',
      // skipHydration: true,
    }
  )
);