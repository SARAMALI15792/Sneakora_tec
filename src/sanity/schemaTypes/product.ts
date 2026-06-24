import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price",
      type: "number",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
  ],
  preview: {
    select: {
      title: "name",
      price: "price",
      media: "images.0",
      status: "status",
    },
    prepare({ title, price, media, status }) {
      return {
        title,
        subtitle: `${status} • $${price}`,
        media,
      };
    },
  },
});
