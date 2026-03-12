// src/components/ClearCartTracker.tsx
'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

export function ClearCartTracker() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    // Limpiamos el estado local de Zustand al montar el componente
    clearCart()
  }, [clearCart])

  return null // No renderiza nada, solo ejecuta la lógica
}