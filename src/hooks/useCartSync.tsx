// src/hooks/useCartSync.ts
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useCartStore } from '@/store/cartStore';
import { syncCart } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useCartSync(uid?: string) {
    const { user } = useAuth();
    const auth = uid ?? user?.uid
    const items = useCartStore(s => s.items);

    const debouncedSync = useDebouncedCallback(
        async (currentItems) => {
            if (!auth) return;
            try {
                useCartStore.setState({ isSyncing: true })
                await syncCart(auth, currentItems);
            } catch (error) {
                console.error('Error al sincronizar carrito con Firebase:', error);
                toast.error('No se pudo sincronizar el carrito. Intenta de nuevo más tarde.');
            } finally {
                useCartStore.setState({ isSyncing: false })
            }
        },
        6000,
        {
            maxWait: 15000, // máximo 12s de espera acumulada
            leading: false, // no ejecutar inmediatamente al primer cambio
            trailing: true,  // ejecutar al final del periodo de inactividad
        }
    );

    useEffect(() => {
        if (!auth || items.length === 0) {
            debouncedSync.cancel()
            return
        }
        debouncedSync(items);
        return () => debouncedSync.cancel();
    }, [items, auth, debouncedSync]);

    const isSyncing = useCartStore((state) => state.isSyncing);

    return { isSyncing };
}