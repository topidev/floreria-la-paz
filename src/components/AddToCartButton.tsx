// src/components/AddToCartButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '../store/cartStore';

export default function AddToCartButton({ product }: { product: any }) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <Button
            size="lg"
            className="w-full md:w-auto text-secondary cursor-pointer shadow-accent shadow-xs"
            onClick={() => addItem({ ...product, quantity: 1, thumbnail: product.thumbnail ?? null })}
            disabled={product.stock <= 0}
        >
            {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </Button>
    );
}