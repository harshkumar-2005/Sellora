import z from "zod";

export const addToCartValidator = z.object({
  productId: z.number().int().positive(),

  quantity: z.number().int().min(1)
});


export const updateCartValidator = z.object({
  quantity: z.number().int().min(1)
});