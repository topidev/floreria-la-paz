// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; // tu context existente
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginForm } from '../../../lib/validation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, loading: authLoading } = useAuth(); // si tu context tiene loading global
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      // Nota: Aquí usamos signInWithEmailAndPassword de Firebase
      // Importa lo necesario si no está en tu context
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../../../lib/firebase');

      await signInWithEmailAndPassword(auth, data.email, data.password);

      toast.success('¡Sesión iniciada exitosamente!');
      router.push('/');
    } catch (error: any) {
      let message = 'Error al iniciar sesión';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Email o contraseña incorrectos';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Demasiados intentos. Intenta más tarde';
      }

      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('¡Bienvenido! Sesión con Google');
      router.push('/');
    } catch (error) {
      toast.error('Error al iniciar con Google');
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Accede a tu cuenta para ver pedidos y ofertas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="tu@email.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="cursor-pointer w-full" disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O</span>
          </div>
        </div>

        <Button variant="outline" className="w-full cursor-pointer" onClick={handleGoogleLogin}>
          Continuar con Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-primary hover:underline ml-1">
          Regístrate
        </a>
      </CardFooter>
    </>
  );
}