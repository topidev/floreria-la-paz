// src/lib/firebaseService.ts
import { doc, setDoc, getDoc, Timestamp, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // tu config de Firebase
import { UserData } from '../types/types';

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