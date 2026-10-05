import {defineField, defineType} from 'sanity'

export const packageType = defineType({
  name: 'package',
  title: 'Travel Package',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "5 Days / 4 Nights"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Domestic', value: 'domestic'},
          {title: 'International', value: 'international'},
          {title: 'Honeymoon', value: 'honeymoon'},
          {title: 'Adventure', value: 'adventure'},
        ],
      },
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [
        defineField({
          name: 'day',
          type: 'object',
          fields: [
            defineField({name: 'dayNumber', title: 'Day Number', type: 'number'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'inclusions',
      title: 'Inclusions',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'exclusions',
      title: 'Exclusions',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
