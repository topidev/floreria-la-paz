// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, LogIn, LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/src/hooks/useMediaQuery';

export default function Header() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container  flex h-16 items-center justify-between m-auto py-1.5 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" title='Desert Bloom'>
          <span className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-primary">Florería La Paz</span>
        </Link>

        {/* Navegación central */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" title='Products' className="text-sm font-medium transition-colors hover:text-primary">
            Catálogo
          </Link>
          <Link href="/ocasiones" title='Ocasiones' className="text-sm font-medium transition-colors hover:text-primary">
            Ocasiones
          </Link>
          <Link href="/suscripciones" title='Suscripciones' className="text-sm font-medium transition-colors hover:text-primary">
            Suscripciones
          </Link>
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center space-x-4">
          {/* Carrito (placeholder) */}
          <Button variant="ghost" className='cursor-pointer' size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Carrito</span>
          </Button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden md:inline-block">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <Button title='Salir' variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className='' asChild>
              <Link href="/login" title='Iniciar sesión'>
                {isMobile ? (
                  <User className='block h-4 w-4' />
                ):(
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar sesión
                  </>
                )}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}