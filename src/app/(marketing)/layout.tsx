//header + footer + children
// src/app/(marketing)/layout.tsx

import type { ReactNode } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CarHydrator from '@/components/layout/cart-hydrator';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CarHydrator />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}