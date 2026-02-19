// src/app/(checkout)/layout.tsx
'use client' 

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/src/hooks/useMediaQuery';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Barra superior mínima */}
      <div className="border-b bg-background sticky top-0 z-50">
        <div className="mx-auto container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif font-bold text-primary">Florería La Paz</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {!isMobile ? 'Seguir comprando' : ''}
              
            </Link>
          </Button>
        </div>
      </div>

      {/* Contenido centrado */}
      <main className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
        {children}
      </main>

      {/* Footer minimal o ninguno */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Florería La Paz • Entregas locales en BCS</p>
      </footer>
    </div>
  );
}