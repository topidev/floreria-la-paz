// app/(account)/page.tsx
'use client'
import { useAuth } from '@/context/AuthContext'; // o tu Firebase auth helper
// import FavoriteCarousel from '@/components/account/FavoriteCarousel';
// import LastOrderSummary from '@/components/account/LastOrderSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Truck } from 'lucide-react';

export default function AccountDashboard() {
  const { user } = useAuth();


  // Fetch datos reales aquí (usa React Query en client o server actions)
  // Por ahora placeholders

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Bienvenid@, {user?.displayName || 'Florista'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Aquí tienes un resumen rápido de tu cuenta
        </p>
      </div>

      {/* Último pedido */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tu último pedido</h2>
        {/* <LastOrderSummary /> Componente que fetcha el último order */}
      </section>

      {/* Carousel de favoritos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Favoritos recientes</h2>
          <Button variant="outline" asChild>
            <Link href="/account/favorites">Ver todos →</Link>
          </Button>
        </div>
        {/* <FavoriteCarousel /> Carousel con Sanity images + add to cart */}
      </section>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="secondary" asChild className="h-28 flex flex-col">
          <Link href="/account/orders">
            <Package className="h-8 w-8 mb-2" />
            Mis Pedidos
          </Link>
        </Button>
        <Button variant="secondary" asChild className="h-28 flex flex-col">
          <Link href="/account/track">
            <Truck className="h-8 w-8 mb-2" />
            Rastrear envío
          </Link>
        </Button>
        {/* Agrega más: direcciones, wishlist, etc. */}
      </div>
    </div>
  );
}