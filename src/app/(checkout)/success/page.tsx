// src/app/(checkout)/success/page.tsx
import { getOrderByIdServer } from "@/lib/firebase-admin-service";
import Link from "next/link";
import { ClearCartTracker } from "@/components/ClearCartTracker";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;

  // Consultamos Firebase para ver el estado real de la orden
  const orderSnap = await getOrderByIdServer(orderId)

  if (!orderSnap) {
    return <div>No encontramos tu orden, pero no te preocupes, contacta a soporte.</div>;
  }

  const orderData = orderSnap.data();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Este componente limpiará Zustand en cuanto el usuario vea esta página */}
      {/* <ClearCartTracker /> */}
      <h1 className="text-3xl font-bold text-primary">¡Gracias por tu compra!</h1>
      <p className="mt-2 text-lg text-secondary-accent">Tu ramo de flores ya está en camino.</p>

      <div className="mt-8 p-6 bg-background/30 rounded-lg border border-gray-200 w-full max-w-md">
        <h2 className="font-semibold border-b pb-2 mb-4">Detalles del pedido</h2>
        <p className="flex justify-between">
          <span>Número de Orden:</span>
          <span className="font-mono font-bold text-blue-600">{orderId}</span>
        </p>
        <p className="flex justify-between mt-2">
          <span>Estado del pago:</span>
          <span className={`font-bold ${orderData?.status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
            {orderData?.status === 'Paid' ? 'Confirmado' : 'Procesando...'}
          </span>
        </p>
      </div>

      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Volver a la florería
      </Link>
    </div>
  );
}