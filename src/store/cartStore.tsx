// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore } from '../types/types';
import { toast } from 'sonner';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        console.log(item)
        const existing = get().items.some(i => i._id === item._id);
        console.log("Ya está?: ", existing)
        if (existing) {
          set({
            items: get().items.map(i =>
              i._id === item._id ? {  ...i, quantity: i.quantity + item.quantity } : i
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
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'cart-storage', // persiste en localStorage
    }
  )
);