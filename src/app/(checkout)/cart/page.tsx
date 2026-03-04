// src/app/cart/page.tsx
'use client';

import { useCartStore } from '../../../store/cartStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCartSync } from '@/hooks/useCartSync';
import { syncCart } from '@/lib/firebaseService';


export default function CartPage() {
  const items = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const getDebouncedSync = useCartStore(s => s.getDebouncedSync)
  const { user } = useAuth()
  const { isSyncing } = useCartSync(user?.uid);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-6">Tu carrito está vacío</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Parece que no has agregado nada aún. ¡Explora nuestro catálogo!
        </p>
        <Button asChild size="lg">
          <Link href="/products">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-5 md:py-8 mx-auto">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-6 pb-4 border-b-2">Tu carrito</h1>
      {isSyncing && (
        <div className="fixed bottom-6 right-6 z-50 bg-background/90 backdrop-blur-sm border px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Sincronizando carrito...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-full">
        {/* Lista de items */}
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item._id} className="flex gap-3 md:gap-4 sm:gap-5 border-b pb-6">
              <div className="relative h-32 w-32 shrink-0">
                <Image src={item.thumbnail.asset.url} alt={item.title} fill className="object-cover rounded" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-xl">{item.title}</h3>
                <p className="text-lg font-semibold text-primary mt-1">
                  ${item.price.toLocaleString('es-MX')}
                </p>
                <div className="flex flex-col items-start md:flex-row md:items-center gap-4 mt-4">
                  <div className="flex items-center border rounded">
                    <Button className='cursor-pointer' variant="ghost" size="icon" onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>
                      -
                    </Button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <Button className='cursor-pointer' variant="ghost" size="icon" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>
                  <Button variant="ghost" className="text-primary-foreground bg-destructive cursor-pointer" onClick={() => removeItem(item._id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="md:col-span-1 lg:col-span-1">
          <Card className="sticky top-20 p-4 md:p-6 gap-5 lg:gap-6">
            <h3 className="text-xl font-semibold mb-3">Resumen del pedido</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>${total.toLocaleString('es-MX')} MXN</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Envío estimado</span>
                <span className='text-right'>Calculado en checkout</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
            <Button 
              className="w-full mt-5 cursor-pointer" 
              title='Proceder al pago' 
              size="lg"
              onClick={() => {
                if (user) {
                  syncCart(user.uid, items)
                }
              }}
            >
              Proceder al pago
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}