import { stripe } from "@/lib/stripe";
import { CartItem } from "@/types/types";
import { NextResponse } from "next/server";
import { client } from "@/studio/client";
import { productsByIds } from "@/studio/helpers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import admin from 'firebase-admin'

export async function POST(req: Request) {
  try {
    console.log('[API Checkout] Headers recibidos:', Object.fromEntries(req.headers.entries()));

    const authHeader = req.headers.get('authorization')
    console.log('[API Checkout] Authorization header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[API Checkout] No Bearer token encontrado → 401');
      return NextResponse.json({
        error: 'Token no proporcionado'
      }, {
        status: 401
      }
      )
    }

    const idToken = authHeader?.split('Bearer ')[1] || ""
    console.log('[API Checkout] Token recibido (primeros 50 chars):', idToken.substring(0, 50));

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const verifiedUid = decodedToken.uid

    console.log('[API Checkout] Token verificado OK, UID:', decodedToken.uid);
    const { cartItems, userId } = await req.json();


    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({
        error: "El carrito está vacío"
      }, {
        status: 400
      });
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

      // console.log("Producto Completo: ", productoReal)

      const price = productoReal.isOnSale && productoReal.salePrice != null ? productoReal.salePrice : productoReal.price

      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: productoReal.title,
            images: [productoReal.thumbnail.asset.url]
          },
          unit_amount: Math.round(price * 100), // Siempre en centavos
        },
        quantity: item.quantity,
      };
    });

    console.log("Items: ", line_items)

    // Crear la Pre-Order en Firebase
    const orderRef = adminDb.collection('orders').doc()
    await orderRef.set({
      userId: verifiedUid,
      items: line_items,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    const orderId = orderRef.id
    console.log(orderId)


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // IMPORTANTE: Agregamos el ID del pedido en metadata para el Webhook después
      metadata: {
        firebaseUserId: verifiedUid ?? 'guest',
        firebaseOrderId: orderId as string,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Error en Checkout:", error);
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}