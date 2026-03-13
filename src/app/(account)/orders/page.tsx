// src/app/(account)/orders/page.tsx
'use client'
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/lib/firebaseService";
import Link from "next/link";
import { useState, useEffect } from "react";
import OrderCard from "@/components/account/orders/OrderCart";
import { toast } from "sonner";
import { Order } from "@/types/types";

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no hay usuario y ya terminó de cargar la auth, mandamos a login
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getUserOrders(user.uid);
        console.log(data)
        setOrders(data);
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
        toast.error('Error al buscar las ordenes')
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    // Podrías mostrar un spinner aquí mientras se verifica la sesión
    return <div className="p-10 text-center">Verificando sesión...</div>;
  }
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <p className="text-primary animate-pulse font-bold">Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8 text-primary">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-accent">
          <p className="text-muted-foreground">Aún no has hecho ninguna compra.</p>
          <Link href="/" className="mt-4 inline-block text-primary hover:underline">
            Ir a ver flores 🌸
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}