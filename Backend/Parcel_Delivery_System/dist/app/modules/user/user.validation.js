"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUSerZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUSerZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Name must be string..." })
        .min(2, { message: "Name must be atleast two character long!" })
        .max(50, { message: "Name can't be more than 50 character...!" }),
    email: zod_1.default.string({ invalid_type_error: "email must be string!" })
        .email({ message: "invalid email address format" }),
    password: zod_1.default.string()
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
    phone: zod_1.default.string()
        .regex(/^(?:\+880|880|0)1[0-9]{9}$/, { message: "Phone number must be a valid Bangladeshi number (e.g., 01xxxxxxxxx or +8801xxxxxxxxx)", })
        .optional(),
    address: zod_1.default.string({ invalid_type_error: "Address must be string!" })
        .max(200, { message: "Address can not exceed 200 characters!" })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Name must be string..." })
        .min(2, { message: "Name must be atleast two character long!" })
        .max(50, { message: "Name can't be more than 50 character...!" }).optional(),
    password: zod_1.default.string()
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
    phone: zod_1.default.string()
        .regex(/^(?:\+880|880|0)1[0-9]{9}$/, { message: "Phone number must be a valid Bangladeshi number (e.g., 01xxxxxxxxx or +8801xxxxxxxxx)", })
        .optional(),
    address: zod_1.default.string({ invalid_type_error: "Address must be string!" })
        .max(200, { message: "Address can not exceed 200 characters!" })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)),
    isActive: zod_1.default.enum(Object.values(user_interface_1.isActive)),
    isDeleted: zod_1.default.boolean({ invalid_type_error: "isDeleted must be true or false" }).optional(),
    isVerified: zod_1.default.boolean({ invalid_type_error: "isVerified must be true or false" }).optional(),
});
