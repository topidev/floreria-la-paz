// schemas/ocations.ts
import { defineField, defineType } from 'sanity';

export const occasions = defineType({
    name: 'occasions',
    title: 'Eventos',
    type: 'document',
    icon: () => '🎉',

    fields: [
        defineField({
            name: 'title',
            title: 'Nombre del Evento',
            type: 'string',
            validation: (Rule) => Rule.required().min(4).max(50),
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
        }),
        defineField({
            name: 'icon',
            title: 'Ícono (emoji o imagen)',
            type: 'string',
            description: 'Ejemplo: 🎂, 💍, 🌹, ⚰️, 👩‍❤️‍👨',
        }),
    ],

  preview: {
    select: {
      title: 'title',
      icon: 'icon',
    },
    prepare({ title, icon }) {
      return {
        title,
        subtitle: icon || 'Sin ícono',
        media: () => icon || '🎉',
      }
    },
  },
})