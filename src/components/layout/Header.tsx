// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, LogIn, LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/src/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function Header() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountTheme = () => {
      setMounted(true)
    }

    mountTheme()
  }, [])

  const isDark = mounted && theme === 'dark'

  const toogleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

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

          {/* Menú de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="sr-only">Menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    {user.displayName || user.email?.split('@')[0]}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mis-pedidos" className="flex items-center">
                      <History className="mr-2 h-4 w-4" />
                      Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/compras" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Compras
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme} className="flex items-center">
                    {isDark ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Modo claro
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Modo oscuro
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar sesión
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Crear cuenta
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}