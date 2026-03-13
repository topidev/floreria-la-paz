import { stripe } from "@/lib/stripe";
import { headers } from "next/headers"
import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/firebase-admin-service";
import { clearUserCart } from "@/lib/firebase-admin-service";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("stripe-signature") as string

    if (!signature) {
        return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any

        const userId = session.metadata?.firebaseUserId;
        const orderId = session.metadata?.firebaseOrderId

        if (orderId) {
            updateOrder(orderId, session.id)
            console.log(`✅ Orden ${orderId} marcada como pagada.`);
        }


        console.log("User: ", userId)
        if (userId && userId !== 'guest') {
            console.log("[Limpiando el carrito]")
            await clearUserCart(userId);
        }
    }
    return NextResponse.json({ received: true });
}