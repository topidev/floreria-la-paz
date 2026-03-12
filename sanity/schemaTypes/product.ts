// schemas/product.ts
import { defineField, defineType } from 'sanity';

export const product = defineType({
    name: 'product',
    title: 'Producto',
    type: 'document',
    icon: () => '🌸', // opcional, emoji para Sanity Studio

    fields: [
        // Título y slug (obligatorios para SEO y URL)
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required().min(3).max(120),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),

        // Precio y moneda
        defineField({
            name: 'price',
            title: 'Precio (MXN)',
            type: 'number',
            validation: (Rule) => Rule.required().positive().precision(2),
        }),

        // Imágenes (soporte múltiple + orden)
        defineField({
            name: 'images',
            title: 'Imágenes',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true }, // permite recortar/posicionar
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Texto alternativo (para SEO y accesibilidad)',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'isMain',
                            type: 'boolean',
                            title: 'Imagen principal',
                            initialValue: false,
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.required()
                .min(1)
                .max(5)
                .custom((images: any[] | undefined) => {
                    if (!images) return true

                    const mains = images.filter(img => img?.isMain)

                    return mains.length <= 1 || 'Solo una puede ser principal'
                }),
        }),

        // Descripción rica (para detalles del producto)
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }, { title: 'Título', value: 'h2' }],
                    lists: [{ title: 'Lista', value: 'bullet' }],
                    marks: {
                        decorators: [
                            { title: 'Negrita', value: 'strong' },
                            { title: 'Cursiva', value: 'em' },
                        ],
                    },
                },
            ],
        }),

        // Categorías y ocasiones (para filtros)
        defineField({
            name: 'categories',
            title: 'Categorías',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            description: 'Ej: Arreglos, Suscripciones, Cactus, Premium',
        }),
        defineField({
            name: 'events',
            title: 'Eventos',
            type: 'array',
            of: [
                { type: 'reference', to: [{ type: 'occasions' }] }
            ],
            description: 'Ej: XV Años, Bodas, Cumpleaños, Aniversario',
        }),

        // Stock y disponibilidad
        defineField({
            name: 'stock',
            title: 'Stock disponible',
            type: 'number',
            initialValue: 10,
            validation: (Rule) => Rule.integer().min(0),
        }),
        defineField({
            name: 'isAvailable',
            title: 'Disponible para venta',
            type: 'boolean',
            initialValue: true,
        }),

        // Destacado / Más vendidos / Ofertas
        defineField({
            name: 'isFeatured',
            title: 'Destacado (Más vendidos)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isOnSale',
            title: 'En oferta',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'salePrice',
            title: 'Precio de oferta (MXN)',
            type: 'number',
            validation: (Rule) => Rule.positive().precision(2),
        }),

        // Metadatos adicionales
        defineField({
            name: 'tags',
            title: 'Etiquetas',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'seoDescription',
            title: 'Descripción SEO (meta description)',
            type: 'text',
            validation: (Rule) => Rule.max(160),
        }),
    ],

    preview: {
        select: {
            title: 'title',
            price: 'price',
        },
        prepare(selection: any) {
            const { title, price } = selection;
            return {
                title,
                subtitle: price ? `$${price.toLocaleString('es-MX')} MXN` : 'Sin precio',
            };
        },
    },

    orderings: [
        {
            title: 'Precio: Menor a Mayor',
            name: 'priceAsc',
            by: [{ field: 'price', direction: 'asc' }],
        },
        {
            title: 'Precio: Mayor a Menor',
            name: 'priceDesc',
            by: [{ field: 'price', direction: 'desc' }],
        },
    ],
});