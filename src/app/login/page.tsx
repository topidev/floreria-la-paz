// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';

export default function LoginPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return <div>Cargando...</div>;
  if (user) {
    router.push('/'); // redirect si ya está logueado
    return null;
  }

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    toast.success("¡Bienvenido! Sesión iniciada con Google");
    router.push('/');
  };

  // Para email/password (opcional por ahora)
  const handleEmailLogin = async () => { 
    console.log('click')
    if (email.trim() !== '' && password.trim() !== '') {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success("¡Bienvenido!");
        router.push('/');
      }
      catch (err) {
        toast.error('Eror en el inicio de sesión')
      }
    } else {
      toast.warning('Complete los campos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu cuenta para ver pedidos y ofertas exclusivas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className='h-10' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" className='h-10' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="cursor-pointer h-10 w-full hover:bg-gray-700 transition-colors" onClick={handleEmailLogin}>
            Log In
          </Button>
          <div className='flex items-center gap-2  mb-4'>
            <hr className='w-full m-0'/>
            <span>or</span>
            <hr className='w-full m-0'/>
          </div>
            <Button className="cursor-pointer h-10 w-full hover:bg-gray-700 transition-colors" onClick={handleGoogleLogin}>
              Iniciar con Google
            </Button>
          {/* Agrega botón para email si lo implementas */}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta? <a href="/register" className="text-primary hover:underline">Regístrate</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}