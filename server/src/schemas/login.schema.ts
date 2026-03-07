import z from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default loginSchema;
