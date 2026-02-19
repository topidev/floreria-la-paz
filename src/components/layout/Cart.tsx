// src/components/layout/MiniCart.tsx (extracto)
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';

const MiniCart = () => {
  const { items, itemCount, total, removeItem, updateQuantity } = useCartStore();
  console.log("Objetos del carrito: ", items)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount() > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {itemCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-md sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Tu carrito ({itemCount()} items)</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[70vh] mt-6 px-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Tu carrito está vacío
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0">
                    <Image src={item.images[0].asset.url} alt={item.title} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toLocaleString('es-MX')} × {item.quantity}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-auto py-4 px-4  border-t">
          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>${total().toLocaleString('es-MX')} MXN</span>
          </div>
          <Button className="w-full mt-4" asChild>
            <Link href="/cart">Ver carrito completo</Link>
          </Button>
          <Button variant="default" className="cursor-pointer w-full mt-2">
            Proceder al pago
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MiniCart;