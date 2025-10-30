import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z
    .object({
      name: z
        .string()
        .min(2, {
          message: "Name must be at least 2 characters long",
        })
        .max(50, {
          message: "Name must be at most 50 characters long",
        }),
      email: z.email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" }),
      passwordConfirm: z
        .string()
        .min(8, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
    });

  static readonly LOGIN: ZodType = z.object({
    email: z.email(),
    password: z.string().min(6).max(100),
  });
}
