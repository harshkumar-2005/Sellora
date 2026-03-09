import z from "zod";

const validLogin = z.object({
  email: z.email(),
  password: z.string(),
});

export default validLogin;
