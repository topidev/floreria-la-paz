// src/lib/firebaseService.ts
import { doc, setDoc, getDoc, Timestamp, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
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
    if (!uid) throw new Error('No Autenticado')

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
export const syncCart = async (uid: string, products: CartItem[]) => {
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
export const getCartFromFirebase = async (uid: string): Promise<{ productId: string, quantity: number }[]> => {
    if (!uid) return []

    const snapshot = await getDocs(collection(db, `users/${uid}/cart`))
    return snapshot.docs.map((doc) => ({
        productId: doc.data().productId,
        quantity: doc.data().quantity
    }))
}

export const getUserOrders = async (userId: string) => {
    const ordersRef = collection(db, "orders");
    // Filtramos por userId y ordenamos por las más recientes
    const q = query(
        ordersRef,
        where("userId", "==", userId),
        orderBy("completedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};