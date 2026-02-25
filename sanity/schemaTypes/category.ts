// schemas/category.ts
import { defineField, defineType } from 'sanity';

export const category = defineType({
    name: 'category',
    title: 'Categoría',
    type: 'document',
    icon: () => '🏷️',

    fields: [
        defineField({
            name: 'title',
            title: 'Nombre de la categoría',
            type: 'string',
            validation: (Rule) => Rule.required().min(2).max(60),
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
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            description: 'Opcional: breve explicación para SEO o uso interno',
        }),
        defineField({
            name: 'icon',
            title: 'Ícono (emoji o imagen)',
            type: 'string',
            description: 'Emoji que representa la categoría (ej: 🌸, 🌵, 💐)',
        }),
    ],

    preview: {
        select: {
            title: 'title',
            icon: 'icon',
        },
        prepare({ title, icon }: any) {
            return {
                title,
                subtitle: icon || 'Sin ícono',
            };
        },
    },
});