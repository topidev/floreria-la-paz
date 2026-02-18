// src/app/cart/page.tsx
'use client';

import { useCartStore } from '../../../store/cartStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';


export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  

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
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Tu carrito</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Lista de items */}
        <div className="md:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 border-b pb-6">
              <div className="relative h-32 w-32 shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover rounded" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-xl">{item.title}</h3>
                <p className="text-lg font-semibold text-primary mt-1">
                  ${item.price.toLocaleString('es-MX')}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border rounded">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                      -
                    </Button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>
                  <Button variant="ghost" className="text-destructive" onClick={() => removeItem(item.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="md:col-span-1">
          <Card className="sticky top-20 p-6">
            <h3 className="text-xl font-semibold mb-6">Resumen del pedido</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>${total().toLocaleString('es-MX')} MXN</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Envío estimado</span>
                <span>Calculado en checkout</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total().toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
            <Button className="w-full mt-8" size="lg">
              Proceder al pago
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}