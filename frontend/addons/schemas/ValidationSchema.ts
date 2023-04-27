import { z } from "zod";

export const validationSchema = z
    .object({
        email: z.string().email({
            message: 'Please enter a valid email'
        }),
        password: z.string().min(8).max(100, {
            message: 'Password must be at least 8 characters long'
        }),
        fullname: z.string().min(2).max(100, {
            message: 'Please enter a valid name'
        }),
    })


export type ValidationSchema = z.infer<typeof validationSchema>;