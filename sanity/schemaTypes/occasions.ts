// schemas/ocations.ts
import { defineField, defineType } from 'sanity';

// { title: 'San Valentín', value: 'san-valentin' },
//                     { title: 'Cumpleaños', value: 'cumpleanos' },
//                     { title: 'Bodas', value: 'bodas' },
//                     { title: 'Condolencias', value: 'condolencias' },
//                     { title: 'Día de la Madre', value: 'dia-madre' },
//                     { title: 'Aniversario', value: 'aniversario' },

export const occasions = defineType({
    name: 'occasions',
    title: 'Eventos',
    type: 'document',
    icon: () => '🎉',

    fields: [
        defineField({
            name: 'titile',
            title: 'Nombre del Evento',
            type: 'string',
            validation: (Rule) => Rule.required().min(4).max(20),
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
            description: 'Emoji que representa el evento (ej: 🌸, 🌵, 💐)',
        }),
    ]
})