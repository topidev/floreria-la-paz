import { adminDb, admin } from './firebase-admin';


// Funcion para completar la Orden de Pago
export const updateOrder = async (orderId: string, sessionId: string) => {
  try {
    const orderRef = adminDb.collection('orders').doc(orderId)

    await orderRef.update({
      status: "Paid",
      paymentStatus: "Completed",
      stripeSessionId: sessionId,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return { success: true };
  } catch (error) {
    console.error("Error actualizando orden en Firebase:", error);
    throw error; // Re-lanzamos para que el Webhook responda con error 500 a Stripe
  }
}


// Funcion para limpiar carrito despues del pago
export const clearUserCart = async (uid: string) => {
  try {
    // 1. Referencia a la subcolección de documentos del carrito
    const cartCollectionRef = adminDb.collection("users").doc(uid).collection("cart")

    // 2. Obtenemos todos los documentos actuales (los productos)
    const snapshot = await cartCollectionRef.get();

    if (snapshot.empty) {
      console.log("El carrito ya estaba vacío.");
      return;
    }

    // 3. Usamos un Batch para borrar todos de un solo golpe (más eficiente)
    const batch = adminDb.batch();
    snapshot.docs.forEach((productDoc) => {
      batch.delete(productDoc.ref);
    });

    await batch.commit();
    console.log(`🛒 Carrito de la subcolección de ${uid} vaciado por completo.`);
  } catch (error) {
    console.error("Error al limpiar la subcolección del carrito:", error);
  }
};


export const getOrderByIdServer = async (orderId: string) => {
  try {
    const orderRef = adminDb.collection('orders').doc(orderId)
    const snap = await orderRef.get()
    return snap
  } catch (error) {
    console.error('Error getOrderByIdServer:', error);
    throw error;
  }
}
