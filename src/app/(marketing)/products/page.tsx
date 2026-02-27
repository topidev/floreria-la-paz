// Products - Catalog
// src/app/products/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/src/sanity/client';
// import { allProductsQuery } from '../../../sanity/helpers';
import { allProductsQuery } from '@/src/sanity/helpers';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import AddToCartButton from '@/src/components/AddToCartButton';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const result = await client.fetch(allProductsQuery);
        console.log(result)
        return result;
      } catch (err) {
        console.error('Error fetching Sanity:', err);
        throw err;
      }
    },
  });

  useEffect(() => {
    console.log(products)
  }, [products])

  if (isLoading) {
    return (
      <section className="flex justify-center w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Catálogo</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-3/4 w-full" /> {/* imagen */}
                <CardFooter className="flex flex-col p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" /> {/* título */}
                  <Skeleton className="h-5 w-1/3" /> {/* precio */}
                  <Skeleton className="h-10 w-full" /> {/* botón */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container m-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Catálogo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-md transition-shadow p-0">
              <CardContent className="p-0 relative aspect-4/4">
                <Image
                  src={product.thumbnail.asset.url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  blurDataURL={product.thumbnail.asset.metadata.lqip}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  quality={75}
                />
                {product.isOnSale && (
                  <Badge className="absolute top-2 left-2 bg-destructive">Oferta</Badge>
                )}
                <Button
                  className='cursor-pointer p-0 duration-250 group absolute top-2 right-2 bg-primary-foreground rounded transition-colors'
                >
                  <Heart
                    className='h-4 w-4 duration-250 text-primary group-hover:text-secondary-foreground transition-colors'
                  />
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col p-4 items-center">
                <h3 className="text-lg lg:text-xl xl:text-2xl text-center font-medium mb-1">{product.title}</h3>
                <div className="w-full md:mt-2 flex flex-col items-center md:flex-row justify-between">
                  <p className="text-primary mb-2 text-lg md:mb-0 md:text-lg font-bold">
                    ${product.isOnSale ? product.salePrice : product.price} MXN
                  </p>
                  <AddToCartButton product={product} />
                </div>
                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link href={`/product/${product.slug}`}>Ver detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}