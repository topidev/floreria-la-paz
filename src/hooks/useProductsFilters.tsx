import { Filters } from "@/types/types";
import { useMemo } from "react";

export function useProductsFilters(products: any[], filters: Filters) {
    return useMemo(() => {
        if(!products) return []

        const search = filters.search.trim().toLocaleLowerCase()
        const category = filters.category.trim().toLocaleLowerCase()

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

        return true
        })
    }, [products, filters])
}