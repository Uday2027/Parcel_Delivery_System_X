import dotenv from "dotenv"

interface envConfig{
    PORT: string,
    MONGO_URI: string,
    NODE_ENV: "development" | "production"
    BCRYPT_SALT_ROUND : string
    JWT_ACCESS_EXPIRESIN : string
    JWT_ACCESS_TOKEN: string
    JWT_REFRESH_TOKEN: string
    JWT_REFRESH_EXPIRESIN: string
    SUPER_ADMIN_EMAIL: string
    SUPER_ADMIN_PASSWORD: string
    STRIPE_SECRET_KEY: string
    
}

const loadEnvVariables = ():envConfig => {
    const requiresVariables: string[] = ["PORT", "MONGO_URI", "NODE_ENV", "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_EXPIRESIN", "JWT_ACCESS_TOKEN", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_REFRESH_TOKEN","JWT_REFRESH_EXPIRESIN", "STRIPE_SECRET_KEY"];
    
    requiresVariables.forEach((key) => {
        if (!process.env[key])
            throw new Error(`Missing Required Environment Variable ${key}`)
    })

    return {
        PORT: process.env.PORT as string,
        MONGO_URI: process.env.MONGO_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN as string,
        JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN as string,
        JWT_REFRESH_EXPIRESIN :  process.env.JWT_REFRESH_EXPIRESIN as string,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string
    }
}

dotenv.config();
export const envVars = loadEnvVariables();
