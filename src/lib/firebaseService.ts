// src/lib/firebaseService.ts
import { doc, setDoc, getDoc, Timestamp, deleteDoc, collection, getDocs, writeBatch, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // tu config de Firebase
import { CartItem, UserData } from '../types/types';

/* --------------------------------
                user/
-------------------------------- */

// Función para crear o actualizar usuario en Firestore (upsert)
export const createOrUpdateUser = async (user: UserData) => {
    const userRef = doc(db, 'users', user.uid);

    // Chequea si existe para decidir si crear o update
    const userSnap = await getDoc(userRef);
    const now = Timestamp.now();

    try {
        await setDoc(userRef, {
            email: user.email,
            role: user.role || 'user',
            displayName: user.displayName,
            photoURL: user.photoURL || null,
            createdAt: userSnap.exists() ? userSnap.data()?.createdAt || now : now,
            updatedAt: now,
        }, { merge: true }); // merge: true para no sobreescribir campos existentes
    } catch (error) {
        console.error('Error guardando usuario en Firestore:', error);
        throw error; // Propaga para manejar en caller
    }
};


/* --------------------------------
          user/favorites
-------------------------------- */


// Funcion para agregar producto a favoritos
export const addToFavorite = async (productId: string, uid: string) => {
    if(!uid) throw new Error('No Autenticado')
    
    const favoriteRef = doc(db, `users/${uid}/favorites/${productId}`)
    await setDoc(favoriteRef, {
        productId,
        createdAt: new Date()
    })
}

// Funcion para remover producto de favoritos
export const removeFavorite = async (productId: string, uid: string) => {
  const favoriteRef = doc(db, `users/${uid}/favorites/${productId}`);
  await deleteDoc(favoriteRef);
}

// Funcion para obtener los favoritos del usuario
export const getUserFavorites = async (uid: string) => {
    const favoriteSnp = await getDocs(collection(db, `users/${uid}/favorites`))

    const products = favoriteSnp.docs.map(doc => doc.data().productId)

    if (products.length === 0) return []

    return products
}

/* --------------------------------
          user/cart
-------------------------------- */


// Funcion para guardar todo el carrito
export const syncCart = async (uid:string, products: CartItem[]) => {
    if (!uid) throw new Error('No autenticado');

    const batch = writeBatch(db)
    const cartRef = collection(db, `users/${uid}/cart`)

    const snapshot = await getDocs(cartRef)
    snapshot.docs.forEach((d) => batch.delete(d.ref))

    products.forEach((item) => {
        const itemDoc = doc(cartRef, item._id)
        batch.set(itemDoc, {
            productId: item._id,
            // price: item.price,
            quantity: item.quantity,
            addedAt: Timestamp.now()
        })
    })

    await batch.commit()
}

// Funcion para cargar cart de Firebase
export const getCartFromFirebase = async (uid:string): Promise<{ productId: string, quantity: number }[]> => {
    if(!uid) return []

    const snapshot = await getDocs(collection(db, `users/${uid}/cart`))
    return snapshot.docs.map((doc) => ({
        productId: doc.data().productId,
        quantity: doc.data().quantity
    }))
}


/* --------------------------------
          Pre-order
-------------------------------- */

// Funcion para crear una orden de pago
export const createPreOrder = async (uid:string, items: CartItem[]) => {
    try {
        const orderRef = collection(db, 'orders')

        const docRef = await addDoc(orderRef, {
            userId: uid,
            items: items,
            status: 'Pending',
            paymentStatus: 'Unpaid',
            createdAt: serverTimestamp()
        })

        return docRef.id
    } catch (error) {
        console.error("Error creando pre-order:", error);
        throw new Error("No se pudo registrar la orden preliminar");
    }
}

// Funcion para completar la Orden de Pago
export const updateOrder = async (orderId: string, sessionId: string) => {
    try {
        const orderRef = doc(db, 'orders', orderId)

        await updateDoc(orderRef, {
            status: "Paid",
            paymentStatus: "Completed",
            stripeSessionId: sessionId,
            completedAt: serverTimestamp()
        })

        return { success: true };
    } catch (error) {
        console.error("Error actualizando orden en Firebase:", error);
        throw error; // Re-lanzamos para que el Webhook responda con error 500 a Stripe
    }
}

// Funcion para Obtener un orden
export const getOrderById = async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    return orderSnap
}

// Funcion para limpiar carrito despues del pago
export const clearUserCart = async (uid: string) => {
  try {
    // 1. Referencia a la subcolección de documentos del carrito
    const cartCollectionRef = collection(db, "users", uid, "cart");
    
    // 2. Obtenemos todos los documentos actuales (los productos)
    const snapshot = await getDocs(cartCollectionRef);

    if (snapshot.empty) {
      console.log("El carrito ya estaba vacío.");
      return;
    }

    // 3. Usamos un Batch para borrar todos de un solo golpe (más eficiente)
    const batch = writeBatch(db);
    snapshot.docs.forEach((productDoc) => {
      batch.delete(productDoc.ref);
    }); 

    await batch.commit();
    console.log(`🛒 Carrito de la subcolección de ${uid} vaciado por completo.`);
  } catch (error) {
    console.error("Error al limpiar la subcolección del carrito:", error);
  }
};