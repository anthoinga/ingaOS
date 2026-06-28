import { defineType, defineField } from 'sanity'

export const talk = defineType({
  name: 'talk',
  title: 'Talk',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'event', type: 'string' }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'pdf', type: 'file', options: { accept: '.pdf' }, validation: (r) => r.required() }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
  ],
})
