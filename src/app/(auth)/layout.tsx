// src/app/(auth)/layout.tsx
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Fondo con imagen hero de flores/atardecer en La Paz */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/auth-bg.jpg"           // ← pon tu imagen aquí (ver abajo cómo agregarla)
          alt="Flores y atardecer en La Paz, BCS"
          fill
          className="object-cover brightness-[0.7] contrast-[1.1]"
          priority
          quality={85}
        />
        {/* Overlay sutil para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* Logo o título arriba (opcional) */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif font-bold text-white drop-shadow-lg">
            Florería La Paz
          </Link>
          <p className="text-white/80 mt-1 text-sm">
            Flores frescas del desierto al corazón
          </p>
        </div>

        {/* Card donde irá el form de login/register */}
        <div className="min-h-fit flex rounded items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl">
            {children}
            </Card>
        </div>

        {/* Footer pequeño */}
        <p className="text-center text-white/70 text-sm mt-6">
          © {new Date().getFullYear()} Florería La Paz • Entregas locales en BCS
        </p>
      </div>
    </div>
  );
}