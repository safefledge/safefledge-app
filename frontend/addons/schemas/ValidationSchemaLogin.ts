import { z } from "zod";

export const validationSchemaLogin = z
    .object({
        email: z.string().email({
            message: 'Please enter a valid email'
        }),
        password: z.string().min(8).max(100, {
            message: 'Password must be at least 8 characters long'
        }),
    })


export type ValidationSchemaLogin = z.infer<typeof validationSchemaLogin>;