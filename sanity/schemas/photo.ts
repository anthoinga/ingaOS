import { defineType, defineField } from 'sanity'

export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
  ],
})
