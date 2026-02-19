// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginForm } from '../../../lib/validation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const router = useRouter()

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

      await signInWithEmail(data.email, data.password)
      router.push('/')

    } catch (error: unknown) {

      console.log(error)

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true)
    try {

      await signInWithGoogle();
      router.push('/')

    } catch (error: unknown) {

      console.log('Auth Error: ', error)

    } finally {
      setLoadingGoogle(false)
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <>
      <CardHeader className='text-secondary'>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Accede a tu cuenta para ver pedidos y ofertas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-secondary">
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

        <Button
          variant="outline"
          className="w-full cursor-pointer text-secondary"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
        >
          {loadingGoogle ? 'Abriendo Google...' : 'Continuar con Google'}
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