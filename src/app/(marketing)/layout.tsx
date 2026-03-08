//header + footer + children
// src/app/(marketing)/layout.tsx
'use client'

import { useEffect, type ReactNode } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import CarHydrator from '@/components/layout/cart-hydrator';
import { useCartStore } from '@/store/cartStore';
import { useCartSync } from '@/hooks/useCartSync';

export default function MarketingLayout({ children }: { children: ReactNode }) {

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      useCartStore.getState().loadCart(user.uid)
    } else {
      useCartStore.getState().clearCart()
    }
  }, [user])

  useCartSync()

  return (
    <div className="flex min-h-screen flex-col">
      <CarHydrator />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}