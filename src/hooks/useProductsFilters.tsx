import { Filters } from "@/types/types";
import { useMemo } from "react";

export function useProductsFilters(products: any[], filters: Filters) {
    return useMemo(() => {
        if(!products) return []

        const search = filters.search.trim().toLocaleLowerCase()
        const category = filters.category.trim().toLocaleLowerCase()
        const price = filters.price.trim();
        const event = filters.events.trim().toLocaleLowerCase();

        return products.filter((p) => {
            if (search) {
                const titleMatch = p.title.toLocaleLowerCase().includes(search)
                if (!titleMatch) return false
            }

            if (category) {
                const catMatch = p.categories?.some((c: any) =>
                    c.title.toLocaleLowerCase().includes(category)
                )
                if (!catMatch) return false
            }

            if (filters.offer) {
                if (!p.isOnSale) return false
            }
            
            if (price && price !== "Cualquier Precio") {
                const [minPrice, maxPrice = minPrice] = price?.replace(/\$/g, "").split("-").map(Number);
                const priceMatch = p.price > minPrice && p.price < maxPrice
                console.log(priceMatch)
                return priceMatch
            }

            if (event) {
                const cleanEvnt = event.includes('ñ') ? event.replace('ñ', 'n') : event
                console.log(p)
                console.log(cleanEvnt)
                console.log(p.events)
                const evntMatch = p.events?.some((e: any) =>
                    e.title.toLocaleLowerCase().includes(event)
                )
                return evntMatch
            }

            return true
        })
    }, [products, filters])
}