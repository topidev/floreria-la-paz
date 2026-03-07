// src/components/AddToCartButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface Props {
    product: any;
    className?: string;
}

export default function AddToCartButton({ product, className }: Props) {
    const addItem = useCartStore((state) => state.addItem);
    const { user } = useAuth()

    return (
        <Button
            size="lg"
            className={cn(
                "w-full md:w-fit text-secondary cursor-pointer shadow-accent shadow-xs flex gap-2",
                className)
            }
            onClick={() => {
                addItem({ ...product, quantity: 1, thumbnail: product.thumbnail ?? product.images[0] }, user?.uid)
            }
            }
            disabled={product.stock <= 0}
        >
            <ShoppingCart />
            {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </Button>
    );
}