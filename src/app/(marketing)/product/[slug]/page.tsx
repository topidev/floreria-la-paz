// Product Details
// src/app/product/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { client } from '../../../../sanity/client';
import { urlFor } from '../../../../sanity/helpers';
import { productBySlugQuery } from '../../../../sanity/helpers';
import Image from 'next/image';
import AddToCartButton from '../../../../components/AddToCartButton'; // este sí puede ser 'use client'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await client.fetch(productBySlugQuery, { slug });
  if (!product) return { title: 'Producto no encontrado' };

  return {
    title: product.title,
    description: product.seoDescription || product.description?.[0]?.children?.[0]?.text || '',
    openGraph: {
      images: product.mainImage ? urlFor(product.mainImage).width(1200).url() : null,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await client.fetch(productBySlugQuery, { slug });

  if (!product) notFound();
  
  console.log(product)
  const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal grande */}
            {mainImage && (
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={urlFor(mainImage).width(800).fit('max').auto('format').url()}
                  alt={mainImage.alt || product.title}
                  fill
                  className="object-cover"
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.isOnSale && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-white px-3 py-1 text-lg">
                    Oferta
                  </Badge>
                )}
              </div>
            )}

            {/* Thumbnails de las demás imágenes */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img: any, index: number) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      img.isMain || (!mainImage && index === 0) ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={urlFor(img).width(200).fit('crop').url()}
                      alt={img.alt || `${product.title} - imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                ${product.isOnSale ? product.salePrice : product.price} MXN
              </span>
              {product.isOnSale && product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.price} MXN
                </span>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              {product.description?.map((block: any, i: number) => (
                <p key={i}>{block.children?.[0]?.text}</p>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="font-medium">Stock:</span>
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                </Badge>
              </div>

              {product.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat: any) => (
                    <Badge key={cat._id} variant="secondary">
                      {cat.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}