// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, LogIn, LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-serif font-bold text-primary">Florería La Paz</span>
        </Link>

        {/* Navegación central */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Catálogo
          </Link>
          <Link href="/ocasiones" className="text-sm font-medium transition-colors hover:text-primary">
            Ocasiones
          </Link>
          <Link href="/suscripciones" className="text-sm font-medium transition-colors hover:text-primary">
            Suscripciones
          </Link>
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center space-x-4">
          {/* Carrito (placeholder) */}
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Carrito</span>
          </Button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden md:inline-block">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar sesión
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}