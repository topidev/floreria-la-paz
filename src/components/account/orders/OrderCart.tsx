'use client'

import { useEffect, useState } from "react";
import { client } from "@/studio/client";
import { productsByIds } from "@/studio/helpers";
import Image from "next/image";
import { Order } from "@/types/types";

export default function OrderCard({ order }: { order: Order }) {
  const [productsData, setProductsData] = useState<any[]>([]);

  useEffect(() => {

    // console.log(order)
    const fetchSanityData = async () => {
      const productIds = order.items.map((item: any) => {
        // console.log(item.price_data.product_data.metadata.productId)
        return item.price_data.product_data.metadata.productId;
      })
      // console.log(productIds)
      const data = await client.fetch(productsByIds, { ids: productIds });
      // console.log(data)
      setProductsData(data);
    };

    if (order.items) fetchSanityData();
  }, [order.items]);

  const totalCart = () => {

  }

  return (
    <div className="border border-accent rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between border-b border-accent pb-4 mb-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">ID de Orden</p>
          <p className="font-mono text-sm">{order.id}</p>
        </div>
        <div className="flex gap-8 justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Fecha</p>
            <p className="text-sm">
              {/* Si es un Timestamp de Firebase, usamos toDate() */}
              {order.completedAt?.toDate
                ? order.completedAt.toDate().toLocaleDateString()
                : "Recién creada"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Estado</p>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
              {order.status === 'Paid' ? 'Completado' : 'Procesando'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {order.items.map((item: any) => {
          const product = productsData.find((p: any) => p._id === item.price_data.product_data.metadata.productId);
          return (
            <div key={item.price_data.product_data.metadata.productId} className="flex items-center gap-4 justify-between">
              <div className="relative h-14 w-14 overflow-hidden rounded-md border border-accent bg-muted">
                {product?.thumbnail && (
                  <Image
                    src={product.thumbnail.asset.url}
                    alt={product.thumbnail.alt}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 text-sm">
                <p className="font-bold">{product?.title || "Cargando nombre..."}</p>
                <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}