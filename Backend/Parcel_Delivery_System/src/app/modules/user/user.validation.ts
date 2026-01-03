import z from "zod";
import { isActive, Role } from "./user.interface";

export const createUSerZodSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be string..." })
        .min(2, { message: "Name must be atleast two character long!" })
        .max(50, { message: "Name can't be more than 50 character...!" }),
    
    email: z.string({ invalid_type_error: "email must be string!" })
        .email({ message: "invalid email address format" }),
    
    password: z.string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .refine((val) => /[a-z]/.test(val), {
              message: "Password must include at least one lowercase letter.",
            })
            .refine((val) => /[A-Z]/.test(val), {
              message: "Password must include at least one uppercase letter.",
            })
            .refine((val) => /\d/.test(val), {
              message: "Password must include at least one number.",
            })
            .refine((val) => /[^A-Za-z0-9]/.test(val), {
              message: "Password must include at least one special character.",
            }),
    
    phone: z.string()
        .regex(/^(?:\+880|880|0)1[0-9]{9}$/,
        { message: "Phone number must be a valid Bangladeshi number (e.g., 01xxxxxxxxx or +8801xxxxxxxxx)", })
        .optional(),
    
    address: z.string({ invalid_type_error: "Address must be string!" })
            .max(200, { message: "Address can not exceed 200 characters!" })
            .optional(),
    role: z.enum(Object.values(Role) as [string]),
    
})

export const updateUserZodSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be string..." })
        .min(2, { message: "Name must be atleast two character long!" })
        .max(50, { message: "Name can't be more than 50 character...!" }).optional(),
    
    password: z.string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .refine((val) => /[a-z]/.test(val), {
              message: "Password must include at least one lowercase letter.",
            })
            .refine((val) => /[A-Z]/.test(val), {
              message: "Password must include at least one uppercase letter.",
            })
            .refine((val) => /\d/.test(val), {
              message: "Password must include at least one number.",
            })
            .refine((val) => /[^A-Za-z0-9]/.test(val), {
              message: "Password must include at least one special character.",
            }).optional(),
    
    phone: z.string()
        .regex(/^(?:\+880|880|0)1[0-9]{9}$/,
        { message: "Phone number must be a valid Bangladeshi number (e.g., 01xxxxxxxxx or +8801xxxxxxxxx)", })
        .optional(),
    
    address: z.string({ invalid_type_error: "Address must be string!" })
            .max(200, { message: "Address can not exceed 200 characters!" })
        .optional(),
    role: z.enum(Object.values(Role) as [string]),
    isActive: z.enum(Object.values(isActive) as [string]),
    isDeleted: z.boolean({ invalid_type_error: "isDeleted must be true or false" }).optional(),
    isVerified: z.boolean({ invalid_type_error: "isVerified must be true or false" }).optional(),
})