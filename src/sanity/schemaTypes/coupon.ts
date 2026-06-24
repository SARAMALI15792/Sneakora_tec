import { defineField, defineType } from "sanity";

export const coupon = defineType({
  name: "coupon",
  title: "Coupon",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      validation: (rule) => rule.required().uppercase().min(3).max(20),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "type",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage", value: "percentage" },
          { title: "Flat Amount", value: "flat" },
        ],
        layout: "radio",
      },
      initialValue: "percentage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "maxUses",
      title: "Max Uses (optional)",
      type: "number",
    }),
    defineField({
      name: "usedCount",
      title: "Used Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "code",
      discount: "discount",
      type: "type",
      isActive: "isActive",
    },
    prepare({ title, discount, type, isActive }) {
      return {
        title,
        subtitle: `${isActive ? "Active" : "Inactive"} • ${discount}${type === "percentage" ? "%" : ""} off`,
      };
    },
  },
});
