import { stripe } from "@/lib/stripe";
import { CartItem } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { NextResponse } from "next/server";
import { client } from "@/studio/client";
import { productsByIds } from "@/studio/helpers";
import { createPreOrder } from "@/lib/firebaseService";

export async function POST(req: Request) {
  try {
    const { cartItems, userId } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const ids = cartItems.map((item: CartItem) => item._id)

    // Buscar productos en sanity para evitar inyección de precios falsos
    const sanityProducts = await client.fetch(productsByIds, { ids })

    const line_items = cartItems.map((item: any) => {
      // Buscar el precio real en sanity
        const productoReal = sanityProducts.find((p: any) => p._id === item._id);

      
        if (!productoReal) {
            throw new Error(`El producto ${item.title || item._id} no existe en Sanity.`);     
        }

        // console.log("Producto Completo: ",productoReal)

        return {
            price_data: {
            currency: 'mxn',
            product_data: {
                name: productoReal.title,
                images: [productoReal.thumbnail.asset.url]
            },
            unit_amount: Math.round(productoReal.price * 100), // Siempre en centavos
            },
            quantity: item.quantity,
        };
    });

    console.log("Items: ", line_items)

    // Crear la Pre-Order en Firebase
    const orderId = await createPreOrder(userId, cartItems)

    console.log(orderId)


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // IMPORTANTE: Agregamos el ID del pedido en metadata para el Webhook después
      metadata: {
        firebaseUserId: userId ?? 'guest',
        firebaseOrderId: orderId as string,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });

} catch (error: any) {
    console.error("Error en Checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}