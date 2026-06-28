import { defineType, defineField, defineArrayMember } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (r) => r.required().min(2000).max(2099),
    }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        defineArrayMember({
          name: 'imageBlock',
          type: 'object',
          fields: [
            { name: 'image', type: 'image', options: { hotspot: true } },
            { name: 'caption', type: 'string' },
          ],
        }),
        defineArrayMember({
          name: 'videoBlock',
          type: 'object',
          fields: [
            { name: 'videoFile', type: 'file', options: { accept: 'video/*' } },
            { name: 'embedUrl', type: 'url' },
          ],
        }),
        defineArrayMember({
          name: 'pullQuote',
          type: 'object',
          fields: [{ name: 'text', type: 'text' }],
        }),
        defineArrayMember({
          name: 'twoColumn',
          type: 'object',
          fields: [
            { name: 'leftImage', type: 'image', options: { hotspot: true } },
            { name: 'rightImage', type: 'image', options: { hotspot: true } },
            { name: 'caption', type: 'string' },
          ],
        }),
      ],
    }),
  ],
})
