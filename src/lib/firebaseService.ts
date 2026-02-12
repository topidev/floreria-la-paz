// src/lib/firebaseService.ts
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
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