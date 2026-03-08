// account/favorites.tsx
'use client'
import { getUserFavorites } from "@/lib/firebaseService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/studio/client";
import { productsByIds } from "@/studio/helpers";
import type { Product } from "@/types/types"
import Image from "next/image"
import Link from "next/link";
import { Heart } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { useEffect } from "react";


export default function FavoritesPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/')
  }, [user, router])


  const { data: favoriteIds = [], isLoading: loadingIds } = useQuery({
    queryKey: ['user-favorites', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return []
      return await getUserFavorites(user.uid)
    },
    enabled: !!user?.uid
  })

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['favorites-products', favoriteIds],
    queryFn: async () => {
      try {
        if (favoriteIds.length === 0) return []
        const result = await client.fetch(productsByIds, { ids: favoriteIds })
        console.log(result)
        return result
      } catch (error) {
        console.log(error)
        return []
      }
    },
    enabled: favoriteIds.length > 0
  })

  const isLoading = loadingIds || loadingProducts

  if (!user) return <div>Redirigiendo...</div>;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando tus favoritos...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-semibold">Aún no tienes favoritos</h2>
        <p className="mt-2 text-muted-foreground">Agrega productos que te gusten para verlos aquí</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-rose-600 px-8 py-3 text-white hover:bg-rose-700"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Mis Favoritos ({products.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <div
            key={product._id}
            className="group overflow-hidden rounded-2xl border bg-background/30 shadow-sm hover:shadow-md transition-all"
          >
            <Link href={`/product/${product.slug}`}>
              <div className="relative aspect-square overflow-hidden bg-background">
                {product.thumbnail?.asset?.url && (
                  <Image
                    src={product.thumbnail.asset.url ?? '/dessertBloom.webp'}
                    alt={product.thumbnail.alt || product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-350"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    blurDataURL={product.thumbnail?.asset?.metadata?.lqip}
                    placeholder="blur"
                  />
                )}
                {product.isOnSale && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-accent text-xs px-3 py-1 rounded-full">
                    Oferta
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <h3 className="font-medium line-clamp-2">{product.title}</h3>
              <p className="mt-1 text-lg font-semibold">
                ${product.isOnSale && product.salePrice ? product.salePrice : product.price}
              </p>

              <div className="mt-4 flex gap-3">
                <AddToCartButton className="w-full!" product={product} />
                {/* Aquí iría el botón de quitar favorito (useMutation) */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}