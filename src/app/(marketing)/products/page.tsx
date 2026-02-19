// Products - Catalog
// src/app/products/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '../../../sanity/client';
import { urlFor, allProductsQuery } from '../../../sanity/helpers';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const result = await client.fetch(allProductsQuery);
        console.log('Resultado crudo de Sanity:', result); // ← debug clave
        return result;
      } catch (err) {
        console.error('Error fetching Sanity:', err);
        throw err;
      }
    },
  });

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
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Catálogo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0 relative aspect-4/4">
                <Image
                  src={urlFor(product.mainImage).url()}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  quality={75}
                />
                {product.isOnSale && (
                  <Badge className="absolute top-2 right-2 bg-destructive">Oferta</Badge>
                )}
              </CardContent>
              <CardFooter className="flex flex-col p-4 items-center">
                <h3 className="text-lg font-medium mb-1">{product.title}</h3>
                <p className="text-primary font-bold">
                  ${product.isOnSale ? product.salePrice : product.price} MXN
                </p>
                <Button asChild variant="outline" className="mt-2 w-full">
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