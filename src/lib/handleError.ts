// src/lib/handleError.ts
import { toast } from 'sonner';
import type { ErrorSource } from '../types/types';
import { AppError } from '../types/types';


/**
 * Maneja errores de forma centralizada y muestra toast amigable
 * @param error - El error capturado
 * @param fallbackMessage - Mensaje por defecto si no se puede mapear
 * @param source - Origen opcional para logging o categorización
 */
export const handleError = (
    error: unknown,
    fallbackMessage = 'Ocurrió un error inesperado. Intenta de nuevo.',
    source: ErrorSource = 'unknown'
): void => {
    let message = fallbackMessage;
    const logLevel: 'error' | 'warn' = 'error';

    // Firebase Auth - códigos comunes[](https://firebase.google.com/docs/reference/js/auth#autherrorcodes)
    if (error instanceof Error && 'code' in error) {
        const err = error as AppError;

        switch (err.code) {
            // Auth
            case 'auth/invalid-email':
                message = 'El email no es válido.';
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                message = 'Email o contraseña incorrectos.';
                break;
            case 'auth/email-already-in-use':
                message = 'El email ya está registrado.';
                break;
            case 'auth/weak-password':
                message = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
                break;
            case 'auth/popup-closed-by-user':
            case 'auth/cancelled-popup-request':
                // Silencioso - el usuario canceló
                return; // no mostramos toast
            case 'auth/too-many-requests':
                message = 'Demasiados intentos. Espera unos minutos e intenta de nuevo.';
                break;

            // Firestore / Storage
            case 'permission-denied':
                message = 'No tienes permiso para realizar esta acción.';
                break;
            case 'unavailable':
            case 'deadline-exceeded':
                message = 'El servicio no está disponible en este momento. Revisa tu conexión.';
                break;

            // Network / Otros
            case 'network-request-failed':
                message = 'Problema de conexión. Verifica tu internet.';
                break;

            default:
                // Errores desconocidos → log pero mensaje genérico
                message = fallbackMessage;
                break;
        }
    }

    // Mostrar toast
    toast.error(message, {
        description: source !== 'unknown' ? `(${source})` : undefined,
        duration: 6000,
    });

    // Logging
    console[logLevel]('[handleError]', {
        source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code: (error as any)?.code,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (error as any)?.message,
        stack: (error as Error)?.stack,
    });

    // Futuro: enviar a Sentry / Firebase Crashlytics
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
};

export const showSuccess = (message: string, description?: string) => {
    toast.success(message, { description, duration: 4000 });
};

export const showInfo = (message: string, description?: string) => {
    toast.info(message, { description });
};

export const showWarning = (message: string, description?: string) => {
    toast.warning(message, { description });
};