// src/components/AddToCartButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '../store/cartStore';

export default function AddToCartButton({ product }: { product: any }) {
    const addItem = useCartStore((state) => state.addItem);

    console.log('Producto recibido en AddToCartButton:', {
    id: product?._id || product?.id,
    title: product?.title,
    slug: product?.slug,
  });
    return (
        <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={() => addItem({ ...product, quantity: 1 })}
            disabled={product.stock <= 0}
        >
            {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </Button>
    );
}