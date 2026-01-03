"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const loadEnvVariables = () => {
    const requiresVariables = ["PORT", "MONGO_URI", "NODE_ENV", "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_EXPIRESIN", "JWT_ACCESS_TOKEN", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_REFRESH_TOKEN", "JWT_REFRESH_EXPIRESIN", "STRIPE_SECRET_KEY"];
    requiresVariables.forEach((key) => {
        if (!process.env[key])
            throw new Error(`Missing Required Environment Variable ${key}`);
    });
    return {
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN,
        JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
        JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
    };
};
dotenv_1.default.config();
exports.envVars = loadEnvVariables();
