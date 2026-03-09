import z from "zod";

const validProduct = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  stock: z.number().nonnegative(),
  description: z.string().max(255).optional()
});

export default validProduct;