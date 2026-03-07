// This is for validation of the data by the user/client

import { z } from "zod";

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(3),
  phoneNumber: z.string().min(10),
});

export default signupSchema;