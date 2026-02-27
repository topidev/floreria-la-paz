'use client'

import { useEffect } from "react"
import { useCartStore } from "@/src/store/cartStore"

export default function CarHydrator() {

    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])

    return null
}