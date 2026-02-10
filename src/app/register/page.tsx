// src/components/SignUp.jsx
'use client'
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/src/lib/firebase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (email.trim() !== '' && password.trim() !== '' && name.trim() !== '') {
        if (password.trim() !== confirmPassword.trim()){
            toast.error('Las constraseñas no coinciden')
            return
        }
        try {
            setLoading(true)
            // Create the user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Signed up successfully
            const user = userCredential.user;
            toast.success('Cuenta creada');
            router.push('/')
        } catch (err) {
            // Handle errors
            console.error('Sign up error:', err);
            toast.error('Error en la creación de cuenta');
        } finally { setLoading(false) }
    } else {
      toast.warning('Complete los campos')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-100">
        <CardHeader className='text-center'>
          <CardTitle>Crea tu cuenta</CardTitle>
          <CardDescription>Crea tu cuenta para acceder a pedidos y ofertas exclusivas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" className='h-10' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" className='h-10' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" className='h-10' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="cpassword">Confirma Contraseña</Label>
                <Input id="cpassword" className='h-10' type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button className="cursor-pointer h-10 w-full hover:bg-gray-700 transition-colors" onClick={handleSignUp}>
                { loading ? '...' : 'Crear cuenta' }
            </Button>
          {/* Agrega botón para email si lo implementas */}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <a href="/login" className="text-primary hover:underline">Inicia Sesión</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
